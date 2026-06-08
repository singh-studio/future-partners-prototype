/* members.jsx — Members operating library concept (login → library → category → document) */

const MCATS = [
  {id:"policies",  name:"Policies & governance", icon:"shield", count:7, blurb:"Procurement-ready policies and frameworks.", visibility:"membersOnly"},
  {id:"templates", name:"Templates",             icon:"file",   count:5, blurb:"Reusable starting points for every assignment.", visibility:"membersOnly"},
  {id:"guides",    name:"Guides & how-tos",       icon:"book",   count:4, blurb:"Field practice, MERL and working in the region.", visibility:"membersOnly"},
  {id:"news",      name:"Newsletters",            icon:"mail",   count:3, blurb:"Quarterly updates across the network.", visibility:"membersOnly"},
  {id:"brand",     name:"Collateral & brand",     icon:"layers", count:4, blurb:"Logos, capability statements and decks.", visibility:"membersOnly"},
  {id:"archive",   name:"Archived case studies",  icon:"folder", count:6, blurb:"Earlier projects, kept for reference.", visibility:"archived"},
];

const MDOCS = [
  {id:"d1", cat:"policies", title:"Child Safeguarding Policy", type:"PDF", owner:"Admin", updated:"May 2026", version:"v3.1", visibility:"membersOnly", summary:"How Future Partners protects children across all programmes, and what every associate must do.",
   body:[
     {p:"Future Partners is committed to the safety, wellbeing and dignity of every child who comes into contact with our work. This policy sets out the standards we hold ourselves to, and the responsibilities of everyone working under the Future Partners name."},
     {h:"1. Scope"},
     {p:"This policy applies to all directors, associates, sub-contractors and partners on every assignment, in every country. It applies whether contact with children is direct or indirect, in person or online."},
     {h:"2. Our commitments"},
     {list:["We put the best interests of the child first, always.","We design and deliver activities so that children — especially those most easily left behind — are protected from harm.","We listen to children and communities, and make it safe and simple to raise a concern.","We never share images or information that could identify or endanger a child without informed consent."]},
     {h:"3. Expected behaviour"},
     {p:"Everyone working with Future Partners must treat children with respect, maintain appropriate boundaries, and never engage in any behaviour that is abusive, exploitative or places a child at risk. Concerns about conduct must be reported, not ignored."},
     {h:"4. Reporting a concern"},
     {p:"Any concern about the safety of a child is reported to the Director within 24 hours, and to local authorities where required. Reports are handled confidentially, taken seriously, and never result in retaliation against the person raising them. When in doubt, report."},
   ]},
  {id:"d2", cat:"policies", title:"Code of Conduct", type:"PDF", owner:"Admin", updated:"Mar 2026", version:"v2.4", visibility:"membersOnly", summary:"The standards of behaviour expected of everyone working under the Future Partners name."},
  {id:"d3", cat:"policies", title:"Conflict of Interest Policy", type:"PDF", owner:"Admin", updated:"Feb 2026", version:"v1.6", visibility:"membersOnly", summary:"Identifying, declaring and managing conflicts on assignments."},
  {id:"d4", cat:"policies", title:"Health, Safety & Travel Policy", type:"PDF", owner:"Admin", updated:"Apr 2026", version:"v2.0", visibility:"membersOnly", summary:"Keeping people safe in the field, including travel and remote-area protocols."},
  {id:"d5", cat:"policies", title:"Privacy Policy", type:"PDF", owner:"Admin", updated:"Jan 2026", version:"v1.3", visibility:"public", summary:"How personal information is collected, used and protected."},
  {id:"d6", cat:"policies", title:"Procurement Policy", type:"PDF", owner:"Admin", updated:"Mar 2026", version:"v2.1", visibility:"membersOnly", summary:"Fair, transparent procurement for sub-contracts and goods."},
  {id:"d7", cat:"policies", title:"Risk Management Framework", type:"PDF", owner:"Reviewer", updated:"Apr 2026", version:"v1.9", visibility:"membersOnly", summary:"Identifying and managing programme, fiduciary and safeguarding risk."},

  {id:"t1", cat:"templates", title:"Project Design template", type:"DOCX", owner:"Editor", updated:"May 2026", version:"v4.0", visibility:"membersOnly", summary:"Structured starting point for a project or programme design."},
  {id:"t2", cat:"templates", title:"Evaluation Terms of Reference", type:"DOCX", owner:"Editor", updated:"Apr 2026", version:"v3.2", visibility:"membersOnly", summary:"ToR scaffold for reviews and evaluations, aligned to MERL practice."},
  {id:"t3", cat:"templates", title:"Inception Report template", type:"DOCX", owner:"Editor", updated:"Feb 2026", version:"v2.1", visibility:"membersOnly", summary:"Get an assignment moving with a clear inception structure."},
  {id:"t4", cat:"templates", title:"Programme Budget template", type:"XLSX", owner:"Editor", updated:"Mar 2026", version:"v2.5", visibility:"membersOnly", summary:"Costing workbook with value-for-money checks built in."},
  {id:"t5", cat:"templates", title:"Field Trip Report template", type:"DOCX", owner:"AssociateMember", updated:"Jan 2026", version:"v1.4", visibility:"membersOnly", summary:"Capture what mattered from an in-country visit."},

  {id:"g1", cat:"guides", title:"MERL framework guide", type:"PDF", owner:"Editor", updated:"May 2026", version:"v2.0", visibility:"membersOnly", summary:"Designing monitoring, evaluation, research and learning that partners can use.",
   body:[
     {p:"A good monitoring, evaluation, research and learning (MERL) framework does more than report upward to a donor — it helps the people delivering a project see what is working, adapt, and improve. This guide sets out how we build MERL that partners actually use."},
     {h:"Start from the change"},
     {p:"Begin with a clear theory of change: the outcomes that matter, and the assumptions behind how the project expects to reach them. Indicators follow from the change you are trying to see — not the other way around."},
     {h:"Keep it proportionate"},
     {p:"Match the MERL effort to the size and risk of the project. A short, well-chosen set of indicators that a local team can collect and act on beats an exhaustive log-frame nobody maintains."},
     {h:"Centre local knowledge"},
     {list:["Design indicators with the people who will collect them.","Use methods that suit the context, culture and capability — including qualitative and Pacific methodologies.","Account for women, youth, older people and people with disabilities in what you measure."]},
     {h:"Close the loop"},
     {p:"Build in regular moments to review the data together, ask what it means, and adjust. Learning that never changes a decision is not learning. Reporting is the by-product of a system built to improve the work."},
   ]},
  {id:"g2", cat:"guides", title:"Working in the Pacific — protocols", type:"PDF", owner:"Editor", updated:"Apr 2026", version:"v1.7", visibility:"membersOnly", summary:"Cultural protocols and locally-led practice across the region."},
  {id:"g3", cat:"guides", title:"Safeguarding in the field", type:"PDF", owner:"Reviewer", updated:"Mar 2026", version:"v1.5", visibility:"membersOnly", summary:"Putting the safeguarding policy into everyday practice on assignment."},
  {id:"g4", cat:"guides", title:"Writing a funding application", type:"PDF", owner:"Editor", updated:"Feb 2026", version:"v1.2", visibility:"membersOnly", summary:"What donors and climate funds look for, and how to structure a bid."},

  {id:"n1", cat:"news", title:"Network update — Q2 2026", type:"Web", owner:"Editor", updated:"Apr 2026", version:"—", visibility:"membersOnly", summary:"Recent wins, new associates and what's coming up across the network."},
  {id:"n2", cat:"news", title:"Network update — Q1 2026", type:"Web", owner:"Editor", updated:"Jan 2026", version:"—", visibility:"membersOnly", summary:"Year ahead: pipeline, partnerships and professional development."},
  {id:"n3", cat:"news", title:"Network update — Q4 2025", type:"Web", owner:"Editor", updated:"Oct 2025", version:"—", visibility:"archived", summary:"Looking back on a busy year of Pacific delivery."},

  {id:"b1", cat:"brand", title:"Logo & brand pack", type:"ZIP", owner:"Admin", updated:"Mar 2026", version:"v1.0", visibility:"membersOnly", summary:"Wordmarks, koru monogram and favicons in all formats."},
  {id:"b2", cat:"brand", title:"Capability statement", type:"PDF", owner:"Editor", updated:"May 2026", version:"v3.0", visibility:"membersOnly", summary:"Two-page overview of services, sectors and proof for client conversations."},
  {id:"b3", cat:"brand", title:"Slide template", type:"PPTX", owner:"Editor", updated:"Apr 2026", version:"v2.2", visibility:"membersOnly", summary:"On-brand deck shell for proposals and reports."},
  {id:"b4", cat:"brand", title:"One-page project profile template", type:"INDD", owner:"Editor", updated:"Feb 2026", version:"v1.1", visibility:"membersOnly", summary:"Turn a finished assignment into a shareable case profile."},

  {id:"a1", cat:"archive", title:"Pacific Regional Fisheries Training Programme", type:"PDF", owner:"Reviewer", updated:"2019", version:"final", visibility:"archived", summary:"Final report from an earlier multi-year fisheries training programme."},
  {id:"a2", cat:"archive", title:"WASH — a decade of success (full report)", type:"PDF", owner:"Reviewer", updated:"2021", version:"final", visibility:"archived", summary:"The complete decade-of-WASH evidence base."},
  {id:"a3", cat:"archive", title:"Cook Islands strategic evaluation (annexes)", type:"PDF", owner:"Reviewer", updated:"2021", version:"final", visibility:"archived", summary:"Supporting annexes and data tables."},
  {id:"a4", cat:"archive", title:"International Skills Training course materials", type:"ZIP", owner:"Editor", updated:"2020", version:"final", visibility:"archived", summary:"Curriculum and facilitator materials from the IST courses."},
  {id:"a5", cat:"archive", title:"PROP review — methodology note", type:"PDF", owner:"Reviewer", updated:"2022", version:"final", visibility:"archived", summary:"How the Pacific Regional Oceanscape Programme review was conducted."},
  {id:"a6", cat:"archive", title:"Pacific Broadcasting evaluation", type:"PDF", owner:"Reviewer", updated:"2020", version:"final", visibility:"archived", summary:"Earlier evaluation of Pacific broadcasting for development."},
];

