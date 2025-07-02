<script setup lang="ts">
import ChatAssistant from '@/components/ChatAssistant.vue'
import KnowledgeCards from '@/components/KnowledgeCards.vue';
</script>

<template>
  <div class="p-4 space-y-4">
    <UCard>
      <h1 class="text-xl font-bold">PageMind</h1>
      <p class="text-default">Your AI-powered Job Searcher.</p>
    </UCard>
    <UCard>
    <ChatAssistant />
    </UCard>
     <UCard>
    <KnowledgeCards />
    </UCard>

  </div>
</template>
