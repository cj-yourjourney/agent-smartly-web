/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.agentsmartly.com',
  generateRobotsTxt: true,
  outDir: './out', // ← add this
  exclude: ['/auth/*', '/account', '/onboarding', '/learning/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/account', '/onboarding', '/learning/']
      }
    ]
  }
}
