const gettingStartedTemplate = require('./getting-started.html')

module.exports = {
  home: {
    template: '<h1>Home</h1>'
  },
  gettingStarted: {
    data: function(){
      return {
        step: 2,
        company_name: '',
        workers: ['']
      }
    },
    template: gettingStartedTemplate,
    methods: {
      handle_next: function(){
        this.step++
      },
      handle_add_worker: function(){
        this.workers.push('')
      }
    }
  }
}