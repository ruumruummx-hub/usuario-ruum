'use client'

import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faHistory, faCamera, faShieldAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function ViewInicio() {
  const { showView } = useApp()

  return (
    <div className="fade-in p-5 pb-24">
      {/* Mensaje Central */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Mueve tu auto sin soltar el control.</h2>
        <p className="text-sm text-slate-500 mt-1">Tecnología para mover vehículos con confianza.</p>
      </div>

      {/* Botón Principal */}
      <button
        onClick={() => showView('view-solicitar')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 mb-6"
      >
        <FontAwesomeIcon icon={faPlusCircle} className="text-xl" />
        Solicitar traslado
      </button>

      {/* Viaje Activo */}
      <div
        className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm mb-6 cursor-pointer"
        onClick={() => showView('view-detalle-viaje')}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" /> EN TRASLADO
          </span>
          <span className="text-xs text-slate-400">#TR-8842</span>
        </div>
        <div className="flex gap-3 mb-3">
          <div className="flex flex-col items-center pt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="w-0.5 h-6 bg-slate-200 my-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500">Origen</p>
            <p className="text-sm font-semibold text-slate-800 leading-tight">Av. Reforma 222, CDMX</p>
            <p className="text-xs text-slate-500 mt-2">Destino</p>
            <p className="text-sm font-semibold text-slate-800 leading-tight">Taller Norte, Satélite</p>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://ui-avatars.com/api/?name=Carlos+M&background=0D8ABC&color=fff" className="w-8 h-8 rounded-full" alt="Carlos M" />
          <div className="flex-1">
            <p className="text-xs text-slate-500">Tu conductor</p>
            <p className="text-sm font-semibold text-slate-800">
              Carlos Méndez{' '}
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1">Certificado</span>
            </p>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-slate-400" />
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h3 className="text-sm font-bold text-slate-700 mb-3">Accesos rápidos</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => showView('view-mis-viajes')}
          className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faHistory} />
          </div>
          <span className="text-sm font-medium text-slate-700">Historial de viajes</span>
        </button>
        <button
          onClick={() => showView('view-evidencia')}
          className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faCamera} />
          </div>
          <span className="text-sm font-medium text-slate-700">Ver evidencias</span>
        </button>
      </div>

      {/* Mensaje de Confianza */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 mt-1" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Tu vehículo está protegido</p>
          <p className="text-xs text-blue-700 mt-1">
            Todos nuestros conductores pasan por un riguroso proceso de certificación y cada etapa del viaje queda documentada.
          </p>
        </div>
      </div>
    </div>
  )
}
