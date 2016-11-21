const router = require('express').Router(),
  config = require('../config')


router.use( (req, res) => {
  res.render('dashboard/index.jade')
})

module.exports = router