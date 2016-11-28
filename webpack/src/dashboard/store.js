console.log('server store', window.user)
module.exports = {
  state: {
    currentUser: window.user
  },
  mutations: {
    completeGettingStarted (state) {
      state.currentUser.gettingStarted = false
    }
  },
  actions: {
    completeGettingStarted (context) {
      context.commit('completeGettingStarted')
      return $.post('/dashboard/api/complete-getting-started')
    }
  }
}