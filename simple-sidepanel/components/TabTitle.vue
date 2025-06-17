<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { browser } from 'wxt/browser'

const title = ref<string | null>(null)
    async function updateTitle() {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
    if (tab?.title) {
      title.value = tab.title
    } else {
      title.value = 'Title not accessible on this site'
    }
  } catch (e) {
    title.value = 'Failed to read tab title'
    console.error('Tab access error:', e)
  }
}

onMounted(() => {
  updateTitle()

  // Listen for tab switching or title change
  browser.tabs.onActivated.addListener(updateTitle)
  browser.tabs.onUpdated.addListener(updateTitle)
})

onUnmounted(() => {
  // Clean up listeners when component unmounts (good practice)
  browser.tabs.onActivated.removeListener(updateTitle)
  browser.tabs.onUpdated.removeListener(updateTitle)
})
</script>

<template>
  <p v-if="title">{{ title }}</p>
  <p v-else class="text-gray-500 italic">Loading…</p>
</template>