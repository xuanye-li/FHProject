<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
const apiKey = ref('')
</script>

<template>
  <UCard>
    <UButton
      @click="open = !open"
      icon="i-lucide-key-round"
      variant="soft"
    >
      API Settings
    </UButton>

    <UCollapse v-model="open">
      <div class="p-3 space-y-3">
        <UFormGroup label="API Key">
          <UInput v-model="apiKey" placeholder="Enter API key" type="password" />
        </UFormGroup>
        <UButton color="primary">Save API Key</UButton>
      </div>
    </UCollapse>
  </UCard>
</template>
