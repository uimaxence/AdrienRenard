/**
 * Réorganisation complète des réalisations Contentful.
 *
 * Ce script applique, en une passe :
 *  - le renommage de la catégorie « Travaux intérieurs » → « Rénovation complète »
 *  - la suppression de la catégorie « Aménagement sur-mesure » (remplacée par « Cuisine »)
 *  - la création des catégories « Cuisine » et « Salle de bain »
 *  - la séparation terrasse / abri / portail (3 réalisations distinctes)
 *  - la séparation des 3 cuisines
 *  - le chantier « Réhabilitation d'un logement agricole » (photos 6-8-9-10-13-16-18
 *    de l'ancienne « Rénovation complète de maisons », maison des Deux-Sèvres)
 *  - la « Création de gîtes » avec le reste des photos
 *  - le nouveau chantier « salle de bain à Angers », « kitchenette Beaucouzé »,
 *    « WC suspendu », « escalier à limon central », « rez-de-chaussée » (démolition)
 *  - l'ordre chronologique des photos (anciennes/avant d'abord, rénové ensuite)
 *  - les contenus réécrits avec des listes à puces
 *
 * USAGE :
 *   CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxxx node scripts/reorganize-realisations.mjs
 *
 * Le token de gestion se crée sur app.contentful.com → Settings → API keys →
 * Content management tokens. Les photos sont lues depuis ./photos-a-importer/.
 * Le script est idempotent : relançable sans dupliquer photos ni entrées.
 */
import { createClient } from 'contentful-management'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'fnejam0y3rn1'
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const PHOTOS_DIR = resolve(__dirname, '..', 'photos-a-importer')

if (!CMA_TOKEN) {
  console.error('❌ Renseignez CONTENTFUL_MANAGEMENT_TOKEN (token de gestion, pas la clé de lecture).')
  process.exit(1)
}
if (!existsSync(PHOTOS_DIR)) {
  console.error(`❌ Dossier introuvable : ${PHOTOS_DIR}`)
  process.exit(1)
}

// ---------- Helpers rich text ----------
const text = (value) => ({ nodeType: 'text', value, marks: [], data: {} })
const para = (value) => ({ nodeType: 'paragraph', data: {}, content: [text(value)] })
const li = (value) => ({
  nodeType: 'list-item',
  data: {},
  content: [{ nodeType: 'paragraph', data: {}, content: [text(value)] }],
})
const ul = (items) => ({ nodeType: 'unordered-list', data: {}, content: items.map(li) })
const richText = (blocks) => ({ nodeType: 'document', data: {}, content: blocks })

