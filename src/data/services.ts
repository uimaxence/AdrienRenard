export type ServiceConfig = {
  slug: string
  /** Catégories Contentful dont on tire les réalisations liées */
  categories: string[]
  seoTitle: string
  seoDescription: string
  h1: string
  lead: string
  features: { title: string; text: string }[]
  /** Sections de contenu long (SEO local) affichées sous les prestations */
  sections: { title: string; paragraphs: string[] }[]
  /** Questions fréquentes (affichées + données structurées FAQPage) */
  faq: { question: string; answer: string }[]
}

export const SERVICES: ServiceConfig[] = [
  {
    slug: 'renovation-interieure',
    categories: ['Rénovation complète'],
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
    sections: [
      {
        title: 'Une rénovation menée de A à Z, avec un seul interlocuteur',
        paragraphs: [
          "Une rénovation réussie commence bien avant le premier coup de masse. Je me déplace chez vous pour comprendre votre projet, vos contraintes et votre budget, puis je vous remets un devis gratuit, détaillé et sans engagement sous 48h. Une fois le planning validé, je coordonne l'ensemble des interventions — démolition, cloisons, électricité, plomberie, sols, peinture — pour que le chantier avance sans temps mort.",
          "Du studio au rez-de-chaussée entier, chaque chantier est mené proprement : protection des surfaces, évacuation des gravats, points d'étape réguliers. Vous savez toujours où en est votre projet, et le résultat est conforme à ce qui a été convenu, dans les délais et le budget annoncés.",
        ],
      },
      {
        title: "Zone d'intervention : Angers et le Maine-et-Loire",
        paragraphs: [
          "Basé à Beaupréau-en-Mauges, j'interviens dans tout le Maine-et-Loire : Angers et sa périphérie (Avrillé, Trélazé, Les Ponts-de-Cé, Bouchemaine), Cholet, Segré, Saumur et les communes des Mauges. Certains chantiers m'ont aussi mené en Deux-Sèvres et jusque dans le Gers — n'hésitez pas à me décrire votre projet, même hors du département.",
        ],
      },
    ],
    faq: [
      {
        question: 'Combien de temps dure une rénovation complète ?',
        answer:
          "Tout dépend de la surface et de l'ampleur des travaux : quelques jours pour rafraîchir une pièce, plusieurs semaines pour un rez-de-chaussée complet avec démolition, électricité et sols. Un planning précis vous est remis avec le devis, et il est tenu.",
      },
      {
        question: 'Peut-on habiter le logement pendant les travaux ?',
        answer:
          "Dans la plupart des cas, oui. Le chantier est organisé par phases et les zones de vie sont protégées pour limiter la gêne. On en parle ensemble lors de la visite pour trouver l'organisation la plus confortable.",
      },
      {
        question: 'Comment se passe le devis ?',
        answer:
          'Je me déplace gratuitement pour voir le chantier et échanger sur votre projet. Vous recevez ensuite un devis clair et détaillé sous 48h, sans engagement.',
      },
      {
        question: 'Qui coordonne les différents corps de métier ?',
        answer:
          "Moi. Vous n'avez qu'un seul interlocuteur du début à la fin : je réalise la majorité des travaux et je coordonne les interventions spécialisées quand elles sont nécessaires.",
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
    sections: [
      {
        title: 'Sécuriser et moderniser votre installation électrique',
        paragraphs: [
          "Une installation vieillissante, un tableau à fusibles, des prises sans terre ou des disjoncteurs qui sautent : autant de signes qu'il est temps de faire le point. J'établis un diagnostic de votre installation, puis je remets à neuf ce qui doit l'être — tableau électrique, câblage, mise à la terre, circuits dédiés — dans le respect de la norme NF C 15-100.",
          "Chaque intervention est faite proprement : circuits repérés, tableau étiqueté, câblage organisé. Vous repartez avec une installation fiable, évolutive et facile à faire évoluer (borne de recharge, extension, dépendance…).",
        ],
      },
      {
        title: "L'électricité intégrée à vos projets de rénovation",
        paragraphs: [
          "L'électricité est rarement un chantier isolé : rénovation d'une cuisine ou d'une salle de bain, création de points lumineux sur variateur, spots encastrés dans un faux plafond, alimentation d'un portail motorisé ou d'un abri de jardin… J'intègre la partie électrique à l'ensemble de votre projet, à Angers et dans tout le Maine-et-Loire, pour un résultat cohérent et conforme.",
        ],
      },
    ],
    faq: [
      {
        question: 'Quand faut-il mettre son installation électrique aux normes ?',
        answer:
          "Dès qu'apparaissent des signes de vétusté (tableau à fusibles, absence de différentiels, prises sans terre) ou lors d'une rénovation, d'une vente ou d'un agrandissement. Un diagnostic permet de cibler uniquement ce qui doit être repris.",
      },
      {
        question: 'Combien coûte une mise aux normes électriques ?',
        answer:
          "Cela dépend de la taille du logement et de l'état de l'installation existante. Après une visite sur place, je vous remets un devis gratuit et détaillé sous 48h, poste par poste.",
      },
      {
        question: 'Faut-il refaire toute l’installation ou seulement le tableau ?',
        answer:
          "Pas toujours ! Souvent, remplacer le tableau, reprendre la mise à la terre et sécuriser quelques circuits suffit. Je vous conseille honnêtement sur ce qui est nécessaire — et sur ce qui ne l'est pas.",
      },
      {
        question: 'Intervenez-vous sur de petits travaux électriques ?',
        answer:
          "Oui : ajout de prises, déplacement d'interrupteurs, création d'un circuit pour un électroménager, éclairage extérieur… Aucun chantier n'est trop petit à Angers et alentours.",
      },
    ],
  },
  {
    slug: 'cuisines-salles-de-bains',
    categories: ['Cuisine', 'Salle de bain'],
    seoTitle: 'Cuisines & salles de bains à Angers (49) — rénovation complète',
    seoDescription:
      "Rénovation de cuisines et de salles de bains à Angers et en Maine-et-Loire : de la dépose aux finitions, plomberie, faïence et électricité. Artisan qualifié, devis gratuit sous 48h.",
    h1: 'Cuisines & salles de bains à Angers et en Maine-et-Loire',
    lead: "Cuisine ou salle de bain à rénover à Angers ou dans le Maine-et-Loire ? Je prends en charge le projet de A à Z : dépose, plomberie, électricité, faïence, pose des meubles et finitions, en interlocuteur unique.",
    features: [
      {
        title: 'Cuisines équipées',
        text: "Conception et pose de cuisines : îlot central, plan de travail, crédence, raccordements. Rénovation de cuisine à Angers, de la dépose aux finitions.",
      },
      {
        title: 'Salles de bains',
        text: "Rénovation complète de salle de bain à Angers : douche à l'italienne, receveur, faïence, meuble vasque et robinetterie, jusqu'à la mise en service.",
      },
      {
        title: 'WC & sanitaires',
        text: "Remplacement de WC posé par un WC suspendu, habillage en faïence, carrelage : des sanitaires modernes et faciles à entretenir.",
      },
      {
        title: 'Plomberie & électricité',
        text: "Reprise des alimentations d'eau, modification des lignes électriques : des installations sûres et conformes, intégrées au projet.",
      },
    ],
    sections: [
      {
        title: 'De la dépose aux finitions, tout est compris',
        paragraphs: [
          "Rénover une cuisine ou une salle de bain, c'est dix métiers en un : dépose de l'existant, reprise des alimentations d'eau (cuivre ou PER), étanchéité des murs, électricité, faïence, pose des meubles et de la robinetterie, jusqu'à la mise en service. Je prends en charge l'ensemble, ce qui évite les allers-retours entre artisans et garantit un résultat homogène.",
          "Receveur extra-plat scellé, paroi de douche, WC suspendu avec habillage en faïence, meuble vasque, crédence, plan de travail : chaque détail est posé avec soin, avec des matériaux durables et faciles à entretenir. Les photos avant/après de mes réalisations à Angers et dans le Maine-et-Loire parlent d'elles-mêmes.",
        ],
      },
      {
        title: 'Un projet pensé avec vous',
        paragraphs: [
          "Vous avez déjà choisi vos meubles et votre faïence ? Je m'occupe de la pose. Vous partez de zéro ? Je vous conseille sur l'agencement, les matériaux et les gammes adaptées à votre budget. Dans tous les cas, vous recevez un devis gratuit et détaillé sous 48h, et le chantier est organisé pour limiter au maximum le temps sans point d'eau.",
        ],
      },
    ],
    faq: [
      {
        question: 'Combien de temps faut-il pour rénover une salle de bain ?',
        answer:
          "En général de quelques jours à deux semaines selon l'ampleur : simple remplacement de douche, ou rénovation complète avec dépose, étanchéité, faïence et meubles. Le planning exact figure dans le devis.",
      },
      {
        question: 'Fournissez-vous les meubles et les équipements ?',
        answer:
          'Les deux sont possibles : fourniture et pose, ou pose seule de ce que vous avez déjà acheté. Je vous conseille volontiers sur le choix des équipements avant achat pour éviter les mauvaises surprises.',
      },
      {
        question: 'Puis-je avoir une douche à l’italienne ?',
        answer:
          "Dans la plupart des salles de bains, oui — sous réserve de la configuration de l'évacuation. Receveur extra-plat ou douche de plain-pied, avec une étanchéité soignée des murs et du sol : on valide la faisabilité lors de la visite.",
      },
      {
        question: 'Rénovez-vous aussi les WC et les petits espaces ?',
        answer:
          "Oui. WC suspendu avec bâti-support, habillage en faïence, carrelage, kitchenette dans des locaux professionnels : les petits espaces méritent autant de soin que les grands.",
      },
    ],
  },
]

export function getService(slug: string | undefined): ServiceConfig | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

/** URL de la page réalisations pré-filtrée sur une ou plusieurs catégories. */
export function realisationsUrl(categories: string[]): string {
  const params = categories.map((c) => `categorie=${encodeURIComponent(c)}`).join('&')
  return params ? `/realisations?${params}` : '/realisations'
}
