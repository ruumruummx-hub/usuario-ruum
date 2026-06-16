'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import type { StepId } from '@/lib/types'

function StepIndicator({ step, currentStep }: { step: number; currentStep: number }) {
  const active = step <= currentStep
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        {step}
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-blue-600' : 'text-slate-500'}`}>
        {step === 1 ? 'Vehículo' : step === 2 ? 'Ruta' : 'Confirmar'}
      </span>
    </div>
  )
}

const inputCls = 'w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelCls = 'block text-xs font-medium text-slate-500 mb-1'

export default function ViewSolicitar() {
  const { showView, currentStep, setStep, solicitarViaje } = useApp()
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)

  // Datos del formulario
  const [form, setForm] = useState({
    // Vehículo
    marca: '', modelo: '', anio: '', color: '', placas: '', transmision: '',
    // Ruta
    origen_calle: '', origen_numero: '', origen_colonia: '', origen_estado: '', origen_cp: '',
    origen_contacto: '', origen_telefono: '',
    destino_calle: '', destino_numero: '', destino_colonia: '', destino_estado: '', destino_cp: '',
    destino_contacto: '', destino_telefono: '',
    referencias: '', instrucciones: '',
    fecha_programada: '', hora_programada: '',
  })

  const set = (k: keyof typeof form, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const nextStep = (step: StepId) => setStep(step)

  const confirmar = async () => {
    setEnviando(true)
    const ok = await solicitarViaje(form)
    setEnviando(false)
    if (ok) {
      setExito(true)
      setTimeout(() => {
        setExito(false)
        setStep(1)
        showView('view-mis-viajes')
      }, 2500)
    }
  }

  if (exito) {
    return (
      <div className="fade-in p-5 pb-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">¡Solicitud enviada!</h3>
        <p className="text-sm text-slate-500">
          Hemos recibido tu solicitud. Nuestro equipo está asignando al mejor conductor certificado para ti.
        </p>
      </div>
    )
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

      {/* PASO 1 — Vehículo */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">¿Qué vehículo vamos a mover?</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Marca *</label>
                <input type="text" value={form.marca}
                  onChange={e => set('marca', e.target.value.toUpperCase())}
                  placeholder="TOYOTA" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Modelo *</label>
                <input type="text" value={form.modelo}
                  onChange={e => set('modelo', e.target.value.toUpperCase())}
                  placeholder="HILUX" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Año</label>
                <input type="text" value={form.anio}
                  onChange={e => set('anio', e.target.value)}
                  placeholder="2022" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Color</label>
                <input type="text" value={form.color}
                  onChange={e => set('color', e.target.value.toUpperCase())}
                  placeholder="BLANCO" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Placas *</label>
              <input type="text" value={form.placas}
                onChange={e => set('placas', e.target.value.toUpperCase())}
                placeholder="XYZ-987" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Transmisión</label>
              <select value={form.transmision} onChange={e => set('transmision', e.target.value)}
                className={`${inputCls} bg-white`}>
                <option value="">Seleccionar...</option>
                <option>Automática</option>
                <option>Manual</option>
                <option>CVT</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => nextStep(2)}
            disabled={!form.marca || !form.modelo || !form.placas}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all mt-4"
          >
            Siguiente → Ruta
          </button>
        </div>
      )}

      {/* PASO 2 — Ruta */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">¿De dónde a dónde?</h3>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide">📍 Origen</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Calle *</label>
                <input type="text" value={form.origen_calle}
                  onChange={e => set('origen_calle', e.target.value.toUpperCase())}
                  placeholder="AV. REFORMA" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Número</label>
                <input type="text" value={form.origen_numero}
                  onChange={e => set('origen_numero', e.target.value.toUpperCase())}
                  placeholder="222" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Colonia</label>
                <input type="text" value={form.origen_colonia}
                  onChange={e => set('origen_colonia', e.target.value.toUpperCase())}
                  placeholder="CUAUHTÉMOC" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CP</label>
                <input type="text" value={form.origen_cp}
                  onChange={e => set('origen_cp', e.target.value.replace(/\D/g,'').slice(0,5))}
                  placeholder="06600" maxLength={5} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Contacto en origen</label>
              <input type="text" value={form.origen_contacto}
                onChange={e => set('origen_contacto', e.target.value.toUpperCase())}
                placeholder="NOMBRE DEL CONTACTO" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Teléfono origen</label>
              <input type="tel" value={form.origen_telefono} maxLength={12}
                onChange={e => {
                  const d = e.target.value.replace(/\D/g,'').slice(0,10)
                  set('origen_telefono', d.length<=3?d:d.length<=6?`${d.slice(0,3)}-${d.slice(3)}`:`${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`)
                }}
                placeholder="55-0000-0000" className={inputCls} />
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">🏁 Destino</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Calle *</label>
                <input type="text" value={form.destino_calle}
                  onChange={e => set('destino_calle', e.target.value.toUpperCase())}
                  placeholder="TALLER NORTE" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Número</label>
                <input type="text" value={form.destino_numero}
                  onChange={e => set('destino_numero', e.target.value.toUpperCase())}
                  placeholder="100" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Colonia</label>
                <input type="text" value={form.destino_colonia}
                  onChange={e => set('destino_colonia', e.target.value.toUpperCase())}
                  placeholder="SATÉLITE" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CP</label>
                <input type="text" value={form.destino_cp}
                  onChange={e => set('destino_cp', e.target.value.replace(/\D/g,'').slice(0,5))}
                  placeholder="53100" maxLength={5} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Contacto en destino</label>
              <input type="text" value={form.destino_contacto}
                onChange={e => set('destino_contacto', e.target.value.toUpperCase())}
                placeholder="NOMBRE DEL CONTACTO" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Teléfono destino</label>
              <input type="tel" value={form.destino_telefono} maxLength={12}
                onChange={e => {
                  const d = e.target.value.replace(/\D/g,'').slice(0,10)
                  set('destino_telefono', d.length<=3?d:d.length<=6?`${d.slice(0,3)}-${d.slice(3)}`:`${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`)
                }}
                placeholder="55-0000-0000" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Fecha del traslado</label>
            <input type="date" value={form.fecha_programada}
              onChange={e => set('fecha_programada', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hora</label>
            <input type="time" value={form.hora_programada}
              onChange={e => set('hora_programada', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Instrucciones especiales</label>
            <textarea value={form.instrucciones}
              onChange={e => set('instrucciones', e.target.value)}
              placeholder="Llamar 10 min antes, acceso por calle lateral..."
              rows={3} className={inputCls} />
          </div>

          <div className="flex gap-3">
            <button onClick={() => nextStep(1)}
              className="flex-1 border border-slate-300 text-slate-600 font-bold py-4 rounded-xl">
              ← Vehículo
            </button>
            <button onClick={() => nextStep(3)}
              disabled={!form.origen_calle || !form.destino_calle}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl">
              Confirmar →
            </button>
          </div>
        </div>
      )}

      {/* PASO 3 — Confirmación */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Confirma tu solicitud</h3>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">🚗 Vehículo</p>
            <p className="font-semibold">{form.marca} {form.modelo} · {form.placas}</p>
            {form.color && <p className="text-sm text-slate-500">{form.color} · {form.transmision || 'Sin especificar'}</p>}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">📍 Ruta</p>
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="w-0.5 h-8 bg-slate-200 my-1" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">{form.origen_calle}{form.origen_numero ? ` ${form.origen_numero}` : ''}, {form.origen_colonia}</p>
                <p className="text-sm font-semibold mt-3">{form.destino_calle}{form.destino_numero ? ` ${form.destino_numero}` : ''}, {form.destino_colonia}</p>
              </div>
            </div>
            {form.fecha_programada && (
              <p className="text-sm text-slate-500">📅 {form.fecha_programada} {form.hora_programada && `· ${form.hora_programada}`}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => nextStep(2)}
              className="flex-1 border border-slate-300 text-slate-600 font-bold py-4 rounded-xl">
              ← Ruta
            </button>
            <button onClick={confirmar} disabled={enviando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
              {enviando
                ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Enviando...</>
                : '✓ Solicitar traslado'
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
