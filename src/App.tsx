import { useState, useEffect, useRef, useCallback } from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fl);

const gs = document.createElement("style");
gs.textContent = `
  :root{--g:#C9A84C;--gl:#E8D48A;--gd:#8B6914;--b:#060608;--b2:#0C0C10;--b3:#131318;--b4:#1A1A22;--w:#F0EDE6;--wd:rgba(240,237,230,0.55);--red:#E05555;--blue:#5588E0;--green:#55C490;--fd:'Bebas Neue',sans-serif;--fs:'Playfair Display',serif;--fb:'Outfit',sans-serif;}
  *{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}body{background:var(--b);color:var(--w);font-family:var(--fb);overflow-x:hidden;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--b2);}::-webkit-scrollbar-thumb{background:var(--gd);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.5)}70%{box-shadow:0 0 0 12px rgba(201,168,76,0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes scan{0%{top:-5%}100%{top:105%}}
  @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2.2);opacity:0}}
  .fu{animation:fadeUp .6s ease forwards;}
  .gt{background:linear-gradient(135deg,var(--gd),var(--gl),var(--g));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .gl{display:block;width:48px;height:2px;background:linear-gradient(90deg,var(--g),var(--gl));margin:12px 0;}
  .glc{margin:12px auto;}
  .lbl{font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--g);}
  .bg{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;font-family:var(--fb);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:linear-gradient(135deg,var(--gd),var(--g),var(--gl));color:var(--b);border:none;cursor:pointer;transition:all .3s;clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px));}
  .bg:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4);}
  .bo{display:inline-flex;align-items:center;gap:8px;padding:12px 30px;font-family:var(--fb);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:transparent;color:var(--g);border:1px solid var(--g);cursor:pointer;transition:all .3s;}
  .bo:hover{background:rgba(201,168,76,.08);transform:translateY(-2px);}
  .card{background:linear-gradient(145deg,var(--b3),var(--b4));border:1px solid rgba(201,168,76,.12);padding:26px;transition:all .3s;position:relative;overflow:hidden;}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);opacity:0;transition:opacity .3s;}
  .card:hover{border-color:rgba(201,168,76,.32);transform:translateY(-3px);box-shadow:0 14px 44px rgba(0,0,0,.5);}
  .card:hover::before{opacity:1;}
  .inp{width:100%;padding:11px 15px;background:var(--b3);border:1px solid rgba(201,168,76,.2);color:var(--w);font-family:var(--fb);font-size:13px;outline:none;transition:border .3s;}
  .inp:focus{border-color:var(--g);}
  .inp::placeholder{color:rgba(240,237,230,.25);}
  .live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);position:relative;display:inline-block;}
  .live-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--green);animation:ping 1.5s infinite;}
  .toast-wrap{position:fixed;top:74px;right:18px;z-index:2000;display:flex;flex-direction:column;gap:7px;pointer-events:none;}
  .toast{background:var(--b3);border:1px solid rgba(201,168,76,.22);border-left:3px solid var(--g);padding:11px 15px;min-width:260px;animation:slideIn .3s ease;box-shadow:0 8px 28px rgba(0,0,0,.6);}
  .aside{width:218px;min-height:100vh;background:var(--b2);border-right:1px solid rgba(201,168,76,.08);flex-shrink:0;position:relative;}
  .ani{padding:11px 17px;font-size:12px;font-weight:500;letter-spacing:.5px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .2s;color:var(--wd);}
  .ani:hover{background:rgba(201,168,76,.05);color:var(--g);}
  .ani.on{background:rgba(201,168,76,.1);color:var(--g);border-right:2px solid var(--g);}
  .ac{background:var(--b3);border:1px solid rgba(201,168,76,.1);}
  .sb{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
  .sn{background:rgba(85,196,144,.12);color:var(--green);}
  .sc{background:rgba(85,136,224,.12);color:#88AAFF;}
  .sf{background:rgba(201,168,76,.12);color:var(--g);}
  .sh{background:rgba(220,85,85,.12);color:#FF8080;}
  .note-card{background:var(--b4);border:1px solid rgba(201,168,76,.1);padding:13px;transition:all .2s;border-radius:2px;}
  .note-card:hover{border-color:rgba(201,168,76,.28);}
  .cw{position:fixed;bottom:22px;right:22px;z-index:900;}
  .cb{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:pulse 2.5s infinite;font-size:24px;box-shadow:0 4px 18px rgba(0,0,0,.5);transition:transform .2s;}
  .cb:hover{transform:scale(1.1);}
  .cwin{position:absolute;bottom:66px;right:0;width:310px;background:var(--b3);border:1px solid rgba(201,168,76,.2);border-radius:10px;overflow:hidden;box-shadow:0 18px 55px rgba(0,0,0,.7);animation:fadeUp .3s;}
  .ch{background:linear-gradient(135deg,var(--gd),var(--g));padding:13px 17px;display:flex;align-items:center;gap:9px;}
  .cms{height:250px;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:7px;}
  .cm{max-width:78%;padding:8px 12px;font-size:12px;line-height:1.5;}
  .cm.a{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.14);align-self:flex-start;border-radius:0 9px 9px 9px;color:var(--w);}
  .cm.u{background:linear-gradient(135deg,var(--gd),var(--g));color:var(--b);align-self:flex-end;border-radius:9px 9px 0 9px;}
  .cir{display:flex;border-top:1px solid rgba(201,168,76,.08);}
  .ci{flex:1;padding:11px 13px;background:transparent;border:none;color:var(--w);font-family:var(--fb);font-size:12px;outline:none;}
  .cs{padding:11px 15px;background:var(--g);border:none;color:var(--b);cursor:pointer;font-size:15px;transition:background .2s;}
  .cs:hover{background:var(--gl);}
  .empty{padding:48px 20px;text-align:center;border:1px dashed rgba(201,168,76,.14);background:rgba(201,168,76,.01);}
  .empty-icon{font-size:36px;margin-bottom:10px;}
  .empty p{color:var(--wd);font-size:13px;line-height:1.7;}
  .trow{border-bottom:1px solid rgba(255,255,255,.03);transition:background .2s;}
  .trow:hover{background:rgba(201,168,76,.025)!important;}
  @media(max-width:768px){.hm{display:none!important;}.aside{width:180px;}}
`;
document.head.appendChild(gs);

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const KEYS = { leads: "ie_leads", appts: "ie_appts", chats: "ie_chats", msgs: "ie_msgs" };

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useVisitors() {
  const [v, setV] = useState(1);
  useEffect(() => { const i = setInterval(() => setV(n => Math.max(1, n + Math.floor(Math.random() * 5) - 2)), 5000); return () => clearInterval(i); }, []);
  return v;
}

