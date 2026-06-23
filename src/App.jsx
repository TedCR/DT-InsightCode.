import { useState } from 'react'
import {
  BarChart3,
  Code2,
  ShieldCheck,
  MapPin,
  Headset,
  Users,
  Search,
  FileText,
  Rocket,
  LifeBuoy,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
  X,
  Phone,
  Mail,
  Linkedin,
  Instagram,
  Facebook,
  Building2,
  TrendingUp,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from './lib/supabaseClient'

/* ============================================================
   DATOS DE CONTENIDO (fácil de editar en un solo lugar)
   ============================================================ */

const BRAND = 'DT InsightCode'

// Número de WhatsApp en formato internacional, solo dígitos (para el enlace wa.me)
const WHATSAPP_NUMBER = '50672296460'
// Versión legible para mostrar al usuario
const WHATSAPP_DISPLAY = '+506 7229 6460'
// Mensaje precargado al abrir el chat (mejora la conversión)
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola 👋, me interesa una asesoría sobre tecnología y datos para mi negocio.'
)
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Casos de éxito', href: '#casos' },
  { label: 'Contacto', href: '#contacto' },
]

const SERVICES = [
  {
    icon: BarChart3,
    title: 'Business Analytics & Datos',
    description:
      'Transformamos tus hojas de Excel y tus ventas en dashboards interactivos para que sepas exactamente dónde ganar más dinero y reducir costos.',
    points: ['Dashboards en tiempo real', 'KPIs claros y accionables', 'Reportes automáticos'],
  },
  {
    icon: Code2,
    title: 'Desarrollo de Sistemas y Páginas Web',
    description:
      'Creamos plataformas a medida, rápidas, estables y optimizadas para atraer clientes locales, automatizar tus procesos y digitalizar tu PYME.',
    points: ['Sitios web veloces', 'Sistemas a la medida', 'Automatización de procesos'],
  },
]

const TRUST_POINTS = [
  {
    icon: MapPin,
    title: 'Conocemos Guanacaste',
    description:
      'Entendemos el mercado, la temporada y la realidad de la PYME guanacasteca. Soluciones pensadas para tu zona, no plantillas genéricas.',
  },
  {
    icon: Headset,
    title: 'Soporte real, sin intermediarios',
    description:
      'Hablas directamente con quien desarrolla tu proyecto. Respuesta rápida por WhatsApp y acompañamiento cercano en cada paso.',
  },
  {
    icon: ShieldCheck,
    title: 'Profesionalismo y confianza',
    description:
      'Trabajo serio, plazos cumplidos y tecnología moderna. Tu información y la de tus clientes siempre protegida.',
  },
]

const PROCESS_STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Diagnóstico gratuito',
    description: 'Conversamos sobre tu negocio y detectamos oportunidades reales de mejora.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Propuesta a medida',
    description: 'Diseñamos una solución clara, con alcance, tiempos y costos transparentes.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Desarrollo ágil',
    description: 'Construimos por etapas, mostrándote avances para ajustar sobre la marcha.',
  },
  {
    icon: LifeBuoy,
    step: '04',
    title: 'Soporte continuo',
    description: 'Te acompañamos después del lanzamiento para que todo siga funcionando.',
  },
]

const SERVICE_OPTIONS = [
  'Business Analytics / Dashboards',
  'Página o sitio web',
  'Sistema o software a medida',
  'Automatización de procesos',
  'No estoy seguro / Quiero asesoría',
]

