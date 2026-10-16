export type TransactionKind = 'income' | 'expense'

export interface Transaction {
  id: string
  title: string
  category: string
  date: string
  amount: number
  kind: TransactionKind
  icon: string
  color: string
}

export type PageId = 'home' | 'history' | 'analytics' | 'settings'
