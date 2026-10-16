function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function getLocalDateValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function getLocalMonthValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function getPreviousMonthValue(monthValue: string) {
  const [year, month] = monthValue.split('-').map(Number)
  return getLocalMonthValue(new Date(year, month - 2, 1))
}

export function getMonthSequence(endMonthValue: string, count: number) {
  const months: string[] = []
  let current = endMonthValue
  for (let index = 0; index < count; index += 1) {
    months.unshift(current)
    current = getPreviousMonthValue(current)
  }
  return months
}

export function formatMonthLabel(monthValue: string, options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }) {
  const [year, month] = monthValue.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(year, month - 1, 1))
}
