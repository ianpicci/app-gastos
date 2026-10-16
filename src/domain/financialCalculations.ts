import type { Category, Transaction } from '../types/finance'
import { getMonthSequence } from '../utils/dates'

export interface MonthlySummary {
  incomeCents: number
  expenseCents: number
  resultCents: number
  transactionCount: number
}

export interface CategoryExpense extends Pick<Category, 'id' | 'name' | 'color' | 'icon'> {
  amountCents: number
}

export interface MonthlyExpensePoint {
  month: string
  amountCents: number
}

export function calculateMonthlySummary(transactions: Transaction[], month: string): MonthlySummary {
  return transactions.filter((transaction) => transaction.date.startsWith(month)).reduce((summary, transaction) => {
    summary.transactionCount += 1
    if (transaction.type === 'income') summary.incomeCents += transaction.amountCents
    else summary.expenseCents += transaction.amountCents
    summary.resultCents = summary.incomeCents - summary.expenseCents
    return summary
  }, { incomeCents: 0, expenseCents: 0, resultCents: 0, transactionCount: 0 })
}

export function calculateCategoryExpenses(transactions: Transaction[], categories: Category[], month: string): CategoryExpense[] {
  const expensesByCategory = new Map<string, number>()
  transactions.filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith(month)).forEach((transaction) => {
    expensesByCategory.set(transaction.categoryId, (expensesByCategory.get(transaction.categoryId) ?? 0) + transaction.amountCents)
  })
  return categories.filter((category) => category.type === 'expense').map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    amountCents: expensesByCategory.get(category.id) ?? 0,
  })).filter((category) => category.amountCents > 0).sort((a, b) => b.amountCents - a.amountCents)
}

export function calculateMonthlyExpenseEvolution(transactions: Transaction[], endMonth: string, numberOfMonths = 6): MonthlyExpensePoint[] {
  return getMonthSequence(endMonth, numberOfMonths).map((month) => ({
    month,
    amountCents: transactions.filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith(month)).reduce((total, transaction) => total + transaction.amountCents, 0),
  }))
}
