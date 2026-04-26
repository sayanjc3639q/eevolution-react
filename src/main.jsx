import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

// Initialize the Caching Engine (Query Client)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes: Data is considered fresh for 10 mins
      gcTime: 1000 * 60 * 60 * 24, // 24 hours: Keep in memory cache for a day
      refetchOnWindowFocus: false, // Don't refetch every time user clicks the window
      retry: 1, // Retry failed calls once
    },
  },
});

// Theme Initialization
const savedTheme = localStorage.getItem('theme') || 'dark';
const savedColor = localStorage.getItem('accent-color') || '#0ea5e9';
document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.style.setProperty('--accent-color', savedColor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
