import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connections',
    name: 'Connections',
    // route level code-splitting
    // this generates a separate chunk (Connections.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Connections" */ '../views/Connections.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
