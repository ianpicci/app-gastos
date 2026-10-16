import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './database'
import { getActiveCategories } from './categories'
import { getTransactionsWithCategories } from './transactions'
import type { TransactionType } from '../types/finance'
import { getLocalMonthValue } from '../utils/dates'

export function useCategories(type?: TransactionType) {
  return useLiveQuery(() => getActiveCategories(type), [type], [])
}

export function useTransactions() {
  return useLiveQuery(() => getTransactionsWithCategories(), [], [])
}

export function useFinancialSummary() {
  return useLiveQuery(async () => {
    const transactions = await db.transactions.toArray()
    const currentMonth = getLocalMonthValue()
    return transactions.reduce((summary, transaction) => {
      const isCurrentMonth = transaction.date.startsWith(currentMonth)
      if (transaction.type === 'income') {
        summary.balanceCents += transaction.amountCents
        if (isCurrentMonth) summary.incomeCents += transaction.amountCents
      } else {
        summary.balanceCents -= transaction.amountCents
        if (isCurrentMonth) summary.expenseCents += transaction.amountCents
      }
      return summary
    }, { balanceCents: 0, incomeCents: 0, expenseCents: 0 })
  }, [], { balanceCents: 0, incomeCents: 0, expenseCents: 0 })
}

export function useCategoryExpenses() {
  return useLiveQuery(async () => {
    const [transactions, categories] = await Promise.all([db.transactions.toArray(), db.categories.toArray()])
    const expenseByCategory = new Map<string, number>()
    transactions.filter((transaction) => transaction.type === 'expense').forEach((transaction) => {
      expenseByCategory.set(transaction.categoryId, (expenseByCategory.get(transaction.categoryId) ?? 0) + transaction.amountCents)
    })
    return categories.map((category) => ({ ...category, amountCents: expenseByCategory.get(category.id) ?? 0 })).filter((category) => category.amountCents > 0).sort((a, b) => b.amountCents - a.amountCents)
  }, [], [])
}
