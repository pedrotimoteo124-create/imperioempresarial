import { useState, useEffect, useRef, useCallback } from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fl);

const gs = document.createElement("style");
gs.textContent = `
  :root{--g:#C9A84C;--gl:#E8D48A;--gd:#8B6914;--b:#060608;--b2:#0C0C10;--b3:#131318;--b4:#1A1A22;--w:#F0EDE6;--wd:rgba(240,237,230,0.55);--green:#55C490;--fd:'Bebas Neue',sans-serif;--fb:'Outfit',sans-serif;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:var(--b);color:var(--w);font-family:var(--fb);}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--b2);}::-webkit-scrollbar-thumb{background:var(--gd);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2.2);opacity:0}}
  @keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
  .gt{background:linear-gradient(135deg,var(--gd),var(--gl),var(--g));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .bg{display:inline-flex;align-items:center;gap:7px;padding:12px 28px;font-family:var(--fb);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:linear-gradient(135deg,var(--gd),var(--g),var(--gl));color:var(--b);border:none;cursor:pointer;transition:all .3s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));}
  .bg:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4);}
  .inp{width:100%;padding:11px 15px;background:var(--b3);border:1px solid rgba(201,168,76,.2);color:var(--w);font-family:var(--fb);font-size:13px;outline:none;transition:border .3s;}
  .inp:focus{border-color:var(--g);}
  .inp::placeholder{color:rgba(240,237,230,.25);}
  .live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);position:relative;display:inline-block;}
  .live-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--green);animation:ping 1.5s infinite;}
  .aside{width:220px;min-height:100vh;background:var(--b2);border-right:1px solid rgba(201,168,76,.08);flex-shrink:0;position:relative;}
  .ani{padding:11px 17px;font-size:12px;font-weight:500;letter-spacing:.5px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .2s;color:var(--wd);}
  .ani:hover{background:rgba(201,168,76,.05);color:var(--g);}
  .ani.on{background:rgba(201,168,76,.1);color:var(--g);border-right:2px solid var(--g);}
  .ac{background:var(--b3);border:1px solid rgba(201,168,76,.1);}
  .sb{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
  .sn{background:rgba(85,196,144,.12);color:var(--green);}
  .sf{background:rgba(201,168,76,.12);color:var(--g);}
  .sh{background:rgba(220,85,85,.12);color:#FF8080;}
  .trow:hover{background:rgba(201,168,76,.025)!important;}
  .note-card{background:var(--b4);border:1px solid rgba(201,168,76,.1);padding:13px;transition:all .2s;border-radius:2px;}
  .note-card:hover{border-color:rgba(201,168,76,.28);}
  .empty{padding:48px 20px;text-align:center;border:1px dashed rgba(201,168,76,.14);background:rgba(201,168,76,.01);}
  .empty-icon{font-size:36px;margin-bottom:10px;}
  .empty p{color:var(--wd);font-size:13px;line-height:1.7;}
  .toast-wrap{position:fixed;top:14px;right:18px;z-index:2000;display:flex;flex-direction:column;gap:7px;pointer-events:none;}
  .toast-adm{background:var(--b3);border:1px solid rgba(201,168,76,.22);border-left:3px solid var(--g);padding:10px 14px;min-width:240px;animation:slideIn .3s ease;box-shadow:0 8px 28px rgba(0,0,0,.6);font-size:12px;color:var(--w);}
`;
document.head.appendChild(gs);

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const LS = {
  get: (k: string, def: any) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const KEYS = { leads: "ie_leads", appts: "ie_appts", chats: "ie_chats", auth: "ie_auth" };
const ADMIN = { email: "admin@imperio.com", password: "admin123" };

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useVisitors() {
  const [v, setV] = useState(1);
  useEffect(() => { const i = setInterval(() => setV(n => Math.max(1, n + Math.floor(Math.random() * 5) - 2)), 5000); return () => clearInterval(i); }, []);
  return v;
}

function useLS<T>(key: string, def: T): [T, (val: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(() => LS.get(key, def));
  const set = useCallback((val: T | ((p: T) => T)) => {
    setState(prev => {
      const next = typeof val === "function" ? (val as any)(prev) : val;
      LS.set(key, next);
      return next;
    });
  }, [key]);
  useEffect(() => {
    const i = setInterval(() => {
      const fresh = LS.get(key, def);
      setState(prev => JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev);
    }, 900);
    return () => clearInterval(i);
  }, [key]);
  return [state, set];
}

function useAdminToasts() {
  const [items, setItems] = useState<any[]>([]);
  const ref = useRef(0);
  const add = useCallback((msg: string) => {
    const id = ++ref.current;
    setItems(p => [...p, { id, msg }]);
    setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return [items, add] as const;
}

// ─── NOTES MODAL ──────────────────────────────────────────────────────────────
function NotesModal({ client, onClose, onSave }: { client: any; onClose: () => void; onSave: (id: number, notes: any[]) => void }) {
  const [notes, setNotes] = useState<any[]>(client.notes || []);
  const [text, setText] = useState(""); const [color, setColor] = useState("#C9A84C");
  const colors = ["#C9A84C","#5588E0","#55C490","#E05555","#9B59B6","#E67E22"];

  const add = () => {
    if (!text.trim()) return;
    const n = { id: Date.now(), text, color, date: new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}), author:"Admin" };
    const upd = [n, ...notes]; setNotes(upd); onSave(client.id, upd); setText("");
  };
  const del = (id: number) => { const upd = notes.filter(n => n.id !== id); setNotes(upd); onSave(client.id, upd); };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:1500,display:"flex",alignItems:"center",justifyContent:"center",padding:18,animation:"fadeIn .2s" }}>
      <div style={{ background:"var(--b3)",border:"1px solid rgba(201,168,76,.2)",maxWidth:520,width:"100%",maxHeight:"87vh",overflow:"auto",animation:"fadeUp .3s" }}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid rgba(201,168,76,.09)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div><div style={{ fontFamily:"var(--fd)",fontSize:17,letterSpacing:2 }}>ANOTAÇÕES</div><div style={{ fontSize:11,color:"var(--g)",marginTop:1 }}>{client.name} · {client.company||"—"}</div></div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--wd)",cursor:"pointer",fontSize:17 }}>✕</button>
        </div>
        {/* Info cliente */}
        <div style={{ padding:"10px 20px",background:"rgba(201,168,76,.03)",borderBottom:"1px solid rgba(201,168,76,.06)",display:"flex",gap:16,flexWrap:"wrap" }}>
          {[["📧",client.email||"—"],["📞",client.phone||"—"],["💰",client.revenue||"—"],["⚠️",client.problem||"—"]].map(([ic,v])=>(
            <div key={ic} style={{ display:"flex",gap:4,alignItems:"center" }}><span style={{ fontSize:11 }}>{ic}</span><span style={{ fontSize:11,color:"var(--wd)" }}>{v}</span></div>
          ))}
        </div>
        {/* Adicionar nota */}
        <div style={{ padding:"16px 20px",borderBottom:"1px solid rgba(201,168,76,.06)" }}>
          <textarea className="inp" rows={3} placeholder="Escreva sua anotação..." value={text} onChange={e=>setText(e.target.value)} style={{ resize:"vertical",marginBottom:9 }}/>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ display:"flex",gap:6,alignItems:"center" }}>
              <span style={{ fontSize:10,color:"var(--wd)" }}>Cor:</span>
              {colors.map(c=><div key={c} onClick={()=>setColor(c)} style={{ width:16,height:16,borderRadius:"50%",background:c,cursor:"pointer",border:color===c?"2px solid var(--w)":"2px solid transparent",transition:"border .2s" }}/>)}
            </div>
            <button className="bg" style={{ padding:"7px 16px",fontSize:11 }} onClick={add}>+ Salvar</button>
          </div>
        </div>
        {/* Lista de notas */}
        <div style={{ padding:"16px 20px",display:"flex",flexDirection:"column",gap:9 }}>
          {notes.length===0&&<div style={{ color:"var(--wd)",fontSize:12,textAlign:"center",padding:"14px 0" }}>Nenhuma anotação ainda. 📝</div>}
          {notes.map(n=>(
            <div key={n.id} className="note-card" style={{ borderLeft:`3px solid ${n.color}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:n.color,display:"inline-block" }}/>
                  <span style={{ fontSize:10,color:"var(--wd)" }}>{n.date}</span>
                  <span style={{ fontSize:10,color:n.color,fontWeight:600 }}>· {n.author}</span>
                </div>
                <button onClick={()=>del(n.id)} style={{ background:"none",border:"none",color:"var(--wd)",cursor:"pointer",fontSize:11,opacity:.55 }}>🗑</button>
              </div>
              <p style={{ fontSize:13,lineHeight:1.65 }}>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  const tryLogin = () => {
    if (!email || !pass) { setErr("Preencha todos os campos."); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      if (email === ADMIN.email && pass === ADMIN.password) {
        LS.set(KEYS.auth, { logged: true, ts: Date.now() });
        onLogin();
      } else {
        setErr("E-mail ou senha incorretos.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--b)",padding:22,position:"relative",overflow:"hidden" }}>
      {/* BG grid */}
      <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(201,168,76,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.03) 1px,transparent 1px)",backgroundSize:"64px 64px" }}/>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,rgba(201,168,76,.06) 0%,transparent 60%)" }}/>

      <div style={{ background:"var(--b3)",border:"1px solid rgba(201,168,76,.22)",padding:"48px 40px",width:"100%",maxWidth:420,animation:"fadeUp .5s",position:"relative",zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ width:56,height:56,background:"linear-gradient(135deg,#8B6914,#C9A84C,#E8D48A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px" }}>👑</div>
          <div style={{ fontFamily:"var(--fd)",fontSize:28,letterSpacing:5,lineHeight:1 }}>IMPÉRIO</div>
          <div style={{ fontFamily:"var(--fd)",fontSize:14,letterSpacing:6,color:"var(--g)",marginTop:2 }}>ESTRATÉGICO</div>
          <div style={{ fontSize:10,letterSpacing:3,color:"var(--wd)",marginTop:8,textTransform:"uppercase" }}>Área Administrativa</div>
          <div style={{ width:48,height:1,background:"linear-gradient(90deg,transparent,var(--g),transparent)",margin:"14px auto 0" }}/>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <div>
            <label style={{ fontSize:9,letterSpacing:2,color:"var(--g)",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:6 }}>E-MAIL</label>
            <input className="inp" type="email" placeholder="seu@email.com" value={email}
              onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/>
          </div>
          <div>
            <label style={{ fontSize:9,letterSpacing:2,color:"var(--g)",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:6 }}>SENHA</label>
            <input className="inp" type="password" placeholder="••••••••" value={pass}
              onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/>
          </div>

          {err && (
            <div style={{ padding:"10px 14px",background:"rgba(220,85,85,.08)",border:"1px solid rgba(220,85,85,.22)",color:"#FF8080",fontSize:12,textAlign:"center",borderRadius:2 }}>
              {err}
            </div>
          )}

          <button className="bg" style={{ justifyContent:"center",marginTop:6,opacity:loading?.8:1,pointerEvents:loading?"none":"all" }} onClick={tryLogin}>
            {loading ? "Verificando..." : "🔐 Entrar no Painel"}
          </button>

          <div style={{ textAlign:"center",fontSize:10,color:"var(--wd)",marginTop:4,lineHeight:1.7 }}>
            Acesso restrito a administradores.<br/>
            <span style={{ color:"rgba(240,237,230,.3)" }}>admin@imperio.com · admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function Panel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState("dashboard");
  const [leads, setLeads] = useLS<any[]>(KEYS.leads, []);
  const [appts, setAppts] = useLS<any[]>(KEYS.appts, []);
  const [chats, setChats] = useLS<any[]>(KEYS.chats, []);
  const [toasts, addToast] = useAdminToasts();
  const visitors = useVisitors();
  const [notesClient, setNotesClient] = useState<any>(null);
  const [activeConv, setActiveConv] = useState<number|null>(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Notify when new unread messages arrive
  const prevUnread = useRef(0);
  useEffect(() => {
    const total = chats.reduce((a: number, c: any) => a + (c.unread||0), 0);
    if (total > prevUnread.current) addToast(`💬 Nova mensagem no chat!`);
    prevUnread.current = total;
  }, [chats]);

  // Notify when new leads arrive
  const prevLeads = useRef(leads.length);
  useEffect(() => {
    if (leads.length > prevLeads.current) addToast(`📩 Novo lead: ${leads[leads.length-1]?.name}`);
    prevLeads.current = leads.length;
  }, [leads]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chats, activeConv]);

  const totalUnread = chats.reduce((a: number, c: any) => a + (c.unread||0), 0);
  const newLeads = leads.filter((l: any) => !l.status||l.status==="new").length;

  const saveNotes = (cid: number, notes: any[]) => setLeads((p: any[]) => p.map((l: any) => l.id===cid ? {...l,notes} : l));

  const sendReply = () => {
    if (!reply.trim()||!activeConv) return;
    const msg = { from:"admin", text:reply.trim(), time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) };
    setChats((p: any[]) => p.map((c: any) => c.id===activeConv ? {...c,unread:0,msgs:[...c.msgs,msg]} : c));
    setReply("");
  };

  const filtered = leads.filter((l: any) =>
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

  const Th = ({children}: {children: any}) => <th style={{ padding:"9px 13px",textAlign:"left",fontSize:9,letterSpacing:1,color:"var(--g)",textTransform:"uppercase",whiteSpace:"nowrap",background:"rgba(201,168,76,.02)",borderBottom:"1px solid rgba(201,168,76,.09)" }}>{children}</th>;
  const Td = ({children,style={}}: {children:any,style?:any}) => <td style={{ padding:"10px 13px",fontSize:12,...style }}>{children}</td>;

  return (
    <div style={{ minHeight:"100vh",background:"var(--b)",display:"flex" }}>
      {/* Admin toasts */}
      <div className="toast-wrap">
        {toasts.map((t:any) => <div key={t.id} className="toast-adm">{t.msg}</div>)}
      </div>

      {notesClient && <NotesModal client={notesClient} onClose={()=>setNotesClient(null)} onSave={saveNotes}/>}

      {/* ── SIDEBAR ── */}
      <div className="aside">
        <div style={{ padding:"18px 16px",borderBottom:"1px solid rgba(201,168,76,.07)" }}>
          <div style={{ fontFamily:"var(--fd)",fontSize:15,letterSpacing:3 }}>IMPÉRIO</div>
          <div style={{ fontSize:7,letterSpacing:3,color:"var(--g)",fontWeight:700 }}>ADMIN PANEL</div>
        </div>
        <div style={{ margin:9,padding:"6px 10px",background:"rgba(85,196,144,.06)",border:"1px solid rgba(85,196,144,.14)",display:"flex",gap:5,alignItems:"center" }}>
          <span className="live-dot"/><span style={{ fontSize:10,color:"var(--green)" }}>{visitors} online</span>
        </div>
        <div style={{ paddingTop:4 }}>
          {nav.map(n=>(
            <div key={n.id} className={`ani ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
              <span>{n.icon}</span>{n.label}
              {(n as any).badge>0&&<span style={{ marginLeft:"auto",background:"var(--g)",color:"#000",borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700 }}>{(n as any).badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ position:"absolute",bottom:0,left:0,right:0,borderTop:"1px solid rgba(201,168,76,.07)" }}>
          <div className="ani" onClick={onLogout}><span>🚪</span>Sair</div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1,overflow:"auto",maxHeight:"100vh" }}>
        {/* Topbar */}
        <div style={{ padding:"12px 20px",borderBottom:"1px solid rgba(201,168,76,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--b2)",position:"sticky",top:0,zIndex:10 }}>
          <h1 style={{ fontFamily:"var(--fd)",fontSize:18,letterSpacing:3 }}>{nav.find(n=>n.id===tab)?.icon} {nav.find(n=>n.id===tab)?.label?.toUpperCase()}</h1>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            <div style={{ width:28,height:28,background:"linear-gradient(135deg,var(--gd),var(--g))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12 }}>A</div>
            <div><div style={{ fontSize:11,fontWeight:600 }}>Administrador</div><div style={{ fontSize:9,color:"var(--g)" }}>Super Admin</div></div>
          </div>
        </div>

        <div style={{ padding:20 }}>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard"&&(
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:13,marginBottom:20 }}>
                {[{l:"Leads",v:leads.length,i:"📩",c:"#C9A84C"},{l:"Agendamentos",v:appts.length,i:"📅",c:"#5588E0"},{l:"Conversas",v:chats.length,i:"💬",c:"#55C490"},{l:"Online Agora",v:visitors,i:"👥",c:"#E05555"}].map((s,i)=>(
                  <div key={i} className="ac" style={{ padding:18,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div><div style={{ fontSize:9,color:"var(--wd)",letterSpacing:1,marginBottom:4 }}>{s.l.toUpperCase()}</div><div style={{ fontFamily:"var(--fd)",fontSize:38,color:s.c,lineHeight:1 }}>{s.v}</div></div>
                    <div style={{ fontSize:22,opacity:.45 }}>{s.i}</div>
                  </div>
                ))}
              </div>
              {leads.length===0&&appts.length===0&&chats.length===0?(
                <div className="empty"><div className="empty-icon">🚀</div><p>Painel pronto para uso real.<br/>Os dados aparecerão quando clientes interagirem com o site.</p></div>
              ):(
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                  {leads.length>0&&(
                    <div className="ac" style={{ padding:18 }}>
                      <div style={{ fontFamily:"var(--fd)",letterSpacing:2,marginBottom:13,fontSize:12 }}>ÚLTIMOS LEADS</div>
                      {leads.slice(-6).reverse().map((l:any,i:number)=>(
                        <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.05)" }}>
                          <div><div style={{ fontSize:12,fontWeight:600 }}>{l.name}</div><div style={{ fontSize:10,color:"var(--wd)" }}>{l.company}</div></div>
                          <span className={`sb ${l.status==="closed"?"sf":l.status==="hot"?"sh":"sn"}`}>{l.status||"novo"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {appts.length>0&&(
                    <div className="ac" style={{ padding:18 }}>
                      <div style={{ fontFamily:"var(--fd)",letterSpacing:2,marginBottom:13,fontSize:12 }}>AGENDAMENTOS RECENTES</div>
                      {appts.slice(-6).reverse().map((a:any,i:number)=>(
                        <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.05)" }}>
                          <div><div style={{ fontSize:12,fontWeight:600 }}>{a.name}</div><div style={{ fontSize:10,color:"var(--wd)" }}>{a.date||"sem data"} {a.time||""}</div></div>
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
          {tab==="leads"&&(
            <div>
              <div style={{ display:"flex",gap:9,marginBottom:16 }}>
                <input className="inp" style={{ maxWidth:240 }} placeholder="🔍 Buscar nome ou empresa..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              {filtered.length===0?(
                <div className="empty"><div className="empty-icon">📩</div><p>Nenhum lead ainda.<br/>Aparecerão aqui quando clientes preencherem o formulário de agendamento.</p></div>
              ):(
                <div className="ac" style={{ overflow:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",minWidth:700 }}>
                    <thead><tr>{["Cliente","Empresa","Contato","Faturamento","Desafio","Data","Status","Notas",""].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                    <tbody>
                      {filtered.map((l:any,i:number)=>(
                        <tr key={i} className="trow" style={{ borderBottom:"1px solid rgba(255,255,255,.03)" }}>
                          <Td><div style={{ fontWeight:600 }}>{l.name}</div><div style={{ fontSize:10,color:"var(--wd)",marginTop:1 }}>{l.email}</div></Td>
                          <Td style={{ color:"var(--wd)" }}>{l.company}</Td>
                          <Td style={{ color:"var(--wd)",fontSize:11 }}>{l.phone||"—"}</Td>
                          <Td style={{ color:"var(--g)",fontWeight:600 }}>{l.revenue||"—"}</Td>
                          <Td style={{ color:"var(--wd)",maxWidth:150 }}>{l.problem}</Td>
                          <Td style={{ color:"var(--wd)",fontSize:11,whiteSpace:"nowrap" }}>{l.createdAt?.split(",")[0]||"—"}</Td>
                          <Td>
                            <select value={l.status||"new"} onChange={e=>setLeads((p:any[])=>p.map((x:any)=>x.id===l.id?{...x,status:e.target.value}:x))} style={{ background:"var(--b4)",color:"var(--w)",border:"1px solid rgba(201,168,76,.18)",padding:"3px 7px",fontSize:10,cursor:"pointer",outline:"none" }}>
                              <option value="new">Novo</option><option value="hot">Quente 🔥</option><option value="contact">Em Contato</option><option value="closed">Fechado ✓</option>
                            </select>
                          </Td>
                          <Td>
                            <button onClick={()=>setNotesClient({...l,notes:l.notes||[]})} style={{ padding:"4px 10px",background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",color:"var(--g)",cursor:"pointer",fontSize:10,borderRadius:2,whiteSpace:"nowrap" }}>
                              📝 {(l.notes||[]).length} nota{(l.notes||[]).length!==1?"s":""}
                            </button>
                          </Td>
                          <Td><button onClick={()=>setLeads((p:any[])=>p.filter((x:any)=>x.id!==l.id))} style={{ padding:"4px 8px",background:"rgba(220,85,85,.08)",border:"1px solid rgba(220,85,85,.2)",color:"#FF8080",cursor:"pointer",fontSize:10,borderRadius:2 }}>🗑</button></Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CHAT ── */}
          {tab==="chat"&&(
            <div style={{ display:"grid",gridTemplateColumns:"245px 1fr",gap:14,height:"calc(100vh - 170px)" }}>
              <div className="ac" style={{ overflow:"hidden",display:"flex",flexDirection:"column" }}>
                <div style={{ padding:"12px 14px",borderBottom:"1px solid rgba(201,168,76,.08)",fontFamily:"var(--fd)",letterSpacing:2,fontSize:11,flexShrink:0 }}>CONVERSAS</div>
                <div style={{ overflow:"auto",flex:1 }}>
                  {chats.length===0&&<div style={{ padding:"28px 14px",textAlign:"center",color:"var(--wd)",fontSize:12 }}><div style={{ fontSize:26,marginBottom:7 }}>💬</div>Aguardando mensagens dos visitantes...</div>}
                  {chats.map((c:any)=>(
                    <div key={c.id} onClick={()=>{setActiveConv(c.id);setChats((p:any[])=>p.map((x:any)=>x.id===c.id?{...x,unread:0}:x));}}
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

              <div className="ac" style={{ display:"flex",flexDirection:"column",overflow:"hidden" }}>
                {!activeConv?(
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:9,color:"var(--wd)" }}>
                    <span style={{ fontSize:38 }}>💬</span><p style={{ fontSize:13 }}>Selecione uma conversa para responder</p>
                  </div>
                ):(()=>{
                  const conv = chats.find((c:any)=>c.id===activeConv);
                  return <>
                    <div style={{ padding:"12px 16px",borderBottom:"1px solid rgba(201,168,76,.08)",display:"flex",alignItems:"center",gap:9,flexShrink:0 }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,var(--gd),var(--g))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12 }}>{conv?.avatar}</div>
                      <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:13 }}>{conv?.user}</div><div style={{ fontSize:9,color:"var(--green)" }}>● Online</div></div>
                      <button onClick={()=>setNotesClient(leads.find((l:any)=>l.name===conv?.user)||{id:conv?.id,name:conv?.user||"",company:"",email:"",phone:"",revenue:"",problem:"",notes:[]})}
                        style={{ padding:"4px 11px",background:"rgba(201,168,76,.07)",border:"1px solid rgba(201,168,76,.2)",color:"var(--g)",cursor:"pointer",fontSize:10,borderRadius:2 }}>📝 Notas</button>
                    </div>
                    <div style={{ flex:1,overflow:"auto",padding:14,display:"flex",flexDirection:"column",gap:7 }}>
                      {conv?.msgs.map((m:any,i:number)=>(
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

          {/* ── AGENDAMENTOS ── */}
          {tab==="appointments"&&(
            appts.length===0?(
              <div className="empty"><div className="empty-icon">📅</div><p>Nenhum agendamento ainda.<br/>Aparecerão aqui quando clientes usarem o formulário do site.</p></div>
            ):(
              <div className="ac" style={{ overflow:"auto" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",minWidth:620 }}>
                  <thead><tr>{["Cliente","Empresa","E-mail","WhatsApp","Data","Hora","Faturamento","Desafio","Status","Ações"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {appts.map((a:any,i:number)=>(
                      <tr key={i} className="trow" style={{ borderBottom:"1px solid rgba(255,255,255,.03)" }}>
                        <Td><div style={{ fontWeight:600 }}>{a.name}</div></Td>
                        <Td style={{ color:"var(--wd)" }}>{a.company}</Td>
                        <Td style={{ color:"var(--wd)",fontSize:11 }}>{a.email}</Td>
                        <Td style={{ color:"var(--wd)",fontSize:11 }}>{a.phone||"—"}</Td>
                        <Td style={{ color:"var(--g)",fontWeight:600,whiteSpace:"nowrap" }}>{a.date||"—"}</Td>
                        <Td>{a.time||"—"}</Td>
                        <Td style={{ color:"var(--g)" }}>{a.revenue||"—"}</Td>
                        <Td style={{ color:"var(--wd)",maxWidth:160 }}>{a.problem}</Td>
                        <Td><span className={`sb ${a.status==="confirmed"?"sf":"sn"}`}>{a.status==="confirmed"?"Confirmado":"Pendente"}</span></Td>
                        <Td>
                          <div style={{ display:"flex",gap:5 }}>
                            <button onClick={()=>setAppts((p:any[])=>p.map((x:any)=>x.id===a.id?{...x,status:"confirmed"}:x))} style={{ padding:"3px 9px",background:"rgba(85,196,144,.08)",border:"1px solid rgba(85,196,144,.2)",color:"#88DDAA",cursor:"pointer",fontSize:10,borderRadius:2 }}>✓ Confirmar</button>
                            <button onClick={()=>setAppts((p:any[])=>p.filter((x:any)=>x.id!==a.id))} style={{ padding:"3px 7px",background:"rgba(220,85,85,.08)",border:"1px solid rgba(220,85,85,.2)",color:"#FF8080",cursor:"pointer",fontSize:10,borderRadius:2 }}>🗑</button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── CONTEÚDO ── */}
          {tab==="content"&&(
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <div className="ac" style={{ padding:20 }}>
                <div style={{ fontFamily:"var(--fd)",letterSpacing:2,marginBottom:15,fontSize:12 }}>TEXTOS DO SITE</div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {[["HEADLINE","Transformamos empresas quebradas em máquinas de lucro"],["SUBHEADLINE","Método exclusivo de reestruturação financeira e marketing"],["BOTÃO CTA","Agendar Diagnóstico Gratuito"]].map(([l,v])=>(
                    <div key={l}><label style={{ fontSize:9,letterSpacing:1,color:"var(--g)",display:"block",marginBottom:5 }}>{l}</label>
                    {l==="SUBHEADLINE"?<textarea className="inp" rows={2} defaultValue={v} style={{resize:"vertical"}}/>:<input className="inp" defaultValue={v}/>}</div>
                  ))}
                  <button className="bg" style={{ justifyContent:"center" }}>💾 Salvar</button>
                </div>
              </div>
              <div className="ac" style={{ padding:20 }}>
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

          {/* ── TEMPO REAL ── */}
          {tab==="live"&&(
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <div className="ac" style={{ padding:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:14 }}>
                  <span className="live-dot"/><div style={{ fontFamily:"var(--fd)",letterSpacing:2,fontSize:12 }}>VISITANTES AGORA</div>
                </div>
                <div style={{ fontFamily:"var(--fd)",fontSize:76,color:"var(--green)",marginBottom:3,lineHeight:1 }}>{visitors}</div>
                <div style={{ fontSize:10,color:"var(--wd)",letterSpacing:1,marginBottom:20 }}>PESSOAS NO SITE AGORA</div>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  {[["🏠 Página Inicial",Math.floor(visitors*.44)],["💼 Serviços",Math.floor(visitors*.22)],["📊 Resultados",Math.floor(visitors*.18)],["📅 Agendamento",Math.floor(visitors*.16)]].map(([pg,n])=>(
                    <div key={pg as string} style={{ display:"flex",justifyContent:"space-between",padding:"6px 10px",background:"var(--b4)",borderLeft:"2px solid var(--g)" }}>
                      <span style={{ fontSize:12 }}>{pg}</span><span style={{ fontSize:12,color:"var(--g)",fontWeight:600 }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ac" style={{ padding:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:14 }}>
                  <span className="live-dot"/><div style={{ fontFamily:"var(--fd)",letterSpacing:2,fontSize:12 }}>ATIVIDADE RECENTE</div>
                </div>
                {[...leads.slice(-3).map((l:any)=>({icon:"📩",text:`Lead: ${l.name} — ${l.company}`,time:l.createdAt?.split(",")[0]||"—"})),...appts.slice(-3).map((a:any)=>({icon:"📅",text:`Agend: ${a.name} — ${a.date||"sem data"}`,time:a.createdAt?.split(",")[0]||"—"})),...chats.slice(-2).map((c:any)=>({icon:"💬",text:`Chat: ${c.user} (${c.msgs.length} msg)`,time:"—"}))].length===0?(
                  <div style={{ padding:"28px 0",textAlign:"center",color:"var(--wd)",fontSize:12 }}><div style={{ fontSize:28,marginBottom:7 }}>📡</div>Nenhuma atividade ainda.</div>
                ):[...leads.slice(-3).map((l:any)=>({icon:"📩",text:`Lead: ${l.name} — ${l.company}`,time:l.createdAt?.split(",")[0]||"—"})),...appts.slice(-3).map((a:any)=>({icon:"📅",text:`Agend: ${a.name} — ${a.date||"sem data"}`,time:a.createdAt?.split(",")[0]||"—"})),...chats.slice(-2).map((c:any)=>({icon:"💬",text:`Chat: ${c.user} (${c.msgs.length} msg)`,time:"—"}))].reverse().slice(0,8).map((ev:any,i:number)=>(
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

// ─── ADMIN ROOT ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [logged, setLogged] = useState(() => {
    const auth = LS.get(KEYS.auth, null);
    if (!auth) return false;
    // Session expires after 8 hours
    return auth.logged && (Date.now() - auth.ts) < 8 * 60 * 60 * 1000;
  });

  const logout = () => {
    LS.set(KEYS.auth, null);
    setLogged(false);
  };

  if (!logged) return <Login onLogin={() => setLogged(true)} />;
  return <Panel onLogout={logout} />;
}
