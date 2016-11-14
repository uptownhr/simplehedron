const { Message, User } = require('../models')

let scheduled_messages = []

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

const Sender = function sender (message) {
  const senders = {
    'twitter': function(){
      console.log('sending twitter')
    },
    'facebook': function(){
      console.log('sending facebook')
    },
    'linkedin': function(){
      console.log('sending linkedin')
    }
  }


  this.start = () => {
    return this.send_primary().then(this.send_amplified)
  }

  this.send_primary = (count = 0) => {
    console.log('sending primary')
    return new Promise( (resolve,reject) => {
      let messages = message.scheduled.filter( m => m.primary )

      messages.forEach( this.send )


      resolve( count + messages.length )
      console.log('primary sent', messages.length)
    }).catch(console.log)
  }

  this.send_amplified = (count = 0) => {
    console.log('sending amplified')

    return new Promise( (resolve, reject) => {
      let messages = message.scheduled.filter( m => !m.primary )

      messages.forEach( m => {
        senders[m.network](m)
      })

      resolve( count + messages.length )
      console.log('amplified sent', messages.length)
    }).catch(console.error)
  }

  this.send = (message) => {
    senders[message.network](message)
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


let user = new User({
  email: 'jlee@penguin.ws',
  password: '12341234'
})

let networks = [{
  network: 'twitter'
},{
  network: 'facebook'
}, {
  network: 'linkedin'
}]

let message = Simple.message.create(user, Date.now(), {text:'testing'}, networks)

console.log('message created', message)

let user2 = new User({
  email: 'james@penguin.ws',
  password: '12341234'
})

let user3 = new User({
  email: 'jake@penguin.ws',
  password: '12341234'
})

Simple.message.add_amplified_user(message, user2, networks)
Simple.message.add_amplified_user(message, user3, networks)

console.log('amplified added', message)

console.log('scheduled messages', Simple.message.schedule(message) )
console.log('wtf')
Simple.message.send(message).then( (count) => {
  console.log('sent', count)
} )
