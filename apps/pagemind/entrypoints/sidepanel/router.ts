import ChatAssistantPro from '@/components/ChatAssistantPro.vue'
import Home from '@/components/Home.vue'
import KnowledgeCards from '@/components/KnowledgeCards.vue'
import Settings from '@/components/Settings.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/chat', component: ChatAssistantPro },
  { path: '/cards', component: KnowledgeCards },
  { path: '/settings', component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
