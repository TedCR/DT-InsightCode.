/**
 * DT InsightCode — Agente de captación
 *
 * Atiende al visitante, entiende qué necesita, califica el lead
 * y lo guarda en D1. Opcionalmente te avisa por webhook.
 */

export interface Env {
  ANTHROPIC_API_KEY: string;
  DB: D1Database;
  NOTIFY_WEBHOOK?: string;
  ALLOWED_ORIGIN: string;
}

const MODELO = "claude-haiku-4-5-20251001";
const MAX_TURNOS = 24;
const MAX_CARACTERES = 1200;

const SYSTEM_PROMPT = `Sos el asistente de DT InsightCode, un estudio de tecnología en Guanacaste, Costa Rica, que hace páginas web, sistemas a la medida y dashboards de ventas para PYMES.

TU TRABAJO
Entender qué necesita la persona y dejar el contacto agendado para la asesoría gratis. No sos soporte técnico ni un chatbot de preguntas frecuentes: sos quien hace las preguntas que haría Daniel en una primera llamada.

CÓMO CONVERSÁS
- Hablás en español de Costa Rica, con usted o vos según cómo te hable la persona. Cercano, directo, sin tecnicismos.
- Una pregunta a la vez. Nunca listas de preguntas.
- Respuestas cortas: dos o tres frases máximo.
- Si la persona ya dio un dato, no lo volvés a pedir.

QUÉ NECESITÁS AVERIGUAR (en este orden, sin sonar a formulario)
1. Qué tipo de negocio tiene y en qué cantón está.
2. Qué problema quiere resolver. Escuchá el problema real, no el producto que pide. Si dice "quiero una página web", averiguá para qué: vender, que la encuentren en Google, dejar de atender por WhatsApp.
3. Si hoy usa algo (Excel, cuaderno, un sistema, nada).
4. Cuándo lo necesita.
5. Nombre y WhatsApp o correo.

CUÁNDO GUARDAR
Apenas tengás el contacto y una idea clara del problema, llamá a guardar_lead. No esperés a tener los cinco puntos: un contacto con problema claro vale más que una conversación perfecta sin contacto. Después de guardar, confirmá que Daniel escribe en menos de 24 horas.

REGLAS QUE NO ROMPÉS
- No das precios ni plazos exactos. Si insisten: "eso depende del alcance, y es justo lo que se define en la asesoría gratis, que no tiene costo ni compromiso".
- No prometés funcionalidades específicas ni fechas de entrega.
- No inventás casos de clientes, cifras ni referencias.
- Si preguntan algo fuera de tema, respondés corto y devolvés la conversación a su negocio.
- Si la persona solo quiere el contacto directo, se lo das sin insistir con preguntas.

Abrí siempre preguntando por su negocio, nunca con un menú de opciones.`;

const HERRAMIENTAS = [
  {
    name: "guardar_lead",
    description:
      "Guarda el contacto calificado. Llamalo una sola vez por conversación, apenas tengás nombre y una forma de contacto.",
    input_schema: {
      type: "object" as const,
      properties: {
        nombre: { type: "string", description: "Nombre de la persona" },
        contacto: { type: "string", description: "WhatsApp o correo tal cual lo escribió" },
        negocio: { type: "string", description: "Tipo de negocio y cantón" },
        necesidad: {
          type: "string",
          description: "El problema real en una o dos frases, en palabras de la persona",
        },
        servicio: {
          type: "string",
          enum: ["pagina_web", "sistema_a_medida", "dashboard", "mixto", "por_definir"],
        },
        urgencia: { type: "string", enum: ["ya", "este_mes", "explorando"] },
        notas: { type: "string", description: "Cualquier detalle útil para la llamada" },
      },
      required: ["nombre", "contacto", "necesidad", "servicio"],
    },
  },
];

async function guardarLead(env: Env, datos: Record<string, string>) {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO leads (id, creado, nombre, contacto, negocio, necesidad, servicio, urgencia, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      new Date().toISOString(),
      datos.nombre ?? "",
      datos.contacto ?? "",
      datos.negocio ?? "",
      datos.necesidad ?? "",
      datos.servicio ?? "por_definir",
      datos.urgencia ?? "explorando",
      datos.notas ?? ""
    )
    .run();

  if (env.NOTIFY_WEBHOOK) {
    const texto =
      `Nuevo lead\n${datos.nombre} · ${datos.contacto}\n` +
      `${datos.negocio ?? "—"}\n${datos.necesidad}\n` +
      `Servicio: ${datos.servicio} · Urgencia: ${datos.urgencia ?? "—"}`;
    await fetch(env.NOTIFY_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: texto }),
    }).catch(() => {});
  }

  return { guardado: true, id };
}

async function llamarModelo(env: Env, messages: unknown[]) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      tools: HERRAMIENTAS,
      messages,
    }),
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
  return r.json() as Promise<{ content: any[]; stop_reason: string }>;
}

function cors(env: Env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = { ...cors(env), "content-type": "application/json" };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors(env) });
    if (new URL(request.url).pathname !== "/api/agente" || request.method !== "POST") {
      return new Response("No encontrado", { status: 404 });
    }

    try {
      const body = (await request.json()) as { messages?: any[] };
      let messages = Array.isArray(body.messages) ? body.messages : [];

      if (messages.length > MAX_TURNOS) {
        return new Response(
          JSON.stringify({
            texto:
              "Ya tenemos bastante contexto. Escribile directo a Daniel por WhatsApp y seguimos por ahí.",
            terminado: true,
          }),
          { headers }
        );
      }
      const ultimo = messages.at(-1);
      if (typeof ultimo?.content === "string" && ultimo.content.length > MAX_CARACTERES) {
        ultimo.content = ultimo.content.slice(0, MAX_CARACTERES);
      }

      // Bucle del agente: el modelo puede pedir la herramienta y volver a hablar.
      let leadGuardado = false;
      for (let paso = 0; paso < 4; paso++) {
        const respuesta = await llamarModelo(env, messages);
        messages.push({ role: "assistant", content: respuesta.content });

        if (respuesta.stop_reason !== "tool_use") {
          const texto = respuesta.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("\n");
          return new Response(JSON.stringify({ texto, messages, leadGuardado }), { headers });
        }

        const resultados = [];
        for (const bloque of respuesta.content) {
          if (bloque.type !== "tool_use") continue;
          const salida = await guardarLead(env, bloque.input);
          leadGuardado = true;
          resultados.push({
            type: "tool_result",
            tool_use_id: bloque.id,
            content: JSON.stringify(salida),
          });
        }
        messages.push({ role: "user", content: resultados });
      }

      return new Response(
        JSON.stringify({ texto: "Perfecto, ya quedó anotado. Daniel te escribe pronto." }),
        { headers }
      );
    } catch (e) {
      console.error(e);
      return new Response(
        JSON.stringify({
          texto:
            "Se me cayó la conexión. Escribile directo a Daniel por WhatsApp y con gusto lo atiende.",
        }),
        { status: 200, headers }
      );
    }
  },
};
