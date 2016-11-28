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

      if (this.$store.state.current_user._companies.length != 0) this.step = 1

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
      }
    }
  }
}