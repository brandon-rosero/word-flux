import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContext from './context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppContext>
  </StrictMode>,
)
