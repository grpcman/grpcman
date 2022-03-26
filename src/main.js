import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import './plugins/element.js'

Vue.use(ElementUI)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App)
})
