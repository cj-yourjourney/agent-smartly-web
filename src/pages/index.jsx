// pages/index.jsx
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'
import HomePage from '@/features/home'

export default function Home() {
  return (
    <>
      <NextSeo {...PAGE_SEO.home} />
      <HomePage />
    </>
  )
}
