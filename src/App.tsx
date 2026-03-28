import { useState, useEffect, useRef, useCallback } from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fl);

const gs = document.createElement("style");
gs.textContent = `
  :root {
    --g:#C9A84C;--gl:#E8D48A;--gd:#8B6914;
    --b:#060608;--b2:#0C0C10;--b3:#131318;--b4:#1A1A22;
    --w:#F0EDE6;--wd:rgba(240,237,230,0.55);--wd2:rgba(240,237,230,0.12);
    --red:#E05555;--blue:#5588E0;--green:#55C490;
    --fd:'Bebas Neue',sans-serif;--fs:'Playfair Display',serif;--fb:'Outfit',sans-serif;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:var(--b);color:var(--w);font-family:var(--fb);overflow-x:hidden;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--b2);}::-webkit-scrollbar-thumb{background:var(--gd);}

  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.5)}70%{box-shadow:0 0 0 14px rgba(201,168,76,0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes scan{0%{top:-5%}100%{top:105%}}
  @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(201,168,76,.3)}50%{text-shadow:0 0 40px rgba(201,168,76,.7)}}
  @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2.2);opacity:0}}

  .fu{animation:fadeUp .6s ease forwards;}
  .fi{animation:fadeIn .4s ease forwards;}
  .gt{background:linear-gradient(135deg,var(--gd),var(--gl),var(--g));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .gl{display:block;width:48px;height:2px;background:linear-gradient(90deg,var(--g),var(--gl));margin:12px 0;}
  .glc{margin:12px auto;}
  .lbl{font-family:var(--fb);font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--g);}

  .bg{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;font-family:var(--fb);font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:linear-gradient(135deg,var(--gd),var(--g),var(--gl));color:var(--b);border:none;cursor:pointer;transition:all .3s;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));position:relative;overflow:hidden;}
  .bg:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,.4);}
  .bo{display:inline-flex;align-items:center;gap:8px;padding:13px 31px;font-family:var(--fb);font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:transparent;color:var(--g);border:1px solid var(--g);cursor:pointer;transition:all .3s;}
  .bo:hover{background:rgba(201,168,76,.08);transform:translateY(-2px);}

  .card{background:linear-gradient(145deg,var(--b3),var(--b4));border:1px solid rgba(201,168,76,.12);padding:28px;transition:all .3s;position:relative;overflow:hidden;}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);opacity:0;transition:opacity .3s;}
  .card:hover{border-color:rgba(201,168,76,.35);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.5);}
  .card:hover::before{opacity:1;}

  .inp{width:100%;padding:12px 16px;background:var(--b3);border:1px solid rgba(201,168,76,.2);color:var(--w);font-family:var(--fb);font-size:13px;outline:none;transition:border .3s;}
  .inp:focus{border-color:var(--g);}
  .inp::placeholder{color:rgba(240,237,230,.25);}

  .live-dot{width:8px;height:8px;border-radius:50%;background:var(--green);position:relative;display:inline-block;}
  .live-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--green);animation:ping 1.5s infinite;}

  .toast-wrap{position:fixed;top:78px;right:20px;z-index:2000;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
  .toast{background:var(--b3);border:1px solid rgba(201,168,76,.25);border-left:3px solid var(--g);padding:12px 16px;min-width:270px;animation:slideIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.6);}

  .aside{width:220px;min-height:100vh;background:var(--b2);border-right:1px solid rgba(201,168,76,.08);flex-shrink:0;}
  .ani{padding:12px 18px;font-size:12px;font-weight:500;letter-spacing:.5px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .2s;color:var(--wd);}
  .ani:hover{background:rgba(201,168,76,.05);color:var(--g);}
  .ani.on{background:rgba(201,168,76,.1);color:var(--g);border-right:2px solid var(--g);}
  .ac{background:var(--b3);border:1px solid rgba(201,168,76,.1);padding:20px;}

  .sb{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
  .sn{background:rgba(85,196,144,.12);color:var(--green);}
  .sc{background:rgba(85,136,224,.12);color:#88AAFF;}
  .sf{background:rgba(201,168,76,.12);color:var(--g);}
  .sh{background:rgba(220,85,85,.12);color:#FF8080;}

  .note-card{background:var(--b4);border:1px solid rgba(201,168,76,.1);padding:14px;transition:all .2s;border-radius:2px;}
  .note-card:hover{border-color:rgba(201,168,76,.3);}

  /* Chat widget público */
  .cw{position:fixed;bottom:24px;right:24px;z-index:900;}
  .cb{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:pulse 2.5s infinite;font-size:26px;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:transform .2s;}
  .cb:hover{transform:scale(1.1);}
  .cwin{position:absolute;bottom:68px;right:0;width:320px;background:var(--b3);border:1px solid rgba(201,168,76,.2);border-radius:10px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7);animation:fadeUp .3s;}
  .ch{background:linear-gradient(135deg,var(--gd),var(--g));padding:14px 18px;display:flex;align-items:center;gap:10px;}
  .cms{height:260px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;}
  .cm{max-width:78%;padding:9px 13px;font-size:12px;line-height:1.5;}
  .cm.a{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.15);align-self:flex-start;border-radius:0 10px 10px 10px;color:var(--w);}
  .cm.u{background:linear-gradient(135deg,var(--gd),var(--g));color:var(--b);align-self:flex-end;border-radius:10px 10px 0 10px;}
  .cir{display:flex;border-top:1px solid rgba(201,168,76,.08);}
  .ci{flex:1;padding:12px 14px;background:transparent;border:none;color:var(--w);font-family:var(--fb);font-size:12px;outline:none;}
  .cs{padding:12px 16px;background:var(--g);border:none;color:var(--b);cursor:pointer;font-size:16px;transition:background .2s;}
  .cs:hover{background:var(--gl);}

  .sr{opacity:0;transform:translateY(18px);transition:opacity .6s,transform .6s;}
  .sr.vis{opacity:1;transform:translateY(0);}

  @media(max-width:768px){.hm{display:none!important;}.aside{width:180px;}}
`;
document.head.appendChild(gs);

