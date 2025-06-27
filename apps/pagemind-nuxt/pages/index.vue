<template>
  <main class="min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">Nuxt SPA in Extension Iframe 🚀</h1>
    <p class="mt-4">If you see this, the iframe integration works!</p>
    <button class="mt-6 px-4 py-2 bg-blue-600 text-white rounded" @click="count++">
      Clicked {{ count }} times
    </button>
  </main>
</template>

<script setup>
const count = ref(0)
</script>
