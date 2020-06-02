const express = require('express');

const userData = require('./users');

const router = express.Router();

router.get('/', (req, res, next) => {
    const usernames = userData.usernames;
    res.render('home', {pageTitle: 'List of Users', users: usernames,  path: '/'});
});

module.exports = router;