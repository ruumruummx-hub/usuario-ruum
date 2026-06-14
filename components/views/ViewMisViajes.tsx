'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

type Tab = 'Activos' | 'Programados' | 'Finalizados'

export default function ViewMisViajes() {
  const { showView } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>('Activos')
  const tabs: Tab[] = ['Activos', 'Programados', 'Finalizados']

  return (
    <div className="fade-in p-5 pb-24">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Mis viajes</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Viaje Activo */}
        <div
          className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm cursor-pointer"
          onClick={() => showView('view-detalle-viaje')}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">EN TRASLADO</span>
            <span className="text-xs text-slate-400">Hoy, 11:00 AM</span>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <div className="w-0.5 h-6 bg-slate-200 my-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Av. Reforma 222 → Taller Norte</p>
              <p className="text-xs text-slate-500 mt-1">Nissan Versa • ABC-123</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://ui-avatars.com/api/?name=Carlos+M&background=0D8ABC&color=fff" className="w-6 h-6 rounded-full" alt="Carlos M" />
              <span className="text-xs font-medium text-slate-600">Carlos M.</span>
            </div>
            <span className="text-xs font-bold text-blue-600">
              Ver detalle <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            </span>
          </div>
        </div>

        {/* Viaje Finalizado */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 opacity-80">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">FINALIZADO</span>
            <span className="text-xs text-slate-400">10 Jun, 2:00 PM</span>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <div className="w-0.5 h-6 bg-slate-200 my-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Agencia Centro → Domicilio</p>
              <p className="text-xs text-slate-500 mt-1">Honda Civic • XYZ-987</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <span className="text-xs text-green-600 font-medium">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Evidencia completa
            </span>
            <button onClick={() => showView('view-evidencia')} className="text-xs font-bold text-slate-600">
              Ver evidencia <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
