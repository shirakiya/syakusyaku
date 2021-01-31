import Vue from 'vue'
import App from './app.vue'
import './plugins/vuetify'

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
}

new Vue({
  el: '#app',
  components: { App },
  template: '<App />',
})
