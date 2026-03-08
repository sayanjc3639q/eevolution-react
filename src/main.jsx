import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Theme Initialization
const savedTheme = localStorage.getItem('theme') || 'dark';
const savedColor = localStorage.getItem('accent-color') || '#0ea5e9';
document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.style.setProperty('--accent-color', savedColor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
