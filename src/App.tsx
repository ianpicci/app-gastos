import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { QuickAddModal } from './components/QuickAddModal'
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt'
import { ensureDefaultCategories } from './db/categories'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { SettingsPage } from './pages/SettingsPage'
import type { PageId, TransactionWithCategory } from './types/finance'

const validPages: PageId[] = ['home', 'history', 'analytics', 'settings']
function getPageFromHash(): PageId { const page = window.location.hash.replace('#/', '') as PageId; return validPages.includes(page) ? page : 'home' }

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getPageFromHash)
  const [isQuickAddOpen, setQuickAddOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithCategory | null>(null)
  useEffect(() => { const sync = () => setActivePage(getPageFromHash()); window.addEventListener('hashchange', sync); return () => window.removeEventListener('hashchange', sync) }, [])
  useEffect(() => { void ensureDefaultCategories() }, [])
  const navigate = (page: PageId) => { window.location.hash = `/${page}` }
  const page = { home: <HomePage onSelectTransaction={setSelectedTransaction} />, history: <HistoryPage onSelectTransaction={setSelectedTransaction} />, analytics: <AnalyticsPage />, settings: <SettingsPage /> }[activePage]
  const isFormOpen = isQuickAddOpen || selectedTransaction !== null
  return <><Layout activePage={activePage} onNavigate={navigate} onQuickAdd={() => setQuickAddOpen(true)}>{page}{isFormOpen && <QuickAddModal transaction={selectedTransaction ?? undefined} onClose={() => { setQuickAddOpen(false); setSelectedTransaction(null) }} />}</Layout><PwaUpdatePrompt isFormOpen={isFormOpen} /></>
}
