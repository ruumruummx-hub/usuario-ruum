'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { ViewId, StepId } from '@/lib/types'

interface AppContextType {
  currentView: ViewId
  currentStep: StepId
  showView: (view: ViewId) => void
  setStep: (step: StepId) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewId>('view-inicio')
  const [currentStep, setCurrentStep] = useState<StepId>(1)

  const showView = (view: ViewId) => {
    setCurrentView(view)
  }

  const setStep = (step: StepId) => {
    setCurrentStep(step)
  }

  return (
    <AppContext.Provider value={{ currentView, currentStep, showView, setStep }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
