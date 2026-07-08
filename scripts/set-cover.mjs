/**
 * Définit l'image de couverture d'une réalisation Contentful.
 * Usage :
 *   CONTENTFUL_MANAGEMENT_TOKEN=xxx TARGET_SLUG=... COVER_FILE=... COVER_ALT="..." \
 *     node scripts/set-cover.mjs
 */
import { createClient } from 'contentful-management'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const SPACE_ID = 'fnejam0y3rn1'
const ENVIRONMENT = 'master'
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SLUG = process.env.TARGET_SLUG
const FILE = process.env.COVER_FILE
const ALT = process.env.COVER_ALT || 'Réalisation Adrien Renard'

if (!CMA_TOKEN || !SLUG || !FILE) {
  console.error('❌ Requiert CONTENTFUL_MANAGEMENT_TOKEN, TARGET_SLUG, COVER_FILE')
  process.exit(1)
}

const mime = FILE.endsWith('.webp')
  ? 'image/webp'
  : FILE.endsWith('.png')
    ? 'image/png'
    : 'image/jpeg'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const client = createClient(
  { accessToken: CMA_TOKEN },
  { type: 'plain', defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT } },
)

const locales = await client.locale.getMany({ query: { limit: 100 } })
const LOC = (locales.items.find((l) => l.default) || locales.items[0]).code

const entries = await client.entry.getMany({
  query: { content_type: 'realisation', 'fields.slug': SLUG, limit: 1 },
})
const entry = entries.items[0]
if (!entry) {
  console.error(`❌ Aucune réalisation avec le slug "${SLUG}"`)
  process.exit(1)
}
console.log(`Entrée trouvée : ${entry.fields.title?.[LOC]}`)

// 1) upload + asset
const upload = await client.upload.create({}, { file: readFileSync(FILE) })
let asset = await client.asset.create(
  {},
  {
    fields: {
      title: { [LOC]: ALT },
      description: { [LOC]: ALT },
      file: {
        [LOC]: {
          contentType: mime,
          fileName: basename(FILE),
          uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
        },
      },
    },
  },
)
asset = await client.asset.processForAllLocales({}, asset)
for (let t = 0; t < 12 && !asset.fields.file?.[LOC]?.url; t++) {
  await sleep(1500)
  asset = await client.asset.get({ assetId: asset.sys.id })
}
asset = await client.asset.publish({ assetId: asset.sys.id }, asset)
console.log('Asset publié :', asset.sys.id)

// 2) met à jour coverImage de l'entrée + republie
let fresh = await client.entry.get({ entryId: entry.sys.id })
fresh.fields.coverImage = {
  [LOC]: { sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } },
}
fresh = await client.entry.update({ entryId: entry.sys.id }, fresh)
await client.entry.publish({ entryId: entry.sys.id }, fresh)
console.log(`✅ Couverture définie pour "${fresh.fields.title?.[LOC]}"`)
