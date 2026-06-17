'use client'

import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShieldAlt, faCar, faCarSide, faTachometerAlt, faGasPump, faClock, faSearchPlus } from '@fortawesome/free-solid-svg-icons'

const photos = [
  { icon: faCar, label: 'Vista Frontal' },
  { icon: faCarSide, label: 'Vista Lateral' },
  { icon: faTachometerAlt, label: 'Tablero: 45,200 km' },
  { icon: faGasPump, label: 'Combustible: 3/4' },
]

export default function ViewEvidencia() {
  const { showView } = useApp()

  return (
    <div className="fade-in p-5 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => showView('view-mis-viajes')} className="text-slate-500 hover:text-slate-800">
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Evidencia de tu auto</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex gap-3">
        <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 text-xl mt-1" />
        <div>
          <p className="text-sm font-bold text-green-800">Tranquilidad documentada</p>
          <p className="text-xs text-green-700 mt-1">Cada etapa del traslado queda registrada visualmente para tu total seguridad.</p>
        </div>
      </div>

      {/* Evidencia Inicial */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" /> Evidencia Inicial (11:15 AM)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="aspect-square bg-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-slate-300 relative overflow-hidden group cursor-pointer"
            >
              <FontAwesomeIcon icon={photo.icon} className="text-2xl mb-1" />
              <span className="text-xs font-medium">{photo.label}</span>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FontAwesomeIcon icon={faSearchPlus} className="text-white text-xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 font-semibold mb-1">Observaciones del conductor:</p>
          <p className="text-sm text-slate-700">&quot;Vehículo en buenas condiciones generales. Se documenta un rayón leve preexistente en la puerta trasera izquierda.&quot;</p>
        </div>
      </div>

      {/* Evidencia Final */}
      <div className="opacity-60">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-400 rounded-full" /> Evidencia Final
        </h3>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
          <FontAwesomeIcon icon={faClock} className="text-3xl text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-500">Pendiente de entrega</p>
          <p className="text-xs text-slate-400 mt-1">Las fotos finales estarán disponibles cuando el conductor confirme la entrega en el destino.</p>
        </div>
      </div>
    </div>
  )
}
