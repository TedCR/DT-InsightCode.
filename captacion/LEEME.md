# Agentes de DT InsightCode

Dos cosas separadas en una sola carpeta:

- `captacion/` — el agente que vive en tu web y atiende visitantes. Se despliega en Cloudflare.
- `agentes-locales/` — los tres agentes que trabajan con vos en tu PC. No se despliegan.

---

## Parte 1 · Agente de captación

### Qué hace

El visitante abre el chat, el agente le pregunta por su negocio, entiende el problema real (no el producto que pidió), consigue el contacto y lo guarda en una base de datos. Opcionalmente te manda un aviso.

### Instalación

Necesitás Node.js instalado. Después, en la terminal:

```bash
cd captacion
npm install wrangler --save-dev
npx wrangler login
```

Creá la base de datos:

```bash
npx wrangler d1 create dt-leads
```

Eso te imprime un `database_id`. Copialo y pegalo en `wrangler.jsonc` donde dice `PEGA_AQUI_EL_ID`. Después creá la tabla:

```bash
npx wrangler d1 execute dt-leads --remote --file=schema.sql
```

Guardá tu llave de la API de Anthropic como secreto (no va en ningún archivo):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Opcional, si querés que te avise por Slack, Discord o Telegram:

```bash
npx wrangler secret put NOTIFY_WEBHOOK
```

Probalo local y después publicalo:

```bash
npx wrangler dev
npx wrangler deploy
```

### Conectarlo a tu página

Subí `public/agente.js` a tu sitio y agregá esta línea antes de `</body>` en tu HTML:

```html
<script defer src="/agente.js"
        data-endpoint="https://dt-agente-captacion.TU-SUBDOMINIO.workers.dev/api/agente"></script>
```

El widget se dibuja solo. No toca nada del resto de tu página.

### Ver los leads

```bash
npx wrangler d1 execute dt-leads --remote \
  --command="SELECT creado, nombre, contacto, servicio, necesidad FROM leads WHERE atendido=0 ORDER BY creado DESC"
```

### Costo

Workers y D1 tienen nivel gratuito de sobra para el tráfico de un sitio como el tuyo. Lo único que pagás es la API del modelo. Con Haiku, una conversación completa de captación cuesta menos de un centavo de dólar.

### Antes de publicarlo

1. Leé el `SYSTEM_PROMPT` en `src/index.ts` y ajustalo a cómo hablás vos. Ese archivo es el 90% de la calidad del agente.
2. Verificá que `ALLOWED_ORIGIN` en `wrangler.jsonc` sea tu dominio real.
3. Conversá con él como si fueras un cliente difícil. Pedile precios, pedile que te prometa cosas. Si se sale del libreto, ajustá el prompt.

---

## Parte 2 · Agentes locales

### Cómo funcionan realmente

No son programas. Son archivos de texto en `.claude/agents/` dentro de tu proyecto. Cuando Claude Code arranca, los lee y los tiene disponibles. Al invocar uno, se abre una conversación aparte con ese rol y esas herramientas, hace su trabajo y devuelve solo el resultado.

Eso último es lo importante y no es obvio: cada agente trabaja en su propia ventana de contexto. El arquitecto puede leer veinte archivos para armar la propuesta y nada de eso ensucia tu conversación principal. Por eso conviene tener agentes separados en vez de un solo asistente que lo hace todo.

### Instalación

```bash
npm install -g @anthropic-ai/claude-code
```

Copiá la carpeta `.claude/` a la raíz de tu proyecto. Es una carpeta oculta: en el explorador de Windows activá "Elementos ocultos" en la pestaña Vista para verla.

Después, dentro de tu proyecto:

```bash
claude
```

Y ya podés escribir cosas como:

```
Usá el agente arquitecto: una cabina en Tamarindo quiere dejar de llevar
las reservas en un cuaderno. Recibe unas 15 reservas por semana, la mitad
por WhatsApp y la mitad por Booking.
```

### Conectar Figma

El agente de Figma necesita el servidor MCP del propio Figma, que corre en la app de escritorio:

1. Abrí Figma escritorio, entrá a preferencias y activá el servidor MCP local.
2. En tu terminal, dentro del proyecto:

```bash
claude mcp add --transport http figma http://127.0.0.1:3845/mcp
```

3. Verificá con `/mcp` dentro de Claude Code que aparezcan las herramientas.

Si el puerto no coincide, Figma te lo indica cuando activás el servidor. El flujo de uso es: seleccionás el frame en Figma, volvés a la terminal y pedís que lo implemente. El agente lee el nodo seleccionado.

### El archivo que más rinde

Creá un `CLAUDE.md` en la raíz de tu proyecto con tus convenciones: qué stack usás, cómo nombrás las cosas, qué nunca hacés. Se lee automáticamente en cada sesión y mejora a los tres agentes a la vez. Empezá con diez líneas y andá agregando cada vez que corrijas algo dos veces.

### Por dónde empezar

El arquitecto. Es el único que no necesita configuración y el que te devuelve horas desde el primer día: pasás de una conversación de WhatsApp con un cliente a una propuesta estructurada en un minuto.
