require('./index.scss')

const Vue = require('vue'),
  Vuex = require('vuex'),
  VueRouter = require('vue-router'),
  routes = require('./routes'),
  stores = require('./store')

Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store(stores)

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/dashboard'
})

router.beforeEach(function(to, from, next){
  if (store.state.currentUser.gettingStarted && to.path != '/getting-started'){
    console.log('guarded')
    return next('/getting-started')
  }

  next()
})


const app = new Vue({
  store,
  router,
  mounted: function(){

  }
}).$mount('#app')