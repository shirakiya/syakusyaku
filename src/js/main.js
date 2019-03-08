import Vue from 'vue'
import App from './app.vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/src/stylus/main.styl'

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
}

Vue.use(Vuetify, {
  theme: {
    primary: colors.indigo,
    secondary: colors.pink.lighten2,
  },
})

new Vue({
  el: '#app',
  components: { App },
  template: '<App />',
})
