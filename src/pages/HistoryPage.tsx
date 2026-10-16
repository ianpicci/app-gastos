import { Icon } from '../components/Icon'
import { TransactionList } from '../components/TransactionList'
import { useTransactions } from '../db/hooks'
import { formatCents } from '../utils/formatters'
import { getLocalDateValue } from '../utils/dates'
import type { TransactionWithCategory } from '../types/finance'

function dateHeading(date: string) {
  const value = new Date(`${date}T12:00:00`)
  const today = getLocalDateValue()
  if (date === today) return 'Hoje'
  const yesterday = getLocalDateValue(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1))
  if (date === yesterday) return 'Ontem'
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(value)
}

export function HistoryPage({ onSelectTransaction }: { onSelectTransaction: (transaction: TransactionWithCategory) => void }) {
  const transactions = useTransactions()
  const groupedTransactions = transactions.reduce<Record<string, typeof transactions>>((groups, transaction) => ({ ...groups, [transaction.date]: [...(groups[transaction.date] ?? []), transaction] }), {})
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Sua movimentação</p><h1>Histórico</h1></div><button className="icon-button outlined" aria-label="Filtrar lançamentos"><Icon name="sliders" /></button></header><div className="month-selector"><button aria-label="Mês anterior">‹</button><strong>Todos os lançamentos</strong><button aria-label="Próximo mês">›</button></div>{Object.entries(groupedTransactions).length ? Object.entries(groupedTransactions).map(([date, entries]) => { const total = entries.reduce((value, item) => value + (item.type === 'income' ? item.amountCents : -item.amountCents), 0); return <section className="content-section flat" key={date}><div className="section-heading"><div><p className="eyebrow">{dateHeading(date)}</p><h2>{dateHeading(date)}</h2></div><span className="daily-total">{total >= 0 ? '+' : '-'} {formatCents(Math.abs(total))}</span></div><TransactionList items={entries} onSelect={onSelectTransaction} /></section> }) : <p className="empty-state">Seu histórico aparecerá aqui quando você adicionar o primeiro lançamento.</p>}</div>
}
