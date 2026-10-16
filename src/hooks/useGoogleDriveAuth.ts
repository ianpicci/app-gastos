import { useEffect, useState } from 'react'
import {
  connectGoogleDrive,
  disconnectGoogleDrive,
  getGoogleDriveAuthorizationState,
  subscribeToGoogleDriveAuthorization,
} from '../services/googleDriveAuth'

export function useGoogleDriveAuth() {
  const [state, setState] = useState(getGoogleDriveAuthorizationState)

  useEffect(() => subscribeToGoogleDriveAuthorization(setState), [])

  return { ...state, connectGoogleDrive, disconnectGoogleDrive }
}
