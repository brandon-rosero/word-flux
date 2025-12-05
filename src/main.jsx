import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContext from './context'
import { AuthProvider } from './AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppContext>
        <BrowserRouter basename="/word-flux">
          <App />
        </BrowserRouter>
      </AppContext>
    </AuthProvider>
  </StrictMode>,
)
