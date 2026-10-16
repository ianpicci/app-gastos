import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { QuickAddModal } from './components/QuickAddModal'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { SettingsPage } from './pages/SettingsPage'
import type { PageId } from './types/finance'

const validPages: PageId[] = ['home', 'history', 'analytics', 'settings']
function getPageFromHash(): PageId { const page = window.location.hash.replace('#/', '') as PageId; return validPages.includes(page) ? page : 'home' }

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getPageFromHash)
  const [isQuickAddOpen, setQuickAddOpen] = useState(false)
  useEffect(() => { const sync = () => setActivePage(getPageFromHash()); window.addEventListener('hashchange', sync); return () => window.removeEventListener('hashchange', sync) }, [])
  const navigate = (page: PageId) => { window.location.hash = `/${page}` }
  const page = { home: <HomePage />, history: <HistoryPage />, analytics: <AnalyticsPage />, settings: <SettingsPage /> }[activePage]
  return <Layout activePage={activePage} onNavigate={navigate} onQuickAdd={() => setQuickAddOpen(true)}>{page}{isQuickAddOpen && <QuickAddModal onClose={() => setQuickAddOpen(false)} />}</Layout>
}
