// pages/exam.jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import ExamMode from '@/features/exam/ExamMode'
import Navbar from '@/shared/components/Navbar'

export default function ExamPage() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <ExamMode />
    </>
  )
}