const typeColor = {PDF:"#C0392B",DOCX:"#2A6FDB",XLSX:"#1F8A5B",PPTX:"#D9742B",ZIP:"#6B5BD2",Web:"#157F69",INDD:"#C2387A"};
const visLabel = {membersOnly:"Members only", public:"Public", archived:"Archived", draft:"Draft"};

function Members({onContact}){
  const [authed, setAuthed] = useState(()=>localStorage.getItem("fp_member")==="1");
  const [screen, setScreen] = useState({view:"library"}); // library | category | doc
  const [search, setSearch] = useState("");

  const signIn = ()=>{ localStorage.setItem("fp_member","1"); setAuthed(true); setScreen({view:"library"}); };
  const signOut = ()=>{ localStorage.removeItem("fp_member"); setAuthed(false); };

  if(!authed) return <MembersLogin onSignIn={signIn}/>;

  const cat = screen.view==="category" ? MCATS.find(c=>c.id===screen.id) : null;
  const doc = screen.view==="doc" ? MDOCS.find(d=>d.id===screen.id) : null;
  const activeCat = screen.view==="category" ? screen.id : doc ? doc.cat : null;
  const recent = MDOCS.filter(d=>d.visibility!=="archived").slice(0,4);
  const searchHits = search ? MDOCS.filter(d=>(d.title+" "+d.summary).toLowerCase().includes(search.toLowerCase())) : null;

  return (
    <div className="mem">
      <aside className="mem-side">
        <a href="#/" className="mem-logo" onClick={(e)=>{e.preventDefault(); navigate("/");}}>
          <img src="assets/logo.png" alt="Future Partners"/>
        </a>
        <span className="mem-side-label">Operating library</span>
        <nav className="mem-nav">
          <button className={"mem-navitem"+(screen.view==="library"?" on":"")} onClick={()=>{setScreen({view:"library"});setSearch("");}}>
            <Icon name="grid" size={18}/> Library home
          </button>
          <span className="mem-nav-h">Collections</span>
          {MCATS.map(c=>(
            <button key={c.id} className={"mem-navitem"+(activeCat===c.id?" on":"")} onClick={()=>{setScreen({view:"category",id:c.id});setSearch("");}}>
              <Icon name={c.icon} size={18}/> {c.name} <span className="mem-navcount">{c.count}</span>
            </button>
          ))}
        </nav>
        <div className="mem-side-foot">
          <div className="mem-user">
            <span className="mem-user-av">AM</span>
            <div className="mem-user-id"><span className="mem-user-name">Associate member</span><span className="mem-user-role">Role · AssociateMember</span></div>
          </div>
          <button className="mem-signout" onClick={signOut}><Icon name="lock" size={15}/> Sign out</button>
        </div>
      </aside>

      <div className="mem-main">
        <header className="mem-top">
          <label className="mem-search">
            <Icon name="search" size={18}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search policies, templates, guides…"/>
          </label>
          <div className="mem-top-actions">
            <span className="mem-draftpill">DRAFT · concept</span>
            <a href="#/" onClick={(e)=>{e.preventDefault(); navigate("/");}} className="mem-backsite"><Icon name="external" size={16}/> Public site</a>
          </div>
        </header>

        <div className="mem-content">
          {searchHits ? (
            <MemSearch hits={searchHits} q={search} onOpen={(id)=>setScreen({view:"doc",id})} onClear={()=>setSearch("")}/>
          ) : screen.view==="library" ? (
            <MemHome recent={recent} onCat={(id)=>setScreen({view:"category",id})} onDoc={(id)=>setScreen({view:"doc",id})}/>
          ) : screen.view==="category" ? (
            <MemCategory cat={cat} onDoc={(id)=>setScreen({view:"doc",id})}/>
          ) : (
            <MemDoc doc={doc} onBack={()=>setScreen({view:"category",id:doc.cat})} onDoc={(id)=>setScreen({view:"doc",id})}/>
          )}
        </div>
      </div>
    </div>
  );
}

