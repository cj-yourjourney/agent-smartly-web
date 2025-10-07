import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchProgress } from '@/features/progress/state/progressSlice'

export default function ProgressPage() {
  const dispatch = useDispatch()
  const { attempts, status, error } = useSelector((state) => state.progress)

  useEffect(() => {
    dispatch(fetchProgress())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Your Progress</h1>

      {status === 'loading' && (
        <p className="text-gray-500 text-center">Loading your progress...</p>
      )}

      {status === 'failed' && <p className="text-error text-center">{error}</p>}

      {status === 'succeeded' && attempts.length === 0 && (
        <p className="text-gray-500 text-center">
          You haven’t made any attempts yet.
        </p>
      )}

      {status === 'succeeded' && attempts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="card bg-base-100 shadow-md border border-base-300"
            >
              <div className="card-body">
                <h2 className="card-title">
                  Question #{attempt.question || attempt.id}
                </h2>
                <p>
                  Selected:{' '}
                  <span
                    className={
                      attempt.is_correct
                        ? 'text-success font-semibold'
                        : 'text-error font-semibold'
                    }
                  >
                    {attempt.selected_choice || 'N/A'}
                  </span>
                </p>
                <progress
                  className={`progress w-full ${
                    attempt.is_correct ? 'progress-success' : 'progress-error'
                  }`}
                  value={attempt.is_correct ? 100 : 50}
                  max="100"
                ></progress>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