// ─── VISITOR COUNT ────────────────────────────────────────────────────────────
function useVisitors() {
  const [v, setV] = useState(1);
  useEffect(() => {
    const i = setInterval(() => setV(n => Math.max(1, n + Math.floor(Math.random() * 5) - 2)), 5000);
    return () => clearInterval(i);
  }, []);
  return v;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.1 });
    document.querySelectorAll(".sr").forEach(el => o.observe(el));
    return () => o.disconnect();
  });
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ setPage, visitors }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id) => { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80); };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 800, background: scrolled ? "rgba(6,6,8,.97)" : "transparent", borderBottom: scrolled ? "1px solid rgba(201,168,76,.1)" : "none", transition: "all .4s", backdropFilter: scrolled ? "blur(20px)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8D48A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👑</div>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 18, letterSpacing: 3 }}>IMPÉRIO</div>
            <div style={{ fontSize: 8, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }} className="hm">
          {[["Início","home"],["Serviços","services"],["Resultados","results"],["Agendamento","schedule"]].map(([l,id]) => (
            <span key={id} onClick={() => go(id)} style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--wd)", cursor: "pointer", transition: "color .3s" }}
              onMouseEnter={e => e.target.style.color="var(--g)"} onMouseLeave={e => e.target.style.color="var(--wd)"}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(85,196,144,.08)", border: "1px solid rgba(85,196,144,.2)", fontSize: 11, color: "var(--green)" }} className="hm">
            <span className="live-dot" /> {visitors} online
          </div>
          <button className="bo hm" style={{ padding: "8px 16px", fontSize: 11 }} onClick={() => setPage("admin")}>Admin</button>
          <button className="bg" style={{ padding: "8px 16px", fontSize: 11 }} onClick={() => go("schedule")}>Agendar →</button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ visitors }) {
  const [typed, setTyped] = useState("");
  const words = ["em Máquinas de Lucro", "para o Próximo Nível", "Além da Crise"];
  const [wi, setWi] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    if (!del && ci < w.length) { const t = setTimeout(() => { setTyped(w.slice(0,ci+1)); setCi(c=>c+1); }, 65); return ()=>clearTimeout(t); }
    if (!del && ci === w.length) { const t = setTimeout(() => setDel(true), 2400); return ()=>clearTimeout(t); }
    if (del && ci > 0) { const t = setTimeout(() => { setTyped(w.slice(0,ci-1)); setCi(c=>c-1); }, 35); return ()=>clearTimeout(t); }
    if (del && ci === 0) { setDel(false); setWi(i=>(i+1)%words.length); }
  }, [ci, del, wi]);

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.03) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 50%,rgba(201,168,76,.07) 0%,transparent 55%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,168,76,.25),transparent)", animation: "scan 8s linear infinite" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "110px 24px 80px", position: "relative", zIndex: 1, width: "100%" }}>
        <div className="fu">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 13px", background: "rgba(85,196,144,.08)", border: "1px solid rgba(85,196,144,.22)", fontSize: 11, color: "var(--green)", fontWeight: 600, letterSpacing: 1 }}>
              <span className="live-dot" /> {visitors} pessoas visitando agora
            </div>
          </div>
          <span className="lbl">Consultoria Empresarial de Elite</span>
          <span className="gl" style={{ margin: "10px 0 16px" }} />
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(52px,8.5vw,108px)", lineHeight: .94, letterSpacing: 2, maxWidth: 920 }}>
            TRANSFORMAMOS<br />
            <span className="gt">EMPRESAS</span><br />
            <span style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontSize: ".64em", fontWeight: 400, color: "var(--wd)", lineHeight: 1.3, display: "block" }}>
              {typed}<span style={{ animation: "blink 1s infinite", color: "var(--g)" }}>|</span>
            </span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--wd)", maxWidth: 500, margin: "26px 0 38px", fontWeight: 300 }}>
            Método exclusivo que combina <strong style={{ color: "var(--w)", fontWeight: 600 }}>reestruturação financeira</strong> e <strong style={{ color: "var(--w)", fontWeight: 600 }}>marketing de alto impacto</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="bg" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>Agendar Diagnóstico Gratuito →</button>
            <button className="bo" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>Ver Resultados</button>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, animation: "float 2.5s infinite" }}>
        <div style={{ width: 1, height: 40, background: "linear-gradient(transparent,var(--g))" }} />
        <span style={{ fontSize: 9, letterSpacing: 3, color: "var(--g)", textTransform: "uppercase" }}>scroll</span>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────
