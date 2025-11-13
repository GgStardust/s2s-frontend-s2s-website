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
    // Ensure path aliases work
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
}

module.exports = nextConfig
