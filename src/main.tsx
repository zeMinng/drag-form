import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { APP_TITLE_UP } from './constants/index.ts'
import './index.css'
import './styles/index.scss'
import App from './App.tsx'

console.log(`%c${APP_TITLE_UP} by zeMing ✨`, 
  'color:#7c3aed; font-size:16px; font-weight:bold;'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
