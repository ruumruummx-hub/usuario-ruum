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

export default function MobileApp() {
  const { currentView } = useApp()

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
