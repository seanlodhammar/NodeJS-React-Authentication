const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const mongoose = require('mongoose');

passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const profilePhoto = [];
        const userCheck = await User.find({ email: profile.emails[0].value });
        if(userCheck.length > 0) {
            if(!userCheck[0].userId.facebook) {
                try {
                    if(!profile.photos[0].value) {
                        profilePhoto.push('none');
                    } else {
                        profilePhoto.push(profile.photos[0].value)
                    }
                    const newUserIdObj = { ...userCheck[0].userId, facebook: profile.id };
                    const newUserPhotoObj = { ...userCheck[0].profilePictures, facebook: profilePhoto[0] }

                    userCheck[0].userId = newUserIdObj;
                    userCheck[0].profilePictures = newUserPhotoObj;
                    userCheck[0].providers.push('facebook');
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
        const newUser = new User({ email: profile.emails[0].value, providers: ['facebook'], userId: {facebook: profile.id}, _id: new mongoose.Types.ObjectId(), profilePictures: {facebook: profilePhoto[0]} })
        await newUser.save();
        console.log(profile);
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