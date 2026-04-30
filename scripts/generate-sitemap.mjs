import { createClient } from 'contentful'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env.local') })
config({ path: resolve(__dirname, '..', '.env') })

const SITE_URL = 'https://adrienrenard.fr'

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function fetchRealisations() {
  const space = process.env.VITE_CONTENTFUL_SPACE_ID
  const accessToken = process.env.VITE_CONTENTFUL_DELIVERY_TOKEN
  const environment = process.env.VITE_CONTENTFUL_ENVIRONMENT ?? 'master'

  if (!space || !accessToken) {
    console.warn('[sitemap] Contentful non configuré, sitemap statique généré.')
    return []
  }

  const client = createClient({ space, accessToken, environment })
  const res = await client.getEntries({
    content_type: 'realisation',
    limit: 500,
  })

  return (res.items ?? []).map((it) => {
    const fields = it.fields ?? {}
    const slug = typeof fields.slug === 'string' ? fields.slug : slugify(fields.title ?? '')
    const updatedAt = it.sys?.updatedAt ?? new Date().toISOString()
    return { slug, updatedAt }
  })
}

function urlEntry(loc, lastmod, priority, changefreq) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  const today = new Date().toISOString().split('T')[0]
  const realisations = await fetchRealisations()

  const urls = [
    urlEntry(`${SITE_URL}/`, today, '1.0', 'monthly'),
    urlEntry(`${SITE_URL}/realisations`, today, '0.8', 'weekly'),
    ...realisations
      .filter((r) => r.slug)
      .map((r) =>
        urlEntry(
          `${SITE_URL}/realisations/${r.slug}`,
          r.updatedAt.split('T')[0],
          '0.7',
          'monthly',
        ),
      ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

  const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outPath, xml, 'utf8')
  console.log(`[sitemap] ${urls.length} URLs écrites dans ${outPath}`)
}

main().catch((err) => {
  console.error('[sitemap] Erreur:', err)
  process.exit(1)
})
