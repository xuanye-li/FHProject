<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const tabs: TabsItem[] = [
  { label: 'Chat', icon: 'i-heroicons-chat-bubble-left-ellipsis', value: 'chat', to: '/chat' },
  { label: 'Knowledge Cards', icon: 'i-heroicons-book-open', value: 'cards', to: '/cards' }
]

const route = useRoute()
const router = useRouter()

const selectedTab = computed({
  get() {
    const match = tabs.find(tab => route.path.startsWith(tab.to))
    return match ? match.value : tabs[0].value
  },
  set(value) {
    const tab = tabs.find(t => t.value === value)
    if (tab) {
      router.push(tab.to)
    }
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <UTabs v-model="selectedTab" :items="tabs" size="lg" class="border-b" :content="false" />
    <div class="flex-1 min-h-0 overflow-auto">
      <RouterView />
    </div>
  </div>
</template>
