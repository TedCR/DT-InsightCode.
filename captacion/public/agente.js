/**
 * DT InsightCode — widget del agente de captación
 * Uso: <script defer src="/agente.js" data-endpoint="https://dt-agente-captacion.TU-SUBDOMINIO.workers.dev/api/agente"></script>
 */
(function () {
  var ENDPOINT =
    document.currentScript?.dataset.endpoint || "/api/agente";
  var SALUDO =
    "Hola. Soy el asistente de DT InsightCode. Contame de qué es tu negocio y qué te gustaría resolver.";

  var historial = [];
  var enviando = false;

  var css = `
  /* bottom:92px deja libre el botón flotante de WhatsApp del sitio, que vive en bottom:20px */
  .dt-launcher{position:fixed;right:20px;bottom:92px;z-index:9998;display:flex;align-items:center;gap:9px;
    background:#0f205f;color:#fff;border:0;border-radius:999px;padding:13px 20px 13px 17px;cursor:pointer;
    font:500 15px/1 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 22px rgba(15,32,95,.28)}
  .dt-launcher:hover{background:#16307f}
  .dt-launcher:focus-visible{outline:3px solid #f0b429;outline-offset:2px}
  .dt-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex:none}
  .dt-panel{position:fixed;right:20px;bottom:92px;z-index:9999;width:min(380px,calc(100vw - 32px));
    height:min(560px,calc(100vh - 112px));background:#fdfcfa;border-radius:16px;overflow:hidden;
    display:none;flex-direction:column;box-shadow:0 18px 50px rgba(15,32,95,.3);
    font:400 15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1c1c1a}
  .dt-panel[data-abierto="1"]{display:flex}
  .dt-head{background:#0f205f;color:#fff;padding:15px 16px;display:flex;justify-content:space-between;align-items:center}
  .dt-head strong{font-weight:500;font-size:15px}
  .dt-head span{display:block;font-size:12.5px;opacity:.72;margin-top:2px}
  .dt-close{background:transparent;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:0 4px;opacity:.8}
  .dt-close:hover{opacity:1}
  .dt-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
  .dt-msg{max-width:85%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-break:break-word}
  .dt-bot{background:#eef0f7;color:#12193d;border-bottom-left-radius:4px;align-self:flex-start}
  .dt-yo{background:#0f205f;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
  .dt-esperando{align-self:flex-start;color:#6b6b66;font-size:13.5px;padding:4px 2px}
  .dt-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e6e4dd;background:#fff}
  .dt-form input{flex:1;border:1px solid #d6d4cc;border-radius:10px;padding:11px 12px;font:inherit;color:inherit}
  .dt-form input:focus{outline:2px solid #0f205f;outline-offset:-1px;border-color:transparent}
  .dt-form button{background:#0f205f;color:#fff;border:0;border-radius:10px;padding:0 17px;font:500 15px/1 inherit;cursor:pointer}
  .dt-form button:disabled{opacity:.45;cursor:default}
  @media (prefers-reduced-motion:no-preference){.dt-panel[data-abierto="1"]{animation:dtIn .18s ease-out}}
  @keyframes dtIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`;

  var estilo = document.createElement("style");
  estilo.textContent = css;
  document.head.appendChild(estilo);

  var launcher = document.createElement("button");
  launcher.className = "dt-launcher";
  launcher.setAttribute("aria-label", "Abrir el asistente de DT InsightCode");
  launcher.innerHTML = '<span class="dt-dot"></span>Asesoría gratis';

  var panel = document.createElement("div");
  panel.className = "dt-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistente de DT InsightCode");
  panel.innerHTML =
    '<div class="dt-head"><div><strong>DT InsightCode</strong>' +
    "<span>Contanos qué necesita tu negocio</span></div>" +
    '<button class="dt-close" aria-label="Cerrar">&times;</button></div>' +
    '<div class="dt-log" role="log" aria-live="polite"></div>' +
    '<div class="dt-form"><input type="text" placeholder="Escribí tu mensaje" ' +
    'aria-label="Tu mensaje" maxlength="1200"><button type="button">Enviar</button></div>';

  document.body.append(launcher, panel);

  var log = panel.querySelector(".dt-log");
  var input = panel.querySelector("input");
  var boton = panel.querySelector(".dt-form button");

  function pintar(texto, quien) {
    var d = document.createElement("div");
    d.className = "dt-msg " + (quien === "yo" ? "dt-yo" : "dt-bot");
    d.textContent = texto;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function abrir() {
    panel.dataset.abierto = "1";
    launcher.style.display = "none";
    if (!log.children.length) pintar(SALUDO, "bot");
    input.focus();
  }

  function cerrar() {
    panel.dataset.abierto = "";
    launcher.style.display = "flex";
    launcher.focus();
  }

  async function enviar() {
    var texto = input.value.trim();
    if (!texto || enviando) return;
    enviando = true;
    boton.disabled = true;
    input.value = "";
    pintar(texto, "yo");
    historial.push({ role: "user", content: texto });

    var esperando = document.createElement("div");
    esperando.className = "dt-esperando";
    esperando.textContent = "Escribiendo…";
    log.appendChild(esperando);
    log.scrollTop = log.scrollHeight;

    try {
      var r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: historial }),
      });
      var data = await r.json();
      esperando.remove();
      pintar(data.texto || "No entendí eso. ¿Me lo repetís?", "bot");
      if (Array.isArray(data.messages)) historial = data.messages;
    } catch (e) {
      esperando.remove();
      pintar(
        "Se cayó la conexión. Probá de nuevo o escribile directo a Daniel por WhatsApp.",
        "bot"
      );
    } finally {
      enviando = false;
      boton.disabled = false;
      input.focus();
    }
  }

  launcher.addEventListener("click", abrir);
  panel.querySelector(".dt-close").addEventListener("click", cerrar);
  boton.addEventListener("click", enviar);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") enviar();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.dataset.abierto) cerrar();
  });
})();
