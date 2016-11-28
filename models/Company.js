const mongoose = require('mongoose'),
  crypto = require('crypto')

function random(){
  return crypto.randomBytes(16).toString('hex')
}

const invitationSchema = new mongoose.Schema({
  email: {type: String, required: true, trim: true},
  name: {type: String, trim: true, default: ''},
  token: {type: String, default: random },
  status: {type: String, enumerable: ['pending', 'sent', 'accepted'], default: 'pending'}
})

const companySchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, unique: true },

  invitations: [invitationSchema],

  _owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  _employees: [ { type: mongoose.Schema.ObjectId, ref: 'User' } ],

  created: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('company', companySchema)
