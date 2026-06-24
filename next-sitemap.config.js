/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.agentsmartly.com',
  generateRobotsTxt: true,
  outDir: './out',

  // ── Exclude private/app pages from sitemap ──
  // Rule: add any new page that should NOT be indexed by Google
  // Public pages (home, about, pricing, blog, contact) → do NOT add here
  // Private pages (behind login, or noindex) → add here AND in disallow below
  exclude: [
    '/auth/*', // login, signup, reset-password, verify-email
    '/account', // user account settings
    '/onboarding', // post-signup onboarding flow
    '/learning/*' // key-concepts, practice, progress (behind login)
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',

        // ── Block crawlers from private/app pages ──
        // Keep in sync with the exclude array above
        disallow: [
          '/auth/', // login, signup, reset-password, verify-email
          '/account', // user account settings
          '/onboarding', // post-signup onboarding flow
          '/learning/' // key-concepts, practice, progress (behind login)
        ]
      }
    ]
  }
}
