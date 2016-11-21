require('./index.scss')

const Vue = require('vue')

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