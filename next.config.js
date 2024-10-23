/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true
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
  dest: 'public'
});

module.exports = withPWA(nextConfig);
