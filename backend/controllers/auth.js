const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ObjectId = require('mongoose').Types.ObjectId;

exports.signup = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if(errors.errors.length >= 1) { 
            res.status(200).json({
                errors: errors.errors
            })
            return;
        }

        const defaultPfp = `http://localhost:5000/uploads/defaultpfp.jpg`;
        const checkUser = await User.find({ email: email });

        if(checkUser.length > 0) {
            if(!checkUser[0].providers.includes('custom')) {
                checkUser[0].providers.push('custom');
            }
            if(!checkUser[0].userId.custom) {
                checkUser[0].userId = { ...checkUser[0].userId, custom: ObjectId(checkUser[0]._id).toString() }
            }
            if(!checkUser[0].profilePictures.custom) {
                checkUser[0].profilePictures = {...checkUser[0].profilePictures, custom: defaultPfp};
            }
            if(!checkUser[0].password) {
                bcrypt.hash(password, 12, async(err, hash) => {
                    if(err) {
                        return;
                    }
                    checkUser[0].password = hash;
                    await checkUser[0].save();
                    crypto.randomBytes(48, (err, buffer) => {
                        if(err) {
                            return;
                        }
                        const secretKey = buffer.toString('hex')
                        const user = { email: checkUser[0].email, user_id: checkUser[0]._id };
                        const token = jwt.sign(user, secretKey, { expiresIn: '12h' })
                        req.session.userSecret = secretKey;
                        req.session.userToken = token;
                        res.status(201).json({
                            userToken: token,
                        })
                    })
                });
            } else {
                res.json({
                    message: 'You already have an account'
                })
            }
            return;
        }
        bcrypt.hash(password, 12, async(err, hash) => {
            if(err) {
                return;
            }
            const userId = new ObjectId();
            const newUser = new User({ email: email, password: hash, _id: userId, providers: ['custom'], userId: { custom: ObjectId(userId).toString() }, profilePictures: { custom: defaultPfp }  });
            try {
                const data = await newUser.save();
                crypto.randomBytes(48, (err, buffer) => {
                    if(err) {
                        return;
                    }
                    const secretKey = buffer.toString('hex')
                    const user = { email: data.email, user_id: data._id };
                    const token = jwt.sign(user, secretKey, { expiresIn: '24h' })
                    req.session.userToken = token;
                    req.session.userSecret = secretKey;
                    res.status(201).json({
                        userToken: token,
                    })
                })
            } catch (e) {
                console.log(e);
            }
        })
    } catch(e) {
        console.log(e);
    }
}

exports.login = async(req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if(errors.errors.length >= 1) { 
        res.status(200).json({
            errors: errors.errors
        })
        return;
    }
    try {
        const data = await User.find({ email: email })
        if(data.length <= 0) {
            res.json({
                errors: [ {msg: 'Email Invalid', param: 'email' }, {msg: 'Password Invalid', param: 'password'} ]
            })
            return;
        }
        if(!data[0].email) {
            res.json({
                message: 'Email does not currently exist in database',
            })
            return;
        }
        if(data[0].email !== email) {
            res.json({
                message: 'Email does not currently exist in database',
            })
            return;
        }

        const comparePasswords = await bcrypt.compare(password, data[0].password);
        if(!comparePasswords) {
            res.json({
                errors:  [ {msg: 'Password does not match email', param: 'password' }],
            })
            return;
        }
        crypto.randomBytes(48, (err, buffer) => {
            if(err) {
                return;
            }
            const secretKey = buffer.toString('hex');
            const user = { user_id: data[0]._id, email: data[0].email };
            const token = jwt.sign(user, secretKey, {expiresIn: '12h'});
            req.session.userToken = token;
            req.session.userSecret = secretKey;
            res.status(200).json({
                userToken: token,
            })
        })
    } catch (e) {
        console.log(e);
        res.json({
            message: 'There was an error',
            error: e,
        })
    }
}

exports.logout = (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                console.log(err);
                res.json({
                    message: 'Logout unsuccessful',
                })
            }
        })
        res.json({
            message: 'Logout successful'
        })
    }
    catch (e) {
        console.log(e);
        res.json({
            message: 'Logout unsuccessful'
        })
    }
}

exports.getUser = async(req, res, next) => {
    try {
        const token = req.header('authorization').split(' ')[1];
        const user = jwt.verify(token, req.session.userSecret);;
        const data = await User.findById(user.user_id);
        if(!data) {
            req.session.userSecret = undefined;
            req.session.userToken = undefined;
        }
        const userObj = { _id: data._doc._id, email: data._doc.email, providers: data._doc.providers, userId: data._doc.userId, currentProvider: 'Custom', profilePictures: data._doc.profilePictures };
        res.status(200).json({
            ...userObj,
        })
    } catch (e) {
        console.log(e);
        res.json({
            message: 'There was an error',
        })
    }

}

exports.passportUser = (req, res, next) => {
    res.json({
        ...req.user,
        currentProvider: req.session.currentProvider,
    })
}

exports.passportLogout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
            res.json({
                message: 'Logout unsuccessful'
            })
            return;
        }
    })
    req.session.passport = null;
    res.json({
        message: 'Logout successful'
    })
}