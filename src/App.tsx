import { useState, useEffect, useRef, useCallback } from "react";

// ─── FONTS ──────────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fl);

// ─── GLOBAL CSS ─────────────────────────────────────────────────────────────
const gs = document.createElement("style");
gs.textContent = `
  :root {
    --g: #C9A84C; --gl: #E8D48A; --gd: #8B6914;
    --b: #060608; --b2: #0C0C10; --b3: #131318; --b4: #1A1A22;
    --w: #F0EDE6; --wd: rgba(240,237,230,0.55); --wd2: rgba(240,237,230,0.12);
    --red: #E05555; --blue: #5588E0; --green: #55C490;
    --fd: 'Bebas Neue',sans-serif;
    --fs: 'Playfair Display',serif;
    --fb: 'Outfit',sans-serif;
    --r: 2px;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:var(--b);color:var(--w);font-family:var(--fb);overflow-x:hidden;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:var(--b2);}
  ::-webkit-scrollbar-thumb{background:var(--gd);}

  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.5)}70%{box-shadow:0 0 0 14px rgba(201,168,76,0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes scan{0%{top:-100%}100%{top:100%}}
  @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(201,168,76,.3)}50%{text-shadow:0 0 40px rgba(201,168,76,.7)}}
  @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(4);opacity:0}}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}

  .fu{animation:fadeUp .6s ease forwards;}
  .fi{animation:fadeIn .4s ease forwards;}

  .gt{background:linear-gradient(135deg,var(--gd),var(--gl),var(--g));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .gl{display:block;width:48px;height:2px;background:linear-gradient(90deg,var(--g),var(--gl));margin:12px 0;}
  .glc{margin:12px auto;}

  .lbl{font-family:var(--fb);font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--g);}

  .bg{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;font-family:var(--fb);font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:linear-gradient(135deg,var(--gd),var(--g),var(--gl));color:var(--b);border:none;cursor:pointer;transition:all .3s;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));position:relative;overflow:hidden;}
  .bg::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent,rgba(255,255,255,.2),transparent);transform:translateX(-100%);transition:transform .4s;}
  .bg:hover::after{transform:translateX(100%);}
  .bg:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,.4);}

  .bo{display:inline-flex;align-items:center;gap:8px;padding:13px 31px;font-family:var(--fb);font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:transparent;color:var(--g);border:1px solid var(--g);cursor:pointer;transition:all .3s;}
  .bo:hover{background:rgba(201,168,76,.08);transform:translateY(-2px);}

  .card{background:linear-gradient(145deg,var(--b3),var(--b4));border:1px solid rgba(201,168,76,.12);padding:28px;transition:all .3s;position:relative;overflow:hidden;}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);opacity:0;transition:opacity .3s;}
  .card:hover{border-color:rgba(201,168,76,.35);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.5);}
  .card:hover::before{opacity:1;}

  .inp{width:100%;padding:12px 16px;background:var(--b3);border:1px solid rgba(201,168,76,.2);color:var(--w);font-family:var(--fb);font-size:13px;outline:none;transition:border .3s;border-radius:var(--r);}
  .inp:focus{border-color:var(--g);}
  .inp::placeholder{color:rgba(240,237,230,.25);}

  .tag{display:inline-block;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-radius:2px;}
  .tr{background:rgba(220,85,85,.12);color:#FF8080;border:1px solid rgba(220,85,85,.25);}
  .tb{background:rgba(85,136,224,.12);color:#88AAFF;border:1px solid rgba(85,136,224,.25);}
  .tg{background:rgba(201,168,76,.12);color:var(--g);border:1px solid rgba(201,168,76,.25);}
  .tgr{background:rgba(85,196,144,.12);color:#88DDAA;border:1px solid rgba(85,196,144,.25);}

  /* LIVE indicator */
  .live-dot{width:8px;height:8px;border-radius:50%;background:var(--green);position:relative;display:inline-block;}
  .live-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--green);animation:ping 1.5s infinite;}

  /* Notification toast */
  .toast{position:fixed;top:80px;right:24px;z-index:2000;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
  .toast-item{background:var(--b3);border:1px solid rgba(201,168,76,.3);border-left:3px solid var(--g);padding:14px 18px;min-width:280px;animation:slideIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.6);pointer-events:all;}

  /* Visitor counter */
  .visitors{display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(85,196,144,.08);border:1px solid rgba(85,196,144,.2);font-size:12px;color:var(--green);}

  /* Admin */
  .aside{width:220px;min-height:100vh;background:var(--b2);border-right:1px solid rgba(201,168,76,.08);}
  .ani{padding:12px 18px;font-size:12px;font-weight:500;letter-spacing:.5px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .2s;color:var(--wd);}
  .ani:hover{background:rgba(201,168,76,.05);color:var(--g);}
  .ani.on{background:rgba(201,168,76,.1);color:var(--g);border-right:2px solid var(--g);}

  .ac{background:var(--b3);border:1px solid rgba(201,168,76,.1);padding:20px;}

  .sb{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
  .sn{background:rgba(85,196,144,.12);color:var(--green);}
  .sc{background:rgba(85,136,224,.12);color:#88AAFF;}
  .sf{background:rgba(201,168,76,.12);color:var(--g);}
  .sp{background:rgba(220,85,85,.12);color:#FF8080;}

  /* Notes */
  .note-card{background:var(--b4);border:1px solid rgba(201,168,76,.1);padding:14px;border-radius:2px;transition:all .2s;}
  .note-card:hover{border-color:rgba(201,168,76,.3);}
  .note-pin{position:absolute;top:-6px;left:12px;width:12px;height:12px;border-radius:50%;}

  /* Chat */
  .cw{position:fixed;bottom:24px;right:24px;z-index:900;}
  .cb{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:pulse 2s infinite;font-size:26px;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:transform .2s;}
  .cb:hover{transform:scale(1.1);}
  .cwin{position:absolute;bottom:68px;right:0;width:320px;background:var(--b3);border:1px solid rgba(201,168,76,.2);border-radius:10px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7);animation:fadeUp .3s;}
  .ch{background:linear-gradient(135deg,var(--gd),var(--g));padding:14px 18px;display:flex;align-items:center;gap:10px;}
  .cms{height:260px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;}
  .cm{max-width:78%;padding:9px 13px;font-size:12px;line-height:1.5;}
  .cm.a{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.18);align-self:flex-start;border-radius:0 10px 10px 10px;color:var(--w);}
  .cm.u{background:linear-gradient(135deg,var(--gd),var(--g));color:var(--b);align-self:flex-end;border-radius:10px 10px 0 10px;}
  .cir{display:flex;border-top:1px solid rgba(201,168,76,.08);}
  .ci{flex:1;padding:12px 14px;background:transparent;border:none;color:var(--w);font-family:var(--fb);font-size:12px;outline:none;}
  .cs{padding:12px 16px;background:var(--g);border:none;color:var(--b);cursor:pointer;font-size:16px;transition:background .2s;}
  .cs:hover{background:var(--gl);}

  /* Scroll reveal */
  .sr{opacity:0;transform:translateY(20px);transition:opacity .6s,transform .6s;}
  .sr.vis{opacity:1;transform:translateY(0);}

  @media(max-width:768px){
    .hm{display:none!important;}
    .aside{width:180px;}
  }
`;
document.head.appendChild(gs);

