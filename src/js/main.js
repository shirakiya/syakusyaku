import Vue from 'vue'
import App from './app.vue'
import vuetify from './plugins/vuetify'

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
}

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
