/* staffSpace.jsx — Staff workspace: the private back-office for Kirsty & the core team.
   Centrepiece = the Ingestion Inbox: many on-ramps → one durable home → a triage step
   that files each incoming item into the library.
   Defines a global StaffSpace({signOut, switcher}). Prefix for new CSS: stf-. */

/* =====================================================================
   SOURCE PROVENANCE — each incoming item remembers where it came from.
   Distinct colour + icon per source; WeTransfer carries an expiry, which is
   the whole reason a durable copy is captured on arrival.
   ===================================================================== */
const STF_SOURCES = {
  dropbox:     {label:"Dropbox",       icon:"folder", color:"#0B6CFF", ephemeral:false},
  drive:       {label:"Google Drive",  icon:"layers", color:"#1F8A5B", ephemeral:false},
  wetransfer:  {label:"WeTransfer",    icon:"clock",  color:"#D9742B", ephemeral:true},
  email:       {label:"Email-in",      icon:"mail",   color:"#6B5BD2", ephemeral:false},
  upload:      {label:"Direct upload", icon:"download", color:"#157F69", ephemeral:false},
};

/* The on-ramps shown at the top of the inbox */
const STF_ONRAMPS = [
  {id:"upload", icon:"download", title:"Drag & drop", sub:"Drop files straight in — they land here for filing.", tag:null},
  {id:"link",   icon:"link",    title:"Paste a link", sub:"Dropbox · Drive · WeTransfer. We fetch a permanent copy.", tag:null},
  {id:"email",  icon:"mail",    title:"Email them in", sub:"Forward attachments to files@futurepartners.co.nz", tag:null},
  {id:"connect",icon:"globe",   title:"Connected folders", sub:"Auto-pull from a shared Drive or Dropbox.", tag:"Optional · later"},
];

/* The collections an item can be filed into (triage target) */
const STF_COLLECTIONS = ["Policies & governance","Templates","Guides & how-tos","Brand & collateral","Client deliverable","Financials & admin"];
const STF_AUDIENCES   = [
  {id:"client",    label:"Client"},
  {id:"associate", label:"Associate"},
  {id:"staff",     label:"Staff"},
  {id:"public",    label:"Public"},
];

/* =====================================================================
   THE INBOX — ~9 mock incoming items from real associates (PEOPLE), via
   many systems. Status: needs filing | filed. expiresIn marks rotting links.
   ===================================================================== */
const STF_INBOX = [
  {id:"i1", name:"Kōtui evaluation — final draft.docx",        type:"DOCX", source:"wetransfer", from:"eileen",   received:"Today · 09:12",   size:"4.2 MB",  status:"needs", expiresIn:2, suggest:"Client deliverable"},
  {id:"i2", name:"Nauru health systems — field photos.zip",     type:"ZIP",  source:"wetransfer", from:"david",    received:"Today · 08:47",   size:"312 MB", status:"needs", expiresIn:2, suggest:"Client deliverable"},
  {id:"i3", name:"Tuvalu fisheries HRD plan v4.docx",           type:"DOCX", source:"email",      from:"ian",      received:"Yesterday · 17:30",size:"1.1 MB",  status:"needs", expiresIn:null, suggest:"Client deliverable"},
  {id:"i4", name:"Niue GCF accreditation — financials.xlsx",    type:"XLSX", source:"dropbox",    from:"brucetta", received:"Yesterday · 14:05",size:"680 KB",  status:"needs", expiresIn:null, suggest:"Financials & admin"},
  {id:"i5", name:"Timor forestry strategy — annexes.pdf",       type:"PDF",  source:"drive",      from:"elvino",   received:"Yesterday · 11:18",size:"8.9 MB",  status:"needs", expiresIn:null, suggest:"Client deliverable"},
  {id:"i6", name:"Save the Children eval — inception report.pdf",type:"PDF",  source:"email",      from:"elisabeth",received:"2 days ago",      size:"2.3 MB",  status:"needs", expiresIn:null, suggest:"Client deliverable"},
  {id:"i7", name:"Updated capability statement.pdf",            type:"PDF",  source:"upload",     from:"kirsty",   received:"2 days ago",      size:"1.7 MB",  status:"needs", expiresIn:null, suggest:"Brand & collateral"},
  {id:"i8", name:"Pacific Broadcasting review — slide deck.pptx",type:"PPTX", source:"drive",      from:"faka",     received:"3 days ago",      size:"14 MB",   status:"needs", expiresIn:null, suggest:"Client deliverable"},
  {id:"i9", name:"MERL framework template v2.docx",             type:"DOCX", source:"dropbox",    from:"hilary",   received:"3 days ago",      size:"540 KB",  status:"needs", expiresIn:null, suggest:"Templates"},
  /* one already filed, to show the after-state */
  {id:"i10",name:"Child Safeguarding Policy v3.1.pdf",          type:"PDF",  source:"upload",     from:"kirsty",   received:"Last week",       size:"890 KB",  status:"filed", expiresIn:null, suggest:"Policies & governance", filedAs:{collection:"Policies & governance", audience:"associate", version:"v3.1"}},
];

