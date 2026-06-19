import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// Sube un documento al bucket privado `documentos` bajo usuarios/{auth_id}/{nombre}.{ext}
async function subirDocumento(
  admin: SupabaseClient,
  authId: string,
  file: File,
  nombreArchivo: string
): Promise<string | null> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `usuarios/${authId}/${nombreArchivo}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await admin.storage.from('documentos').upload(path, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: true,
  })
  if (error) {
    console.error(`Error subiendo ${nombreArchivo}:`, error)
    return null
  }
  return path
}

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return badRequest('Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.', 500)
  }

  const form = await request.formData().catch(() => null)
  if (!form) return badRequest('No se pudo leer el formulario.')

  const password = form.get('password') as string | null
  const perfilRaw = form.get('perfilUsuario') as string | null
  const perfil = perfilRaw ? (JSON.parse(perfilRaw) as Partial<PerfilUsuario>) : null

  const ineTipo = (form.get('ineTipo') as string | null) || null
  const ineNumero = (form.get('ineNumero') as string | null) || null
  const ineVigencia = (form.get('ineVigencia') as string | null) || null
  const ineFrente = form.get('ineFrente') as File | null
  const ineReverso = form.get('ineReverso') as File | null
  const domicilio = form.get('domicilio') as File | null

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

  // ── 1. Crear la cuenta de autenticación ─────────────────────────────────────
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { usuario_perfil: usuarioPayload },
  })

  if (authError || !authData.user) {
    return badRequest(authError?.message ?? 'No se pudo crear el usuario de autenticación.', 422)
  }

  // ── 2. Insertar el perfil de negocio en `usuarios` ──────────────────────────
  const { data: nuevoUsuario, error: dbError } = await admin
    .from('usuarios')
    .insert({ auth_id: authData.user.id, ...usuarioPayload })
    .select('id')
    .single()

  if (dbError || !nuevoUsuario) {
    await admin.auth.admin.deleteUser(authData.user.id).catch(() => undefined)
    return badRequest(dbError?.message ?? 'No se pudo crear el perfil de usuario.', 422)
  }

  // ── 3. Subir documentos (si vienen) y registrarlos en `documentos` ─────────
  // No bloqueamos el registro si falla la subida de documentos: la cuenta ya
  // existe y el usuario puede volver a subirlos después desde la app.
  const registrarDocumento = async (
    file: File | null, nombreArchivo: string, tipoDoc: string,
    folio: string | null = null, vigencia: string | null = null
  ) => {
    if (!file || file.size === 0) return
    const path = await subirDocumento(admin, authData.user.id, file, nombreArchivo)
    if (!path) return
    const { error } = await admin.from('documentos').insert({
      tipo_doc: tipoDoc,
      entidad_tipo: 'Usuario',
      entidad_id: nuevoUsuario.id,
      folio,
      fecha_vencimiento: vigencia,
      estatus: 'Pendiente',
      archivo_url: path,
    })
    if (error) console.error(`Error registrando documento ${nombreArchivo}:`, error)
  }

  const tipoDocIne = ineTipo || 'INE / Pasaporte'
  await Promise.all([
    registrarDocumento(ineFrente, 'ine-frente', tipoDocIne, ineNumero, ineVigencia),
    registrarDocumento(ineReverso, 'ine-reverso', tipoDocIne, ineNumero, ineVigencia),
    registrarDocumento(domicilio, 'comprobante-domicilio', 'Comprobante domicilio'),
  ])

  return NextResponse.json({ ok: true, userId: authData.user.id })
}
