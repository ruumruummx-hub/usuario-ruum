'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

export default function TopHeader() {
  return (
    <header className="bg-slate-900 text-white px-5 pt-12 pb-4 flex-shrink-0 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">R</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Ruum Ruum</h1>
            <p className="text-[10px] text-slate-400 tracking-wider">BY MOVILIAX</p>
          </div>
        </div>
        <button className="relative p-2 text-slate-300 hover:text-white">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900" />
        </button>
      </div>
    </header>
  )
}
