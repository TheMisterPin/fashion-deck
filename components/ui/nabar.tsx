'use client'

import { Shirt } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'

const navItems = [
	{ name: 'Wardrobe', href: '/wardrobe' },
	{ name: 'Outfits', href: '/outfits' }
]

export default function Navbar() {
	const pathname = usePathname()

	return (
		<nav className="shadow-md bg-stone-100">
			<div className="px-4 mx-auto max-w-7xl sm:px-0 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<Shirt className="hidden w-8 h-8 text-stone-700 md:block" />
							<span className="text-xl font-bold text-stone-800 whitespace-nowrap sm:ml-0 ">
								Fashion Deck
							</span>
						</Link>
						<div className="flex items-baseline ml-10 space-x-4">
							{navItems.map(item => (
								<Link
									key={item.name}
									href={item.href}
									className="relative group"
								>
									<span
										className={`text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium ${
											pathname === item.href ? 'text-stone-900' : ''
										}`}
										style={{
											transform:
												pathname === item.href ? 'scale(1.2)' : 'scale(1)',
											transition: 'transform 0.3s ease-in-out'
										}}
									>
										{item.name}
									</span>
									<motion.div
										className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-600"
										initial={false}
										animate={
											pathname === item.href ? { width: '100%' } : { width: 0 }
										}
										transition={{ duration: 0.3, ease: 'easeInOut' }}
									/>
									<motion.div
										className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-600"
										initial={false}
										whileHover={{ width: '100%' }}
										transition={{ type: 'spring', stiffness: 300, damping: 20 }}
									/>
								</Link>
							))}
						</div>
					</div>
					<div className="flex items-center ml-4 md:ml-6">
						<UserButton afterSignOutUrl="/" />
					</div>
				</div>
			</div>
		</nav>
	)
}