/* =====================================================================
   WORKING DOCUMENTS — internal back-office, audience: staff. Lighter.
   ===================================================================== */
const STF_WORKING = [
  {group:"Proposals & pipeline", icon:"compass", docs:[
    {id:"w1", title:"Live proposals tracker", type:"XLSX", owner:"Kirsty Burnett", updated:"Today",      version:"live",  lifecycle:"current"},
    {id:"w2", title:"Pipeline — Q3 opportunities", type:"XLSX", owner:"Kirsty Burnett", updated:"This week", version:"live", lifecycle:"current"},
    {id:"w3", title:"MFAT panel — capability response (draft)", type:"DOCX", owner:"Kirsty Burnett", updated:"Yesterday", version:"v0.6", lifecycle:"draft"},
  ]},
  {group:"Engagement admin", icon:"clock", docs:[
    {id:"w4", title:"Engagement tracker — active assignments", type:"XLSX", owner:"Kirsty Burnett", updated:"Today", version:"live", lifecycle:"current"},
    {id:"w5", title:"Associate timesheets — June", type:"XLSX", owner:"Admin", updated:"This week", version:"live", lifecycle:"current"},
    {id:"w6", title:"Travel & in-country logistics log", type:"XLSX", owner:"Admin", updated:"Last week", version:"live", lifecycle:"current"},
  ]},
  {group:"Financials", icon:"layers", docs:[
    {id:"w7", title:"FY26 financial model", type:"XLSX", owner:"Kirsty Burnett", updated:"This week", version:"v3.2", lifecycle:"current"},
    {id:"w8", title:"Invoicing & receivables", type:"XLSX", owner:"Admin", updated:"Today", version:"live", lifecycle:"current"},
    {id:"w9", title:"Subcontractor rate card", type:"PDF", owner:"Kirsty Burnett", updated:"Mar 2026", version:"v1.4", lifecycle:"current"},
  ]},
  {group:"Contracts & agreements", icon:"shield", docs:[
    {id:"w10", title:"Associate agreement — master template", type:"DOCX", owner:"Kirsty Burnett", updated:"Feb 2026", version:"v2.1", lifecycle:"current"},
    {id:"w11", title:"Client MSA — signed register", type:"XLSX", owner:"Admin", updated:"This week", version:"live", lifecycle:"current"},
    {id:"w12", title:"NDA — standard form", type:"PDF", owner:"Admin", updated:"Jan 2026", version:"v1.2", lifecycle:"current"},
    {id:"w13", title:"2022 engagement contracts", type:"ZIP", owner:"Admin", updated:"2022", version:"final", lifecycle:"archived"},
  ]},
];

/* =====================================================================
   WEBSITE RUNBOOK — "how this website actually works". Kirsty asked for it.
   Real-ish, genuinely useful, clearly draft. Reader bodies reuse .mdoc-doc.
   ===================================================================== */
