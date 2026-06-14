'use client'

import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import type { StepId } from '@/lib/types'

function StepIndicator({ step, currentStep }: { step: number; currentStep: number }) {
  const active = step <= currentStep
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
        }`}
      >
        {step}
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-blue-600' : 'text-slate-500'}`}>
        {step === 1 ? 'Vehículo' : step === 2 ? 'Ruta' : 'Resumen'}
      </span>
    </div>
  )
}

export default function ViewSolicitar() {
  const { showView, currentStep, setStep } = useApp()

  const nextStep = (step: StepId) => setStep(step)

  const confirmTrip = () => {
    alert('✅ ¡Tu traslado ya fue solicitado!\n\nHemos recibido tu solicitud #TR-8845. Nuestro equipo está asignando al mejor conductor certificado para ti. Te notificaremos en cuanto esté en camino.')
    showView('view-mis-viajes')
  }

  return (
    <div className="fade-in p-5 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => showView('view-inicio')} className="text-slate-500 hover:text-slate-800">
          <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Solicitar traslado</h2>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-6 px-2">
        <StepIndicator step={1} currentStep={currentStep} />
        <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
        <StepIndicator step={2} currentStep={currentStep} />
        <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
        <StepIndicator step={3} currentStep={currentStep} />
      </div>

      {/* Paso 1 */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">¿Qué vehículo vamos a mover?</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Marca y Modelo</label>
              <input type="text" defaultValue="Nissan Versa" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Año</label>
                <input type="text" defaultValue="2022" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Color</label>
                <input type="text" defaultValue="Blanco" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Placas</label>
              <input type="text" defaultValue="ABC-123" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Transmisión</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Automática</option>
                <option>Estándar / Manual</option>
              </select>
            </div>
          </div>
          <button onClick={() => nextStep(2)} className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl mt-6 hover:bg-blue-700 transition-colors">
            Continuar
          </button>
        </div>
      )}

      {/* Paso 2 */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">¿De dónde sale y a dónde llega?</h3>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-4 w-2.5 h-2.5 rounded-full bg-green-500 z-10" />
              <input type="text" defaultValue="Av. Reforma 222, Juárez, CDMX" className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-4 w-2.5 h-2.5 rounded-full bg-red-500 z-10" />
              <input type="text" defaultValue="Taller Norte, Blvd. Manuel Ávila Camacho, Satélite" className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">¿Cuándo lo necesitas?</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Lo antes posible</option>
                <option>Programar para otra fecha</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de servicio</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Traslado personal</option>
                <option>Traslado empresarial</option>
                <option>Traslado para agencia</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => nextStep(1)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Atrás</button>
            <button onClick={() => nextStep(3)} className="flex-[2] bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors">Ver cotización</button>
          </div>
        </div>
      )}

      {/* Paso 3 */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Revisión y cotización</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-sm text-slate-500">Vehículo</span>
              <span className="text-sm font-semibold text-slate-800">Nissan Versa (ABC-123)</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-sm text-slate-500">Ruta</span>
              <span className="text-sm font-semibold text-slate-800 text-right">Reforma 222<br />→ Taller Norte</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-sm text-slate-500">Servicio</span>
              <span className="text-sm font-semibold text-slate-800">Traslado personal (Lo antes posible)</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-slate-800">Tarifa estimada</span>
              <span className="text-2xl font-bold text-blue-600">$1,850.00</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mt-0.5" />
            <p className="text-xs text-blue-800">Esta tarifa incluye el traslado, el seguro de responsabilidad civil y la documentación fotográfica completa del vehículo.</p>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => nextStep(2)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Atrás</button>
            <button onClick={confirmTrip} className="flex-[2] bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">Confirmar solicitud</button>
          </div>
        </div>
      )}
    </div>
  )
}
