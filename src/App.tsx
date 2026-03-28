import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS ───────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  :root {
    --gold: #C9A84C;
    --gold-light: #E2C97E;
    --gold-dark: #9A7B2E;
    --black: #080808;
    --black-2: #0F0F0F;
    --black-3: #161616;
    --black-4: #1E1E1E;
    --white: #F5F2EC;
    --white-dim: rgba(245,242,236,0.6);
    --white-dim2: rgba(245,242,236,0.15);
    --font-display: 'Bebas Neue', sans-serif;
    --font-serif: 'Cormorant Garamond', serif;
    --font-body: 'DM Sans', sans-serif;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { background: var(--black); color: var(--white); font-family: var(--font-body); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--black-2); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 2px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes pulse-gold { 0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); } 70% { box-shadow: 0 0 0 12px rgba(201,168,76,0); } }
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  @keyframes countUp { from { opacity:0; transform: scale(0.7); } to { opacity:1; transform: scale(1); } }
  @keyframes lineGrow { from { width:0; } to { width:100%; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }

  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .fade-in { animation: fadeIn 0.5s ease forwards; }

  .gold-text { background: linear-gradient(135deg, var(--gold-dark), var(--gold-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .gold-line { display:block; width:60px; height:2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); margin: 16px 0; }
  .gold-line-center { margin: 16px auto; }

  .section-label { font-family: var(--font-body); font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color: var(--gold); }

  .btn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 36px; font-family: var(--font-body); font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
    background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light));
    color: var(--black); border: none; cursor: pointer; transition: all 0.3s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.4); filter: brightness(1.1); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 15px 35px; font-family: var(--font-body); font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
    background: transparent; color: var(--gold); border: 1px solid var(--gold); cursor: pointer; transition: all 0.3s;
  }
  .btn-outline:hover { background: rgba(201,168,76,0.1); transform: translateY(-2px); }

  .card-premium {
    background: linear-gradient(145deg, var(--black-3), var(--black-4));
    border: 1px solid rgba(201,168,76,0.15);
    padding: 32px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .card-premium::before {
    content: ''; position: absolute; top:0; left:0; width:100%; height:2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .card-premium:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  .card-premium:hover::before { opacity: 1; }

  .noise-bg {
    position: relative;
  }
  .noise-bg::after {
    content: ''; position:absolute; inset:0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; opacity:0.4; z-index:0;
  }

  .stat-number { font-family: var(--font-display); font-size: clamp(48px, 8vw, 96px); line-height:1; color: var(--gold); }
  .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent); margin: 60px 0; }

  .nav-link { font-size:13px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color: var(--white-dim); cursor:pointer; transition: color 0.3s; }
  .nav-link:hover { color: var(--gold); }

  .tag { display:inline-block; padding:4px 12px; font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; }
  .tag-red { background: rgba(220,50,50,0.15); color:#FF6B6B; border: 1px solid rgba(220,50,50,0.3); }
  .tag-blue { background: rgba(50,120,220,0.15); color:#6BA3FF; border: 1px solid rgba(50,120,220,0.3); }
  .tag-gold { background: rgba(201,168,76,0.15); color:var(--gold); border: 1px solid rgba(201,168,76,0.3); }

  .input-field {
    width:100%; padding:14px 18px; background:var(--black-3); border:1px solid rgba(201,168,76,0.2);
    color:var(--white); font-family:var(--font-body); font-size:14px; outline:none; transition:border 0.3s;
  }
  .input-field:focus { border-color: var(--gold); }
  .input-field::placeholder { color: rgba(245,242,236,0.3); }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; animation: fadeIn 0.2s; }
  .modal-box { background: var(--black-3); border: 1px solid rgba(201,168,76,0.3); max-width:600px; width:100%; max-height:90vh; overflow-y:auto; animation: fadeUp 0.3s; }

  /* Chat widget */
  .chat-widget { position:fixed; bottom:24px; right:24px; z-index:900; }
  .chat-bubble { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,#25D366,#128C7E); display:flex; align-items:center; justify-content:center; cursor:pointer; animation: pulse-gold 2s infinite; font-size:28px; box-shadow:0 4px 20px rgba(0,0,0,0.4); transition: transform 0.2s; }
  .chat-bubble:hover { transform: scale(1.1); }
  .chat-window { position:absolute; bottom:70px; right:0; width:340px; background:var(--black-3); border:1px solid rgba(201,168,76,0.2); border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.6); animation: fadeUp 0.3s; }
  .chat-header { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); padding:16px 20px; display:flex; align-items:center; gap:12px; }
  .chat-avatar { width:42px; height:42px; border-radius:50%; background:var(--black); display:flex; align-items:center; justify-content:center; font-size:20px; }
  .chat-messages { height:280px; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; }
  .chat-msg { max-width:80%; padding:10px 14px; border-radius:12px; font-size:13px; line-height:1.5; }
  .chat-msg.admin { background:rgba(201,168,76,0.15); border:1px solid rgba(201,168,76,0.2); align-self:flex-start; color:var(--white); border-radius:0 12px 12px 12px; }
  .chat-msg.user { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:var(--black); align-self:flex-end; border-radius:12px 12px 0 12px; }
  .chat-input-row { display:flex; border-top:1px solid rgba(201,168,76,0.1); }
  .chat-input { flex:1; padding:14px 16px; background:transparent; border:none; color:var(--white); font-family:var(--font-body); font-size:13px; outline:none; }
  .chat-send { padding:14px 18px; background:var(--gold); border:none; color:var(--black); cursor:pointer; font-size:18px; transition:background 0.2s; }
  .chat-send:hover { background:var(--gold-light); }

  /* Admin */
  .admin-sidebar { width:240px; min-height:100vh; background:var(--black-2); border-right:1px solid rgba(201,168,76,0.1); }
  .admin-nav-item { padding:13px 20px; font-size:13px; font-weight:500; letter-spacing:0.5px; cursor:pointer; display:flex; align-items:center; gap:10px; transition:all 0.2s; color:var(--white-dim); }
  .admin-nav-item:hover { background:rgba(201,168,76,0.05); color:var(--gold); }
  .admin-nav-item.active { background:rgba(201,168,76,0.1); color:var(--gold); border-right:2px solid var(--gold); }
  .admin-card { background:var(--black-3); border:1px solid rgba(201,168,76,0.1); padding:24px; }
  .status-badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .status-new { background:rgba(100,200,100,0.15); color:#6DC86D; }
  .status-contact { background:rgba(100,150,255,0.15); color:#6BA3FF; }
  .status-closed { background:rgba(201,168,76,0.15); color:var(--gold); }

  @media (max-width: 768px) {
    .hero-title { font-size: clamp(48px, 12vw, 80px) !important; }
    .hide-mobile { display: none !important; }
    .admin-sidebar { width: 200px; }
  }
`;
document.head.appendChild(style);

// ─── DATA ───────────────────────────────────────────────────────────────────
const SERVICES = {
  antifalencia: [
    { icon: "🔍", title: "Diagnóstico Empresarial", desc: "Mapeamos todas as áreas críticas da sua empresa: financeiro, operacional e estratégico para identificar os pontos de sangria." },
    { icon: "💰", title: "Reestruturação Financeira", desc: "Reorganizamos seu fluxo de caixa, negociamos dívidas e criamos um modelo financeiro sustentável e escalável." },
    { icon: "📈", title: "Estratégias de Crescimento", desc: "Desenvolvemos um plano de crescimento baseado em dados reais do seu mercado e potencial de receita." },
    { icon: "⚡", title: "Gestão de Crise", desc: "Atuação imediata em situações críticas: proteção de ativos, retenção de clientes e blindagem jurídica." },
  ],
  marketing: [
    { icon: "👑", title: "Branding Premium", desc: "Construímos uma identidade de marca que comunica autoridade e gera desejo no seu cliente ideal." },
    { icon: "🎯", title: "Posicionamento Digital", desc: "Ocupamos o espaço certo nos canais certos para que sua empresa seja encontrada por quem realmente compra." },
    { icon: "📱", title: "Gestão de Redes Sociais", desc: "Conteúdo estratégico que educa, engaja e converte seguidores em clientes fiéis." },
    { icon: "🚀", title: "Tráfego Pago", desc: "Campanhas de alta performance em Google, Meta e LinkedIn com ROI mensurável e escalável." },
    { icon: "✍️", title: "Copywriting Persuasivo", desc: "Textos que vendem: landing pages, emails, anúncios e scripts que convertem visitantes em compradores." },
  ]
};

const CASES = [
  { company: "Metalúrgica Santos", segment: "Indústria", before: "R$ 180k/mês", after: "R$ 890k/mês", growth: "+394%", time: "8 meses", color: "#C9A84C" },
  { company: "Clínica Vida Plena", segment: "Saúde", before: "R$ 45k/mês", after: "R$ 320k/mês", growth: "+611%", time: "6 meses", color: "#6BA3FF" },
  { company: "Tech Solutions BR", segment: "Tecnologia", before: "R$ 90k/mês", after: "R$ 540k/mês", growth: "+500%", time: "12 meses", color: "#6DC86D" },
];

const TESTIMONIALS = [
  { name: "Carlos Mendes", role: "CEO, Metalúrgica Santos", text: "Estávamos a 2 meses de fechar as portas. O Império Estratégico não só nos salvou como transformou nossa empresa em referência no setor. Resultado em 8 meses foi absurdo.", stars: 5 },
  { name: "Dra. Fernanda Costa", role: "Fundadora, Clínica Vida Plena", text: "Nunca imaginei que marketing pudesse gerar tanto resultado concreto. Triplicamos o número de consultas e hoje temos fila de espera. Investimento que se pagou em 30 dias.", stars: 5 },
  { name: "Roberto Alves", role: "Diretor, Tech Solutions", text: "A reestruturação financeira e o trabalho de branding foram cirúrgicos. Hoje somos reconhecidos no mercado como empresa premium e cobramos 3x mais pelo mesmo serviço.", stars: 5 },
];

const LEADS_DATA = [
  { id: 1, name: "Marcelo Ferreira", email: "marcelo@empresa.com", company: "Ferreira & Cia", revenue: "R$ 120k/mês", problem: "Dívidas acumuladas", status: "new", date: "24/03/2026" },
  { id: 2, name: "Ana Paula Silva", email: "ana@silvatec.com", company: "Silva Tecnologia", revenue: "R$ 80k/mês", problem: "Crescimento estagnado", status: "contact", date: "23/03/2026" },
  { id: 3, name: "João Rodrigues", email: "joao@industrias.com", company: "Indústrias Rodrigues", revenue: "R$ 350k/mês", problem: "Queda nas vendas", status: "closed", date: "22/03/2026" },
  { id: 4, name: "Lucia Mendonça", email: "lucia@clinicamp.com", company: "Clínica Mendonça", revenue: "R$ 60k/mês", problem: "Concorrência forte", status: "new", date: "21/03/2026" },
];

const APPOINTMENTS_DATA = [
  { id: 1, name: "Pedro Santos", company: "Santos Comércio", date: "26/03/2026", time: "10:00", problem: "Reestruturação financeira", status: "pending" },
  { id: 2, name: "Marina Costa", company: "Costa Eventos", date: "27/03/2026", time: "14:00", problem: "Branding e posicionamento", status: "confirmed" },
  { id: 3, name: "Felipe Araújo", company: "Araújo Construções", date: "28/03/2026", time: "09:00", problem: "Gestão de crise", status: "confirmed" },
];

const CHAT_INIT = [
  { from: "admin", text: "Olá! Sou a Ana do Império Estratégico. Como posso ajudá-lo hoje? 👑", time: "agora" }
];

// ─── UTILS ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    menu: "☰", close: "✕", arrow: "→", check: "✓", star: "★",
    chat: "💬", whatsapp: "📱", calendar: "📅", chart: "📊",
    user: "👤", lock: "🔐", settings: "⚙️", eye: "👁",
    send: "➤", plus: "+", edit: "✏️", trash: "🗑",
    crown: "👑", fire: "🔥", bolt: "⚡", shield: "🛡",
    bell: "🔔", logout: "🚪", home: "🏠", list: "📋",
    mail: "📩", phone: "📞", location: "📍",
  };
  return <span style={{ fontSize: size }}>{icons[name] || "•"}</span>;
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Navbar({ setPage, page }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Início", id: "home" },
    { label: "Serviços", id: "services" },
    { label: "Resultados", id: "results" },
    { label: "Agendamento", id: "schedule" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 800,
      background: scrolled ? "rgba(8,8,8,0.97)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(201,168,76,0.15)" : "none",
      transition: "all 0.4s", backdropFilter: scrolled ? "blur(20px)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#9A7B2E,#C9A84C,#E2C97E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            👑
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 3, color: "var(--white)" }}>IMPÉRIO</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: 4, color: "var(--gold)", fontWeight: 600, marginTop: -2 }}>ESTRATÉGICO</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 36 }} className="hide-mobile">
          {links.map(l => (
            <span key={l.id} className="nav-link" onClick={() => { setPage("home"); setTimeout(() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" }), 100); }}>
              {l.label}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-outline hide-mobile" style={{ padding: "10px 20px", fontSize: 12 }} onClick={() => setPage("admin")}>
            Área Admin
          </button>
          <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 12 }} onClick={() => { setPage("home"); setTimeout(() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
            Agendar →
          </button>
          <button className="hide-mobile" style={{ background: "none", border: "none", color: "var(--white)", cursor: "pointer", fontSize: 24, display: "none" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [typed, setTyped] = useState("");
  const words = ["em Máquinas de Lucro", "para o Próximo Nível", "Além da Crise"];
  const [wIdx, setWIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const w = words[wIdx];
    if (!deleting && charIdx < w.length) {
      const t = setTimeout(() => { setTyped(w.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 70);
      return () => clearTimeout(t);
    } else if (!deleting && charIdx === w.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    } else if (deleting && charIdx > 0) {
      const t = setTimeout(() => { setTyped(w.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 40);
      return () => clearTimeout(t);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWIdx(i => (i + 1) % words.length);
    }
  }, [charIdx, deleting, wIdx]);

  return (
    <section id="home" className="noise-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* BG grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(50,80,180,0.06) 0%, transparent 50%)", zIndex: 0 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
          <span className="section-label">Consultoria Empresarial de Elite</span>
          <span className="gold-line" style={{ margin: "12px 0" }} />

          <h1 className="hero-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 9vw, 120px)", lineHeight: 0.95, letterSpacing: 2, maxWidth: 900, marginBottom: 12 }}>
            TRANSFORMAMOS<br />
            <span className="gold-text">EMPRESAS</span><br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.7em", fontWeight: 400, display: "block", lineHeight: 1.2, color: "var(--white-dim)" }}>
              {typed}<span style={{ animation: "blink 1s infinite", color: "var(--gold)" }}>|</span>
            </span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--white-dim)", maxWidth: 540, margin: "28px 0 40px", fontWeight: 300 }}>
            Método exclusivo que combina <strong style={{ color: "var(--white)", fontWeight: 600 }}>reestruturação financeira</strong> e <strong style={{ color: "var(--white)", fontWeight: 600 }}>marketing de alto impacto</strong> para empresas que precisam crescer — ou sobreviver.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-gold" style={{ fontSize: 14 }} onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>
              Agendar Diagnóstico Gratuito →
            </button>
            <button className="btn-outline" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>
              Ver Resultados
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 32, marginTop: 60, flexWrap: "wrap" }}>
            {[{ n: "+230", l: "Empresas Transformadas" }, { n: "R$ 40M+", l: "Em Receita Gerada" }, { n: "8 Anos", l: "De Experiência" }, { n: "97%", l: "Taxa de Sucesso" }].map((s, i) => (
              <div key={i} style={{ animation: `fadeUp ${0.8 + i * 0.1}s ease forwards`, opacity: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--gold)", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "var(--white-dim)", letterSpacing: 1, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s infinite" }}>
        <div style={{ width: 1, height: 50, background: "linear-gradient(transparent, var(--gold))" }} />
        <span style={{ fontSize: 10, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase" }}>ROLE PARA BAIXO</span>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [tab, setTab] = useState("antifalencia");
  return (
    <section id="services" style={{ padding: "100px 24px", background: "var(--black-2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <span className="section-label">O que Fazemos</span>
          <span className="gold-line" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: 2 }}>
            NOSSOS <span className="gold-text">SERVIÇOS</span>
          </h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 48, borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          {[
            { id: "antifalencia", label: "🔴 Consultoria Anti-Falência" },
            { id: "marketing", label: "🔵 Marketing & Branding" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "16px 32px", background: "none", border: "none", color: tab === t.id ? "var(--gold)" : "var(--white-dim)",
              fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: "pointer",
              borderBottom: tab === t.id ? "2px solid var(--gold)" : "2px solid transparent",
              transition: "all 0.3s", marginBottom: -1,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {SERVICES[tab].map((s, i) => (
            <div key={i} className="card-premium" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
              <span className={tab === "antifalencia" ? "tag tag-red" : "tag tag-blue"} style={{ marginBottom: 12 }}>
                {tab === "antifalencia" ? "Anti-Falência" : "Marketing"}
              </span>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 12, marginTop: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--white-dim)", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <button className="btn-gold" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>
            Quero Começar Minha Transformação →
          </button>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { n: "01", title: "Diagnóstico", desc: "Análise completa da situação atual: financeiro, operacional e mercado." },
    { n: "02", title: "Estratégia", desc: "Plano de ação personalizado com metas claras e prazos definidos." },
    { n: "03", title: "Implementação", desc: "Execução das ações com acompanhamento semanal e ajustes em tempo real." },
    { n: "04", title: "Escala", desc: "Resultados consolidados e estratégia de crescimento contínuo." },
  ];
  return (
    <section style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="section-label">Como Funciona</span>
          <span className="gold-line gold-line-center" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: 2 }}>
            O PROCESSO <span className="gold-text">IMPÉRIO</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0, position: "relative" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ padding: "40px 32px", position: "relative", borderRight: i < steps.length - 1 ? "1px solid rgba(201,168,76,0.1)" : "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 80, color: "rgba(201,168,76,0.08)", lineHeight: 1, position: "absolute", top: 20, right: 20 }}>{s.n}</div>
              <div style={{ width: 48, height: 48, border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--gold)" }}>{s.n}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, marginBottom: 12, color: "var(--white)" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--white-dim)", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  return (
    <section id="results" style={{ padding: "100px 24px", background: "var(--black-2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <span className="section-label">Prova Social</span>
          <span className="gold-line" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: 2 }}>
            CASOS DE <span className="gold-text">SUCESSO</span>
          </h2>
        </div>

        {/* Cases */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 80 }}>
          {CASES.map((c, i) => (
            <div key={i} className="card-premium" style={{ position: "relative", overflow: "visible" }}>
              <div style={{ position: "absolute", top: -12, right: 20 }}>
                <span style={{ background: `linear-gradient(135deg, ${c.color}88, ${c.color})`, color: "#000", padding: "4px 16px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                  {c.segment}
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 24, marginTop: 8 }}>{c.company}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ padding: 16, background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.2)" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#FF6B6B", marginBottom: 4 }}>ANTES</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#FF6B6B" }}>{c.before}</div>
                </div>
                <div style={{ padding: 16, background: "rgba(100,200,100,0.08)", border: "1px solid rgba(100,200,100,0.2)" }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#6DC86D", marginBottom: 4 }}>DEPOIS</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#6DC86D" }}>{c.after}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: c.color }}>{c.growth}</div>
                  <div style={{ fontSize: 11, color: "var(--white-dim)", letterSpacing: 1 }}>CRESCIMENTO</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--white)" }}>{c.time}</div>
                  <div style={{ fontSize: 11, color: "var(--white-dim)", letterSpacing: 1 }}>PARA RESULTADO</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ marginTop: 0 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, letterSpacing: 2, marginBottom: 32, textAlign: "center" }}>
            O QUE NOSSOS <span className="gold-text">CLIENTES DIZEM</span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-premium">
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(t.stars)].map((_, j) => <span key={j} style={{ color: "var(--gold)", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: "var(--white-dim)", lineHeight: 1.8, fontStyle: "italic", marginBottom: 20, fontFamily: "var(--font-serif)", fontSize: 17 }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,var(--gold-dark),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--gold)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleSection({ onSchedule }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", revenue: "", problem: "", date: "", time: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.company || !form.email) return alert("Preencha os campos obrigatórios!");
    onSchedule({ ...form, id: Date.now(), status: "pending" });
    setSubmitted(true);
  };

  const times = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  if (submitted) return (
    <section id="schedule" style={{ padding: "100px 24px", background: "var(--black)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: 2, marginBottom: 16 }}>
          AGENDAMENTO <span className="gold-text">CONFIRMADO!</span>
        </h2>
        <p style={{ color: "var(--white-dim)", fontSize: 16, lineHeight: 1.7 }}>
          Recebemos sua solicitação. Nossa equipe entrará em contato em até <strong style={{ color: "var(--gold)" }}>2 horas úteis</strong> para confirmar sua consultoria gratuita.
        </p>
        <button className="btn-gold" style={{ marginTop: 32 }} onClick={() => setSubmitted(false)}>
          Fazer Novo Agendamento
        </button>
      </div>
    </section>
  );

  return (
    <section id="schedule" style={{ padding: "100px 24px", background: "var(--black)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div>
            <span className="section-label">Primeiro Passo</span>
            <span className="gold-line" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", letterSpacing: 2, marginBottom: 20 }}>
              AGENDE SEU<br /><span className="gold-text">DIAGNÓSTICO</span><br />GRATUITO
            </h2>
            <p style={{ color: "var(--white-dim)", lineHeight: 1.8, marginBottom: 32 }}>
              Uma conversa de 60 minutos que pode mudar completamente o destino da sua empresa.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Análise completa da sua situação atual", "Identificação dos principais pontos de perda", "Estratégia personalizada para seu negócio", "Sem custo, sem compromisso"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--gold)", fontSize: 16, marginTop: 2 }}>✓</span>
                  <span style={{ color: "var(--white-dim)", fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--black-3)", border: "1px solid rgba(201,168,76,0.2)", padding: "40px 32px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, marginBottom: 24 }}>FORMULÁRIO DE DIAGNÓSTICO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name", placeholder: "Nome completo *", type: "text" },
                { key: "company", placeholder: "Nome da empresa *", type: "text" },
                { key: "email", placeholder: "E-mail *", type: "email" },
                { key: "phone", placeholder: "WhatsApp", type: "tel" },
                { key: "revenue", placeholder: "Faturamento mensal atual", type: "text" },
              ].map(f => (
                <input key={f.key} className="input-field" type={f.type} placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              ))}
              <select className="input-field" style={{ cursor: "pointer" }} value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))}>
                <option value="">Principal desafio *</option>
                <option value="Dívidas e reestruturação financeira">Dívidas e reestruturação financeira</option>
                <option value="Queda nas vendas">Queda nas vendas</option>
                <option value="Crescimento estagnado">Crescimento estagnado</option>
                <option value="Branding e posicionamento">Branding e posicionamento</option>
                <option value="Gestão de crise">Gestão de crise</option>
                <option value="Marketing digital">Marketing digital</option>
              </select>
              <input className="input-field" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              <select className="input-field" style={{ cursor: "pointer" }} value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                <option value="">Horário preferido</option>
                {times.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 24 }} onClick={handleSubmit}>
              Agendar Diagnóstico Gratuito →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "var(--black-2)", borderTop: "1px solid rgba(201,168,76,0.1)", padding: "60px 24px 30px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#9A7B2E,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👑</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 3 }}>IMPÉRIO</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: 4, color: "var(--gold)", fontWeight: 600, marginTop: -2 }}>ESTRATÉGICO</div>
              </div>
            </div>
            <p style={{ color: "var(--white-dim)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Transformamos empresas em crise em referências de mercado. Especialistas em crescimento e anti-falência.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>SERVIÇOS</h4>
            {["Diagnóstico Gratuito", "Anti-Falência", "Marketing", "Branding", "Tráfego Pago"].map(l => (
              <div key={l} style={{ color: "var(--white-dim)", fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "var(--gold)"} onMouseLeave={e => e.target.style.color = "var(--white-dim)"}>
                {l}
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>EMPRESA</h4>
            {["Sobre Nós", "Casos de Sucesso", "Blog", "Imprensa", "Área Admin"].map(l => (
              <div key={l} style={{ color: "var(--white-dim)", fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "var(--gold)"} onMouseLeave={e => e.target.style.color = "var(--white-dim)"}
                onClick={() => l === "Área Admin" && setPage("admin")}>
                {l}
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>CONTATO</h4>
            {["📞 +55 (11) 99999-0000", "📧 contato@imperioestrat.com", "📍 São Paulo, SP", "⏰ Seg–Sex: 8h–18h"].map(l => (
              <div key={l} style={{ color: "var(--white-dim)", fontSize: 13, marginBottom: 10 }}>{l}</div>
            ))}
          </div>
        </div>
        <div className="divider" style={{ margin: "30px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--white-dim)", flexWrap: "wrap", gap: 10 }}>
          <span>© 2026 Império Estratégico. Todos os direitos reservados.</span>
          <span>CNPJ: 00.000.000/0001-00</span>
        </div>
      </div>
    </footer>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(CHAT_INIT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", set: false });
  const messagesEndRef = useRef(null);

  const autoReplies = [
    "Entendi! Para melhor atendê-lo, pode me contar um pouco mais sobre o seu negócio? 🎯",
    "Que situação desafiadora! Temos ajudado muitas empresas nessa mesma situação. Já atendemos mais de 230 empresas com resultados comprovados.",
    "Perfeito! Posso agendar um diagnóstico gratuito de 60 minutos com nosso especialista. Você tem disponibilidade esta semana?",
    "Ótimo! Vou registrar sua solicitação agora mesmo. Em breve nossa equipe vai entrar em contato pelo WhatsApp. 🚀",
    "Claro! Nosso método exclusivo combina reestruturação financeira + marketing de alto impacto. Resultados em até 60 dias ou devolvemos seu investimento!",
  ];
  let replyIdx = 0;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, time: "agora" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = autoReplies[replyIdx % autoReplies.length];
      replyIdx++;
      setMessages(m => [...m, { from: "admin", text: reply, time: "agora" }]);
    }, 1200);
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">👑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: "#000" }}>Império Estratégico</div>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2ECC71", display: "inline-block" }} />
                Online agora
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#000" }}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>
            ))}
            {typing && (
              <div className="chat-msg admin" style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", display: "inline-block", animation: `blink 1s ${d}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row">
            <input className="chat-input" placeholder="Digite sua mensagem..." value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />
            <button className="chat-send" onClick={sendMsg}>➤</button>
          </div>
        </div>
      )}
      <div className="chat-bubble" onClick={() => setOpen(!open)}>💬</div>
    </div>
  );
}

