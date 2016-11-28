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
    req.user._activeCompany = company._id
    return req.user.save()
  }).then( user => {
    res.send( company )
  }).catch( err => {
    console.log(err)
    return res.status(400).send({ errors: [{ msg: 'Company name is taken', param: 'company_name', value: company_name }] })
  })
})

apiRouter.post('/send-invitations', (req, res) => {

  const employees = req.body.employees

  Company.findOne( req.user._activeCompany ).then( company => {
    company.invitations = company.invitations.concat(employees)
    company.save().then( company => {
      res.send(company)
    })
  })
})

apiRouter.post('/complete-getting-started', (req,res) => {
  req.user.gettingStarted = false
  req.user.save().then( user => {
    res.send( user )
  })
})

router.use('/api', apiRouter)



router.get('/testing', (req,res) => {
  var graph = require('fbgraph'),
    provider = req.user.providers.find( p => p.name == 'facebook' )

  console.log('accesstoken', provider.accessToken)
  graph.setAccessToken(provider.accessToken)

  var wallPost = {
    message: "testing something"
  };

  graph.post("/feed", wallPost, function(err, r) {
    // returns the post id
    console.log(err, r); // { id: xxxxx}
    res.send({err, r})
  });


})


router.use( (req, res) => {
  console.log(config)

  req.user.populate('_activeCompany _companies', (err, user) => {
    res.render('dashboard/index.jade',{
      user
    })
  })
})

module.exports = router