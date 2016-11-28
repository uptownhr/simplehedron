require('./index.scss')

const Vue = require('vue'),
  Vuex = require('vuex'),
  VueRouter = require('vue-router'),
  routes = require('./routes'),
  stores = require('./store')

Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({ routes })
const store = new Vuex.Store(stores)

const app = new Vue({
  store,
  router,
  mounted: function(){
    if (!window.user.started) router.push('/getting-started')

  }
}).$mount('#app')