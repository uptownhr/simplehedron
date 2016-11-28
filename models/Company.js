var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, unique: true },
  created: { type: Date, default: Date.now() },

  _owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  _employees: [ { type: mongoose.Schema.ObjectId, ref: 'User' } ]
})

module.exports = mongoose.model('company', companySchema)
