'use client'

import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faHistory, faCamera, faShieldAlt, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function ViewInicio() {
  const { showView, misViajes, cargandoViajes, usuario, setViajeSeleccionado } = useApp()

  // Viaje activo = el más reciente que no esté finalizado ni cancelado
  const viajeActivo = misViajes.find(v =>
    !['Finalizado', 'Cancelado'].includes(v.status)
  )

  return (
    <div className="fade-in p-5 pb-24">
      {/* Saludo */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {usuario ? `Hola, ${usuario.nombre}.` : 'Mueve tu auto sin soltar el control.'}
        </h2>
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
      {cargandoViajes ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 flex items-center justify-center gap-2 text-slate-400">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          <span className="text-sm">Cargando tus viajes...</span>
        </div>
      ) : viajeActivo ? (
        <div
          className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm mb-6 cursor-pointer"
          onClick={() => { setViajeSeleccionado(viajeActivo); showView('view-detalle-viaje') }}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              {viajeActivo.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">{viajeActivo.folio}</span>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <div className="w-0.5 h-6 bg-slate-200 my-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">Origen</p>
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {[viajeActivo.origen_calle, viajeActivo.origen_colonia].filter(Boolean).join(', ')}
              </p>
              <p className="text-xs text-slate-500 mt-2">Destino</p>
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {[viajeActivo.destino_calle, viajeActivo.destino_colonia].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
          {viajeActivo.conductores && (
            <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ui-avatars.com/api/?name=${viajeActivo.conductores.nombre}+${viajeActivo.conductores.apellido}&background=0D8ABC&color=fff`}
                className="w-8 h-8 rounded-full" alt="Conductor"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Tu conductor</p>
                <p className="text-sm font-semibold text-slate-800">
                  {viajeActivo.conductores.nombre} {viajeActivo.conductores.apellido}
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1">
                    ★ {viajeActivo.conductores.calificacion}
                  </span>
                </p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-400" />
            </div>
          )}
          {!viajeActivo.conductores && (
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-amber-600 font-medium">
                ⏳ Asignando conductor certificado...
              </p>
            </div>
          )}
        </div>
      ) : misViajes.length > 0 ? null : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-slate-500">Aún no tienes viajes activos.</p>
          <p className="text-xs text-slate-400 mt-1">¡Solicita tu primer traslado!</p>
        </div>
      )}

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
          <span className="text-sm font-medium text-slate-700">Mis viajes</span>
          {misViajes.length > 0 && (
            <span className="text-xs text-blue-600 font-medium">{misViajes.length} registrado{misViajes.length > 1 ? 's' : ''}</span>
          )}
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
            Todos nuestros conductores pasan por un riguroso proceso de certificación y cada etapa queda documentada.
          </p>
        </div>
      </div>
    </div>
  )
}
