export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: TransactionType
  icon: string
  color: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amountCents: number
  categoryId: string
  description?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface TransactionWithCategory extends Transaction {
  categoryName: string
  categoryIcon: string
  categoryColor: string
}

export type PageId = 'home' | 'history' | 'analytics' | 'settings'
