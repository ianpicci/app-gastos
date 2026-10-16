import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function PwaUpdatePrompt({ isFormOpen }: { isFormOpen: boolean }) {
  const [hasUpdate, setHasUpdate] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const updateServiceWorker = useRef<ReturnType<typeof registerSW> | null>(null)

  useEffect(() => {
    updateServiceWorker.current = registerSW({
      immediate: true,
      onNeedRefresh() { setHasUpdate(true) },
    })
  }, [])

  if (!hasUpdate || dismissed || isFormOpen) return null

  return <aside className="pwa-update-prompt" role="status"><div><strong>Atualização disponível</strong><p>Uma nova versão está pronta. Atualize quando terminar.</p></div><div><button onClick={() => setDismissed(true)}>Mais tarde</button><button className="update-now" onClick={() => void updateServiceWorker.current?.(true)}>Atualizar</button></div></aside>
}
