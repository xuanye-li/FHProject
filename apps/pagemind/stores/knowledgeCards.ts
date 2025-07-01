import type { KnowledgeCard } from '@/types/knowledge-card'
import { deleteCard, getAllCards, saveCard } from '@/utils/knowledgeCardsDb'
import { defineStore } from 'pinia'

export const useKnowledgeCardsStore = defineStore('knowledgeCards', {
  state: () => ({
    cards: [] as KnowledgeCard[],
    loaded: false,
  }),
  actions: {
    async loadCards() {
      this.cards = await getAllCards()
      this.loaded = true
    },
    async addCard(card: KnowledgeCard) {
      this.cards.unshift(card)
      await saveCard(card)
    },
    async removeCard(id: string) {
      this.cards = this.cards.filter(card => card.id !== id)
      await deleteCard(id)
    },
    async updateCard(updated: KnowledgeCard) {
      const idx = this.cards.findIndex(c => c.id === updated.id)
      if (idx !== -1) this.cards[idx] = updated
      await saveCard(updated)
    }
  }
})
