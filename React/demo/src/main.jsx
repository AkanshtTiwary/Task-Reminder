import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// jsx means javascript + html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* App component will render the entire application */}
  </StrictMode>,
)
