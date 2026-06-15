// lib/queries/usuario.ts — usuario-ruum

import { supabase } from '@/lib/supabase'

// ── AUTH ────────────────────────────────────────────────────

export async function loginConTelefono(telefono: string) {
  // Normalizar: si viene 55-1234-5678 → +5255-1234-5678
  const numero = '+52' + telefono.replace(/\D/g, '')
  const { data, error } = await supabase.auth.signInWithOtp({ phone: numero })
  if (error) throw error
  return data
}

export async function verificarOTP(telefono: string, token: string) {
  const numero = '+52' + telefono.replace(/\D/g, '')
  const { data, error } = await supabase.auth.verifyOtp({
    phone: numero, token, type: 'sms',
  })
  if (error) throw error
  return data
}

export async function logout() {
  await supabase.auth.signOut()
}

// ── PERFIL ──────────────────────────────────────────────────

export async function getPerfilUsuario() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (error) return null
  return data
}

// ── VIAJES ──────────────────────────────────────────────────

export async function getMisViajes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('viajes')
    .select(`
      id, folio, status, fecha_programada, hora_programada,
      origen_calle, origen_colonia,
      destino_calle, destino_colonia,
      tarifa_cliente, created_at,
      conductores(nombre, apellido, calificacion, foto_url),
      vehiculos(marca, modelo, placas)
    `)
    .eq('usuario_id', (await supabase
      .from('usuarios').select('id').eq('auth_id', user.id).single()).data?.id ?? '')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getDetalleViaje(viajeId: string) {
  const { data, error } = await supabase
    .from('viajes')
    .select(`
      *,
      conductores(nombre, apellido, calificacion, telefono, certificacion),
      vehiculos(marca, modelo, anio, color, placas),
      evidencias(*),
      timeline_viaje(evento, actor, actor_tipo, created_at)
    `)
    .eq('id', viajeId)
    .single()

  if (error) throw error
  return data
}

export async function solicitarViaje(payload: {
  vehiculo_marca: string; vehiculo_modelo: string; vehiculo_anio?: string
  vehiculo_color?: string; vehiculo_placas: string; vehiculo_transmision?: string
  origen_calle: string; origen_numero?: string; origen_colonia?: string
  origen_estado?: string; origen_cp?: string; origen_contacto?: string; origen_telefono?: string
  destino_calle: string; destino_numero?: string; destino_colonia?: string
  destino_estado?: string; destino_cp?: string; destino_contacto?: string; destino_telefono?: string
  referencias?: string; instrucciones?: string
  fecha_programada?: string; hora_programada?: string
  tipo_servicio?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // Obtener usuario_id desde la tabla usuarios
  const { data: usuarioRow } = await supabase
    .from('usuarios').select('id').eq('auth_id', user.id).single()
  if (!usuarioRow) throw new Error('Perfil de usuario no encontrado')

  // Crear vehículo si no existe
  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .insert({
      usuario_id: usuarioRow.id,
      marca: payload.vehiculo_marca.toUpperCase(),
      modelo: payload.vehiculo_modelo.toUpperCase(),
      anio: payload.vehiculo_anio,
      color: payload.vehiculo_color?.toUpperCase(),
      placas: payload.vehiculo_placas.toUpperCase(),
      transmision: payload.vehiculo_transmision,
    })
    .select()
    .single()

  // Crear viaje
  const { data: viaje, error } = await supabase
    .from('viajes')
    .insert({
      usuario_id: usuarioRow.id,
      vehiculo_id: vehiculo?.id,
      origen_calle: payload.origen_calle.toUpperCase(),
      origen_numero: payload.origen_numero,
      origen_colonia: payload.origen_colonia?.toUpperCase(),
      origen_estado: payload.origen_estado?.toUpperCase(),
      origen_cp: payload.origen_cp,
      origen_contacto: payload.origen_contacto?.toUpperCase(),
      origen_telefono: payload.origen_telefono,
      destino_calle: payload.destino_calle.toUpperCase(),
      destino_numero: payload.destino_numero,
      destino_colonia: payload.destino_colonia?.toUpperCase(),
      destino_estado: payload.destino_estado?.toUpperCase(),
      destino_cp: payload.destino_cp,
      destino_contacto: payload.destino_contacto?.toUpperCase(),
      destino_telefono: payload.destino_telefono,
      referencias: payload.referencias,
      instrucciones: payload.instrucciones,
      fecha_programada: payload.fecha_programada,
      hora_programada: payload.hora_programada,
      status: 'Solicitud recibida',
    })
    .select()
    .single()

  if (error) throw error

  // Timeline inicial
  await supabase.from('timeline_viaje').insert({
    viaje_id: viaje.id,
    evento: 'Solicitud creada por el usuario',
    actor: 'Usuario',
    actor_tipo: 'usuario',
  })

  return viaje
}

// ── REALTIME ────────────────────────────────────────────────

export function suscribirMiViaje(viajeId: string, callback: (viaje: any) => void) {
  return supabase
    .channel(`usuario-viaje-${viajeId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'viajes', filter: `id=eq.${viajeId}` },
      (payload) => callback(payload.new)
    )
    .subscribe()
}
