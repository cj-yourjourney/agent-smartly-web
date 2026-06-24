import AboutPage from '@/features/about/AboutPage'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function About() {
  
  return (
    <>
      <NextSeo {...PAGE_SEO.about} />
      <AboutPage />
    </>
  )
}
