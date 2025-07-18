<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToAsyncTest() {
  router.push('/async-test')
}
</script>

<template>
  <UPageHero
    title="Pagemind"
    description="PageMind is a Chrome browser extension built with WXT and styled using Nuxt UI. It enables users to generate AI-powered summaries of the current webpage, convert them into structured Knowledge Cards, and store them locally using IndexedDB. The extension supports switching between multiple language models (e.g., GPT-4, Claude, Gemini), and allows one-click sharing to Twitter."
    headline="New release"
  />

  <!-- ✅ Add a button below the hero -->
  <div class="mt-4 flex justify-center">
    <UButton @click="goToAsyncTest" icon="i-heroicons-arrow-right">
      Test AsyncData
    </UButton>
  </div>
</template>
