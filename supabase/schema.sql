-- ============================================================
--  Tabla: leads_contacto
--  Almacena las consultas enviadas desde el formulario de la landing.
--  Ejecuta este script en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create table if not exists public.leads_contacto (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  nombre_negocio  text,
  telefono        text not null,
  correo          text not null,
  tipo_servicio   text,
  origen          text default 'landing-web',
  -- Campo interno para el seguimiento comercial del lead
  estado          text not null default 'nuevo'
                    check (estado in ('nuevo', 'contactado', 'cerrado', 'descartado')),
  created_at      timestamptz not null default now()
);

-- Índice para ordenar/consultar leads recientes rápidamente
create index if not exists leads_contacto_created_at_idx
  on public.leads_contacto (created_at desc);

-- ============================================================
--  SEGURIDAD: Row Level Security (RLS)
--  Imprescindible: la "anon key" es pública y viaja en el navegador.
--  Con RLS permitimos SOLO insertar (crear leads), nunca leerlos
--  desde el frontend. La lectura queda para usuarios autenticados
--  / el panel de Supabase (que usa la service_role).
-- ============================================================

alter table public.leads_contacto enable row level security;

-- Permite que cualquier visitante (rol anon) INSERTE un lead...
drop policy if exists "permitir insertar leads desde la web" on public.leads_contacto;
create policy "permitir insertar leads desde la web"
  on public.leads_contacto
  for insert
  to anon
  with check (true);

-- ...pero NO existe política de SELECT para anon, así que nadie
-- puede leer los datos de otros clientes desde el navegador. ✅

-- (Opcional) Permitir lectura solo a usuarios autenticados de tu equipo:
-- drop policy if exists "lectura para autenticados" on public.leads_contacto;
-- create policy "lectura para autenticados"
--   on public.leads_contacto
--   for select
--   to authenticated
--   using (true);
