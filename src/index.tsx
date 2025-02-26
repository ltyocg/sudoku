import './index.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {AppStateProvider} from './useAppState.tsx'

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <AppStateProvider>
      <App/>
    </AppStateProvider>
  </StrictMode>
)