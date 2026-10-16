export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatCents(valueInCents: number) {
  return formatCurrency(valueInCents / 100)
}
