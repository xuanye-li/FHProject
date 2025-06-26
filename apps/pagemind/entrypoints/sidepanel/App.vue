<script setup lang="ts">
import LLMSummary from '@/components/LLMSummary.vue'
</script>

<template>
  <div class="p-4 space-y-4">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">PageMind</h1>
      </template>
      <p class="text-default">Your AI-powered summarizer.</p>
    </UCard>
    <LLMSummary />
  </div>
</template>
