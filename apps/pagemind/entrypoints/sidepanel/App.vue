<script setup lang="ts">
import ChatAssistantPro from '@/components/ChatAssistantPro.vue'
import KnowledgeCards from '@/components/KnowledgeCards.vue'

const tabs = [
  { label: 'Chat', value: 'chat', icon: 'i-heroicons-chat-bubble-left-ellipsis' },
  { label: 'Knowledge Cards', value: 'cards', icon: 'i-heroicons-book-open' }
]
const activeTab = ref('chat')
</script>

<template>
  <div class="h-full flex flex-col">
    <UTabs v-model="activeTab" :items="tabs" class="border-b bg-background/80" size="lg" />

    <div class="flex-1 min-h-0">
      <KeepAlive>
        <ChatAssistantPro v-if="activeTab === 'chat'" />
        <KnowledgeCards v-else-if="activeTab === 'cards'" />
      </KeepAlive>
    </div>
  </div>
</template>
