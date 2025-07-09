<script setup lang="ts">
import { useKnowledgeCardsStore } from '@/stores/knowledgeCards'
import { computed, onMounted, ref, watch } from 'vue'

const value = ref({})
const cardsStore = useKnowledgeCardsStore()
const carousel = ref(null)

onMounted(() => {
  if (!cardsStore.loaded) cardsStore.loadCards()
})

const groups = computed(() => [
  {
    id: 'cards',
    label: 'Knowledge Cards',
    items: cardsStore.cards.map(card => ({
      id: card.id,
      label: card.title || '(no title)'
    }))
  }
])

watch(value, (newValue) => {
  if (newValue && newValue.id) {
    const idx = cardsStore.cards.findIndex(c => c.id === newValue.id)
    if (carousel.value?.emblaApi && idx !== -1) {
      carousel.value.emblaApi.scrollTo(idx)
    }
  }
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-4 h-full">
    <h1 class="text-lg font-bold truncate text-primary mb-4">Knowledge Cards</h1>

    <UCommandPalette
      v-model="value"
      :groups="groups"
      placeholder="Search knowledge cards…"
      class="mb-4"
    />

    <UCarousel
      v-if="cardsStore.cards.length"
      ref="carousel"
      :items="cardsStore.cards"
      arrows
      class="w-full"
      slides-per-view="auto"
      gap="16"
      pagination
    >
      <template #default="{ item: card }">
        <UCard class="w-72 max-w-full flex-shrink-0">
          <div class="flex justify-between items-center gap-2 mb-2">
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
          <ul class="ml-4 list-disc text-sm mt-2 break-words">
            <li
              v-for="h in card.highlights"
              :key="h"
              class="break-words"
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
          <div class="flex justify-between items-center text-xs text-gray-400 mt-3">
            <span>Saved: {{ new Date(card.timestamp).toLocaleString() }}</span>
            <UBadge variant="outline" size="xs">{{ card.model }}</UBadge>
          </div>
        </UCard>
      </template>
    </UCarousel>
    <div v-else class="text-xs text-muted mt-2">No cards saved yet.</div>
  </div>
</template>
