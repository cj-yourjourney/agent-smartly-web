// pages/login.jsx
import LoginPage from '@/features/auth/LoginPage'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function Login() {
  return (
  <>
    <NextSeo {...PAGE_SEO.login} />
    <LoginPage />
  </>
  )
}
