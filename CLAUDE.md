# DT InsightCode — convenciones del proyecto

Estudio de tecnología en Guanacaste, Costa Rica. Hacemos páginas web, sistemas a la
medida y dashboards de ventas para PYMES. Daniel (José Daniel Torres Vargas) trabaja
solo: todo lo que se escriba acá lo mantiene él, sin equipo.

## Stack

- **Frontend de la landing:** Vite + React 18 + Tailwind (SPA de una sola página).
- **Hosting:** Cloudflare Workers. Deploy automático con `git push` a `main`.
- **Base de datos de leads del formulario:** Supabase (API REST directa con `fetch`,
  sin el SDK — ver `src/lib/supabaseClient.js`). La seguridad la dan las políticas RLS:
  solo permite INSERT, nunca SELECT desde el navegador.
- **Proyectos de clientes:** Cloudflare Workers/Pages + D1. Lo más simple que resuelva.

## Reglas de código

- Nombres en **español** cuando describen el negocio (`leadsPendientes`, `calcularTotal`)
  y en inglés cuando son términos técnicos estándar (`fetch`, `handler`). No mezclar
  dentro de un mismo identificador.
- **Nada de dependencias nuevas sin justificar.** Ya sacamos `@supabase/supabase-js`
  (pesaba 120 KB para un solo INSERT). Cada KB del bundle cuenta: el cliente típico
  entra desde un celular de gama media con datos móviles.
- Los textos visibles van en **español de Costa Rica, con voseo** ("tenés", "escribinos",
  "sabé"). Tono cercano, sin tecnicismos: el lector es el dueño de una soda, no un
  ingeniero.
- Todo cambio de UI debe funcionar en **modo claro y oscuro** (`dark:` de Tailwind) y
  respetar el panel de accesibilidad (tamaño de texto, alto contraste, reducir animaciones).
- Los errores que ve el usuario final están en español y dicen **qué hacer**, no qué
  falló internamente.

## Cosas del sitio que conviene saber

- `index.html` tiene el SEO estático: meta tags, Open Graph, `og-image.png`, y dos
  bloques JSON-LD (`ProfessionalService` y `FAQPage`). **Si cambian las FAQ de
  `src/App.jsx`, hay que actualizar el JSON-LD de `index.html` para que coincidan.**
- Dos botones flotantes ocupan las esquinas inferiores: **WhatsApp a la derecha**
  (`bottom-5 right-5`) y **accesibilidad a la izquierda**. Cualquier elemento flotante
  nuevo tiene que esquivarlos.
- Las capturas de casos de éxito van en `public/casos/` en **WebP** (no PNG), con
  `width`/`height` declarados en el JSX para evitar saltos de maquetación.
- `public/demo-*.html` son propuestas comerciales privadas para clientes: llevan
  `noindex` y están bloqueadas en `robots.txt`. No enlazarlas desde el sitio.
- El material de venta (PDFs, posts, logos, panel de prospectos) vive en
  `Material-Comercial/` y **no se publica**: no forma parte del sitio.

## Verificación

Antes de decir "listo": correr `npm run build` y, si el cambio se ve en pantalla,
levantar el preview y comprobarlo de verdad. No dar por bueno lo que no se ejecutó.

## Datos de contacto reales (no inventar otros)

- WhatsApp: +506 7229 6460
- Correo: dtinsightcode@gmail.com
- Instagram: https://www.instagram.com/dtinsightcode/
- Sitio: https://dtinsightcode.josedanieltorresvargas8.workers.dev/
