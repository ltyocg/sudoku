import './index.css'
import App from './App.tsx'
import {createRoot} from 'react-dom/client'
import {StrictMode} from 'react'

const root = document.getElementById('root') as HTMLDivElement
root.innerHTML = ''
createRoot(root).render(
  <StrictMode>
    <App/>
  </StrictMode>
)