// ─── REAL-TIME SIMULATION ────────────────────────────────────────────────────
function useRealtime() {
  const [visitors, setVisitors] = useState(47);
  const [toasts, setToasts] = useState([]);
  const [liveLeads, setLiveLeads] = useState([]);
  const toastRef = useRef(0);

  const addToast = useCallback((msg, type = "lead") => {
    const id = ++toastRef.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  useEffect(() => {
    // Visitor fluctuation
    const vi = setInterval(() => {
      setVisitors(v => Math.max(30, v + Math.floor(Math.random() * 7) - 3));
    }, 4000);

    // Simulated real-time leads
    const events = [
      { msg: "🔥 Novo lead: Empresa Ferreira & Filhos entrou em contato", type: "lead" },
      { msg: "📅 Agendamento confirmado: Maria Costa — 14h amanhã", type: "schedule" },
      { msg: "💬 Nova mensagem no chat de Pedro Alves", type: "chat" },
      { msg: "⚡ Lead quente: Tech Ventures BR acessou a página de serviços 3x", type: "hot" },
      { msg: "✅ João Rodrigues acabou de preencher o formulário de diagnóstico", type: "lead" },
      { msg: "📊 Pico de acessos: +23 visitantes nos últimos 5 min", type: "traffic" },
    ];
    let ei = 0;
    const li = setInterval(() => {
      const ev = events[ei % events.length];
      addToast(ev.msg, ev.type);
      if (ei % 3 === 0) {
        const newLead = {
          id: Date.now(),
          name: ["Carlos Mendes", "Ana Beatriz", "Rodrigo Faria", "Juliana Costa"][Math.floor(Math.random() * 4)],
          company: ["TechStart BR", "Construções Omega", "Saúde Premium", "Varejo Plus"][Math.floor(Math.random() * 4)],
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          status: "new"
        };
        setLiveLeads(p => [newLead, ...p].slice(0, 8));
      }
      ei++;
    }, 8000);

    return () => { clearInterval(vi); clearInterval(li); };
  }, [addToast]);

  return { visitors, toasts, liveLeads, addToast };
}

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".sr").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const INIT_LEADS = [
  { id: 1, name: "Marcelo Ferreira", email: "marcelo@ferreira.com", company: "Ferreira & Cia", revenue: "R$ 140k/mês", problem: "Dívidas acumuladas", status: "hot", date: "28/03", phone: "(11) 98888-1111", notes: [{ id: 1, text: "Cliente muito interessado na reestruturação financeira. Mencionou dívida de R$500k com fornecedores. Próximo passo: enviar proposta até sexta.", color: "#C9A84C", date: "28/03 09:15", author: "Admin" }] },
  { id: 2, name: "Ana Paula Silva", email: "ana@silvatec.com", company: "Silva Tecnologia", revenue: "R$ 80k/mês", problem: "Crescimento estagnado", status: "contact", date: "27/03", phone: "(11) 97777-2222", notes: [{ id: 1, text: "Reunião realizada. Cliente quer focar em marketing digital e tráfego pago. Orçamento disponível: R$5k/mês.", color: "#5588E0", date: "27/03 14:30", author: "Admin" }] },
  { id: 3, name: "João Rodrigues", email: "joao@industrias.com", company: "Indústrias Rodrigues", revenue: "R$ 350k/mês", problem: "Queda nas vendas", status: "closed", date: "26/03", phone: "(11) 96666-3333", notes: [] },
  { id: 4, name: "Lucia Mendonça", email: "lucia@clinica.com", company: "Clínica Mendonça", revenue: "R$ 60k/mês", problem: "Concorrência forte", status: "new", date: "26/03", phone: "(11) 95555-4444", notes: [] },
];

const INIT_APPTS = [
  { id: 1, name: "Pedro Santos", company: "Santos Comércio", date: "29/03", time: "10:00", problem: "Reestruturação", status: "confirmed" },
  { id: 2, name: "Marina Costa", company: "Costa Eventos", date: "30/03", time: "14:00", problem: "Branding", status: "pending" },
  { id: 3, name: "Felipe Araújo", company: "Araújo Const.", date: "31/03", time: "09:00", problem: "Gestão de crise", status: "confirmed" },
];

const CHATS_INIT = [
  { id: 1, user: "Marcelo Ferreira", avatar: "M", online: true, unread: 2, msgs: [
    { from: "user", text: "Olá! Preciso urgente de ajuda com minha empresa", time: "09:10" },
    { from: "admin", text: "Claro Marcelo! Estamos aqui. Me conta mais sobre a situação.", time: "09:11" },
    { from: "user", text: "Temos dívidas acumuladas e o fluxo de caixa está negativo há 3 meses", time: "09:12" },
  ]},
  { id: 2, user: "Ana Paula", avatar: "A", online: true, unread: 1, msgs: [
    { from: "user", text: "Gostaria de saber mais sobre o serviço de marketing", time: "10:30" },
  ]},
  { id: 3, user: "Novo Visitante", avatar: "?", online: false, unread: 0, msgs: [
    { from: "user", text: "Boa tarde, podem me enviar uma proposta?", time: "11:00" },
  ]},
];

const SERVICES = {
  af: [
    { icon: "🔍", title: "Diagnóstico Empresarial", desc: "Mapeamento completo das áreas críticas: financeiro, operacional e estratégico para identificar pontos de sangria." },
    { icon: "💰", title: "Reestruturação Financeira", desc: "Reorganização do fluxo de caixa, negociação de dívidas e criação de modelo financeiro sustentável." },
    { icon: "📈", title: "Estratégias de Crescimento", desc: "Plano baseado em dados reais do mercado com potencial de receita mapeado e metas claras." },
    { icon: "⚡", title: "Gestão de Crise", desc: "Atuação imediata: proteção de ativos, retenção de clientes e blindagem jurídico-financeira." },
  ],
  mk: [
    { icon: "👑", title: "Branding Premium", desc: "Identidade de marca que comunica autoridade e gera desejo no cliente ideal." },
    { icon: "🎯", title: "Posicionamento Digital", desc: "Presença estratégica nos canais certos para ser encontrado por quem realmente compra." },
    { icon: "📱", title: "Gestão de Redes Sociais", desc: "Conteúdo que educa, engaja e converte seguidores em clientes fiéis." },
    { icon: "🚀", title: "Tráfego Pago", desc: "Campanhas de alta performance com ROI mensurável no Google, Meta e LinkedIn." },
    { icon: "✍️", title: "Copywriting Persuasivo", desc: "Textos que vendem: landing pages, emails e anúncios com alta taxa de conversão." },
  ]
};

const CASES = [
  { co: "Metalúrgica Santos", seg: "Indústria", b: "R$ 180k", a: "R$ 890k", g: "+394%", t: "8 meses", c: "#C9A84C" },
  { co: "Clínica Vida Plena", seg: "Saúde", b: "R$ 45k", a: "R$ 320k", g: "+611%", t: "6 meses", c: "#5588E0" },
  { co: "Tech Solutions BR", seg: "Tecnologia", b: "R$ 90k", a: "R$ 540k", g: "+500%", t: "12 meses", c: "#55C490" },
];

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────────────
function Toasts({ toasts }) {
  const colors = { lead: "#C9A84C", schedule: "#5588E0", chat: "#55C490", hot: "#E05555", traffic: "#9B59B6" };
  return (
    <div className="toast">
      {toasts.map(t => (
        <div key={t.id} className="toast-item" style={{ borderLeftColor: colors[t.type] || "#C9A84C" }}>
          <div style={{ fontSize: 12, color: "var(--w)", lineHeight: 1.4 }}>{t.msg}</div>
          <div style={{ fontSize: 10, color: "var(--wd)", marginTop: 4, letterSpacing: 1 }}>AGORA • AO VIVO</div>
        </div>
      ))}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ setPage, visitors }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 800, background: scrolled ? "rgba(6,6,8,.96)" : "transparent", borderBottom: scrolled ? "1px solid rgba(201,168,76,.12)" : "none", transition: "all .4s", backdropFilter: scrolled ? "blur(20px)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8D48A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👑</div>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 19, letterSpacing: 3 }}>IMPÉRIO</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 8, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32 }} className="hm">
          {[["Início","home"],["Serviços","services"],["Resultados","results"],["Agendamento","schedule"]].map(([l, id]) => (
            <span key={id} onClick={() => { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80); }}
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--wd)", cursor: "pointer", transition: "color .3s" }}
              onMouseEnter={e => e.target.style.color = "var(--g)"} onMouseLeave={e => e.target.style.color = "var(--wd)"}>
              {l}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="visitors hm">
            <span className="live-dot" />
            <span>{visitors} online</span>
          </div>
          <button className="bo hm" style={{ padding: "9px 18px", fontSize: 11 }} onClick={() => setPage("admin")}>Admin</button>
          <button className="bg" style={{ padding: "9px 18px", fontSize: 11 }} onClick={() => { setPage("home"); setTimeout(() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" }), 80); }}>
            Agendar →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ visitors, addToast }) {
  const [typed, setTyped] = useState("");
  const words = ["em Máquinas de Lucro", "para o Próximo Nível", "Além da Crise", "com Método Comprovado"];
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const w = words[wi];
    if (!del && ci < w.length) { const t = setTimeout(() => { setTyped(w.slice(0, ci + 1)); setCi(c => c + 1); }, 65); return () => clearTimeout(t); }
    if (!del && ci === w.length) { const t = setTimeout(() => setDel(true), 2200); return () => clearTimeout(t); }
    if (del && ci > 0) { const t = setTimeout(() => { setTyped(w.slice(0, ci - 1)); setCi(c => c - 1); }, 35); return () => clearTimeout(t); }
    if (del && ci === 0) { setDel(false); setWi(i => (i + 1) % words.length); }
  }, [ci, del, wi]);

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.03) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 50%,rgba(201,168,76,.07) 0%,transparent 55%),radial-gradient(ellipse at 85% 20%,rgba(85,136,224,.05) 0%,transparent 50%)" }} />
      {/* Scan line */}
      <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent)", animation: "scan 6s linear infinite", zIndex: 0 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "110px 24px 80px", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ animation: "fadeUp .7s ease forwards" }}>
          {/* Live badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(85,196,144,.1)", border: "1px solid rgba(85,196,144,.25)", fontSize: 11, color: "var(--green)", fontWeight: 600, letterSpacing: 1 }}>
              <span className="live-dot" /> {visitors} pessoas visitando agora
            </div>
            <span className="lbl">Consultoria de Elite</span>
          </div>

          <span className="gl" style={{ margin: "0 0 16px" }} />

          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(52px,8.5vw,110px)", lineHeight: .94, letterSpacing: 2, maxWidth: 920 }}>
            TRANSFORMAMOS<br />
            <span className="gt">EMPRESAS</span><br />
            <span style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontSize: ".65em", fontWeight: 400, color: "var(--wd)", lineHeight: 1.3, display: "block" }}>
              {typed}<span style={{ animation: "blink 1s infinite", color: "var(--g)" }}>|</span>
            </span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--wd)", maxWidth: 520, margin: "28px 0 40px", fontWeight: 300 }}>
            Método exclusivo que combina <strong style={{ color: "var(--w)", fontWeight: 600 }}>reestruturação financeira</strong> e <strong style={{ color: "var(--w)", fontWeight: 600 }}>marketing de alto impacto</strong> — resultados em até 60 dias.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="bg" onClick={() => { document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" }); addToast("👀 Visitante acessou o formulário de agendamento", "traffic"); }}>
              Agendar Diagnóstico Gratuito →
            </button>
            <button className="bo" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>
              Ver Resultados
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, marginTop: 64, flexWrap: "wrap" }}>
            {[{ n: "+230", l: "Empresas" }, { n: "R$40M+", l: "Receita Gerada" }, { n: "8 Anos", l: "Experiência" }, { n: "97%", l: "Sucesso" }].map((s, i) => (
              <div key={i} style={{ animation: `fadeUp ${.7 + i * .1}s ease forwards`, opacity: 0 }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: 38, color: "var(--g)", lineHeight: 1, animation: "glow 3s infinite" }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "var(--wd)", letterSpacing: 1, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "float 2.5s infinite" }}>
        <div style={{ width: 1, height: 44, background: "linear-gradient(transparent,var(--g))" }} />
        <span style={{ fontSize: 9, letterSpacing: 3, color: "var(--g)", textTransform: "uppercase" }}>scroll</span>
      </div>
    </section>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────
function Process() {
  useScrollReveal();
  return (
    <section style={{ padding: "90px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }} className="sr">
          <span className="lbl">Metodologia</span>
          <span className="gl glc" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(32px,4.5vw,52px)", letterSpacing: 2 }}>
            O PROCESSO <span className="gt">IMPÉRIO</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 0 }}>
          {[
            { n: "01", t: "Diagnóstico", d: "Análise profunda da situação atual: financeiro, operacional e mercado." },
            { n: "02", t: "Estratégia", d: "Plano de ação personalizado com metas claras e prazos definidos." },
            { n: "03", t: "Execução", d: "Implementação com acompanhamento semanal e ajustes em tempo real." },
            { n: "04", t: "Escala", d: "Resultados consolidados e crescimento contínuo e sustentável." },
          ].map((s, i) => (
            <div key={i} className="sr" style={{ padding: "36px 28px", position: "relative", borderRight: i < 3 ? "1px solid rgba(201,168,76,.08)" : "none", transitionDelay: `${i * .1}s` }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: 88, color: "rgba(201,168,76,.05)", lineHeight: 1, position: "absolute", top: 16, right: 16 }}>{s.n}</div>
              <div style={{ width: 44, height: 44, border: "1px solid var(--g)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <span style={{ fontFamily: "var(--fd)", fontSize: 18, color: "var(--g)" }}>{s.n}</span>
              </div>
              <h3 style={{ fontFamily: "var(--fd)", fontSize: 22, letterSpacing: 2, marginBottom: 10 }}>{s.t}</h3>
              <p style={{ fontSize: 13, color: "var(--wd)", lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const [tab, setTab] = useState("af");
  return (
    <section id="services" style={{ padding: "90px 24px", background: "var(--b2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }} className="sr">
          <span className="lbl">Soluções</span>
          <span className="gl" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: 2 }}>
            NOSSOS <span className="gt">SERVIÇOS</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: "1px solid rgba(201,168,76,.1)" }}>
          {[["af", "🔴 Anti-Falência"], ["mk", "🔵 Marketing & Branding"]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "14px 28px", background: "none", border: "none", color: tab === id ? "var(--g)" : "var(--wd)", fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, letterSpacing: 1, cursor: "pointer", borderBottom: tab === id ? "2px solid var(--g)" : "2px solid transparent", transition: "all .3s", marginBottom: -1 }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {SERVICES[tab].map((s, i) => (
            <div key={i} className="card sr" style={{ transitionDelay: `${i * .08}s` }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
              <span className={tab === "af" ? "tag tr" : "tag tb"} style={{ marginBottom: 10 }}>{tab === "af" ? "Anti-Falência" : "Marketing"}</span>
              <h3 style={{ fontFamily: "var(--fs)", fontSize: 20, fontWeight: 700, margin: "10px 0 10px" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "var(--wd)", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="bg" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>
            Quero Minha Transformação →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function Results() {
  return (
    <section id="results" style={{ padding: "90px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }} className="sr">
          <span className="lbl">Prova Social</span>
          <span className="gl" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: 2 }}>
            CASOS DE <span className="gt">SUCESSO</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 60 }}>
          {CASES.map((c, i) => (
            <div key={i} className="card sr" style={{ transitionDelay: `${i * .1}s` }}>
              <div style={{ position: "absolute", top: -10, right: 16 }}>
                <span style={{ background: `linear-gradient(135deg,${c.c}88,${c.c})`, color: "#000", padding: "3px 14px", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{c.seg}</span>
              </div>
              <h3 style={{ fontFamily: "var(--fs)", fontSize: 20, marginBottom: 20, marginTop: 6 }}>{c.co}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div style={{ padding: 14, background: "rgba(220,85,85,.07)", border: "1px solid rgba(220,85,85,.18)" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#FF8080", marginBottom: 3 }}>ANTES</div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 18, color: "#FF8080" }}>{c.b}</div>
                </div>
                <div style={{ padding: 14, background: "rgba(85,196,144,.07)", border: "1px solid rgba(85,196,144,.18)" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#88DDAA", marginBottom: 3 }}>DEPOIS</div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 18, color: "#88DDAA" }}>{c.a}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 36, color: c.c }}>{c.g}</div>
                  <div style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1 }}>CRESCIMENTO</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 22 }}>{c.t}</div>
                  <div style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1 }}>PARA RESULTADO</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {[
            { n: "Carlos Mendes", r: "CEO, Metalúrgica Santos", t: "Estávamos a 2 meses de fechar as portas. O Império não só nos salvou como transformou nossa empresa em referência. Resultado em 8 meses foi absurdo." },
            { n: "Dra. Fernanda Costa", r: "Fundadora, Clínica Vida Plena", t: "Nunca imaginei que marketing geraria tanto resultado concreto. Triplicamos o número de consultas e hoje temos fila de espera." },
            { n: "Roberto Alves", r: "Diretor, Tech Solutions", t: "A reestruturação e o branding foram cirúrgicos. Hoje somos referência premium e cobramos 3x mais pelo mesmo serviço." },
          ].map((t, i) => (
            <div key={i} className="card sr" style={{ transitionDelay: `${i * .1}s` }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[...Array(5)].map((_, j) => <span key={j} style={{ color: "var(--g)", fontSize: 14 }}>★</span>)}
              </div>
              <p style={{ fontFamily: "var(--fs)", fontSize: 16, fontStyle: "italic", color: "var(--wd)", lineHeight: 1.8, marginBottom: 18 }}>"{t.t}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{t.n[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t.n}</div>
                  <div style={{ fontSize: 11, color: "var(--g)" }}>{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SCHEDULE ────────────────────────────────────────────────────────────────
function Schedule({ onSchedule }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", revenue: "", problem: "", date: "", time: "" });
  const [done, setDone] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.email || !form.company) return alert("Preencha os campos obrigatórios!");
    onSchedule({ ...form, id: Date.now(), status: "pending" });
    setDone(true);
  };

  if (done) return (
    <section id="schedule" style={{ padding: "90px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 500, margin: "0 auto", animation: "fadeUp .5s" }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: 44, letterSpacing: 2, marginBottom: 14 }}>AGENDADO <span className="gt">COM SUCESSO!</span></h2>
        <p style={{ color: "var(--wd)", lineHeight: 1.7 }}>Nossa equipe entrará em contato em até <strong style={{ color: "var(--g)" }}>2 horas úteis</strong>.</p>
        <button className="bg" style={{ marginTop: 28 }} onClick={() => setDone(false)}>Novo Agendamento</button>
      </div>
    </section>
  );

  return (
    <section id="schedule" style={{ padding: "90px 24px", background: "var(--b2)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
          <div className="sr">
            <span className="lbl">Primeiro Passo</span>
            <span className="gl" />
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(32px,4vw,48px)", letterSpacing: 2, marginBottom: 18 }}>
              DIAGNÓSTICO<br /><span className="gt">GRATUITO</span>
            </h2>
            <p style={{ color: "var(--wd)", lineHeight: 1.8, marginBottom: 28, fontSize: 14 }}>60 minutos que podem mudar o destino da sua empresa.</p>
            {["Análise completa da sua situação", "Identificação dos pontos de perda", "Estratégia personalizada", "Sem custo, sem compromisso"].map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: "var(--g)", marginTop: 2 }}>✓</span>
                <span style={{ color: "var(--wd)", fontSize: 13 }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.18)", padding: "36px 28px" }} className="sr">
            <h3 style={{ fontFamily: "var(--fd)", fontSize: 22, letterSpacing: 2, marginBottom: 20 }}>FORMULÁRIO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["name","Nome completo *","text"],["company","Empresa *","text"],["email","E-mail *","email"],["phone","WhatsApp","tel"],["revenue","Faturamento mensal","text"]].map(([k, ph, t]) => (
                <input key={k} className="inp" type={t} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} />
              ))}
              <select className="inp" style={{ cursor: "pointer" }} value={form.problem} onChange={e => set("problem", e.target.value)}>
                <option value="">Principal desafio *</option>
                {["Dívidas e reestruturação","Queda nas vendas","Crescimento estagnado","Branding e posicionamento","Gestão de crise","Marketing digital"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input className="inp" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
                <select className="inp" style={{ cursor: "pointer" }} value={form.time} onChange={e => set("time", e.target.value)}>
                  <option value="">Horário</option>
                  {["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button className="bg" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={submit}>
              Agendar Agora →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "var(--b2)", borderTop: "1px solid rgba(201,168,76,.08)", padding: "56px 24px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }}>👑</div>
              <div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 18, letterSpacing: 3 }}>IMPÉRIO</div>
                <div style={{ fontSize: 8, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div>
              </div>
            </div>
            <p style={{ color: "var(--wd)", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>Transformamos empresas em crise em referências de mercado. 8 anos, +230 clientes, R$40M+ gerados.</p>
          </div>
          {[
            ["SERVIÇOS", ["Diagnóstico Gratuito","Anti-Falência","Marketing","Branding","Tráfego Pago"]],
            ["EMPRESA", ["Sobre Nós","Cases","Blog","Imprensa","Admin"]],
            ["CONTATO", ["📞 (11) 99999-0000","📧 contato@imperio.com","📍 São Paulo, SP","⏰ Seg–Sex 8h–18h"]],
          ].map(([h, items]) => (
            <div key={h}>
              <h4 style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 16, fontSize: 14 }}>{h}</h4>
              {items.map(l => (
                <div key={l} onClick={() => l === "Admin" && setPage("admin")} style={{ color: "var(--wd)", fontSize: 12, marginBottom: 8, cursor: "pointer", transition: "color .2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--g)"} onMouseLeave={e => e.target.style.color = "var(--wd)"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent)", margin: "0 0 24px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--wd)", flexWrap: "wrap", gap: 8 }}>
          <span>© 2026 Império Estratégico. Todos os direitos reservados.</span>
          <span>CNPJ: 00.000.000/0001-00</span>
        </div>
      </div>
    </footer>
  );
}

// ─── CHAT WIDGET ─────────────────────────────────────────────────────────────
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "admin", text: "Olá! 👑 Sou a Ana do Império Estratégico. Como posso ajudar?", time: "agora" }]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  const replies = ["Entendi! Me conta mais sobre seu negócio. 🎯", "Temos ajudado +230 empresas nessa situação! Posso agendar um diagnóstico gratuito.", "Ótimo! Qual o melhor horário para falarmos? Nossa equipe está disponível agora.", "Perfeito! Vou registrar sua solicitação. Retornamos em até 2h. 🚀"];
  let ri = 0;

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!inp.trim()) return;
    setMsgs(m => [...m, { from: "user", text: inp, time: "agora" }]);
    setInp(""); setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(m => [...m, { from: "admin", text: replies[ri++ % replies.length], time: "agora" }]); }, 1300);
  };

  return (
    <div className="cw">
      {open && (
        <div className="cwin">
          <div className="ch">
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#000" }}>Império Estratégico</div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,.6)", display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2ECC71", display: "inline-block" }} /> Online agora
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#000" }}>✕</button>
          </div>
          <div className="cms">
            {msgs.map((m, i) => <div key={i} className={`cm ${m.from === "admin" ? "a" : "u"}`}>{m.text}</div>)}
            {typing && <div className="cm a" style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[0,.2,.4].map((d, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--g)", display: "inline-block", animation: `blink 1s ${d}s infinite` }} />)}
            </div>}
            <div ref={ref} />
          </div>
          <div className="cir">
            <input className="ci" placeholder="Sua mensagem..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="cs" onClick={send}>➤</button>
          </div>
        </div>
      )}
      <div className="cb" onClick={() => setOpen(!open)}>💬</div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [e, setE] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--b)", padding: 24 }}>
      <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.2)", padding: "44px 36px", width: "100%", maxWidth: 400, animation: "fadeUp .5s" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>👑</div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 26, letterSpacing: 4 }}>ADMIN PANEL</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--g)", fontWeight: 700 }}>IMPÉRIO ESTRATÉGICO V10</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="inp" type="email" placeholder="E-mail" value={e} onChange={ev => setE(ev.target.value)} />
          <input className="inp" type="password" placeholder="Senha" value={p} onChange={ev => setP(ev.target.value)} onKeyDown={ev => ev.key === "Enter" && (e === "admin@imperio.com" && p === "admin123" ? onLogin() : setErr("Credenciais inválidas"))} />
          {err && <div style={{ color: "#FF8080", fontSize: 12, textAlign: "center" }}>{err}</div>}
          <button className="bg" style={{ justifyContent: "center", marginTop: 6 }} onClick={() => e === "admin@imperio.com" && p === "admin123" ? onLogin() : setErr("Credenciais inválidas. Use admin@imperio.com / admin123")}>
            🔐 Entrar
          </button>
          <div style={{ fontSize: 11, color: "var(--wd)", textAlign: "center" }}>admin@imperio.com · admin123</div>
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT NOTES MODAL ───────────────────────────────────────────────────────
function NotesModal({ client, onClose, onSave }) {
  const [notes, setNotes] = useState(client.notes || []);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#C9A84C");
  const colors = ["#C9A84C", "#5588E0", "#55C490", "#E05555", "#9B59B6", "#E67E22"];

  const addNote = () => {
    if (!text.trim()) return;
    const n = { id: Date.now(), text, color, date: new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }), author: "Admin" };
    const updated = [n, ...notes];
    setNotes(updated);
    onSave(client.id, updated);
    setText("");
  };

  const delNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    onSave(client.id, updated);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .2s" }}>
      <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.25)", maxWidth: 580, width: "100%", maxHeight: "85vh", overflow: "auto", animation: "fadeUp .3s" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(201,168,76,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 20, letterSpacing: 2 }}>ANOTAÇÕES DO CLIENTE</div>
            <div style={{ fontSize: 12, color: "var(--g)", marginTop: 2 }}>{client.name} · {client.company}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--wd)", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        {/* Client info */}
        <div style={{ padding: "14px 24px", background: "rgba(201,168,76,.04)", borderBottom: "1px solid rgba(201,168,76,.08)", display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[["📧", client.email], ["📞", client.phone], ["💰", client.revenue], ["⚠️", client.problem]].map(([ic, v]) => (
            <div key={ic} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12 }}>{ic}</span>
              <span style={{ fontSize: 12, color: "var(--wd)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Add note */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(201,168,76,.08)" }}>
          <textarea className="inp" rows={3} placeholder="Digite sua anotação sobre este cliente..." value={text} onChange={e => setText(e.target.value)} style={{ resize: "vertical", marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--wd)" }}>Cor:</span>
              {colors.map(c => (
                <div key={c} onClick={() => setColor(c)} style={{ width: 20, height: 20, borderRadius: "50%", background: c, cursor: "pointer", border: color === c ? "2px solid var(--w)" : "2px solid transparent", transition: "border .2s" }} />
              ))}
            </div>
            <button className="bg" style={{ padding: "9px 20px", fontSize: 11 }} onClick={addNote}>+ Adicionar</button>
          </div>
        </div>

        {/* Notes list */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {notes.length === 0 && <div style={{ color: "var(--wd)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Nenhuma anotação ainda. Adicione a primeira acima! 📝</div>}
          {notes.map(n => (
            <div key={n.id} className="note-card" style={{ position: "relative", borderLeft: `3px solid ${n.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, display: "inline-block" }} />
                  <span style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1 }}>{n.date}</span>
                  <span style={{ fontSize: 10, color: n.color, fontWeight: 600 }}>· {n.author}</span>
                </div>
                <button onClick={() => delNote(n.id)} style={{ background: "none", border: "none", color: "var(--wd)", cursor: "pointer", fontSize: 12, opacity: .6 }}>🗑</button>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--w)" }}>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onLogout, appointments, leads, visitors, liveLeads }) {
  const [tab, setTab] = useState("dashboard");
  const [allLeads, setAllLeads] = useState([...INIT_LEADS, ...leads.map(l => ({ ...l, status: "new", date: "hoje", notes: [] }))]);
  const [allAppts, setAllAppts] = useState([...INIT_APPTS, ...appointments.map(a => ({ ...a, status: "pending" }))]);
  const [chats, setChats] = useState(CHATS_INIT);
  const [activeChat, setActiveChat] = useState(1);
  const [chatReply, setChatReply] = useState("");
  const [notesClient, setNotesClient] = useState(null);
  const [search, setSearch] = useState("");

  const saveNotes = (cid, notes) => {
    setAllLeads(p => p.map(l => l.id === cid ? { ...l, notes } : l));
  };

  const sendReply = () => {
    if (!chatReply.trim()) return;
    setChats(p => p.map(c => c.id === activeChat ? { ...c, unread: 0, msgs: [...c.msgs, { from: "admin", text: chatReply, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }] } : c));
    setChatReply("");
  };

  const filteredLeads = allLeads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "leads", icon: "📩", label: "Leads" },
    { id: "chat", icon: "💬", label: "Chat", badge: chats.reduce((a, c) => a + c.unread, 0) },
    { id: "appointments", icon: "📅", label: "Agendamentos" },
    { id: "content", icon: "📝", label: "Conteúdo" },
    { id: "live", icon: "📡", label: "Tempo Real" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--b)", display: "flex" }}>
      {notesClient && <NotesModal client={notesClient} onClose={() => setNotesClient(null)} onSave={saveNotes} />}

      {/* Sidebar */}
      <div className="aside" style={{ flexShrink: 0 }}>
        <div style={{ padding: "20px 18px", borderBottom: "1px solid rgba(201,168,76,.08)" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 16, letterSpacing: 3 }}>IMPÉRIO</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "var(--g)", fontWeight: 700 }}>ADMIN V10.0</div>
        </div>
        {/* Live badge */}
        <div style={{ margin: "12px", padding: "8px 12px", background: "rgba(85,196,144,.08)", border: "1px solid rgba(85,196,144,.15)", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 11, color: "var(--green)" }}>{visitors} online agora</span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {navItems.map(n => (
            <div key={n.id} className={`ani ${tab === n.id ? "on" : ""}`} onClick={() => setTab(n.id)}>
              <span>{n.icon}</span> {n.label}
              {n.badge > 0 && <span style={{ marginLeft: "auto", background: "var(--g)", color: "#000", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{n.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(201,168,76,.08)" }}>
          <div className="ani" onClick={onLogout}><span>🚪</span> Sair</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", maxHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(201,168,76,.07)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--b2)", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: 20, letterSpacing: 3 }}>
            {navItems.find(n => n.id === tab)?.icon} {navItems.find(n => n.id === tab)?.label?.toUpperCase()}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>A</div>
              <div><div style={{ fontSize: 12, fontWeight: 600 }}>Administrador</div><div style={{ fontSize: 10, color: "var(--g)" }}>Super Admin</div></div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
                {[
                  { l: "Leads Totais", v: allLeads.length, i: "📩", c: "#C9A84C" },
                  { l: "Agendamentos", v: allAppts.length, i: "📅", c: "#5588E0" },
                  { l: "Chats Ativos", v: chats.length, i: "💬", c: "#55C490" },
                  { l: "Online Agora", v: visitors, i: "👥", c: "#E05555" },
                  { l: "Taxa Conversão", v: "68%", i: "📈", c: "#9B59B6" },
                  { l: "Receita Est.", v: "R$2.4M", i: "💰", c: "#C9A84C" },
                ].map((s, i) => (
                  <div key={i} className="ac" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1, marginBottom: 6 }}>{s.l.toUpperCase()}</div>
                      <div style={{ fontFamily: "var(--fd)", fontSize: 34, color: s.c }}>{s.v}</div>
                    </div>
                    <div style={{ fontSize: 24, opacity: .6 }}>{s.i}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="ac">
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 16, fontSize: 14 }}>LEADS POR STATUS</div>
                  {[
                    { l: "Quentes 🔥", k: "hot", c: "#E05555", n: allLeads.filter(l => l.status === "hot").length },
                    { l: "Novos", k: "new", c: "#55C490", n: allLeads.filter(l => l.status === "new").length },
                    { l: "Em Contato", k: "contact", c: "#5588E0", n: allLeads.filter(l => l.status === "contact").length },
                    { l: "Fechados", k: "closed", c: "#C9A84C", n: allLeads.filter(l => l.status === "closed").length },
                  ].map(it => (
                    <div key={it.k} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12 }}>{it.l}</span>
                        <span style={{ fontSize: 12, color: it.c, fontWeight: 600 }}>{it.n}</span>
                      </div>
                      <div style={{ height: 5, background: "var(--b4)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${Math.max(5, (it.n / allLeads.length) * 100)}%`, background: it.c, borderRadius: 3, transition: "width 1s" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ac">
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 16, fontSize: 14 }}>LEADS EM TEMPO REAL 📡</div>
                  {liveLeads.length === 0 && <div style={{ color: "var(--wd)", fontSize: 12, padding: "20px 0", textAlign: "center" }}>Aguardando novos leads...</div>}
                  {liveLeads.slice(0, 5).map((l, i) => (
                    <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(201,168,76,.06)", animation: "fadeUp .4s" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{l.name}</div>
                        <div style={{ fontSize: 10, color: "var(--wd)" }}>{l.company}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "var(--wd)" }}>{l.time}</span>
                        <span className="sb sn">novo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEADS with NOTES */}
          {tab === "leads" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <input className="inp" style={{ maxWidth: 280 }} placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="inp" style={{ maxWidth: 150, cursor: "pointer" }}>
                  <option>Todos</option><option>Quentes</option><option>Novos</option><option>Em Contato</option><option>Fechados</option>
                </select>
              </div>
              <div className="ac" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(201,168,76,.1)", background: "rgba(201,168,76,.03)" }}>
                      {["Cliente", "Empresa", "Faturamento", "Problema", "Status", "Notas", "Ações"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, letterSpacing: 1, color: "var(--g)", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((l, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.03)", transition: "background .2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</div>
                          <div style={{ fontSize: 10, color: "var(--wd)" }}>{l.email}</div>
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--wd)" }}>{l.company}</td>
                        <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--g)", fontWeight: 600 }}>{l.revenue}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--wd)", maxWidth: 160 }}>{l.problem}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <select value={l.status} onChange={e => setAllLeads(p => p.map(x => x.id === l.id ? { ...x, status: e.target.value } : x))}
                            style={{ background: "var(--b4)", color: "var(--w)", border: "1px solid rgba(201,168,76,.2)", padding: "3px 8px", fontSize: 11, cursor: "pointer", outline: "none" }}>
                            <option value="new">Novo</option><option value="hot">Quente 🔥</option><option value="contact">Em Contato</option><option value="closed">Fechado</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <button onClick={() => setNotesClient(l)} style={{ padding: "5px 12px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.25)", color: "var(--g)", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4, borderRadius: 2 }}>
                            📝 {l.notes?.length > 0 ? `${l.notes.length} nota${l.notes.length > 1 ? "s" : ""}` : "Anotar"}
                          </button>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <button onClick={() => setAllLeads(p => p.filter(x => x.id !== l.id))} style={{ padding: "4px 8px", background: "rgba(220,85,85,.1)", border: "1px solid rgba(220,85,85,.25)", color: "#FF8080", cursor: "pointer", fontSize: 11, borderRadius: 2 }}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CHAT */}
          {tab === "chat" && (
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, height: "calc(100vh - 180px)" }}>
              <div className="ac" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(201,168,76,.1)", fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 13 }}>CONVERSAS</div>
                {chats.map(c => (
                  <div key={c.id} onClick={() => { setActiveChat(c.id); setChats(p => p.map(x => x.id === c.id ? { ...x, unread: 0 } : x)); }}
                    style={{ padding: "13px 16px", borderBottom: "1px solid rgba(201,168,76,.05)", cursor: "pointer", background: activeChat === c.id ? "rgba(201,168,76,.07)" : "transparent", transition: "background .2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{c.user}</div>
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.online ? "var(--green)" : "var(--wd)", display: "inline-block" }} />
                            <span style={{ fontSize: 10, color: "var(--wd)" }}>{c.online ? "online" : "offline"}</span>
                          </div>
                        </div>
                      </div>
                      {c.unread > 0 && <span style={{ background: "var(--g)", color: "#000", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{c.unread}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--wd)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 38 }}>
                      {c.msgs[c.msgs.length - 1]?.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="ac" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {activeChat ? (() => {
                  const chat = chats.find(c => c.id === activeChat);
                  return <>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(201,168,76,.1)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{chat?.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{chat?.user}</div>
                        <div style={{ fontSize: 10, color: chat?.online ? "var(--green)" : "var(--wd)" }}>● {chat?.online ? "Online agora" : "Offline"}</div>
                      </div>
                      <button onClick={() => setNotesClient(allLeads.find(l => l.name.includes(chat?.user.split(" ")[0])) || allLeads[0])}
                        style={{ padding: "6px 14px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.25)", color: "var(--g)", cursor: "pointer", fontSize: 11, borderRadius: 2 }}>
                        📝 Ver Notas
                      </button>
                    </div>
                    <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {chat?.msgs.map((m, i) => (
                        <div key={i} style={{ maxWidth: "68%", padding: "9px 13px", borderRadius: 10, fontSize: 12, lineHeight: 1.55, alignSelf: m.from === "admin" ? "flex-end" : "flex-start", background: m.from === "admin" ? "linear-gradient(135deg,var(--gd),var(--g))" : "var(--b4)", color: m.from === "admin" ? "#000" : "var(--w)", border: m.from !== "admin" ? "1px solid rgba(201,168,76,.1)" : "none", borderRadius: m.from === "admin" ? "10px 10px 0 10px" : "0 10px 10px 10px" }}>
                          {m.text}
                          <div style={{ fontSize: 9, opacity: .6, marginTop: 3, textAlign: m.from === "admin" ? "right" : "left" }}>{m.time}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: 14, borderTop: "1px solid rgba(201,168,76,.08)", display: "flex", gap: 8 }}>
                      <input className="inp" style={{ flex: 1 }} placeholder="Digite sua resposta..." value={chatReply} onChange={e => setChatReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} />
                      <button className="bg" style={{ padding: "12px 18px" }} onClick={sendReply}>➤</button>
                    </div>
                  </>;
                })() : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 10, color: "var(--wd)" }}>
                    <span style={{ fontSize: 44 }}>💬</span>
                    <p style={{ fontSize: 13 }}>Selecione uma conversa</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPOINTMENTS */}
          {tab === "appointments" && (
            <div className="ac" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(201,168,76,.1)", background: "rgba(201,168,76,.03)" }}>
                    {["Cliente", "Empresa", "Data", "Hora", "Problema", "Status", "Ações"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, letterSpacing: 1, color: "var(--g)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allAppts.map((a, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.03)", transition: "background .2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600 }}>{a.name}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--wd)" }}>{a.company}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--g)" }}>{a.date}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13 }}>{a.time}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--wd)" }}>{a.problem}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span className={`sb ${a.status === "confirmed" ? "sf" : "sn"}`}>{a.status === "confirmed" ? "Confirmado" : "Pendente"}</span>
                      </td>
                      <td style={{ padding: "12px 14px", display: "flex", gap: 6 }}>
                        <button onClick={() => setAllAppts(p => p.map(x => x.id === a.id ? { ...x, status: "confirmed" } : x))}
                          style={{ padding: "4px 10px", background: "rgba(85,196,144,.1)", border: "1px solid rgba(85,196,144,.25)", color: "#88DDAA", cursor: "pointer", fontSize: 10, borderRadius: 2 }}>✓</button>
                        <button onClick={() => setAllAppts(p => p.filter(x => x.id !== a.id))}
                          style={{ padding: "4px 8px", background: "rgba(220,85,85,.1)", border: "1px solid rgba(220,85,85,.25)", color: "#FF8080", cursor: "pointer", fontSize: 10, borderRadius: 2 }}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CONTENT */}
          {tab === "content" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="ac">
                <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 18, fontSize: 14 }}>EDITAR TEXTOS DO SITE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["HEADLINE", "Transformamos empresas quebradas em máquinas de lucro"], ["SUBHEADLINE", "Método exclusivo de reestruturação financeira e marketing de alto impacto"], ["CTA BOTÃO", "Agendar Diagnóstico Gratuito"]].map(([l, v]) => (
                    <div key={l}>
                      <label style={{ fontSize: 10, letterSpacing: 1, color: "var(--g)", display: "block", marginBottom: 5 }}>{l}</label>
                      {l === "SUBHEADLINE" ? <textarea className="inp" rows={2} defaultValue={v} style={{ resize: "vertical" }} /> : <input className="inp" defaultValue={v} />}
                    </div>
                  ))}
                  <button className="bg" style={{ justifyContent: "center" }}>💾 Salvar</button>
                </div>
              </div>
              <div className="ac">
                <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 18, fontSize: 14 }}>ADICIONAR DEPOIMENTO</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input className="inp" placeholder="Nome do cliente" />
                  <input className="inp" placeholder="Cargo / Empresa" />
                  <textarea className="inp" rows={3} placeholder="Depoimento..." style={{ resize: "vertical" }} />
                  <select className="inp" style={{ cursor: "pointer" }}>
                    <option>★★★★★ 5 estrelas</option><option>★★★★ 4 estrelas</option>
                  </select>
                  <button className="bg" style={{ justifyContent: "center" }}>+ Adicionar</button>
                </div>
              </div>
            </div>
          )}

          {/* LIVE / REAL-TIME */}
          {tab === "live" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="ac">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span className="live-dot" />
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 14 }}>VISITANTES EM TEMPO REAL</div>
                </div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 72, color: "var(--green)", marginBottom: 4 }}>{visitors}</div>
                <div style={{ fontSize: 11, color: "var(--wd)", letterSpacing: 1, marginBottom: 24 }}>PESSOAS NO SITE AGORA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[["🏠 Página Inicial", Math.floor(visitors * .45)], ["💼 Serviços", Math.floor(visitors * .22)], ["📊 Resultados", Math.floor(visitors * .18)], ["📅 Agendamento", Math.floor(visitors * .15)]].map(([p, n]) => (
                    <div key={p} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--b4)", borderLeft: "2px solid var(--g)" }}>
                      <span style={{ fontSize: 12 }}>{p}</span>
                      <span style={{ fontSize: 12, color: "var(--g)", fontWeight: 600 }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ac">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span className="live-dot" />
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 14 }}>ATIVIDADE AO VIVO</div>
                </div>
                {liveLeads.length === 0 && (
                  <div style={{ color: "var(--wd)", fontSize: 12, textAlign: "center", padding: "30px 0" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
                    Aguardando eventos em tempo real...
                  </div>
                )}
                {liveLeads.map((l, i) => (
                  <div key={l.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(201,168,76,.06)", animation: "fadeUp .4s" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{l.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontSize: 10, color: "var(--wd)" }}>{l.company} · {l.time}</div>
                    </div>
                    <span className="sb sn">novo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [adminLogged, setAdminLogged] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);
  const { visitors, toasts, liveLeads, addToast } = useRealtime();

  const handleSchedule = (data) => {
    setAppointments(p => [...p, data]);
    setLeads(p => [...p, data]);
    addToast(`✅ Novo agendamento: ${data.name} de ${data.company}`, "schedule");
  };

  if (page === "admin") {
    if (!adminLogged) return <AdminLogin onLogin={() => setAdminLogged(true)} />;
    return <AdminPanel onLogout={() => { setAdminLogged(false); setPage("home"); }} appointments={appointments} leads={leads} visitors={visitors} liveLeads={liveLeads} />;
  }

  return (
    <div>
      <Toasts toasts={toasts} />
      <Navbar setPage={setPage} visitors={visitors} />
      <Hero visitors={visitors} addToast={addToast} />
      <Process />
      <Services />
      <Results />
      <Schedule onSchedule={handleSchedule} />
      <Footer setPage={setPage} />
      <ChatWidget />
      {/* WhatsApp */}
      <a href="https://wa.me/5512988533884" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 92, right: 24, zIndex: 899, width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 4px 20px rgba(37,211,102,.4)", transition: "transform .2s", textDecoration: "none" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        📱
      </a>
    </div>
  );
}