// ---------- IDs des assets existants (galeries actuelles) ----------
// Rénovation complète de maisons (20 photos)
const RG = {
  1: '6hCcBJUxl164fZqGaoYSET', 2: '5jKuGpvVr9EQKZXBh7ZTFc', 3: '2ReKYu8mfRFXNK0PBwkxbt',
  4: '4PhziLMPCeFGCm4CTo1dHE', 5: '3rNmV2fgjOobasapN9CMrP', 6: '1PsfkFwQGPczmGAgdptqXk',
  7: '7ADOSwxXnJN7p3lgWz9uPR', 8: '3FWDK5542pSXPDkSDK5jFc', 9: '43RoNGPyzWDpNPxVcnct3w',
  10: 'YByMhgUdUbVdDMWgtNtqU', 11: '6n7RpYuO5vnOotImB2LHep', 12: '64vEnskWUeJs5GY3SWXAti',
  13: '6zp263FS9YIAlFtpHhBmkl', 14: 'V5GUYHlrObVgTtV4Eplad', 15: '24bvbNYo5Czch8Vw3gDaB0',
  16: '6t9D3Ru8ZD7sqZifOSTivg', 17: '531TNB7zPR1SnpxskgCwlA', 18: '69tUizOP1I3sDKFP1rELCe',
  19: '7dBSNGvzv6QtM3QY9gNYx2', 20: '5gci78pST5pezBggPPxiPY',
}
// Salons / salles à manger (11 photos)
const SM = {
  1: '6LJCeNcTBHttOmzemHW3Tt', 2: '39BBXhzfhStMRKbigI66f6', 3: '73vohov9d9lnP7IjKSrNAF',
  4: '6ChCktxd9onqrQSmsFIbAJ', 5: 'tqeEH8g4uwECnnC5uyJzk', 6: '4JcX6wck4NSLgPWIQD9Zs5',
  7: '43FdE2CReitnqvo1G4iWcc', 8: '1nLPeHFVyahAVOn0lXepy8', 9: '7pPUcyyk8yyPXh1eN34YhT',
  10: '3ZAJrNFRnpZG47kzFs2xNy', 11: '4cxwUYmUFS0xBbjxhXYHde',
}
// Extérieurs (13 photos)
const EXT = {
  1: '6idbKiN3RtFD6l3ekYlD72', 2: '1qaWHRaG6QCDZ9kD1ZHMBx', 3: '1R69iNlVWX1zC5lLdIQ9He',
  4: 'x2Po2m1rqqHYouNLuSOpT', 5: '1uNfMB2l0cy6OtCi6FSitr', 6: '3AWY1rKshigxIBpyd19Fm5',
  7: '2mrW5iHWfLIHen3PtT9IO5', 8: '1Hj8Cni3yKqG0NuVNNBHzg', 9: '3uBer3mBHpvS3K4sY3A46O',
  10: '4VH9Qgmuaa8Uzx8OZTLYJV', 11: '7uI80TIbfsWZRA83hXphsm', 12: 'Va8YzOU57BfpCUSizKpTw',
  13: '3B2yf2GZJ6wd32L7QGq7Ik',
}
// Cuisines (8 photos)
const CU = {
  1: '6On5UWz8Ordw5d7YFYSpok', 2: '2oDFS24t8m4eBxL7i3zNcj', 3: '5TM6DPaRcTkAfkC7jzYxp7',
  4: '2NonVbhzoGSet27jazy6XS', 5: '7fXUh1SvWq79QKTTCEJtCa', 6: '6Qrv9VWC931FjqS0xAm60i',
  7: '3sXFxNzlUeRgvVqb78k888', 8: '5u1OcI74S2RtV3j8Q0zt8l',
}
// Salles de bain existantes
const SDB_BETON = { renove: '7garj9U8Zh8c65V1T86kpB', avant1: '2UpRBfITL64GEiUXO5md4e', avant2: '725ORb6h1EklfUfXxWAPtC' }
const SDB_TRAV = { renove: '37vlH9W6Syz5vkdxxSVqLF', avant1: '2kcp9KOx24XB1kaB0tUXxN', avant2: '28AY3jToOtVQaAQa51Byrw' }
// WC / sanitaires + chambres
const WC = { apres: '3X8XlvJmQfEPJLSL6fSO31', avant: '1cLG5BukTYcMYmR67Ic9a4' }
const CH = { apres: '3v0ffV3kcWe1vXvK6KECaM', avant: '3meXVkIQg1M6erJp6vSjAw' }

