# Nexora · Landing page (Guanacaste, Costa Rica)

Landing page moderna, minimalista y de alta conversión para una consultora de
servicios tecnológicos enfocada en PYMES. Construida con **React + Vite +
Tailwind CSS** e integrada con **Supabase** para capturar leads.

## 🚀 Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar credenciales de Supabase
cp .env.example .env
#   → edita .env con tu VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 3. Crear la tabla en Supabase
#   Copia el contenido de supabase/schema.sql en
#   Supabase Dashboard → SQL Editor → New query → Run

# 4. Levantar el entorno de desarrollo
npm run dev

# 5. Compilar para producción
npm run build
```

## 🗂️ Estructura

```
.
├── index.html               # HTML base + meta tags SEO/Open Graph
├── src/
│   ├── App.jsx              # Componente principal (todas las secciones)
│   ├── main.jsx             # Punto de entrada de React
│   ├── index.css            # Tailwind + estilos base
│   └── lib/
│       └── supabaseClient.js  # Inicialización de Supabase
├── supabase/
│   └── schema.sql           # Tabla leads_contacto + políticas RLS
├── tailwind.config.js       # Paleta de marca (azul + esmeralda)
└── .env.example             # Plantilla de variables de entorno
```

## 🎨 Personalización rápida

- **Nombre de marca:** constante `BRAND` en `src/App.jsx`.
- **Textos / servicios / pasos:** arrays al inicio de `src/App.jsx`.
- **Colores:** `tailwind.config.js` → `colors.brand` y `colors.accent`.
- **Contacto (WhatsApp / correo):** componente `ContactSection` en `src/App.jsx`.

## 🔐 Seguridad

La `anon key` de Supabase es **pública** por diseño. La protección real la dan
las **políticas RLS** definidas en `supabase/schema.sql`: el sitio solo puede
**insertar** leads, nunca leerlos. Jamás uses la `service_role` key en el frontend.
