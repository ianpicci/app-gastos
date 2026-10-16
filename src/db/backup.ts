import { db } from './database'
import { BACKUP_FORMAT, BACKUP_VERSION, type BackupFile, type BackupPreview } from '../types/backup'
import type { Category, Transaction, TransactionType } from '../types/finance'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTransactionType(value: unknown): value is TransactionType {
  return value === 'income' || value === 'expense'
}

function isLocalDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
}

function isTimestamp(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function isCategory(value: unknown): value is Category {
  return isRecord(value) && typeof value.id === 'string' && value.id.length > 0 && typeof value.name === 'string' && value.name.length > 0 && isTransactionType(value.type) && typeof value.icon === 'string' && typeof value.color === 'string' && typeof value.isArchived === 'boolean' && isTimestamp(value.createdAt) && isTimestamp(value.updatedAt)
}

function isTransaction(value: unknown): value is Transaction {
  return isRecord(value) && typeof value.id === 'string' && value.id.length > 0 && isTransactionType(value.type) && Number.isInteger(value.amountCents) && Number(value.amountCents) > 0 && typeof value.categoryId === 'string' && value.categoryId.length > 0 && (value.description === undefined || typeof value.description === 'string') && isLocalDate(value.date) && isTimestamp(value.createdAt) && isTimestamp(value.updatedAt)
}

function validateUniqueIds(items: Array<{ id: string }>, label: string) {
  if (new Set(items.map((item) => item.id)).size !== items.length) throw new Error(`O backup contém IDs duplicados de ${label}.`)
}

export function validateBackup(raw: unknown): BackupPreview {
  if (!isRecord(raw) || raw.format !== BACKUP_FORMAT || raw.version !== BACKUP_VERSION || !isTimestamp(raw.generatedAt) || !isRecord(raw.data)) throw new Error('Este arquivo não é um backup compatível do app-gastos.')
  const { categories, transactions, settings } = raw.data
  if (!Array.isArray(categories) || !Array.isArray(transactions) || !isRecord(settings)) throw new Error('A estrutura do backup está incompleta.')
  if (categories.length === 0 && transactions.length === 0) throw new Error('O arquivo de backup não contém dados para restaurar.')
  if (!categories.every(isCategory) || !transactions.every(isTransaction)) throw new Error('O backup contém dados inválidos.')
  validateUniqueIds(categories, 'categorias')
  validateUniqueIds(transactions, 'lançamentos')
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  if (transactions.some((transaction) => {
    const category = categoriesById.get(transaction.categoryId)
    return !category || category.type !== transaction.type
  })) throw new Error('O backup contém lançamentos com categoria inválida.')

  const backup: BackupFile = { format: BACKUP_FORMAT, version: BACKUP_VERSION, generatedAt: String(raw.generatedAt), data: { categories, transactions, settings } }
  return { backup, categoryCount: categories.length, transactionCount: transactions.length }
}

export async function createBackup(): Promise<BackupFile> {
  const data = await db.transaction('r', db.categories, db.transactions, async () => ({
    categories: await db.categories.toArray(),
    transactions: await db.transactions.toArray(),
    settings: {},
  }))
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, generatedAt: new Date().toISOString(), data }
}

export async function restoreBackup(backup: BackupFile) {
  await db.transaction('rw', db.categories, db.transactions, async () => {
    await db.categories.bulkPut(backup.data.categories)
    await db.transactions.bulkPut(backup.data.transactions)
  })
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

export async function createTransactionsCsv() {
  const [transactions, categories] = await Promise.all([db.transactions.toArray(), db.categories.toArray()])
  const categoriesById = new Map(categories.map((category) => [category.id, category.name]))
  const rows = transactions.sort((a, b) => b.date.localeCompare(a.date)).map((transaction) => [
    transaction.date,
    transaction.type === 'income' ? 'Receita' : 'Despesa',
    categoriesById.get(transaction.categoryId) ?? 'Categoria removida',
    transaction.description ?? '',
    (transaction.amountCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  ].map(escapeCsv).join(';'))
  return `\uFEFFData;Tipo;Categoria;Descrição;Valor (R$)\n${rows.join('\n')}`
}
