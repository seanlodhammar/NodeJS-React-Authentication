const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuth = (req, res, next) => {
    if(!req.header('authorization')) {
        if(!req.session.passport && !req.session.userSecret) {
            res.json({
                message: 'User is not authenticated',
                method: 'passport',
            })
            return;
        }
        req.session.userSecret = undefined;
        req.session.userToken = undefined;
        if(req.session.passport) {
            return next();
        }
        res.json({
            message: 'User is not authenticated',
        })
        return;
    }
    const token = req.header('authorization').split(' ')[1];
    if(!req.session.userSecret) {
        res.json({
            message: 'User is not authenticated',
        })
        return false;
    }

    try {
        jwt.verify(token, req.session.userSecret);
        next();
    } catch (e) {
        req.session.userSecret = undefined;
        req.session.userToken = undefined;
        res.json({
            message: 'Token invalid.'
        })
        return false;
    }
}

exports.isNotAuth = (req, res, next) => {
    if(req.session.passport) {
        res.json({
            message: 'User is already authenticated',
        })
        return false;
    }
    if(req.session.userSecret && req.header('authorization')) {
        try {
            jwt.verify(req.header('authorization').split(' ')[1], req.session.userSecret);
            res.json({
                message: 'User is already authenticated',
            })
            return false;
        } catch(e) {
            console.log(e);
            req.session.userSecret = undefined;
            req.session.userToken = undefined;
            next();
        }

        return false;
    }
    if(req.session.userSecret && !req.header('authorization')) {
        try {
            jwt.verify(req.session.userToken, req.session.userSecret)
            res.json({
                message: 'You are authenticated'
            })
        } catch (e) {
            req.session.userSecret = undefined;
            req.session.userToken = undefined;
            next();
        }
        return;
    }
    next();
}
