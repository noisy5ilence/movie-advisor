/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ISR/fetch cache in one size-capped SQLite file instead of millions of files, see cache-handler.js
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0,
  experimental: {
    optimizeCss: true,
    staleTimes: {
      dynamic: 3600,
      static: 3600
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA(nextConfig);
