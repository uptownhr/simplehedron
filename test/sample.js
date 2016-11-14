const { User } = require('../models'),
  Simple = require('../app/simple')

let user = new User({
  email: 'jlee@penguin.ws',
  password: '12341234'
})

let user2 = new User({
  email: 'james@penguin.ws',
  password: '12341234'
})

let user3 = new User({
  email: 'jake@penguin.ws',
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

Simple.message.add_amplified_user(message, user2, networks)
Simple.message.add_amplified_user(message, user3, networks)

console.log('amplified added', message)

console.log('scheduled messages', Simple.message.schedule(message) )
console.log('wtf')
Simple.message.send(message).then( (count) => {
  console.log('sent', count)
} )
