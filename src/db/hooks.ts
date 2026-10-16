import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './database'
import { getActiveCategories } from './categories'
import { getTransactionsWithCategories } from './transactions'
import type { TransactionType } from '../types/finance'
import { getLocalMonthValue } from '../utils/dates'
import { calculateCategoryExpenses, calculateMonthlyExpenseEvolution, calculateMonthlySummary } from '../domain/financialCalculations'

export function useCategories(type?: TransactionType) {
  return useLiveQuery(() => getActiveCategories(type), [type], [])
}

export function useTransactions() {
  return useLiveQuery(() => getTransactionsWithCategories(), [], [])
}

export function useFinancialSummary(month = getLocalMonthValue()) {
  return useLiveQuery(async () => {
    const transactions = await db.transactions.toArray()
    return calculateMonthlySummary(transactions, month)
  }, [month], { incomeCents: 0, expenseCents: 0, resultCents: 0, transactionCount: 0 })
}

export function useCategoryExpenses(month = getLocalMonthValue()) {
  return useLiveQuery(async () => {
    const [transactions, categories] = await Promise.all([db.transactions.toArray(), db.categories.toArray()])
    return calculateCategoryExpenses(transactions, categories, month)
  }, [month], [])
}

export function useMonthlyExpenseEvolution(endMonth = getLocalMonthValue()) {
  return useLiveQuery(async () => calculateMonthlyExpenseEvolution(await db.transactions.toArray(), endMonth), [endMonth], [])
}
