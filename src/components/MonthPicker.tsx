import { formatMonthLabel, getLocalMonthValue, getPreviousMonthValue } from '../utils/dates'

interface MonthPickerProps {
  value: string
  onChange: (month: string) => void
}

function getNextMonthValue(monthValue: string) {
  const [year, month] = monthValue.split('-').map(Number)
  return getLocalMonthValue(new Date(year, month, 1))
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const canAdvance = value < getLocalMonthValue()
  return <div className="month-picker"><button onClick={() => onChange(getPreviousMonthValue(value))} aria-label="Mês anterior">‹</button><label><span>Período selecionado</span><input type="month" value={value} max={getLocalMonthValue()} onChange={(event) => onChange(event.target.value)} /><strong>{formatMonthLabel(value)}</strong></label><button onClick={() => onChange(getNextMonthValue(value))} aria-label="Próximo mês" disabled={!canAdvance}>›</button></div>
}
