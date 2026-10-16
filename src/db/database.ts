import Dexie, { type EntityTable } from 'dexie'
import type { Category, Transaction } from '../types/finance'

class AppDatabase extends Dexie {
  categories!: EntityTable<Category, 'id'>
  transactions!: EntityTable<Transaction, 'id'>

  constructor() {
    super('app-gastos')
    this.version(1).stores({
      categories: 'id, type, isArchived, name, updatedAt',
      transactions: 'id, type, categoryId, date, createdAt, updatedAt',
    })
  }
}

export const db = new AppDatabase()
