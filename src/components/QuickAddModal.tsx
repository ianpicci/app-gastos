import { useState } from 'react'
import { useCategories } from '../db/hooks'
import { addTransaction, deleteTransaction, updateTransaction } from '../db/transactions'
import type { TransactionType, TransactionWithCategory } from '../types/finance'
import { getLocalDateValue } from '../utils/dates'
import { Icon } from './Icon'

interface TransactionModalProps {
  onClose: () => void
  transaction?: TransactionWithCategory
}

export function QuickAddModal({ onClose, transaction }: TransactionModalProps) {
  const isEditing = Boolean(transaction)
  const [saved, setSaved] = useState(false)
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount, setAmount] = useState(transaction ? (transaction.amountCents / 100).toFixed(2) : '')
  const [date, setDate] = useState(transaction?.date ?? getLocalDateValue())
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirmingDeletion, setConfirmingDeletion] = useState(false)
  const categories = useCategories(type)

  async function handleSubmit() {
    const decimalAmount = Number(amount.replace(',', '.'))
    setError('')
    setIsSaving(true)
    try {
      const input = { type, amountCents: Math.round(decimalAmount * 100), categoryId, description, date }
      if (transaction) await updateTransaction(transaction.id, input)
      else await addTransaction(input)
      setSaved(true)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Não foi possível salvar o lançamento. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!transaction) return
    setError('')
    setIsSaving(true)
    try {
      await deleteTransaction(transaction.id)
      onClose()
    } catch (deletionError) {
      setError(deletionError instanceof Error ? deletionError.message : 'Não foi possível excluir o lançamento. Tente novamente.')
      setConfirmingDeletion(false)
    } finally {
      setIsSaving(false)
    }
  }

  const title = isEditing ? 'Editar lançamento' : 'Adicionar lançamento'

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="new-transaction" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><p className="eyebrow">{isEditing ? 'Detalhes do lançamento' : 'Lançamento rápido'}</p><h2 id="new-transaction">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button></header>
      {saved ? <div className="success-message"><span>✓</span><h3>{isEditing ? 'Alterações salvas' : 'Lançamento salvo'}</h3><p>O lançamento já está disponível no seu histórico local.</p><button className="primary-button" onClick={onClose}>Concluir</button></div> : isConfirmingDeletion ? <div className="delete-confirmation"><h3>Excluir lançamento?</h3><p>Essa ação não pode ser desfeita.</p><div><button className="secondary-button" onClick={() => setConfirmingDeletion(false)} disabled={isSaving}>Cancelar</button><button className="danger-button" onClick={() => void handleDelete()} disabled={isSaving}>{isSaving ? 'Excluindo…' : 'Excluir'}</button></div></div> : <form onSubmit={(event) => { event.preventDefault(); void handleSubmit() }}>
        <label>Tipo<select value={type} onChange={(event) => { setType(event.target.value as TransactionType); setCategoryId('') }}><option value="expense">Despesa</option><option value="income">Receita</option></select></label>
        <label>Descrição <small>Opcional</small><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ex.: almoço com amigos" /></label>
        <label>Valor<input required value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" type="number" min="0.01" step="0.01" placeholder="0,00" /></label>
        <label>Categoria<select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={categories.length === 0}><option value="">Selecione uma categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>Data<input required value={date} onChange={(event) => setDate(event.target.value)} type="date" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="transaction-form-actions">{isEditing && <button className="delete-button" type="button" onClick={() => setConfirmingDeletion(true)} disabled={isSaving}>Excluir</button>}<button className="primary-button" type="submit" disabled={isSaving || categories.length === 0}>{isSaving ? 'Salvando…' : 'Salvar alterações'}</button></div>
      </form>}
    </section>
  </div>
}
