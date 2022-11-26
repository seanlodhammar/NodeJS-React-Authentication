const router = require('express').Router();
const authController = require('../controllers/auth');
const { body } = require('express-validator');
const User = require('../models/User');
const AuthStatus = require('../middleware/isAuth');
const passport = require('passport');

router.post('/signup', body('email').isEmail().normalizeEmail().trim().withMessage('Email Invalid'), body('password').isLength({ min: 5 }).trim().withMessage('Password must have 5 characters or more'), AuthStatus.isNotAuth, authController.signup);

router.post('/login', body('email').isEmail().normalizeEmail().trim().withMessage('Email Invalid'), body('password').isLength({ min: 5 }).trim().withMessage('Password Invalid'), AuthStatus.isNotAuth, authController.login);

router.post('/logout', AuthStatus.isAuth, authController.logout)

router.get('/user', AuthStatus.isAuth, authController.getUser);

router.get('/google', AuthStatus.isNotAuth, passport.authenticate('google', { successRedirect: 'http://localhost:5000/auth/google/callback', failureMessage: 'Authentication failed.', scope: ['profile', 'email'], failureRedirect: 'http://localhost:3000/login'  }));

router.get('/google/callback', AuthStatus.isNotAuth, passport.authenticate('google', { failureMessage: 'Authentication failed.', failureRedirect: 'http://localhost:3000/login' }), (req, res, next) => {
    req.session.currentProvider = 'Google';
    res.redirect('http://localhost:3000');
})

router.get('/facebook', AuthStatus.isNotAuth, passport.authenticate('facebook', { successRedirect: 'http://localhost:5000/auth/facebook/callback', failureMessage: 'Authentication failed.', scope: ['email', 'public_profile'], failureRedirect: 'http://localhost:3000/login' }));

router.get('/facebook/callback', AuthStatus.isNotAuth, passport.authenticate('facebook', { failureMessage: 'Authentication failed.', failureRedirect: 'http://localhost:3000/login'}), (req, res, next) => {
    req.session.currentProvider = 'Facebook';
    res.redirect('http://localhost:3000');
})

router.get('/github', AuthStatus.isNotAuth, passport.authenticate('github', { successRedirect: 'http://localhost:5000/auth/github/callback', failureMessage: 'Authentication failed.', failureRedirect: 'http://localhost:3000/login' }))

router.get('/github/callback', AuthStatus.isNotAuth, passport.authenticate('github', { failureMessage: 'Authentication failed.', failureRedirect: 'http://localhost:3000/login' }), (req, res, next) => {
    req.session.currentProvider = 'Github';
    res.redirect('http://localhost:3000');
})

router.get('/passport/user', AuthStatus.isAuth, authController.passportUser)

router.post('/passport/logout', AuthStatus.isAuth, authController.passportLogout);

module.exports = router;