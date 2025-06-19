<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { browser } from 'wxt/browser'

const title = ref('Loading…')

function handleMessage(message: any) {
  if (message.type === 'TAB_TITLE') {
    title.value = message.title
  }
}

onMounted(() => {
  browser.runtime.onMessage.addListener(handleMessage)

  // Initial request
  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab?.title) {
      title.value = tab.title
    }
  })
})

onUnmounted(() => {
  browser.runtime.onMessage.removeListener(handleMessage)
})
</script>

<template>
  <p v-if="title">{{ title }}</p>
  <p v-else class="text-gray-500 italic">Loading…</p>
</template>
