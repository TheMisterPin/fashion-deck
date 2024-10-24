import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import Navbar from '@/components/ui/nabar'
import LandingPage from './landing-page'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Fashion-Deck',
  description: 'Wardrobe Managenment tool',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <LandingPage />
          </SignedOut>
          <SignedIn>
            <Navbar />
            <Toaster richColors/>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
