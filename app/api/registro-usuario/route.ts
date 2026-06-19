import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type PerfilUsuario = {
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

type RegistroPayload = {
  password?: string
  perfilUsuario?: Partial<PerfilUsuario>
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return badRequest('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.', 500)
  }

  const body = (await request.json().catch(() => null)) as RegistroPayload | null
  const perfil = body?.perfilUsuario
  const password = body?.password

  if (!perfil?.email || !password) return badRequest('Correo y contraseña son requeridos.')
  if (!perfil.nombre || !perfil.apellido || !perfil.tipo) return badRequest('Datos personales incompletos.')

  const email = String(perfil.email).toLowerCase().trim()
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const usuarioPayload: PerfilUsuario = {
    nombre: String(perfil.nombre),
    apellido: String(perfil.apellido),
    curp: perfil.curp ? String(perfil.curp) : null,
    email,
    telefono: perfil.telefono ? String(perfil.telefono) : null,
    tipo: String(perfil.tipo),
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
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      usuario_perfil: usuarioPayload,
    },
  })

  if (authError || !authData.user) {
    return badRequest(authError?.message ?? 'No se pudo crear el usuario de autenticación.', 422)
  }

  const { error: dbError } = await admin.from('usuarios').insert({
    auth_id: authData.user.id,
    ...usuarioPayload,
  })

  if (dbError) {
    await admin.auth.admin.deleteUser(authData.user.id).catch(() => undefined)
    return badRequest(dbError.message, 422)
  }

  return NextResponse.json({ ok: true, userId: authData.user.id })
}
