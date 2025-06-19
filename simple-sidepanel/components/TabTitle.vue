<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { browser } from 'wxt/browser'

const title = ref('loading')

function handleMessage(message: any) {
  if (message.type === 'title') {
    title.value = message.title
  }
}

onMounted(() => {
  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab?.title) {
      title.value = tab.title
    }
  })
  browser.runtime.onMessage.addListener(handleMessage)
})

onUnmounted(() => {
  browser.runtime.onMessage.removeListener(handleMessage)
})
</script>

<template>
  <p v-if="title">{{ title }}</p>
  <p v-else class="text-gray-500 italic">loading</p>
</template>
