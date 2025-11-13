/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: [],
  },
  // Real-time infrastructure configuration
  experimental: {
    serverComponentsExternalPackages: [
      'socket.io',
      'orbital-brain',
      'rbi-kernel',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'ioredis',
      'bull',
      'redis'
    ],
    // Exclude large packages from output file tracing
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/three/**',
        'node_modules/@react-three/**',
        'node_modules/gl/**',
        'node_modules/glslify/**',
        'node_modules/socket.io/**',
        'node_modules/socket.io-client/**',
        'node_modules/engine.io/**',
        'node_modules/ws/**',
        'node_modules/bufferutil/**',
        'node_modules/utf-8-validate/**',
      ],
    },
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
    
    // Exclude large packages from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'three': 'commonjs three',
        '@react-three/fiber': 'commonjs @react-three/fiber',
        '@react-three/drei': 'commonjs @react-three/drei',
        'socket.io': 'commonjs socket.io',
        'socket.io-client': 'commonjs socket.io-client',
      });
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