// ---------- Nouvelles photos à uploader ----------
// clé = nom de fichier dans photos-a-importer/, valeur = texte alternatif
const UPLOADS = {
  'sdb-angers-01-salle-de-bain-avant.jpg': "Salle de bain avant rénovation à Angers — baignoire d'origine",
  'sdb-angers-02-depose-douche-existante.jpg': "Dépose de la douche existante — rénovation salle de bain Angers",
  'sdb-angers-03-depose-terminee.jpg': "Dépose de l'existant terminée — rénovation salle de bain Angers",
  'sdb-angers-04-etancheite-receveur.jpg': "Étanchéité des murs et receveur scellé — salle de bain Angers",
  'sdb-angers-05-faience-verticale.jpg': "Pose de la faïence verticale — salle de bain Angers",
  'sdb-angers-06-douche-terminee.jpg': "Douche terminée avec paroi vitrée — salle de bain rénovée à Angers",
  'rdc-01-demolition-salle-eau.jpg': "Démolition de l'ancienne salle d'eau — rénovation rez-de-chaussée",
  'rdc-02-demolition-plafonds.jpg': 'Démolition des plafonds et ouverture des volumes — rénovation rez-de-chaussée',
  'rdc-03-ouverture-mur-pierre.jpg': "Ouverture d'un mur en pierre — rénovation rez-de-chaussée",
  'rdc-04-sablage-cheminee.jpg': 'Cheminée en cours de sablage — rénovation rez-de-chaussée',
  'rdc-09-cheminee-sablee-joints-chaux.jpg': 'Cheminée sablée avec joints à la chaux — rénovation rez-de-chaussée',
  'rdc-05-reseaux-chauffage.jpg': 'Passage des réseaux de chauffage — rénovation rez-de-chaussée',
  'rdc-06-placo-electricite.jpg': 'Placo, isolation et électricité — rénovation rez-de-chaussée',
  'rdc-07-carrelage.jpg': 'Ragréage et pose du carrelage — rénovation rez-de-chaussée',
  'rdc-08-spots-encastres.jpg': 'Création de points lumineux encastrés — rénovation rez-de-chaussée',
  'escalier-01-mezzanine-gros-oeuvre.jpg': "Création de la mezzanine avant pose de l'escalier à limon central",
  'wc-01-avant-apres.jpg': 'Avant / après — remplacement du WC posé par un WC suspendu à Angers',
  'wc-02-ragreage.jpg': 'Ragréage du sol — rénovation WC à Angers',
  'wc-03-carrelage.jpg': 'Pose du carrelage au sol — rénovation WC à Angers',
  'wc-04-faience.jpg': 'Habillage en faïence du bâti-support — WC suspendu Angers',
  'wc-05-wc-suspendu-termine.jpg': 'WC suspendu terminé avec habillage en faïence — Angers',
  'kitchenette-01-avant.jpg': 'Kitchenette avant transformation — locaux professionnels à Beaucouzé',
  'kitchenette-02-depose.jpg': 'Dépose de la kitchenette — locaux professionnels à Beaucouzé',
  'kitchenette-03-faux-plafond.jpg': 'Reprise du faux plafond et de l’éclairage — kitchenette Beaucouzé',
  'kitchenette-04-kitchenette-terminee.jpg': 'Kitchenette reposée avec faïence neuve — Beaucouzé',
  'kitchenette-05-vue-ensemble.jpg': "Vue d'ensemble de la kitchenette transformée — Beaucouzé",
}

// ---------- Plan des réalisations ----------
// `up:<fichier>` référence une nouvelle photo, sinon ID d'asset existant.
const up = (f) => `up:${f}`

