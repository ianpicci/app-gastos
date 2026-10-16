import { useState } from 'react'
import { ExpenseEvolutionChart } from '../components/ExpenseEvolutionChart'
import { MonthPicker } from '../components/MonthPicker'
import { useCategoryExpenses, useFinancialSummary, useMonthlyExpenseEvolution } from '../db/hooks'
import { getLocalMonthValue } from '../utils/dates'
import { formatCents } from '../utils/formatters'

export function AnalyticsPage() {
  const [month, setMonth] = useState(getLocalMonthValue)
  const summary = useFinancialSummary(month)
  const categories = useCategoryExpenses(month)
  const evolution = useMonthlyExpenseEvolution(month)
  const highestExpense = categories[0]?.amountCents ?? 1
  const hasTransactions = summary.transactionCount > 0

  return <div className="page analytics-page"><header className="page-header"><div><p className="eyebrow">Seus dados locais</p><h1>Análises</h1></div></header><MonthPicker value={month} onChange={setMonth} />{hasTransactions ? <><section className="monthly-result-card"><p>Resultado do mês</p><h2 className={summary.resultCents < 0 ? 'negative-result' : ''}>{formatCents(summary.resultCents)}</h2><span>Receitas menos despesas no período</span><div className="result-breakdown"><div><small>Receitas</small><strong>{formatCents(summary.incomeCents)}</strong></div><div><small>Despesas</small><strong>{formatCents(summary.expenseCents)}</strong></div></div></section><section className="content-section analytics-section"><div className="section-heading"><div><p className="eyebrow">Comparação mensal</p><h2>Evolução das despesas</h2></div></div><ExpenseEvolutionChart points={evolution} /></section><section className="content-section analytics-section"><div className="section-heading"><div><p className="eyebrow">Distribuição no período</p><h2>Despesas por categoria</h2></div></div>{categories.length ? <div className="category-list">{categories.map((category) => <div className="category-row" key={category.id}><i style={{ background: category.color }} /><span>{category.name}</span><div className="category-bar"><b style={{ width: `${Math.round((category.amountCents / highestExpense) * 100)}%`, background: category.color }} /></div><strong>{formatCents(category.amountCents)}</strong></div>)}</div> : <p className="empty-state">Não há despesas neste período.</p>}</section></> : <section className="analytics-empty"><span>⌁</span><h2>Nenhum dado neste período</h2><p>Selecione outro mês ou adicione lançamentos para visualizar seus resumos e gráficos.</p></section>}</div>
}
