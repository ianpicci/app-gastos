import { Icon } from '../components/Icon'
import { TransactionList } from '../components/TransactionList'
import { useFinancialSummary, useTransactions } from '../db/hooks'
import { formatCents } from '../utils/formatters'
import type { TransactionWithCategory } from '../types/finance'

export function HomePage({ onSelectTransaction }: { onSelectTransaction: (transaction: TransactionWithCategory) => void }) {
  const transactions = useTransactions()
  const summary = useFinancialSummary()
  const plannedPercentage = summary.incomeCents ? Math.min(100, Math.round((summary.expenseCents / summary.incomeCents) * 100)) : 0
  const availablePercentage = 100 - plannedPercentage
  return <div className="page home-page">
    <header className="page-header"><div><p className="eyebrow">Quarta-feira, 15 de outubro</p><h1>Olá, André <span>👋</span></h1></div><button className="avatar avatar-button" aria-label="Abrir perfil">AM</button></header>
    <section className="balance-card"><p>Saldo disponível</p><h2>{formatCents(summary.balanceCents)}</h2><div className="balance-foot"><div className="balance-stat"><span className="balance-label"><Icon name="arrow-up" size={16} /> Receitas</span><strong>{formatCents(summary.incomeCents)}</strong></div><div className="balance-stat"><span className="balance-label"><Icon name="arrow-down" size={16} /> Despesas</span><strong>{formatCents(summary.expenseCents)}</strong></div></div></section>
    <section className="period-summary"><div><p className="eyebrow">Este mês</p><h2>{transactions.length ? 'Seu dinheiro, em equilíbrio.' : 'Comece seu controle financeiro.'}</h2><p>{summary.incomeCents ? <>Você já usou <strong>{plannedPercentage}%</strong> das receitas deste mês.</> : 'Adicione um lançamento para acompanhar seus gastos.'}</p></div><div className="progress-ring" style={{ background: `conic-gradient(#6e8b47 0 ${availablePercentage}%, #cad4bc ${availablePercentage}% 100%)` }}><strong>{availablePercentage}%</strong><small>livre</small></div></section>
    <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Atividade recente</p><h2>Últimos lançamentos</h2></div><button className="text-button">Ver todos <Icon name="chevron-right" size={17} /></button></div>{transactions.length ? <TransactionList items={transactions.slice(0, 4)} onSelect={onSelectTransaction} /> : <p className="empty-state">Nenhum lançamento registrado ainda.</p>}</section>
  </div>
}