const PLAN = [
  // --- Salles de bain ---
  {
    matchSlug: 'salle-bain-beton-cire',
    fields: { category: 'Salle de bain' },
    photos: [SDB_BETON.avant1, SDB_BETON.avant2, SDB_BETON.renove],
  },
  {
    matchSlug: 'salle-bain-travertin',
    fields: { category: 'Salle de bain' },
    photos: [SDB_TRAV.avant1, SDB_TRAV.avant2, SDB_TRAV.renove],
  },
  {
    create: true,
    matchSlug: 'renovation-salle-de-bain-angers',
    fields: {
      title: "Rénovation complète d'une salle de bain à Angers",
      slug: 'renovation-salle-de-bain-angers',
      category: 'Salle de bain',
      description:
        "Rénovation d'une salle de bain à Angers : dépose de l'existant, étanchéité des murs, receveur scellé, faïence verticale, paroi de douche et meuble vasque.",
      body: [
        para("Rénovation complète d'une salle de bain à Angers, de la dépose jusqu'à la mise en service :"),
        ul([
          "Dépose de l'existant",
          'Reprise et étanchéité des murs',
          "Reprise des alimentations d'eau depuis le compteur général",
          "Pose scellée d'un receveur",
          'Faïence verticale',
          "Pose d'une paroi de douche et de la robinetterie",
          "Pose d'un meuble vasque",
        ]),
      ],
    },
    photos: [
      up('sdb-angers-01-salle-de-bain-avant.jpg'),
      up('sdb-angers-02-depose-douche-existante.jpg'),
      up('sdb-angers-03-depose-terminee.jpg'),
      up('sdb-angers-04-etancheite-receveur.jpg'),
      up('sdb-angers-05-faience-verticale.jpg'),
      up('sdb-angers-06-douche-terminee.jpg'),
    ],
    cover: up('sdb-angers-06-douche-terminee.jpg'),
  },
  // --- WC suspendu (entrée existante enrichie) ---
  {
    matchSlug: 'renovation-wc-sanitaires',
    fields: {
      title: "Remplacement d'un WC posé par un WC suspendu à Angers",
      category: 'Salle de bain',
      description:
        "Remplacement d'un WC posé par un WC suspendu à Angers : bâti-support, habillage en faïence et pose d'un carrelage au sol. Finitions soignées.",
      body: [
        para("Remplacement d'un WC posé par un WC suspendu, avec reprise complète du sol et des murs :"),
        ul([
          'Dépose du WC existant',
          'Ragréage du sol',
          "Pose d'un carrelage",
          "Pose d'un bâti-support et d'un WC suspendu",
          'Habillage en faïence',
        ]),
      ],
    },
    photos: [
      up('wc-01-avant-apres.jpg'),
      up('wc-02-ragreage.jpg'),
      up('wc-03-carrelage.jpg'),
      up('wc-04-faience.jpg'),
      up('wc-05-wc-suspendu-termine.jpg'),
      WC.avant,
      WC.apres,
    ],
    cover: up('wc-05-wc-suspendu-termine.jpg'),
  },
  // --- Rénovation complète ---
  {
    // ex « Rénovation globale d'une maison d'habitation en Deux-Sèvres »
    matchSlug: 'renovation-globale-maison-deux-sevres',
    fields: {
      title: "Réhabilitation d'un logement agricole en Deux-Sèvres",
      slug: 'rehabilitation-logement-agricole-deux-sevres',
      category: 'Rénovation complète',
      description:
        "Réhabilitation complète d'un logement agricole en Deux-Sèvres : isolation, placo, électricité, kitchenette et salle d'eau. Un logement sain et fonctionnel.",
      body: [
        para("Réhabilitation complète d'un logement agricole sur la maison des Deux-Sèvres :"),
        ul([
          'Dépose des anciens revêtements',
          'Isolation et placo',
          'Électricité complète',
          "Création d'une kitchenette équipée",
          "Création d'une salle d'eau avec douche",
          'Sols, peintures et finitions',
        ]),
      ],
    },
    photos: [RG[13], RG[10], RG[6], RG[16], RG[9], RG[8], RG[18]],
    cover: RG[6],
  },
  {
    // ex « Rénovation complète de maisons » — devient la création de gîtes
    matchSlug: 'renovation-globale-maison-maine-et-loire',
    fields: {
      title: 'Création de gîtes',
      slug: 'creation-de-gites',
      category: 'Rénovation complète',
      description:
        "Transformation de bâtiments en gîtes : démolition et ouvertures, cuisines équipées, salles d'eau, sols, peintures et aménagements — des hébergements prêts à accueillir.",
      body: [
        para('Transformation complète de bâtiments existants en gîtes prêts à accueillir des vacanciers :'),
        ul([
          'Démolition et création d’ouvertures',
          'Cloisons, plafonds et isolation',
          'Cuisines équipées',
          "Salles d'eau et sanitaires",
          'Sols, peintures et finitions',
          'Mise aux normes électriques',
        ]),
      ],
    },
    photos: [
      RG[1], RG[3], RG[4], RG[11],           // avant
      RG[7], RG[20], RG[17], RG[14],          // pendant
      RG[2], RG[5], RG[19], RG[12], RG[15],   // après
    ],
    cover: RG[15],
  },
  {
    // ex « Rénovation de salons et salles à manger » — devient le chantier rez-de-chaussée
    matchSlug: 'renovation-salon-salle-a-manger',
    fields: {
      title: "Rénovation complète d'un rez-de-chaussée",
      slug: 'renovation-complete-rez-de-chaussee',
      category: 'Rénovation complète',
      description:
        "Démolition complète d'un rez-de-chaussée puis rénovation : cheminée sablée et joints à la chaux, placo, électricité, chauffage, carrelage et peintures.",
      body: [
        para("Démolition complète d'un rez-de-chaussée puis rénovation de A à Z :"),
        ul([
          'Démolition complète du rez-de-chaussée',
          'Sablage de la cheminée et joints à la chaux',
          'Placo et isolation',
          'Électricité',
          'Passage des réseaux de chauffage',
          'Ragréage et carrelage',
          'Peintures et plinthes',
        ]),
      ],
    },
    photos: [
      SM[4], SM[6],                                        // avant
      up('rdc-01-demolition-salle-eau.jpg'),
      up('rdc-02-demolition-plafonds.jpg'),
      up('rdc-03-ouverture-mur-pierre.jpg'),
      up('rdc-04-sablage-cheminee.jpg'),
      up('rdc-09-cheminee-sablee-joints-chaux.jpg'),
      up('rdc-05-reseaux-chauffage.jpg'),
      up('rdc-06-placo-electricite.jpg'),
      up('rdc-07-carrelage.jpg'),
      up('rdc-08-spots-encastres.jpg'),
      SM[10], SM[11], SM[1],                               // après
    ],
    cover: SM[1],
  },
  {
    create: true,
    matchSlug: 'renovation-salle-a-manger-gers',
    fields: {
      title: "Rénovation d'une salle à manger dans le Gers",
      slug: 'renovation-salle-a-manger-gers',
      category: 'Rénovation complète',
      description:
        "Rénovation d'une salle à manger dans le Gers : dépose de l'ancienne cuisine, faux plafond avec points lumineux sur variateur, hauts-parleurs encastrés, meubles et plan de travail.",
      body: [
        para("Rénovation complète d'une salle à manger dans le Gers :"),
        ul([
          "Dépose de l'ancienne cuisine",
          'Modifications électriques',
          'Faux plafond avec création de points lumineux sur variateur',
          'Pose de hauts-parleurs encastrés',
          "Pose de meubles et d'un plan de travail",
          "Pose d'un miroir",
        ]),
      ],
    },
    photos: [SM[9], SM[3], SM[2], SM[7], SM[8]],
    cover: SM[7],
  },
  {
    create: true,
    matchSlug: 'escalier-limon-central-acier-chene',
    fields: {
      title: 'Escalier à limon central en acier et chêne',
      slug: 'escalier-limon-central-acier-chene',
      category: 'Rénovation complète',
      description:
        "Fabrication et pose d'un escalier à limon central avec garde-corps en acier et marches en chêne, et luminaire artisanal en fer à béton.",
      body: [
        para('Un escalier entièrement fabriqué sur mesure pour desservir la mezzanine :'),
        ul([
          "Fabrication et pose d'un escalier à limon central",
          'Garde-corps en acier',
          'Marches en chêne',
          "Fabrication artisanale d'un luminaire en fer à béton selon les idées de la cliente",
        ]),
      ],
    },
    photos: [up('escalier-01-mezzanine-gros-oeuvre.jpg'), SM[5]],
    cover: SM[5],
  },
  {
    matchSlug: 'renovation-chambres',
    fields: { category: 'Rénovation complète' },
    photos: [CH.avant, CH.apres],
  },
  // --- Cuisines ---
  {
    // ex « Rénovation et installation de cuisines » — ne garde que la cuisine blanche
    matchSlug: 'renovation-cuisines-angers',
    fields: {
      title: "Rénovation d'une cuisine blanche et bois",
      category: 'Cuisine',
      description:
        "Rénovation complète d'une cuisine : dépose de l'ancienne cuisine, reprise des murs et du sol, pose d'une cuisine blanche avec plan de travail bois et électroménager encastré.",
      body: [
        para("Transformation complète d'une cuisine, de la dépose aux finitions :"),
        ul([
          "Dépose de l'ancienne cuisine",
          'Reprise des murs et du sol',
          "Pose d'une cuisine blanche avec plan de travail bois",
          "Installation de l'électroménager encastré",
          'Raccordements plomberie et électricité',
        ]),
      ],
    },
    photos: [CU[6], CU[1]],
    cover: CU[1],
  },
  {
    create: true,
    matchSlug: 'creation-cuisine-professionnelle-verriere',
    fields: {
      title: "Création d'une cuisine professionnelle avec verrière suspendue",
      slug: 'creation-cuisine-professionnelle-verriere',
      category: 'Cuisine',
      description:
        "Création d'une cuisine professionnelle : placo, éclairage LED encastré, îlot central avec plan en marbre et verrière métallique suspendue fabriquée sur mesure.",
      body: [
        para("Aménagement complet d'une cuisine professionnelle :"),
        ul([
          'Placo et reprise des murs',
          'Éclairage LED encastré au plafond',
          'Îlot central avec plan de travail en marbre',
          'Fabrication et pose d’une verrière métallique suspendue sur mesure',
        ]),
      ],
    },
    photos: [CU[2], CU[3], CU[5], CU[8]],
    cover: CU[8],
  },
  {
    create: true,
    matchSlug: 'renovation-cuisine-noire-bois',
    fields: {
      title: "Rénovation d'une cuisine noire et bois avec mur en pierre",
      slug: 'renovation-cuisine-noire-bois',
      category: 'Cuisine',
      description:
        "Rénovation d'une cuisine noire et bois mise en valeur par un mur en pierre apparente : meubles, plan de travail, hotte et éclairage.",
      body: [
        para('Une cuisine contemporaine qui met en valeur la pierre apparente :'),
        ul([
          "Dépose de l'ancienne cuisine",
          'Pose des meubles noirs et du plan de travail bois',
          'Installation de la hotte et de l’électroménager',
          'Mise en valeur du mur en pierre apparente',
        ]),
      ],
    },
    photos: [CU[7], CU[4]],
    cover: CU[4],
  },
  {
    create: true,
    matchSlug: 'transformation-kitchenette-beaucouze',
    fields: {
      title: "Transformation d'une kitchenette dans des locaux professionnels à Beaucouzé",
      slug: 'transformation-kitchenette-beaucouze',
      category: 'Cuisine',
      description:
        "Transformation d'une kitchenette dans des locaux professionnels à Beaucouzé : dépose/repose, alimentations en cuivre, lignes électriques, faïence, placo et peinture.",
      body: [
        para("Transformation d'une kitchenette dans des locaux professionnels à Beaucouzé :"),
        ul([
          'Dépose et repose de la kitchenette',
          "Modification des alimentations d'eau chaude et d'eau froide en cuivre",
          'Modification des lignes électriques depuis le tableau général',
          'Faïence',
          'Placo et peinture des murs',
        ]),
      ],
    },
    photos: [
      up('kitchenette-01-avant.jpg'),
      up('kitchenette-02-depose.jpg'),
      up('kitchenette-03-faux-plafond.jpg'),
      up('kitchenette-04-kitchenette-terminee.jpg'),
      up('kitchenette-05-vue-ensemble.jpg'),
    ],
    cover: up('kitchenette-04-kitchenette-terminee.jpg'),
  },
  // --- Aménagements extérieurs ---
  {
    // ex « Terrasses, portails et abris » — ne garde que la terrasse
    matchSlug: 'amenagements-exterieurs-terrasses-portails',
    fields: {
      title: "Fabrication d'une terrasse en Douglas dans le Gers",
      slug: 'terrasse-bois-douglas-gers',
      category: 'Aménagements extérieurs',
      description:
        "Fabrication d'une terrasse en Douglas dans le Gers : plots béton, ossature taillée sur place, luminaires LED intégrés dans les poteaux d'angle. Garde-corps vitrés à venir.",
      body: [
        para("Fabrication complète d'une terrasse en Douglas dans le Gers :"),
        ul([
          'Préparation des plots béton',
          "Traçage et taille de l'ossature",
          'Mise en place de la terrasse',
          "Fabrication de luminaires LED dans les poteaux d'angle",
          'Prochainement : pose de garde-corps vitrés',
        ]),
      ],
    },
    photos: [EXT[7], EXT[3], EXT[5], EXT[2], EXT[6], EXT[10]],
    cover: EXT[6],
  },
  {
    create: true,
    matchSlug: 'portail-coulissant-motorise-gers',
    fields: {
      title: "Remplacement d'un portail battant par un portail coulissant motorisé",
      slug: 'portail-coulissant-motorise-gers',
      category: 'Aménagements extérieurs',
      description:
        "Remplacement d'un portail battant par un portail coulissant motorisé dans le Gers : longrine béton, alimentations électriques, portail aluminium de 5 m et motorisation programmée.",
      body: [
        para("Remplacement d'un portail battant par un portail coulissant motorisé dans le Gers :"),
        ul([
          "Préparation et coulage d'une longrine béton",
          'Passage des alimentations électriques',
          "Pose d'un portail aluminium de 5 m × 1,40 m",
          'Programmation de la motorisation',
        ]),
      ],
    },
    photos: [EXT[1], EXT[4]],
    cover: EXT[4],
  },
  {
    create: true,
    matchSlug: 'abri-stockage-containers-gers',
    fields: {
      title: "Pose d'un abri de stockage entre deux containers",
      slug: 'abri-stockage-containers-gers',
      category: 'Aménagements extérieurs',
      description:
        "Pose d'un abri entre deux containers dans le Gers : mise en place à la nacelle, dalle béton, alimentations électriques et aménagement intérieur pour du stockage.",
      body: [
        para("Pose d'un abri entre deux containers chez un particulier dans le Gers :"),
        ul([
          "Mise en place de l'abri à la nacelle",
          'Préparation et coulage de la dalle béton',
          "Passage d'alimentations électriques",
          'Aménagement intérieur pour du stockage',
        ]),
      ],
    },
    photos: [EXT[8], EXT[9], EXT[12], EXT[11], EXT[13]],
    cover: EXT[8],
  },
]

