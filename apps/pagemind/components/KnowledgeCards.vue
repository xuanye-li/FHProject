<script setup lang="ts">

import { useKnowledgeCardsStore } from '@/stores/knowledgeCards'
const cardsStore = useKnowledgeCardsStore()
onMounted(() => {
  if (!cardsStore.loaded) cardsStore.loadCards()
})

</script>

<template>
  <h1 class="text-lg font-bold truncate text-primary">Knowledge Cards</h1>
  <UCard class="mb-3" v-for="card in cardsStore.cards" :key="card.id">
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <span class="font-bold truncate text-lg">{{ card.title }}</span>
        <UButton
          icon="i-heroicons-trash"
          color="red"
          size="xs"
          variant="soft"
          @click="cardsStore.removeCard(card.id)"
          title="Delete card"
        />
      </div>
      <span class="text-xs text-muted break-all">{{ card.sourceUrl }}</span>
    </template>
    <ul class="ml-4 list-disc text-sm mt-2">
      <li
        v-for="h in card.highlights"
        :key="h"
      >{{ h.replace(/^[*-]\s*/, '') }}</li>
    </ul>
    <div class="flex flex-wrap gap-1 mt-2">
      <UBadge
        v-for="tag in card.tags"
        :key="tag"
        size="xs"
        variant="soft"
        color="primary"
      >
        {{ tag }}
      </UBadge>
    </div>
    <template #footer>
      <div class="flex justify-between items-center text-xs text-gray-400">
        <span>Saved: {{ new Date(card.timestamp).toLocaleString() }}</span>
        <UBadge variant="outline" size="xs">{{ card.model }}</UBadge>
      </div>
    </template>
  </UCard>
  <div v-if="cardsStore.cards.length === 0" class="text-xs text-muted mt-2">No cards saved yet.</div>
</template>
