import { transactions } from '../data/mockData'
import { Icon } from '../components/Icon'
import { TransactionList } from '../components/TransactionList'
import { formatCurrency } from '../utils/formatters'

export function HomePage() {
  return <div className="page home-page">
    <header className="page-header"><div><p className="eyebrow">Quarta-feira, 15 de outubro</p><h1>Olá, André <span>👋</span></h1></div><button className="avatar avatar-button" aria-label="Abrir perfil">AM</button></header>
    <section className="balance-card"><p>Saldo disponível</p><h2>{formatCurrency(3897.6)}</h2><div className="balance-foot"><div className="balance-stat"><span className="balance-label"><Icon name="arrow-up" size={16} /> Receitas</span><strong>{formatCurrency(4850)}</strong></div><div className="balance-stat"><span className="balance-label"><Icon name="arrow-down" size={16} /> Despesas</span><strong>{formatCurrency(2072.4)}</strong></div></div></section>
    <section className="period-summary"><div><p className="eyebrow">Este mês</p><h2>Seu dinheiro, em equilíbrio.</h2><p>Você já usou <strong>34%</strong> do valor planejado para outubro.</p></div><div className="progress-ring"><strong>66%</strong><small>livre</small></div></section>
    <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Atividade recente</p><h2>Últimos lançamentos</h2></div><button className="text-button">Ver todos <Icon name="chevron-right" size={17} /></button></div><TransactionList items={transactions.slice(0, 4)} /></section>
  </div>
}
