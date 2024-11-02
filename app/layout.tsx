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
  weight: '100 900'
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Fashion Deck - Your Smart Wardrobe Manager',
  description:
    'Revolutionize your wardrobe management with Fashion Deck. Upload clothes, create outfits, and get AI-powered style recommendations.',
  openGraph: {
    title: 'Fashion Deck - Your Smart Wardrobe Manager',
    description:
      'Revolutionize your wardrobe management with Fashion Deck. Upload clothes, create outfits, and get AI-powered style recommendations.',
    images: [
      {
        url: 'https://res.cloudinary.com/dl1fw2gx2/image/upload/v1730549994/fashion-deck-preview.png', // Replace with your actual image URL
        width: 1200,
        height: 600,
        alt: 'Fashion Deck App Preview'
      }
    ],
    url: 'https://fashion-deck.vercel.app/', // Replace with your actual URL
    siteName: 'Fashion Deck',
    type: 'website'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png'
  }
}

export default function RootLayout({
  children
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
            <Toaster richColors />
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
