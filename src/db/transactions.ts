import { db } from './database'
import type { Transaction, TransactionType, TransactionWithCategory } from '../types/finance'

export interface TransactionInput {
  type: TransactionType
  amountCents: number
  categoryId: string
  description?: string
  date: string
}

const now = () => new Date().toISOString()
const createId = () => crypto.randomUUID()

function validateTransaction(input: TransactionInput) {
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) throw new Error('Informe um valor válido maior que zero.')
  if (!input.categoryId) throw new Error('Selecione uma categoria.')
  if (!input.date) throw new Error('Informe a data do lançamento.')
}

export async function addTransaction(input: TransactionInput) {
  validateTransaction(input)
  const category = await db.categories.get(input.categoryId)
  if (!category || category.isArchived || category.type !== input.type) throw new Error('A categoria selecionada não está disponível.')

  const timestamp = now()
  const transaction: Transaction = { ...input, id: createId(), description: input.description?.trim() || undefined, createdAt: timestamp, updatedAt: timestamp }
  await db.transactions.add(transaction)
  return transaction
}

export async function updateTransaction(id: string, input: TransactionInput) {
  validateTransaction(input)
  const category = await db.categories.get(input.categoryId)
  if (!category || category.isArchived || category.type !== input.type) throw new Error('A categoria selecionada não está disponível.')
  const updatedCount = await db.transactions.update(id, { ...input, description: input.description?.trim() || undefined, updatedAt: now() })
  if (!updatedCount) throw new Error('Lançamento não encontrado.')
}

export async function deleteTransaction(id: string) {
  if (!await db.transactions.get(id)) throw new Error('Lançamento não encontrado.')
  await db.transactions.delete(id)
}

export async function getTransactionsWithCategories(): Promise<TransactionWithCategory[]> {
  const [transactions, categories] = await Promise.all([db.transactions.toArray(), db.categories.toArray()])
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  return transactions
    .map((transaction) => {
      const category = categoriesById.get(transaction.categoryId)
      return category ? { ...transaction, categoryName: category.name, categoryIcon: category.icon, categoryColor: category.color } : null
    })
    .filter((transaction): transaction is TransactionWithCategory => transaction !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
}
