'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { ViewId, StepId } from '@/lib/types'

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
    const { data } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email, telefono')
      .eq('auth_id', uid)
      .single()
    if (data) {
      const perfil = data as UsuarioPerfil
      setUsuario(perfil)
      usuarioRef.current = perfil
      return perfil
    }
    return null
  }

  // ── Verificar sesión al montar ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setAutenticado(true)
        await cargarPerfil(session.user.id)
      }
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setAutenticado(true)
        await cargarPerfil(session.user.id)
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

    const channel = supabase
      .channel(`viajes-usuario-${usuario.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'viajes',
        filter: `usuario_id=eq.${usuario.id}`,
      }, () => { recargarViajes() })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [usuario])

  const recargarViajes = async () => {
    const u = usuarioRef.current
    if (!u) return
    setCargandoViajes(true)
    const { data, error } = await supabase
      .from('viajes')
      .select(`
        id, folio, status, fecha_programada, hora_programada,
        origen_calle, origen_colonia, destino_calle, destino_colonia,
        tarifa_cliente,
        conductores(nombre, apellido, calificacion),
        vehiculos(marca, modelo, placas)
      `)
      .eq('usuario_id', u.id)
      .order('created_at', { ascending: false })

    if (!error && data) setMisViajes(data as unknown as ViajeUsuario[])
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
      // 1. Registrar vehículo
      const { data: vehiculo } = await supabase
        .from('vehiculos')
        .insert({
          usuario_id: u.id,
          marca: datos.marca.toUpperCase(),
          modelo: datos.modelo.toUpperCase(),
          anio: datos.anio ?? null,
          color: datos.color?.toUpperCase() ?? null,
          placas: datos.placas.toUpperCase(),
          transmision: datos.transmision ?? null,
        })
        .select()
        .single()

      // 2. Crear viaje
      const { data: viaje, error } = await supabase
        .from('viajes')
        .insert({
          usuario_id: u.id,
          vehiculo_id: vehiculo?.id ?? null,
          origen_calle: datos.origen_calle.toUpperCase(),
          origen_numero: datos.origen_numero ?? null,
          origen_colonia: datos.origen_colonia?.toUpperCase() ?? null,
          origen_estado: datos.origen_estado?.toUpperCase() ?? null,
          origen_cp: datos.origen_cp ?? null,
          origen_contacto: datos.origen_contacto?.toUpperCase() ?? null,
          origen_telefono: datos.origen_telefono ?? null,
          destino_calle: datos.destino_calle.toUpperCase(),
          destino_numero: datos.destino_numero ?? null,
          destino_colonia: datos.destino_colonia?.toUpperCase() ?? null,
          destino_estado: datos.destino_estado?.toUpperCase() ?? null,
          destino_cp: datos.destino_cp ?? null,
          destino_contacto: datos.destino_contacto?.toUpperCase() ?? null,
          destino_telefono: datos.destino_telefono ?? null,
          referencias: datos.referencias ?? null,
          instrucciones: datos.instrucciones ?? null,
          fecha_programada: datos.fecha_programada ?? null,
          hora_programada: datos.hora_programada ?? null,
          status: 'Solicitud recibida',
        })
        .select()
        .single()

      if (error) { console.error('Error creando viaje:', error); return false }

      // 3. Timeline
      await supabase.from('timeline_viaje').insert({
        viaje_id: viaje.id,
        evento: 'Solicitud creada por el usuario',
        actor: `${u.nombre} ${u.apellido}`,
        actor_tipo: 'usuario',
      })

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
