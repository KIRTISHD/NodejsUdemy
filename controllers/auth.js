const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5ed930c178edc314b47bcfda')
      .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        //when session is created
        req.session.save(() => {res.redirect('/')});
        //res.redirect('/');
      })
      .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/')
  });
};