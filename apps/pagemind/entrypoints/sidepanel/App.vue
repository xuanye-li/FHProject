<script setup lang="ts">
import ChatAssistant from '@/components/ChatAssistant.vue'
</script>

<template>
  <div class="p-4 space-y-4">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">PageMind</h1>
      </template>
      <p class="text-default">Your AI-powered Job Searcher.</p>
    </UCard>
    <ChatAssistant />
  </div>
</template>