const STF_RUNBOOK = [
  {id:"r1", title:"Tech stack & architecture", type:"Web", icon:"layers", updated:"Jun 2026", summary:"What the site is built on today, and the planned production architecture.",
   body:[
     {p:"This page is an honest snapshot of how the Future Partners website is put together — today, and where it is heading. It is a working draft, kept current as decisions land."},
     {h:"Where we are today"},
     {p:"Right now the site you are reading is an in-browser prototype: a single HTML page that loads React 18 and Babel from a CDN and compiles the components live in the browser. There is no build step and no server application — every screen, and all the content, is JavaScript loaded as <script type=\"text/babel\">. It is fast to iterate on and perfect for agreeing the design and the information architecture, but it is not the production system."},
     {h:"Where we are heading"},
     {list:[
       "Framework: Next.js (App Router) — server-rendered pages for SEO, with the same component design language carried over.",
       "Content / CMS: a self-hosted headless CMS. Payload v3 is under evaluation — it runs inside the Next.js app, so there is one codebase to host.",
       "Hosting: deliberately off-Vercel. Railway or Render, so hosting, database and the CMS sit together with predictable pricing.",
       "Object storage: S3 or Cloudflare R2 sits behind the Ingestion Inbox — every durable copy of an incoming file lives there, addressed by a permanent key.",
       "Database: Postgres for content, members, and the inbox/library index.",
     ]},
     {h:"Why this shape"},
     {p:"The members area — and the Ingestion Inbox in particular — is the reason for a real backend. Associates send working files from many systems; the portal needs a durable place to keep a permanent copy and a database to track where each item belongs. A static site cannot do that; a self-hosted CMS plus object storage can."},
   ]},
  {id:"r2", title:"How to edit the website", type:"Web", icon:"file", updated:"Jun 2026", summary:"The content workflow — who edits what, and how a change reaches the live site.",
   body:[
     {p:"Most day-to-day changes — a new case study, a news post, an associate bio, a policy document — are content, not code. Once the production CMS is in place, you edit them yourself without a developer."},
     {h:"The workflow"},
     {list:[
       "Sign in to the CMS (the same login as this members area, with a staff role).",
       "Find the collection you want — Case studies, News, People, Documents.",
       "Edit in a structured form: fields for title, summary, body, images, sector and region tags.",
       "Save as draft and preview. Publish when it reads right; unpublish to pull something down.",
     ]},
     {h:"Code vs content"},
     {p:"Layout, design and new page types are code, and go through the developer and a deploy. Everything inside an existing page type is content you control. When in doubt: if it is words or images inside an existing kind of page, it is yours to edit."},
     {p:"Today, in this prototype, content lives in the data file and is changed by a developer — the CMS workflow above describes the production system."},
   ]},
  {id:"r3", title:"Deploy & rollback runbook", type:"Web", icon:"clock", updated:"Jun 2026", summary:"How a change goes live, and how to undo one quickly if something breaks.",
   body:[
     {p:"Deploys should be boring. This is the routine for shipping a change and, just as important, for backing one out."},
     {h:"Deploying"},
     {list:[
       "Changes merge to the main branch in the Git repository.",
       "The host (Railway / Render) builds the Next.js app automatically and runs a health check.",
       "If the check passes, the new version goes live; if it fails, the previous version stays up.",
     ]},
     {h:"Rolling back"},
     {list:[
       "In the host dashboard, open Deployments and pick the last known-good build.",
       "Choose Redeploy / Rollback — traffic moves back to it within a minute.",
       "Content-only mistakes do not need a rollback: unpublish or revert the entry in the CMS.",
     ]},
     {h:"If the site is down"},
     {p:"Check the host status page first, then the most recent deploy. Nine times out of ten it is the last change — roll back to the previous build, then investigate calmly with the site back up."},
   ]},
  {id:"r4", title:"Design system & brand tokens", type:"Web", icon:"heart", updated:"Jun 2026", summary:"The colours, type and spacing that keep every screen on-brand.",
   body:[
     {p:"The look of the site is defined once, as design tokens, and reused everywhere. Change a token and it updates consistently across the whole site."},
     {h:"Colour"},
     {p:"A green scale (green-50 through green-900) carries the brand, with a neutral ink scale for text and quiet paper, surface and mist tones for backgrounds. Components never hard-code a colour — they reference a token, so contrast and consistency hold."},
     {h:"Type"},
     {list:[
       "Display — for headings, set tight and confident.",
       "Body — for reading, set generously for long passages.",
       "Mono — for labels, metadata and small technical detail.",
     ]},
     {h:"Spacing, radius & shadow"},
     {p:"Rounded corners, soft shadows and a consistent spacing rhythm are all tokens too. The koru curve and the Sea · Forest · Crossing photography system complete the visual language. The brand pack — wordmarks, the koru monogram and favicons — lives in the associate library under Brand & collateral."},
   ]},
  {id:"r5", title:"Notion OS — where everything lives", type:"Web", icon:"external", updated:"Jun 2026", summary:"The operating system for the business sits in Notion; this is the pointer.",
   external:true,
   body:[
     {p:"The website is one surface of a wider operating system that lives in Notion. This page is the pointer from the site back to that source of truth — it does not duplicate it."},
     {h:"What lives in Notion"},
     {list:[
       "The content backlog — case studies, news and people, drafted before they reach the site.",
       "The project and engagement tracker that the working documents here reflect.",
       "Brand guidelines, decisions and the build log for the site itself.",
       "Standard operating procedures for how the team works.",
     ]},
     {h:"How they relate"},
     {p:"Notion is where things are decided and drafted; the website and this members area are where the finished, public-or-private versions are published. Keep the thinking in Notion and the polished output here — do not let them drift."},
   ]},
  {id:"r6", title:"Redirect map — old Wix site", type:"Web", icon:"link", updated:"Jun 2026", summary:"SEO migration: every old Wix URL maps to its new home so nothing 404s.",
   body:[
     {p:"The previous Future Partners site was built on Wix. When the new site goes live, every meaningful old URL must redirect to its new equivalent with a permanent (301) redirect — so search ranking and any existing links carry over instead of breaking."},
     {h:"How it works"},
     {list:[
       "A redirect map lists each old path and the new path it points to.",
       "The Next.js app applies the 301s, so visitors and search engines land on the right page.",
       "After launch we watch for 404s and add any missed paths to the map.",
     ]},
     {h:"Sample mappings (illustrative)"},
     {list:[
       "/our-projects  →  /atlas",
       "/about  →  /#approach",
       "/team  →  /people",
       "/contact  →  / (contact opens in-page)",
     ]},
     {p:"The full map is maintained alongside the deploy configuration. This is a draft sample, not the final list."},
   ]},
  {id:"r7", title:"Domains, DNS & secrets index", type:"Web", icon:"lock", updated:"Jun 2026", summary:"Where the domain, DNS and credentials live — pointers only, never the secrets.",
   body:[
     {p:"This is a deliberately thin page: an index of where the keys are kept, not the keys themselves. No password, token or private value is ever written here or anywhere in the site."},
     {h:"Domain & DNS"},
     {list:[
       "Primary domain: futurepartners.co.nz, with www redirecting to the apex.",
       "DNS records (A / CNAME / MX / TXT) are managed at the registrar.",
       "TLS certificates are issued and renewed automatically by the host.",
     ]},
     {h:"Where secrets actually live"},
     {list:[
       "Application secrets — database URL, storage keys, CMS secret — live in the host's environment variables, never in the repository.",
       "Shared credentials are kept in the team password manager.",
       "The mailbox behind files@futurepartners.co.nz is administered with the other mail accounts.",
     ]},
     {p:"If a value is missing or needs rotating, go to the system that owns it (host, registrar, password manager) — this index only tells you which one."},
   ]},
];

