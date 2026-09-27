"use strict";

// Ten Hestia social templates, ported from the Claude Design canvas
// ("Hestia Social Kit.dc.html") into plain parameterized HTML.
// Each template exports { width, height, defaults: {en, pt}, schema, render(fields, assets) }.
// `render` returns the inner HTML of the artboard div (no outer <div> wrapper,
// no width/height/background — src/render.js supplies those from
// `width`/`height` and the per-template `background`).
// `assets` is the base path to the assets/ directory, so the same template
// works whether the HTML lives in output/ (assets = "../assets") or is
// served by the web UI (assets = "/assets").

const brandFooter = (assets, logo, label) => `
  <div style="display:flex;align-items:center;gap:20px;margin-top:auto">
    <img src="${assets}/${logo}" alt="Hestia" style="height:36px">
    <span style="font:400 20px 'Geist Mono',monospace;color:${label}">hestiatechnology.pt</span>
  </div>`;

function esc(s) {
  return String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

const checkGlyph = (color) =>
  `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="${color}"/><path d="M7 12.5l3 3 7-7" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const xGlyph = (color) =>
  `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="${color}" stroke-width="2"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/></svg>`;

const TEMPLATES = {
  statement: {
    label: "Statement headline",
    width: 1200,
    height: 1200,
    background: "var(--background)",
    border: true,
    padding: "88px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "subhead", label: "Subhead", type: "textarea" },
    ],
    defaults: {
      en: {
        kicker: "Platform",
        headline: "The Factory Operating System for Textile Manufacturers.",
        subhead: "AI-native. EU-compliant. DPP-ready. Built for the factory floor, not the back office.",
      },
      pt: {
        kicker: "Plataforma",
        headline: "O Sistema Operativo para Empresas Têxteis.",
        subhead: "Nativo em IA. Conforme na UE. Pronto para o DPP. Feito para a produção, não para o escritório.",
      },
    },
    render(f, assets) {
      return `
        <div style="font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 92px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.03;color:#0A0F1C;margin-top:40px;text-wrap:pretty">${esc(f.headline)}</div>
        <div style="font:400 34px 'Geist',sans-serif;line-height:1.45;color:#4B5262;margin-top:36px;max-width:820px">${esc(f.subhead)}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262")}
      `;
    },
  },

  "stat-hero": {
    label: "Stat hero (dark)",
    width: 1200,
    height: 1200,
    background: "#060E24",
    padding: "88px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "statBig", label: "Big stat", type: "text" },
      { key: "statLabel", label: "Stat label", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
    defaults: {
      en: {
        kicker: "Compare",
        statBig: "2–4",
        statLabel: "weeks to go live",
        body: "Legacy on-premise ERPs take 2–4 months, a perpetual licence, and no Digital Product Passport support.",
      },
      pt: {
        kicker: "Comparação",
        statBig: "2–4",
        statLabel: "semanas até arrancar",
        body: "Os ERPs legados levam 2–4 meses, exigem licença perpétua e não suportam o Passaporte Digital do Produto.",
      },
    },
    render(f, assets) {
      return `
        <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.045) 0 1px,transparent 1px 8px),repeating-linear-gradient(90deg,rgba(255,255,255,0.045) 0 1px,transparent 1px 8px);pointer-events:none"></div>
        <div style="position:absolute;top:-180px;right:-140px;width:620px;height:620px;border-radius:9999px;background:rgba(0,61,165,0.5);filter:blur(120px);pointer-events:none"></div>
        <div style="position:relative;font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#8AA4E8">${esc(f.kicker)}</div>
        <div style="position:relative;margin-top:auto">
          <div style="font:800 216px 'Geist',sans-serif;letter-spacing:-0.045em;line-height:0.9;color:#FFFFFF">${esc(f.statBig)}</div>
          <div style="font:600 72px 'Geist',sans-serif;letter-spacing:-0.03em;color:#FFFFFF;margin-top:8px">${esc(f.statLabel)}</div>
          <div style="font:400 32px 'Geist',sans-serif;line-height:1.45;color:rgba(255,255,255,0.72);margin-top:32px;max-width:820px">${esc(f.body)}</div>
        </div>
        <div style="position:relative;display:flex;align-items:center;gap:20px;margin-top:80px">
          <img src="${assets}/logo-white.svg" alt="Hestia" style="height:36px">
          <span style="font:400 20px 'Geist Mono',monospace;color:rgba(255,255,255,0.6)">hestiatechnology.pt</span>
        </div>
      `;
    },
  },

  quote: {
    label: "Quote",
    width: 1200,
    height: 1200,
    background: "var(--background)",
    border: true,
    padding: "88px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "name", label: "Name / title", type: "text" },
      { key: "role", label: "Company / location", type: "text" },
    ],
    defaults: {
      en: {
        kicker: "Point of view",
        quote: "“Textile plants don't need another ERP. They need a system that already speaks their language — lots, shades, GSM, dye baths.”",
        name: "CEO & Co-Founder",
        role: "Hestia Technology · Barcelos, PT",
      },
      pt: {
        kicker: "Ponto de vista",
        quote: "“As fábricas têxteis não precisam de outro ERP. Precisam de um sistema que já fala a sua linguagem — lotes, cores, gramagem, banhos.”",
        name: "CEO e Co-Fundador",
        role: "Hestia Technology · Barcelos, PT",
      },
    },
    render(f, assets) {
      return `
        <div style="font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:600 68px 'Geist',sans-serif;letter-spacing:-0.03em;line-height:1.18;color:#0A0F1C;margin-top:48px;text-wrap:pretty">${esc(f.quote)}</div>
        <div style="display:flex;align-items:center;gap:28px;margin-top:56px">
          <img src="${assets}/CEO.jpg" alt="Portrait" style="width:132px;height:132px;border-radius:9999px;object-fit:cover;border:1px solid var(--border)">
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font:600 30px 'Geist',sans-serif;letter-spacing:-0.02em;color:#0A0F1C">${esc(f.name)}</div>
            <div style="font:400 26px 'Geist',sans-serif;color:#4B5262">${esc(f.role)}</div>
          </div>
        </div>
        ${brandFooter(assets, "logo.svg", "#4B5262")}
      `;
    },
  },

  "dpp-pillar": {
    label: "DPP pillar",
    width: 1200,
    height: 1200,
    background: "var(--background)",
    border: true,
    padding: "88px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "badge", label: "Badge text", type: "text" },
    ],
    defaults: {
      en: {
        kicker: "Compliance",
        headline: "Digital Product Passport, built in.",
        body: "The EU textile DPP lands in 2027. Hestia already writes a verified passport for every lot you produce.",
        badge: "DPP READY · LOT 2A-0094",
      },
      pt: {
        kicker: "Conformidade",
        headline: "Passaporte Digital do Produto, incluído.",
        body: "O DPP têxtil chega à UE em 2027. A Hestia já emite um passaporte verificado para cada lote que produz.",
        badge: "DPP PRONTO · LOTE 2A-0094",
      },
    },
    render(f, assets) {
      return `
        <div style="font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <img src="${assets}/dpp-seal.svg" alt="DPP seal" style="width:200px;height:200px;margin-top:56px">
        <div style="font:700 84px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.05;color:#0A0F1C;margin-top:48px;text-wrap:pretty">${esc(f.headline)}</div>
        <div style="font:400 32px 'Geist',sans-serif;line-height:1.45;color:#4B5262;margin-top:32px;max-width:840px">${esc(f.body)}</div>
        <div style="display:flex;align-items:center;gap:16px;margin-top:40px;padding:16px 28px;border-radius:9999px;background:#E6F4EC;border:1px solid #B5DBC5;align-self:flex-start">
          <span style="width:14px;height:14px;border-radius:9999px;background:#118D57"></span>
          <span style="font:500 24px 'Geist Mono',monospace;letter-spacing:0.04em;color:#0E6B44">${esc(f.badge)}</span>
        </div>
        ${brandFooter(assets, "logo.svg", "#4B5262")}
      `;
    },
  },

  "link-card": {
    label: "Product link card (dark)",
    width: 1200,
    height: 627,
    background: "#060E24",
    row: true,
    padding: "0",
    schema: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "cta", label: "Button label", type: "text" },
    ],
    defaults: {
      en: {
        eyebrow: "New",
        headline: "Real-time shop-floor monitoring",
        body: "Every machine, lot and shift on one live board — IoT in, decisions out.",
        cta: "Book a demo",
      },
      pt: {
        eyebrow: "Novo",
        headline: "Monitorização da produção em tempo real",
        body: "Cada máquina, lote e turno num painel ao vivo — IoT à entrada, decisões à saída.",
        cta: "Marcar demo",
      },
    },
    render(f, assets) {
      return `
        <div style="position:absolute;bottom:-200px;left:-120px;width:520px;height:520px;border-radius:9999px;background:rgba(0,61,165,0.55);filter:blur(120px);pointer-events:none"></div>
        <div style="position:relative;flex:0 0 560px;padding:64px;display:flex;flex-direction:column;box-sizing:border-box">
          <div style="font:700 18px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#8AA4E8">${esc(f.eyebrow)}</div>
          <div style="font:700 54px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.06;color:#FFFFFF;margin-top:24px;text-wrap:pretty">${esc(f.headline)}</div>
          <div style="font:400 24px 'Geist',sans-serif;line-height:1.45;color:rgba(255,255,255,0.72);margin-top:20px">${esc(f.body)}</div>
          <div style="margin-top:auto;display:flex;align-items:center;gap:24px">
            <span style="padding:16px 32px;border-radius:12px;background:#FFFFFF;color:#060E24;font:600 22px 'Geist',sans-serif">${esc(f.cta)}</span>
            <img src="${assets}/logo-white.svg" alt="Hestia" style="height:28px">
          </div>
        </div>
        <div style="position:relative;flex:1;padding:64px 0 0 0;overflow:hidden">
          <img src="${assets}/dashboard-dark.png" alt="Hestia dashboard" style="width:760px;border-radius:14px 0 0 0;border:1px solid rgba(255,255,255,0.14);border-right:none;border-bottom:none;box-shadow:0 24px 60px rgba(0,0,0,0.45)">
        </div>
      `;
    },
  },

  "event-promo": {
    label: "Event promo",
    width: 1200,
    height: 627,
    background: "var(--background)",
    border: true,
    row: true,
    padding: "64px",
    gap: "56px",
    schema: [
      { key: "month", label: "Month", type: "text" },
      { key: "day", label: "Day", type: "text" },
      { key: "time", label: "Time", type: "text" },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "cta", label: "Button label", type: "text" },
      { key: "meta", label: "Meta text", type: "text" },
    ],
    defaults: {
      en: {
        month: "Nov",
        day: "12",
        time: "15:00 WET",
        eyebrow: "Live demo",
        headline: "DPP for textile lots, end to end",
        body: "30 minutes: connect a machine, run a lot, publish its passport. Questions welcome throughout.",
        cta: "Save your seat",
        meta: "Online · EN",
      },
      pt: {
        month: "Nov",
        day: "12",
        time: "15:00 WET",
        eyebrow: "Demo ao vivo",
        headline: "DPP para lotes têxteis, de ponta a ponta",
        body: "30 minutos: ligar uma máquina, produzir um lote, publicar o passaporte. Perguntas bem-vindas.",
        cta: "Reservar lugar",
        meta: "Online · PT",
      },
    },
    render(f, assets) {
      return `
        <div style="flex:0 0 260px;background:#FFFFFF;border:1px solid var(--border);border-radius:12px;padding:32px;display:flex;flex-direction:column;justify-content:center;gap:6px;box-shadow:0 1px 2px rgba(10,15,28,0.06)">
          <div style="font:500 20px 'Geist Mono',monospace;letter-spacing:0.1em;text-transform:uppercase;color:#003DA5">${esc(f.month)}</div>
          <div style="font:800 108px 'Geist',sans-serif;letter-spacing:-0.045em;line-height:0.95;color:#0A0F1C">${esc(f.day)}</div>
          <div style="font:400 22px 'Geist Mono',monospace;color:#4B5262">${esc(f.time)}</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column">
          <div style="font:700 18px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.eyebrow)}</div>
          <div style="font:700 56px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.05;color:#0A0F1C;margin-top:22px;text-wrap:pretty">${esc(f.headline)}</div>
          <div style="font:400 24px 'Geist',sans-serif;line-height:1.45;color:#4B5262;margin-top:18px;max-width:640px">${esc(f.body)}</div>
          <div style="margin-top:auto;display:flex;align-items:center;gap:24px">
            <span style="padding:16px 32px;border-radius:10px;background:#003DA5;color:#FFFFFF;font:600 22px 'Geist',sans-serif">${esc(f.cta)}</span>
            <span style="font:400 22px 'Geist Mono',monospace;color:#4B5262">${esc(f.meta)}</span>
          </div>
        </div>
      `;
    },
  },

  "three-steps": {
    label: "Three steps",
    width: 1080,
    height: 1080,
    background: "var(--background)",
    border: true,
    padding: "80px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      {
        key: "steps",
        label: "Steps",
        type: "list",
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "The process",
        headline: "Live in three steps.",
        steps: [
          { title: "Connect Your Data", body: "Machines, orders and stock, in hours — not weeks." },
          { title: "Analyze in Real-Time", body: "Output, downtime and rejects on one live board." },
          { title: "Scale with Compliance", body: "DPP and EU rules update themselves. You keep shipping." },
        ],
      },
      pt: {
        kicker: "O processo",
        headline: "A produzir em três passos.",
        steps: [
          { title: "Ligue os Seus Dados", body: "Máquinas, encomendas e stock em horas — não semanas." },
          { title: "Analise em Tempo Real", body: "Produção, paragens e rejeições num painel ao vivo." },
          { title: "Escale com Conformidade", body: "O DPP e as regras da UE atualizam-se sozinhos." },
        ],
      },
    },
    render(f, assets) {
      const rows = f.steps
        .map(
          (s, i) => `
        <div style="display:flex;gap:28px;align-items:flex-start;background:#FFFFFF;border:1px solid var(--border);border-radius:12px;padding:32px;box-shadow:0 1px 2px rgba(10,15,28,0.06)">
          <div style="flex:0 0 auto;font:500 26px 'Geist Mono',monospace;color:#003DA5;padding-top:4px">${String(i + 1).padStart(2, "0")}</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div style="font:600 38px 'Geist',sans-serif;letter-spacing:-0.025em;color:#0A0F1C">${esc(s.title)}</div>
            <div style="font:400 26px 'Geist',sans-serif;line-height:1.4;color:#4B5262">${esc(s.body)}</div>
          </div>
        </div>`
        )
        .join("");
      return `
        <div style="font:700 20px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 72px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.05;color:#0A0F1C;margin-top:28px">${esc(f.headline)}</div>
        <div style="display:flex;flex-direction:column;gap:20px;margin-top:52px">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262").replace("height:36px", "height:34px")}
      `;
    },
  },

  modules: {
    label: "Modules",
    width: 1080,
    height: 1080,
    background: "var(--background)",
    border: true,
    padding: "80px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      {
        key: "modules",
        label: "Modules",
        type: "list",
        itemFields: [
          { key: "icon", label: "Icon (loom/roll/lot/shade/gsm/dye-bath/quality-hold/dpp/thread/pattern/cut-piece/order-tag)", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "Platform",
        headline: "Three modules. One factory OS.",
        modules: [
          { icon: "loom", title: "Production", body: "Looms, shifts, lots and live output." },
          { icon: "roll", title: "Inventory", body: "Rolls, shades and GSM, traced by lot." },
          { icon: "dpp", title: "Compliance", body: "DPP, EU reporting, audit trail included." },
        ],
      },
      pt: {
        kicker: "Plataforma",
        headline: "Três módulos. Um só sistema.",
        modules: [
          { icon: "loom", title: "Produção", body: "Teares, turnos, lotes e produção ao vivo." },
          { icon: "roll", title: "Inventário", body: "Rolos, cores e gramagem, rastreados por lote." },
          { icon: "dpp", title: "Conformidade", body: "DPP, relatórios UE e trilho de auditoria." },
        ],
      },
    },
    render(f, assets) {
      const rows = f.modules
        .map(
          (m) => `
        <div style="display:flex;gap:28px;align-items:center">
          <div style="flex:0 0 auto;width:88px;height:88px;border-radius:16px;background:rgba(0,61,165,0.1);display:flex;align-items:center;justify-content:center;color:#003DA5">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#${esc(m.icon)}"></use></svg>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font:600 40px 'Geist',sans-serif;letter-spacing:-0.025em;color:#0A0F1C">${esc(m.title)}</div>
            <div style="font:400 26px 'Geist',sans-serif;color:#4B5262">${esc(m.body)}</div>
          </div>
        </div>`
        )
        .join("");
      return `
        <div style="font:700 20px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 76px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.04;color:#0A0F1C;margin-top:28px">${esc(f.headline)}</div>
        <div style="display:grid;grid-template-columns:1fr;gap:24px;margin-top:56px">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262").replace("height:36px", "height:34px")}
      `;
    },
  },

  "cta-story": {
    label: "CTA story (dark, 9:16)",
    width: 1080,
    height: 1920,
    background: "#060E24",
    padding: "120px 80px 200px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "cta", label: "Button label", type: "text" },
    ],
    defaults: {
      en: {
        kicker: "Take the next step",
        headline: "Ready to transform your factory?",
        body: "Join the early access program. Limited spots available.",
        cta: "Book a demo",
      },
      pt: {
        kicker: "O próximo passo",
        headline: "Pronto para transformar a sua empresa têxtil?",
        body: "Adira ao programa de acesso antecipado. Vagas limitadas.",
        cta: "Marcar demo",
      },
    },
    render(f, assets) {
      return `
        <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.045) 0 1px,transparent 1px 8px),repeating-linear-gradient(90deg,rgba(255,255,255,0.045) 0 1px,transparent 1px 8px);pointer-events:none"></div>
        <div style="position:absolute;top:420px;left:-160px;width:680px;height:680px;border-radius:9999px;background:rgba(0,61,165,0.5);filter:blur(120px);pointer-events:none"></div>
        <img src="${assets}/logo-white.svg" alt="Hestia" style="position:relative;height:40px;align-self:flex-start">
        <div style="position:relative;margin-top:auto">
          <div style="font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#8AA4E8">${esc(f.kicker)}</div>
          <div style="font:700 104px 'Geist',sans-serif;letter-spacing:-0.04em;line-height:1.02;color:#FFFFFF;margin-top:32px;text-wrap:pretty">${esc(f.headline)}</div>
          <div style="font:400 36px 'Geist',sans-serif;line-height:1.42;color:rgba(255,255,255,0.72);margin-top:36px;max-width:820px">${esc(f.body)}</div>
          <div style="margin-top:56px;padding:28px 48px;border-radius:16px;background:#FFFFFF;color:#060E24;font:600 34px 'Geist',sans-serif;align-self:flex-start;display:inline-block">${esc(f.cta)}</div>
        </div>
        <div style="position:relative;margin-top:120px;font:400 26px 'Geist Mono',monospace;color:rgba(255,255,255,0.6)">hestiatechnology.pt</div>
      `;
    },
  },

  "proof-story": {
    label: "Proof story (9:16)",
    width: 1080,
    height: 1920,
    background: "var(--background)",
    border: true,
    padding: "200px 80px 200px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      {
        key: "stats",
        label: "Stats",
        type: "list",
        itemFields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "Why they switch",
        headline: "Subscription, cloud, and ready for 2027.",
        stats: [
          { value: "2–4", label: "weeks to go live, not months" },
          { value: "100%", label: "EU-hosted, EU-compliant by default" },
          { value: "2027", label: "DPP deadline, already covered" },
        ],
      },
      pt: {
        kicker: "Porque mudam",
        headline: "Subscrição, cloud e prontos para 2027.",
        stats: [
          { value: "2–4", label: "semanas até arrancar, não meses" },
          { value: "100%", label: "alojado na UE, conforme por omissão" },
          { value: "2027", label: "prazo do DPP, já assegurado" },
        ],
      },
    },
    render(f, assets) {
      const rows = f.stats
        .map(
          (s) => `
        <div style="display:flex;align-items:baseline;gap:32px;padding:40px 0;border-bottom:1px solid var(--border)">
          <div style="flex:0 0 300px;font:800 84px 'Geist',sans-serif;letter-spacing:-0.045em;color:#003DA5">${esc(s.value)}</div>
          <div style="font:400 32px 'Geist',sans-serif;line-height:1.35;color:#4B5262">${esc(s.label)}</div>
        </div>`
        )
        .join("");
      return `
        <div style="font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 88px 'Geist',sans-serif;letter-spacing:-0.038em;line-height:1.04;color:#0A0F1C;margin-top:32px;text-wrap:pretty">${esc(f.headline)}</div>
        <div style="display:flex;flex-direction:column;gap:0;margin-top:72px;border-top:1px solid var(--border)">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262").replace("height:36px", "height:40px")}
      `;
    },
  },

  "shop-floor": {
    label: "Shop-floor (light)",
    width: 1200,
    height: 627,
    background: "var(--background)",
    border: true,
    row: true,
    padding: "0",
    schema: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "cta", label: "Button label", type: "text" },
    ],
    defaults: {
      en: {
        eyebrow: "Operations",
        headline: "From loom to tablet. Zero paper.",
        body: "Digital work orders, live downtime tracking, and shift analytics in real time — built for the plant floor.",
        cta: "Book a demo",
      },
      pt: {
        eyebrow: "Operações",
        headline: "Do tear ao tablet. Sem papel nem Excel.",
        body: "Ordens de fabrico digitais, paragens de máquina ao segundo e turnos em tempo real — feito para a produção.",
        cta: "Marcar demo",
      },
    },
    render(f, assets) {
      return `
        <div style="position:relative;flex:0 0 560px;padding:64px;display:flex;flex-direction:column;box-sizing:border-box">
          <div style="font:700 18px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.eyebrow)}</div>
          <div style="font:700 52px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.06;color:#0A0F1C;margin-top:24px;text-wrap:pretty">${esc(f.headline)}</div>
          <div style="font:400 24px 'Geist',sans-serif;line-height:1.45;color:#4B5262;margin-top:20px">${esc(f.body)}</div>
          <div style="margin-top:auto;display:flex;align-items:center;gap:24px">
            <span style="padding:16px 32px;border-radius:12px;background:#003DA5;color:#FFFFFF;font:600 22px 'Geist',sans-serif">${esc(f.cta)}</span>
            <img src="${assets}/logo.svg" alt="Hestia" style="height:28px">
          </div>
        </div>
        <div style="position:relative;flex:1;padding:64px 0 0 0;overflow:hidden">
          <img src="${assets}/dashboard-light.png" alt="Hestia dashboard" style="width:760px;border-radius:14px 0 0 0;border:1px solid var(--border);border-right:none;border-bottom:none;box-shadow:0 24px 60px rgba(10,15,28,0.12)">
        </div>
      `;
    },
  },

  traceability: {
    label: "Traceability",
    width: 1080,
    height: 1080,
    background: "var(--background)",
    border: true,
    padding: "80px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      {
        key: "items",
        label: "Steps",
        type: "list",
        itemFields: [
          { key: "icon", label: "Icon", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "Traceability",
        headline: "Every roll tells a story.",
        items: [
          { icon: "lot", title: "Fiber & Spinning Lot", body: "Raw material origin, supplier certificates, and lot traceability." },
          { icon: "dye-bath", title: "Dyeing & Fabric", body: "Real-time bath parameters, shade matching, and GSM verification." },
          { icon: "dpp", title: "Digital Passport", body: "Automatic DPP creation at packaging, audit-ready for EU rules." },
        ],
      },
      pt: {
        kicker: "Rastreabilidade",
        headline: "Cada rolo tem uma história.",
        items: [
          { icon: "lot", title: "Fibra e Fiação", body: "Origem da matéria-prima, certificados de fornecedor e rastreio de lote." },
          { icon: "dye-bath", title: "Tinturaria e Malha", body: "Parâmetros de banho ao vivo, controlo de shade e gramagem GSM." },
          { icon: "dpp", title: "Passaporte Digital", body: "Emissão de DPP na embalagem, pronto para auditorias e normas UE." },
        ],
      },
    },
    render(f, assets) {
      const rows = f.items
        .map(
          (m) => `
        <div style="display:flex;gap:28px;align-items:center">
          <div style="flex:0 0 auto;width:88px;height:88px;border-radius:16px;background:rgba(0,61,165,0.1);display:flex;align-items:center;justify-content:center;color:#003DA5">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#${esc(m.icon)}"></use></svg>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font:600 40px 'Geist',sans-serif;letter-spacing:-0.025em;color:#0A0F1C">${esc(m.title)}</div>
            <div style="font:400 26px 'Geist',sans-serif;color:#4B5262">${esc(m.body)}</div>
          </div>
        </div>`
        )
        .join("");
      return `
        <div style="font:700 20px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 76px 'Geist',sans-serif;letter-spacing:-0.035em;line-height:1.04;color:#0A0F1C;margin-top:28px">${esc(f.headline)}</div>
        <div style="display:grid;grid-template-columns:1fr;gap:24px;margin-top:56px">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262").replace("height:36px", "height:34px")}
      `;
    },
  },

  "cta-square": {
    label: "CTA feed (square)",
    width: 1200,
    height: 1200,
    background: "#060E24",
    padding: "88px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "cta", label: "Button label", type: "text" },
    ],
    defaults: {
      en: {
        kicker: "Next step",
        headline: "Ready to modernize your textile plant?",
        body: "Join the Hestia ERP early access program. Limited capacity for Portuguese textile manufacturers.",
        cta: "Book a demo",
      },
      pt: {
        kicker: "O próximo passo",
        headline: "Pronto para modernizar a sua fábrica têxtil?",
        body: "Adira ao programa de acesso antecipado do Hestia ERP. Vagas limitadas para unidades no Norte de Portugal.",
        cta: "Marcar demonstração",
      },
    },
    render(f, assets) {
      return `
        <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.045) 0 1px,transparent 1px 8px),repeating-linear-gradient(90deg,rgba(255,255,255,0.045) 0 1px,transparent 1px 8px);pointer-events:none"></div>
        <div style="position:absolute;top:-160px;right:-120px;width:640px;height:640px;border-radius:9999px;background:rgba(0,61,165,0.55);filter:blur(120px);pointer-events:none"></div>
        <div style="position:relative;font:700 22px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#8AA4E8">${esc(f.kicker)}</div>
        <div style="position:relative;margin-top:auto">
          <div style="font:700 84px 'Geist',sans-serif;letter-spacing:-0.038em;line-height:1.06;color:#FFFFFF;text-wrap:pretty">${esc(f.headline)}</div>
          <div style="font:400 32px 'Geist',sans-serif;line-height:1.45;color:rgba(255,255,255,0.72);margin-top:32px;max-width:860px">${esc(f.body)}</div>
          <div style="margin-top:56px;padding:24px 44px;border-radius:14px;background:#FFFFFF;color:#060E24;font:600 30px 'Geist',sans-serif;display:inline-block">${esc(f.cta)}</div>
        </div>
        <div style="position:relative;display:flex;align-items:center;gap:20px;margin-top:72px">
          <img src="${assets}/logo-white.svg" alt="Hestia" style="height:36px">
          <span style="font:400 20px 'Geist Mono',monospace;color:rgba(255,255,255,0.6)">hestiatechnology.pt</span>
        </div>
      `;
    },
  },

  "comparison-table": {
    label: "Comparison table",
    width: 1080,
    height: 1080,
    background: "var(--background)",
    border: true,
    padding: "80px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "colHestia", label: "Column: Hestia", type: "text" },
      { key: "colLegacy", label: "Column: Legacy ERP", type: "text" },
      {
        key: "rows",
        label: "Rows",
        type: "list",
        itemFields: [
          { key: "label", label: "Feature", type: "text" },
          { key: "hestia", label: "Hestia (yes/no)", type: "text" },
          { key: "legacy", label: "Legacy ERP (yes/no)", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "Why switch",
        headline: "Built for 2027. Not 1997.",
        colHestia: "Hestia",
        colLegacy: "Legacy ERP",
        rows: [
          { label: "Real-time shop-floor data", hestia: "yes", legacy: "no" },
          { label: "Digital Product Passport, 2027-ready", hestia: "yes", legacy: "no" },
          { label: "Cloud, EU-hosted", hestia: "yes", legacy: "no" },
          { label: "Live in 2–4 weeks", hestia: "yes", legacy: "no" },
          { label: "Subscription, no perpetual licence", hestia: "yes", legacy: "no" },
        ],
      },
      pt: {
        kicker: "Porque mudar",
        headline: "Feito para 2027. Não para 1997.",
        colHestia: "Hestia",
        colLegacy: "ERP Legado",
        rows: [
          { label: "Dados de produção em tempo real", hestia: "yes", legacy: "no" },
          { label: "Passaporte Digital, pronto para 2027", hestia: "yes", legacy: "no" },
          { label: "Cloud, alojado na UE", hestia: "yes", legacy: "no" },
          { label: "Em produção em 2–4 semanas", hestia: "yes", legacy: "no" },
          { label: "Subscrição, sem licença perpétua", hestia: "yes", legacy: "no" },
        ],
      },
    },
    render(f, assets) {
      const isYes = (v) => String(v).trim().toLowerCase() === "yes";
      const rows = f.rows
        .map(
          (r) => `
        <div style="display:flex;align-items:center;gap:24px;padding:26px 0;border-bottom:1px solid var(--border)">
          <div style="flex:1;font:500 30px 'Geist',sans-serif;color:#0A0F1C;line-height:1.25">${esc(r.label)}</div>
          <div style="flex:0 0 130px;display:flex;justify-content:center">${isYes(r.hestia) ? checkGlyph("#003DA5") : xGlyph("#C7CCD6")}</div>
          <div style="flex:0 0 130px;display:flex;justify-content:center">${isYes(r.legacy) ? checkGlyph("#003DA5") : xGlyph("#C7CCD6")}</div>
        </div>`
        )
        .join("");
      return `
        <div style="font:700 20px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 64px 'Geist',sans-serif;letter-spacing:-0.03em;line-height:1.08;color:#0A0F1C;margin-top:24px">${esc(f.headline)}</div>
        <div style="display:flex;align-items:center;gap:24px;margin-top:48px;padding-bottom:18px;border-bottom:2px solid #0A0F1C">
          <div style="flex:1"></div>
          <div style="flex:0 0 130px;text-align:center;font:600 22px 'Geist',sans-serif;color:#003DA5">${esc(f.colHestia)}</div>
          <div style="flex:0 0 130px;text-align:center;font:600 22px 'Geist',sans-serif;color:#8A909C">${esc(f.colLegacy)}</div>
        </div>
        <div style="display:flex;flex-direction:column">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262")}
      `;
    },
  },

  "stat-bars": {
    label: "Stat bars (comparison)",
    width: 1080,
    height: 1080,
    background: "var(--background)",
    border: true,
    padding: "80px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "hestiaLabel", label: "Legend: Hestia", type: "text" },
      { key: "legacyLabel", label: "Legend: Legacy ERP", type: "text" },
      {
        key: "metrics",
        label: "Metrics",
        type: "list",
        itemFields: [
          { key: "label", label: "Metric", type: "text" },
          { key: "hestiaValue", label: "Hestia value", type: "text" },
          { key: "hestiaPct", label: "Hestia bar (0-100)", type: "text" },
          { key: "legacyValue", label: "Legacy value", type: "text" },
          { key: "legacyPct", label: "Legacy bar (0-100)", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "Hestia vs legacy ERP",
        headline: "Same job. Different century.",
        hestiaLabel: "Hestia",
        legacyLabel: "Legacy ERP",
        metrics: [
          { label: "Time to go live", hestiaValue: "2–4 weeks", hestiaPct: "18", legacyValue: "8–16 weeks", legacyPct: "92" },
          { label: "EU hosting & compliance", hestiaValue: "100%", hestiaPct: "100", legacyValue: "rarely built-in", legacyPct: "20" },
          { label: "Shop-floor visibility", hestiaValue: "Real-time", hestiaPct: "96", legacyValue: "End-of-shift reports", legacyPct: "30" },
        ],
      },
      pt: {
        kicker: "Hestia vs ERP legado",
        headline: "O mesmo trabalho. Séculos de diferença.",
        hestiaLabel: "Hestia",
        legacyLabel: "ERP Legado",
        metrics: [
          { label: "Tempo até arrancar", hestiaValue: "2–4 semanas", hestiaPct: "18", legacyValue: "8–16 semanas", legacyPct: "92" },
          { label: "Alojamento e conformidade UE", hestiaValue: "100%", hestiaPct: "100", legacyValue: "raramente incluído", legacyPct: "20" },
          { label: "Visibilidade da produção", hestiaValue: "Tempo real", hestiaPct: "96", legacyValue: "Relatório de fim de turno", legacyPct: "30" },
        ],
      },
    },
    render(f, assets) {
      const bar = (pct, color, value) => `
        <div style="display:flex;align-items:center;gap:16px">
          <div style="flex:1;height:22px;border-radius:6px;background:#EFEDE7;overflow:hidden">
            <div style="width:${Math.max(0, Math.min(100, Number(pct) || 0))}%;height:100%;background:${color};border-radius:6px"></div>
          </div>
          <div style="flex:0 0 auto;min-width:190px;font:500 24px 'Geist',sans-serif;color:#0A0F1C">${esc(value)}</div>
        </div>`;
      const rows = f.metrics
        .map(
          (m) => `
        <div style="display:flex;flex-direction:column;gap:14px;padding:28px 0;border-bottom:1px solid var(--border)">
          <div style="font:600 28px 'Geist',sans-serif;color:#0A0F1C">${esc(m.label)}</div>
          ${bar(m.hestiaPct, "#003DA5", m.hestiaValue)}
          ${bar(m.legacyPct, "#C7CCD6", m.legacyValue)}
        </div>`
        )
        .join("");
      return `
        <div style="font:700 20px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 64px 'Geist',sans-serif;letter-spacing:-0.03em;line-height:1.08;color:#0A0F1C;margin-top:24px;max-width:880px">${esc(f.headline)}</div>
        <div style="display:flex;align-items:center;gap:24px;margin-top:16px">
          <span style="display:flex;align-items:center;gap:10px;font:500 22px 'Geist',sans-serif;color:#4B5262"><span style="width:20px;height:12px;border-radius:4px;background:#003DA5;display:inline-block"></span>${esc(f.hestiaLabel)}</span>
          <span style="display:flex;align-items:center;gap:10px;font:500 22px 'Geist',sans-serif;color:#4B5262"><span style="width:20px;height:12px;border-radius:4px;background:#C7CCD6;display:inline-block"></span>${esc(f.legacyLabel)}</span>
        </div>
        <div style="display:flex;flex-direction:column;margin-top:36px">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262")}
      `;
    },
  },

  "screenshot-feature": {
    label: "Screenshot feature (full-bleed)",
    width: 1200,
    height: 627,
    background: "#060E24",
    padding: "0",
    schema: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "image", label: "Screenshot (assets filename)", type: "text" },
      {
        key: "callouts",
        label: "Callouts",
        type: "list",
        itemFields: [{ key: "text", label: "Callout", type: "text" }],
      },
    ],
    defaults: {
      en: {
        eyebrow: "Inside the platform",
        headline: "Every shift, one screen.",
        image: "dashboard-dark.png",
        callouts: [
          { text: "Live revenue & order backlog" },
          { text: "Machine-by-machine output" },
          { text: "Orders traced to the lot" },
        ],
      },
      pt: {
        eyebrow: "Dentro da plataforma",
        headline: "Cada turno, um só ecrã.",
        image: "dashboard-dark.png",
        callouts: [
          { text: "Faturação e encomendas ao vivo" },
          { text: "Produção máquina a máquina" },
          { text: "Encomendas rastreadas ao lote" },
        ],
      },
    },
    render(f, assets) {
      const chips = f.callouts
        .map(
          (c, i) => `
        <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);border-radius:9999px;padding:14px 26px 14px 14px;backdrop-filter:blur(6px)">
          <span style="flex:0 0 auto;width:32px;height:32px;border-radius:9999px;background:#FFFFFF;color:#060E24;font:700 18px 'Geist',sans-serif;display:flex;align-items:center;justify-content:center">${i + 1}</span>
          <span style="font:500 22px 'Geist',sans-serif;color:#FFFFFF">${esc(c.text)}</span>
        </div>`
        )
        .join("");
      return `
        <img src="${assets}/${esc(f.image)}" alt="Hestia platform" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,14,36,0.95) 0%,rgba(6,14,36,0.88) 28%,rgba(6,14,36,0.35) 44%,rgba(6,14,36,0.2) 54%,rgba(6,14,36,0.6) 68%,rgba(6,14,36,0.95) 82%,rgba(6,14,36,0.97) 100%)"></div>
        <div style="position:relative;padding:56px 64px 0;display:flex;flex-direction:column">
          <div style="font:700 18px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#8AA4E8;text-shadow:0 2px 16px rgba(0,0,0,0.5)">${esc(f.eyebrow)}</div>
          <div style="font:700 60px 'Geist',sans-serif;letter-spacing:-0.03em;line-height:1.06;color:#FFFFFF;margin-top:16px;max-width:760px;text-shadow:0 4px 24px rgba(0,0,0,0.5)">${esc(f.headline)}</div>
        </div>
        <div style="position:relative;margin-top:auto;padding:0 64px 48px;display:flex;gap:20px;flex-wrap:wrap">${chips}</div>
      `;
    },
  },

  roadmap: {
    label: "Roadmap (timeline)",
    width: 1080,
    height: 1080,
    background: "var(--background)",
    border: true,
    padding: "80px",
    schema: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      {
        key: "phases",
        label: "Phases",
        type: "list",
        itemFields: [
          { key: "period", label: "Period", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "text" },
        ],
      },
    ],
    defaults: {
      en: {
        kicker: "Rollout",
        headline: "From kickoff to first passport.",
        phases: [
          { period: "Week 1", title: "Connect", body: "Machines, orders and stock wired in." },
          { period: "Week 2–3", title: "Run", body: "First lots tracked shift by shift." },
          { period: "Week 4", title: "Publish", body: "First Digital Product Passport goes live." },
        ],
      },
      pt: {
        kicker: "Arranque",
        headline: "Do kickoff ao primeiro passaporte.",
        phases: [
          { period: "Semana 1", title: "Ligar", body: "Máquinas, encomendas e stock integrados." },
          { period: "Semana 2–3", title: "Produzir", body: "Primeiros lotes acompanhados turno a turno." },
          { period: "Semana 4", title: "Publicar", body: "Primeiro Passaporte Digital do Produto." },
        ],
      },
    },
    render(f, assets) {
      const n = f.phases.length;
      const rows = f.phases
        .map(
          (p, i) => `
        <div style="position:relative;display:flex;gap:32px;padding-bottom:${i === n - 1 ? "0" : "56px"}">
          ${i < n - 1 ? `<div style="position:absolute;left:29px;top:60px;bottom:0;width:2px;background:var(--border)"></div>` : ""}
          <div style="position:relative;flex:0 0 60px;height:60px;border-radius:9999px;background:#003DA5;color:#FFFFFF;font:700 24px 'Geist',sans-serif;display:flex;align-items:center;justify-content:center">${i + 1}</div>
          <div style="display:flex;flex-direction:column;gap:8px;padding-top:6px">
            <div style="font:500 22px 'Geist Mono',monospace;letter-spacing:0.04em;text-transform:uppercase;color:#003DA5">${esc(p.period)}</div>
            <div style="font:600 40px 'Geist',sans-serif;letter-spacing:-0.025em;color:#0A0F1C">${esc(p.title)}</div>
            <div style="font:400 26px 'Geist',sans-serif;line-height:1.4;color:#4B5262;max-width:680px">${esc(p.body)}</div>
          </div>
        </div>`
        )
        .join("");
      return `
        <div style="font:700 20px 'Geist',sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#003DA5">${esc(f.kicker)}</div>
        <div style="font:700 68px 'Geist',sans-serif;letter-spacing:-0.03em;line-height:1.06;color:#0A0F1C;margin-top:24px">${esc(f.headline)}</div>
        <div style="display:flex;flex-direction:column;margin-top:56px">${rows}</div>
        ${brandFooter(assets, "logo.svg", "#4B5262").replace("height:36px", "height:34px")}
      `;
    },
  },
};

module.exports = { TEMPLATES };
