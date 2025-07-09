<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const tabs: TabsItem[] = [
  { label: 'Home', icon: 'i-heroicons-book-open', value: 'home', to: '/home' },
  { label: 'Cards', icon: 'i-heroicons-book-open', value: 'cards', to: '/cards' },
  { label: 'Chat', icon: 'i-heroicons-chat-bubble-left-ellipsis', value: 'chat', to: '/chat' },
  { label: 'Settings', icon: 'i-heroicons-book-open', value: 'settings', to: '/settings' },
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
    <UTabs v-model="selectedTab" :items="tabs" class="border-b"  :content="false">
    <template #default="{ item }">
        <span class="text-xs">{{ item.label }}</span>
      </template>
    </UTabs>
    <div class="flex-1 min-h-0 overflow-auto">
      <RouterView />
    </div>
  </div>
</template>
