import { Icon } from '../components/Icon'
import { TransactionList } from '../components/TransactionList'
import { useFinancialSummary, useTransactions } from '../db/hooks'
import { getLocalMonthValue } from '../utils/dates'
import { formatCents } from '../utils/formatters'
import type { TransactionWithCategory } from '../types/finance'

export function HomePage({ onSelectTransaction }: { onSelectTransaction: (transaction: TransactionWithCategory) => void }) {
  const transactions = useTransactions()
  const summary = useFinancialSummary(getLocalMonthValue())
  const expensePercentage = summary.incomeCents ? Math.round((summary.expenseCents / summary.incomeCents) * 100) : 0
  const ringPercentage = Math.min(100, expensePercentage)
  const todayLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  return <div className="page home-page">
    <header className="page-header"><div><p className="eyebrow">{todayLabel}</p><h1>Olá, André <span>👋</span></h1></div><button className="avatar avatar-button" aria-label="Abrir perfil">AM</button></header>
    <section className="balance-card"><p>Resultado do mês</p><h2 className={summary.resultCents < 0 ? 'negative-result' : ''}>{formatCents(summary.resultCents)}</h2><div className="balance-foot"><div className="balance-stat"><span className="balance-label"><Icon name="arrow-up" size={16} /> Receitas</span><strong>{formatCents(summary.incomeCents)}</strong></div><div className="balance-stat"><span className="balance-label"><Icon name="arrow-down" size={16} /> Despesas</span><strong>{formatCents(summary.expenseCents)}</strong></div></div></section>
    <section className="period-summary"><div><p className="eyebrow">Este mês</p><h2>{summary.transactionCount ? 'Resumo do período atual.' : 'Comece seu controle financeiro.'}</h2><p>{summary.incomeCents ? <>As despesas representam <strong>{expensePercentage}%</strong> das receitas do mês.</> : summary.expenseCents ? 'Você registrou despesas, mas ainda não há receitas no período.' : 'Adicione um lançamento para acompanhar seus gastos.'}</p></div><div className="progress-ring" style={{ background: `conic-gradient(#6e8b47 0 ${ringPercentage}%, #cad4bc ${ringPercentage}% 100%)` }}><strong>{ringPercentage}%</strong><small>despesas</small></div></section>
    <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Atividade recente</p><h2>Últimos lançamentos</h2></div><button className="text-button">Ver todos <Icon name="chevron-right" size={17} /></button></div>{transactions.length ? <TransactionList items={transactions.slice(0, 4)} onSelect={onSelectTransaction} /> : <p className="empty-state">Nenhum lançamento registrado ainda.</p>}</section>
  </div>
}
