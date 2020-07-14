import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import ElementUI from 'element-ui'
import './styles.scss'
import router from './router'
import db from './plugins/db'

Vue.use(ElementUI)
Vue.use(db)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
