const siteUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/favorites' },
      { userAgent: '*', disallow: '/watchlist' }
    ],
    additionalSitemaps: [`${siteUrl}/server-sitemap.xml`]
  }
};
