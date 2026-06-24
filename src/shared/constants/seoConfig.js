const BASE_URL = 'https://www.agentsmartly.com'
const OG_IMAGE =
  'https://agent-smartly-images.s3.us-west-1.amazonaws.com/hero-image.png'

export const DEFAULT_SEO = {
  titleTemplate: '%s | AgentSmartly',
  defaultTitle: 'AgentSmartly — CA Real Estate Exam Prep',
  description:
    'Pass the CA Real Estate Salesperson Exam with 144 key concepts across 7 topics. Review → Practice → Check. 500+ students passed. Start free.',
  canonical: BASE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'AgentSmartly',
    title: 'AgentSmartly — CA Real Estate Exam Prep',
    description:
      'Pass the CA Real Estate Salesperson Exam with 144 key concepts across 7 topics. Review → Practice → Check. 500+ students passed.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'AgentSmartly — CA Real Estate Exam Prep'
      }
    ]
  },
  twitter: {
    cardType: 'summary_large_image'
  }
}

export const PAGE_SEO = {
  // ── Public pages (indexed by Google) ──
  home: {
    title: 'CA Real Estate Exam Prep | 144 Key Concepts',
    description:
      'Pass the CA Real Estate Salesperson Exam with 144 key concepts across 7 topics. Review → Practice → Check. 500+ students passed. Start free.',
    canonical: BASE_URL,
    openGraph: {
      url: BASE_URL,
      title: 'AgentSmartly — CA Real Estate Exam Prep',
      description:
        '144 key concepts. 7 topics. Review → Practice → Check. The focused way to pass the CA real estate exam.',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AgentSmartly' }]
    }
  },
  about: {
    title: 'About',
    description:
      'CJ Luo built AgentSmartly after passing the CA real estate exam in 2025. Learn the story behind the platform.',
    canonical: `${BASE_URL}/about`,
    openGraph: {
      url: `${BASE_URL}/about`,
      title: 'About | AgentSmartly',
      description:
        'CJ Luo built AgentSmartly after passing the CA real estate exam in 2025. Learn the story behind the platform.'
    }
  },

  // ── Auth pages (noindex — keep out of Google) ──
  login: {
    title: 'Sign In',
    noindex: true,
    canonical: `${BASE_URL}/auth/login`
  },
  signup: {
    title: 'Start Free Trial',
    noindex: true,
    canonical: `${BASE_URL}/auth/signup`
  },
  resetPassword: {
    title: 'Reset Password',
    noindex: true
  },
  verifyEmail: {
    title: 'Verify Email',
    noindex: true
  },

  // ── App pages (noindex — logged-in user flows) ──
  onboarding: {
    title: 'Get Started',
    noindex: true
  },
  keyConcepts: {
    title: 'Key Concepts',
    noindex: true
  },
  practice: {
    title: 'Practice Questions',
    noindex: true
  },
  progress: {
    title: 'My Progress',
    noindex: true
  },
  account: {
    title: 'Account',
    noindex: true
  }
}

// ── For future blog posts (dynamic) ──
export const getBlogPostSeo = (post) => ({
  title: post.title,
  description: post.excerpt,
  canonical: `${BASE_URL}/blog/${post.slug}`,
  openGraph: {
    type: 'article',
    url: `${BASE_URL}/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    images: post.coverImage
      ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
      : [{ url: OG_IMAGE, width: 1200, height: 630, alt: post.title }],
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [`${BASE_URL}/about`],
      tags: post.tags
    }
  }
})
