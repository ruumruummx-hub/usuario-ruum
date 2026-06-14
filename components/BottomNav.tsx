'use client'

import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPlusCircle, faRoute, faCamera, faUser } from '@fortawesome/free-solid-svg-icons'
import type { ViewId } from '@/lib/types'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const navItems: { id: ViewId; icon: IconDefinition; label: string }[] = [
  { id: 'view-inicio', icon: faHome, label: 'Inicio' },
  { id: 'view-solicitar', icon: faPlusCircle, label: 'Solicitar' },
  { id: 'view-mis-viajes', icon: faRoute, label: 'Mis viajes' },
  { id: 'view-evidencia', icon: faCamera, label: 'Evidencia' },
  { id: 'view-cuenta', icon: faUser, label: 'Cuenta' },
]

const NAV_VIEWS = navItems.map((n) => n.id)

export default function BottomNav() {
  const { currentView, showView } = useApp()

  // Only show active state for main nav views
  const activeView = NAV_VIEWS.includes(currentView) ? currentView : null

  return (
    <nav className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center flex-shrink-0 z-20">
      {navItems.map((item) => {
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            onClick={() => showView(item.id)}
            className={`flex flex-col items-center gap-1 transition-all w-16 ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className={`text-xl transition-transform duration-200 ${isActive ? '-translate-y-0.5' : ''}`}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
