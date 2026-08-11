import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/source-field', '/source-field/*'],
      },
    ],
    sitemap: 'https://stardusttosovereignty.com/sitemap.xml',
  }
}
