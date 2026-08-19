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
      { source: '/preorder', destination: '/order', permanent: true },
      { source: '/thank-you-preorder', destination: '/order/success', permanent: true },
      { source: '/order/direct', destination: '/order', permanent: true },
      { source: '/order/direct/:path*', destination: '/order', permanent: true },
      // Soft legacy / convenience paths → home or contact
      { source: '/contact', destination: '/gigi#contact', permanent: false },
      { source: '/writings', destination: 'https://stardusttosovereignty.substack.com', permanent: false },
      { source: '/subscribe', destination: 'https://stardusttosovereignty.substack.com/subscribe', permanent: false },
      { source: '/newsletter', destination: 'https://stardusttosovereignty.substack.com/subscribe', permanent: false },
    ]
  },
}

module.exports = nextConfig
