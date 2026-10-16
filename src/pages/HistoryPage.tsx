import { transactions } from '../data/mockData'
import { Icon } from '../components/Icon'
import { TransactionList } from '../components/TransactionList'

export function HistoryPage() {
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Sua movimentação</p><h1>Histórico</h1></div><button className="icon-button outlined" aria-label="Filtrar lançamentos"><Icon name="sliders" /></button></header><div className="month-selector"><button>‹</button><strong>Outubro de 2026</strong><button>›</button></div><section className="content-section flat"><div className="section-heading"><div><p className="eyebrow">15 de outubro</p><h2>Hoje</h2></div><span className="daily-total">- R$ 82,50</span></div><TransactionList items={transactions.slice(0, 2)} /></section><section className="content-section flat"><div className="section-heading"><div><p className="eyebrow">14 de outubro</p><h2>Ontem</h2></div><span className="daily-total">- R$ 24,80</span></div><TransactionList items={transactions.slice(2)} /></section></div>
}