function useStorage(key, def) {
  const [state, setState] = useState(() => LS.get(key, def));
  const set = useCallback((val) => {
    setState(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      LS.set(key, next);
      return next;
    });
  }, [key]);
  // Poll for cross-tab updates every 1s
  useEffect(() => {
    const i = setInterval(() => {
      const fresh = LS.get(key, def);
      setState(prev => JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev);
    }, 1000);
    return () => clearInterval(i);
  }, [key]);
  return [state, set];
}

// ─── TOASTS ───────────────────────────────────────────────────────────────────
function Toasts({ items }) {
  return (
    <div className="toast-wrap">
      {items.map(t => (
        <div key={t.id} className="toast">
          <div style={{ fontSize: 12, color: "var(--w)", lineHeight: 1.4 }}>{t.msg}</div>
          <div style={{ fontSize: 10, color: "var(--wd)", marginTop: 3, letterSpacing: 1 }}>AGORA</div>
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const ref = useRef(0);
  const add = useCallback((msg) => {
    const id = ++ref.current;
    setToasts(p => [...p, { id, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return [toasts, add];
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ setPage, visitors }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = id => { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80); };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 800, background: scrolled ? "rgba(6,6,8,.97)" : "transparent", borderBottom: scrolled ? "1px solid rgba(201,168,76,.1)" : "none", transition: "all .4s", backdropFilter: scrolled ? "blur(20px)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8D48A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👑</div>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 17, letterSpacing: 3 }}>IMPÉRIO</div>
            <div style={{ fontSize: 7, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 30 }} className="hm">
          {[["Início","home"],["Serviços","services"],["Resultados","results"],["Agendamento","schedule"]].map(([l,id]) => (
            <span key={id} onClick={() => go(id)} style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--wd)", cursor: "pointer", transition: "color .3s" }}
              onMouseEnter={e => e.target.style.color = "var(--g)"} onMouseLeave={e => e.target.style.color = "var(--wd)"}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 11px", background: "rgba(85,196,144,.07)", border: "1px solid rgba(85,196,144,.2)", fontSize: 10, color: "var(--green)" }} className="hm">
            <span className="live-dot" /> {visitors} online
          </div>
          <button className="bo hm" style={{ padding: "7px 14px", fontSize: 10 }} onClick={() => setPage("admin")}>Admin</button>
          <button className="bg" style={{ padding: "7px 14px", fontSize: 10 }} onClick={() => go("schedule")}>Agendar →</button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ visitors }) {
  const [typed, setTyped] = useState(""); const words = ["em Máquinas de Lucro","para o Próximo Nível","Além da Crise"];
  const [wi,setWi]=useState(0);const [ci,setCi]=useState(0);const [del,setDel]=useState(false);
  useEffect(()=>{const w=words[wi];if(!del&&ci<w.length){const t=setTimeout(()=>{setTyped(w.slice(0,ci+1));setCi(c=>c+1);},65);return()=>clearTimeout(t);}if(!del&&ci===w.length){const t=setTimeout(()=>setDel(true),2400);return()=>clearTimeout(t);}if(del&&ci>0){const t=setTimeout(()=>{setTyped(w.slice(0,ci-1));setCi(c=>c-1);},35);return()=>clearTimeout(t);}if(del&&ci===0){setDel(false);setWi(i=>(i+1)%words.length);}
  },[ci,del,wi]);
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.03) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 50%,rgba(201,168,76,.07) 0%,transparent 55%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent)", animation: "scan 8s linear infinite" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "108px 22px 76px", position: "relative", zIndex: 1, width: "100%" }}>
        <div className="fu">
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "rgba(85,196,144,.08)", border: "1px solid rgba(85,196,144,.2)", fontSize: 10, color: "var(--green)", fontWeight: 600, letterSpacing: 1 }}>
              <span className="live-dot" /> {visitors} pessoas visitando agora
            </div>
          </div>
          <span className="lbl">Consultoria Empresarial de Elite</span>
          <span className="gl" style={{ margin: "9px 0 14px" }} />
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(50px,8vw,104px)", lineHeight: .93, letterSpacing: 2, maxWidth: 900 }}>
            TRANSFORMAMOS<br /><span className="gt">EMPRESAS</span><br />
            <span style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontSize: ".63em", fontWeight: 400, color: "var(--wd)", lineHeight: 1.3, display: "block" }}>
              {typed}<span style={{ animation: "blink 1s infinite", color: "var(--g)" }}>|</span>
            </span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--wd)", maxWidth: 490, margin: "24px 0 34px", fontWeight: 300 }}>
            Método exclusivo que combina <strong style={{ color: "var(--w)", fontWeight: 600 }}>reestruturação financeira</strong> e <strong style={{ color: "var(--w)", fontWeight: 600 }}>marketing de alto impacto</strong>.
          </p>
          <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
            <button className="bg" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>Agendar Diagnóstico Gratuito →</button>
            <button className="bo" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>Ver Resultados</button>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, animation: "float 2.5s infinite" }}>
        <div style={{ width: 1, height: 38, background: "linear-gradient(transparent,var(--g))" }} />
        <span style={{ fontSize: 8, letterSpacing: 3, color: "var(--g)", textTransform: "uppercase" }}>scroll</span>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────
