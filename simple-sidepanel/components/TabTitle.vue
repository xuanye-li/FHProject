<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { browser } from 'wxt/browser'

const title = ref<string | null>(null)

function setTitle(tabTitle?: string | undefined | null) {
  title.value = tabTitle || 'Title not accessible on this site'
}

function updateActiveTabTitle() {
  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    setTitle(tab?.title)
  })
}

function handleTabActivated(info: { tabId: number }) {
  browser.tabs.get(info.tabId).then(tab => {
    setTitle(tab.title)
  })
}

function handleTabUpdated(_: number, _changeInfo: object, tab: { active?: boolean; title?: string }) {
  if (tab.active) {
    setTitle(tab.title)
  }
}

onMounted(() => {
  updateActiveTabTitle()
  browser.tabs.onActivated.addListener(handleTabActivated)
  browser.tabs.onUpdated.addListener(handleTabUpdated)
})

onUnmounted(() => {
  browser.tabs.onActivated.removeListener(handleTabActivated)
  browser.tabs.onUpdated.removeListener(handleTabUpdated)
})
</script>

<template>
  <p v-if="title">{{ title }}</p>
  <p v-else class="text-gray-500 italic">Loading…</p>
</template>
