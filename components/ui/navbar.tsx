import { Home, Search, PlusCircle, Bell, User } from "lucide-react"

function NavButton({ icon, large = false }: { icon: React.ReactNode; large?: boolean }) {
  return (
    <button
      className={`flex items-center justify-center rounded-full ${
        large
          ? 'w-16 h-16 bg-emerald-700 hover:bg-emerald-600 -mt-6'
          : 'w-12 h-12 bg-gray-700 hover:bg-gray-600'
      } transition-colors duration-200`}
    >
      {icon}
    </button>
  )
}

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-200 p-2">
      <div className="flex justify-around items-center">
        <NavButton icon={<Home size={24} />} />
        <NavButton icon={<Search size={24} />} />
        <NavButton icon={<PlusCircle size={36} />} large />
        <NavButton icon={<Bell size={24} />} />
        <NavButton icon={<User size={24} />} />
      </div>
    </nav>
  )
}