function Process() {
  return (
    <section style={{ padding: "86px 22px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="lbl">Metodologia</span><span className="gl glc" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,4vw,48px)", letterSpacing: 2 }}>O PROCESSO <span className="gt">IMPÉRIO</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
          {[["01","Diagnóstico","Análise profunda: financeiro, operacional e mercado."],["02","Estratégia","Plano personalizado com metas e prazos definidos."],["03","Execução","Implementação com acompanhamento semanal."],["04","Escala","Crescimento contínuo e sustentável."]].map(([n,t,d],i) => (
            <div key={i} style={{ padding: "32px 24px", position: "relative", borderRight: i<3?"1px solid rgba(201,168,76,.07)":"none" }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: 80, color: "rgba(201,168,76,.04)", lineHeight: 1, position: "absolute", top: 12, right: 12 }}>{n}</div>
              <div style={{ width: 40, height: 40, border: "1px solid var(--g)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--fd)", fontSize: 16, color: "var(--g)" }}>{n}</span>
              </div>
              <h3 style={{ fontFamily: "var(--fd)", fontSize: 20, letterSpacing: 2, marginBottom: 8 }}>{t}</h3>
              <p style={{ fontSize: 13, color: "var(--wd)", lineHeight: 1.7 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services() {
  const [tab, setTab] = useState("af");
  const data = { af: [["🔍","Diagnóstico Empresarial","Mapeamento completo de todas as áreas críticas da empresa."],["💰","Reestruturação Financeira","Reorganização do fluxo de caixa e negociação de dívidas."],["📈","Estratégias de Crescimento","Plano com potencial de receita mapeado e metas claras."],["⚡","Gestão de Crise","Atuação imediata: proteção de ativos e blindagem financeira."]], mk:[["👑","Branding Premium","Identidade que comunica autoridade e gera desejo."],["🎯","Posicionamento Digital","Presença certa nos canais para ser encontrado por quem compra."],["📱","Redes Sociais","Conteúdo que educa, engaja e converte."],["🚀","Tráfego Pago","Campanhas com ROI mensurável no Google, Meta e LinkedIn."],["✍️","Copywriting","Textos que vendem: landing pages, emails e anúncios."]] };
  return (
    <section id="services" style={{ padding: "86px 22px", background: "var(--b2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}><span className="lbl">Soluções</span><span className="gl" /><h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,4vw,52px)", letterSpacing: 2 }}>NOSSOS <span className="gt">SERVIÇOS</span></h2></div>
        <div style={{ display: "flex", marginBottom: 32, borderBottom: "1px solid rgba(201,168,76,.1)" }}>
          {[["af","🔴 Anti-Falência"],["mk","🔵 Marketing"]].map(([id,l]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "12px 24px", background: "none", border: "none", color: tab===id?"var(--g)":"var(--wd)", fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, letterSpacing: 1, cursor: "pointer", borderBottom: tab===id?"2px solid var(--g)":"2px solid transparent", transition: "all .3s", marginBottom: -1 }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {data[tab].map(([ic,t,d],i) => (
            <div key={i} className="card"><div style={{ fontSize: 28, marginBottom: 11 }}>{ic}</div><h3 style={{ fontFamily: "var(--fs)", fontSize: 18, fontWeight: 700, margin: "0 0 9px" }}>{t}</h3><p style={{ fontSize: 13, color: "var(--wd)", lineHeight: 1.7 }}>{d}</p></div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}><button className="bg" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>Quero Minha Transformação →</button></div>
      </div>
    </section>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function Results() {
  return (
    <section id="results" style={{ padding: "86px 22px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}><span className="lbl">Prova Social</span><span className="gl" /><h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,4vw,52px)", letterSpacing: 2 }}>CASOS DE <span className="gt">SUCESSO</span></h2></div>
        <div className="empty"><div className="empty-icon">📊</div><p>Seus cases de sucesso e depoimentos aparecerão aqui.<br />Adicione-os pelo painel administrativo.</p></div>
      </div>
    </section>
  );
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
function Schedule({ onSchedule }) {
  const [form, setForm] = useState({ name:"",company:"",email:"",phone:"",revenue:"",problem:"",date:"",time:"" });
  const [done, setDone] = useState(false);
  const set = (k,v) => setForm(p => ({ ...p, [k]: v }));
  const submit = () => {
    if (!form.name||!form.email||!form.company||!form.problem) { alert("Preencha os campos obrigatórios (*)"); return; }
    onSchedule({ ...form, id: Date.now(), status: "pending", createdAt: new Date().toLocaleString("pt-BR") });
    setDone(true);
  };
  if (done) return (
    <section id="schedule" style={{ padding: "86px 22px", textAlign: "center" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", animation: "fadeUp .5s" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: 38, letterSpacing: 2, marginBottom: 11 }}>AGENDADO <span className="gt">COM SUCESSO!</span></h2>
        <p style={{ color: "var(--wd)", lineHeight: 1.7, fontSize: 13 }}>Nossa equipe entrará em contato em breve.</p>
        <button className="bg" style={{ marginTop: 22 }} onClick={() => { setDone(false); setForm({ name:"",company:"",email:"",phone:"",revenue:"",problem:"",date:"",time:"" }); }}>Novo Agendamento</button>
      </div>
    </section>
  );
  return (
    <section id="schedule" style={{ padding: "86px 22px", background: "var(--b2)" }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <span className="lbl">Primeiro Passo</span><span className="gl" />
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: 2, marginBottom: 14 }}>DIAGNÓSTICO<br /><span className="gt">GRATUITO</span></h2>
            <p style={{ color: "var(--wd)", lineHeight: 1.8, marginBottom: 22, fontSize: 13 }}>60 minutos que podem mudar o destino da sua empresa.</p>
            {["Análise completa da situação atual","Identificação dos pontos de perda","Plano de ação personalizado","Sem custo, sem compromisso"].map((it,i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span style={{ color: "var(--g)", marginTop: 2, fontSize: 12 }}>✓</span>
                <span style={{ color: "var(--wd)", fontSize: 13 }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.14)", padding: "30px 24px" }}>
            <h3 style={{ fontFamily: "var(--fd)", fontSize: 19, letterSpacing: 2, marginBottom: 17 }}>FORMULÁRIO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["name","Nome completo *","text"],["company","Empresa *","text"],["email","E-mail *","email"],["phone","WhatsApp","tel"],["revenue","Faturamento mensal","text"]].map(([k,ph,t]) => (
                <input key={k} className="inp" type={t} placeholder={ph} value={form[k]} onChange={e => set(k,e.target.value)} />
              ))}
              <select className="inp" style={{ cursor: "pointer" }} value={form.problem} onChange={e => set("problem",e.target.value)}>
                <option value="">Principal desafio *</option>
                {["Dívidas e reestruturação","Queda nas vendas","Crescimento estagnado","Branding e posicionamento","Gestão de crise","Marketing digital","Outro"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <input className="inp" type="date" value={form.date} onChange={e => set("date",e.target.value)} />
                <select className="inp" style={{ cursor: "pointer" }} value={form.time} onChange={e => set("time",e.target.value)}>
                  <option value="">Horário</option>
                  {["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button className="bg" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={submit}>Agendar Agora →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "var(--b2)", borderTop: "1px solid rgba(201,168,76,.07)", padding: "50px 22px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 28, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 11 }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👑</div>
              <div><div style={{ fontFamily: "var(--fd)", fontSize: 16, letterSpacing: 3 }}>IMPÉRIO</div><div style={{ fontSize: 7, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div></div>
            </div>
            <p style={{ color: "var(--wd)", fontSize: 12, lineHeight: 1.7, maxWidth: 230 }}>Consultoria empresarial e marketing estratégico para empresas que querem crescer.</p>
          </div>
          {[["SERVIÇOS",["Diagnóstico","Anti-Falência","Marketing","Branding"]],["EMPRESA",["Sobre Nós","Cases","Blog","Área Admin"]],["CONTATO",["📞 Seu telefone","📧 Seu e-mail","📍 Sua cidade"]]].map(([h,items]) => (
            <div key={h}>
              <h4 style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 13, fontSize: 12 }}>{h}</h4>
              {items.map(l => <div key={l} onClick={() => l==="Área Admin"&&setPage("admin")} style={{ color: "var(--wd)", fontSize: 12, marginBottom: 7, cursor: "pointer", transition: "color .2s" }} onMouseEnter={e=>e.target.style.color="var(--g)"} onMouseLeave={e=>e.target.style.color="var(--wd)"}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,.16),transparent)", margin: "0 0 18px" }} />
        <div style={{ fontSize: 11, color: "var(--wd)" }}>© {new Date().getFullYear()} Império Estratégico. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}

// ─── CHAT WIDGET (público) ────────────────────────────────────────────────────
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useStorage(KEYS.chats, []);
  const [name, setName] = useState(""); const [identified, setIdentified] = useState(false);
  const [inp, setInp] = useState(""); const ref = useRef(null);
  const [myConvId, setMyConvId] = useState(null);

  const myConv = chats.find(c => c.id === myConvId);

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [myConv?.msgs?.length]);

  const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const identify = () => {
    if (!name.trim()) return;
    const id = Date.now();
    const conv = { id, user: name.trim(), avatar: name[0].toUpperCase(), online: true, unread: 0, msgs: [{ from: "admin", text: `Olá, ${name.trim()}! 👑 Bem-vindo ao Império Estratégico. Como podemos ajudar?`, time: now() }] };
    setChats(p => [conv, ...p]);
    setMyConvId(id);
    setIdentified(true);
  };

  const send = () => {
    if (!inp.trim() || !myConvId) return;
    const msg = { from: "user", text: inp.trim(), time: now() };
    setChats(p => p.map(c => c.id === myConvId ? { ...c, unread: c.unread + 1, msgs: [...c.msgs, msg] } : c));
    setInp("");
  };

  // Poll for admin replies
  useEffect(() => {
    if (!myConvId) return;
    const i = setInterval(() => {
      const fresh = LS.get(KEYS.chats, []);
      const conv = fresh.find(c => c.id === myConvId);
      if (conv) setChats(fresh);
    }, 800);
    return () => clearInterval(i);
  }, [myConvId]);

  return (
    <div className="cw">
      {open && (
        <div className="cwin">
          <div className="ch">
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#000" }}>Império Estratégico</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,.6)", display: "flex", gap: 3, alignItems: "center" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2ECC71", display: "inline-block" }} /> Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#000" }}>✕</button>
          </div>
          {!identified ? (
            <div style={{ padding: 17, display: "flex", flexDirection: "column", gap: 9 }}>
              <p style={{ fontSize: 12, color: "var(--wd)", lineHeight: 1.6 }}>Antes de começar, como podemos te chamar?</p>
              <input className="inp" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter"&&identify()} />
              <button className="bg" style={{ justifyContent: "center", padding: "9px" }} onClick={identify}>Iniciar conversa →</button>
            </div>
          ) : (
            <>
              <div className="cms">
                {myConv?.msgs.map((m,i) => (
                  <div key={i} className={`cm ${m.from==="admin"?"a":"u"}`}>
                    {m.text}
                    <div style={{ fontSize: 9, opacity: .5, marginTop: 2, textAlign: m.from==="admin"?"left":"right" }}>{m.time}</div>
                  </div>
                ))}
                <div ref={ref} />
              </div>
              <div className="cir">
                <input className="ci" placeholder="Sua mensagem..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()} />
                <button className="cs" onClick={send}>➤</button>
              </div>
            </>
          )}
        </div>
      )}
      <div className="cb" onClick={() => setOpen(!open)}>💬</div>
    </div>
  );
}

// ─── NOTES MODAL ──────────────────────────────────────────────────────────────
function NotesModal({ client, onClose, onSave }) {
  const [notes, setNotes] = useState(client.notes || []);
  const [text, setText] = useState(""); const [color, setColor] = useState("#C9A84C");
  const colors = ["#C9A84C","#5588E0","#55C490","#E05555","#9B59B6","#E67E22"];
  const add = () => {
    if (!text.trim()) return;
    const n = { id: Date.now(), text, color, date: new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}), author: "Admin" };
    const upd = [n,...notes]; setNotes(upd); onSave(client.id, upd); setText("");
  };
  const del = id => { const upd = notes.filter(n=>n.id!==id); setNotes(upd); onSave(client.id, upd); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, animation: "fadeIn .2s" }}>
      <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.2)", maxWidth: 540, width: "100%", maxHeight: "87vh", overflow: "auto", animation: "fadeUp .3s" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(201,168,76,.09)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontFamily: "var(--fd)", fontSize: 17, letterSpacing: 2 }}>ANOTAÇÕES</div><div style={{ fontSize: 11, color: "var(--g)", marginTop: 1 }}>{client.name} · {client.company||"—"}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--wd)", cursor: "pointer", fontSize: 17 }}>✕</button>
        </div>
        <div style={{ padding: "11px 20px", background: "rgba(201,168,76,.03)", borderBottom: "1px solid rgba(201,168,76,.06)", display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[["📧",client.email],["📞",client.phone||"—"],["💰",client.revenue||"—"],["⚠️",client.problem||"—"]].map(([ic,v])=>(
            <div key={ic} style={{ display: "flex", gap: 4, alignItems: "center" }}><span style={{ fontSize: 11 }}>{ic}</span><span style={{ fontSize: 11, color: "var(--wd)" }}>{v}</span></div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(201,168,76,.06)" }}>
          <textarea className="inp" rows={3} placeholder="Escreva sua anotação..." value={text} onChange={e=>setText(e.target.value)} style={{ resize: "vertical", marginBottom: 9 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "var(--wd)" }}>Cor:</span>
              {colors.map(c=><div key={c} onClick={()=>setColor(c)} style={{ width: 16, height: 16, borderRadius: "50%", background: c, cursor: "pointer", border: color===c?"2px solid var(--w)":"2px solid transparent", transition: "border .2s" }}/>)}
            </div>
            <button className="bg" style={{ padding: "7px 16px", fontSize: 11 }} onClick={add}>+ Salvar</button>
          </div>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 9 }}>
          {notes.length===0&&<div style={{ color: "var(--wd)", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Nenhuma anotação ainda. 📝</div>}
          {notes.map(n=>(
            <div key={n.id} className="note-card" style={{ borderLeft: `3px solid ${n.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: n.color, display: "inline-block" }}/>
                  <span style={{ fontSize: 10, color: "var(--wd)" }}>{n.date}</span>
                  <span style={{ fontSize: 10, color: n.color, fontWeight: 600 }}>· {n.author}</span>
                </div>
                <button onClick={()=>del(n.id)} style={{ background: "none", border: "none", color: "var(--wd)", cursor: "pointer", fontSize: 11, opacity: .55 }}>🗑</button>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65 }}>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [e,setE]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");
  const try_=()=>{if(e==="admin@imperio.com"&&p==="admin123")onLogin();else setErr("Credenciais inválidas");};
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--b)", padding: 22 }}>
      <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.2)", padding: "40px 32px", width: "100%", maxWidth: 370, animation: "fadeUp .5s" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 7 }}>👑</div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 22, letterSpacing: 4 }}>ADMIN PANEL</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "var(--g)", fontWeight: 700, marginTop: 2 }}>IMPÉRIO ESTRATÉGICO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="inp" type="email" placeholder="E-mail" value={e} onChange={ev=>setE(ev.target.value)}/>
          <input className="inp" type="password" placeholder="Senha" value={p} onChange={ev=>setP(ev.target.value)} onKeyDown={ev=>ev.key==="Enter"&&try_()}/>
          {err&&<div style={{ color: "#FF8080", fontSize: 12, textAlign: "center" }}>{err}</div>}
          <button className="bg" style={{ justifyContent: "center", marginTop: 3 }} onClick={try_}>🔐 Entrar</button>
          <div style={{ fontSize: 10, color: "var(--wd)", textAlign: "center" }}>admin@imperio.com · admin123</div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onLogout, visitors }) {
  const [tab, setTab] = useState("dashboard");
  const [leads, setLeads] = useStorage(KEYS.leads, []);
  const [appts, setAppts] = useStorage(KEYS.appts, []);
  const [chats, setChats] = useStorage(KEYS.chats, []);
  const [notesClient, setNotesClient] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats, activeConv]);

  const totalUnread = chats.reduce((a,c) => a + (c.unread||0), 0);
  const newLeads = leads.filter(l => l.status==="new"||!l.status).length;

  const saveNotes = (cid, notes) => {
    setLeads(p => p.map(l => l.id===cid ? {...l,notes} : l));
  };

  const sendReply = () => {
    if (!reply.trim()||!activeConv) return;
    const msg = { from: "admin", text: reply.trim(), time: new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) };
    setChats(p => p.map(c => c.id===activeConv ? {...c, unread:0, msgs:[...c.msgs, msg]} : c));
    setReply("");
  };

  const filtered = leads.filter(l =>
    (l.name||"").toLowerCase().includes(search.toLowerCase()) ||
    (l.company||"").toLowerCase().includes(search.toLowerCase())
  );

  const nav = [
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"leads",icon:"📩",label:"Leads",badge:newLeads},
    {id:"chat",icon:"💬",label:"Chat",badge:totalUnread},
    {id:"appointments",icon:"📅",label:"Agendamentos"},
    {id:"content",icon:"📝",label:"Conteúdo"},
    {id:"live",icon:"📡",label:"Tempo Real"},
  ];

  const Th = ({children}) => <th style={{ padding:"9px 13px",textAlign:"left",fontSize:9,letterSpacing:1,color:"var(--g)",textTransform:"uppercase",whiteSpace:"nowrap",background:"rgba(201,168,76,.02)",borderBottom:"1px solid rgba(201,168,76,.09)" }}>{children}</th>;
  const Td = ({children,style={}}) => <td style={{ padding:"10px 13px",fontSize:12,...style }}>{children}</td>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--b)", display: "flex" }}>
      {notesClient && <NotesModal client={notesClient} onClose={()=>setNotesClient(null)} onSave={saveNotes}/>}

      {/* Sidebar */}
      <div className="aside">
        <div style={{ padding: "17px 15px", borderBottom: "1px solid rgba(201,168,76,.07)" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 14, letterSpacing: 3 }}>IMPÉRIO</div>
          <div style={{ fontSize: 7, letterSpacing: 3, color: "var(--g)", fontWeight: 700 }}>ADMIN PANEL</div>
        </div>
        <div style={{ margin: "9px", padding: "6px 10px", background: "rgba(85,196,144,.06)", border: "1px solid rgba(85,196,144,.14)", display: "flex", gap: 5, alignItems: "center" }}>
          <span className="live-dot"/><span style={{ fontSize: 10, color: "var(--green)" }}>{visitors} online</span>
        </div>
        <div style={{ paddingTop: 4 }}>
          {nav.map(n=>(
            <div key={n.id} className={`ani ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
              <span>{n.icon}</span>{n.label}
              {n.badge>0&&<span style={{ marginLeft:"auto",background:"var(--g)",color:"#000",borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700 }}>{n.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(201,168,76,.07)" }}>
          <div className="ani" onClick={onLogout}><span>🚪</span>Sair</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", maxHeight: "100vh" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(201,168,76,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--b2)", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: 18, letterSpacing: 3 }}>{nav.find(n=>n.id===tab)?.icon} {nav.find(n=>n.id===tab)?.label?.toUpperCase()}</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>A</div>
            <div><div style={{ fontSize: 11, fontWeight: 600 }}>Administrador</div><div style={{ fontSize: 9, color: "var(--g)" }}>Super Admin</div></div>
          </div>
        </div>

        <div style={{ padding: 20 }}>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 13, marginBottom: 20 }}>
                {[
                  {l:"Leads",v:leads.length,i:"📩",c:"#C9A84C"},
                  {l:"Agendamentos",v:appts.length,i:"📅",c:"#5588E0"},
                  {l:"Conversas",v:chats.length,i:"💬",c:"#55C490"},
                  {l:"Online Agora",v:visitors,i:"👥",c:"#E05555"},
                ].map((s,i)=>(
                  <div key={i} className="ac" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontSize: 9, color: "var(--wd)", letterSpacing: 1, marginBottom: 4 }}>{s.l.toUpperCase()}</div><div style={{ fontFamily: "var(--fd)", fontSize: 38, color: s.c, lineHeight: 1 }}>{s.v}</div></div>
                    <div style={{ fontSize: 22, opacity: .45 }}>{s.i}</div>
                  </div>
                ))}
              </div>

              {leads.length===0&&appts.length===0&&chats.length===0 ? (
                <div className="empty"><div className="empty-icon">🚀</div><p>Painel zerado e pronto para uso real.<br/>Os dados aparecerão aqui quando clientes interagirem com o site.</p></div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {leads.length>0&&(
                    <div className="ac" style={{ padding: 18 }}>
                      <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 13, fontSize: 12 }}>ÚLTIMOS LEADS</div>
                      {leads.slice(0,6).map((l,i)=>(
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(201,168,76,.05)" }}>
                          <div><div style={{ fontSize: 12, fontWeight: 600 }}>{l.name}</div><div style={{ fontSize: 10, color: "var(--wd)" }}>{l.company}</div></div>
                          <span className="sb sn">novo</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {appts.length>0&&(
                    <div className="ac" style={{ padding: 18 }}>
                      <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 13, fontSize: 12 }}>AGENDAMENTOS RECENTES</div>
                      {appts.slice(0,6).map((a,i)=>(
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(201,168,76,.05)" }}>
                          <div><div style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</div><div style={{ fontSize: 10, color: "var(--wd)" }}>{a.date||"—"} {a.time||""}</div></div>
                          <span className={`sb ${a.status==="confirmed"?"sf":"sn"}`}>{a.status==="confirmed"?"Confirmado":"Pendente"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── LEADS ── */}
          {tab==="leads" && (
            <div>
              <div style={{ display: "flex", gap: 9, marginBottom: 16 }}>
                <input className="inp" style={{ maxWidth: 240 }} placeholder="🔍 Buscar nome ou empresa..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              {filtered.length===0 ? (
                <div className="empty"><div className="empty-icon">📩</div><p>Nenhum lead ainda.<br/>Quando alguém preencher o formulário de agendamento, aparecerá aqui.</p></div>
              ) : (
                <div className="ac" style={{ overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
                    <thead><tr>{["Cliente","Empresa","Contato","Faturamento","Desafio","Status","Notas",""].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                    <tbody>
                      {filtered.map((l,i)=>(
                        <tr key={i} className="trow">
                          <Td><div style={{ fontWeight: 600 }}>{l.name}</div><div style={{ fontSize: 10, color: "var(--wd)", marginTop: 1 }}>{l.email}</div></Td>
                          <Td style={{ color: "var(--wd)" }}>{l.company}</Td>
                          <Td style={{ color: "var(--wd)", fontSize: 11 }}>{l.phone||"—"}</Td>
                          <Td style={{ color: "var(--g)", fontWeight: 600 }}>{l.revenue||"—"}</Td>
                          <Td style={{ color: "var(--wd)", maxWidth: 150 }}>{l.problem}</Td>
                          <Td>
                            <select value={l.status||"new"} onChange={e=>setLeads(p=>p.map(x=>x.id===l.id?{...x,status:e.target.value}:x))} style={{ background:"var(--b4)",color:"var(--w)",border:"1px solid rgba(201,168,76,.18)",padding:"3px 7px",fontSize:10,cursor:"pointer",outline:"none" }}>
                              <option value="new">Novo</option><option value="hot">Quente 🔥</option><option value="contact">Em Contato</option><option value="closed">Fechado ✓</option>
                            </select>
                          </Td>
                          <Td>
                            <button onClick={()=>setNotesClient({...l,notes:l.notes||[]})} style={{ padding:"4px 10px",background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",color:"var(--g)",cursor:"pointer",fontSize:10,borderRadius:2,whiteSpace:"nowrap" }}>
                              📝 {(l.notes||[]).length} nota{(l.notes||[]).length!==1?"s":""}
                            </button>
                          </Td>
                          <Td><button onClick={()=>setLeads(p=>p.filter(x=>x.id!==l.id))} style={{ padding:"4px 8px",background:"rgba(220,85,85,.08)",border:"1px solid rgba(220,85,85,.2)",color:"#FF8080",cursor:"pointer",fontSize:10,borderRadius:2 }}>🗑</button></Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CHAT ── */}
          {tab==="chat" && (
            <div style={{ display: "grid", gridTemplateColumns: "245px 1fr", gap: 14, height: "calc(100vh - 170px)" }}>
              <div className="ac" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(201,168,76,.08)", fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 11, flexShrink: 0 }}>CONVERSAS</div>
                <div style={{ overflow: "auto", flex: 1 }}>
                  {chats.length===0&&<div style={{ padding: "28px 14px", textAlign: "center", color: "var(--wd)", fontSize: 12 }}><div style={{ fontSize: 26, marginBottom: 7 }}>💬</div>Aguardando mensagens...</div>}
                  {chats.map(c=>(
                    <div key={c.id} onClick={()=>{setActiveConv(c.id);setChats(p=>p.map(x=>x.id===c.id?{...x,unread:0}:x));}}
                      style={{ padding:"11px 14px",borderBottom:"1px solid rgba(201,168,76,.04)",cursor:"pointer",background:activeConv===c.id?"rgba(201,168,76,.07)":"transparent",transition:"background .2s" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                        <div style={{ display:"flex",gap:7,alignItems:"center" }}>
                          <div style={{ width:27,height:27,borderRadius:"50%",background:"linear-gradient(135deg,var(--gd),var(--g))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0 }}>{c.avatar}</div>
                          <div><div style={{ fontSize:12,fontWeight:600 }}>{c.user}</div><div style={{ fontSize:9,color:"var(--green)" }}>● online</div></div>
                        </div>
                        {c.unread>0&&<span style={{ background:"var(--g)",color:"#000",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700 }}>{c.unread}</span>}
                      </div>
                      <div style={{ fontSize:10,color:"var(--wd)",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingLeft:34 }}>
                        {c.msgs[c.msgs.length-1]?.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ac" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {!activeConv ? (
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:9,color:"var(--wd)" }}>
                    <span style={{ fontSize:38 }}>💬</span><p style={{ fontSize:13 }}>Selecione uma conversa para responder</p>
                  </div>
                ) : (()=>{
                  const conv = chats.find(c=>c.id===activeConv);
                  return <>
                    <div style={{ padding:"12px 16px",borderBottom:"1px solid rgba(201,168,76,.08)",display:"flex",alignItems:"center",gap:9,flexShrink:0 }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,var(--gd),var(--g))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12 }}>{conv?.avatar}</div>
                      <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:13 }}>{conv?.user}</div><div style={{ fontSize:9,color:"var(--green)" }}>● Online</div></div>
                      <button onClick={()=>setNotesClient(leads.find(l=>l.name===conv?.user)||{id:conv?.id,name:conv?.user||"",company:"",email:"",phone:"",revenue:"",problem:"",notes:[]})}
                        style={{ padding:"4px 11px",background:"rgba(201,168,76,.07)",border:"1px solid rgba(201,168,76,.2)",color:"var(--g)",cursor:"pointer",fontSize:10,borderRadius:2 }}>📝 Notas</button>
                    </div>
                    <div style={{ flex:1,overflow:"auto",padding:14,display:"flex",flexDirection:"column",gap:7 }}>
                      {conv?.msgs.map((m,i)=>(
                        <div key={i} style={{ maxWidth:"68%",padding:"8px 12px",fontSize:12,lineHeight:1.5,alignSelf:m.from==="admin"?"flex-end":"flex-start",background:m.from==="admin"?"linear-gradient(135deg,var(--gd),var(--g))":"var(--b4)",color:m.from==="admin"?"#000":"var(--w)",border:m.from!=="admin"?"1px solid rgba(201,168,76,.08)":"none",borderRadius:m.from==="admin"?"9px 9px 0 9px":"0 9px 9px 9px" }}>
                          {m.text}<div style={{ fontSize:9,opacity:.5,marginTop:2,textAlign:m.from==="admin"?"right":"left" }}>{m.time}</div>
                        </div>
                      ))}
                      <div ref={chatEndRef}/>
                    </div>
                    <div style={{ padding:12,borderTop:"1px solid rgba(201,168,76,.07)",display:"flex",gap:8,flexShrink:0 }}>
                      <input className="inp" style={{ flex:1 }} placeholder="Digite sua resposta e pressione Enter..." value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()}/>
                      <button className="bg" style={{ padding:"10px 15px",fontSize:13 }} onClick={sendReply}>➤</button>
                    </div>
                  </>;
                })()}
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS ── */}
          {tab==="appointments" && (
            appts.length===0 ? (
              <div className="empty"><div className="empty-icon">📅</div><p>Nenhum agendamento ainda.<br/>Aparecerão aqui quando clientes usarem o formulário do site.</p></div>
            ) : (
              <div className="ac" style={{ overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
                  <thead><tr>{["Cliente","Empresa","E-mail","Data","Hora","Desafio","Faturamento","Status","Ações"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {appts.map((a,i)=>(
                      <tr key={i} className="trow">
                        <Td><div style={{ fontWeight:600 }}>{a.name}</div></Td>
                        <Td style={{ color:"var(--wd)" }}>{a.company}</Td>
                        <Td style={{ color:"var(--wd)",fontSize:11 }}>{a.email}</Td>
                        <Td style={{ color:"var(--g)",fontWeight:600 }}>{a.date||"—"}</Td>
                        <Td>{a.time||"—"}</Td>
                        <Td style={{ color:"var(--wd)",maxWidth:150 }}>{a.problem}</Td>
                        <Td style={{ color:"var(--g)" }}>{a.revenue||"—"}</Td>
                        <Td><span className={`sb ${a.status==="confirmed"?"sf":"sn"}`}>{a.status==="confirmed"?"Confirmado":"Pendente"}</span></Td>
                        <Td>
                          <div style={{ display:"flex",gap:5 }}>
                            <button onClick={()=>setAppts(p=>p.map(x=>x.id===a.id?{...x,status:"confirmed"}:x))} style={{ padding:"3px 9px",background:"rgba(85,196,144,.08)",border:"1px solid rgba(85,196,144,.2)",color:"#88DDAA",cursor:"pointer",fontSize:10,borderRadius:2 }}>✓</button>
                            <button onClick={()=>setAppts(p=>p.filter(x=>x.id!==a.id))} style={{ padding:"3px 7px",background:"rgba(220,85,85,.08)",border:"1px solid rgba(220,85,85,.2)",color:"#FF8080",cursor:"pointer",fontSize:10,borderRadius:2 }}>🗑</button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── CONTENT ── */}
          {tab==="content" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="ac" style={{ padding: 20 }}>
                <div style={{ fontFamily:"var(--fd)",letterSpacing:2,marginBottom:15,fontSize:12 }}>TEXTOS DO SITE</div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {[["HEADLINE","Transformamos empresas quebradas em máquinas de lucro"],["SUBHEADLINE","Método exclusivo de reestruturação financeira e marketing"],["BOTÃO CTA","Agendar Diagnóstico Gratuito"]].map(([l,v])=>(
                    <div key={l}><label style={{ fontSize:9,letterSpacing:1,color:"var(--g)",display:"block",marginBottom:4 }}>{l}</label>
                    {l==="SUBHEADLINE"?<textarea className="inp" rows={2} defaultValue={v} style={{resize:"vertical"}}/>:<input className="inp" defaultValue={v}/>}</div>
                  ))}
                  <button className="bg" style={{ justifyContent:"center" }}>💾 Salvar Textos</button>
                </div>
              </div>
              <div className="ac" style={{ padding: 20 }}>
                <div style={{ fontFamily:"var(--fd)",letterSpacing:2,marginBottom:15,fontSize:12 }}>NOVO DEPOIMENTO</div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  <input className="inp" placeholder="Nome do cliente"/>
                  <input className="inp" placeholder="Cargo e empresa"/>
                  <textarea className="inp" rows={3} placeholder="Depoimento..." style={{resize:"vertical"}}/>
                  <select className="inp" style={{cursor:"pointer"}}><option>★★★★★ 5 estrelas</option><option>★★★★ 4 estrelas</option></select>
                  <button className="bg" style={{ justifyContent:"center" }}>+ Adicionar</button>
                </div>
              </div>
            </div>
          )}

          {/* ── LIVE ── */}
          {tab==="live" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="ac" style={{ padding: 20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:14 }}>
                  <span className="live-dot"/><div style={{ fontFamily:"var(--fd)",letterSpacing:2,fontSize:12 }}>VISITANTES AGORA</div>
                </div>
                <div style={{ fontFamily:"var(--fd)",fontSize:76,color:"var(--green)",marginBottom:3,lineHeight:1 }}>{visitors}</div>
                <div style={{ fontSize:10,color:"var(--wd)",letterSpacing:1,marginBottom:20 }}>PESSOAS NO SITE AGORA</div>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  {[["🏠 Página Inicial",Math.floor(visitors*.44)],["💼 Serviços",Math.floor(visitors*.22)],["📊 Resultados",Math.floor(visitors*.18)],["📅 Agendamento",Math.floor(visitors*.16)]].map(([pg,n])=>(
                    <div key={pg} style={{ display:"flex",justifyContent:"space-between",padding:"6px 10px",background:"var(--b4)",borderLeft:"2px solid var(--g)" }}>
                      <span style={{ fontSize:12 }}>{pg}</span><span style={{ fontSize:12,color:"var(--g)",fontWeight:600 }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ac" style={{ padding: 20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:14 }}>
                  <span className="live-dot"/><div style={{ fontFamily:"var(--fd)",letterSpacing:2,fontSize:12 }}>ATIVIDADE RECENTE</div>
                </div>
                {leads.length===0&&appts.length===0&&chats.length===0?(
                  <div style={{ padding:"28px 0",textAlign:"center",color:"var(--wd)",fontSize:12 }}><div style={{ fontSize:28,marginBottom:7 }}>📡</div>Nenhuma atividade ainda.</div>
                ):[
                  ...leads.slice(0,3).map(l=>({icon:"📩",text:`Novo lead: ${l.name} (${l.company})`,time:l.createdAt||"—"})),
                  ...appts.slice(0,3).map(a=>({icon:"📅",text:`Agendamento: ${a.name} — ${a.date||"sem data"} ${a.time||""}`,time:a.createdAt||"—"})),
                  ...chats.slice(0,2).map(c=>({icon:"💬",text:`Chat: ${c.user} (${c.msgs.length} msg)`,time:"—"})),
                ].sort(()=>-1).slice(0,7).map((ev,i)=>(
                  <div key={i} style={{ display:"flex",gap:9,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.05)" }}>
                    <span style={{ fontSize:14 }}>{ev.icon}</span>
                    <div><div style={{ fontSize:12 }}>{ev.text}</div><div style={{ fontSize:10,color:"var(--wd)",marginTop:2 }}>{ev.time}</div></div>
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [adminLogged, setAdminLogged] = useState(false);
  const [toasts, addToast] = useToasts();
  const visitors = useVisitors();
  const [, setLeads] = useStorage(KEYS.leads, []);
  const [, setAppts] = useStorage(KEYS.appts, []);

  const handleSchedule = (data) => {
    setLeads(p => [...p, { ...data, notes: [], status: "new" }]);
    setAppts(p => [...p, data]);
    addToast(`📅 Novo agendamento: ${data.name} — ${data.company}`);
  };

  if (page === "admin") {
    if (!adminLogged) return <AdminLogin onLogin={() => setAdminLogged(true)} />;
    return <AdminPanel onLogout={() => { setAdminLogged(false); setPage("home"); }} visitors={visitors} />;
  }

  return (
    <div>
      <Toasts items={toasts} />
      <Navbar setPage={setPage} visitors={visitors} />
      <Hero visitors={visitors} />
      <Process />
      <Services />
      <Results />
      <Schedule onSchedule={handleSchedule} />
      <Footer setPage={setPage} />
      <ChatWidget />
      <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed",bottom:88,right:22,zIndex:899,width:48,height:48,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 16px rgba(37,211,102,.4)",transition:"transform .2s",textDecoration:"none" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>📱</a>
    </div>
  );
}


