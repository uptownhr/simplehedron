const { Message, User } = require('../models'),
  Sender = require('./sender')

const Simple = {
  message: {
    create: function(user, start, content, networks){
      let message = new Message({
        start,
        content,
        _user: user._id,
        networks: networks
      })

      return message
    },
    add_amplified_user: function(message, user, networks){
      message.amplified.addToSet({
        _user: user._id,
        networks: networks
      })

      return message
    },
    schedule: function(message) {
      //schedule primary
      let primary_networks = schedule_networks(message._user, message, message.networks, true)

      //schedule amplified
      let amplified_networks = message.amplified.map( amp => {
        return schedule_networks(amp._user, message, amp.networks)
      })

      message.scheduled = [].concat.apply([], primary_networks.concat(amplified_networks))

      return message
    },
    send: function(message){
      let sender = new Sender(message)
      return sender.start()
    }
  }
}

function schedule_networks (_user, message, networks, primary = false) {
  return networks.map( n => ({
    _user,
    primary,
    message_id: message.id,
    content: message.content,
    network: n.network,
    start: message.start,
    status: 'scheduled'
  }) )
}

module.exports = Simple