// Caso de éxito destacado. Coloca las capturas en /public/casos/ con estos nombres.
const CASE_STUDY = {
  client: 'Asociación Solidarista de la Municipalidad de Tilarán',
  tag: 'Sistema de gestión a medida',
  summary:
    'La asociación llevaba toda su operación de forma manual: ahorros, préstamos y solicitudes en hojas de cálculo y papel. Desarrollamos un sistema web completo que digitalizó y centralizó toda su gestión.',
  before: 'Todo en hojas de Excel y papel, sin control centralizado ni reportes.',
  after: 'Plataforma web completa: dashboard, ahorros, préstamos, solicitudes y reportes en un solo lugar.',
  metrics: [
    { value: '100%', label: 'Procesos digitalizados' },
    { value: '0', label: 'Trámites en papel' },
    { value: '24/7', label: 'Acceso para asociados' },
  ],
  features: [
    'Dashboard con ahorros y préstamos en tiempo real',
    'Gestión de préstamos con exportación a PDF y CSV',
    'Control de ahorros programados, vacacionales y navideños',
    'Solicitudes de préstamo y retiro en línea',
    'Perfiles de asociado autogestionables',
  ],
  gallery: [
    { src: '/casos/tilaran-dashboard.png', alt: 'Dashboard del asociado con resumen de ahorros y préstamos' },
    { src: '/casos/tilaran-prestamos.png', alt: 'Listado de préstamos activos con exportación de reportes' },
    { src: '/casos/tilaran-ahorros.png', alt: 'Panel de ahorros con métricas y estado de cada producto' },
    { src: '/casos/tilaran-solicitud.png', alt: 'Formulario de solicitud de préstamo en línea' },
    { src: '/casos/tilaran-perfil.png', alt: 'Edición de perfil del asociado' },
  ],
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <Hero />
        <Services />
        <LocalTrust />
        <Process />
        <CaseStudy />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

/* ============================================================
   BOTÓN FLOTANTE DE WHATSAPP
   ============================================================ */

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6"
    >
      {/* Etiqueta que aparece en hover (solo desktop) */}
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-brand-950 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-soft transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Escríbenos por WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105">
        {/* Pulso sutil para llamar la atención */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </a>
  )
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar({ mobileOpen, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white">
            <BarChart3 className="h-5 w-5 text-accent-400" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-900">
            {BRAND}
            <span className="text-accent-500">.</span>
          </span>
        </a>

        {/* Links desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 hover:shadow-none"
          >
            Asesoría Gratuita
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-900 md:hidden"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-900 px-5 py-3 text-base font-semibold text-white"
              >
                Asesoría Gratuita
                <ArrowRight className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-50 blur-3xl" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-accent-50 blur-3xl" />
      </div>

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-accent-500" />
            Tecnología & datos · Guanacaste, Costa Rica
          </span>

          <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
            Impulsamos tu negocio en Guanacaste con{' '}
            <span className="text-brand-700">datos y tecnología</span> a tu medida
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Creamos sistemas web y dashboards de <strong className="font-semibold text-slate-800">Business
            Analytics</strong> que convierten tu información en decisiones claras: vende más, reduce costos
            y digitaliza tu PYME sin complicaciones.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contacto"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-800 sm:w-auto"
            >
              Solicitar asesoría gratuita
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#servicios"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-brand-900 transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            >
              Ver servicios
            </a>
          </div>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent-500" /> Diagnóstico sin costo
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent-500" /> Soporte local directo
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent-500" /> Sin intermediarios
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   SERVICIOS
   ============================================================ */

function Services() {
  return (
    <section id="servicios" className="bg-slate-50 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Servicios"
          title="Soluciones que mueven la aguja de tu negocio"
          subtitle="Dos áreas claras, pensadas para que tu PYME crezca con tecnología que sí entiende y que sí usa."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:border-accent-200 hover:shadow-soft sm:p-10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-accent-400 transition-colors group-hover:bg-brand-800">
                <service.icon className="h-7 w-7" strokeWidth={2} />
              </span>
              <h3 className="mt-6 text-xl font-bold text-brand-950 sm:text-2xl">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{service.description}</p>
              <ul className="mt-6 space-y-2.5">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
              >
                Quiero esto para mi negocio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   ENFOQUE LOCAL (CONFIANZA)
   ============================================================ */

function LocalTrust() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700">
              <MapPin className="h-3.5 w-3.5" />
              Enfoque local
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              Somos tu equipo de tecnología en Guanacaste
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              No somos una agencia lejana ni un call center. Somos profesionales que conocen el mercado,
              hablan tu idioma y te dan soporte real cuando lo necesitás, sin intermediarios ni letra
              pequeña.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            {TRUST_POINTS.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 transition-colors hover:bg-slate-50"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                  <item.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-bold text-brand-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   PROCESO
   ============================================================ */

function Process() {
  return (
    <section id="proceso" className="bg-brand-950 py-20 text-white sm:py-28">
      <div className="container-page">
        <SectionHeading
          dark
          eyebrow="Nuestro proceso"
          title="Cuatro pasos sencillos, cero complicaciones"
          subtitle="Sabés en todo momento qué sigue. Así trabajamos contigo de principio a fin."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.step} className="relative">
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-brand-950">
                    <step.icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-3xl font-black text-white/15">{step.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.description}</p>
              </div>
              {/* Conector entre pasos (solo desktop) */}
              {i < PROCESS_STEPS.length - 1 && (
                <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-white/20 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   CASO DE ÉXITO
   ============================================================ */

function CaseStudy() {
  return (
    <section id="casos" className="bg-slate-50 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Caso de éxito"
          title="De hojas de cálculo a un sistema completo"
          subtitle="Así digitalizamos por completo la operación de una asociación solidarista en Guanacaste."
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Lado izquierdo: historia + métricas */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-4 py-1.5 text-xs font-semibold text-accent-300">
              <Building2 className="h-3.5 w-3.5" />
              {CASE_STUDY.tag}
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-snug text-brand-950">{CASE_STUDY.client}</h3>
            <p className="mt-4 leading-relaxed text-slate-600">{CASE_STUDY.summary}</p>

            {/* Antes / Después */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Antes</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{CASE_STUDY.before}</p>
              </div>
              <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent-700">
                  <TrendingUp className="h-3.5 w-3.5" /> Después
                </p>
                <p className="mt-2 text-sm leading-relaxed text-accent-900">{CASE_STUDY.after}</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {CASE_STUDY.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-brand-900 p-4 text-center text-white">
                  <p className="text-2xl font-extrabold text-accent-300">{m.value}</p>
                  <p className="mt-1 text-xs leading-tight text-slate-300">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Funcionalidades entregadas */}
            <ul className="mt-6 space-y-2.5">
              {CASE_STUDY.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Lado derecho: galería de capturas (imágenes completas, sin recorte) */}
          <div className="grid gap-4">
            {/* Captura principal */}
            <CaseImage image={CASE_STUDY.gallery[0]} />
            {/* Capturas secundarias */}
            <div className="grid gap-4 sm:grid-cols-2">
              {CASE_STUDY.gallery.slice(1).map((img) => (
                <CaseImage key={img.src} image={img} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Imagen del caso con borde elegante y fallback si aún no se ha subido la captura.
   Se muestra completa (sin recorte), respetando su proporción natural. */
function CaseImage({ image }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      {failed ? (
        <div className="flex min-h-[180px] w-full flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center">
          <FileText className="h-6 w-6 text-slate-400" />
          <span className="text-xs text-slate-400">{image.alt}</span>
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          onError={() => setFailed(true)}
          className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
      )}
    </figure>
  )
}

/* ============================================================
   CONTACTO + FORMULARIO (LEAD CAPTURE)
   ============================================================ */

const INITIAL_FORM = {
  nombre: '',
  negocio: '',
  telefono: '',
  correo: '',
  servicio: '',
}

function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM)
  // status: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    // Si Supabase no está configurado, evitamos un error confuso al usuario.
    if (!isSupabaseConfigured) {
      setStatus('error')
      setErrorMsg(
        'El formulario aún no está conectado. Configura las variables de entorno de Supabase (.env).'
      )
      return
    }

    try {
      const { error } = await supabase.from('leads_contacto').insert([
        {
          nombre: form.nombre.trim(),
          nombre_negocio: form.negocio.trim(),
          telefono: form.telefono.trim(),
          correo: form.correo.trim().toLowerCase(),
          tipo_servicio: form.servicio,
          // origen es útil para saber de qué campaña/página vino el lead
          origen: 'landing-web',
        },
      ])

      if (error) throw error

      setStatus('success')
      setForm(INITIAL_FORM)
    } catch (err) {
      console.error('[Supabase] Error al guardar el lead:', err)
      setStatus('error')
      setErrorMsg(
        'No pudimos enviar tu mensaje en este momento. Intenta de nuevo o escríbenos por WhatsApp.'
      )
    }
  }

  const isLoading = status === 'loading'

  return (
    <section id="contacto" className="bg-slate-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Columna informativa */}
          <div className="lg:pt-4">
            <SectionHeading
              align="left"
              eyebrow="Contacto"
              title="Hablemos de tu negocio. La asesoría es gratis."
              subtitle="Cuéntanos qué necesitas y te respondemos rápido con un diagnóstico inicial sin compromiso."
            />

            <div className="mt-8 space-y-4">
              <ContactDetail
                icon={Phone}
                label="WhatsApp / Teléfono"
                value={WHATSAPP_DISPLAY}
                href={WHATSAPP_LINK}
              />
              <ContactDetail
                icon={Mail}
                label="Correo electrónico"
                value="hola@nexora.cr"
                href="mailto:hola@nexora.cr"
              />
              <ContactDetail icon={MapPin} label="Ubicación" value="Guanacaste, Costa Rica" />
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
              <Users className="h-8 w-8 shrink-0 text-accent-500" />
              <p className="text-sm leading-relaxed text-slate-600">
                Más de <strong className="font-semibold text-brand-900">una respuesta humana</strong>: hablás
                directo con quien desarrolla tu proyecto.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            {status === 'success' ? (
              <SuccessState onReset={() => setStatus('idle')} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Field
                  label="Nombre completo"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej. María Jiménez"
                  required
                  disabled={isLoading}
                />
                <Field
                  label="Nombre del negocio"
                  name="negocio"
                  value={form.negocio}
                  onChange={handleChange}
                  placeholder="Ej. Restaurante La Costa"
                  required
                  disabled={isLoading}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="WhatsApp / Teléfono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+506 8888 8888"
                    required
                    disabled={isLoading}
                  />
                  <Field
                    label="Correo electrónico"
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="servicio" className="mb-1.5 block text-sm font-semibold text-brand-950">
                    Tipo de servicio que necesitas
                  </label>
                  <select
                    id="servicio"
                    name="servicio"
                    value={form.servicio}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alerta de error */}
                {status === 'error' && <Alert type="error" message={errorMsg} />}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar consulta
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Al enviar aceptas que te contactemos sobre tu consulta. No compartimos tus datos.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactDetail({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-colors hover:border-slate-200">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-semibold text-brand-950">{value}</p>
      </div>
    </div>
  )
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  )
}

/* ----- Campo de formulario reutilizable ----- */
function Field({ label, name, type = 'text', value, onChange, placeholder, required, disabled }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-brand-950">
        {label}
        {required && <span className="text-accent-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
      />
    </div>
  )
}

/* ----- Alerta visual (éxito / error) ----- */
function Alert({ type, message }) {
  const isError = type === 'error'
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
        isError
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-accent-200 bg-accent-50 text-accent-800'
      }`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
      )}
      <span className="leading-relaxed">{message}</span>
    </div>
  )
}

/* ----- Estado de éxito (reemplaza el formulario) ----- */
function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50">
        <CheckCircle2 className="h-9 w-9 text-accent-500" strokeWidth={2.2} />
      </span>
      <h3 className="mt-6 text-2xl font-bold text-brand-950">¡Mensaje enviado correctamente!</h3>
      <p className="mt-2 max-w-sm text-slate-600">
        Gracias por tu interés. Te contactaremos muy pronto para coordinar tu asesoría gratuita.
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-slate-50"
      >
        Enviar otra consulta
      </button>
    </div>
  )
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  const year = 2026 // Fija el año en build; cámbialo o usa new Date().getFullYear() si prefieres dinámico.
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <a href="#inicio" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white">
                <BarChart3 className="h-5 w-5 text-accent-400" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-brand-900">
                {BRAND}
                <span className="text-accent-500">.</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Tecnología y datos a la medida para PYMES y empresas de Guanacaste, Costa Rica.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-brand-950">Navegación</h4>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-brand-950">Legal</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {year} {BRAND}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-slate-400">Hecho con ❤️ en Guanacaste, Costa Rica.</p>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   ENCABEZADO DE SECCIÓN REUTILIZABLE
   ============================================================ */

function SectionHeading({ eyebrow, title, subtitle, dark = false, align = 'center' }) {
  const isCenter = align === 'center'
  return (
    <div className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-xl text-left'}>
      <span
        className={`inline-block text-sm font-bold uppercase tracking-wide ${
          dark ? 'text-accent-400' : 'text-accent-600'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-brand-950'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
