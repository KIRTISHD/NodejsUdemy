const express = require('express');

const router = express.Router();

const usernames = [];

router.get('/add-users', (req, res, next) => {
    res.render('add-users', { pageTitle: 'Add Users', path: 'add-users' })
});

router.post('/add-users', (req, res, next) => {
    usernames.push({ title: req.body.uname });
    res.redirect('/');
});

exports.router = router;
exports.usernames = usernames;