export type ServiceConfig = {
  slug: string
  /** Catégories Contentful dont on tire les réalisations liées */
  categories: string[]
  seoTitle: string
  seoDescription: string
  h1: string
  lead: string
  features: { title: string; text: string }[]
}

export const SERVICES: ServiceConfig[] = [
  {
    slug: 'renovation-interieure',
    categories: ['Travaux intérieurs'],
    seoTitle: 'Rénovation intérieure à Angers (49) — cloisons, sols, peinture',
    seoDescription:
      "Rénovation intérieure de maison et d'appartement à Angers et en Maine-et-Loire : cloisons, sols, parquet, peinture, isolation, salle de bain. Artisan qualifié, devis gratuit sous 48h.",
    h1: 'Rénovation intérieure à Angers et en Maine-et-Loire',
    lead: "Vous rénovez une maison ou un appartement à Angers ou dans le Maine-et-Loire ? Je prends en charge l'ensemble de vos travaux intérieurs, du premier coup de crayon jusqu'aux finitions, en interlocuteur unique. Un chantier propre, dans les délais et selon votre budget.",
    features: [
      {
        title: 'Cloisons & plâtrerie',
        text: "Création ou suppression de cloisons, doublage, faux-plafonds : je redessine vos volumes pour des espaces plus lumineux et fonctionnels.",
      },
      {
        title: 'Revêtements de sol & parquet',
        text: "Pose de parquet, carrelage, sol souple : un rendu soigné et durable, adapté à chaque pièce (pose de parquet à Angers et alentours).",
      },
      {
        title: 'Peinture & finitions',
        text: "Préparation des supports, peinture intérieure, enduits : des finitions nettes qui donnent tout de suite un aspect neuf à votre intérieur.",
      },
      {
        title: 'Salle de bain & pièces d’eau',
        text: "Rénovation complète de salle de bain à Angers : douche, faïence, plomberie et étanchéité, jusqu'à la mise en service.",
      },
      {
        title: 'Isolation & confort',
        text: "Isolation des murs et combles pour améliorer le confort thermique et réduire vos factures d'énergie.",
      },
      {
        title: 'Rénovation complète',
        text: "Rénovation de maison ou d'appartement de A à Z : je coordonne tous les corps de métier pour un résultat cohérent.",
      },
    ],
  },
  {
    slug: 'electricite',
    categories: ['Électricité'],
    seoTitle: 'Électricien à Angers (49) — mise aux normes & tableau électrique',
    seoDescription:
      "Électricien à Angers et en Maine-et-Loire : mise aux normes NF C 15-100, rénovation de tableau électrique, installation et dépannage. Travaux certifiés, devis gratuit.",
    h1: 'Électricité & mise aux normes à Angers',
    lead: "Artisan qualifié en électricité, j'interviens à Angers et dans tout le Maine-et-Loire pour sécuriser et moderniser votre installation. De la mise aux normes au remplacement de tableau électrique, un travail propre, repéré et conforme.",
    features: [
      {
        title: 'Mise aux normes NF C 15-100',
        text: "Diagnostic et mise en conformité de votre installation électrique selon la norme en vigueur, pour la sécurité de toute la maison.",
      },
      {
        title: 'Tableau électrique',
        text: "Remplacement et rénovation de tableau électrique à Angers : réorganisation du câblage, disjoncteurs et interrupteurs différentiels.",
      },
      {
        title: 'Rénovation d’installation',
        text: "Remise à neuf du réseau électrique dans le cadre d'une rénovation : lignes, prises, points lumineux, mise à la terre.",
      },
      {
        title: 'Création de circuits',
        text: "Ajout de prises, d'éclairages ou de circuits dédiés (cuisine, salle de bain, extérieur) selon vos besoins.",
      },
    ],
  },
  {
    slug: 'amenagement-sur-mesure',
    categories: ['Aménagement sur-mesure'],
    seoTitle: 'Aménagement sur-mesure à Angers — cuisines & salles de bains',
    seoDescription:
      "Aménagement sur-mesure à Angers et en Maine-et-Loire : conception et rénovation de cuisines, salles de bains et dressings. Artisan à l'écoute, devis gratuit sous 48h.",
    h1: 'Aménagement sur-mesure à Angers et en Maine-et-Loire',
    lead: "Cuisine, salle de bain, dressing… Je conçois et réalise des espaces sur-mesure, adaptés à vos envies, à votre mode de vie et à la configuration de votre logement à Angers et alentours.",
    features: [
      {
        title: 'Cuisines équipées',
        text: "Conception et pose de cuisines : îlot central, plan de travail, crédence, raccordements. Rénovation de cuisine à Angers, de la dépose aux finitions.",
      },
      {
        title: 'Salles de bains',
        text: "Aménagement et rénovation de salle de bain à Angers : douche à l'italienne, meuble vasque, carrelage et robinetterie.",
      },
      {
        title: 'Dressings & rangements',
        text: "Placards et dressings sur-mesure pour optimiser chaque mètre carré, avec des matériaux durables.",
      },
      {
        title: 'Optimisation d’espace',
        text: "Aménagement de combles, création de rangements intégrés : je tire le meilleur parti de votre surface.",
      },
    ],
  },
]

export function getService(slug: string | undefined): ServiceConfig | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