function MembersLogin({onSignIn}){
  return (
    <div className="mlogin">
      <div className="mlogin-brand">
        <Koru className="mlogin-koru" stroke="var(--green-500)" op={0.5}/>
        <a href="#/" className="mlogin-logo" onClick={(e)=>{e.preventDefault(); navigate("/");}}><img src="assets/logo-white.png" alt="Future Partners"/></a>
        <div className="mlogin-pitch">
          <p className="eyebrow on-dark">Members operating library</p>
          <h1 className="mlogin-h1">One place for the way we work.</h1>
          <p className="mlogin-lead">Policies, templates, guides, newsletters, brand collateral and archived case studies — the operating library for Future Partners associates and the wider delivery network.</p>
          <ul className="mlogin-points">
            <li><Icon name="shield" size={18}/> Procurement-ready policies &amp; governance</li>
            <li><Icon name="file" size={18}/> Reusable templates for every assignment</li>
            <li><Icon name="book" size={18}/> Field guides and MERL practice</li>
          </ul>
        </div>
        <span className="mlogin-foot meta">Role-based access · public site stays separate</span>
      </div>
      <div className="mlogin-form-wrap">
        <form className="mlogin-form" onSubmit={(e)=>{e.preventDefault(); onSignIn();}}>
          <h2 className="mlogin-form-h">Sign in</h2>
          <p className="mlogin-form-sub">Welcome back. Sign in to the operating library.</p>
          <label className="mf-field"><span>Email</span><input type="email" defaultValue="associate@futurepartners.co.nz"/></label>
          <label className="mf-field"><span>Password</span><input type="password" defaultValue="••••••••••"/></label>
          <div className="mlogin-row">
            <label className="mlogin-remember"><input type="checkbox" defaultChecked/> Keep me signed in</label>
            <a href="#/members" onClick={e=>e.preventDefault()} className="mlogin-forgot">Forgot password?</a>
          </div>
          <Btn kind="primary" size="lg" arrow type="submit" className="mlogin-submit">Sign in to the library</Btn>
          <p className="mlogin-note meta">DRAFT — this is a concept. Any details sign you in.</p>
        </form>
      </div>
    </div>
  );
}

