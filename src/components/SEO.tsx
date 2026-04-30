import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://adrienrenard.fr'
const SITE_NAME = 'R.A.R — Rénovation Adrien Renard'
const DEFAULT_DESCRIPTION =
  'Adrien Renard, artisan en rénovation intérieure et électricité. Cuisines, salles de bains, sols, peinture, mise aux normes électriques. Devis gratuit.'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

const TITLE_MAX = 60
const DESCRIPTION_MAX = 155

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).trimEnd() + '…'
}

type SEOProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
}: SEOProps) {
  const fullTitle = title ? truncate(`${title} | ${SITE_NAME}`, TITLE_MAX) : SITE_NAME
  const finalDescription = truncate(description ?? DEFAULT_DESCRIPTION, DESCRIPTION_MAX)
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const finalImage = image ?? DEFAULT_OG_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:image" content={finalImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  )
}
