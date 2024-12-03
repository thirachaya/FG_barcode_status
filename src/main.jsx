import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import { PlantProvider } from './pages/PlantContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlantProvider> 
      <App />
    </PlantProvider>
  </StrictMode>,
)

