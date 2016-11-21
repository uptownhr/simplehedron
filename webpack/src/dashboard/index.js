require('./index.scss')

const Vue = require('vue'),
  VueRouter = require('vue-router'),
  routes = require('./routes')

Vue.use(VueRouter)

console.log(routes)

const router = new VueRouter({ routes })

const app = new Vue({
  router,
  mounted: function(){
    if (!window.user.started) router.push('/getting-started')

  }
}).$mount('#app')