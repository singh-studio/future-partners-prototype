/* people.jsx — People & Associates: grid + full associate profile page */

const DEMO = {
  portrait:"assets/demo/kirsty-portrait.png",
  banner:"assets/demo/banner-sea.png",
  fill:{ "fill-sea":"assets/demo/field-sea.png","fill-forest":"assets/demo/field-forest.png",
    "fill-coast":"assets/demo/field-coast.png","fill-crossing":"assets/demo/field-crossing.png",
    "fill-earth":"assets/demo/field-earth.png","fill-dawn":"assets/demo/field-dawn.png" },
};

function AssociateProfile({id, onContact}){
  const p = personById(id);
  useEffect(()=>{ window.scrollTo(0,0); },[id]);
  if(!p) return (
    <main className="wrap" style={{padding:"120px 40px",minHeight:"60vh"}}>
      <p className="eyebrow">Not found</p><h1 className="fp-h1">We couldn't find that associate.</h1>
      <Btn kind="secondary" arrow to="/people">Back to the network</Btn>
    </main>
  );
  const first = p.name.replace(/^(Dr|Prof|Professor|Mr|Mrs|Ms|Mx|Sir|Dame)\.?\s+/i, "").split(/[\s’']/)[0];
  const cases = (p.cases||[]).map(caseById).filter(Boolean).sort((a,b)=>b.year-a.year);
  const bioSents = (p.bio.match(/[^.!?]+[.!?]+/g)||[p.bio]).map(s=>s.trim()).filter(Boolean);
  const bioLead = bioSents[0] || p.bio;
  const bioRest = []; for(let i=1;i<bioSents.length;i+=2) bioRest.push(bioSents.slice(i,i+2).join(" "));
  const useImg = false;                                    // real people → brand landscape imagery, never a stock face
  const portrait = useImg ? DEMO.portrait : null;
  const banner = useImg ? DEMO.banner : null;
  const fieldImg = (c)=> useImg ? DEMO.fill[c.fill] : null;
  const scrollWork = ()=>{ const el=document.getElementById("ap-work"); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-70, behavior:"smooth"}); };

  return (
    <main className="ap">
      {/* ---------- cinematic hero (dark) ---------- */}
      <section className="ap-hero2">
        <Photo fill={p.fill} seed={p.id} img={portrait} wash="none" className="ap-hero2-bg"/>
        <div className="ap-hero2-scrim"></div>
        <div className="wrap ap-hero2-in">
          <Link to="/people" className="ap-backlink on-dark"><Icon name="arrow" size={16} style={{transform:"rotate(180deg)"}}/> People &amp; associates</Link>
          <div className="ap-hero2-foot">
            <div className="ap-hero2-idwrap">
              {p.photo && <div className="ap-hero-portrait" style={{backgroundImage:`url(${p.photo})`}}></div>}
              <div className="ap-hero2-id">
                <p className="eyebrow on-dark">{p.lead?"Director & owner":"Associate"} · {p.regions[0]}</p>
                <h1 className="ap-h1">{p.name}</h1>
                <p className="ap-h1-role">{p.role}</p>
              </div>
            </div>
            <div className="ap-hero2-meta">
              <div className="ap-hm"><span className="ap-hm-n">{cases.length}</span><span className="ap-hm-l">projects in the atlas</span></div>
              <div className="ap-hm"><span className="ap-hm-n">{p.regions.length}</span><span className="ap-hm-l">regions of work</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- intro (light) ---------- */}
      <section className="wrap ap-intro2">
        <div className="ap-intro2-lead">
          <p className="eyebrow">Profile</p>
          <p className="ap-bio2 lead">{bioLead}</p>
          {bioRest.map((t,i)=><p className="ap-bio2" key={i}>{t}</p>)}
          <div className="ap-actions">
            <Btn kind="primary" size="lg" arrow onClick={onContact}>Work with {first}</Btn>
            {cases.length>0 && <Btn kind="secondary" size="lg" onClick={scrollWork}>See their work</Btn>}
          </div>
        </div>
        <aside className="ap-intro2-side">
          <span className="ap-dh">Focus areas</span>
          <div className="ap-tags">{p.expertise.map(e=><Atag key={e} dot={false}>{e}</Atag>)}</div>
          <span className="ap-dh" style={{marginTop:"22px"}}>Sectors</span>
          <div className="ap-tags">{p.sectors.map(s=><Atag key={s} dot={false}>{s}</Atag>)}</div>
          <span className="ap-dh" style={{marginTop:"22px"}}>Where they work</span>
          <div className="ap-regions">{p.regions.map(r=><span className="ap-region" key={r}><Icon name="pin" size={14}/>{r}</span>)}</div>
        </aside>
      </section>

      {/* ---------- quote band (dark, image) ---------- */}
      {p.quote && (
        <section className="ap-quoteband">
          <Photo fill="fill-dawn" img={banner} wash="none" className="ap-quoteband-bg"/>
          <div className="ap-quoteband-scrim"></div>
          <div className="wrap ap-quoteband-in">
            <span className="ap-quote-mark">“</span>
            <blockquote className="ap-quote">{p.quote}</blockquote>
            <cite className="ap-quote-cite">{p.name} · {p.role}</cite>
            <span className="ap-quote-draft">DRAFT statement</span>
          </div>
        </section>
      )}

      {/* ---------- selected work (light, editorial gallery) ---------- */}
      {cases.length>0 && (
        <section className="wrap ap-work2 section" id="ap-work">
          <div className="sec-head">
            <div><p className="eyebrow">In the atlas</p><h2 className="fp-h2">Selected work</h2></div>
            <Btn kind="ghost" arrow to="/atlas">Open the atlas</Btn>
          </div>
          <div className="ap-gallery">
            {cases.map((c,i)=>(
              <Link to={"/case/"+c.id} className={"ap-gcard"+(i===0?" feature":"")} key={c.id}>
                <Photo fill={c.fill} seed={c.id} img={fieldImg(c)} wash="wash" className="ap-gphoto">
                  <Atag variant="on-dark" className="ap-gstage">{STAGE[c.stage].name}</Atag>
                  <div className="ap-gcap">
                    <span className="ap-gmeta">{c.country.name} · {c.sectors[0]} · {c.year}</span>
                    <h3 className="ap-gtitle">{c.title}</h3>
                    <span className="ap-glink">Read the case study <span className="arr">→</span></span>
                  </div>
                </Photo>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- writing & insights by this person ---------- */}
      {(() => {
        const authored = (window.NEWS||[]).filter(nw=>nw.author===p.name)
          .sort((a,b)=>new Date(b.date)-new Date(a.date));
        if(!authored.length) return null;
        const fmt = (iso)=>{const mo=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];const d=new Date(iso);return isNaN(d)?iso:`${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;};
        return (
          <section className="wrap ap-writing section">
            <div className="sec-head">
              <div><p className="eyebrow">From the newsroom</p><h2 className="fp-h2">Writing &amp; insights</h2></div>
              <Btn kind="ghost" arrow to="/news">All news</Btn>
            </div>
            <div className="ap-writing-list">
              {authored.map(nw=>(
                <Link to={"/news/"+nw.id} className="ap-write" key={nw.id}>
                  <Photo fill={nw.fill} seed={nw.id} wash="wash-soft" className="ap-write-photo">
                    <Atag variant="on-dark" className="ap-write-cat">{nw.cat}</Atag>
                  </Photo>
                  <div className="ap-write-body">
                    <span className="ap-write-meta">{fmt(nw.date)} · {nw.read} min read</span>
                    <h3 className="ap-write-title">{nw.title}</h3>
                    <p className="ap-write-excerpt">{nw.excerpt}</p>
                    <span className="ap-write-link">Read <span className="arr">→</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}
      <CTAFooter onContact={onContact}/>
    </main>
  );
}

/* FLIP reorder + entrance animation (WAAPI, with a force-finish fallback so cards
   always land in their correct slot even if this iframe's animation timeline stalls) */
function useFlip(){
  const ref = React.useRef(null);
  const prev = React.useRef(new Map());
  React.useLayoutEffect(()=>{
    const grid = ref.current; if(!grid) return;
    const cards = [...grid.querySelectorAll("[data-flip]")];
    const next = new Map();
    cards.forEach(el=>next.set(el.dataset.flip, el.getBoundingClientRect()));
    cards.forEach(el=>{
      const id=el.dataset.flip, n=next.get(id), p=prev.current.get(id);
      if(el._flip){ try{ el._flip.cancel(); }catch(e){} el._flip=null; }
      let a=null;
      if(p){ const dx=p.left-n.left, dy=p.top-n.top;
        if(dx||dy) a=el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:"none"}],{duration:440,easing:"cubic-bezier(.2,.85,.25,1)"});
      } else if(prev.current.size){
        a=el.animate([{opacity:0,transform:"scale(.94)"},{opacity:1,transform:"none"}],{duration:340,easing:"ease-out"});
      }
      if(a){ el._flip=a;
        const t=setTimeout(()=>{ try{ if(a.playState!=="finished") a.finish(); }catch(e){} }, 560);
        a.onfinish=()=>{ clearTimeout(t); el._flip=null; };
      }
    });
    prev.current = next;
  });
  return ref;
}

const PSORTS = [
  {key:"featured", label:"Featured"},
  {key:"name",     label:"Name"},
  {key:"region",   label:"Region"},
  {key:"projects", label:"Most projects"},
];
function sortPeople(arr, key){
  const np = p=>(p.cases||[]).length;
  const a=[...arr];
  if(key==="name") a.sort((x,y)=>x.name.localeCompare(y.name));
  else if(key==="region") a.sort((x,y)=>(x.regions[0]||"").localeCompare(y.regions[0]||"")||x.name.localeCompare(y.name));
  else if(key==="projects") a.sort((x,y)=>np(y)-np(x)||x.name.localeCompare(y.name));
  else a.sort((x,y)=>(y.lead?1:0)-(x.lead?1:0)||np(y)-np(x)); // featured: director first, then most projects
  return a;
}

function PplExpDrop({options, value, onToggle, onClear, label="Filter"}){
  const [open,setOpen]=useState(false);
  const ref=React.useRef(null);
  useEffect(()=>{ if(!open) return; const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h); },[open]);
  return (
    <div className="fdrop" ref={ref}>
      <button className={"fdrop-btn"+(value.length?" has":"")+(open?" open":"")} onClick={()=>setOpen(o=>!o)}>
        {label}{value.length>0&&<span className="fdrop-count">{value.length}</span>}
        <Icon name="chevronDown" size={15} className="fdrop-caret"/>
      </button>
      {open && (
        <div className="fdrop-pop fdrop-pop-right">
          <div className="fdrop-opts">{options.map(e=>(
            <button key={e} className={"flt-chip"+(value.includes(e)?" on":"")} onClick={()=>onToggle(e)}>{e}</button>
          ))}</div>
          {value.length>0 && <button className="ppl-exp-clear" style={{marginTop:"12px"}} onClick={onClear}>Clear filter</button>}
        </div>
      )}
    </div>
  );
}

function PeopleView({onContact}){
  const [sort, setSort] = useState("featured");
  const [sectorF, setSectorF] = useState([]);

  const ALL_SECTORS = SECTORS.filter(s=>PEOPLE.some(p=>p.sectors.includes(s)));
  const toggleSector=(k)=>setSectorF(a=>a.includes(k)?a.filter(x=>x!==k):[...a,k]);

  const filtered = PEOPLE.filter(p=> !sectorF.length || p.sectors.some(s=>sectorF.includes(s)));
  const list = sortPeople(filtered, sort);
  const gridRef = useFlip();

  return (
    <main className="ppl">
      <section className="page-hero">
        <div className="wrap page-hero-in">
          <div className="page-hero-text">
            <p className="eyebrow">People &amp; associates</p>
            <h1 className="page-h1">A delivery network, assembled for the work.</h1>
            <p className="fp-lead page-lead">Future Partners is a network of programming experts and subject specialists living and working across Aotearoa and the Pacific. We bring together the right people for each assignment — local knowledge first, manageable team sizes, one point of contact.</p>
          </div>
          <div className="page-hero-aside">
            <div className="page-stat"><span className="page-stat-n">{PEOPLE.length}</span><span className="page-stat-l">associates &amp; director</span></div>
            <div className="page-stat"><span className="page-stat-n">6</span><span className="page-stat-l">regions of the network</span></div>
            <div className="page-stat"><span className="page-stat-n">All</span><span className="page-stat-l">continents but Antarctica</span></div>
          </div>
        </div>
      </section>

      <section className="wrap ppl-body">
        <div className="ppl-toolbar">
          <div className="ppl-sort">
            <span className="ppl-sort-label">Sort</span>
            <div className="seg">
              {PSORTS.map(s=>(
                <button key={s.key} className={"seg-btn"+(sort===s.key?" on":"")} onClick={()=>setSort(s.key)}>{s.label}</button>
              ))}
            </div>
          </div>
          <div className="ppl-toolbar-right">
            <PplExpDrop options={ALL_SECTORS} value={sectorF} onToggle={toggleSector} onClear={()=>setSectorF([])} label="Filter by sector"/>
            <span className="ppl-count"><strong>{list.length}</strong> {list.length===1?"person":"people"}</span>
          </div>
        </div>

        <div className="ppl-grid" ref={gridRef}>
          {list.map(p=>(
            <Link className={"ppl-card"+(p.lead?" lead":"")} key={p.id} data-flip={p.id} to={"/people/"+p.id}>
              <Photo fill={p.fill} img={p.photo} wash="wash" className={"ppl-photo"+(p.photo?" has-portrait":"")}>
                {!p.photo && <span className="ppl-initials">{p.initials}</span>}
                {p.lead && <Atag variant="solid" className="ppl-leadtag">Director</Atag>}
                <span className="ppl-hoverview">View profile <Icon name="arrow" size={15}/></span>
              </Photo>
              <div className="ppl-cbody">
                <h3 className="ppl-name">{p.name}</h3>
                <p className="ppl-role">{p.role}</p>
                <div className="ppl-tags">{p.expertise.slice(0,2).map(e=><Atag key={e} dot={false}>{e}</Atag>)}</div>
                <div className="ppl-foot">
                  <span className="ppl-foot-region"><Icon name="pin" size={13}/>{p.regions[0]}</span>
                  <span className="ppl-projects">{(p.cases||[]).length} projects</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {list.length===0 && <div className="atlas-empty"><Icon name="users" size={30}/><h3>No one matches that sector.</h3><Btn kind="secondary" onClick={()=>setSectorF([])}>Clear filter</Btn></div>}
      </section>
      <CTAFooter onContact={onContact}/>
    </main>
  );
}
Object.assign(window, { PeopleView, People: PeopleView, AssociateProfile });
