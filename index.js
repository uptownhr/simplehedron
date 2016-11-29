'use strict'

const app = require('./bootstrap'),
  controllers = require('./controllers'),
  models = require('./models'),
  passport = require('./config/passport')

app.use(function(req,res, next){
  console.log('wtf')
  next()
})

app.use('/', controllers.Home)
app.use('/blog', controllers.Post)
app.use('/auth', controllers.Auth)
app.use('/user', passport.isAuthenticated, controllers.User)
app.use('/admin', passport.isAuthenticated, passport.isPaid, controllers.Admin)
app.use('/dashboard', passport.isAuthenticated, passport.isPaid, controllers.Dashboard)

app.use(function(err, req, res, next){
  console.error('some error', err)
})

module.exports = app
