module.exports = {
  siteUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/favorites' },
      { userAgent: '*', disallow: '/watch-list' }
    ]
  }
};