function Process() {
  useReveal();
  return (
    <section style={{ padding: "90px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }} className="sr">
          <span className="lbl">Metodologia</span><span className="gl glc" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(30px,4.5vw,50px)", letterSpacing: 2 }}>O PROCESSO <span className="gt">IMPÉRIO</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {[["01","Diagnóstico","Análise profunda: financeiro, operacional e mercado."],["02","Estratégia","Plano personalizado com metas e prazos definidos."],["03","Execução","Implementação com acompanhamento semanal."],["04","Escala","Crescimento contínuo e sustentável."]].map(([n,t,d],i) => (
            <div key={i} className="sr" style={{ padding: "34px 26px", borderRight: i<3?"1px solid rgba(201,168,76,.07)":"none", transitionDelay: `${i*.1}s` }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: 80, color: "rgba(201,168,76,.04)", lineHeight: 1, position: "absolute", top: 14, right: 14 }}>{n}</div>
              <div style={{ width: 42, height: 42, border: "1px solid var(--g)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: "var(--fd)", fontSize: 17, color: "var(--g)" }}>{n}</span>
              </div>
              <h3 style={{ fontFamily: "var(--fd)", fontSize: 21, letterSpacing: 2, marginBottom: 9 }}>{t}</h3>
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
  const data = {
    af: [["🔍","Diagnóstico Empresarial","Mapeamento completo de todas as áreas críticas da sua empresa."],["💰","Reestruturação Financeira","Reorganização do fluxo de caixa e negociação de dívidas."],["📈","Estratégias de Crescimento","Plano baseado em dados reais com potencial de receita mapeado."],["⚡","Gestão de Crise","Atuação imediata: proteção de ativos e blindagem financeira."]],
    mk: [["👑","Branding Premium","Identidade de marca que comunica autoridade e gera desejo."],["🎯","Posicionamento Digital","Presença nos canais certos para ser encontrado por quem compra."],["📱","Gestão de Redes Sociais","Conteúdo que educa, engaja e converte seguidores em clientes."],["🚀","Tráfego Pago","Campanhas de alta performance com ROI mensurável."],["✍️","Copywriting Persuasivo","Textos que vendem: landing pages, emails e anúncios."]]
  };
  return (
    <section id="services" style={{ padding: "90px 24px", background: "var(--b2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="sr" style={{ marginBottom: 44 }}>
          <span className="lbl">Soluções</span><span className="gl" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: 2 }}>NOSSOS <span className="gt">SERVIÇOS</span></h2>
        </div>
        <div style={{ display: "flex", marginBottom: 36, borderBottom: "1px solid rgba(201,168,76,.1)" }}>
          {[["af","🔴 Anti-Falência"],["mk","🔵 Marketing"]].map(([id,l]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "13px 26px", background: "none", border: "none", color: tab===id?"var(--g)":"var(--wd)", fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, letterSpacing: 1, cursor: "pointer", borderBottom: tab===id?"2px solid var(--g)":"2px solid transparent", transition: "all .3s", marginBottom: -1 }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
          {data[tab].map(([icon,title,desc],i) => (
            <div key={i} className="card sr" style={{ transitionDelay: `${i*.08}s` }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontFamily: "var(--fs)", fontSize: 19, fontWeight: 700, margin: "0 0 10px" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--wd)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <button className="bg" onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}>Quero Minha Transformação →</button>
        </div>
      </div>
    </section>
  );
}

// ─── RESULTS (vazio, pronto para dados reais) ─────────────────────────────────
function Results() {
  return (
    <section id="results" style={{ padding: "90px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="sr" style={{ marginBottom: 44 }}>
          <span className="lbl">Prova Social</span><span className="gl" />
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: 2 }}>CASOS DE <span className="gt">SUCESSO</span></h2>
        </div>
        <div style={{ padding: "60px 0", textAlign: "center", border: "1px dashed rgba(201,168,76,.2)", background: "rgba(201,168,76,.02)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p style={{ color: "var(--wd)", fontSize: 14 }}>Os seus cases de sucesso aparecerão aqui.<br />Adicione-os pelo painel administrativo.</p>
          <button className="bo" style={{ marginTop: 20, fontSize: 11, padding: "9px 20px" }} onClick={() => {}}>+ Adicionar Case (Admin)</button>
        </div>
      </div>
    </section>
  );
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
function Schedule({ onSchedule }) {
  const [form, setForm] = useState({ name:"", company:"", email:"", phone:"", revenue:"", problem:"", date:"", time:"" });
  const [done, setDone] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const submit = () => {
    if (!form.name || !form.email || !form.company || !form.problem) { alert("Preencha os campos obrigatórios (*)"); return; }
    onSchedule({ ...form, id: Date.now(), status: "pending", createdAt: new Date().toLocaleString("pt-BR") });
    setDone(true);
  };
  if (done) return (
    <section id="schedule" style={{ padding: "90px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", animation: "fadeUp .5s" }}>
        <div style={{ fontSize: 56, marginBottom: 18 }}>✅</div>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: 40, letterSpacing: 2, marginBottom: 12 }}>AGENDADO <span className="gt">COM SUCESSO!</span></h2>
        <p style={{ color: "var(--wd)", lineHeight: 1.7, fontSize: 14 }}>Nossa equipe entrará em contato em breve.</p>
        <button className="bg" style={{ marginTop: 24 }} onClick={() => { setDone(false); setForm({ name:"",company:"",email:"",phone:"",revenue:"",problem:"",date:"",time:"" }); }}>Novo Agendamento</button>
      </div>
    </section>
  );
  return (
    <section id="schedule" style={{ padding: "90px 24px", background: "var(--b2)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52 }}>
          <div className="sr">
            <span className="lbl">Primeiro Passo</span><span className="gl" />
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(30px,4vw,46px)", letterSpacing: 2, marginBottom: 16 }}>DIAGNÓSTICO<br /><span className="gt">GRATUITO</span></h2>
            <p style={{ color: "var(--wd)", lineHeight: 1.8, marginBottom: 24, fontSize: 14 }}>60 minutos que podem mudar o destino da sua empresa.</p>
            {["Análise completa da situação atual","Identificação dos pontos de perda","Plano de ação personalizado","Sem custo, sem compromisso"].map((it,i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10 }}>
                <span style={{ color: "var(--g)", marginTop: 2, fontSize: 13 }}>✓</span>
                <span style={{ color: "var(--wd)", fontSize: 13 }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.15)", padding: "32px 26px" }} className="sr">
            <h3 style={{ fontFamily: "var(--fd)", fontSize: 20, letterSpacing: 2, marginBottom: 18 }}>FORMULÁRIO</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[["name","Nome completo *","text"],["company","Empresa *","text"],["email","E-mail *","email"],["phone","WhatsApp","tel"],["revenue","Faturamento mensal","text"]].map(([k,ph,t]) => (
                <input key={k} className="inp" type={t} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} />
              ))}
              <select className="inp" style={{ cursor: "pointer" }} value={form.problem} onChange={e=>set("problem",e.target.value)}>
                <option value="">Principal desafio *</option>
                {["Dívidas e reestruturação","Queda nas vendas","Crescimento estagnado","Branding e posicionamento","Gestão de crise","Marketing digital","Outro"].map(o=><option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <input className="inp" type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
                <select className="inp" style={{ cursor: "pointer" }} value={form.time} onChange={e=>set("time",e.target.value)}>
                  <option value="">Horário</option>
                  {["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button className="bg" style={{ width: "100%", justifyContent: "center", marginTop: 18 }} onClick={submit}>Agendar Agora →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "var(--b2)", borderTop: "1px solid rgba(201,168,76,.07)", padding: "52px 24px 26px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }}>👑</div>
              <div><div style={{ fontFamily: "var(--fd)", fontSize: 17, letterSpacing: 3 }}>IMPÉRIO</div><div style={{ fontSize: 7, letterSpacing: 4, color: "var(--g)", fontWeight: 700, marginTop: -2 }}>ESTRATÉGICO</div></div>
            </div>
            <p style={{ color: "var(--wd)", fontSize: 12, lineHeight: 1.7, maxWidth: 240 }}>Consultoria empresarial e marketing estratégico para empresas que querem crescer.</p>
          </div>
          {[["SERVIÇOS",["Diagnóstico Gratuito","Anti-Falência","Marketing","Branding","Tráfego Pago"]],["EMPRESA",["Sobre Nós","Cases","Blog","Área Admin"]],["CONTATO",["📞 Seu telefone","📧 Seu e-mail","📍 Sua cidade"]]].map(([h,items]) => (
            <div key={h}>
              <h4 style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 14, fontSize: 13 }}>{h}</h4>
              {items.map(l => (
                <div key={l} onClick={() => l==="Área Admin" && setPage("admin")} style={{ color: "var(--wd)", fontSize: 12, marginBottom: 7, cursor: "pointer", transition: "color .2s" }}
                  onMouseEnter={e=>e.target.style.color="var(--g)"} onMouseLeave={e=>e.target.style.color="var(--wd)"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,.18),transparent)", margin: "0 0 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--wd)", flexWrap: "wrap", gap: 6 }}>
          <span>© {new Date().getFullYear()} Império Estratégico.</span>
        </div>
      </div>
    </footer>
  );
}

// ─── CHAT WIDGET (público — envia para o admin) ───────────────────────────────
function ChatWidget({ onNewMessage }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [name, setName] = useState("");
  const [identified, setIdentified] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const identify = () => {
    if (!name.trim()) return;
    setIdentified(true);
    const welcome = { from: "admin", text: `Olá, ${name}! 👑 Bem-vindo ao Império Estratégico. Como posso ajudar?`, time: now() };
    setMsgs([welcome]);
  };

  const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const send = () => {
    if (!inp.trim()) return;
    const msg = { from: "user", text: inp, time: now() };
    setMsgs(m => [...m, msg]);
    onNewMessage({ user: name, text: inp, time: now() });
    setInp("");
  };

  return (
    <div className="cw">
      {open && (
        <div className="cwin">
          <div className="ch">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#000" }}>Império Estratégico</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,.6)", display: "flex", gap: 3, alignItems: "center" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2ECC71", display: "inline-block" }} /> Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#000" }}>✕</button>
          </div>
          {!identified ? (
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 12, color: "var(--wd)", lineHeight: 1.6 }}>Antes de começar, como podemos te chamar?</p>
              <input className="inp" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && identify()} />
              <button className="bg" style={{ justifyContent: "center", padding: "10px" }} onClick={identify}>Iniciar conversa →</button>
            </div>
          ) : (
            <>
              <div className="cms">
                {msgs.map((m, i) => (
                  <div key={i} className={`cm ${m.from === "admin" ? "a" : "u"}`}>
                    {m.text}
                    <div style={{ fontSize: 9, opacity: .5, marginTop: 2, textAlign: m.from === "admin" ? "left" : "right" }}>{m.time}</div>
                  </div>
                ))}
                <div ref={ref} />
              </div>
              <div className="cir">
                <input className="ci" placeholder="Sua mensagem..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
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

// ─── NOTES MODAL ─────────────────────────────────────────────────────────────
function NotesModal({ client, onClose, onSave }) {
  const [notes, setNotes] = useState(client.notes || []);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#C9A84C");
  const colors = ["#C9A84C","#5588E0","#55C490","#E05555","#9B59B6","#E67E22"];

  const add = () => {
    if (!text.trim()) return;
    const n = { id: Date.now(), text, color, date: new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}), author: "Admin" };
    const upd = [n, ...notes];
    setNotes(upd); onSave(client.id, upd); setText("");
  };
  const del = (id) => { const upd = notes.filter(n=>n.id!==id); setNotes(upd); onSave(client.id, upd); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.87)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .2s" }}>
      <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.22)", maxWidth: 560, width: "100%", maxHeight: "88vh", overflow: "auto", animation: "fadeUp .3s" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(201,168,76,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 18, letterSpacing: 2 }}>ANOTAÇÕES</div>
            <div style={{ fontSize: 11, color: "var(--g)", marginTop: 2 }}>{client.name} · {client.company}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--wd)", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        {/* Info rápida do cliente */}
        <div style={{ padding: "12px 22px", background: "rgba(201,168,76,.03)", borderBottom: "1px solid rgba(201,168,76,.07)", display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["📧", client.email], ["📞", client.phone||"—"], ["💰", client.revenue||"—"], ["⚠️", client.problem||"—"]].map(([ic,v]) => (
            <div key={ic} style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 11 }}>{ic}</span>
              <span style={{ fontSize: 11, color: "var(--wd)" }}>{v}</span>
            </div>
          ))}
        </div>
        {/* Nova nota */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(201,168,76,.07)" }}>
          <textarea className="inp" rows={3} placeholder="Escreva sua anotação sobre este cliente..." value={text} onChange={e=>setText(e.target.value)} style={{ resize: "vertical", marginBottom: 10 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--wd)" }}>Cor:</span>
              {colors.map(c => (
                <div key={c} onClick={()=>setColor(c)} style={{ width: 18, height: 18, borderRadius: "50%", background: c, cursor: "pointer", border: color===c?"2px solid var(--w)":"2px solid transparent", transition: "border .2s" }} />
              ))}
            </div>
            <button className="bg" style={{ padding: "8px 18px", fontSize: 11 }} onClick={add}>+ Salvar</button>
          </div>
        </div>
        {/* Lista de notas */}
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.length === 0 && (
            <div style={{ color: "var(--wd)", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
              Nenhuma anotação ainda. 📝
            </div>
          )}
          {notes.map(n => (
            <div key={n.id} className="note-card" style={{ borderLeft: `3px solid ${n.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: n.color, display: "inline-block" }} />
                  <span style={{ fontSize: 10, color: "var(--wd)" }}>{n.date}</span>
                  <span style={{ fontSize: 10, color: n.color, fontWeight: 600 }}>· {n.author}</span>
                </div>
                <button onClick={()=>del(n.id)} style={{ background: "none", border: "none", color: "var(--wd)", cursor: "pointer", fontSize: 11, opacity: .6 }}>🗑</button>
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
  const [e, setE] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const try_ = () => { if (e==="admin@imperio.com" && p==="admin123") onLogin(); else setErr("Credenciais inválidas"); };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--b)", padding: 24 }}>
      <div style={{ background: "var(--b3)", border: "1px solid rgba(201,168,76,.2)", padding: "42px 34px", width: "100%", maxWidth: 380, animation: "fadeUp .5s" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>👑</div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 24, letterSpacing: 4 }}>ADMIN PANEL</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "var(--g)", fontWeight: 700, marginTop: 2 }}>IMPÉRIO ESTRATÉGICO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <input className="inp" type="email" placeholder="E-mail" value={e} onChange={ev=>setE(ev.target.value)} />
          <input className="inp" type="password" placeholder="Senha" value={p} onChange={ev=>setP(ev.target.value)} onKeyDown={ev=>ev.key==="Enter"&&try_()} />
          {err && <div style={{ color: "#FF8080", fontSize: 12, textAlign: "center" }}>{err}</div>}
          <button className="bg" style={{ justifyContent: "center", marginTop: 4 }} onClick={try_}>🔐 Entrar</button>
          <div style={{ fontSize: 11, color: "var(--wd)", textAlign: "center", marginTop: 2 }}>admin@imperio.com · admin123</div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onLogout, appointments, leads, visitors, incomingMessages }) {
  const [tab, setTab] = useState("dashboard");
  const [allLeads, setAllLeads] = useState(leads.map(l => ({ ...l, notes: [] })));
  const [allAppts, setAllAppts] = useState(appointments);
  const [notesClient, setNotesClient] = useState(null);
  const [search, setSearch] = useState("");

  // Chat admin
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [reply, setReply] = useState("");
  const chatEndRef = useRef(null);

  // Sync incoming messages from public chat
  useEffect(() => {
    if (incomingMessages.length === 0) return;
    const last = incomingMessages[incomingMessages.length - 1];
    setConversations(prev => {
      const existing = prev.find(c => c.user === last.user);
      if (existing) {
        return prev.map(c => c.user === last.user
          ? { ...c, unread: activeConv === c.id ? 0 : c.unread + 1, msgs: [...c.msgs, { from: "user", text: last.text, time: last.time }] }
          : c
        );
      } else {
        const newConv = { id: Date.now(), user: last.user, avatar: last.user[0]?.toUpperCase() || "?", online: true, unread: 1, msgs: [{ from: "user", text: last.text, time: last.time }] };
        return [newConv, ...prev];
      }
    });
  }, [incomingMessages]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversations, activeConv]);

  // Sync new leads/appointments
  useEffect(() => { setAllLeads(leads.map(l => ({ ...l, notes: l.notes || [] }))); }, [leads]);
  useEffect(() => { setAllAppts(appointments); }, [appointments]);

  const sendReply = () => {
    if (!reply.trim() || !activeConv) return;
    setConversations(prev => prev.map(c => c.id === activeConv
      ? { ...c, msgs: [...c.msgs, { from: "admin", text: reply, time: new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) }] }
      : c
    ));
    setReply("");
  };

  const saveNotes = (cid, notes) => setAllLeads(p => p.map(l => l.id===cid ? {...l,notes} : l));
  const filtered = allLeads.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()) || l.company?.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = conversations.reduce((a,c) => a + c.unread, 0);

  const nav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "leads", icon: "📩", label: "Leads", badge: allLeads.filter(l=>l.status==="new").length },
    { id: "chat", icon: "💬", label: "Chat", badge: totalUnread },
    { id: "appointments", icon: "📅", label: "Agendamentos" },
    { id: "content", icon: "📝", label: "Conteúdo" },
    { id: "live", icon: "📡", label: "Tempo Real" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--b)", display: "flex" }}>
      {notesClient && <NotesModal client={notesClient} onClose={() => setNotesClient(null)} onSave={saveNotes} />}

      {/* Sidebar */}
      <div className="aside">
        <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(201,168,76,.07)" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 15, letterSpacing: 3 }}>IMPÉRIO</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "var(--g)", fontWeight: 700 }}>ADMIN PANEL</div>
        </div>
        <div style={{ margin: 10, padding: "7px 11px", background: "rgba(85,196,144,.07)", border: "1px solid rgba(85,196,144,.15)", display: "flex", gap: 6, alignItems: "center" }}>
          <span className="live-dot" />
          <span style={{ fontSize: 11, color: "var(--green)" }}>{visitors} online agora</span>
        </div>
        <div style={{ paddingTop: 4 }}>
          {nav.map(n => (
            <div key={n.id} className={`ani ${tab===n.id?"on":""}`} onClick={() => setTab(n.id)}>
              <span>{n.icon}</span> {n.label}
              {n.badge > 0 && <span style={{ marginLeft: "auto", background: "var(--g)", color: "#000", borderRadius: "50%", width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{n.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(201,168,76,.07)" }}>
          <div className="ani" onClick={onLogout}><span>🚪</span> Sair</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", maxHeight: "100vh" }}>
        <div style={{ padding: "13px 22px", borderBottom: "1px solid rgba(201,168,76,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--b2)", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: 19, letterSpacing: 3 }}>{nav.find(n=>n.id===tab)?.icon} {nav.find(n=>n.id===tab)?.label?.toUpperCase()}</h1>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>A</div>
            <div><div style={{ fontSize: 12, fontWeight: 600 }}>Administrador</div><div style={{ fontSize: 10, color: "var(--g)" }}>Super Admin</div></div>
          </div>
        </div>

        <div style={{ padding: 22 }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 22 }}>
                {[
                  { l: "Leads", v: allLeads.length, i: "📩", c: "#C9A84C" },
                  { l: "Agendamentos", v: allAppts.length, i: "📅", c: "#5588E0" },
                  { l: "Conversas", v: conversations.length, i: "💬", c: "#55C490" },
                  { l: "Online Agora", v: visitors, i: "👥", c: "#E05555" },
                ].map((s,i) => (
                  <div key={i} className="ac" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1, marginBottom: 5 }}>{s.l.toUpperCase()}</div>
                      <div style={{ fontFamily: "var(--fd)", fontSize: 36, color: s.c }}>{s.v}</div>
                    </div>
                    <div style={{ fontSize: 22, opacity: .5 }}>{s.i}</div>
                  </div>
                ))}
              </div>

              {/* Empty states */}
              {allLeads.length === 0 && allAppts.length === 0 && (
                <div style={{ padding: "50px 0", textAlign: "center", border: "1px dashed rgba(201,168,76,.15)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
                  <p style={{ color: "var(--wd)", fontSize: 14 }}>Tudo zerado e pronto para uso real.<br />Os dados aparecerão aqui quando clientes interagirem com o site.</p>
                </div>
              )}

              {allLeads.length > 0 && (
                <div className="ac" style={{ marginTop: 14 }}>
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 14, fontSize: 13 }}>ÚLTIMOS LEADS</div>
                  {allLeads.slice(0,5).map((l,i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(201,168,76,.05)" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{l.name}</div>
                        <div style={{ fontSize: 10, color: "var(--wd)" }}>{l.company} · {l.problem}</div>
                      </div>
                      <span className="sb sn">novo</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LEADS */}
          {tab === "leads" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                <input className="inp" style={{ maxWidth: 260 }} placeholder="🔍 Buscar..." value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: "50px 0", textAlign: "center", border: "1px dashed rgba(201,168,76,.12)" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📩</div>
                  <p style={{ color: "var(--wd)", fontSize: 13 }}>Nenhum lead ainda.<br />Quando alguém preencher o formulário de agendamento, aparecerá aqui.</p>
                </div>
              ) : (
                <div className="ac" style={{ padding: 0, overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(201,168,76,.1)", background: "rgba(201,168,76,.02)" }}>
                        {["Cliente","Empresa","Contato","Faturamento","Problema","Status","Notas",""].map(h => (
                          <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 9, letterSpacing: 1, color: "var(--g)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((l,i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.02)", transition: "background .2s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,.025)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding: "11px 13px" }}>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{l.name}</div>
                            <div style={{ fontSize: 10, color: "var(--wd)" }}>{l.email}</div>
                          </td>
                          <td style={{ padding: "11px 13px", fontSize: 12, color: "var(--wd)" }}>{l.company}</td>
                          <td style={{ padding: "11px 13px", fontSize: 11, color: "var(--wd)" }}>{l.phone||"—"}</td>
                          <td style={{ padding: "11px 13px", fontSize: 12, color: "var(--g)", fontWeight: 600 }}>{l.revenue||"—"}</td>
                          <td style={{ padding: "11px 13px", fontSize: 11, color: "var(--wd)", maxWidth: 150 }}>{l.problem}</td>
                          <td style={{ padding: "11px 13px" }}>
                            <select value={l.status||"new"} onChange={e=>setAllLeads(p=>p.map(x=>x.id===l.id?{...x,status:e.target.value}:x))}
                              style={{ background: "var(--b4)", color: "var(--w)", border: "1px solid rgba(201,168,76,.18)", padding: "3px 7px", fontSize: 10, cursor: "pointer", outline: "none" }}>
                              <option value="new">Novo</option>
                              <option value="hot">Quente 🔥</option>
                              <option value="contact">Em Contato</option>
                              <option value="closed">Fechado ✓</option>
                            </select>
                          </td>
                          <td style={{ padding: "11px 13px" }}>
                            <button onClick={()=>setNotesClient(l)} style={{ padding: "4px 10px", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.22)", color: "var(--g)", cursor: "pointer", fontSize: 10, borderRadius: 2, whiteSpace: "nowrap" }}>
                              📝 {l.notes?.length > 0 ? `${l.notes.length}` : "0"} nota{(l.notes?.length||0)!==1?"s":""}
                            </button>
                          </td>
                          <td style={{ padding: "11px 13px" }}>
                            <button onClick={()=>setAllLeads(p=>p.filter(x=>x.id!==l.id))} style={{ padding: "4px 8px", background: "rgba(220,85,85,.08)", border: "1px solid rgba(220,85,85,.22)", color: "#FF8080", cursor: "pointer", fontSize: 10, borderRadius: 2 }}>🗑</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CHAT */}
          {tab === "chat" && (
            <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 14, height: "calc(100vh - 175px)" }}>
              <div className="ac" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "13px 15px", borderBottom: "1px solid rgba(201,168,76,.09)", fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 12 }}>CONVERSAS</div>
                {conversations.length === 0 && (
                  <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--wd)", fontSize: 12 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                    Aguardando mensagens dos visitantes...
                  </div>
                )}
                {conversations.map(c => (
                  <div key={c.id} onClick={() => { setActiveConv(c.id); setConversations(p=>p.map(x=>x.id===c.id?{...x,unread:0}:x)); }}
                    style={{ padding: "12px 15px", borderBottom: "1px solid rgba(201,168,76,.04)", cursor: "pointer", background: activeConv===c.id?"rgba(201,168,76,.07)":"transparent", transition: "background .2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{c.user}</div>
                          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                            <span style={{ fontSize: 9, color: "var(--wd)" }}>online</span>
                          </div>
                        </div>
                      </div>
                      {c.unread > 0 && <span style={{ background: "var(--g)", color: "#000", borderRadius: "50%", width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{c.unread}</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--wd)", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 35 }}>
                      {c.msgs[c.msgs.length-1]?.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="ac" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {!activeConv ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 10, color: "var(--wd)" }}>
                    <span style={{ fontSize: 40 }}>💬</span>
                    <p style={{ fontSize: 13 }}>Selecione uma conversa para responder</p>
                  </div>
                ) : (() => {
                  const conv = conversations.find(c => c.id === activeConv);
                  return <>
                    <div style={{ padding: "13px 17px", borderBottom: "1px solid rgba(201,168,76,.09)", display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{conv?.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{conv?.user}</div>
                        <div style={{ fontSize: 10, color: "var(--green)" }}>● Online</div>
                      </div>
                      <button onClick={() => { const lead = allLeads.find(l=>l.name===conv?.user)||{id:Date.now(),name:conv?.user||"",company:"",email:"",phone:"",revenue:"",problem:"",notes:[]}; setNotesClient(lead); }}
                        style={{ padding: "5px 12px", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.22)", color: "var(--g)", cursor: "pointer", fontSize: 10, borderRadius: 2 }}>
                        📝 Notas
                      </button>
                    </div>
                    <div style={{ flex: 1, overflow: "auto", padding: 15, display: "flex", flexDirection: "column", gap: 7 }}>
                      {conv?.msgs.map((m,i) => (
                        <div key={i} style={{ maxWidth: "68%", padding: "9px 13px", fontSize: 12, lineHeight: 1.55, alignSelf: m.from==="admin"?"flex-end":"flex-start", background: m.from==="admin"?"linear-gradient(135deg,var(--gd),var(--g))":"var(--b4)", color: m.from==="admin"?"#000":"var(--w)", border: m.from!=="admin"?"1px solid rgba(201,168,76,.08)":"none", borderRadius: m.from==="admin"?"10px 10px 0 10px":"0 10px 10px 10px" }}>
                          {m.text}
                          <div style={{ fontSize: 9, opacity: .5, marginTop: 2, textAlign: m.from==="admin"?"right":"left" }}>{m.time}</div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <div style={{ padding: 12, borderTop: "1px solid rgba(201,168,76,.07)", display: "flex", gap: 8 }}>
                      <input className="inp" style={{ flex: 1 }} placeholder="Digite sua resposta e pressione Enter..." value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()} />
                      <button className="bg" style={{ padding: "11px 16px", fontSize: 13 }} onClick={sendReply}>➤</button>
                    </div>
                  </>;
                })()}
              </div>
            </div>
          )}

          {/* APPOINTMENTS */}
          {tab === "appointments" && (
            allAppts.length === 0 ? (
              <div style={{ padding: "50px 0", textAlign: "center", border: "1px dashed rgba(201,168,76,.12)" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
                <p style={{ color: "var(--wd)", fontSize: 13 }}>Nenhum agendamento ainda.<br />Aparecerão aqui quando clientes usarem o formulário.</p>
              </div>
            ) : (
              <div className="ac" style={{ padding: 0, overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(201,168,76,.09)", background: "rgba(201,168,76,.02)" }}>
                      {["Cliente","Empresa","Data","Hora","Desafio","Status","Ações"].map(h => (
                        <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 9, letterSpacing: 1, color: "var(--g)", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allAppts.map((a,i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.02)", transition: "background .2s" }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,.025)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding: "11px 13px", fontSize: 12, fontWeight: 600 }}>{a.name}</td>
                        <td style={{ padding: "11px 13px", fontSize: 11, color: "var(--wd)" }}>{a.company}</td>
                        <td style={{ padding: "11px 13px", fontSize: 12, color: "var(--g)" }}>{a.date}</td>
                        <td style={{ padding: "11px 13px", fontSize: 12 }}>{a.time||"—"}</td>
                        <td style={{ padding: "11px 13px", fontSize: 11, color: "var(--wd)" }}>{a.problem}</td>
                        <td style={{ padding: "11px 13px" }}>
                          <span className={`sb ${a.status==="confirmed"?"sf":"sn"}`}>{a.status==="confirmed"?"Confirmado":"Pendente"}</span>
                        </td>
                        <td style={{ padding: "11px 13px", display: "flex", gap: 6 }}>
                          <button onClick={()=>setAllAppts(p=>p.map(x=>x.id===a.id?{...x,status:"confirmed"}:x))} style={{ padding: "4px 9px", background: "rgba(85,196,144,.08)", border: "1px solid rgba(85,196,144,.22)", color: "#88DDAA", cursor: "pointer", fontSize: 10, borderRadius: 2 }}>✓</button>
                          <button onClick={()=>setAllAppts(p=>p.filter(x=>x.id!==a.id))} style={{ padding: "4px 8px", background: "rgba(220,85,85,.08)", border: "1px solid rgba(220,85,85,.22)", color: "#FF8080", cursor: "pointer", fontSize: 10, borderRadius: 2 }}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* CONTENT */}
          {tab === "content" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="ac">
                <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 16, fontSize: 13 }}>EDITAR TEXTOS DO SITE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {[["HEADLINE","Transformamos empresas quebradas em máquinas de lucro"],["SUBHEADLINE","Método exclusivo de reestruturação financeira e marketing"],["TEXTO DO BOTÃO","Agendar Diagnóstico Gratuito"]].map(([l,v]) => (
                    <div key={l}>
                      <label style={{ fontSize: 9, letterSpacing: 1, color: "var(--g)", display: "block", marginBottom: 5 }}>{l}</label>
                      {l==="SUBHEADLINE"?<textarea className="inp" rows={2} defaultValue={v} style={{resize:"vertical"}}/>:<input className="inp" defaultValue={v}/>}
                    </div>
                  ))}
                  <button className="bg" style={{ justifyContent: "center" }}>💾 Salvar Textos</button>
                </div>
              </div>
              <div className="ac">
                <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, marginBottom: 16, fontSize: 13 }}>ADICIONAR DEPOIMENTO</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <input className="inp" placeholder="Nome do cliente" />
                  <input className="inp" placeholder="Cargo e empresa" />
                  <textarea className="inp" rows={3} placeholder="Depoimento..." style={{resize:"vertical"}} />
                  <select className="inp" style={{cursor:"pointer"}}>
                    <option>★★★★★ 5 estrelas</option><option>★★★★ 4 estrelas</option>
                  </select>
                  <button className="bg" style={{ justifyContent: "center" }}>+ Adicionar Depoimento</button>
                </div>
              </div>
            </div>
          )}

          {/* LIVE */}
          {tab === "live" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="ac">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span className="live-dot" />
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 13 }}>VISITANTES AGORA</div>
                </div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 80, color: "var(--green)", marginBottom: 4 }}>{visitors}</div>
                <div style={{ fontSize: 10, color: "var(--wd)", letterSpacing: 1, marginBottom: 22 }}>PESSOAS NO SITE AGORA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[["🏠 Página Inicial", Math.floor(visitors*.44)],["💼 Serviços", Math.floor(visitors*.22)],["📊 Resultados", Math.floor(visitors*.18)],["📅 Agendamento", Math.floor(visitors*.16)]].map(([pg,n]) => (
                    <div key={pg} style={{ display: "flex", justifyContent: "space-between", padding: "7px 11px", background: "var(--b4)", borderLeft: "2px solid var(--g)" }}>
                      <span style={{ fontSize: 12 }}>{pg}</span>
                      <span style={{ fontSize: 12, color: "var(--g)", fontWeight: 600 }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ac">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span className="live-dot" />
                  <div style={{ fontFamily: "var(--fd)", letterSpacing: 2, fontSize: 13 }}>MENSAGENS RECEBIDAS</div>
                </div>
                {conversations.length === 0 ? (
                  <div style={{ padding: "30px 0", textAlign: "center", color: "var(--wd)", fontSize: 12 }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>📡</div>
                    Aguardando mensagens do chat do site...
                  </div>
                ) : conversations.map((c,i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(201,168,76,.05)" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,var(--gd),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{c.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.user}</div>
                      <div style={{ fontSize: 10, color: "var(--wd)" }}>{c.msgs.length} mensagem{c.msgs.length!==1?"s":""}</div>
                    </div>
                    {c.unread > 0 && <span className="sb sh">{c.unread} nova{c.unread!==1?"s":""}</span>}
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
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [toasts, setToasts] = useState([]);
  const toastRef = useRef(0);
  const visitors = useVisitors();

  const addToast = useCallback((msg) => {
    const id = ++toastRef.current;
    setToasts(p => [...p, { id, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const handleSchedule = (data) => {
    setAppointments(p => [...p, data]);
    setLeads(p => [...p, { ...data, status: "new" }]);
    addToast(`📅 Novo agendamento: ${data.name} de ${data.company}`);
  };

  const handleNewMessage = (msg) => {
    setIncomingMessages(p => [...p, msg]);
    addToast(`💬 Nova mensagem de ${msg.user}`);
  };

  if (page === "admin") {
    if (!adminLogged) return <AdminLogin onLogin={() => setAdminLogged(true)} />;
    return (
      <AdminPanel
        onLogout={() => { setAdminLogged(false); setPage("home"); }}
        appointments={appointments}
        leads={leads}
        visitors={visitors}
        incomingMessages={incomingMessages}
      />
    );
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
      <ChatWidget onNewMessage={handleNewMessage} />
      {/* WhatsApp */}
      <a href="https://wa.me/5511999990000" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 92, right: 24, zIndex: 899, width: 50, height: 50, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(37,211,102,.4)", transition: "transform .2s", textDecoration: "none" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        📱
      </a>
    </div>
  );
}

