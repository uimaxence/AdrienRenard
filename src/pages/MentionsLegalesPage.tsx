import SEO from '../components/SEO'

export default function MentionsLegalesPage({ navHeight }: { navHeight: number }) {
  return (
    <main style={{ paddingTop: navHeight }}>
      <SEO
        path="/mentions-legales"
        title="Mentions légales"
        description="Mentions légales du site d'Adrien Renard Rénovation (R.A.R) : éditeur, responsable de la publication, hébergement, propriété intellectuelle et données personnelles."
      />
      <section className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Mentions légales
        </h1>

        <div className="mt-8 space-y-8 text-slate-600">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Éditeur du site</h2>
            <p className="mt-2 leading-relaxed">
              Le présent site est édité par la société <strong>ADRIEN RENARD</strong>, société
              par actions simplifiée unipersonnelle (SASU) au capital de 4 000 €, exerçant sous
              l'enseigne <strong>R.A.R — Adrien Renard Rénovation</strong> (rénovation
              intérieure et électricité).
              <br />
              Siège social : 9 bis rue de l'Industrie, La Jubaudière, 49510
              Beaupréau-en-Mauges, France
              <br />
              SIREN : 943 013 979 — SIRET (siège) : 943 013 979 00019
              <br />
              RCS : 943 013 979 R.C.S. Angers
              <br />
              TVA intracommunautaire : FR89 943 013 979
              <br />
              Téléphone :{' '}
              <a href="tel:0652212017" className="text-primary hover:underline">
                06 52 21 20 17
              </a>{' '}
              — E-mail :{' '}
              <a href="mailto:contact@adrienrenard.fr" className="text-primary hover:underline">
                contact@adrienrenard.fr
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Direction de la publication</h2>
            <p className="mt-2 leading-relaxed">
              Directeur de la publication : Adrien Renard, en qualité de représentant légal de
              la société.
              <br />
              Responsable du contenu et réalisation du site : Maxence Cailleau —{' '}
              <a
                href="mailto:maxencecailleau.pro@gmail.com"
                className="text-primary hover:underline"
              >
                maxencecailleau.pro@gmail.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Hébergement</h2>
            <p className="mt-2 leading-relaxed">
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133,
              Walnut, CA 91789, États-Unis, sur une infrastructure européenne située dans la
              région de <strong>Francfort (Allemagne)</strong>.
              <br />
              Site :{' '}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                vercel.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Propriété intellectuelle</h2>
            <p className="mt-2 leading-relaxed">
              L'ensemble des contenus présents sur ce site (textes, photographies, logo,
              éléments graphiques) est la propriété exclusive de la société ADRIEN RENARD, sauf
              mention contraire. Toute reproduction, représentation, modification ou diffusion,
              totale ou partielle, sans autorisation écrite préalable, est interdite et
              constitue une contrefaçon au sens des articles L.335-2 et suivants du Code de la
              propriété intellectuelle.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Données personnelles</h2>
            <p className="mt-2 leading-relaxed">
              Les informations transmises via le formulaire de contact (nom, prénom, e-mail,
              message) sont utilisées uniquement pour répondre à votre demande et ne font
              l'objet d'aucune cession à des tiers. L'acheminement du formulaire est assuré par
              le service EmailJS. Conformément au Règlement général sur la protection des
              données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit
              d'accès, de rectification et de suppression de vos données en écrivant à{' '}
              <a href="mailto:contact@adrienrenard.fr" className="text-primary hover:underline">
                contact@adrienrenard.fr
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Cookies</h2>
            <p className="mt-2 leading-relaxed">
              Ce site ne dépose aucun cookie publicitaire ni traceur à des fins de suivi. Seuls
              des éléments techniques strictement nécessaires à son fonctionnement peuvent être
              utilisés.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Droit applicable</h2>
            <p className="mt-2 leading-relaxed">
              Le présent site et ses mentions légales sont soumis au droit français. En cas de
              litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
