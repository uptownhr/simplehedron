require('./index.scss')

const Vue = require('vue'),
  modal = require('./components/modal.html'),
  signPip = require('./components/sign-pip.html'),
  slide = require('./components/slide.html'),
  slidePipPreview = require('./components/slide-pip-preview.html'),
  profile = require('./components/profile.html'),
  mainNav = require('./components/main-nav.html'),
  maya = require('./components/maya.html'),
  fileUpload = require('./components/file-upload.html'),
  addEmployeeModal = require('./components/add-employee-modal.html'),
  userList = require('./components/user-list.html')

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

Vue.component('file-upload', {
  template: fileUpload,
  props: {
    handle_upload:{
      required: true
    }
  },
  ready: function(){
    console.log(this.files)
  },
  methods: {
    handle_click: function(){
      console.log('handle clcick file upload')
      filepicker.pickMultiple(
        {
          services: ['CLOUDDRIVE','COMPUTER','DROPBOX','GOOGLE_DRIVE','EVERNOTE','GMAIL','FTP','CLOUDAPP'],
          customCss: '//bambeecom.docker/assets/filestack.css'
        },
        function(Blobs){
          this.handle_upload(Blobs)
        }.bind(this),
        function(err){
          console.log('upload error', err)
        }
      );
    }
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