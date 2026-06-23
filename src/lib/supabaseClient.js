import { createClient } from '@supabase/supabase-js'

/**
 * Inicialización del cliente de Supabase.
 *
 * Las credenciales se leen desde variables de entorno para NO exponerlas
 * en el repositorio. Define estos valores en un archivo `.env` (ver `.env.example`).
 *
 * - En Vite, las variables públicas deben empezar con `VITE_`.
 * - Si migras este componente a Next.js, usa `process.env.NEXT_PUBLIC_SUPABASE_URL`
 *   y `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` en su lugar.
 *
 * IMPORTANTE: aquí se usa la clave pública (anon key), pensada para el navegador.
 * La seguridad real se aplica con las políticas RLS de la base de datos
 * (ver el archivo `supabase/schema.sql`). Nunca uses la `service_role` key en el frontend.
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

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
)

/** Indica si Supabase está realmente configurado (útil para el formulario). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
