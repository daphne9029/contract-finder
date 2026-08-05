import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: '合約檔案查詢系統',
  description: '快速搜尋和篩選合約檔案',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={fraunces.variable}>
      <body className="bg-[#faf9f5]">
        <nav className="bg-white/70 backdrop-blur-sm border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-serif font-medium tracking-wide text-stone-900">
              合約檔案查詢系統
            </h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
          {children}
        </main>
      </body>
    </html>
  )
}
