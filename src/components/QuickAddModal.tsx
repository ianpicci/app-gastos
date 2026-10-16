import { useState } from 'react'
import { Icon } from './Icon'

export function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false)
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="new-transaction" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><p className="eyebrow">Lançamento rápido</p><h2 id="new-transaction">Adicionar gasto</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button></header>
      {saved ? <div className="success-message"><span>✓</span><h3>Lançamento salvo</h3><p>Esta é uma demonstração usando dados temporários.</p><button className="primary-button" onClick={onClose}>Concluir</button></div> : <form onSubmit={(event) => { event.preventDefault(); setSaved(true) }}>
        <label>Descrição<input required placeholder="Ex.: almoço com amigos" /></label>
        <label>Valor<input required type="number" min="0.01" step="0.01" placeholder="0,00" /></label>
        <label>Categoria<select defaultValue="Alimentação"><option>Alimentação</option><option>Transporte</option><option>Lazer</option><option>Moradia</option></select></label>
        <button className="primary-button" type="submit">Salvar lançamento</button>
      </form>}
    </section>
  </div>
}
