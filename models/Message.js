const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.ObjectId, ref: 'User' },

  start: { type: Date },

  content: {
    text: String,
    image_url: String
  },

  networks: [ {
    _id: false,
    network: String,
    status: {type: String, enum: ['pending', 'scheduled', 'sent'], default: 'pending'}
  } ],

  amplified: [ {
    _id: false,
    _user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    networks: [ { _id: false, network: String, status: {type: String, enum: ['pending', 'sent'], default: 'pending'} } ]
  } ],

  scheduled: [],

  status: { type: String, enum: ['pending', 'scheduled', 'sent'], default: 'pending' },

  created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('message', messageSchema)
