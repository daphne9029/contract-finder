import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['500', '900'],
  variable: '--font-poster',
})

export const metadata: Metadata = {
  title: '合約檔案查詢系統',
  description: '快速搜尋和篩選合約檔案',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="zh-TW" className={notoSansTC.variable}>
      <body className="bg-[#ececec]">
        <nav className="relative bg-white border-b-2 border-black overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-3 bg-black" />
          <div className="max-w-7xl mx-auto px-4 py-6 pl-8 flex items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-black tracking-tight text-black">
              合約檔案查詢系統
            </h1>
            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 160 20"
                className="hidden sm:block w-32 h-4 text-black shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12 L18 6 L30 15 L44 4 L58 14 L74 5 L90 16 L106 6 L122 13 L136 5 L158 11" />
              </svg>
              {session?.user?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
                  <span className="hidden sm:inline">{session.user.email}</span>
                  <a href="/api/auth/signout" className="text-gray-500 hover:text-black underline">
                    登出
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
          {children}
        </main>
      </body>
    </html>
  )
}
