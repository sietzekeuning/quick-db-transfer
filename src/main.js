import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import './styles.scss'
import router from './router'
import db from './plugins/db'

Vue.use(ElementUI, {locale})
Vue.use(db)

Vue.component('page', require('./Page').default)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
