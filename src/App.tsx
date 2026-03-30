import { useState, useEffect, useRef, useCallback } from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fl);

const gs = document.createElement("style");
gs.textContent = `
  :root{--g:#C9A84C;--gl:#E8D48A;--gd:#8B6914;--b:#060608;--b2:#0C0C10;--b3:#131318;--b4:#1A1A22;--w:#F0EDE6;--wd:rgba(240,237,230,0.55);--green:#55C490;--fd:'Bebas Neue',sans-serif;--fs:'Playfair Display',serif;--fb:'Outfit',sans-serif;}
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
  .empty{padding:48px 20px;text-align:center;border:1px dashed rgba(201,168,76,.14);background:rgba(201,168,76,.01);}
  .empty-icon{font-size:36px;margin-bottom:10px;}
  .empty p{color:var(--wd);font-size:13px;line-height:1.7;}
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
  .cs{padding:11px 15px;background:var(--g);border:none;color:var(--b);cursor:pointer;font-size:15px;}
  .cs:hover{background:var(--gl);}
  @media(max-width:768px){.hm{display:none!important;}}
`;
document.head.appendChild(gs);

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const LS = {
  get: (k: string, def: any) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const KEYS = { leads: "ie_leads", appts: "ie_appts", chats: "ie_chats" };

function useVisitors() {
  const [v, setV] = useState(1);
  useEffect(() => { const i = setInterval(() => setV(n => Math.max(1, n + Math.floor(Math.random() * 5) - 2)), 5000); return () => clearInterval(i); }, []);
  return v;
}

function useToasts() {
  const [toasts, setToasts] = useState<any[]>([]);
  const ref = useRef(0);
  const add = useCallback((msg: string) => {
    const id = ++ref.current;
    setToasts(p => [...p, { id, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return [toasts, add] as const;
}

// ─── TOASTS ───────────────────────────────────────────────────────────────────
function Toasts({ items }: { items: any[] }) {
  return (
    <div className="toast-wrap">
      {items.map(t => (
        <div key={t.id} className="toast">
          <div style={{ fontSize: 12, color: "var(--w)", lineHeight: 1.4 }}>{t.msg}</div>
          <div style={{ fontSize: 10, color: "var(--wd)", marginTop: 3 }}>AGORA</div>
        </div>
      ))}
    </div>
  );
}

// ─── NAVBAR (sem botão de admin) ──────────────────────────────────────────────
function Navbar({ visitors, setSection }: { visitors: number; setSection: (s: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = (id: string) => { setSection(id); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 800, background: scrolled ? "rgba(6,6,8,.97)" : "transparent", borderBottom: scrolled ? "1px solid rgba(201,168,76,.1)" : "none", transition: "all .4s", backdropFilter: scrolled ? "blur(20px)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }} onClick={() => go("home")}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8D48A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👑</div>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 17, letterSpacing: 3 }}>IMPÉRIO</div>
            <div style={{ fontSize: 7, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 30 }} className="hm">
          {[["Início","home"],["Serviços","services"],["Resultados","results"],["Agendamento","schedule"]].map(([l, id]) => (
            <span key={id} onClick={() => go(id)} style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--wd)", cursor: "pointer", transition: "color .3s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--g)"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--wd)"}>{l}</span>
          ))}
        </div>

        {/* Visitors + CTA */}
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 11px", background: "rgba(85,196,144,.07)", border: "1px solid rgba(85,196,144,.2)", fontSize: 10, color: "var(--green)" }} className="hm">
            <span className="live-dot" /> {visitors} online
          </div>
          <button className="bg" style={{ padding: "7px 14px", fontSize: 10 }} onClick={() => go("schedule")}>Agendar →</button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ visitors }: { visitors: number }) {
  const [typed, setTyped] = useState("");
  const words = ["em Máquinas de Lucro", "para o Próximo Nível", "Além da Crise"];
  const [wi, setWi] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    if (!del && ci < w.length) { const t = setTimeout(() => { setTyped(w.slice(0, ci + 1)); setCi(c => c + 1); }, 65); return () => clearTimeout(t); }
    if (!del && ci === w.length) { const t = setTimeout(() => setDel(true), 2400); return () => clearTimeout(t); }
    if (del && ci > 0) { const t = setTimeout(() => { setTyped(w.slice(0, ci - 1)); setCi(c => c - 1); }, 35); return () => clearTimeout(t); }
    if (del && ci === 0) { setDel(false); setWi(i => (i + 1) % words.length); }
  }, [ci, del, wi]);

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
          <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
            {[{n:"+230",l:"Empresas"},{n:"R$40M+",l:"Receita Gerada"},{n:"8 Anos",l:"Experiência"},{n:"97%",l:"Sucesso"}].map((s,i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--fd)", fontSize: 36, color: "var(--g)", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
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
            <div key={i} style={{ padding: "32px 24px", position: "relative", borderRight: i < 3 ? "1px solid rgba(201,168,76,.07)" : "none" }}>
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
  const data: Record<string, [string,string,string][]> = {
    af: [["🔍","Diagnóstico Empresarial","Mapeamento completo de todas as áreas críticas da empresa."],["💰","Reestruturação Financeira","Reorganização do fluxo de caixa e negociação de dívidas."],["📈","Estratégias de Crescimento","Plano com potencial de receita mapeado e metas claras."],["⚡","Gestão de Crise","Atuação imediata: proteção de ativos e blindagem financeira."]],
    mk: [["👑","Branding Premium","Identidade que comunica autoridade e gera desejo."],["🎯","Posicionamento Digital","Presença certa nos canais para ser encontrado por quem compra."],["📱","Redes Sociais","Conteúdo que educa, engaja e converte seguidores em clientes."],["🚀","Tráfego Pago","Campanhas com ROI mensurável no Google, Meta e LinkedIn."],["✍️","Copywriting","Textos que vendem: landing pages, emails e anúncios."]]
  };
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
        <div className="empty"><div className="empty-icon">📊</div><p>Seus cases de sucesso aparecerão aqui.</p></div>
      </div>
    </section>
  );
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
function Schedule({ onSchedule }: { onSchedule: (data: any) => void }) {
  const [form, setForm] = useState({ name:"",company:"",email:"",phone:"",revenue:"",problem:"",date:"",time:"" });
  const [done, setDone] = useState(false);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

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
                <input key={k} className="inp" type={t} placeholder={ph} value={(form as any)[k]} onChange={e => set(k,e.target.value)} />
              ))}
              <select className="inp" style={{ cursor:"pointer" }} value={form.problem} onChange={e => set("problem",e.target.value)}>
                <option value="">Principal desafio *</option>
                {["Dívidas e reestruturação","Queda nas vendas","Crescimento estagnado","Branding e posicionamento","Gestão de crise","Marketing digital","Outro"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <input className="inp" type="date" value={form.date} onChange={e => set("date",e.target.value)} />
                <select className="inp" style={{ cursor:"pointer" }} value={form.time} onChange={e => set("time",e.target.value)}>
                  <option value="">Horário</option>
                  {["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button className="bg" style={{ width:"100%", justifyContent:"center", marginTop:16 }} onClick={submit}>Agendar Agora →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "var(--b2)", borderTop: "1px solid rgba(201,168,76,.07)", padding: "50px 22px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 28, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 11 }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👑</div>
              <div><div style={{ fontFamily: "var(--fd)", fontSize: 16, letterSpacing: 3 }}>IMPÉRIO</div><div style={{ fontSize: 7, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div></div>
            </div>
            <p style={{ color: "var(--wd)", fontSize: 12, lineHeight: 1.7, maxWidth: 230 }}>Consultoria empresarial e marketing estratégico.</p>
          </div>
          {[["SERVIÇOS",["Diagnóstico","Anti-Falência","Marketing","Branding"]],["EMPRESA",["Sobre Nós","Cases","Blog"]],["CONTATO",["📞 Seu telefone","📧 Seu e-mail","📍 Sua cidade"]]].map(([h,items]) => (
            <div key={h as string}><h4 style={{ fontFamily:"var(--fd)",letterSpacing:2,marginBottom:13,fontSize:12 }}>{h}</h4>
            {(items as string[]).map(l=><div key={l} style={{ color:"var(--wd)",fontSize:12,marginBottom:7 }}>{l}</div>)}</div>
          ))}
        </div>
        <div style={{ width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.16),transparent)",margin:"0 0 18px" }}/>
        <div style={{ fontSize:11,color:"var(--wd)" }}>© {new Date().getFullYear()} Império Estratégico.</div>
      </div>
    </footer>
  );
}

// ─── CHAT WIDGET ──────────────────────────────────────────────────────────────
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [identified, setIdentified] = useState(false);
  const [inp, setInp] = useState(""); const [myConvId, setMyConvId] = useState<number|null>(null);
  const [localChats, setLocalChats] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const myConv = localChats.find(c => c.id === myConvId);
  const now = () => new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

  // Poll localStorage for admin replies
  useEffect(() => {
    if (!myConvId) return;
    const i = setInterval(() => {
      const all = LS.get(KEYS.chats, []);
      setLocalChats(all);
    }, 800);
    return () => clearInterval(i);
  }, [myConvId]);

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [myConv?.msgs?.length]);

  const identify = () => {
    if (!name.trim()) return;
    const id = Date.now();
    const conv = { id, user: name.trim(), avatar: name.trim()[0].toUpperCase(), online: true, unread: 0, msgs: [{ from:"admin", text:`Olá, ${name.trim()}! 👑 Seja bem-vindo ao Império Estratégico. Como podemos ajudar?`, time:now() }] };
    const all = LS.get(KEYS.chats, []);
    const updated = [conv, ...all];
    LS.set(KEYS.chats, updated);
    setLocalChats(updated);
    setMyConvId(id);
    setIdentified(true);
  };

  const send = () => {
    if (!inp.trim()||!myConvId) return;
    const msg = { from:"user", text:inp.trim(), time:now() };
    const all = LS.get(KEYS.chats, []);
    const updated = all.map((c: any) => c.id===myConvId ? {...c, unread:c.unread+1, msgs:[...c.msgs,msg]} : c);
    LS.set(KEYS.chats, updated);
    setLocalChats(updated);
    setInp("");
  };

  return (
    <div className="cw">
      {open && (
        <div className="cwin">
          <div className="ch">
            <div style={{ width:34,height:34,borderRadius:"50%",background:"var(--b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>👑</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,fontSize:13,color:"#000" }}>Império Estratégico</div>
              <div style={{ fontSize:10,color:"rgba(0,0,0,.6)",display:"flex",gap:3,alignItems:"center" }}><span style={{ width:5,height:5,borderRadius:"50%",background:"#2ECC71",display:"inline-block" }}/> Online</div>
            </div>
            <button onClick={()=>setOpen(false)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#000" }}>✕</button>
          </div>
          {!identified ? (
            <div style={{ padding:17,display:"flex",flexDirection:"column",gap:9 }}>
              <p style={{ fontSize:12,color:"var(--wd)",lineHeight:1.6 }}>Antes de começar, como podemos te chamar?</p>
              <input className="inp" placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&identify()}/>
              <button className="bg" style={{ justifyContent:"center",padding:"9px" }} onClick={identify}>Iniciar conversa →</button>
            </div>
          ) : (
            <>
              <div className="cms">
                {myConv?.msgs.map((m: any,i: number) => (
                  <div key={i} className={`cm ${m.from==="admin"?"a":"u"}`}>
                    {m.text}
                    <div style={{ fontSize:9,opacity:.5,marginTop:2,textAlign:m.from==="admin"?"left":"right" }}>{m.time}</div>
                  </div>
                ))}
                <div ref={ref}/>
              </div>
              <div className="cir">
                <input className="ci" placeholder="Sua mensagem..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
                <button className="cs" onClick={send}>➤</button>
              </div>
            </>
          )}
        </div>
      )}
      <div className="cb" onClick={()=>setOpen(!open)}>💬</div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [, setSection] = useState("home");
  const [toasts, addToast] = useToasts();
  const visitors = useVisitors();

  const handleSchedule = (data: any) => {
    // Save lead
    const leads = LS.get(KEYS.leads, []);
    LS.set(KEYS.leads, [...leads, { ...data, notes: [], status: "new" }]);
    // Save appointment
    const appts = LS.get(KEYS.appts, []);
    LS.set(KEYS.appts, [...appts, data]);
    addToast(`📅 Agendamento enviado! Entraremos em contato em breve.`);
  };

  return (
    <div>
      <Toasts items={toasts} />
      <Navbar visitors={visitors} setSection={setSection} />
      <Hero visitors={visitors} />
      <Process />
      <Services />
      <Results />
      <Schedule onSchedule={handleSchedule} />
      <Footer />
      <ChatWidget />
      <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed",bottom:88,right:22,zIndex:899,width:48,height:48,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 16px rgba(37,211,102,.4)",transition:"transform .2s",textDecoration:"none" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>📱</a>
    </div>
  );
}