function StaffSpace({signOut, switcher}){
  const [section, setSection] = useState("inbox"); // inbox | working | runbook | team

  return (
    <div className="mem">
      <aside className="mem-side">
        <a href="#/" className="mem-logo" onClick={(e)=>{e.preventDefault(); navigate("/");}}>
          <img src="assets/logo.png" alt="Future Partners"/>
        </a>
        <span className="mem-side-label">Staff workspace</span>
        {switcher && <SpaceSwitcher {...switcher}/>}
        <nav className="mem-nav">
          <button className={"mem-navitem"+(section==="inbox"?" on":"")} onClick={()=>setSection("inbox")}>
            <Icon name="download" size={18}/> Ingestion Inbox <span className="mem-navcount">{STF_INBOX.filter(i=>i.status==="needs").length}</span>
          </button>
          <button className={"mem-navitem"+(section==="working"?" on":"")} onClick={()=>setSection("working")}>
            <Icon name="file" size={18}/> Working documents
          </button>
          <button className={"mem-navitem"+(section==="runbook"?" on":"")} onClick={()=>setSection("runbook")}>
            <Icon name="book" size={18}/> Website runbook
          </button>
          <button className={"mem-navitem"+(section==="team"?" on":"")} onClick={()=>setSection("team")}>
            <Icon name="users" size={18}/> Team <span className="mem-navcount">{PEOPLE.length}</span>
          </button>
        </nav>
        <div className="mem-side-foot">
          <div className="mem-user">
            <span className="mem-user-av">KB</span>
            <div className="mem-user-id"><span className="mem-user-name">Kirsty Burnett</span><span className="mem-user-role">Role · Staff</span></div>
          </div>
          <button className="mem-signout" onClick={signOut}><Icon name="lock" size={15}/> Sign out</button>
        </div>
      </aside>

      <div className="mem-main">
        <header className="mem-top">
          <label className="mem-search">
            <Icon name="search" size={18}/>
            <input placeholder="Search the back-office…"/>
          </label>
          <div className="mem-top-actions">
            <span className="mem-draftpill">DRAFT · concept</span>
            <a href="#/" onClick={(e)=>{e.preventDefault(); navigate("/");}} className="mem-backsite"><Icon name="external" size={16}/> Public site</a>
          </div>
        </header>

        <div className="mem-content">
          {typeof ConceptIntro !== "undefined" && <ConceptIntro space="staff"/>}
          {section==="inbox"   && <StfInbox/>}
          {section==="working" && <StfWorking/>}
          {section==="runbook" && <StfRunbook/>}
          {section==="team"    && <StfTeam/>}
        </div>
      </div>
    </div>
  );
}

