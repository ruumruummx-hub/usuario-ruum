'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import {
  getPerfilUsuario, crearPerfilDesdeAuth, getMisViajes,
  solicitarViaje as solicitarViajeQuery, suscribirMisViajes,
} from '@/lib/queries/usuario'
import type { ViewId, StepId } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

// ─── TIPOS ────────────────────────────────────────────────────────────────────
export interface ViajeUsuario {
  id: string
  folio: string | null
  status: string
  fecha_programada: string | null
  hora_programada: string | null
  origen_calle: string | null
  origen_colonia: string | null
  destino_calle: string | null
  destino_colonia: string | null
  tarifa_cliente: number
  conductores: { nombre: string; apellido: string; calificacion: number } | null
  vehiculos: { marca: string; modelo: string; placas: string } | null
}

export interface UsuarioPerfil {
  id: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
}

type UsuarioPerfilInsert = {
  nombre: string
  apellido: string
  curp: string | null
  email: string
  telefono: string | null
  tipo: string
  estatus: string
  calle: string | null
  numero: string | null
  colonia: string | null
  municipio: string | null
  estado_geo: string | null
  codigo_postal: string | null
  razon_social: string | null
  rfc: string | null
  regimen_fiscal: string | null
  cfdi: string | null
  domicilio_fiscal: string | null
}

interface AppContextType {
  currentView: ViewId
  currentStep: StepId
  showView: (view: ViewId) => void
  setStep: (step: StepId) => void
  viajeSeleccionado: ViajeUsuario | null
  setViajeSeleccionado: (v: ViajeUsuario | null) => void
  authReady: boolean
  autenticado: boolean
  usuario: UsuarioPerfil | null
  misViajes: ViajeUsuario[]
  cargandoViajes: boolean
  solicitarViaje: (datos: DatosSolicitud) => Promise<boolean>
  recargarViajes: () => Promise<void>
}

export interface DatosSolicitud {
  marca: string; modelo: string; anio?: string; color?: string
  placas: string; transmision?: string
  origen_calle: string; origen_numero?: string; origen_colonia?: string
  origen_estado?: string; origen_cp?: string
  origen_contacto?: string; origen_telefono?: string
  destino_calle: string; destino_numero?: string; destino_colonia?: string
  destino_estado?: string; destino_cp?: string
  destino_contacto?: string; destino_telefono?: string
  referencias?: string; instrucciones?: string
  fecha_programada?: string; hora_programada?: string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewId>('view-inicio')
  const [currentStep, setCurrentStep] = useState<StepId>(1)
  const [viajeSeleccionado, setViajeSeleccionado] = useState<ViajeUsuario | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null)
  const [misViajes, setMisViajes] = useState<ViajeUsuario[]>([])
  const [cargandoViajes, setCargandoViajes] = useState(false)

  // Ref para acceder al usuario más reciente dentro de funciones async
  const usuarioRef = useRef<UsuarioPerfil | null>(null)
  useEffect(() => { usuarioRef.current = usuario }, [usuario])

  // ── Cargar perfil desde la tabla usuarios ──────────────────────────────────
  const cargarPerfil = async (uid: string): Promise<UsuarioPerfil | null> => {
    const data = await getPerfilUsuario(uid)
    if (data) {
      const perfil = data as UsuarioPerfil
      setUsuario(perfil)
      usuarioRef.current = perfil
      return perfil
    }
    return null
  }

  const crearPerfilLocal = async (user: User): Promise<UsuarioPerfil | null> => {
    const perfil = await crearPerfilDesdeAuth(user)
    if (perfil) {
      setUsuario(perfil as UsuarioPerfil)
      usuarioRef.current = perfil as UsuarioPerfil
    }
    return perfil as UsuarioPerfil | null
  }

  // ── Verificar sesión al montar ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setAutenticado(true)
        const perfil = await cargarPerfil(session.user.id)
        if (!perfil) await crearPerfilLocal(session.user)
      }
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setAutenticado(true)
        const perfil = await cargarPerfil(session.user.id)
        if (!perfil) await crearPerfilLocal(session.user)
      } else {
        setAutenticado(false)
        setUsuario(null)
        usuarioRef.current = null
        setMisViajes([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Cargar viajes y activar realtime cuando hay usuario ───────────────────
  useEffect(() => {
    if (!usuario) return
    recargarViajes()

    const channel = suscribirMisViajes(usuario.id, () => { recargarViajes() })

    return () => { supabase.removeChannel(channel) }
  }, [usuario])

  const recargarViajes = async () => {
    const u = usuarioRef.current
    if (!u) return
    setCargandoViajes(true)
    try {
      const data = await getMisViajes(u.id)
      setMisViajes(data as unknown as ViajeUsuario[])
    } catch (e) {
      console.error('Error cargando viajes:', e)
    }
    setCargandoViajes(false)
  }

  // ── Solicitar viaje ────────────────────────────────────────────────────────
  const solicitarViaje = async (datos: DatosSolicitud): Promise<boolean> => {
    // Si usuario aún no cargó, intentar obtenerlo de la sesión activa
    let u = usuarioRef.current
    if (!u) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false
      u = await cargarPerfil(user.id)
      if (!u) return false
    }

    try {
      await solicitarViajeQuery(u, datos)
      await recargarViajes()
      return true
    } catch (e) {
      console.error('Error en solicitarViaje:', e)
      return false
    }
  }

  return (
    <AppContext.Provider value={{
      currentView, currentStep,
      showView: setCurrentView,
      setStep: setCurrentStep,
      viajeSeleccionado, setViajeSeleccionado,
      authReady, autenticado,
      usuario, misViajes, cargandoViajes,
      solicitarViaje, recargarViajes,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}