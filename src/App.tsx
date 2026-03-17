import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import IntroSection from './components/IntroSection'
import ServicesSection from './components/ServicesSection'
import ContactBlock from './components/ContactBlock'
import WhyRARSection from './components/WhyRARSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function App() {
  const [isContactCollapsed, setIsContactCollapsed] = useState(false)
  const [navHeight, setNavHeight] = useState(65)

  useEffect(() => {
    const sentinel = document.getElementById('contact-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsContactCollapsed(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex flex-col gap-[100px]" style={{ paddingTop: navHeight }}>
        {/* Hero + Contact : un seul bloc pour que le contact chevauche le hero */}
        <div>
          <Hero />
          <div id="contact-sentinel" className="h-0" aria-hidden />
          <div className="px-6 pb-16">
            <ContactBlock />
          </div>
        </div>

        {/* Bandeau au scroll : mail + téléphone + invitation */}
        <div
          className="fixed inset-x-0 z-30 transition-transform duration-300"
          style={{
            top: navHeight,
            transform: isContactCollapsed
              ? 'translateY(0)'
              : `translateY(calc(-100% - ${navHeight}px))`,
          }}
        >
          <button
            type="button"
            className="flex w-full flex-col items-center justify-center gap-2 border-b border-slate-100 bg-white/95 px-4 py-3 text-center text-sm text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur hover:bg-slate-50 hover:text-slate-900 sm:flex-row sm:gap-4"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <span className="leading-tight">Un projet, une question ? Contactez-moi :</span>
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
              <a
                href="tel:0652212017"
                className="font-medium text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                06 52 21 20 17
              </a>
              <span className="hidden text-slate-300 sm:inline">·</span>
              <a
                href="mailto:adrienrenard@gmail.com"
                className="font-medium text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                adrienrenard@gmail.com
              </a>
            </div>
          </button>
        </div>

        <IntroSection />
        <ServicesSection />
        <WhyRARSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App
