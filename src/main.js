import Vue from 'vue'
import App from './App.vue'
import jQuery from 'jQuery'
global.jQuery = jQuery
global.$ = jQuery
let Bootstrap = require('bootstrap')
require('../node_modules/bootstrap/scss/bootstrap.scss')

new Vue({
    el: '#app',
    render: h => h(App)
})