import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  return (
    <ThemeProvider>
      <>
        {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
        {currentPage === 'auth' && <LoginPage />}
      </>
    </ThemeProvider>
  )
}

export default App