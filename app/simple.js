const { Message, User } = require('../models')

const Simple = {
  message: {
    create: function(user, content){
      let message = new Message({
        content,
        _user: user._id
      })

      return message
    },
    add_amplified_user: function(message, user, networks){
      message.amplified.addToSet({
        _user: user._id,
        networks: networks
      })

      return message
    }
  }
}

let user = new User({
  email: 'jlee@penguin.ws',
  password: '12341234'
})


let message = Simple.message.create(user, {text:'testing'})

console.log(message)

let user2 = new User({
  email: 'james@penguin.ws',
  password: '12341234'
})
let networks = [{
  network: 'twitter'
},{
  network: 'facebook'
}]
let amplified = Simple.message.add_amplified_user(message, user2, networks)

console.log(amplified, amplified.amplified[0])