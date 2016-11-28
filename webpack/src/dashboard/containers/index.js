const gettingStartedTemplate = require('./getting-started.html')

module.exports = {
  home: {
    template: '<h1>Home</h1>'
  },
  gettingStarted: {
    template: gettingStartedTemplate,
    data: function(){
      return {
        step: 0,
        company_name: '',
        workers: [{
          email: '',
          name: ''
        }],
        errors: []
      }
    },
    mounted () {
      console.log('mounted', this.$store.state)

      if (this.$store.state.currentUser.providers.length != 0) return this.step = 2
      if (this.$store.state.currentUser._companies.length != 0) return this.step = 1


    },

    methods: {
      handle_next: function(){
        this.create_company().then( res => {
          if (res) {
            this.step++
            this.errors = []
          }
        })
      },
      handle_add_worker: function(){
        this.workers.push('')
      },
      create_company () {
        return $.post('/dashboard/api/create-company', { company_name: this.company_name }, 'json').fail( err => {
          this.errors = err.responseJSON.errors
        })
      },

      handle_send_invitations () {
        console.log('wtf')
        this.send_invitations()
          .then( this.complete_getting_started )
          .then( () => {
            this.$router.push('/')
          })
      },
      send_invitations () {
        return $.post('/dashboard/api/send-invitations', { employees: this.workers} )
      },
      complete_getting_started () {
        return this.$store.dispatch('completeGettingStarted')
      }
    }
  }
}