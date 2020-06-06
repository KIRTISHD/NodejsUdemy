const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const { validationResult } = require('express-validator/check');

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
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //422 - validation failed error code
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        //req.flash('error', 'Invalid Email or password');
        //return res.redirect('/login');
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid Email or Password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt.compare(password, user.password).then(doMatch => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save(() => { res.redirect('/') });
        }
        //req.flash('error', 'Invalid Email or password');
        //res.redirect('/login');
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid Email or Password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors : []
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //422 - validation failed error code
    return res.status(422).render(
      'auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email, 
        password: password, 
        confirmPassword: req.body.confirmPassword
      },
      validationErrors : errors.array()
    });
  }

  bcrypt.hash(password, 12).
    then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    /*.then(result => {
      /*const msg = {
        to: 'test@example.com',
        from: 'test@example.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      return sgMail.send(msg);*/

      /*return transporter.sendMail({
        to: email,
        from: 'aniket.dhande@gmail.com',
        subject: ' Signup Completed for my Node Shop',
        html: '<h1> Congrats!! You have won ₹1000000 </h1>'
      });
    })*/
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.user.email }).then(user => {
      if (!user) {
        req.flash('error', 'No account with that email found');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      // 1 hour
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    }).then(result => {
      res.redirect('/');
      /*return transporter.sendMail({
            to: email,
            from: 'aniket.dhande@gmail.com',
            subject: ' Password Reset',
            html: `
              <p> You requested a password reset </p>
              <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password </p>
            `
          });*/
    }).catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};