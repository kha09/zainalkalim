'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} bg-gray-50`}>
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-purple-600">زين الكلم</h1>
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
