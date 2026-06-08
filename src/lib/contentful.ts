import { createClient } from 'contentful'

const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string | undefined
const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN as string | undefined
const environment =
  (import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string | undefined) ?? 'master'

export const contentfulClient =
  space && accessToken
    ? createClient({
        space,
        accessToken,
        environment,
      })
    : null

/**
 * Optimise une URL d'image Contentful via l'API Images du CDN :
 * conversion WebP, compression et redimensionnement à la volée.
 * https://www.contentful.com/developers/docs/references/images-api/
 */
export function cfImage(
  url: string | undefined,
  width: number,
  { format = 'webp', quality = 72 }: { format?: 'webp' | 'jpg'; quality?: number } = {},
): string | undefined {
  if (!url) return undefined
  // N'optimise que les assets servis par le CDN Contentful.
  if (!url.includes('ctfassets.net') && !url.includes('images.contentful')) return url
  const params = new URLSearchParams({
    fm: format,
    q: String(quality),
    w: String(width),
    fit: 'fill',
  })
  return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
}

