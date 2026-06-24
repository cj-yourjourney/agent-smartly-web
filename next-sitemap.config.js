/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.agentsmartly.co',
  generateRobotsTxt: true,
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
