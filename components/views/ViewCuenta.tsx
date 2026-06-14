'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faFileInvoice, faBell, faHeadset, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const menuItems: { icon: IconDefinition; label: string }[] = [
  { icon: faCar, label: 'Mis vehículos' },
  { icon: faFileInvoice, label: 'Facturación' },
  { icon: faBell, label: 'Notificaciones' },
  { icon: faHeadset, label: 'Soporte y Ayuda' },
]

export default function ViewCuenta() {
  return (
    <div className="fade-in p-5 pb-24">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Mi Cuenta</h2>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
          JD
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Juan Díaz</h3>
          <p className="text-sm text-slate-500">juan.diaz@email.com</p>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded mt-1 inline-block">Usuario Personal</span>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-slate-400 text-xs" />
          </button>
        ))}
      </div>

      <button className="w-full mt-8 text-red-500 font-medium text-sm py-3 hover:bg-red-50 rounded-xl transition-colors">
        Cerrar sesión
      </button>
    </div>
  )
}
