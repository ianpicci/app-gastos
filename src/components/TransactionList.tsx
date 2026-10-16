import type { Transaction } from '../types/finance'
import { formatCurrency } from '../utils/formatters'
import { Icon } from './Icon'

export function TransactionList({ items }: { items: Transaction[] }) {
  return <div className="transaction-list">
    {items.map((item) => <article className="transaction" key={item.id}>
      <span className={`transaction-icon ${item.color}`}><Icon name={item.icon as 'shopping-bag'} size={20} /></span>
      <div className="transaction-copy"><strong>{item.title}</strong><small>{item.category} · {item.date}</small></div>
      <strong className={item.kind === 'income' ? 'income' : 'expense'}>{item.kind === 'income' ? '+' : '-'} {formatCurrency(item.amount)}</strong>
    </article>)}
  </div>
}
