const router = require('express').Router()
const async = require('async'),
  config = require('../config'),
  { User } = require('../models')

const stripe = require('stripe')(config.payment.stripe.secret_key);

router.get('/', function (req, res) {
  res.render('index', {config});
})

router.post('/register/:plan', function (req, res) {
  //return res.send( { body: req.body, params: req.params, date: Date.now() } )

  const stripeToken = req.body.stripeToken

  async.waterfall([
    function (next) {
      var customer = stripe.customers.create({
        plan: req.params.plan,
        source: stripeToken,
        email: req.body.stripeEmail
      }, next);
    }, function (customer, next) {
      let user = new User({
        email: req.body.stripeEmail,
        password: Date.now(),
        plan: {
          name: req.params.plan,
          customer_id: customer.id
        }
      })

      user.save().then( saved => {
        req.logIn(saved, err => {
          res.redirect('/dashboard')
        })
      })
    }
  ], function (err, result) {

    if (err) return res.send(err)

    res.send(customer)
  });
})

router.post('/charge', function (req, res) {
  var stripeToken = req.body.stripeToken;

  async.waterfall([
    function (callback) {
      Product.findOne({ _id: req.body.id }, function (err, product) {
        callback(null, product);
      });
    },

    function (product, callback) {
      var charge = stripe.charges.create({
        amount: product.price * 100, //cents
        description: product.name,
        currency: 'usd',
        source: stripeToken
      }, function (err, charge) {
        callback(err, charge);
      });
    }
  ], function (err, charge) {
    if (err && err.type === 'StripeCardError') {
      req.flash('error', { msg: 'Error: Card has been declined.' });
    } else if (err) {
      req.flash('error', { msg: 'Error: Payment did not go through.' });
    } else {
      req.flash('success', { msg: 'Success: Payment has been accepted.' });
    }

    res.redirect('/');
  });
})

module.exports = router