function DocIcon({type}){
  return <span className="doc-type" style={{background:(typeColor[type]||"#157F69")+"1A", color:typeColor[type]||"#157F69"}}>{type}</span>;
}

function MemHome({recent, onCat, onDoc}){
  return (
    <div className="mhome">
      <div className="mhome-head">
        <p className="eyebrow">Kia ora</p>
        <h1 className="mhome-h1">The operating library</h1>
        <p className="mhome-lead fp-lead">Everything the network needs to deliver consistently — find a collection, or jump back into recent documents.</p>
      </div>
      <span className="mem-sec-h">Collections</span>
      <div className="mhome-cats">
        {MCATS.map(c=>(
          <button className="mcat-card" key={c.id} onClick={()=>onCat(c.id)}>
            <span className="mcat-icon"><Icon name={c.icon} size={22}/></span>
            <span className="mcat-info">
              <span className="mcat-name">{c.name}</span>
              <span className="mcat-blurb">{c.blurb}</span>
            </span>
            <span className="mcat-foot"><span className="mcat-count">{c.count} items</span><span className={"vis vis-"+c.visibility}>{visLabel[c.visibility]}</span></span>
          </button>
        ))}
      </div>
      <span className="mem-sec-h">Recently updated</span>
      <div className="mdoc-list">
        {recent.map(d=>(
          <button className="mdoc-row" key={d.id} onClick={()=>onDoc(d.id)}>
            <DocIcon type={d.type}/>
            <span className="mdoc-main"><span className="mdoc-title">{d.title}</span><span className="mdoc-summary">{d.summary}</span></span>
            <span className="mdoc-meta-cell">{d.version}</span>
            <span className="mdoc-meta-cell">{d.updated}</span>
            <Icon name="chevron" size={16}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function MemCategory({cat, onDoc}){
  const docs = MDOCS.filter(d=>d.cat===cat.id);
  return (
    <div className="mcat">
      <div className="mcat-header">
        <span className="mcat-icon lg"><Icon name={cat.icon} size={26}/></span>
        <div>
          <h1 className="mcat-h1">{cat.name}</h1>
          <p className="mcat-desc">{cat.blurb} · {docs.length} items</p>
        </div>
        <span className={"vis vis-"+cat.visibility}>{visLabel[cat.visibility]}</span>
      </div>
      <div className="mdoc-list">
        <div className="mdoc-listhead"><span>Document</span><span className="mdoc-col">Owner</span><span className="mdoc-col">Version</span><span className="mdoc-col">Updated</span><span></span></div>
        {docs.map(d=>(
          <button className="mdoc-row" key={d.id} onClick={()=>onDoc(d.id)}>
            <DocIcon type={d.type}/>
            <span className="mdoc-main"><span className="mdoc-title">{d.title}</span><span className="mdoc-summary">{d.summary}</span></span>
            <span className="mdoc-col mdoc-meta-cell">{d.owner}</span>
            <span className="mdoc-col mdoc-meta-cell">{d.version}</span>
            <span className="mdoc-col mdoc-meta-cell">{d.updated}</span>
            <Icon name="chevron" size={16}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function MemDoc({doc, onBack, onDoc}){
  const cat = MCATS.find(c=>c.id===doc.cat);
  const related = MDOCS.filter(d=>d.cat===doc.cat && d.id!==doc.id).slice(0,3);
  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> {cat.name}</button>
      <div className="mdoc-detail">
        <div className="mdoc-reader">
          <div className="mdoc-doc-head">
            <DocIcon type={doc.type}/>
            <span className={"vis vis-"+doc.visibility}>{visLabel[doc.visibility]}</span>
          </div>
          <h1 className="mdoc-h1">{doc.title}</h1>
          <p className="mdoc-lead">{doc.summary}</p>
          <div className="mdoc-actions">
            <Btn kind="primary" size="sm"><Icon name="download" size={16}/> Download {doc.type}</Btn>
            <Btn kind="secondary" size="sm">Open in browser</Btn>
          </div>
          <div className="mdoc-preview">
            {doc.body ? (
              <article className="mdoc-doc">
                {doc.body.map((b,i)=> b.h ? <h3 className="mdoc-doc-h" key={i}>{b.h}</h3>
                  : b.list ? <ul className="mdoc-doc-ul" key={i}>{b.list.map((x,j)=><li key={j}>{x}</li>)}</ul>
                  : <p className="mdoc-doc-p" key={i}>{b.p}</p>)}
                <p className="mdoc-doc-foot">Future Partners · {doc.title} · {doc.version} · Updated {doc.updated}</p>
              </article>
            ) : (
              <React.Fragment>
                <div className="mdoc-page">
                  <div className="mdoc-ph-line w60"></div>
                  <div className="mdoc-ph-line w90"></div>
                  <div className="mdoc-ph-line w80"></div>
                  <div className="mdoc-ph-gap"></div>
                  <div className="mdoc-ph-line w40 head"></div>
                  <div className="mdoc-ph-line w95"></div>
                  <div className="mdoc-ph-line w85"></div>
                  <div className="mdoc-ph-line w92"></div>
                  <div className="mdoc-ph-line w70"></div>
                </div>
                <span className="mdoc-ph-cap">Preview placeholder — full document on download</span>
              </React.Fragment>
            )}
          </div>
        </div>
        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">Document details</span>
            <dl className="mem-facts">
              <div><dt>Type</dt><dd>{doc.type}</dd></div>
              <div><dt>Owner role</dt><dd>{doc.owner}</dd></div>
              <div><dt>Version</dt><dd>{doc.version}</dd></div>
              <div><dt>Updated</dt><dd>{doc.updated}</dd></div>
              <div><dt>Visibility</dt><dd>{visLabel[doc.visibility]}</dd></div>
              <div><dt>Collection</dt><dd>{cat.name}</dd></div>
            </dl>
          </div>
          {related.length>0 && (
            <div className="mem-panel">
              <span className="mem-panel-h">Related in {cat.name}</span>
              <div className="mdoc-related">
                {related.map(r=>(
                  <button className="mdoc-relrow" key={r.id} onClick={()=>onDoc(r.id)}>
                    <DocIcon type={r.type}/>
                    <span className="mdoc-relrow-title">{r.title}</span>
                    <Icon name="chevron" size={14}/>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function MemSearch({hits, q, onOpen, onClear}){
  return (
    <div className="mcat">
      <div className="mcat-header">
        <div><h1 className="mcat-h1">{hits.length} result{hits.length===1?"":"s"} for “{q}”</h1>
        <p className="mcat-desc">Across all collections</p></div>
        <Btn kind="secondary" size="sm" onClick={onClear}>Clear search</Btn>
      </div>
      <div className="mdoc-list">
        {hits.map(d=>(
          <button className="mdoc-row" key={d.id} onClick={()=>onOpen(d.id)}>
            <DocIcon type={d.type}/>
            <span className="mdoc-main"><span className="mdoc-title">{d.title}</span><span className="mdoc-summary">{d.summary}</span></span>
            <span className="mdoc-col mdoc-meta-cell">{MCATS.find(c=>c.id===d.cat).name}</span>
            <Icon name="chevron" size={16}/>
          </button>
        ))}
        {hits.length===0 && <div className="atlas-empty"><Icon name="search" size={28}/><h3>Nothing matches “{q}”.</h3></div>}
      </div>
    </div>
  );
}
Object.assign(window, { Members });
