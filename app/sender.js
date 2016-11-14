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

module.exports = Sender