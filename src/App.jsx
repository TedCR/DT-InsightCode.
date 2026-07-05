import { useState, useEffect } from 'react'
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
  Building2,
  TrendingUp,
  Accessibility,
  Sun,
  Moon,
  Contrast,
  Type,
  Minus,
  Plus,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react'
import { submitLead, isSupabaseConfigured } from './lib/supabaseClient'

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
  '¡Hola! 😊 Vi su página web y me gustaría saber cómo pueden ayudarme a mejorar mi negocio. ¿Me podrían dar más información?'
)
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Casos de éxito', href: '#casos' },
  { label: 'Preguntas', href: '#preguntas' },
  { label: 'Contacto', href: '#contacto' },
]

// Preguntas frecuentes (deben coincidir con el JSON-LD FAQPage de index.html)
const FAQS = [
  {
    q: '¿Cuánto cuesta una página web en Costa Rica?',
    a: 'Depende del alcance de tu proyecto. Por eso la primera asesoría es gratis: conversamos, entendemos tu negocio y te damos un precio claro, sin sorpresas ni letra pequeña.',
  },
  {
    q: '¿Qué es un dashboard de ventas y para qué sirve?',
    a: 'Es un panel que muestra tus ventas, costos y ganancias en tiempo real, con gráficos fáciles de leer. Sirve para saber exactamente dónde ganás más dinero y dónde podés reducir costos, sin hacer cuentas a mano.',
  },
  {
    q: '¿Trabajan solo en Guanacaste?',
    a: 'Nuestra base está en Guanacaste y atendemos Liberia, Nicoya, Santa Cruz, Cañas, Tilarán, Tamarindo, Playas del Coco y alrededores. Como todo es en línea, también trabajamos con clientes de cualquier parte de Costa Rica.',
  },
  {
    q: '¿Cuánto tarda el desarrollo de una página o sistema?',
    a: 'Una página web profesional suele estar lista en 1 a 2 semanas. Un sistema a la medida depende de los módulos, pero siempre te damos fechas claras desde la propuesta y te mostramos avances durante el desarrollo.',
  },
  {
    q: '¿La asesoría de verdad es gratis?',
    a: 'Sí. El diagnóstico inicial no tiene costo ni compromiso: revisamos tu negocio, te damos recomendaciones y una propuesta. Vos decidís si avanzamos.',
  },
]

const SERVICES = [
  {
    icon: BarChart3,
    title: 'Dashboards de Ventas & Business Analytics',
    description:
      'Transformamos tus hojas de Excel en dashboards de ventas interactivos y reportes claros, para que sepas exactamente dónde ganar más dinero y reducir costos.',
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
    { src: '/casos/tilaran-dashboard.webp', w: 1086, h: 525, alt: 'Dashboard del asociado con resumen de ahorros y préstamos' },
    { src: '/casos/tilaran-prestamos.webp', w: 1084, h: 500, alt: 'Listado de préstamos activos con exportación de reportes' },
    { src: '/casos/tilaran-ahorros.webp', w: 1075, h: 486, alt: 'Panel de ahorros con métricas y estado de cada producto' },
    { src: '/casos/tilaran-solicitud.webp', w: 1079, h: 542, alt: 'Formulario de solicitud de préstamo en línea' },
    { src: '/casos/tilaran-perfil.webp', w: 1082, h: 533, alt: 'Edición de perfil del asociado' },
  ],
}

