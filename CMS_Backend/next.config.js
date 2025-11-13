/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Real-time infrastructure configuration
  experimental: {
    serverComponentsExternalPackages: ['socket.io', 'orbital-brain', 'rbi-kernel']
  },
  // WebSocket support
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }
    // Handle ES module .js extensions
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    // Ensure path aliases work and resolve workspace packages
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      'orbital-brain': path.resolve(__dirname, '../Orbital-Brain'),
      'rbi-kernel': path.resolve(__dirname, '../RBI-Kernel'),
    };
    return config;
  },
}

module.exports = nextConfig
