const GOOGLE_IDENTITY_SERVICES_URL = 'https://accounts.google.com/gsi/client'

export const GOOGLE_DRIVE_APPDATA_SCOPE = 'https://www.googleapis.com/auth/drive.appdata'

export type GoogleDriveAuthorizationStatus = 'disconnected' | 'authorizing' | 'connected' | 'expired' | 'error'

export interface GoogleDriveAuthorizationState {
  status: GoogleDriveAuthorizationStatus
  message: string
}

interface GoogleTokenResponse {
  access_token?: string
  error?: string
  error_description?: string
  expires_in?: string | number
}

interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void
}

interface GoogleIdentityServices {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string
        scope: string
        callback: (response: GoogleTokenResponse) => void
        error_callback: (error: { type?: string }) => void
      }) => GoogleTokenClient
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentityServices
  }
}

type Listener = (state: GoogleDriveAuthorizationState) => void

let expirationTimer: ReturnType<typeof setTimeout> | undefined
let scriptLoader: Promise<GoogleIdentityServices> | undefined
let authorizationState: GoogleDriveAuthorizationState = { status: 'disconnected', message: 'Nenhuma autorização ativa nesta sessão.' }
const listeners = new Set<Listener>()

function updateState(nextState: GoogleDriveAuthorizationState) {
  authorizationState = nextState
  listeners.forEach((listener) => listener(authorizationState))
}

function clearAuthorization() {
  if (expirationTimer) window.clearTimeout(expirationTimer)
  expirationTimer = undefined
}

function authorizationErrorMessage(errorType?: string) {
  if (errorType === 'popup_failed_to_open') return 'Não foi possível abrir a janela de autorização. Permita pop-ups e tente novamente.'
  if (errorType === 'popup_closed') return 'A autorização foi cancelada.'
  return 'Não foi possível autorizar o Google Drive. Tente novamente.'
}

function getGoogleIdentityServices() {
  if (window.google?.accounts.oauth2) return Promise.resolve(window.google)
  if (!navigator.onLine) return Promise.reject(new Error('Conecte-se à internet para autorizar o Google Drive.'))
  if (scriptLoader) return scriptLoader

  scriptLoader = new Promise<GoogleIdentityServices>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-identity-services]')
    const script = existingScript ?? document.createElement('script')
    let settled = false
    const finish = (callback: () => void) => { if (!settled) { settled = true; callback() } }
    const timeout = window.setTimeout(() => finish(() => reject(new Error('O serviço de autorização demorou para responder.'))), 15000)
    const onLoad = () => finish(() => {
      window.clearTimeout(timeout)
      if (window.google?.accounts.oauth2) resolve(window.google)
      else reject(new Error('O serviço de autorização não foi carregado corretamente.'))
    })
    const onError = () => finish(() => {
      window.clearTimeout(timeout)
      reject(new Error('Não foi possível carregar o serviço de autorização do Google.'))
    })

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
    if (!existingScript) {
      script.src = GOOGLE_IDENTITY_SERVICES_URL
      script.async = true
      script.defer = true
      script.dataset.googleIdentityServices = 'true'
      document.head.appendChild(script)
    }
  }).catch((error: unknown) => {
    scriptLoader = undefined
    throw error
  })

  return scriptLoader
}

export function getGoogleDriveAuthorizationState() {
  return authorizationState
}

export function subscribeToGoogleDriveAuthorization(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function connectGoogleDrive() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
  if (!clientId) {
    const error = new Error('A configuração VITE_GOOGLE_CLIENT_ID não está disponível neste ambiente.')
    updateState({ status: 'error', message: error.message })
    throw error
  }

  updateState({ status: 'authorizing', message: 'Aguardando autorização do Google…' })
  try {
    const google = await getGoogleIdentityServices()
    await new Promise<void>((resolve, reject) => {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_DRIVE_APPDATA_SCOPE,
        callback: (response) => {
          if (!response.access_token || response.error) {
            const message = response.error_description || 'A autorização não foi concluída.'
            updateState({ status: 'error', message })
            reject(new Error(message))
            return
          }

          const expiresInMilliseconds = Math.max(1, Number(response.expires_in ?? 3600)) * 1000
          expirationTimer = window.setTimeout(() => {
            clearAuthorization()
            updateState({ status: 'expired', message: 'A autorização expirou. Conecte-se novamente para renovar.' })
          }, expiresInMilliseconds)
          updateState({ status: 'connected', message: 'Google Drive autorizado. Nenhum backup foi enviado.' })
          resolve()
        },
        error_callback: (error) => {
          const message = authorizationErrorMessage(error.type)
          updateState({ status: 'error', message })
          reject(new Error(message))
        },
      })
      tokenClient.requestAccessToken({ prompt: 'consent' })
    })
  } catch (error) {
    clearAuthorization()
    if (authorizationState.status !== 'error') {
      const message = error instanceof Error ? error.message : 'Não foi possível autorizar o Google Drive.'
      updateState({ status: 'error', message })
    }
    throw error
  }
}

export function disconnectGoogleDrive() {
  clearAuthorization()
  updateState({ status: 'disconnected', message: 'Conexão encerrada. Nenhum backup foi alterado.' })
}
