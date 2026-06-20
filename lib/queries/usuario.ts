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

// Recibe authId ya resuelto (de la sesión/listener), igual que el
// resto de funciones de este módulo — no se re-deriva aquí dentro
// vía supabase.auth.getUser() para no duplicar esa responsabilidad.
export async function getPerfilUsuario(authId: string) {
  const { data } = await supabase
    .from('usuarios')
    .select('id, nombre, apellido, email, telefono, requiere_cambio_password')
    .eq('auth_id', authId)
    .maybeSingle()

  return data
}

// Cambia la contraseña de la sesión activa y limpia el flag de cuenta
// provisional. auth.updateUser() requiere una sesión válida (no el
// auth_id ni la contraseña anterior) — quien llama esta función ya
// pasó por signInWithPassword con la contraseña provisional, así que
// hay sesión activa por definición.
export async function completarCambioPassword(usuarioId: string, nuevaPassword: string) {
  const { error: authError } = await supabase.auth.updateUser({ password: nuevaPassword })
  if (authError) throw authError

  const { error: dbError } = await supabase
    .from('usuarios')
    .update({ requiere_cambio_password: false })
    .eq('id', usuarioId)

  if (dbError) throw dbError
}

// Crea la fila en `usuarios` a partir de los datos que quedaron en
// user_metadata durante el registro (paso previo a la verificación
// de OTP). Si no hay metadata de perfil o falta nombre/apellido, no
// hace nada — ese caso lo maneja el flujo de "completar registro".
export async function crearPerfilDesdeAuth(user: {
  id: string; email?: string | null
  user_metadata?: Record<string, unknown>
}) {
  const metadata = user.user_metadata ?? {}
  const perfil = metadata.usuario_perfil as Record<string, unknown> | undefined
  if (!perfil?.nombre || !perfil?.apellido) return null

  const email = String(perfil.email ?? user.email ?? '')
  if (!email) return null

  const { error } = await supabase.from('usuarios').insert({
    auth_id: user.id,
    nombre: String(perfil.nombre),
    apellido: String(perfil.apellido),
    curp: perfil.curp ? String(perfil.curp) : null,
    email,
    telefono: perfil.telefono ? String(perfil.telefono) : null,
    tipo: String(perfil.tipo ?? 'Personal'),
    estatus: String(perfil.estatus ?? 'Activo'),
    calle: perfil.calle ? String(perfil.calle) : null,
    numero: perfil.numero ? String(perfil.numero) : null,
    colonia: perfil.colonia ? String(perfil.colonia) : null,
    municipio: perfil.municipio ? String(perfil.municipio) : null,
    estado_geo: perfil.estado_geo ? String(perfil.estado_geo) : null,
    codigo_postal: perfil.codigo_postal ? String(perfil.codigo_postal) : null,
    razon_social: perfil.razon_social ? String(perfil.razon_social) : null,
    rfc: perfil.rfc ? String(perfil.rfc) : null,
    regimen_fiscal: perfil.regimen_fiscal ? String(perfil.regimen_fiscal) : null,
    cfdi: perfil.cfdi ? String(perfil.cfdi) : null,
    domicilio_fiscal: perfil.domicilio_fiscal ? String(perfil.domicilio_fiscal) : null,
  })

  if (error) {
    console.error('Error creando perfil de usuario:', error)
    return null
  }

  return getPerfilUsuario(user.id)
}

// ── VIAJES ──────────────────────────────────────────────────

export async function getMisViajes(usuarioId: string) {
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
    .eq('usuario_id', usuarioId)
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

export async function cancelarViajeUsuario(viajeId: string) {
  const { data, error } = await supabase.rpc('cancelar_viaje_usuario', {
    p_viaje_id: viajeId,
  })

  if (error) throw error
  return data as { viaje_id: string; status: 'Cancelado'; penalizacion: number }
}

export async function solicitarViaje(
  usuario: { id: string; nombre: string; apellido: string },
  payload: {
    marca: string; modelo: string; anio?: string
    color?: string; placas: string; transmision?: string
    origen_calle: string; origen_numero?: string; origen_colonia?: string
    origen_estado?: string; origen_cp?: string; origen_contacto?: string; origen_telefono?: string
    destino_calle: string; destino_numero?: string; destino_colonia?: string
    destino_estado?: string; destino_cp?: string; destino_contacto?: string; destino_telefono?: string
    referencias?: string; instrucciones?: string
    fecha_programada?: string; hora_programada?: string
  }
) {
  // Crear vehículo si no existe
  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .insert({
      usuario_id: usuario.id,
      marca: payload.marca.toUpperCase(),
      modelo: payload.modelo.toUpperCase(),
      anio: payload.anio ?? null,
      color: payload.color?.toUpperCase() ?? null,
      placas: payload.placas.toUpperCase(),
      transmision: payload.transmision ?? null,
    })
    .select()
    .single()

  // Crear viaje
  const { data: viaje, error } = await supabase
    .from('viajes')
    .insert({
      usuario_id: usuario.id,
      vehiculo_id: vehiculo?.id ?? null,
      origen_calle: payload.origen_calle.toUpperCase(),
      origen_numero: payload.origen_numero ?? null,
      origen_colonia: payload.origen_colonia?.toUpperCase() ?? null,
      origen_estado: payload.origen_estado?.toUpperCase() ?? null,
      origen_cp: payload.origen_cp ?? null,
      origen_contacto: payload.origen_contacto?.toUpperCase() ?? null,
      origen_telefono: payload.origen_telefono ?? null,
      destino_calle: payload.destino_calle.toUpperCase(),
      destino_numero: payload.destino_numero ?? null,
      destino_colonia: payload.destino_colonia?.toUpperCase() ?? null,
      destino_estado: payload.destino_estado?.toUpperCase() ?? null,
      destino_cp: payload.destino_cp ?? null,
      destino_contacto: payload.destino_contacto?.toUpperCase() ?? null,
      destino_telefono: payload.destino_telefono ?? null,
      referencias: payload.referencias ?? null,
      instrucciones: payload.instrucciones ?? null,
      fecha_programada: payload.fecha_programada ?? null,
      hora_programada: payload.hora_programada ?? null,
      status: 'Solicitud recibida',
    })
    .select()
    .single()

  if (error) throw error

  // Timeline inicial — actor es el nombre real del usuario, no un
  // marcador genérico, para que el historial sea legible para Admin.
  await supabase.from('timeline_viaje').insert({
    viaje_id: viaje.id,
    evento: 'Solicitud creada por el usuario',
    actor: `${usuario.nombre} ${usuario.apellido}`,
    actor_tipo: 'usuario',
  })

  return viaje
}

// ── REALTIME ────────────────────────────────────────────────

// Suscripción real usada por AppContext: todos los viajes del usuario,
// cualquier evento, simplemente dispara un refetch de la lista.
export function suscribirMisViajes(usuarioId: string, callback: () => void) {
  return supabase
    .channel(`viajes-usuario-${usuarioId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'viajes', filter: `usuario_id=eq.${usuarioId}` },
      callback
    )
    .subscribe()
}

// Suscripción a UN viaje específico, con el row actualizado entregado
// directo al callback. Pensada para una futura vista de detalle con
// actualización en vivo (hoy ViewDetalleViaje no la usa — solo muestra
// lo que ya está cargado en la lista). No se modifica ni se conecta
// aquí: eso es una decisión de producto, no de esta migración.
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