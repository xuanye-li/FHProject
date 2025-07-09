import ChatAssistantPro from '@/components/ChatAssistantPro.vue'
import KnowledgeCards from '@/components/KnowledgeCards.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/cards' },
  { path: '/chat', component: ChatAssistantPro },
  { path: '/cards', component: KnowledgeCards },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
