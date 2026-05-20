import { useEffect } from 'react'
import { Toaster } from 'sonner'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/layout/ScrollToTop'

function App() {
  useEffect(() => {
    // Restore saved theme preference globally on initial mount
    const savedTheme = localStorage.getItem('printcraft-theme')
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
