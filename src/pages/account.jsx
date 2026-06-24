// src/pages/profile.jsx
// import ProfilePage from '../features/profile/ProfilePage'
import AccountPage from '@/features/account/AccountPage'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'
export default function Profile() {
  return (
    <>
      <NextSeo {...PAGE_SEO.account} />
      <AccountPage />
    </>
  )
}
