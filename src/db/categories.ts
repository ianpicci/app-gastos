import { db } from './database'
import type { Category, TransactionType } from '../types/finance'

const defaultCategoryDefinitions: Array<Pick<Category, 'name' | 'type' | 'icon' | 'color'>> = [
  { name: 'Alimentação', type: 'expense', icon: 'shopping-bag', color: 'orange' },
  { name: 'Transporte', type: 'expense', icon: 'car', color: 'blue' },
  { name: 'Moradia', type: 'expense', icon: 'home', color: 'purple' },
  { name: 'Lazer', type: 'expense', icon: 'play', color: 'purple' },
  { name: 'Outros gastos', type: 'expense', icon: 'wallet', color: 'orange' },
  { name: 'Salário', type: 'income', icon: 'wallet', color: 'green' },
  { name: 'Outras receitas', type: 'income', icon: 'arrow-up', color: 'green' },
]

const now = () => new Date().toISOString()
const createId = () => crypto.randomUUID()

export async function ensureDefaultCategories() {
  if (await db.categories.count()) return

  const timestamp = now()
  await db.categories.bulkAdd(defaultCategoryDefinitions.map((category) => ({
    ...category,
    id: createId(),
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  })))
}

export async function addCategory(input: Pick<Category, 'name' | 'type' | 'icon' | 'color'>) {
  const timestamp = now()
  const category: Category = { ...input, id: createId(), isArchived: false, createdAt: timestamp, updatedAt: timestamp }
  await db.categories.add(category)
  return category
}

export async function updateCategory(id: string, changes: Partial<Pick<Category, 'name' | 'icon' | 'color' | 'type'>>) {
  await db.categories.update(id, { ...changes, updatedAt: now() })
}

export async function archiveCategory(id: string) {
  await db.categories.update(id, { isArchived: true, updatedAt: now() })
}

export async function getActiveCategories(type?: TransactionType) {
  const categories = await db.categories.filter((category) => !category.isArchived).toArray()
  return type ? categories.filter((category) => category.type === type) : categories
}
