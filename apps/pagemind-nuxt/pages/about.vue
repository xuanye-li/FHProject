<!-- apps/pagemind-nuxt/pages/about.vue -->
<template>
  <div class="page">
    <div class="card">
      <h2>About PageMind</h2>

      <div class="info">
        <p>
          This extension demonstrates how to integrate a Nuxt SPA with WXT
          for building modern browser extensions.
        </p>

        <div class="tech-stack">
          <h3>Tech Stack</h3>
          <ul>
            <li>Nuxt 3 (SPA mode)</li>
            <li>WXT Extension Framework</li>
            <li>Vue 3 Composition API</li>
            <li>TypeScript</li>
          </ul>
        </div>

        <div class="extension-info">
          <h3>Extension Details</h3>
          <p><strong>Current URL:</strong> {{ currentUrl }}</p>
          <p><strong>User Agent:</strong> {{ userAgent }}</p>
          <p><strong>Timestamp:</strong> {{ timestamp }}</p>
        </div>
      </div>

      <div class="actions">
        <NuxtLink to="/" class="btn">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentUrl = ref('')
const userAgent = ref('')
const timestamp = ref('')

onMounted(() => {
  currentUrl.value = window.location.href
  userAgent.value = navigator.userAgent.split(' ').slice(0, 3).join(' ') + '...'
  timestamp.value = new Date().toLocaleString()
})
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 1rem;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
}

.card h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
  text-align: center;
}

.info p {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.tech-stack, .extension-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.tech-stack h3, .extension-info h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.tech-stack ul {
  margin: 0;
  padding-left: 1.5rem;
}

.tech-stack li {
  margin-bottom: 0.5rem;
}

.extension-info p {
  margin: 0.5rem 0;
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
}

.actions {
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  display: inline-block;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
</style>
