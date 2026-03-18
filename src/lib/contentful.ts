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

