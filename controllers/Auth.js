const router = require('express').Router(),
  config = require('../config'),
  { User, Company } = require('../models'),
  queryString = require('querystring'),
  passport = require('passport'),
  {mailUser} = require('../app/util')

router.get('/login', function (req, res) {
  res.render('login')
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

      if (!user) return res.redirect('/auth/login')

      user.generateLoginToken( (err, token) => {
        let login = `http://${process.env.VIRTUAL_HOST}/auth/login/${token}`

        mailUser(user, "Login Email", `Hi, please click on this link to login. <br/> <br/> <a href="${login}">Login</a>`)
        //res.redirect(`/auth/login/${token}`)
        res.send(`Your login email has been sent to ${user.email}. Please check your email to login.`)
      })
    })
})

router.get('/login/:token', function (req, res) {
  User.findOne({'loginToken.token': req.params.token, 'loginToken.expiration': {$gt: Date.now()}}).exec()
    .then( user => {
      if (!user) return res.redirect("/auth/login")

      user.loginToken = { token: null, expiration: null }

      if (!user._activeCompany) user._activeCompany = user._companies[0]

      user.save().then( saved => {
        req.logIn(saved, err => {
          res.redirect('/dashboard')
        })
      })
    }).catch( err => res.send({err}) )
})

router.get('/join/:token', function (req, res) {
  const token = req.params.token

  const elemMatch = {
    $elemMatch: {
      token, status: 'sent'
    }
  }

  Company.findOne({ invitations: elemMatch })
    .then( company => {
      if (!company) return res.send('invalid join token')

      let invitation = company.invitations.find( inv => inv.token == token)

      if (invitation.status == 'accepted') return res.send('Invitation has already been accepted. Please login using your email address')

      console.log('saving company')
      invitation.status = 'accepted'
      company.save()

      //create user and login
      let user = new User({
        email: invitation.email,
        profile: {
          name: invitation.name
        },
        gettingStarted: false,
        role: 'member',
        _companies: [company._id],
        _activeCompany: company._id
      })
      user.email = invitation.email
      user.profile.name = invitation.name
      user.gettingStarted = false
      user.role = 'member'

      user.save().then( user => {
        req.logIn(user, err => {
          res.redirect('/dashboard')
        })
      })
    })
})

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

  console.log('callback', provider)

  if (config.social.hasOwnProperty(provider)) {
    console.log('attempting to login', provider)

    return passport.authenticate(provider, { failureRedirect: '/auth/login' })(req, res, next);
  } else {
    res.redirect('/');
  }
}, function (req, res) {
  console.log('hello', req.session.returnTo)
  res.redirect(req.session.returnTo || '/dashboard')
})

router.use(console.log)
router.use( function(err, req, res, next){
  console.error('auth controller error::', err)

  if (err == 'already used') return res.redirect('/dashboard?error=' + err)
  next()
})
module.exports = router