/* ---------- shared little pieces ---------- */
function StfSourceChip({source}){
  const s = STF_SOURCES[source] || STF_SOURCES.upload;
  return (
    <span className="stf-source" style={{"--src":s.color, color:s.color, background:s.color+"14", borderColor:s.color+"33"}}>
      <Icon name={s.icon} size={13}/> {s.label}
    </span>
  );
}
function StfFromAvatar({person}){
  if(!person) return null;
  return <span className={"stf-av "+(person.fill||"fill-forest")} title={person.name}>{person.initials}</span>;
}

/* =====================================================================
   1 · INGESTION INBOX — the showpiece
   ===================================================================== */
function StfInbox(){
  const [items, setItems] = useState(STF_INBOX);
  const [filing, setFiling] = useState(null); // the item being triaged

  const needs  = items.filter(i=>i.status==="needs");
  const expiring = needs.filter(i=>i.expiresIn!=null);
  const filedThisWeek = 14; // rolling count (mock)

  const onFiled = (id, payload)=>{
    setItems(prev=>prev.map(i=> i.id===id ? {...i, status:"filed", filedAs:payload} : i));
    setFiling(null);
  };

  return (
    <div className="stf-inbox">
      <div className="mhome-head">
        <p className="eyebrow">Ingestion inbox</p>
        <h1 className="mhome-h1">One home. Many on-ramps.</h1>
        <p className="mhome-lead fp-lead">Associates send working files from wherever they are — Dropbox, Drive, WeTransfer, a plain email. Everything lands here, we keep a permanent copy on arrival, and a quick triage files each item into the library. No more rotting links.</p>
      </div>

      {/* ON-RAMPS */}
      <span className="mem-sec-h">Ways in</span>
      <div className="stf-onramps">
        {STF_ONRAMPS.map(r=>(
          <div className={"stf-onramp"+(r.id==="upload"?" stf-onramp-drop":"")} key={r.id}>
            <span className="stf-onramp-ic"><Icon name={r.icon} size={20}/></span>
            <span className="stf-onramp-body">
              <span className="stf-onramp-t">{r.title}</span>
              <span className="stf-onramp-s">{r.sub}</span>
              {r.id==="email" && <span className="stf-onramp-addr">files@futurepartners.co.nz</span>}
            </span>
            {r.tag && <span className="stf-onramp-tag">{r.tag}</span>}
          </div>
        ))}
      </div>

      {/* PIPELINE EXPLAINER — the architecture, made legible */}
      <div className="stf-flow">
        <div className="stf-flow-step">
          <span className="stf-flow-ic"><Icon name="layers" size={18}/></span>
          <div><span className="stf-flow-t">Many sources</span><span className="stf-flow-s">Dropbox · Drive · WeTransfer · Email</span></div>
        </div>
        <span className="stf-flow-arrow"><Icon name="arrow" size={18}/></span>
        <div className="stf-flow-step">
          <span className="stf-flow-ic"><Icon name="download" size={18}/></span>
          <div><span className="stf-flow-t">One durable copy</span><span className="stf-flow-s">Captured to storage on arrival</span></div>
        </div>
        <span className="stf-flow-arrow"><Icon name="arrow" size={18}/></span>
        <div className="stf-flow-step">
          <span className="stf-flow-ic"><Icon name="check" size={18}/></span>
          <div><span className="stf-flow-t">Filed in the library</span><span className="stf-flow-s">Collection · audience · version</span></div>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stf-stats">
        <div className="stf-stat">
          <span className="stf-stat-n">{needs.length}</span>
          <span className="stf-stat-l">Awaiting filing</span>
        </div>
        <div className="stf-stat stf-stat-warn">
          <span className="stf-stat-n">{expiring.length}</span>
          <span className="stf-stat-l">From WeTransfer · expiring</span>
        </div>
        <div className="stf-stat">
          <span className="stf-stat-n">{filedThisWeek}</span>
          <span className="stf-stat-l">Filed this week</span>
        </div>
      </div>

      {/* THE LIST */}
      <span className="mem-sec-h">Incoming</span>
      <div className="stf-list">
        <div className="stf-listhead">
          <span>File</span><span className="stf-col">Source</span><span className="stf-col">From</span><span className="stf-col">Received</span><span className="stf-col">Size</span><span className="stf-col stf-col-act">Status</span>
        </div>
        {items.map(it=>{
          const person = personById(it.from);
          const isExpiring = it.expiresIn!=null && it.status==="needs";
          return (
            <div className={"stf-row"+(it.status==="filed"?" stf-row-filed":"")} key={it.id}>
              <span className="stf-file">
                <DocIcon type={it.type}/>
                <span className="stf-file-main">
                  <span className="stf-file-name">{it.name}</span>
                  {isExpiring
                    ? <span className="stf-expire"><Icon name="clock" size={12}/> Link expires in {it.expiresIn} day{it.expiresIn===1?"":"s"} — copy secured here</span>
                    : it.status==="filed"
                      ? <span className="stf-filed-as"><Icon name="check" size={12}/> Filed → {it.filedAs.collection} · {(STF_AUDIENCES.find(a=>a.id===it.filedAs.audience)||{}).label} · {it.filedAs.version}</span>
                      : <span className="stf-suggest">Suggested: {it.suggest}</span>}
                </span>
              </span>
              <span className="stf-col"><StfSourceChip source={it.source}/></span>
              <span className="stf-col stf-from"><StfFromAvatar person={person}/> <span className="stf-from-name">{person ? person.name : it.from}</span></span>
              <span className="stf-col stf-meta">{it.received}</span>
              <span className="stf-col stf-meta">{it.size}</span>
              <span className="stf-col stf-col-act">
                {it.status==="needs"
                  ? <button className="stf-fileit" onClick={()=>setFiling(it)}><Icon name="folder" size={15}/> File it</button>
                  : <span className="vis vis-membersOnly">Filed</span>}
              </span>
            </div>
          );
        })}
      </div>

      {filing && <StfFileModal item={filing} onClose={()=>setFiling(null)} onFiled={onFiled}/>}
    </div>
  );
}

