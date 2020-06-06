const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please Enter a valid Email')
            .normalizeEmail(),
        body('password', 'Please enter a valid password.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(
                                'Email already exists'
                            );
                        }
                    });
            })
            .normalizeEmail(),
        body('password', 'Please enter a password with only numbers and text and atleast 5 characters.').isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match!!');
            }
            return true;
        })
    ], authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;