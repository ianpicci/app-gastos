import type { TransactionWithCategory } from '../types/finance'
import { formatCents } from '../utils/formatters'
import { Icon } from './Icon'

function formatTransactionDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${date}T12:00:00`)).replace('.', '')
}

interface TransactionListProps {
  items: TransactionWithCategory[]
  onSelect?: (transaction: TransactionWithCategory) => void
}

export function TransactionList({ items, onSelect }: TransactionListProps) {
  return <div className="transaction-list">
    {items.map((item) => <button className="transaction" key={item.id} type="button" onClick={() => onSelect?.(item)} disabled={!onSelect} aria-label={onSelect ? `Editar lançamento ${item.description || item.categoryName}` : undefined}>
      <span className={`transaction-icon ${item.categoryColor}`}><Icon name={item.categoryIcon as 'shopping-bag'} size={20} /></span>
      <div className="transaction-copy"><strong>{item.description || item.categoryName}</strong><small>{item.categoryName} · {formatTransactionDate(item.date)}</small></div>
      <strong className={item.type === 'income' ? 'income' : 'expense'}>{item.type === 'income' ? '+' : '-'} {formatCents(item.amountCents)}</strong>
    </button>)}
  </div>
}
