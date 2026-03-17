import { useCallback, useEffect, useState } from 'react'
import Button from './Button'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const close = useCallback(() => setMobileOpen(false), [])
  const toggle = useCallback(() => setMobileOpen((v) => !v), [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close])

  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-40 border-b border-slate-100 bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.06)] backdrop-blur"
    >
      <div
        id="site-header-bar"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3"
      >
        <a href="#" className="flex items-center gap-3">
          {/* Logo : dépose logo.svg ou logo.png dans src/assets puis ajoute : import logo from '../assets/logo.svg' et <img src={logo} alt="R.A.R" className="h-10 w-10 object-contain" /> */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            R.A.R
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Adrien Renard Rénovation
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#apropos" className="hover:text-slate-900">À propos</a>
          <a href="#services" className="hover:text-slate-900">Nos services</a>
          <a href="#realisations" className="hover:text-slate-900">Réalisations</a>
          <a href="#contact" className="hover:text-slate-900">Contact</a>
        </nav>

        {/* Burger (mobile) */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white/70 text-slate-900 shadow-sm backdrop-blur transition-colors hover:bg-white md:hidden"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={toggle}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-nav"
        className={`md:hidden ${mobileOpen ? 'block' : 'hidden'}`}
      >
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <a href="#apropos" className="rounded-md px-3 py-2 hover:bg-slate-50 hover:text-slate-900" onClick={close}>
                À propos
              </a>
              <a href="#services" className="rounded-md px-3 py-2 hover:bg-slate-50 hover:text-slate-900" onClick={close}>
                Nos services
              </a>
              <a href="#realisations" className="rounded-md px-3 py-2 hover:bg-slate-50 hover:text-slate-900" onClick={close}>
                Réalisations
              </a>
              <a href="#contact" className="rounded-md px-3 py-2 hover:bg-slate-50 hover:text-slate-900" onClick={close}>
                Contact
              </a>
            </div>

            <div className="mt-4">
              <Button as="a" href="#contact" className="w-full justify-center" onClick={close}>
                Demander un devis
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
