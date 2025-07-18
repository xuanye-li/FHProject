import pluginRoutes from 'virtual:routes'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  ...pluginRoutes,
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
