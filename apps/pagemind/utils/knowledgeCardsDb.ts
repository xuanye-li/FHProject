import type { KnowledgeCard } from '@/types/knowledge-card'
import { openDB } from 'idb'

const DB_NAME = 'pagemind'
const STORE_NAME = 'knowledge-cards'
const DB_VERSION = 1

export async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function getAllCards(): Promise<KnowledgeCard[]> {
  const db = await getDb()
  return db.getAll(STORE_NAME)
}

export async function saveCard(card: KnowledgeCard) {
  const db = await getDb()
  await db.put(STORE_NAME, card)
}

export async function deleteCard(id: string) {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}
