// pages/index.jsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Welcome to My Next.js App(Updated!!!)
      </h1>
      <p className="text-lg text-base-content mb-6">
        This is a simple page using DaisyUI components.
      </p>
      <div className="flex gap-4">
        <button className="btn btn-primary">Click Me</button>
        <Link href="/practice" className="btn btn-secondary">
          Practice Quiz
        </Link>
      </div>
    </div>
  )
}
