<script setup lang="ts">
import { useLlmStore } from '@/stores/llm'

const llm = useLlmStore()
</script>

<template>
  <USelectMenu
      v-model="llm.selectedModelId"
      :items="llm.models.map(m => ({ label: m.label, value: m.id }))"
      variant="ghost"
      class="hover:bg-default focus:bg-default data-[state=open]:bg-default"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
      placeholder="Select model"
  />
</template>
