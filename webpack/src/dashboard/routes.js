const { home, gettingStarted } = require('./containers')

module.exports = [
  { path: '/', component: home },
  { path: '/getting-started', component: gettingStarted }
]