const FONT_SIZES = { '-1': '93.75%', 0: '100%', 1: '112.5%', 2: '125%' }

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Preferencias de accesibilidad
  const [theme, setTheme] = useState('light') // 'light' | 'dark'
  const [fontScale, setFontScale] = useState(0) // -1, 0, 1, 2
  const [contrast, setContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  // Cargar preferencias guardadas (o usar la del sistema para el tema)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dt-a11y') || '{}')
      if (saved.theme === 'dark' || saved.theme === 'light') setTheme(saved.theme)
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
      if (typeof saved.fontScale === 'number') setFontScale(saved.fontScale)
      if (saved.contrast) setContrast(true)
      if (saved.reduceMotion) setReduceMotion(true)
    } catch {
      /* sin persistencia disponible */
    }
  }, [])

  // Aplicar preferencias al documento + guardar
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('reduce-motion', reduceMotion)
    root.style.fontSize = FONT_SIZES[fontScale] || '100%'
    try {
      localStorage.setItem('dt-a11y', JSON.stringify({ theme, fontScale, contrast, reduceMotion }))
    } catch {
      /* sin persistencia disponible */
    }
  }, [theme, fontScale, contrast, reduceMotion])

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-brand-950">
      {/* Contenido: aquí se aplica el alto contraste (no afecta a los botones flotantes) */}
      <div className={contrast ? 'contrast-boost' : undefined}>
        <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main>
          <Hero />
          <Services />
          <LocalTrust />
          <Process />
          <CaseStudy />
          <Faq />
          <ContactSection />
        </main>
        <Footer />
      </div>

      <FloatingWhatsApp />
      <AccessibilityWidget
        theme={theme}
        setTheme={setTheme}
        fontScale={fontScale}
        setFontScale={setFontScale}
        contrast={contrast}
        setContrast={setContrast}
        reduceMotion={reduceMotion}
        setReduceMotion={setReduceMotion}
      />
    </div>
  )
}

/* ============================================================
   WIDGET DE ACCESIBILIDAD
   ============================================================ */

function AccessibilityWidget({
  theme,
  setTheme,
  fontScale,
  setFontScale,
  contrast,
  setContrast,
  reduceMotion,
  setReduceMotion,
}) {
  const [open, setOpen] = useState(false)
  const isDark = theme === 'dark'

  function reset() {
    setTheme('light')
    setFontScale(0)
    setContrast(false)
    setReduceMotion(false)
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 sm:bottom-6 sm:left-6">
      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Opciones de accesibilidad"
          className="absolute bottom-16 left-0 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-brand-900"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-950 dark:text-white">Accesibilidad</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar panel de accesibilidad"
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tema claro/oscuro */}
          <ToggleRow
            icon={isDark ? Moon : Sun}
            label="Modo oscuro"
            pressed={isDark}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          />

          {/* Tamaño de texto */}
          <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
            <span className="flex items-center gap-2 text-sm font-medium text-brand-950 dark:text-slate-200">
              <Type className="h-4 w-4 text-accent-500" />
              Tamaño de texto
            </span>
            <div className="flex items-center gap-1">
              <IconBtn
                label="Reducir tamaño de texto"
                onClick={() => setFontScale((v) => Math.max(-1, v - 1))}
                disabled={fontScale <= -1}
              >
                <Minus className="h-4 w-4" />
              </IconBtn>
              <span className="w-6 text-center text-xs font-bold text-brand-700 dark:text-accent-400">
                {Math.round(parseFloat(FONT_SIZES[fontScale]))}%
              </span>
              <IconBtn
                label="Aumentar tamaño de texto"
                onClick={() => setFontScale((v) => Math.min(2, v + 1))}
                disabled={fontScale >= 2}
              >
                <Plus className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>

          {/* Alto contraste */}
          <ToggleRow
            icon={Contrast}
            label="Alto contraste"
            pressed={contrast}
            onClick={() => setContrast((v) => !v)}
            className="mt-2"
          />

          {/* Reducir animaciones */}
          <ToggleRow
            icon={RotateCcw}
            label="Reducir animaciones"
            pressed={reduceMotion}
            onClick={() => setReduceMotion((v) => !v)}
            className="mt-2"
          />

          <button
            onClick={reset}
            className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Restablecer preferencias
          </button>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir opciones de accesibilidad"
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-white shadow-soft transition-transform hover:scale-105 dark:bg-brand-800"
      >
        <Accessibility className="h-7 w-7" strokeWidth={2} />
      </button>
    </div>
  )
}