// ---------- Exécution ----------
const mime = (f) => (f.endsWith('.webp') ? 'image/webp' : f.endsWith('.png') ? 'image/png' : 'image/jpeg')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const link = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } })

async function main() {
  const client = createClient(
    { accessToken: CMA_TOKEN },
    { type: 'plain', defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT } },
  )

  const locales = await client.locale.getMany({ query: { limit: 100 } })
  const LOC = (locales.items.find((l) => l.default) || locales.items[0]).code
  console.log(`Espace ${SPACE_ID} / ${ENVIRONMENT} · locale : ${LOC}`)

  // 1) Upload des nouvelles photos (idempotent : réutilise un asset au même fileName)
  const existingAssets = await client.asset.getMany({ query: { limit: 1000 } })
  const byFileName = new Map(
    existingAssets.items
      .map((a) => [a.fields.file?.[LOC]?.fileName, a.sys.id])
      .filter(([f]) => Boolean(f)),
  )

  const uploadedIds = {} // fichier -> assetId
  const files = Object.keys(UPLOADS)
  let n = 0
  for (const file of files) {
    n++
    if (byFileName.has(file)) {
      uploadedIds[file] = byFileName.get(file)
      console.log(`↷ asset existant ${file}`)
      continue
    }
    const alt = UPLOADS[file]
    const upload = await client.upload.create({}, { file: readFileSync(join(PHOTOS_DIR, file)) })
    let asset = await client.asset.create(
      {},
      {
        fields: {
          title: { [LOC]: alt },
          description: { [LOC]: alt },
          file: {
            [LOC]: {
              contentType: mime(file),
              fileName: file,
              uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
            },
          },
        },
      },
    )
    asset = await client.asset.processForAllLocales({}, asset)
    for (let t = 0; t < 20 && !asset.fields.file?.[LOC]?.url; t++) {
      await sleep(1500)
      asset = await client.asset.get({ assetId: asset.sys.id })
    }
    asset = await client.asset.publish({ assetId: asset.sys.id }, asset)
    uploadedIds[file] = asset.sys.id
    console.log(`✓ photo ${n}/${files.length} : ${file}`)
  }

  const resolveId = (ref) => (ref.startsWith('up:') ? uploadedIds[ref.slice(3)] : ref)

  // 2) Entrées existantes indexées par slug
  const existing = await client.entry.getMany({ query: { content_type: 'realisation', limit: 1000 } })
  const bySlug = new Map(existing.items.map((e) => [e.fields.slug?.[LOC], e]))

  // 3) Application du plan
  for (const op of PLAN) {
    const targetSlug = op.fields?.slug ?? op.matchSlug
    let entry = bySlug.get(op.matchSlug) ?? bySlug.get(targetSlug)

    const fields = {}
    if (op.fields?.title) fields.title = { [LOC]: op.fields.title }
    if (op.fields?.slug) fields.slug = { [LOC]: op.fields.slug }
    if (op.fields?.category) fields.category = { [LOC]: op.fields.category }
    if (op.fields?.description) fields.description = { [LOC]: op.fields.description }
    if (op.fields?.body) fields.contenu = { [LOC]: richText(op.fields.body) }
    if (op.photos) fields.photos = { [LOC]: op.photos.map((p) => link(resolveId(p))) }
    if (op.cover) fields.coverImage = { [LOC]: link(resolveId(op.cover)) }

    if (!entry) {
      if (!op.create) {
        console.warn(`⚠ entrée introuvable pour « ${op.matchSlug} » — ignorée`)
        continue
      }
      if (!fields.slug) fields.slug = { [LOC]: targetSlug }
      entry = await client.entry.create({ contentTypeId: 'realisation' }, { fields })
      await client.entry.publish({ entryId: entry.sys.id }, entry)
      console.log(`✓ créée : ${fields.title?.[LOC]} (/realisations/${targetSlug})`)
      continue
    }

    // mise à jour d'une entrée existante
    let fresh = await client.entry.get({ entryId: entry.sys.id })
    Object.assign(fresh.fields, fields)
    fresh = await client.entry.update({ entryId: entry.sys.id }, fresh)
    await client.entry.publish({ entryId: entry.sys.id }, fresh)
    console.log(`✓ mise à jour : ${fresh.fields.title?.[LOC]} (/realisations/${fresh.fields.slug?.[LOC]})`)
  }

  console.log('\n✅ Réorganisation terminée.')
  console.log('Pensez à regénérer le sitemap : node scripts/generate-sitemap.mjs')
}

main().catch((e) => {
  console.error('❌ Échec :', e.message)
  if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2))
  process.exit(1)
})
