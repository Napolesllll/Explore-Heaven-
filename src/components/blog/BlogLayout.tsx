'use client'

import { ReactNode } from 'react'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-24">{children}</div>
    </main>
  )
}
 