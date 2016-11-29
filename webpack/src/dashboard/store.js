console.log('server store', window.user)
module.exports = {
  state: {
    currentUser: window._store.user,
    flash: window._store.flash
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