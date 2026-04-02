import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import Button from './Button'

function useIsAvailable() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    function check() {
      const now = new Date()
      const day = now.getDay() // 0 = dim, 6 = sam
      const hour = now.getHours()
      setAvailable(day >= 1 && day <= 5 && hour >= 8 && hour < 18)
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  return available
}

// TODO: remplacer par tes identifiants EmailJS
const EMAILJS_SERVICE_ID = 'service_zlgy2mr'
const EMAILJS_TEMPLATE_ID = 'template_krv23ns'
const EMAILJS_PUBLIC_KEY = 'dGpc3mcK6MyBNAXvS'

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setStatus('sending')
    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus('sent')
        formRef.current?.reset()
      })
      .catch(() => {
        setStatus('error')
      })
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-8 py-8 text-center">
        <span className="text-3xl">✅</span>
        <p className="text-lg font-semibold text-slate-900">
          Merci pour votre message !
        </p>
        <p className="text-sm text-slate-500">
          Nous reviendrons vers vous rapidement.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 py-8">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="prenom"
          required
          placeholder="Prénom"
          className="h-10 rounded-md border border-slate-200 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="text"
          name="nom"
          required
          placeholder="Nom"
          className="h-10 rounded-md border border-slate-200 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <input
        type="email"
        name="email"
        required
        placeholder="Votre email"
        className="h-10 rounded-md border border-slate-200 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <textarea
        name="message"
        rows={3}
        required
        placeholder="Décrivez votre projet…"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
      {status === 'error' && (
        <p className="text-xs text-red-500">Une erreur est survenue. Veuillez réessayer.</p>
      )}
      <Button type="submit" disabled={status === 'sending'} className="w-full justify-center">
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </Button>
    </form>
  )
}

export default function ContactBlock() {
  const available = useIsAvailable()

  return (
    <section
      id="contact"
      className="relative z-20 mx-auto -mt-12 max-w-5xl rounded-2xl bg-white px-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="grid divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* Gauche — infos de contact */}
        <div className="flex flex-col gap-5 px-8 py-8">
          <div className="flex items-center gap-2">
            <span
              className={`relative flex h-3 w-3 ${available ? 'text-green-500' : 'text-slate-400'}`}
            >
              {available && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-3 w-3 rounded-full ${available ? 'bg-green-500' : 'bg-slate-400'}`}
              />
            </span>
            <span className="text-xs font-medium text-slate-500">
              {available ? 'Actuellement disponible' : 'Actuellement indisponible'}
            </span>
          </div>

          <div>
            <p className="text-lg font-semibold text-slate-900">
              Du lundi au vendredi
            </p>
            <p className="text-lg font-semibold text-slate-900">
              de 8h00 à 18h00
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="tel:0652212017"
              className="group inline-flex items-center gap-2 font-semibold text-slate-900 underline decoration-slate-900 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white transition-colors group-hover:bg-primary group-hover:text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </span>
              06 52 21 20 17
            </a>
            <a
              href="mailto:contact@adrienrenard.fr"
              className="group inline-flex items-center gap-2 font-semibold text-slate-900 underline decoration-slate-900 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white transition-colors group-hover:bg-primary group-hover:text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </span>
              contact@adrienrenard.fr
            </a>
          </div>
        </div>

        {/* Droite — formulaire */}
        <ContactForm />
      </div>
    </section>
  )
}
