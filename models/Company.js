var mongoose = require('mongoose');

var invitationSchema = new mongoose.Schema({
  email: {type: String, required: true, trim: true},
  name: {type: String, trim: true, default: ''}
})

var companySchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, unique: true },

  invitations: [invitationSchema],

  _owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  _employees: [ { type: mongoose.Schema.ObjectId, ref: 'User' } ],

  created: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('company', companySchema)