function ToggleRow({ icon: Icon, label, pressed, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={pressed}
      className={`flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 ${className}`}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-brand-950 dark:text-slate-200">
        <Icon className="h-4 w-4 text-accent-500" />
        {label}
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          pressed ? 'bg-accent-500' : 'bg-slate-300 dark:bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            pressed ? 'left-[1.125rem]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

function IconBtn({ children, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand-900 shadow-sm transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
    >
      {children}
    </button>
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
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-brand-950 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-soft transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block dark:bg-brand-800">
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
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-brand-950/80">
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white dark:bg-brand-800">
            <BarChart3 className="h-5 w-5 text-accent-400" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-900 dark:text-white">
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
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-900 dark:text-slate-300 dark:hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 hover:shadow-none dark:bg-accent-500 dark:text-brand-950 dark:hover:bg-accent-400"
          >
            Asesoría Gratuita
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-900 md:hidden dark:text-white"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden dark:border-white/10 dark:bg-brand-950">
          <ul className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-brand-900 px-5 py-3 text-base font-semibold text-white dark:bg-accent-500 dark:text-brand-950"
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
    <section id="inicio" className="relative overflow-hidden bg-white dark:bg-brand-950">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-50 blur-3xl dark:bg-brand-800/30" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-accent-50 blur-3xl dark:bg-accent-500/10" />
      </div>

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-accent-500" />
            Tecnología & datos · Guanacaste, Costa Rica
          </span>

          <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl dark:text-white">
            Páginas web, sistemas y{' '}
            <span className="text-brand-700 dark:text-accent-400">dashboards de ventas</span> para tu
            negocio en Guanacaste
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Creamos sistemas web y dashboards de{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-100">Business Analytics</strong> que
            convierten tu información en decisiones claras: vende más, reduce costos y digitaliza tu PYME sin
            complicaciones.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contacto"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-800 sm:w-auto dark:bg-accent-500 dark:text-brand-950 dark:hover:bg-accent-400"
            >
              Solicitar asesoría gratuita
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#servicios"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-brand-900 transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Ver servicios
            </a>
          </div>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
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
    <section id="servicios" className="bg-slate-50 py-20 sm:py-28 dark:bg-brand-950">
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
              className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:border-accent-200 hover:shadow-soft sm:p-10 dark:border-white/10 dark:bg-white/5 dark:hover:border-accent-500/40"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-accent-400 transition-colors group-hover:bg-brand-800 dark:bg-brand-800">
                <service.icon className="h-7 w-7" strokeWidth={2} />
              </span>
              <h3 className="mt-6 text-xl font-bold text-brand-950 sm:text-2xl dark:text-white">
                {service.title}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{service.description}</p>
              <ul className="mt-6 space-y-2.5">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-accent-400 dark:hover:text-accent-300"
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
    <section className="bg-white py-20 sm:py-28 dark:bg-brand-950">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
              <MapPin className="h-3.5 w-3.5" />
              Enfoque local
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl dark:text-white">
              Somos tu equipo de tecnología en Guanacaste
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              No somos una agencia lejana ni un call center. Somos profesionales que conocen el mercado,
              hablan tu idioma y te dan soporte real cuando lo necesitás, sin intermediarios ni letra
              pequeña.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Atendemos negocios en Liberia, Nicoya, Santa Cruz, Cañas, Tilarán, Tamarindo, Playas del
              Coco y todo Guanacaste. Y como todo es en línea, también trabajamos con clientes de
              cualquier parte de Costa Rica.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            {TRUST_POINTS.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm dark:bg-brand-900 dark:text-accent-400">
                  <item.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-bold text-brand-950 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
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
    <section id="proceso" className="bg-brand-950 py-20 text-white sm:py-28 dark:bg-black/40">
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
                  <span className="text-3xl font-extrabold text-white/15">{step.step}</span>
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
  // null = cerrado; un número = índice de la imagen ampliada
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="casos" className="bg-slate-50 py-20 sm:py-28 dark:bg-brand-950">
      <div className="container-page">
        <SectionHeading
          eyebrow="Caso de éxito"
          title="De hojas de cálculo a un sistema completo"
          subtitle="Así digitalizamos por completo la operación de una asociación solidarista en Guanacaste."
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Lado izquierdo: historia + métricas */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-4 py-1.5 text-xs font-semibold text-accent-300 dark:bg-brand-800">
              <Building2 className="h-3.5 w-3.5" />
              {CASE_STUDY.tag}
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-snug text-brand-950 dark:text-white">
              {CASE_STUDY.client}
            </h3>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{CASE_STUDY.summary}</p>

            {/* Antes / Después */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Antes
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {CASE_STUDY.before}
                </p>
              </div>
              <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5 dark:border-accent-500/30 dark:bg-accent-500/10">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent-700 dark:text-accent-300">
                  <TrendingUp className="h-3.5 w-3.5" /> Después
                </p>
                <p className="mt-2 text-sm leading-relaxed text-accent-900 dark:text-accent-100">
                  {CASE_STUDY.after}
                </p>
              </div>
            </div>

            {/* Métricas */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {CASE_STUDY.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-brand-900 p-4 text-center text-white dark:bg-brand-800"
                >
                  <p className="text-2xl font-extrabold text-accent-300">{m.value}</p>
                  <p className="mt-1 text-xs leading-tight text-slate-300">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Funcionalidades entregadas */}
            <ul className="mt-6 space-y-2.5">
              {CASE_STUDY.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Lado derecho: galería de capturas (clic para ampliar) */}
          <div className="grid gap-4">
            {/* Captura principal */}
            <CaseImage image={CASE_STUDY.gallery[0]} onOpen={() => setLightbox(0)} />
            {/* Capturas secundarias */}
            <div className="grid gap-4 sm:grid-cols-2">
              {CASE_STUDY.gallery.slice(1).map((img, i) => (
                <CaseImage key={img.src} image={img} onOpen={() => setLightbox(i + 1)} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA: capturar la intención justo después de ver el caso */}
        <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl bg-brand-900 p-8 text-center sm:p-10 dark:bg-brand-800">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Tu negocio también lleva todo en Excel y papel?
          </h3>
          <p className="max-w-xl text-slate-300">
            Conversemos. Te mostramos cómo se vería tu sistema, sin costo ni compromiso.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 font-semibold text-brand-950 transition-colors hover:bg-accent-400"
            >
              Escribinos por WhatsApp
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Dejar mis datos
            </a>
          </div>
        </div>
      </div>

      {/* Visor de imagen ampliada (galería) */}
      {lightbox !== null && (
        <Lightbox
          images={CASE_STUDY.gallery}
          index={lightbox}
          setIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}

/* Visor a pantalla completa con navegación (teclado: ← → Esc). */
function Lightbox({ images, index, setIndex, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // evita scroll de fondo
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [images.length, setIndex, onClose])

  const img = images[index]
  const go = (dir) => (e) => {
    e.stopPropagation()
    setIndex((i) => (i + dir + images.length) % images.length)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Imagen ampliada"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    >
      {/* Cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Anterior */}
      <button
        onClick={go(-1)}
        aria-label="Imagen anterior"
        className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      {/* Imagen */}
      <img
        src={img.src}
        alt={img.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl"
      />

      {/* Siguiente */}
      <button
        onClick={go(1)}
        aria-label="Imagen siguiente"
        className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      {/* Pie: contador + descripción */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-4 max-w-xl text-center text-sm text-slate-200"
      >
        <span className="font-semibold text-white">
          {index + 1} / {images.length}
        </span>
        <span className="mx-2 text-white/40">·</span>
        {img.alt}
      </div>
    </div>
  )
}

/* Imagen del caso con borde elegante y fallback si aún no se ha subido la captura.
   Se muestra completa (sin recorte), respetando su proporción natural. */
function CaseImage({ image, onOpen }) {
  const [failed, setFailed] = useState(false)

  // Si la imagen no carga, mostramos el recuadro de respaldo (no clicable).
  if (failed) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-white/5">
        <div className="flex min-h-[180px] w-full flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center dark:bg-white/5">
          <FileText className="h-6 w-6 text-slate-400" />
          <span className="text-xs text-slate-400">{image.alt}</span>
        </div>
      </figure>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar imagen: ${image.alt}`}
      className="group relative block cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-white/5"
    >
      <img
        src={image.src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
      />
      {/* Capa con lupa al pasar el cursor */}
      <span className="absolute inset-0 flex items-center justify-center bg-brand-950/0 transition-colors duration-300 group-hover:bg-brand-950/30">
        <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-white/95 text-brand-900 opacity-0 shadow-soft transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
          <ZoomIn className="h-6 w-6" />
        </span>
      </span>
    </button>
  )
}

/* ============================================================
   PREGUNTAS FRECUENTES (SEO de cola larga + confianza)
   ============================================================ */

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="preguntas" className="bg-white py-20 sm:py-28 dark:bg-brand-950">
      <div className="container-page">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Lo que todo negocio nos pregunta"
          subtitle="Respuestas claras y sin tecnicismos. Si tenés otra duda, escribinos por WhatsApp."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/5"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-brand-950 dark:text-white">{item.q}</span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-accent-500 transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 leading-relaxed text-slate-600 dark:text-slate-300">{item.a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
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
      await submitLead({
        nombre: form.nombre.trim(),
        nombre_negocio: form.negocio.trim(),
        telefono: form.telefono.trim(),
        correo: form.correo.trim().toLowerCase(),
        tipo_servicio: form.servicio,
        // origen es útil para saber de qué campaña/página vino el lead
        origen: 'landing-web',
      })

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
    <section id="contacto" className="bg-slate-50 py-20 sm:py-28 dark:bg-brand-950">
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
                value="dtinsightcode@gmail.com"
                href="mailto:dtinsightcode@gmail.com"
              />
              <ContactDetail icon={MapPin} label="Ubicación" value="Guanacaste, Costa Rica" />
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <Users className="h-8 w-8 shrink-0 text-accent-500" />
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Más de{' '}
                <strong className="font-semibold text-brand-900 dark:text-white">una respuesta humana</strong>:
                hablás directo con quien desarrolla tu proyecto.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8 dark:border-white/10 dark:bg-white/5">
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
                  <label
                    htmlFor="servicio"
                    className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-slate-200"
                  >
                    Tipo de servicio que necesitas
                  </label>
                  <select
                    id="servicio"
                    name="servicio"
                    value={form.servicio}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60 dark:border-white/15 dark:bg-brand-950 dark:text-white dark:focus:ring-accent-500/30"
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-accent-500 dark:text-brand-950 dark:hover:bg-accent-400"
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

                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
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
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-colors hover:border-slate-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-accent-300">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p className="font-semibold text-brand-950 dark:text-white">{value}</p>
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
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-slate-200"
      >
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60 dark:border-white/15 dark:bg-brand-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-accent-500/30"
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
          ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
          : 'border-accent-200 bg-accent-50 text-accent-800 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-200'
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
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-500/15">
        <CheckCircle2 className="h-9 w-9 text-accent-500" strokeWidth={2.2} />
      </span>
      <h3 className="mt-6 text-2xl font-bold text-brand-950 dark:text-white">¡Mensaje enviado correctamente!</h3>
      <p className="mt-2 max-w-sm text-slate-600 dark:text-slate-300">
        Gracias por tu interés. Te contactaremos muy pronto para coordinar tu asesoría gratuita.
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
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
    <footer className="border-t border-slate-100 bg-white dark:border-white/10 dark:bg-brand-950">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
          {/* Marca */}
          <div>
            <a href="#inicio" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white dark:bg-brand-800">
                <BarChart3 className="h-5 w-5 text-accent-400" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-brand-900 dark:text-white">
                {BRAND}
                <span className="text-accent-500">.</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Tecnología y datos a la medida para PYMES y empresas de Guanacaste, Costa Rica.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                {
                  icon: Instagram,
                  href: 'https://www.instagram.com/dtinsightcode/',
                  label: 'Instagram',
                },
                {
                  icon: Linkedin,
                  href: 'https://www.linkedin.com/in/jose-daniel-torres-vargas-7372a0222/',
                  label: 'LinkedIn',
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:text-slate-400 dark:hover:border-accent-500/40 dark:hover:text-accent-300"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-brand-950 dark:text-white">
              Navegación
            </h4>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-brand-700 dark:text-slate-400 dark:hover:text-accent-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row dark:border-white/10">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {year} {BRAND}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Hecho en Guanacaste, Costa Rica.</p>
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
          dark ? 'text-accent-400' : 'text-accent-600 dark:text-accent-400'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-brand-950 dark:text-white'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
