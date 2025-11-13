/** @type {import('next').NextConfig} */
const path = require('path');

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
    
    // Resolve workspace packages via package.json exports
    // This allows webpack to follow package.json exports field properly
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    
    // Add workspace packages to resolve.modules so webpack finds them
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../Orbital-Brain'),
      path.resolve(__dirname, '../RBI-Kernel'),
      path.resolve(__dirname, '../node_modules'),
    ];
    
    return config;
  },
}

module.exports = nextConfig
