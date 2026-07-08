/**
 * Import des réalisations dans Contentful (photos + entrées + rich text).
 *
 * PRÉREQUIS : un token de gestion (Content Management API), différent de la clé
 * de lecture. Créez-le sur https://app.contentful.com → Settings → API keys →
 * "Content management tokens" → Generate personal token.
 *
 * USAGE :
 *   npm i -D contentful-management
 *   CONTENTFUL_MANAGEMENT_TOKEN=xxxxx node scripts/import-realisations.mjs
 *
 * Les photos sont lues depuis ~/Downloads/adrienrenard-realisations/<catégorie>/
 * (dossier produit lors du scraping). Idempotent : une entrée dont le slug existe
 * déjà est ignorée.
 */
import { createClient } from 'contentful-management'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'fnejam0y3rn1'
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const PHOTOS_DIR = join(homedir(), 'Downloads', 'adrienrenard-realisations')

if (!CMA_TOKEN) {
  console.error('❌ Renseignez CONTENTFUL_MANAGEMENT_TOKEN (token de gestion, pas la clé de lecture).')
  process.exit(1)
}

// Construit un document Rich Text à partir de titres/paragraphes.
const text = (value) => ({ nodeType: 'text', value, marks: [], data: {} })
const para = (value) => ({ nodeType: 'paragraph', data: {}, content: [text(value)] })
const h2 = (value) => ({ nodeType: 'heading-2', data: {}, content: [text(value)] })
const richText = (blocks) => ({ nodeType: 'document', data: {}, content: blocks })

// --- CONTENU DES RÉALISATIONS (une entrée par galerie) ---
const REALISATIONS = [
  {
    folder: 'cuisines',
    title: 'Rénovation et installation de cuisines',
    slug: 'renovation-cuisines-angers',
    category: 'Aménagement sur-mesure',
    altBase: 'Cuisine rénovée dans le Maine-et-Loire',
    description:
      'Création et rénovation de cuisines dans le Maine-et-Loire : îlot central, plan de travail, crédence et électroménager, de la dépose aux finitions.',
    body: [
      h2('Des cuisines fonctionnelles, posées dans les règles de l’art'),
      para(
        'De la dépose de l’ancienne cuisine jusqu’aux finitions, je conçois et installe des cuisines durables partout dans le Maine-et-Loire. Meubles blancs ou gris mat, îlot central, plan de travail en bois, crédence, raccordements électriques et plomberie : chaque projet est pensé selon votre espace, vos usages et votre budget.',
      ),
      para(
        'Les photos avant / après témoignent d’une transformation complète, réalisée dans les délais annoncés et avec un souci constant du détail.',
      ),
    ],
  },
  {
    folder: 'salons-salles-a-manger',
    title: 'Rénovation de salons et salles à manger',
    slug: 'renovation-salon-salle-a-manger',
    category: 'Travaux intérieurs',
    altBase: 'Séjour rénové à Angers',
    description:
      'Rénovation de séjours à Angers : pierre apparente, création de mezzanine, escalier métal et bois, parquet à chevrons et carrelage.',
    body: [
      h2('Redonner du caractère à la pièce de vie'),
      para(
        'Le séjour est le cœur de la maison : je lui redonne lumière et caractère. Mise en valeur d’une cheminée en pierre apparente, création d’une mezzanine avec escalier métal et bois, pose de parquet à chevrons ou de carrelage, peinture et éclairage : autant d’interventions qui métamorphosent la pièce de vie.',
      ),
      para('Chaque chantier est mené avec soin, du conseil initial jusqu’à la réception.'),
    ],
  },
  {
    folder: 'sanitaires',
    title: 'Rénovation de WC et sanitaires',
    slug: 'renovation-wc-sanitaires',
    category: 'Travaux intérieurs',
    altBase: 'WC rénové dans le Maine-et-Loire',
    description:
      'Installation de WC suspendus et rénovation de sanitaires dans le Maine-et-Loire : faïence contemporaine, sol PVC, finitions soignées.',
    body: [
      h2('Un espace petit, un soin maximal'),
      para(
        'Pose de WC suspendus, habillage en faïence contemporaine, sol PVC imitation bois, ventilation et raccordements : je rénove vos sanitaires entièrement, avec des matériaux durables et une finition impeccable.',
      ),
    ],
  },
  {
    folder: 'chambres',
    title: 'Rénovation de chambres',
    slug: 'renovation-chambres',
    category: 'Travaux intérieurs',
    altBase: 'Chambre rénovée dans le Maine-et-Loire',
    description:
      'Rénovation de chambres à Angers : placards sur-mesure, parquet, peinture et isolation pour un espace sain et reposant.',
    body: [
      h2('Une chambre saine et reposante'),
      para(
        'Je m’occupe de tout : pose de placards coulissants, revêtement de sol en parquet stratifié, peinture, isolation et éclairage. Un espace optimisé et chaleureux, adapté à votre mode de vie.',
      ),
    ],
  },
  {
    folder: 'exterieurs',
    title: 'Terrasses, portails et abris — aménagements extérieurs',
    slug: 'amenagements-exterieurs-terrasses-portails',
    category: 'Aménagements extérieurs',
    altBase: 'Aménagement extérieur dans le Maine-et-Loire',
    description:
      'Aménagements extérieurs dans le Maine-et-Loire : terrasses bois, portail automatisé, abris de stockage, dalles et escaliers béton.',
    body: [
      h2('La rénovation ne s’arrête pas à la porte d’entrée'),
      para(
        'Je réalise vos aménagements extérieurs : terrasses en bois sur structure, dalles et chapes béton, escaliers extérieurs, pose de portail coulissant automatisé et montage d’abris de stockage.',
      ),
      para('Des ouvrages robustes, pensés pour durer et valoriser votre propriété.'),
    ],
  },
  {
    folder: 'tableaux-electriques',
    title: 'Mise aux normes et rénovation de tableaux électriques',
    slug: 'tableau-electrique-mise-aux-normes',
    category: 'Électricité',
    altBase: 'Tableau électrique rénové et mis aux normes',
    description:
      'Rénovation électrique dans le Maine-et-Loire : remplacement de tableau, mise aux normes NF C 15-100, disjoncteurs différentiels. Travaux certifiés.',
    body: [
      h2('La sécurité de toute la maison'),
      para(
        'Je remplace les anciens tableaux, réorganise le câblage, installe disjoncteurs et interrupteurs différentiels et remets votre installation en conformité avec la norme NF C 15-100.',
      ),
      para('Un travail propre, repéré et documenté, pour une installation fiable et évolutive.'),
    ],
  },
  {
    folder: 'renovation-globale',
    title: 'Rénovation complète de maisons',
    slug: 'renovation-globale-maison-maine-et-loire',
    category: 'Travaux intérieurs',
    altBase: 'Rénovation complète de maison dans le Maine-et-Loire',
    description:
      'Rénovation globale de maisons et fermes dans le 49 : gros œuvre, cloisons, cuisines, salles d’eau, sols et électricité. Un seul interlocuteur.',
    body: [
      h2('Votre projet de A à Z, un interlocuteur unique'),
      para(
        'Démolition et ouverture des espaces, cloisons et plafonds, cuisines, salles d’eau et WC, pose de sols, peinture et mise aux normes électriques : chaque corps de métier est coordonné pour un résultat cohérent.',
      ),
      para(
        'Des maisons de ville aux fermes de campagne, je transforme le bâti ancien en intérieur moderne et confortable, dans les délais et le budget convenus.',
      ),
    ],
  },
]

