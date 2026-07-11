/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/codex', destination: '/source-field', permanent: true },
      { source: '/codex/:id', destination: '/source-field/:id', permanent: true },
    ];
  },
}

module.exports = nextConfig

