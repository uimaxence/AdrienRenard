import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import RealisationsPage from './pages/RealisationsPage'
import RealisationDetailPage from './pages/RealisationDetailPage'

function App() {
  const [navHeight, setNavHeight] = useState(65)
  const location = useLocation()

  useEffect(() => {
    function update() {
      const header = document.getElementById('site-header-bar')
      if (!header) return
      // Évite les décalages d’1px (hauteur en sub-pixels sur mobile)
      setNavHeight(Math.ceil(header.getBoundingClientRect().height))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Réinitialise la position au changement de page
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white font-sans text-slate-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage navHeight={navHeight} />} />
        <Route path="/realisations" element={<RealisationsPage navHeight={navHeight} />} />
        <Route path="/realisations/:slug" element={<RealisationDetailPage navHeight={navHeight} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
