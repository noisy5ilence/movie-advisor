/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizeCss: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

module.exports = nextConfig;
