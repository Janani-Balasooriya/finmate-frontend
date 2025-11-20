import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress browser extension runtime errors
if (typeof window !== 'undefined') {
  // Override console.error to filter out extension errors and accessibility warnings
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('Extension context invalidated') ||
        message.includes('runtime.lastError') ||
        message.includes('message channel closed') ||
        message.includes('Unchecked runtime.lastError') ||
        message.includes('A listener indicated an asynchronous response') ||
        message.includes('Blocked aria-hidden on an element because its descendant retained focus')) {
      return; // Suppress these errors
    }
    originalConsoleError.apply(console, args);
  };

  // Suppress runtime errors
  window.addEventListener('error', (event) => {
    if (event.message.includes('Extension context invalidated') ||
        event.message.includes('runtime.lastError') ||
        event.message.includes('message channel closed') ||
        event.message.includes('Unchecked runtime.lastError') ||
        event.message.includes('A listener indicated an asynchronous response')) {
      event.preventDefault();
      return false;
    }
  });

  // Suppress unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'string' &&
        (event.reason.includes('Extension context invalidated') ||
         event.reason.includes('runtime.lastError') ||
         event.reason.includes('message channel closed') ||
         event.reason.includes('Unchecked runtime.lastError') ||
         event.reason.includes('A listener indicated an asynchronous response'))) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
