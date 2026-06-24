// src/pages/signup.jsx
import SignUpPage from '@/features/auth/SignUpPage'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function SignUp() {
  return (
  <>
    <NextSeo {...PAGE_SEO.signup} />
    <SignUpPage />
  </>
  )
}
