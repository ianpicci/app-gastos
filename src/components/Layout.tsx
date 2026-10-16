import type { ReactNode } from 'react'
import type { PageId } from '../types/finance'
import { Icon } from './Icon'

const navigation: Array<{ id: PageId; label: string; icon: 'home' | 'clock' | 'chart' | 'settings' }> = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'history', label: 'Histórico', icon: 'clock' },
  { id: 'analytics', label: 'Análises', icon: 'chart' },
  { id: 'settings', label: 'Ajustes', icon: 'settings' },
]

interface LayoutProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
  onQuickAdd: () => void
  children: ReactNode
}

export function Layout({ activePage, onNavigate, onQuickAdd, children }: LayoutProps) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-mark"><span>F</span> Fluxo</div>
      <nav aria-label="Navegação principal" className="side-nav">
        {navigation.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={activePage === item.id ? 'active' : ''}><Icon name={item.icon} /><span>{item.label}</span></button>)}
      </nav>
      <div className="sidebar-footer"><span className="avatar">AM</span><div><strong>André Martins</strong><small>Conta pessoal</small></div></div>
    </aside>
    <main className="main-content">{children}</main>
    <button className="quick-add" onClick={onQuickAdd} aria-label="Adicionar lançamento"><Icon name="plus" size={26} /><span>Novo lançamento</span></button>
    <nav aria-label="Navegação principal" className="bottom-nav">
      {navigation.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={activePage === item.id ? 'active' : ''}><Icon name={item.icon} /><span>{item.label}</span></button>)}
    </nav>
  </div>
}
