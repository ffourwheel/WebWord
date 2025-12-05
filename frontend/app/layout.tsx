import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['400', '600', '700'] 
})

export const metadata: Metadata = {
  title: 'Worddee.ai',
  description: 'AI English Learning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  )
}