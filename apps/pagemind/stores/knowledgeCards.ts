import type { KnowledgeCard } from '@/types/knowledge-card'
import { defineStore } from 'pinia'

export const useKnowledgeCardsStore = defineStore('knowledgeCards', {
  state: () => ({
    cards: [] as KnowledgeCard[],
  }),
  actions: {
    addCard(card: KnowledgeCard) {
      this.cards.unshift(card)
    },
    removeCard(id: string) {
      this.cards = this.cards.filter(card => card.id !== id)
    },
    updateCard(updated: KnowledgeCard) {
      const idx = this.cards.findIndex(c => c.id === updated.id)
      if (idx !== -1) this.cards[idx] = updated
    }
  }
})
