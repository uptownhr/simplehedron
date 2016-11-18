require('./index.scss')

const Vue = require('vue')

Vue.filter('capitalize', function (str) {
  if(str) return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})

})

Vue.filter('snake_to_human', function (str) {
  if(str) return str.replace(/_/g, ' ')

})

Vue.filter('date', function(date){
  //if(date) return moment(date).format('YYYY-MM-DD')
  if(date) return moment(date).local().format('MM-DD-YYYY')
})

Vue.transition('fade', {
  css: false,
  enter: function (el, done) {
    // element is already inserted into the DOM
    // call done when animation finishes.
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // same as enter
    $(el).animate({ opacity: 0 }, 1000, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})

$(window).on('scroll', function(){

  var top = $(window).scrollTop()

  if (top > 25 ) {
    $('.is-brand').addClass('has-scrolled')
  }else{
    $('.is-brand').removeClass('has-scrolled')
  }

  var prices_top = $('.fold .check-prices').offset().top

  if(top > prices_top){
    $('.nav .check-prices').addClass('scrolled')
  }else{
    $('.nav .check-prices').removeClass('scrolled')
  }
})

$(document).ready( () => {
  $('.check-prices').click( e => {

  })
})

window.Vue = Vue;