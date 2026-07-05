/**
 * Envío de leads a Supabase vía su API REST (PostgREST), sin SDK.
 *
 * Antes usábamos @supabase/supabase-js, pero para un único INSERT el SDK
 * completo agregaba ~120 KB al bundle. Un fetch directo hace exactamente
 * lo mismo con cero dependencias.
 *
 * Las credenciales se leen desde variables de entorno (ver .env.example).
 * - En Vite, las variables públicas deben empezar con `VITE_`.
 * - Si migras a Next.js usa `process.env.NEXT_PUBLIC_...` en su lugar.
 *
 * IMPORTANTE: aquí se usa la clave pública (anon key), pensada para el
 * navegador. La seguridad real la aplican las políticas RLS de la base de
 * datos (ver supabase/schema.sql): solo permite INSERT, nunca SELECT.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Aviso temprano en consola si falta configuración (no rompe el render).
  console.warn(
    '[Supabase] Faltan variables de entorno. Crea un archivo .env con ' +
      'VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (ver .env.example).'
  )
}

/** Indica si Supabase está realmente configurado (útil para el formulario). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Inserta un lead en la tabla `leads_contacto`.
 * Lanza un Error si la petición falla.
 */
export async function submitLead(lead) {
  const res = await fetch(`${supabaseUrl}/rest/v1/leads_contacto`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(lead),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Supabase REST ${res.status}: ${detail}`)
  }
}
