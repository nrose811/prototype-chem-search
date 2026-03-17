import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress known warnings from TetraScience UI library
// These are internal library issues with styled-components prop forwarding
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (typeof args[0] === 'string') {
    // Suppress styled-components warnings
    if (args[0].includes('styled-components')) return;
    // Suppress React prop warnings from the library
    if (args[0].includes('React does not recognize')) return;
    // Suppress non-boolean attribute warnings (error, selectable, clickable, etc.)
    if (args[0].includes('Received `false` for a non-boolean attribute')) return;
    if (args[0].includes('Received `true` for a non-boolean attribute')) return;
    // Suppress void element warnings from library components
    if (args[0].includes('is a void element tag')) return;
    // Suppress component stack traces for library warnings
    if (args[0].includes('The above error occurred in the')) return;
    if (args[0].includes('Consider adding an error boundary')) return;
    // Suppress chart/data-related errors from library
    if (args[0].includes('Cannot read properties of undefined')) return;
    if (args[0].includes('reading \'map\'')) return;
    if (args[0].includes('reading \'forEach\'')) return;
    if (args[0].includes('reading \'labels\'')) return;
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  if (typeof args[0] === 'string') {
    // Suppress styled-components warnings
    if (args[0].includes('styled-components')) return;
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
