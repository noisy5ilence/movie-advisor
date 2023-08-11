/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  future: {
    webpack5: true
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false
    };

    return config;
  }
};

module.exports = nextConfig;