const IMG_EXT = /\.(webp|jpg|jpeg|png)$/i
const mime = (f) =>
  f.endsWith('.webp') ? 'image/webp' : f.endsWith('.png') ? 'image/png' : 'image/jpeg'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const client = createClient({ accessToken: CMA_TOKEN })
  const space = await client.getSpace(SPACE_ID)
  const env = await space.getEnvironment(ENVIRONMENT)

  const locales = await env.getLocales()
  const LOC = (locales.items.find((l) => l.default) || locales.items[0]).code
  console.log(`Espace ${SPACE_ID} / ${ENVIRONMENT} · locale par défaut : ${LOC}`)

  // slugs déjà présents (idempotence)
  const existing = await env.getEntries({ content_type: 'realisation', limit: 1000 })
  const existingSlugs = new Set(
    existing.items.map((e) => e.fields.slug?.[LOC]).filter(Boolean),
  )

  for (const r of REALISATIONS) {
    if (existingSlugs.has(r.slug)) {
      console.log(`↷ ${r.slug} existe déjà — ignoré`)
      continue
    }
    const dir = join(PHOTOS_DIR, r.folder)
    if (!existsSync(dir)) {
      console.warn(`⚠ dossier introuvable : ${dir} — entrée ignorée`)
      continue
    }
    const files = readdirSync(dir).filter((f) => IMG_EXT.test(f)).sort()
    if (files.length === 0) {
      console.warn(`⚠ aucune photo dans ${dir} — entrée ignorée`)
      continue
    }

    console.log(`\n▶ ${r.title} (${files.length} photos)`)
    const assetIds = []
    let idx = 0
    for (const file of files) {
      idx++
      const alt = `${r.altBase} — Adrien Renard (photo ${idx})`
      let asset = await env.createAssetFromFiles({
        fields: {
          title: { [LOC]: alt },
          description: { [LOC]: alt },
          file: {
            [LOC]: {
              contentType: mime(file),
              fileName: file,
              file: readFileSync(join(dir, file)),
            },
          },
        },
      })
      asset = await asset.processForAllLocales()
      // attend que l'URL du fichier soit prête avant publication
      for (let t = 0; t < 10 && !asset.fields.file?.[LOC]?.url; t++) {
        await sleep(1500)
        asset = await env.getAsset(asset.sys.id)
      }
      await asset.publish()
      assetIds.push(asset.sys.id)
      process.stdout.write(`  · photo ${idx}/${files.length}\r`)
    }
    const link = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } })

    let entry = await env.createEntry('realisation', {
      fields: {
        title: { [LOC]: r.title },
        slug: { [LOC]: r.slug },
        category: { [LOC]: r.category },
        description: { [LOC]: r.description },
        contenu: { [LOC]: richText(r.body) },
        coverImage: { [LOC]: link(assetIds[0]) },
        photos: { [LOC]: assetIds.map(link) },
      },
    })
    await entry.publish()
    console.log(`  ✓ entrée publiée : /realisations/${r.slug}`)
  }

  console.log('\n✅ Import terminé.')
}

main().catch((e) => {
  console.error('❌ Import échoué :', e.message)
  process.exit(1)
})
