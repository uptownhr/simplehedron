const router = require('express').Router(),
  config = require('../config'),
  apiRouter = require('express').Router(),
  { Company } = require('../models')

apiRouter.post('/create-company', (req, res) => {
  req.assert('company_name', 'Company name must be at least 4 characters long').len(4);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send( { errors } )
  }


  let company_name = req.body.company_name

  const company = new Company()
  company.name = company_name
  company._owner = req.user._id
  company._employees.addToSet(req.user._id)

  company.save().then( company => {
    return company
  }).then( company => {
    req.user._companies.addToSet( company._id )
    return req.user.save()
  }).then( user => {
    res.send( company )
  }).catch( err => {
    console.log(err)
    return res.status(400).send({ errors: [{ msg: 'Company name is taken', param: 'company_name', value: company_name }] })
  })
})

router.use('/api', apiRouter)


router.use( (req, res) => {
  res.render('dashboard/index.jade',{
    user: req.user
  })
})

module.exports = router