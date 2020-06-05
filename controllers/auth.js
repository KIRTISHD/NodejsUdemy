const bcrypt = require('bcryptjs');
const nodemailer  = require('nodemailer');
const sgMail = require('@sendgrid/mail');
//const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/* transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRIDKEY
  }
}));*/



exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Email or password');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password).then(doMatch => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save(() => { res.redirect('/') });
        }
        req.flash('error', 'Invalid Email or password');
        res.redirect('/login');
      }).catch(err => {
        res.redirect('/login');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/')
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already Exists');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12).
        then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        }).then(result => {
          const msg = {
            to: 'test@example.com',
            from: 'test@example.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          };
          return sgMail.send(msg);
          
          /*return transporter.sendMail({
            to: email,
            from: 'aniket.dhande@gmail.com',
            subject: ' Signup Completed for my Node Shop',
            html: '<h1> Congrats!! You have won ₹1000000 </h1>'
          });*/
        }).then(result => {
          res.redirect('/');
        })
        .catch(err => console.log(err));
    }).catch(err => console.log(err));
};