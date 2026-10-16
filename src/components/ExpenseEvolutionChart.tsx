import type { MonthlyExpensePoint } from '../domain/financialCalculations'
import { formatCents } from '../utils/formatters'
import { formatMonthLabel } from '../utils/dates'

export function ExpenseEvolutionChart({ points }: { points: MonthlyExpensePoint[] }) {
  const highestExpense = Math.max(...points.map((point) => point.amountCents), 1)
  return <div className="expense-evolution" role="img" aria-label="Evolução mensal das despesas"><div className="evolution-bars">{points.map((point) => <div className="evolution-point" key={point.month}><span className="evolution-value">{point.amountCents ? formatCents(point.amountCents) : ''}</span><i className={point.amountCents ? '' : 'empty'} style={{ height: `${Math.max(8, Math.round((point.amountCents / highestExpense) * 100))}%` }} /><small>{formatMonthLabel(point.month, { month: 'short' }).replace('.', '')}</small></div>)}</div></div>
}
