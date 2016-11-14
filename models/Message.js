const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.ObjectId, ref: 'User' },

  content: {
    text: String,
    image_url: String
  },

  networks: [ { _id: false, network: String, status: {type: String, enum: ['pending', 'sent'], default: 'pending'} } ],

  amplified: [ {
    _id: false,
    _user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    networks: [ { _id: false, network: String, status: {type: String, enum: ['pending', 'sent'], default: 'pending'} } ]
  } ],

  status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
  created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('message', messageSchema)
