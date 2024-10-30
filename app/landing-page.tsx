import { SignInButton } from '@clerk/nextjs'
import { ArrowRight, Shirt } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-100">
      <header className="flex items-center px-4 lg:px-6 h-14 bg-stone-200">
        <Link className="flex items-center justify-center" href="#">
          <Shirt className="w-6 h-6 mr-2 text-stone-700" />
          <span className="font-bold text-stone-800">Fashion Deck</span>
        </Link>
      </header>
      <main className="flex items-center justify-center flex-1 p-4">
        <section className="w-full max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden transition-transform duration-300 transform shadow-2xl bg-stone-50 rounded-2xl hover:scale-105">
            <div className="p-8 sm:p-12 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-50">
              <div className="space-y-6 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  <span className="text-transparent bg-gradient-to-r from-stone-800 via-stone-600 to-stone-700 bg-clip-text">
                    Manage Your Wardrobe with Ease
                  </span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-stone-600">
                  Fashion Deck is your personal stylist in your pocket.
                  Organize, plan, and track your outfits effortlessly.
                </p>
                <div className="mt-8">
                  <SignInButton mode="modal">
                    <Button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-colors duration-200 rounded-md bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 py-4 bg-stone-800">
              <div className="flex space-x-4">
                <span className="transition-colors duration-200 cursor-pointer text-stone-300 hover:text-white">
                  Features
                </span>
                <span className="transition-colors duration-200 cursor-pointer text-stone-300 hover:text-white">
                  Pricing
                </span>
                <span className="transition-colors duration-200 cursor-pointer text-stone-300 hover:text-white">
                  About
                </span>
              </div>
              <div className="text-sm text-stone-300">
                Revolutionize your style
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-4 text-sm text-center bg-stone-200 text-stone-600">
        <p>© 2024 TheMisterPin. All rights reserved.</p>
      </footer>
    </div>
  )
}
