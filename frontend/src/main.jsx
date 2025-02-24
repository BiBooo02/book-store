import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BooksContextProvider } from './context/BookContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BooksContextProvider>
      <App />
    </BooksContextProvider>
  </StrictMode>,
)