function WhatsAppBtn() {
  return (
    <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
      style={{ position: "fixed", bottom: 94, right: 24, zIndex: 899, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transition: "transform 0.2s", textDecoration: "none" }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      📱
    </a>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (email === "admin@imperio.com" && pass === "admin123") { onLogin(); }
    else setErr("Credenciais inválidas. Tente admin@imperio.com / admin123");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--black)", padding: 24 }}>
      <div style={{ background: "var(--black-3)", border: "1px solid rgba(201,168,76,0.2)", padding: "48px 40px", width: "100%", maxWidth: 420, animation: "fadeUp 0.5s" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 4 }}>ADMIN</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: 3, color: "var(--gold)", marginTop: 2 }}>IMPÉRIO ESTRATÉGICO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input className="input-field" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input-field" type="password" placeholder="Senha" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {err && <div style={{ color: "#FF6B6B", fontSize: 13, textAlign: "center" }}>{err}</div>}
          <button className="btn-gold" style={{ justifyContent: "center", marginTop: 8 }} onClick={handleLogin}>
            🔐 Entrar no Painel
          </button>
          <div style={{ fontSize: 12, color: "var(--white-dim)", textAlign: "center", marginTop: 8 }}>
            Demo: admin@imperio.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onLogout, appointments, leads }) {
  const [tab, setTab] = useState("dashboard");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Marcelo Ferreira", msgs: [{ from: "user", text: "Olá, preciso de ajuda com minha empresa" }, { from: "admin", text: "Claro! Como posso ajudar?" }], unread: 2 },
    { id: 2, user: "Ana Paula", msgs: [{ from: "user", text: "Gostaria de agendar uma consultoria" }], unread: 1 },
  ]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatReply, setChatReply] = useState("");
  const [localLeads, setLocalLeads] = useState([...LEADS_DATA, ...leads.map(l => ({ id: l.id, name: l.name, email: l.email, company: l.company, revenue: l.revenue, problem: l.problem, status: "new", date: new Date().toLocaleDateString("pt-BR") }))]);
  const [localAppts, setLocalAppts] = useState([...APPOINTMENTS_DATA, ...appointments.map(a => ({ id: a.id, name: a.name, company: a.company, date: a.date, time: a.time, problem: a.problem, status: "pending" }))]);

  const allLeads = localLeads;
  const allAppts = localAppts;

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "leads", icon: "📩", label: "Leads" },
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "appointments", icon: "📅", label: "Agendamentos" },
    { id: "content", icon: "📝", label: "Conteúdo" },
  ];

  const sendReply = () => {
    if (!chatReply.trim() || !activeChat) return;
    setChatMessages(prev => prev.map(c => c.id === activeChat ? { ...c, msgs: [...c.msgs, { from: "admin", text: chatReply }] } : c));
    setChatReply("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex" }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 3 }}>IMPÉRIO</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--gold)", fontWeight: 600 }}>ADMIN PANEL</div>
        </div>
        <div style={{ padding: "12px 0" }}>
          {navItems.map(n => (
            <div key={n.id} className={`admin-nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <span>{n.icon}</span> {n.label}
              {n.id === "chat" && <span style={{ marginLeft: "auto", background: "var(--gold)", color: "#000", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>3</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 0", borderTop: "1px solid rgba(201,168,76,0.1)", marginTop: "auto", position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <div className="admin-nav-item" onClick={onLogout}>
            <span>🚪</span> Sair
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid rgba(201,168,76,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--black-2)" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 3 }}>
            {navItems.find(n => n.id === tab)?.icon} {navItems.find(n => n.id === tab)?.label?.toUpperCase()}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,var(--gold-dark),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Administrador</div>
                <div style={{ fontSize: 11, color: "var(--gold)" }}>Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
                {[
                  { label: "Total de Leads", value: allLeads.length, icon: "📩", color: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
                  { label: "Agendamentos", value: allAppts.length, icon: "📅", color: "#6BA3FF", bg: "rgba(100,150,255,0.1)" },
                  { label: "Chats Ativos", value: chatMessages.length, icon: "💬", color: "#6DC86D", bg: "rgba(100,200,100,0.1)" },
                  { label: "Taxa Conversão", value: "68%", icon: "📈", color: "#FF9F43", bg: "rgba(255,159,67,0.1)" },
                ].map((s, i) => (
                  <div key={i} className="admin-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--white-dim)", letterSpacing: 1, marginBottom: 8 }}>{s.label.toUpperCase()}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: s.color }}>{s.value}</div>
                      </div>
                      <div style={{ width: 44, height: 44, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="admin-card">
                  <h3 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>LEADS POR STATUS</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Novos", count: allLeads.filter(l => l.status === "new").length, color: "#6DC86D", pct: 45 },
                      { label: "Em Contato", count: allLeads.filter(l => l.status === "contact").length, color: "#6BA3FF", pct: 30 },
                      { label: "Fechados", count: allLeads.filter(l => l.status === "closed").length, color: "#C9A84C", pct: 25 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13 }}>{item.label}</span>
                          <span style={{ fontSize: 13, color: item.color, fontWeight: 600 }}>{item.count}</span>
                        </div>
                        <div style={{ height: 6, background: "var(--black-4)", borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 3, transition: "width 1s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="admin-card">
                  <h3 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>AGENDAMENTOS RECENTES</h3>
                  {allAppts.slice(0, 3).map((a, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: "var(--white-dim)" }}>{a.date} às {a.time}</div>
                      </div>
                      <span className={`status-badge ${a.status === "confirmed" ? "status-closed" : "status-new"}`}>
                        {a.status === "confirmed" ? "Confirmado" : "Pendente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEADS */}
          {tab === "leads" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <input className="input-field" style={{ maxWidth: 300 }} placeholder="🔍 Buscar leads..." />
                <select className="input-field" style={{ maxWidth: 160, cursor: "pointer" }}>
                  <option>Todos os status</option>
                  <option>Novos</option>
                  <option>Em Contato</option>
                  <option>Fechados</option>
                </select>
              </div>
              <div className="admin-card">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                      {["Nome", "Empresa", "E-mail", "Faturamento", "Problema", "Status", "Data"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, letterSpacing: 1, color: "var(--gold)", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allLeads.map((l, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{l.name}</td>
                        <td style={{ padding: "12px", fontSize: 13, color: "var(--white-dim)" }}>{l.company}</td>
                        <td style={{ padding: "12px", fontSize: 12, color: "var(--white-dim)" }}>{l.email}</td>
                        <td style={{ padding: "12px", fontSize: 13, color: "var(--gold)" }}>{l.revenue}</td>
                        <td style={{ padding: "12px", fontSize: 12, color: "var(--white-dim)", maxWidth: 180 }}>{l.problem}</td>
                        <td style={{ padding: "12px" }}>
                          <span className={`status-badge status-${l.status}`}>
                            {l.status === "new" ? "Novo" : l.status === "contact" ? "Em Contato" : "Fechado"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontSize: 12, color: "var(--white-dim)" }}>{l.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CHAT */}
          {tab === "chat" && (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, height: "calc(100vh - 200px)" }}>
              <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 16px", borderBottom: "1px solid rgba(201,168,76,0.1)", fontFamily: "var(--font-display)", letterSpacing: 2, fontSize: 14 }}>CONVERSAS</div>
                {chatMessages.map(c => (
                  <div key={c.id} onClick={() => setActiveChat(c.id)}
                    style={{ padding: "14px 16px", borderBottom: "1px solid rgba(201,168,76,0.06)", cursor: "pointer", background: activeChat === c.id ? "rgba(201,168,76,0.08)" : "transparent", transition: "background 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{c.user}</span>
                      {c.unread > 0 && <span style={{ background: "var(--gold)", color: "#000", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{c.unread}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--white-dim)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.msgs[c.msgs.length - 1]?.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-card" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {activeChat ? (
                  <>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(201,168,76,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,var(--gold-dark),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {chatMessages.find(c => c.id === activeChat)?.user[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{chatMessages.find(c => c.id === activeChat)?.user}</div>
                        <div style={{ fontSize: 11, color: "#6DC86D" }}>● Online</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, overflow: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                      {chatMessages.find(c => c.id === activeChat)?.msgs.map((m, i) => (
                        <div key={i} style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.5, alignSelf: m.from === "admin" ? "flex-end" : "flex-start", background: m.from === "admin" ? "linear-gradient(135deg,var(--gold-dark),var(--gold))" : "var(--black-4)", color: m.from === "admin" ? "#000" : "var(--white)", border: m.from !== "admin" ? "1px solid rgba(201,168,76,0.1)" : "none" }}>
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: 16, borderTop: "1px solid rgba(201,168,76,0.1)", display: "flex", gap: 10 }}>
                      <input className="input-field" style={{ flex: 1 }} placeholder="Digite sua resposta..." value={chatReply}
                        onChange={e => setChatReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} />
                      <button className="btn-gold" style={{ padding: "14px 20px" }} onClick={sendReply}>➤</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--white-dim)", flexDirection: "column", gap: 12 }}>
                    <span style={{ fontSize: 48 }}>💬</span>
                    <p>Selecione uma conversa para responder</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPOINTMENTS */}
          {tab === "appointments" && (
            <div>
              <div className="admin-card">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                      {["Cliente", "Empresa", "Data", "Horário", "Problema", "Status", "Ações"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, letterSpacing: 1, color: "var(--gold)", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allAppts.map((a, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{a.name}</td>
                        <td style={{ padding: "12px", fontSize: 13, color: "var(--white-dim)" }}>{a.company}</td>
                        <td style={{ padding: "12px", fontSize: 13, color: "var(--gold)" }}>{a.date}</td>
                        <td style={{ padding: "12px", fontSize: 13 }}>{a.time}</td>
                        <td style={{ padding: "12px", fontSize: 12, color: "var(--white-dim)", maxWidth: 200 }}>{a.problem}</td>
                        <td style={{ padding: "12px" }}>
                          <span className={`status-badge ${a.status === "confirmed" ? "status-closed" : "status-new"}`}>
                            {a.status === "confirmed" ? "Confirmado" : "Pendente"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", display: "flex", gap: 8 }}>
                          <button style={{ padding: "5px 10px", background: "rgba(100,200,100,0.1)", border: "1px solid rgba(100,200,100,0.3)", color: "#6DC86D", cursor: "pointer", fontSize: 11 }}
                            onClick={() => setLocalAppts(prev => prev.map(ap => ap.id === a.id ? { ...ap, status: "confirmed" } : ap))}>
                            ✓ Confirmar
                          </button>
                          <button style={{ padding: "5px 10px", background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", color: "#FF6B6B", cursor: "pointer", fontSize: 11 }}
                            onClick={() => setLocalAppts(prev => prev.filter(ap => ap.id !== a.id))}>
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {tab === "content" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="admin-card">
                <h3 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>EDITAR TEXTOS DO SITE</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: 1, color: "var(--gold)", display: "block", marginBottom: 6 }}>HEADLINE PRINCIPAL</label>
                    <input className="input-field" defaultValue="Transformamos empresas quebradas em máquinas de lucro" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: 1, color: "var(--gold)", display: "block", marginBottom: 6 }}>SUBHEADLINE</label>
                    <textarea className="input-field" rows={3} defaultValue="Método exclusivo que combina reestruturação financeira e marketing de alto impacto..." style={{ resize: "vertical" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: 1, color: "var(--gold)", display: "block", marginBottom: 6 }}>CTA BOTÃO PRINCIPAL</label>
                    <input className="input-field" defaultValue="Agendar Diagnóstico Gratuito" />
                  </div>
                  <button className="btn-gold" style={{ justifyContent: "center" }}>💾 Salvar Alterações</button>
                </div>
              </div>
              <div className="admin-card">
                <h3 style={{ fontFamily: "var(--font-display)", letterSpacing: 2, marginBottom: 20, fontSize: 16 }}>ADICIONAR DEPOIMENTO</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input className="input-field" placeholder="Nome do cliente" />
                  <input className="input-field" placeholder="Cargo / Empresa" />
                  <textarea className="input-field" rows={4} placeholder="Depoimento..." style={{ resize: "vertical" }} />
                  <select className="input-field" style={{ cursor: "pointer" }}>
                    <option>⭐⭐⭐⭐⭐ 5 estrelas</option>
                    <option>⭐⭐⭐⭐ 4 estrelas</option>
                  </select>
                  <button className="btn-gold" style={{ justifyContent: "center" }}>+ Adicionar Depoimento</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [adminLogged, setAdminLogged] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);

  const handleSchedule = (data) => {
    setAppointments(p => [...p, data]);
    setLeads(p => [...p, { ...data, status: "new", date: new Date().toLocaleDateString("pt-BR") }]);
  };

  if (page === "admin") {
    if (!adminLogged) return <AdminLogin onLogin={() => setAdminLogged(true)} />;
    return <AdminPanel onLogout={() => { setAdminLogged(false); setPage("home"); }} appointments={appointments} leads={leads} />;
  }

  return (
    <div>
      <Navbar setPage={setPage} page={page} />
      <HeroSection />
      <ProcessSection />
      <ServicesSection />
      <ResultsSection />
      <ScheduleSection onSchedule={handleSchedule} />
      <Footer setPage={setPage} />
      <ChatWidget />
      <WhatsAppBtn />
    </div>
  );
}
