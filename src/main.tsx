import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/index.scss'
import App from './App.tsx'

console.log('%cdrag-vue-form by zeMing ✨', 
  'color:#7c3aed; font-size:16px; font-weight:bold;'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
