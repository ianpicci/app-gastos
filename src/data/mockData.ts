import type { Transaction } from '../types/finance'

export const transactions: Transaction[] = [
  { id: '1', title: 'Mercado Santa Clara', category: 'Alimentação', date: 'Hoje, 12:30', amount: 82.5, kind: 'expense', icon: 'shopping-bag', color: 'orange' },
  { id: '2', title: 'Salário', category: 'Receitas', date: 'Hoje, 09:00', amount: 4850, kind: 'income', icon: 'wallet', color: 'green' },
  { id: '3', title: 'Uber', category: 'Transporte', date: 'Ontem, 19:42', amount: 24.8, kind: 'expense', icon: 'car', color: 'blue' },
  { id: '4', title: 'Netflix', category: 'Assinaturas', date: '13 out.', amount: 39.9, kind: 'expense', icon: 'play', color: 'purple' },
  { id: '5', title: 'Café da manhã', category: 'Alimentação', date: '12 out.', amount: 18, kind: 'expense', icon: 'coffee', color: 'orange' },
]

export const categories = [
  { label: 'Moradia', value: 1450, color: '#3956e8' },
  { label: 'Alimentação', value: 730, color: '#f29a38' },
  { label: 'Transporte', value: 315, color: '#6c7cf4' },
  { label: 'Lazer', value: 270, color: '#d877bd' },
]
