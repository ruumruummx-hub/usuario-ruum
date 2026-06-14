'use client'

import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSatelliteDish, faStar, faPhone, faHeadset } from '@fortawesome/free-solid-svg-icons'

const timelineEvents = [
  { label: 'Solicitud confirmada', time: '11:00 AM', status: 'done' },
  { label: 'Conductor en origen', time: '11:15 AM', status: 'done' },
  { label: 'Evidencia inicial cargada', time: '', status: 'done', sub: 'Ver fotos' },
  { label: 'Traslado en curso', time: '', status: 'active', sub: 'En ruta hacia Taller Norte' },
  { label: 'Entrega y evidencia final', time: '', status: 'pending', sub: 'Pendiente' },
]

export default function ViewDetalleViaje() {
  const { showView } = useApp()

  return (
    <div className="fade-in pb-24">
      {/* Header mapa simulado */}
      <div className="bg-slate-200 h-48 relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-slate-300 opacity-50"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <button
          onClick={() => showView('view-mis-viajes')}
          className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 z-10"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-slate-800 z-10">
          <FontAwesomeIcon icon={faSatelliteDish} className="text-blue-600 mr-2 animate-pulse" /> Rastreo en tiempo real
        </div>
      </div>

      <div className="p-5 -mt-6 relative z-10">
        {/* Estatus Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">EN TRASLADO</span>
            <span className="text-xs text-slate-400">#TR-8842</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Tu vehículo está en camino</h3>
          <p className="text-sm text-slate-500">Llegada estimada al destino: <span className="font-semibold text-slate-700">12:30 PM</span></p>
        </div>

        {/* Conductor */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Tu conductor asignado</h4>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ui-avatars.com/api/?name=Carlos+M&background=0D8ABC&color=fff&size=128"
              className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
              alt="Carlos Méndez"
            />
            <div className="flex-1">
              <p className="text-base font-bold text-slate-800">Carlos Méndez</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">CERTIFICADO</span>
                <span className="text-xs text-slate-500">
                  <FontAwesomeIcon icon={faStar} className="text-amber-400" /> 4.9 (142 viajes)
                </span>
              </div>
            </div>
            <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100">
              <FontAwesomeIcon icon={faPhone} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Progreso del viaje</h4>
          <div className="relative pl-4 space-y-6">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />
            {timelineEvents.map((event, i) => (
              <div key={i} className={`relative flex gap-4 ${event.status === 'pending' ? 'opacity-50' : ''}`}>
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 mt-1 ${
                    event.status === 'done'
                      ? 'bg-green-500'
                      : event.status === 'active'
                      ? 'bg-blue-600 ring-4 ring-blue-100 animate-pulse'
                      : 'bg-slate-300'
                  }`}
                />
                <div>
                  <p className={`text-sm font-semibold ${event.status === 'active' ? 'text-blue-700 font-bold' : 'text-slate-800'}`}>
                    {event.label}
                  </p>
                  {event.time && <p className="text-xs text-slate-500">{event.time}</p>}
                  {event.sub && (
                    <p className={`text-xs ${event.status === 'done' ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                      {event.sub}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soporte */}
        <button className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faHeadset} /> Contactar a soporte
        </button>
      </div>
    </div>
  )
}
