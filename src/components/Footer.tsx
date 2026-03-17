export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white pt-[100px]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 sm:gap-8">
          <a href="#apropos" className="hover:text-slate-900">
            À propos
          </a>
          <a href="#services" className="hover:text-slate-900">
            Nos services
          </a>
          <a href="#realisations" className="hover:text-slate-900">
            Réalisations
          </a>
          <a href="#contact" className="hover:text-slate-900">
            Contact
          </a>
          <a href="#mentions-legales" className="hover:text-slate-900">
            Mentions légales
          </a>
        </nav>
      </div>
      <div className="px-6 pb-8 pt-4">
        <p
          className="text-center font-bold tracking-tight text-slate-900"
          style={{ fontSize: 'clamp(3rem, 15vw, 10rem)', lineHeight: 0.95 }}
          aria-hidden
        >
          Adrien Renard
        </p>
      </div>
    </footer>
  )
}
