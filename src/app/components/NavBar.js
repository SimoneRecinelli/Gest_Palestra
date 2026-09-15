// src/app/components/Navbar.js
'use client'

import { useRouter } from 'next/navigation'

export default function Navbar({ userName, userRole }) {
  const router = useRouter()

const handleLogout = async () => {
    // Se gestisci il login con una semplice rotta o cookie personalizzato:
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // Ignora eventuali errori di rete e forza comunque il reindirizzamento
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="w-full bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold tracking-tight text-stone-900 font-['Oswald']">
          GESTIONALE PALESTRA
        </span>
        {userRole && (
          <span className="text-xs uppercase bg-stone-100 text-stone-600 px-2 py-1 rounded-md font-medium tracking-wide">
            {userRole}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {userName && (
          <span className="text-sm text-stone-600 hidden sm:inline">
            Ciao, <strong className="text-stone-900">{userName}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm cursor-pointer"
        >
          <span>Esci</span>
        </button>
      </div>
    </header>
  )
}