import NextHead from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

/**
 * Constants & Helpers
 */
export const WEBSITE_HOST_URL = 'https://cache.gold'

/**
 * Prop Types
 */
export interface MetaProps {
  description?: string
  image?: string
  title: string
  type?: string
}

/**
 * Component
 */
const Head = ({ customMeta }: { customMeta?: MetaProps }): JSX.Element => {
  const router = useRouter()
  const meta: MetaProps = {
    title: 'The Metal Mint',
    description: 'A swiss army knife for splitting and merging CGT',
    image: `${WEBSITE_HOST_URL}/images/site-preview.png`,
    type: 'website',
    ...customMeta,
  }

  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta content={meta.description} name="description" />
      <meta property="og:url" content={`${WEBSITE_HOST_URL}${router.asPath}`} />
      <link rel="canonical" href={`${WEBSITE_HOST_URL}${router.asPath}`} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="The Metal Mint" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
    </NextHead>
  )
}

export default Head