/* ---------- the triage modal: scattered link → normalised library item ---------- */
function StfFileModal({item, onClose, onFiled}){
  const person = personById(item.from);
  const [collection, setCollection] = useState(item.suggest || STF_COLLECTIONS[0]);
  const [audience,   setAudience]   = useState("associate");
  const [version,    setVersion]    = useState("v1.0");
  const [owner,      setOwner]      = useState("Kirsty Burnett");

  useEffect(()=>{
    const onKey = (e)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  },[onClose]);

  const src = STF_SOURCES[item.source] || STF_SOURCES.upload;

  return (
    <div className="stf-modal-scrim" onClick={onClose}>
      <div className="stf-modal" onClick={(e)=>e.stopPropagation()} role="dialog" aria-label="File incoming item">
        <button className="stf-modal-x" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button>
        <span className="mem-panel-h">Triage · file into the library</span>
        <h2 className="stf-modal-h">{item.name}</h2>

        {/* before → after: this is the core idea, made visible */}
        <div className="stf-triage">
          <div className="stf-triage-side stf-triage-from">
            <span className="stf-triage-cap">Arrived as</span>
            <StfSourceChip source={item.source}/>
            <ul className="stf-triage-facts">
              <li><span>From</span><b>{person ? person.name : item.from}</b></li>
              <li><span>Received</span><b>{item.received}</b></li>
              <li><span>Size</span><b>{item.size}</b></li>
              <li><span>Original link</span><b className={src.ephemeral?"stf-rot":""}>{src.ephemeral?`Expires in ${item.expiresIn} days`:"Stable"}</b></li>
            </ul>
          </div>
          <span className="stf-triage-arrow"><Icon name="arrow" size={22}/></span>
          <div className="stf-triage-side stf-triage-to">
            <span className="stf-triage-cap">Becomes a library item</span>
            <div className="stf-fields">
              <label className="stf-field">
                <span>Collection</span>
                <div className="stf-select"><Icon name="folder" size={15}/>
                  <select value={collection} onChange={e=>setCollection(e.target.value)}>
                    {STF_COLLECTIONS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <Icon name="chevronDown" size={15}/>
                </div>
              </label>
              <label className="stf-field">
                <span>Audience</span>
                <div className="stf-seg">
                  {STF_AUDIENCES.map(a=>(
                    <button type="button" key={a.id} className={"stf-seg-btn"+(audience===a.id?" on":"")} onClick={()=>setAudience(a.id)}>{a.label}</button>
                  ))}
                </div>
              </label>
              <div className="stf-field-row">
                <label className="stf-field">
                  <span>Version</span>
                  <input className="stf-input" value={version} onChange={e=>setVersion(e.target.value)}/>
                </label>
                <label className="stf-field">
                  <span>Owner</span>
                  <input className="stf-input" value={owner} onChange={e=>setOwner(e.target.value)}/>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="stf-modal-foot">
          <span className="stf-modal-note"><Icon name="shield" size={14}/> A permanent copy is already stored — filing just tells the library where it belongs.</span>
          <div className="stf-modal-actions">
            <Btn kind="secondary" size="sm" onClick={onClose}>Cancel</Btn>
            <Btn kind="primary" size="sm" arrow onClick={()=>onFiled(item.id, {collection, audience, version, owner})}>File into library</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   2 · WORKING DOCUMENTS
   ===================================================================== */
function StfWorking(){
  return (
    <div className="stf-working">
      <div className="mhome-head">
        <p className="eyebrow">Back-office</p>
        <h1 className="mhome-h1">Working documents</h1>
        <p className="mhome-lead fp-lead">The internal records that run the practice — proposals and pipeline, engagement admin, financials, contracts and associate agreements. Staff-only.</p>
      </div>
      {STF_WORKING.map(g=>(
        <div className="stf-wgroup" key={g.group}>
          <span className="mem-sec-h"><Icon name={g.icon} size={15}/> {g.group}</span>
          <div className="stf-list">
            {g.docs.map(d=>(
              <div className="stf-wrow" key={d.id}>
                <DocIcon type={d.type}/>
                <span className="stf-file-main">
                  <span className="stf-file-name">{d.title}</span>
                  <span className="stf-meta stf-wmeta">{d.owner} · updated {d.updated}</span>
                </span>
                <span className="stf-col stf-meta stf-wver">{d.version}</span>
                <span className={"vis vis-"+(d.lifecycle==="archived"?"archived":d.lifecycle==="draft"?"draft":"membersOnly")}>
                  {d.lifecycle==="archived"?"Archived":d.lifecycle==="draft"?"Draft":"Staff"}
                </span>
                <button className="stf-wopen" aria-label="Open"><Icon name="external" size={15}/></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =====================================================================
   3 · WEBSITE RUNBOOK — list of doc cards → reader body
   ===================================================================== */
function StfRunbook(){
  const [openId, setOpenId] = useState(null);
  const doc = openId ? STF_RUNBOOK.find(r=>r.id===openId) : null;

  if(doc) return <StfRunbookDoc doc={doc} onBack={()=>setOpenId(null)}/>;

  return (
    <div className="stf-runbook">
      <div className="mhome-head">
        <p className="eyebrow">Manual</p>
        <h1 className="mhome-h1">Website runbook</h1>
        <p className="mhome-lead fp-lead">How this website actually works — the stack, how to edit it, how to deploy and roll back, the brand system, and where the keys are kept. A living draft for Kirsty and the team.</p>
      </div>
      <div className="stf-rb-grid">
        {STF_RUNBOOK.map(r=>(
          <button className="stf-rb-card" key={r.id} onClick={()=>setOpenId(r.id)}>
            <span className="stf-rb-ic"><Icon name={r.icon} size={20}/></span>
            <span className="stf-rb-body">
              <span className="stf-rb-t">{r.title} {r.external && <Icon name="external" size={14}/>}</span>
              <span className="stf-rb-s">{r.summary}</span>
            </span>
            <span className="stf-rb-foot">
              <span className="vis vis-draft">Draft</span>
              <span className="stf-rb-upd">Updated {r.updated}</span>
              <Icon name="chevron" size={16}/>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StfRunbookDoc({doc, onBack}){
  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Website runbook</button>
      <div className="mdoc-detail">
        <div className="mdoc-reader">
          <div className="mdoc-doc-head">
            <DocIcon type={doc.type}/>
            <span className="vis vis-draft">Draft</span>
          </div>
          <h1 className="mdoc-h1">{doc.title}</h1>
          <p className="mdoc-lead">{doc.summary}</p>
          <div className="mdoc-preview">
            <article className="mdoc-doc">
              {doc.body.map((b,i)=> b.h ? <h3 className="mdoc-doc-h" key={i}>{b.h}</h3>
                : b.list ? <ul className="mdoc-doc-ul" key={i}>{b.list.map((x,j)=><li key={j}>{x}</li>)}</ul>
                : <p className="mdoc-doc-p" key={i}>{b.p}</p>)}
              <p className="mdoc-doc-foot">Future Partners · Website runbook · {doc.title} · Updated {doc.updated} · DRAFT</p>
            </article>
          </div>
        </div>
        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">In this runbook</span>
            <div className="mdoc-related">
              {STF_RUNBOOK.map(r=>(
                <button className={"mdoc-relrow"+(r.id===doc.id?" stf-rel-on":"")} key={r.id} onClick={()=>{}} disabled>
                  <Icon name={r.icon} size={14}/>
                  <span className="mdoc-relrow-title">{r.title}</span>
                  {r.id===doc.id && <Icon name="check" size={14}/>}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =====================================================================
   4 · TEAM — the associate roster from PEOPLE
   ===================================================================== */
function StfTeam(){
  const lead = PEOPLE.filter(p=>p.lead);
  const associates = PEOPLE.filter(p=>!p.lead);
  return (
    <div className="stf-team">
      <div className="stf-team-head">
        <div className="mhome-head">
          <p className="eyebrow">People</p>
          <h1 className="mhome-h1">Team</h1>
          <p className="mhome-lead fp-lead">The delivery network — Kirsty and {associates.length} associates. Roles and current status at a glance.</p>
        </div>
        <Btn kind="secondary" size="sm"><Icon name="users" size={16}/> Onboard associate</Btn>
      </div>

      <span className="mem-sec-h">Director</span>
      <div className="stf-team-grid">
        {lead.map(p=><StfPersonCard key={p.id} p={p} active/>)}
      </div>

      <span className="mem-sec-h">Associates</span>
      <div className="stf-team-grid">
        {associates.map((p,idx)=><StfPersonCard key={p.id} p={p} active={idx%5!==4}/>)}
      </div>
    </div>
  );
}

function StfPersonCard({p, active}){
  return (
    <div className="stf-person">
      <span className={"stf-av lg "+(p.fill||"fill-forest")}>{p.initials}</span>
      <span className="stf-person-info">
        <span className="stf-person-name">{p.name}</span>
        <span className="stf-person-role">{p.role}</span>
        <span className="stf-person-regions">{(p.regions||[]).slice(0,2).join(" · ")}</span>
      </span>
      <span className={"stf-status"+(active?" on":"")}>
        <span className="stf-status-dot"></span>{active?"Active":"On a break"}
      </span>
    </div>
  );
}

Object.assign(window, { StaffSpace });
