const router = require('express').Router(),
  config = require('../config'),
  User = require('../models/User'),
  queryString = require('querystring'),
  passport = require('passport')

function mailUser(user, subject, body){
  console.log(user, subject, body)
}

router.get('/login', function (req, res) {
  res.render('login')
})

router.get('/login/:token', function (req, res) {
  console.log(req.params)
  User.findOne({'loginToken.token': req.params.token, 'loginToken.expiration': {$gt: Date.now()}}).exec()
  .then( user => {
      if (!user) return res.redirect("/auth/login")

      user.loginToken = { token: null, expiration: null }
      user.save().then( saved => {
        req.logIn(saved, err => {
          res.redirect('/admin')
        })
      })
    }).catch( err => res.send({err}) )
})

router.post('/login', function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    return res.send(errors)
  }
  console.log('finding user', req.body)

  User.findOne({email: req.body.email})
    .then( user => {
      user.generateLoginToken( (err, token) => {
        let login = `http://${process.env.VIRTUAL_HOST}/auth/login/${token}`

        mailUser(user, "Login Email", `Hi, please click on this link to login. <br/> <br/> <a href="${login}">Login</a>`)
        res.redirect(`/auth/login/${token}`)
        //res.send(`Your login email has been sent to ${user.email}. Please check your email to login.  Test::${login}`)
      })
    })

  /*passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/auth/login');
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);*/
})

/*router.get('/register', function (req, res) {
  res.render('register', {
    query: req.query
  })
})*/

router.get('/logout', function (req, res) {
  req.logout()

  res.redirect('/')
})

/*router.post('/register', function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 6 characters long').len(6);

  const errors = req.validationErrors();
  const body = req.body

  if (errors) {
    req.flash('errors', errors);
    delete body.password

    return res.redirect('/auth/register?' + queryString.stringify(body));
  }

  const user = new User({
    email: body.email,
    password: body.password,
    profile: {
      name: body.first_name + ' ' + body.last_name
    }
  })

  User.findOne({ email: body.email }).exec()
    .then((existingUser) => {
      if (existingUser) {

        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/auth/register')
      }

      return user.save()
    })
    .then( registeredUser => req.logIn(registeredUser, (err) => {
      if (err) return next(err)
      res.redirect('/')
    }))
    .catch((err) => {
      if (err) return next(err)
    })
})*/

router.get('/o/:provider', function (req, res, next) {
  const provider = req.params.provider
  if (config.social.hasOwnProperty(provider)) {
    return passport.authenticate(provider)(req, res, next)
  } else {
    res.redirect('/');
  }
})

router.get('/o/:provider/callback', function (req, res, next) {
  const provider = req.params.provider

  if (config.social.hasOwnProperty(provider)) {
    return passport.authenticate(provider, { failureRedirect: '/auth/login' })(req, res, next);
  } else {
    res.redirect('/');
  }
}, function (req, res) {

  res.redirect(req.session.returnTo || '/')
})

module.exports = router
