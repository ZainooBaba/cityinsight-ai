'use client'

import Link from 'next/link'

type Summary = {
  id: string
  file_name: string
  summary: string
  created_at: string
  user_id?: string
  city_detected?: string
  department_detected?: string
  topics?: string[]
}

export default function SummaryCardList({
  summaries,
  showUserId = false,
}: {
  summaries: Summary[]
  showUserId?: boolean
}) {
  if (!summaries.length) {
    return (
      <p className="text-[#999] italic text-sm">
        No uploads yet. Submit something to get started.
      </p>
    )
  }

  return (
    <div className="grid gap-6">
      {summaries.map((s) => (
        <Link
          key={s.id}
          href={`/summary/${s.id}`}
          className="block transition-all duration-300 transform hover:scale-[1.01]"
        >
          <div className="p-5 rounded-xl bg-[#fefefe] shadow-md hover:shadow-lg cursor-pointer">
            <div className="text-sm text-[#89b0ae] mb-1">
              {new Date(s.created_at).toLocaleString()}
            </div>

            <div className="text-lg font-semibold text-[#555b6e]">
              {s.file_name}
            </div>

            {s.city_detected && (
              <p className="text-sm text-gray-500">📍 {s.city_detected}</p>
            )}

            {s.department_detected && (
              <p className="text-sm text-gray-500">🏛️ {s.department_detected}</p>
            )}

            {s.topics?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {s.topics.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="text-[#777] mt-2 line-clamp-3">
              {s.summary?.slice(0, 250) || 'No summary available...'}
            </div>

            {showUserId && (
              <div className="text-xs text-gray-400 mt-2 italic">
                User: {s.user_id}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
