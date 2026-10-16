import { useCategoryExpenses, useFinancialSummary } from '../db/hooks'
import { formatCents } from '../utils/formatters'

export function AnalyticsPage() {
  const categories = useCategoryExpenses()
  const summary = useFinancialSummary()
  const highestExpense = categories[0]?.amountCents ?? 1
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Visão geral do mês</p><h1>Análises</h1></div></header><section className="analytics-highlight"><p>Você gastou</p><h2>{formatCents(summary.expenseCents)}</h2><span>Resumo calculado com seus dados locais</span><div className="bars">{[38, 54, 42, 74, 56, 88, 65, 48, 61, 36, 52, 45].map((height, index) => <i key={index} style={{ height: `${height}%` }} className={index === 9 ? 'current' : ''} />)}</div><div className="bar-labels"><span>01</span><span>10</span><span>20</span><span>30</span></div></section><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Onde seu dinheiro foi</p><h2>Por categoria</h2></div></div>{categories.length ? <div className="category-list">{categories.map((category) => <div className="category-row" key={category.id}><i style={{ background: category.color }} /><span>{category.name}</span><div className="category-bar"><b style={{ width: `${Math.round((category.amountCents / highestExpense) * 100)}%`, background: category.color }} /></div><strong>{formatCents(category.amountCents)}</strong></div>)}</div> : <p className="empty-state">Adicione despesas para acompanhar suas categorias.</p>}</section></div>
}
