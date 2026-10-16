import { useState } from 'react'
import { addCategory, archiveCategory, updateCategory } from '../db/categories'
import { useCategories } from '../db/hooks'
import { BackupActions } from '../components/BackupActions'
import { Icon } from '../components/Icon'

const items = [['Perfil', 'André Martins'], ['Categorias', 'Organize seus gastos'], ['Orçamentos', 'Defina seus limites'], ['Aparência', 'Claro']]

function CategoriesPage({ onBack }: { onBack: () => void }) {
  const categories = useCategories()
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'income' | 'expense'>('expense')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState('')

  async function createCategory() {
    if (!newName.trim()) return
    setError('')
    try {
      await addCategory({ name: newName.trim(), type: newType, icon: newType === 'income' ? 'arrow-up' : 'wallet', color: newType === 'income' ? 'green' : 'orange' })
      setNewName('')
    } catch {
      setError('Não foi possível adicionar a categoria.')
    }
  }

  async function saveCategory(id: string) {
    if (!editingName.trim()) return
    setError('')
    try {
      await updateCategory(id, { name: editingName.trim() })
      setEditingId(null)
    } catch {
      setError('Não foi possível editar a categoria.')
    }
  }

  async function removeCategory(id: string) {
    setError('')
    try {
      await archiveCategory(id)
    } catch {
      setError('Não foi possível arquivar a categoria.')
    }
  }

  return <div className="page category-page"><header className="page-header"><button className="icon-button outlined back-button" onClick={onBack} aria-label="Voltar para Ajustes">←</button><div><p className="eyebrow">Dados locais</p><h1>Categorias</h1></div></header><section className="category-manager"><div className="category-create"><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Nova categoria" aria-label="Nome da categoria" /><select value={newType} onChange={(event) => setNewType(event.target.value as 'income' | 'expense')} aria-label="Tipo da categoria"><option value="expense">Despesa</option><option value="income">Receita</option></select><button className="primary-button" onClick={() => void createCategory()}>Adicionar</button></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="managed-categories">{categories.map((category) => <div key={category.id} className="managed-category">{editingId === category.id ? <><input value={editingName} onChange={(event) => setEditingName(event.target.value)} aria-label="Editar nome da categoria" /><div><button onClick={() => void saveCategory(category.id)}>Salvar</button><button onClick={() => setEditingId(null)}>Cancelar</button></div></> : <><span><strong>{category.name}</strong><small>{category.type === 'income' ? 'Receita' : 'Despesa'}</small></span><div><button onClick={() => { setEditingId(category.id); setEditingName(category.name) }}>Editar</button><button onClick={() => void removeCategory(category.id)}>Arquivar</button></div></>}</div>)}</div></section></div>
}

export function SettingsPage() {
  const [isManagingCategories, setManagingCategories] = useState(false)
  if (isManagingCategories) return <CategoriesPage onBack={() => setManagingCategories(false)} />
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Personalize sua experiência</p><h1>Ajustes</h1></div></header><section className="settings-profile"><span className="avatar large">AM</span><div><h2>André Martins</h2><p>Conta pessoal</p></div><Icon name="chevron-right" /></section><section className="settings-list">{items.map(([title, detail]) => <button key={title} onClick={() => title === 'Categorias' && setManagingCategories(true)}><span><strong>{title}</strong><small>{detail}</small></span><Icon name="chevron-right" size={19} /></button>)}</section><BackupActions /><p className="demo-notice">Todos os dados deste app são armazenados apenas neste dispositivo.</p></div>
}
