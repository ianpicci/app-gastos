import type { Category, Transaction } from './finance'

export const BACKUP_FORMAT = 'app-gastos-backup'
export const BACKUP_VERSION = 1

export interface BackupData {
  categories: Category[]
  transactions: Transaction[]
  settings: Record<string, unknown>
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT
  version: typeof BACKUP_VERSION
  generatedAt: string
  data: BackupData
}

export interface BackupPreview {
  backup: BackupFile
  categoryCount: number
  transactionCount: number
}
