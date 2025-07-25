<script setup lang="ts">
import { useAsyncData } from 'nuxt/dist/app/composables/asyncData.js'

console.log('[async-test] starting…')

const { data, pending, error } = await useAsyncData('todos', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  if (!res.ok) throw new Error('Failed to fetch')
  return await res.json()
})
</script>

<template>
  <div>
    <p v-if="pending">Loading real API...</p>
    <pre v-if="data">{{ data }}</pre>
    <p v-if="error">❌ Error: {{ error.message }}</p>
  </div>
</template>
