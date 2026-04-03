import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import StoreContextProvider from './Context/StoreContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </HashRouter>
  </StrictMode>
)
