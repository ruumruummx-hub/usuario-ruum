'use client'

import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faFileInvoice, faBell, faHeadset, faChevronRight, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'

export default function ViewCuenta() {
  const { usuario, misViajes, showView } = useApp()

  const iniciales = usuario
    ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`
    : 'RR'

  const viajesFinalizados = misViajes.filter(v => v.status === 'Finalizado').length
  const viajesActivos = misViajes.filter(v =>
    !['Finalizado', 'Cancelado'].includes(v.status)
  ).length

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // La página se recargará y AppContext detectará que no hay sesión
    window.location.reload()
  }

  return (
    <div className="fade-in p-5 pb-24">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Mi Cuenta</h2>

      {/* Perfil */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
          {iniciales}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 truncate">
            {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...'}
          </h3>
          <p className="text-sm text-slate-500 truncate">{usuario?.email ?? usuario?.telefono ?? '—'}</p>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full mt-1 inline-block font-medium">
            Usuario Activo
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-slate-800">{misViajes.length}</p>
          <p className="text-xs text-slate-500 mt-1">Viajes totales</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-green-600">{viajesFinalizados}</p>
          <p className="text-xs text-slate-500 mt-1">Completados</p>
        </div>
      </div>

      {/* Menú */}
      <div className="space-y-2 mb-6">
        <button
          onClick={() => showView('view-mis-viajes')}
          className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <FontAwesomeIcon icon={faCar} />
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-slate-700 block">Mis vehículos y viajes</span>
              {viajesActivos > 0 && (
                <span className="text-xs text-blue-600">{viajesActivos} viaje{viajesActivos > 1 ? 's' : ''} activo{viajesActivos > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-slate-400 text-xs" />
        </button>

        <button className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <FontAwesomeIcon icon={faFileInvoice} />
            </div>
            <span className="text-sm font-medium text-slate-700">Facturación</span>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-slate-400 text-xs" />
        </button>

        <button className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <span className="text-sm font-medium text-slate-700">Notificaciones</span>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-slate-400 text-xs" />
        </button>

        <button className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <span className="text-sm font-medium text-slate-700">Soporte y Ayuda</span>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-slate-400 text-xs" />
        </button>
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-medium text-sm py-3 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        Cerrar sesión
      </button>
    </div>
  )
}
