'use client'

import { useApp } from '@/context/AppContext'
import TopHeader from './TopHeader'
import BottomNav from './BottomNav'
import ViewInicio from './views/ViewInicio'
import ViewSolicitar from './views/ViewSolicitar'
import ViewMisViajes from './views/ViewMisViajes'
import ViewDetalleViaje from './views/ViewDetalleViaje'
import ViewEvidencia from './views/ViewEvidencia'
import ViewCuenta from './views/ViewCuenta'
import ViewLogin from './views/ViewLogin'

export default function MobileApp() {
  const { currentView, authReady, autenticado, showView } = useApp()

  // Pantalla de carga mientras verifica sesión
  if (!authReady) {
    return (
      <div className="mobile-mockup flex flex-col items-center justify-center bg-white">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
          <span className="text-white font-black text-xl">RR</span>
        </div>
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    )
  }

  // Si no hay sesión → mostrar login
  if (!autenticado) {
    return (
      <div className="mobile-mockup overflow-y-auto">
        <ViewLogin onAuth={() => showView('view-inicio')} />
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'view-inicio': return <ViewInicio />
      case 'view-solicitar': return <ViewSolicitar />
      case 'view-mis-viajes': return <ViewMisViajes />
      case 'view-detalle-viaje': return <ViewDetalleViaje />
      case 'view-evidencia': return <ViewEvidencia />
      case 'view-cuenta': return <ViewCuenta />
      default: return <ViewInicio />
    }
  }

  return (
    <div className="mobile-mockup flex flex-col">
      <TopHeader />
      <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 relative">
        {renderView()}
      </main>
      <BottomNav />
    </div>
  )
}
