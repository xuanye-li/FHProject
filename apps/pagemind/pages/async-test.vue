<script setup lang="ts">
import { useAsyncData } from 'nuxt/app'

const { data, pending, error } = await useAsyncData('test-fetch', async () => {
  return await fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(r => r.json())
})
</script>

<template>
  <div>
    <h2>Nuxt Composable Test</h2>
    <p v-if="pending">⏳ Loading...</p>
    <pre v-else-if="data">{{ data }}</pre>
    <p v-else-if="error">❌ Error: {{ error.message }}</p>
  </div>
</template>
