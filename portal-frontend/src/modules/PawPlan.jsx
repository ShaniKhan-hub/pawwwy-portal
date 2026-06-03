import { useState, useMemo } from "react";

// ── Palette & helpers ──────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};
const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[+m - 1]} ${y}`;
};
const daysLeft = (iso) => {
  const diff = Math.ceil((new Date(iso) - new Date(today())) / 86400000);
  return diff;
};

const CATEGORIES = ["Assignment","Quiz","Project","Exam","Mids","Finals","Other"];
const PRIORITIES  = ["High","Medium","Low"];
const STATUSES    = ["Pending","In Progress","Completed"];

const CAT_COLORS = {
  Assignment: "#D97B4F", Quiz: "#5C8A6E", Project: "#6A7FBF",
  Exam: "#B05E5E", Mids: "#8E6BBF", Finals: "#B07A36", Other: "#7A9AAE",
};
const PRI_COLORS = { High: "#C0392B", Medium: "#E67E22", Low: "#27AE60" };
const STATUS_COLORS = { Pending:"#9B8EA0", "In Progress":"#3A7BD5", Completed:"#27AE60" };

let _idSeq = 6;
const newId = () => _idSeq++;

const SEED = [
  { id:1, title:"OOP Assignment 1",  desc:"9 class design problems",   category:"Assignment", priority:"High",   status:"Pending",     deadline: addDays(2),   createdAt: today() },
  { id:2, title:"CALD Lab Report 6", desc:"K-map simplification",       category:"Assignment", priority:"Medium", status:"In Progress",  deadline: addDays(5),   createdAt: today() },
  { id:3, title:"Calculus Quiz",      desc:"Chapter 3 derivatives",     category:"Quiz",       priority:"High",   status:"Pending",     deadline: addDays(1),   createdAt: today() },
  { id:4, title:"English Essay",      desc:"Final draft submission",    category:"Assignment", priority:"Low",    status:"Completed",   deadline: addDays(10),  createdAt: today() },
  { id:5, title:"Mid-Term Exam",      desc:"All subjects covered",      category:"Mids",       priority:"High",   status:"Pending",     deadline: addDays(-1),  createdAt: today() },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    paw: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 13.5c-2.5 0-4.5 1.8-4.5 4 0 1.4.7 2 1.8 2 .7 0 1.5-.3 2.7-.3s2 .3 2.7.3c1.1 0 1.8-.6 1.8-2 0-2.2-2-4-4.5-4zm-5-3c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5.5 7.4 5.5 8.5 6.2 10.5 7 10.5zm10 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zM8.5 9C9.3 9 10 8.1 10 7s-.7-2-1.5-2S7 5.9 7 7s.7 2 1.5 2zm7 0C16.3 9 17 8.1 17 7s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    sort: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5H3m14 4H3m7 4H3m11 4H3M17 3l4 4-4 4"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><triangle points="10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };
  return icons[name] || null;
};

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(45,35,25,0.55)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"1rem",
      animation:"fadeIn .18s ease"
    }}>
      <div style={{
        background:"#FFFAF4", borderRadius:"20px", padding:"2rem", width:"100%", maxWidth:"520px",
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.18)",
        border:"1.5px solid #E8DDD0", animation:"slideUp .2s ease"
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem"}}>
          <h2 style={{margin:0, fontFamily:"'Playfair Display', serif", fontSize:"1.35rem", color:"#2A1F14"}}>{title}</h2>
          <button onClick={onClose} style={{background:"none", border:"none", cursor:"pointer", color:"#8C7B6B", padding:"4px"}}>
            <Icon name="x" size={20}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Task Form ─────────────────────────────────────────────────────────────────
function TaskForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    title:"", desc:"", category:"Assignment", priority:"High", deadline: addDays(7), status:"Pending"
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = {
    width:"100%", padding:"10px 14px", borderRadius:"10px", border:"1.5px solid #D8CDBE",
    background:"#FFF8F0", fontFamily:"'DM Sans', sans-serif", fontSize:"0.92rem",
    color:"#2A1F14", outline:"none", boxSizing:"border-box", transition:"border-color .2s",
  };
  const labelStyle = { display:"block", marginBottom:"5px", fontFamily:"'DM Sans', sans-serif",
    fontSize:"0.8rem", fontWeight:"600", color:"#7A6A5A", textTransform:"uppercase", letterSpacing:".06em" };

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
      <div>
        <label style={labelStyle}>Title *</label>
        <input style={inputStyle} value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Task title…"/>
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea style={{...inputStyle, minHeight:"72px", resize:"vertical"}} value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="What needs to be done…"/>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
        <div>
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} value={form.category} onChange={e=>set("category",e.target.value)}>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Priority</label>
          <select style={inputStyle} value={form.priority} onChange={e=>set("priority",e.target.value)}>
            {PRIORITIES.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
        <div>
          <label style={labelStyle}>Deadline</label>
          <input style={inputStyle} type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)}/>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={e=>set("status",e.target.value)}>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex", gap:"0.75rem", justifyContent:"flex-end", marginTop:"0.5rem"}}>
        <button onClick={onClose} style={{
          padding:"10px 20px", borderRadius:"10px", border:"1.5px solid #D8CDBE",
          background:"transparent", cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
          fontSize:"0.9rem", color:"#7A6A5A", fontWeight:"600"
        }}>Cancel</button>
        <button onClick={()=>{ if(!form.title.trim()) return alert("Title is required."); onSave(form); }} style={{
          padding:"10px 24px", borderRadius:"10px", border:"none", cursor:"pointer",
          background:"linear-gradient(135deg,#5C7A3E,#3D5A26)", color:"white",
          fontFamily:"'DM Sans', sans-serif", fontSize:"0.9rem", fontWeight:"700",
          boxShadow:"0 4px 14px rgba(60,90,38,.35)"
        }}>Save Task</button>
      </div>
    </div>
  );
}

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, onEdit, onDelete, onView, onStatusChange }) {
  const days = daysLeft(task.deadline);
  const overdue = days < 0 && task.status !== "Completed";
  const dueSoon = days >= 0 && days <= 3 && task.status !== "Completed";

  const deadlineTag = task.status === "Completed"
    ? { text:"Done ✓", bg:"#E8F5E9", color:"#2E7D32" }
    : overdue
    ? { text:`${Math.abs(days)}d overdue`, bg:"#FDECEA", color:"#C62828" }
    : dueSoon
    ? { text:`${days}d left`, bg:"#FFF3E0", color:"#E65100" }
    : { text:`${days}d left`, bg:"#F3F4F6", color:"#6B7280" };

  return (
    <div style={{
      background:"#FFFDF9", borderRadius:"16px", padding:"1.1rem 1.25rem",
      border:`1.5px solid ${overdue ? "#F5C6C6" : dueSoon ? "#FAD9A6" : "#EDE6DC"}`,
      display:"flex", flexDirection:"column", gap:"0.7rem",
      boxShadow: overdue ? "0 2px 12px rgba(198,40,40,.08)" : "0 2px 8px rgba(0,0,0,.04)",
      transition:"transform .15s, box-shadow .15s",
      animation:"cardIn .3s ease",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.09)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow= overdue?"0 2px 12px rgba(198,40,40,.08)":"0 2px 8px rgba(0,0,0,.04)"; }}
    >
      {/* Top row */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem"}}>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:"flex", alignItems:"center", gap:"0.5rem", flexWrap:"wrap", marginBottom:"0.3rem"}}>
            <span style={{
              background: CAT_COLORS[task.category] + "22",
              color: CAT_COLORS[task.category],
              padding:"2px 9px", borderRadius:"20px", fontSize:"0.72rem", fontWeight:"700",
              fontFamily:"'DM Sans', sans-serif", letterSpacing:".04em"
            }}>{task.category}</span>
            <span style={{
              background: PRI_COLORS[task.priority] + "18",
              color: PRI_COLORS[task.priority],
              padding:"2px 9px", borderRadius:"20px", fontSize:"0.72rem", fontWeight:"700",
              fontFamily:"'DM Sans', sans-serif", letterSpacing:".04em"
            }}>{task.priority}</span>
          </div>
          <h3 style={{
            margin:0, fontFamily:"'Playfair Display', serif", fontSize:"1rem",
            color: task.status === "Completed" ? "#9E9E9E" : "#2A1F14",
            textDecoration: task.status === "Completed" ? "line-through" : "none",
            lineHeight:1.3
          }}>{task.title}</h3>
          {task.desc && <p style={{margin:"0.3rem 0 0", fontSize:"0.82rem", color:"#9E8E7E", fontFamily:"'DM Sans', sans-serif", lineHeight:1.4}}>{task.desc}</p>}
        </div>
        {/* Actions */}
        <div style={{display:"flex", gap:"4px", flexShrink:0}}>
          {[{n:"eye",fn:onView,c:"#7A9AAE"},{n:"edit",fn:onEdit,c:"#5C8A6E"},{n:"trash",fn:onDelete,c:"#C0392B"}].map(({n,fn,c})=>(
            <button key={n} onClick={fn} style={{
              background:"none", border:"none", cursor:"pointer", color:c, padding:"5px",
              borderRadius:"8px", transition:"background .15s", opacity:.75
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=c+"18"; e.currentTarget.style.opacity="1"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.opacity=".75"; }}
            ><Icon name={n} size={15}/></button>
          ))}
        </div>
      </div>
      {/* Bottom row */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center", gap:"5px", color:"#9E8E7E"}}>
          <Icon name="clock" size={13}/>
          <span style={{fontSize:"0.78rem", fontFamily:"'DM Sans', sans-serif"}}>{fmtDate(task.deadline)}</span>
          <span style={{
            marginLeft:"4px", padding:"1px 8px", borderRadius:"20px", fontSize:"0.72rem",
            fontWeight:"700", background: deadlineTag.bg, color: deadlineTag.color,
            fontFamily:"'DM Sans', sans-serif"
          }}>{deadlineTag.text}</span>
        </div>
        <select value={task.status} onChange={e=>onStatusChange(e.target.value)} style={{
          border:"1.5px solid #E0D4C4", borderRadius:"8px", padding:"3px 8px", fontSize:"0.75rem",
          background: STATUS_COLORS[task.status] + "18", color: STATUS_COLORS[task.status],
          fontFamily:"'DM Sans', sans-serif", fontWeight:"700", cursor:"pointer", outline:"none"
        }}>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background:"#FFFDF9", borderRadius:"16px", padding:"1.2rem 1.4rem",
      border:"1.5px solid #EDE6DC", flex:"1 1 120px",
      boxShadow:"0 2px 8px rgba(0,0,0,.04)"
    }}>
      <div style={{fontFamily:"'Playfair Display', serif", fontSize:"2rem", fontWeight:"700", color, lineHeight:1}}>{value}</div>
      <div style={{marginTop:"5px", fontFamily:"'DM Sans', sans-serif", fontSize:"0.78rem", color:"#9E8E7E", fontWeight:"600", textTransform:"uppercase", letterSpacing:".06em"}}>{label}</div>
      {sub && <div style={{marginTop:"2px", fontFamily:"'DM Sans', sans-serif", fontSize:"0.72rem", color:color, opacity:.8}}>{sub}</div>}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function PawPlan() {
  const [tasks, setTasks] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterPri, setFilterPri] = useState("All");
  const [filterSta, setFilterSta] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "detail" | "report"
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("tasks"); // "tasks" | "reminders"

  // ── CRUD ──
  const addTask = (form) => {
    const t = { id: newId(), title: form.title.trim(), desc: form.desc.trim(),
      category: form.category, priority: form.priority, status: form.status,
      deadline: form.deadline, createdAt: today() };
    setTasks(ts => [...ts, t]);
    setModal(null);
  };
  const editTask = (form) => {
    setTasks(ts => ts.map(t => t.id === selected.id
      ? { ...t, title: form.title.trim(), desc: form.desc.trim(),
          category: form.category, priority: form.priority,
          status: form.status, deadline: form.deadline }
      : t));
    setModal(null);
  };
  const deleteTask = (id) => {
    if (!confirm("Delete this task?")) return;
    setTasks(ts => ts.filter(t => t.id !== id));
  };
  const changeStatus = (id, status) => {
    setTasks(ts => ts.map(t => t.id === id ? {...t, status} : t));
  };

  // ── Stats ──
  const total     = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue   = tasks.filter(t => daysLeft(t.deadline) < 0 && t.status !== "Completed").length;
  const dueSoon   = tasks.filter(t => { const d=daysLeft(t.deadline); return d>=0&&d<=3&&t.status!=="Completed"; }).length;
  const pct       = total ? Math.round((completed / total) * 100) : 0;

  // ── Filtered & Sorted ──
  const visible = useMemo(() => {
    let list = [...tasks];
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw));
    }
    if (filterCat !== "All") list = list.filter(t => t.category === filterCat);
    if (filterPri !== "All") list = list.filter(t => t.priority === filterPri);
    if (filterSta !== "All") list = list.filter(t => t.status === filterSta);
    if (sortBy === "deadline") list.sort((a,b)=>a.deadline.localeCompare(b.deadline));
    else if (sortBy === "priority") {
      const ord = {High:0,Medium:1,Low:2};
      list.sort((a,b)=>ord[a.priority]-ord[b.priority]);
    }
    return list;
  }, [tasks, search, filterCat, filterPri, filterSta, sortBy]);

  // ── UI ──
  const btnStyle = (active) => ({
    padding:"7px 16px", borderRadius:"9px", border:"none", cursor:"pointer",
    fontFamily:"'DM Sans', sans-serif", fontSize:"0.82rem", fontWeight:"700",
    background: active ? "linear-gradient(135deg,#5C7A3E,#3D5A26)" : "#F0E9DF",
    color: active ? "white" : "#7A6A5A",
    transition:"all .15s"
  });

  const selStyle = {
    padding:"7px 12px", borderRadius:"9px", border:"1.5px solid #DDD4C8",
    background:"#FFFDF9", fontFamily:"'DM Sans', sans-serif", fontSize:"0.82rem",
    color:"#5A4A3A", outline:"none", cursor:"pointer"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#F4EDE0; min-height:100vh; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#C8B89A;border-radius:3px}
        select, input { font-size:inherit; }
      `}</style>

      <div style={{
        minHeight:"100vh", background:"#F4EDE0",
        backgroundImage:"radial-gradient(circle at 20% 20%, rgba(92,122,62,.07) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(196,130,79,.07) 0%, transparent 60%)",
        fontFamily:"'DM Sans', sans-serif", padding:"0 0 3rem"
      }}>

        {/* ── Header ── */}
        <header style={{
          background:"linear-gradient(135deg,#3D5A26 0%,#5C7A3E 60%,#4A6830 100%)",
          padding:"1.5rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:"1rem",
          boxShadow:"0 4px 24px rgba(45,80,22,.25)"
        }}>
          <div style={{display:"flex", alignItems:"center", gap:"0.75rem"}}>
            <div style={{
              width:"44px", height:"44px", borderRadius:"12px",
              background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.5rem"
            }}>🐾</div>
            <div>
              <h1 style={{fontFamily:"'Playfair Display', serif", fontSize:"1.55rem", color:"white", letterSpacing:".02em"}}>PawPlan</h1>
              <p style={{fontSize:"0.72rem", color:"rgba(255,255,255,.65)", fontWeight:"600", letterSpacing:".08em", textTransform:"uppercase"}}>Student Deadline Tracker</p>
            </div>
          </div>
          <button onClick={()=>{ setSelected(null); setModal("add"); }} style={{
            display:"flex", alignItems:"center", gap:"7px",
            padding:"10px 20px", borderRadius:"11px", border:"none", cursor:"pointer",
            background:"rgba(255,255,255,.18)", color:"white", fontFamily:"'DM Sans', sans-serif",
            fontSize:"0.9rem", fontWeight:"700", backdropFilter:"blur(4px)",
            boxShadow:"0 2px 8px rgba(0,0,0,.1)", transition:"background .15s"
          }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.28)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.18)"}
          >
            <Icon name="plus" size={16}/> Add Task
          </button>
        </header>

        <div style={{maxWidth:"960px", margin:"0 auto", padding:"2rem 1.5rem 0"}}>

          {/* ── Stats ── */}
          <div style={{display:"flex", gap:"0.9rem", flexWrap:"wrap", marginBottom:"1.5rem"}}>
            <StatCard label="Total" value={total} color="#5C7A3E"/>
            <StatCard label="Completed" value={completed} color="#27AE60" sub={`${pct}%`}/>
            <StatCard label="Overdue" value={overdue} color="#C62828"/>
            <StatCard label="Due Soon" value={dueSoon} color="#E67E22" sub="≤ 3 days"/>
          </div>

          {/* ── Progress Bar ── */}
          <div style={{background:"#FFFDF9", borderRadius:"16px", padding:"1.1rem 1.4rem",
            border:"1.5px solid #EDE6DC", marginBottom:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem"}}>
              <span style={{fontFamily:"'DM Sans', sans-serif", fontSize:"0.8rem", fontWeight:"700", color:"#7A6A5A", textTransform:"uppercase", letterSpacing:".06em"}}>Overall Progress</span>
              <span style={{fontFamily:"'Playfair Display', serif", fontSize:"1.1rem", fontWeight:"700", color:"#5C7A3E"}}>{pct}%</span>
            </div>
            <div style={{height:"10px", background:"#EDE6DC", borderRadius:"99px", overflow:"hidden"}}>
              <div style={{
                height:"100%", borderRadius:"99px", width:`${pct}%`,
                background:"linear-gradient(90deg,#5C7A3E,#8CB85A)",
                transition:"width .6s cubic-bezier(.4,0,.2,1)"
              }}/>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{display:"flex", gap:"0.5rem", marginBottom:"1.2rem"}}>
            <button onClick={()=>setTab("tasks")} style={btnStyle(tab==="tasks")}>
              <span style={{display:"flex", alignItems:"center", gap:"6px"}}><Icon name="filter" size={13}/> Tasks</span>
            </button>
            <button onClick={()=>setTab("reminders")} style={{
              ...btnStyle(tab==="reminders"),
              background: tab==="reminders" ? "linear-gradient(135deg,#C0392B,#96281B)" : undefined
            }}>
              <span style={{display:"flex", alignItems:"center", gap:"6px"}}>
                <Icon name="bell" size={13}/> Reminders
                {(overdue+dueSoon)>0 && <span style={{
                  background:"#C62828", color:"white", borderRadius:"99px",
                  padding:"1px 6px", fontSize:"0.7rem", fontWeight:"700",
                  marginLeft:2
                }}>{overdue+dueSoon}</span>}
              </span>
            </button>
            <button onClick={()=>setModal("report")} style={{...btnStyle(false), marginLeft:"auto"}}>
              <span style={{display:"flex", alignItems:"center", gap:"6px"}}><Icon name="chart" size={13}/> Report</span>
            </button>
          </div>

          {tab === "reminders" ? (
            // ── Reminders Tab ──
            <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
              {overdue === 0 && dueSoon === 0
                ? <div style={{textAlign:"center", padding:"3rem", color:"#9E8E7E", fontFamily:"'Playfair Display', serif", fontSize:"1.1rem"}}>
                    ✅ No urgent reminders. You're on track!
                  </div>
                : <>
                  {tasks.filter(t=>daysLeft(t.deadline)<0&&t.status!=="Completed").map(t=>(
                    <div key={t.id} style={{background:"#FDECEA", border:"1.5px solid #F5C6C6", borderRadius:"14px", padding:"1rem 1.2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:"0.75rem", fontWeight:"700", color:"#C62828", textTransform:"uppercase", letterSpacing:".06em", marginBottom:"2px"}}>⚠️ Overdue by {Math.abs(daysLeft(t.deadline))} day(s)</div>
                        <div style={{fontFamily:"'Playfair Display', serif", color:"#2A1F14"}}>{t.title}</div>
                        <div style={{fontSize:"0.78rem", color:"#9E8E7E"}}>Due {fmtDate(t.deadline)}</div>
                      </div>
                      <select value={t.status} onChange={e=>changeStatus(t.id,e.target.value)} style={{...selStyle, fontSize:"0.78rem"}}>
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                  {tasks.filter(t=>{const d=daysLeft(t.deadline);return d>=0&&d<=3&&t.status!=="Completed";}).map(t=>(
                    <div key={t.id} style={{background:"#FFF8E7", border:"1.5px solid #FAD9A6", borderRadius:"14px", padding:"1rem 1.2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:"0.75rem", fontWeight:"700", color:"#E65100", textTransform:"uppercase", letterSpacing:".06em", marginBottom:"2px"}}>🔔 Due in {daysLeft(t.deadline)} day(s)</div>
                        <div style={{fontFamily:"'Playfair Display', serif", color:"#2A1F14"}}>{t.title}</div>
                        <div style={{fontSize:"0.78rem", color:"#9E8E7E"}}>Due {fmtDate(t.deadline)}</div>
                      </div>
                      <select value={t.status} onChange={e=>changeStatus(t.id,e.target.value)} style={{...selStyle, fontSize:"0.78rem"}}>
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </>
              }
            </div>
          ) : (
            // ── Tasks Tab ──
            <>
              {/* Search + Filters */}
              <div style={{
                background:"#FFFDF9", borderRadius:"16px", padding:"1rem 1.2rem",
                border:"1.5px solid #EDE6DC", marginBottom:"1.2rem",
                display:"flex", flexWrap:"wrap", gap:"0.7rem", alignItems:"center",
                boxShadow:"0 2px 8px rgba(0,0,0,.04)"
              }}>
                <div style={{position:"relative", flex:"1 1 180px"}}>
                  <span style={{position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"#B0A090"}}>
                    <Icon name="search" size={15}/>
                  </span>
                  <input
                    style={{...selStyle, paddingLeft:"34px", width:"100%", fontFamily:"'DM Sans', sans-serif"}}
                    placeholder="Search tasks…" value={search} onChange={e=>setSearch(e.target.value)}
                  />
                </div>
                <select style={selStyle} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
                  <option>All</option>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
                <select style={selStyle} value={filterPri} onChange={e=>setFilterPri(e.target.value)}>
                  <option>All</option>
                  {PRIORITIES.map(p=><option key={p}>{p}</option>)}
                </select>
                <select style={selStyle} value={filterSta} onChange={e=>setFilterSta(e.target.value)}>
                  <option>All</option>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
                <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
                  <Icon name="sort" size={13}/>
                  <select style={selStyle} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    <option value="deadline">By Deadline</option>
                    <option value="priority">By Priority</option>
                  </select>
                </div>
              </div>

              {/* Task List */}
              {visible.length === 0
                ? <div style={{textAlign:"center", padding:"3rem", color:"#9E8E7E", fontFamily:"'Playfair Display', serif", fontSize:"1.1rem"}}>
                    No tasks found 🐾
                  </div>
                : <div style={{display:"flex", flexDirection:"column", gap:"0.8rem"}}>
                    {visible.map(t=>(
                      <TaskCard key={t.id} task={t}
                        onEdit={()=>{ setSelected(t); setModal("edit"); }}
                        onDelete={()=>deleteTask(t.id)}
                        onView={()=>{ setSelected(t); setModal("detail"); }}
                        onStatusChange={s=>changeStatus(t.id,s)}
                      />
                    ))}
                  </div>
              }
            </>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === "add" && (
        <Modal title="Add New Task" onClose={()=>setModal(null)}>
          <TaskForm onSave={addTask} onClose={()=>setModal(null)}/>
        </Modal>
      )}
      {modal === "edit" && selected && (
        <Modal title={`Edit Task #${selected.id}`} onClose={()=>setModal(null)}>
          <TaskForm initial={{title:selected.title, desc:selected.desc, category:selected.category,
            priority:selected.priority, status:selected.status, deadline:selected.deadline}}
            onSave={editTask} onClose={()=>setModal(null)}/>
        </Modal>
      )}
      {modal === "detail" && selected && (
        <Modal title={`Task #${selected.id} Details`} onClose={()=>setModal(null)}>
          {[
            ["Title", selected.title],
            ["Description", selected.desc || "—"],
            ["Category", selected.category],
            ["Priority", selected.priority],
            ["Status", selected.status],
            ["Deadline", fmtDate(selected.deadline)],
            ["Created", fmtDate(selected.createdAt)],
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex", gap:"1rem", padding:"0.6rem 0",
              borderBottom:"1px solid #EDE6DC", fontFamily:"'DM Sans', sans-serif"}}>
              <span style={{width:"110px", flexShrink:0, fontSize:"0.8rem", fontWeight:"700",
                color:"#9E8E7E", textTransform:"uppercase", letterSpacing:".06em", paddingTop:"1px"}}>{k}</span>
              <span style={{fontSize:"0.92rem", color:"#2A1F14"}}>{v}</span>
            </div>
          ))}
        </Modal>
      )}
      {modal === "report" && (
        <Modal title="Progress Report" onClose={()=>setModal(null)}>
          <div style={{display:"flex", flexDirection:"column", gap:"0.9rem", fontFamily:"'DM Sans', sans-serif"}}>
            {[
              ["Total Tasks", total, "#5C7A3E"],
              ["Completed", completed, "#27AE60"],
              ["Pending", tasks.filter(t=>t.status==="Pending").length, "#9B8EA0"],
              ["In Progress", tasks.filter(t=>t.status==="In Progress").length, "#3A7BD5"],
              ["Overdue", overdue, "#C62828"],
            ].map(([l,v,c])=>(
              <div key={l} style={{display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"0.6rem 0.9rem", borderRadius:"10px", background:c+"0F"}}>
                <span style={{fontSize:"0.88rem", color:"#5A4A3A", fontWeight:"600"}}>{l}</span>
                <span style={{fontFamily:"'Playfair Display', serif", fontSize:"1.1rem", fontWeight:"700", color:c}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:"0.5rem"}}>
              <div style={{fontSize:"0.8rem", fontWeight:"700", color:"#7A6A5A", textTransform:"uppercase",
                letterSpacing:".06em", marginBottom:"0.8rem"}}>By Category</div>
              {CATEGORIES.map(c=>{
                const cnt = tasks.filter(t=>t.category===c).length;
                if (!cnt) return null;
                const barPct = total ? (cnt/total)*100 : 0;
                return (
                  <div key={c} style={{display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.5rem"}}>
                    <span style={{width:"80px", fontSize:"0.78rem", color:"#9E8E7E", flexShrink:0}}>{c}</span>
                    <div style={{flex:1, height:"8px", background:"#EDE6DC", borderRadius:"99px", overflow:"hidden"}}>
                      <div style={{width:`${barPct}%`, height:"100%", background:CAT_COLORS[c], borderRadius:"99px"}}/>
                    </div>
                    <span style={{fontSize:"0.78rem", fontWeight:"700", color:"#5A4A3A", width:"20px", textAlign:"right"}}>{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
