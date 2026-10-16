import { useRef, useState } from 'react'
import { createBackup, createTransactionsCsv, restoreBackup, validateBackup } from '../db/backup'
import { useGoogleDriveAuth } from '../hooks/useGoogleDriveAuth'
import type { BackupPreview } from '../types/backup'
import { getLocalDateValue } from '../utils/dates'
import { downloadFile } from '../utils/downloads'

export function BackupActions() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<BackupPreview | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const { status: googleDriveStatus, message: googleDriveMessage, connectGoogleDrive, disconnectGoogleDrive } = useGoogleDriveAuth()

  async function exportBackup() {
    setError('')
    try {
      const backup = await createBackup()
      downloadFile(JSON.stringify(backup, null, 2), `app-gastos-backup-${getLocalDateValue()}.json`, 'application/json')
      setMessage('Backup JSON preparado para salvar.')
    } catch {
      setError('Não foi possível criar o backup. Tente novamente.')
    }
  }

  async function exportCsv() {
    setError('')
    try {
      downloadFile(await createTransactionsCsv(), `app-gastos-lancamentos-${getLocalDateValue()}.csv`, 'text/csv;charset=utf-8')
      setMessage('Arquivo CSV preparado para salvar.')
    } catch {
      setError('Não foi possível criar o CSV. Tente novamente.')
    }
  }

  async function inspectBackup(file: File) {
    setError('')
    setMessage('')
    try {
      const parsed = JSON.parse(await file.text()) as unknown
      setPreview(validateBackup(parsed))
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'Não foi possível ler este arquivo de backup.')
    }
  }

  async function confirmRestore() {
    if (!preview) return
    setIsRestoring(true)
    setError('')
    try {
      await restoreBackup(preview.backup)
      setMessage(`Backup restaurado: ${preview.transactionCount} lançamentos e ${preview.categoryCount} categorias.`)
      setPreview(null)
    } catch {
      setError('Não foi possível restaurar o backup. Nenhum dado foi alterado.')
    } finally {
      setIsRestoring(false)
    }
  }

  async function authorizeGoogleDrive() {
    try {
      await connectGoogleDrive()
    } catch {
      // The authorization service exposes a user-facing status message.
    }
  }

  const isAuthorizing = googleDriveStatus === 'authorizing'
  const isConnected = googleDriveStatus === 'connected'

  return (
    <section className="backup-section">
      <div className="section-heading"><div><p className="eyebrow">Dados locais</p><h2>Backup e exportação</h2></div></div>
      <section className="drive-auth-card" aria-labelledby="google-drive-title">
        <div className="drive-auth-heading"><div><p className="eyebrow">Google Drive</p><h3 id="google-drive-title">Conexão para backup</h3></div><span className={`drive-status drive-status--${googleDriveStatus}`}>{isConnected ? 'Autorizado' : isAuthorizing ? 'Autorizando' : googleDriveStatus === 'expired' ? 'Expirado' : 'Desconectado'}</span></div>
        <p className="drive-auth-copy" role="status">{googleDriveMessage}</p>
        {isConnected ? <button className="secondary-button drive-auth-button" onClick={disconnectGoogleDrive}>Desconectar Google Drive</button> : <button className="primary-button drive-auth-button" onClick={() => void authorizeGoogleDrive()} disabled={isAuthorizing}>{isAuthorizing ? 'Abrindo autorização…' : googleDriveStatus === 'expired' ? 'Renovar autorização' : 'Conectar Google Drive'}</button>}
      </section>
      <div className="backup-actions"><button onClick={() => void exportBackup()}><span><strong>Exportar backup</strong><small>Arquivo JSON completo</small></span><b>↓</b></button><button onClick={() => fileInput.current?.click()}><span><strong>Restaurar backup</strong><small>Importar arquivo JSON</small></span><b>↑</b></button><button onClick={() => void exportCsv()}><span><strong>Exportar CSV</strong><small>Lançamentos para Excel</small></span><b>↓</b></button></div>
      <input ref={fileInput} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void inspectBackup(file) }} />
      {message && <p className="backup-message" role="status">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}
      {preview && <div className="modal-backdrop" role="presentation"><section className="backup-modal" role="dialog" aria-modal="true" aria-labelledby="backup-preview"><p className="eyebrow">Prévia da restauração</p><h2 id="backup-preview">Restaurar este backup?</h2><p className="backup-preview-copy">Gerado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(preview.backup.generatedAt))}.</p><div className="backup-counts"><strong>{preview.transactionCount}<small>lançamentos</small></strong><strong>{preview.categoryCount}<small>categorias</small></strong></div><p className="backup-warning">Os registros com o mesmo ID serão atualizados. Os demais dados locais serão mantidos, sem criar duplicados.</p><div className="backup-confirm-actions"><button className="secondary-button" onClick={() => setPreview(null)} disabled={isRestoring}>Cancelar</button><button className="primary-button" onClick={() => void confirmRestore()} disabled={isRestoring}>{isRestoring ? 'Restaurando…' : 'Confirmar restauração'}</button></div></section></div>}
    </section>
  )
}
