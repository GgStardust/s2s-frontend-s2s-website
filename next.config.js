/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/books', destination: '/book-one', permanent: true },
      { source: '/about-the-book', destination: '/book-one', permanent: true },
      { source: '/about-gigi', destination: '/gigi', permanent: true },
      { source: '/about', destination: '/s2s', permanent: true },
      { source: '/codex', destination: '/s2s', permanent: true },
      { source: '/codex/:id', destination: '/s2s', permanent: true },
      { source: '/source-field', destination: '/s2s', permanent: true },
      { source: '/source-field/:id', destination: '/s2s', permanent: true },
      { source: '/enter', destination: '/', permanent: true },
      { source: '/console', destination: '/s2s', permanent: false },
      { source: '/preorder', destination: '/order/direct', permanent: true },
      { source: '/thank-you-preorder', destination: '/order/success', permanent: true },
    ]
  },
}

module.exports = nextConfig
