const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const mongoose = require('mongoose');

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const profilePhoto = [];
        const userCheck = await User.find({ email: profile.emails[0].value });
        if(userCheck.length > 0) {
            if(!userCheck[0].userId.google) {
                try {
                    if(!profile.photos[0].value) {
                        profilePhoto.push('none');
                    } else {
                        profilePhoto.push(profile.photos[0].value)
                    }
                    const newUserIdObj = { ...userCheck[0].userId, google: profile.id };
                    const newUserPhotoObj = { ...userCheck[0].profilePictures, google: profilePhoto[0] }
                    userCheck[0].userId = newUserIdObj;
                    userCheck[0].profilePictures = newUserPhotoObj;
                    userCheck[0].providers.push('google');
                    await userCheck[0].save();
                } catch(e) {
                    console.log(e);
                }
            }
            if(userCheck[0].profilePictures.google !== profile.photos[0].value) {
                try {
                    if(!profile.photos[0].value) {
                        profilePhoto.push('none');
                        return;
                    }
                    console.log(profile.photos[0].value);
                    console.log(userCheck[0].profilePictures);
                    profilePhoto.push(profile.photos[0].value);
                    const newUserPhotoObj = { ...userCheck[0].profilePictures, google: profilePhoto[0] };
                    userCheck[0].profilePictures = newUserPhotoObj;
                    await userCheck[0].save();
                } catch(e) {
                    console.log(e);
                }
            }
            done(null, profile);
            return;
        }
        
        if(!profile.photos[0].value) {
            profilePhoto.push('none');
        } else {
            profilePhoto.push(profile.photos[0].value);
        }
        const newUser = new User({ email: profile.emails[0].value, providers: ['google'], userId: {google: profile.id}, _id: new mongoose.Types.ObjectId(), profilePictures: {google: profilePhoto[0]} })
        await newUser.save();
        done(null, profile);
    } catch (e) {
        console.log(e);
    }
}))

passport.serializeUser((profile, done) => {
    done(null, profile.emails[0].value);
})

passport.deserializeUser(async(email, done) => {
    const user = await User.find({ email: email  });
    const newUser = { email: user[0].email, profilePictures: user[0].profilePictures, providers: user[0].providers, userId: user[0].userId, _id: user[0]._id };
    done(null, newUser);
})