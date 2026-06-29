/* atlas.jsx — Case Studies Atlas: interactive Pacific map + tidy filters + index/grid */

/* ---- coordinate parsing → normalised x/y on a stylised Pacific map ---- */
function parseCoord(str){
  const m = /(\d+)°(\d+)′([NS])\s+(\d+)°(\d+)′([EW])/.exec(str||"");
  if(!m) return null;
  let lat = (+m[1])+(+m[2])/60; if(m[3]==="S") lat=-lat;
  let lng = (+m[4])+(+m[5])/60; if(m[6]==="W") lng=360-lng; // east of antimeridian
  return {lat,lng};
}
const REGION_FALLBACK = {
  "Pacific regional":{lat:-11,lng:181}, "Asia":{lat:6,lng:124}, "Micronesia":{lat:2,lng:170},
  "Melanesia":{lat:-12,lng:164}, "Polynesia":{lat:-16,lng:191}, "Aotearoa NZ":{lat:-41.3,lng:174.8},
};
function hashJit(id){ let h=0; for(let i=0;i<id.length;i++) h=(h*31+id.charCodeAt(i))&0xffff; return ((h%100)/100-0.5); }
function casePos(c){
  let g = parseCoord(c.coord) || REGION_FALLBACK[c.region] || {lat:-11,lng:181};
  // jitter regional / fallback points so they don't stack
  if(!parseCoord(c.coord)){ g={lat:g.lat+hashJit(c.id)*7, lng:g.lng+hashJit(c.id+"x")*12}; }
  const x = (g.lng-121)/(206-121);
  const y = (g.lat-6)/(-45-6);
  return { x: Math.max(.04,Math.min(.96,x))*100, y: Math.max(.06,Math.min(.95,y))*100 };
}
const STAGE_HUE = { scope:"var(--green-300)", design:"var(--green-400)", fund:"var(--green-500)",
  plan:"var(--green-600)", deliver:"var(--green-700)", review:"var(--green-800)", improve:"var(--green-900)" };

/* ---- real geographic map (d3 + world-atlas), graceful fallback to stylised ---- */
let _topoCache=null, _topoPromise=null;
function loadTopo(){
  if(_topoCache) return Promise.resolve(_topoCache);
  if(!_topoPromise) _topoPromise = fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then(r=>r.json()).then(j=>{_topoCache=j;return j;});
  return _topoPromise;
}
const REGION_REAL = {
  "Pacific regional":{lat:-8,lng:179}, "Asia":{lat:1,lng:123}, "Micronesia":{lat:4,lng:168},
  "Melanesia":{lat:-13,lng:162}, "Polynesia":{lat:-15,lng:-172}, "Aotearoa NZ":{lat:-41.3,lng:174.8},
};
function realCoord(c){
  const m=/(\d+)°(\d+)′([NS])\s+(\d+)°(\d+)′([EW])/.exec(c.coord||"");
  if(m){ let lat=(+m[1])+(+m[2])/60; if(m[3]==="S")lat=-lat; let lng=(+m[4])+(+m[5])/60; if(m[6]==="W")lng=-lng; return {lat,lng}; }
  const f=REGION_REAL[c.region]||{lat:-9,lng:178};
  return {lat:f.lat+hashJit(c.id)*10, lng:f.lng+hashJit(c.id+"x")*18};
}
const REGION_LABELS = [
  {region:"Asia",x:123,y:3,label:"Asia"},
  {region:"Micronesia",x:166,y:6,label:"Micronesia"},
  {region:"Melanesia",x:160,y:-14,label:"Melanesia"},
  {region:"Pacific regional",x:181,y:-4,label:"Pacific"},
  {region:"Polynesia",x:-171,y:-13,label:"Polynesia"},
  {region:"Aotearoa NZ",x:174.8,y:-45,label:"Aotearoa"},
];

function RealMap(props){
  const { cases, matchSet, regions, onRegion, onOpen } = props;
  const [topo,setTopo]=useState(_topoCache);
  const [hover,setHover]=useState(null);
  const [zt,setZt]=useState({k:1,x:0,y:0});
  const svgRef=React.useRef(null);
  const zoomRef=React.useRef(null);
  const W=1000,H=560;
  useEffect(()=>{ let on=true; loadTopo().then(t=>{ if(on) setTopo(t); }).catch(()=>{}); return ()=>{on=false}; },[]);

  // pan / zoom — drag to pan, pinch or buttons to zoom; plain wheel still scrolls the page
  useEffect(()=>{
    if(!window.d3 || !svgRef.current) return;
    const sel=d3.select(svgRef.current);
    const zoom=d3.zoom().scaleExtent([1,7]).translateExtent([[0,0],[W,H]]).extent([[0,0],[W,H]])
      .filter((e)=> e.type==="wheel" ? e.ctrlKey : (!e.button))
      .on("zoom",(e)=>setZt({k:e.transform.k,x:e.transform.x,y:e.transform.y}));
    sel.call(zoom);
    zoomRef.current=zoom;
    return ()=>{ sel.on(".zoom",null); };
  },[topo]);

  if(!(window.d3 && window.topojson)) return <AtlasMap {...props}/>;  // fallback if libs missing

  const proj=d3.geoEquirectangular().rotate([-180,0]);
  const pts=CASES.map(c=>{ const g=realCoord(c); return [g.lng,g.lat]; });
  pts.push([116,16],[-150,-48]); // frame anchors (NW / SE)
  proj.fitExtent([[22,20],[W-22,H-26]], {type:"MultiPoint",coordinates:pts});
  const path=d3.geoPath(proj);
  const land = topo ? topojson.feature(topo, topo.objects.countries) : null;
  const grat = d3.geoGraticule().step([10,10])();
  const pr=(lng,lat)=>proj([lng,lat]);
  const tf=`translate(${zt.x},${zt.y}) scale(${zt.k})`;
  const k=zt.k;

  const hc = hover && cases.find(c=>c.id===hover);
  let tip=null;
  if(hc){ const g=realCoord(hc); const p=pr(g.lng,g.lat); tip={x:(p[0]*k+zt.x)/W*100,y:(p[1]*k+zt.y)/H*100,c:hc}; }

  const zoomBy=(f)=>{ const z=zoomRef.current, n=svgRef.current; if(z&&n) z.scaleBy(d3.select(n), f); };
  const zoomReset=()=>{ const z=zoomRef.current, n=svgRef.current; if(z&&n) z.transform(d3.select(n), d3.zoomIdentity); };

  return (
    <div className="amap">
      <div className="amap-frame real">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className={"amap-svg"+(k>1?" zoomed":"")} preserveAspectRatio="xMidYMid slice">
          <rect x="0" y="0" width={W} height={H} className="amap-ocean"/>
          <g transform={tf}>
            <path d={path(grat)} className="amap-grat"/>
            {land && <path d={path(land)} className="amap-land"/>}
            {land && <path d={path(topojson.mesh(topo, topo.objects.countries, (a,b)=>a!==b))} className="amap-border"/>}
            {/* region labels (clickable filters) */}
            {REGION_LABELS.map(z=>{ const p=pr(z.x,z.y); const on=regions.includes(z.region);
              return <text key={z.region} x={p[0]} y={p[1]} className={"amap-rlabel"+(on?" on":"")}
                style={{fontSize:(12/k)+"px"}} onClick={()=>onRegion(z.region)}>{z.label}</text>; })}
            {/* case dots */}
            {cases.map((c,i)=>{ const g=realCoord(c); const p=pr(g.lng,g.lat); const dim=matchSet&&!matchSet.has(c.id);
              return <circle key={c.id} cx={p[0]} cy={p[1]} r={(hover===c.id?9:6.5)/k}
                className={"amap-cdot"+(dim?" dim":"")+(hover===c.id?" on":"")}
                style={{fill:STAGE_HUE[c.stage], animationDelay:(i*22)+"ms"}}
                onMouseEnter={()=>setHover(c.id)} onMouseLeave={()=>setHover(null)}
                onClick={()=>onOpen(c.id)} tabIndex={0}
                onFocus={()=>setHover(c.id)} onBlur={()=>setHover(null)}><title>{c.title}</title></circle>; })}
          </g>
        </svg>
        <div className="amap-zoomctl">
          <button onClick={()=>zoomBy(1.7)} aria-label="Zoom in">+</button>
          <button onClick={()=>zoomBy(1/1.7)} aria-label="Zoom out">−</button>
          {k>1.02 && <button onClick={zoomReset} aria-label="Reset view" className="amap-zoomreset"><Icon name="x" size={14}/></button>}
        </div>
        {tip && (
          <div className={"amap-tip"+(tip.y>58?" flip":"")+(tip.x>64?" left":tip.x<36?" right":"")}
            style={{left:tip.x+"%", top:tip.y+"%"}}>
            <span className="amap-tip-coord">{tip.c.coord}</span>
            <span className="amap-tip-title">{tip.c.title}</span>
            <span className="amap-tip-meta"><Atag dot={false}>{STAGE[tip.c.stage].name}</Atag> {tip.c.country.name}</span>
          </div>
        )}
      </div>
      <div className="amap-legend">
        <span className="amap-legend-label">Project cycle</span>
        <div className="amap-legend-scale">
          {CYCLE.map(s=>(<span key={s.key} className="amap-legend-item" title={s.name}>
            <span className="amap-legend-sw" style={{background:STAGE_HUE[s.key]}}></span>{s.name}</span>))}
        </div>
        <span className="amap-legend-hint meta">Drag to pan · pinch or use + / − to zoom · click a region to filter</span>
      </div>
    </div>
  );
}
const REGION_ZONES = [
  {region:"Asia",            x:11, y:30, label:"Asia"},
  {region:"Micronesia",      x:46, y:20, label:"Micronesia"},
  {region:"Melanesia",       x:34, y:58, label:"Melanesia"},
  {region:"Polynesia",       x:74, y:46, label:"Polynesia"},
  {region:"Pacific regional",x:58, y:38, label:"Pacific\u2009·\u2009regional"},
  {region:"Aotearoa NZ",     x:60, y:88, label:"Aotearoa"},
];

function AtlasMap({cases, matchSet, regions, onRegion, onOpen}){
  const [hover, setHover] = useState(null);
  const hc = hover && cases.find(c=>c.id===hover);
  return (
    <div className="amap">
      <div className="amap-frame">
        {/* lat/long grid */}
        <svg className="amap-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[20,40,60,80].map(x=><line key={"v"+x} x1={x} y1="0" x2={x} y2="100"/>)}
          {[25,50,75].map(y=><line key={"h"+y} x1="0" y1={y} x2="100" y2={y}/>)}
        </svg>
        {/* region zones (clickable filters) */}
        {REGION_ZONES.map(z=>{
          const on = regions.includes(z.region);
          return (
            <button key={z.region} className={"amap-zone"+(on?" on":"")} style={{left:z.x+"%",top:z.y+"%"}}
              onClick={()=>onRegion(z.region)} title={"Filter: "+z.region}>
              <span className="amap-zone-ring"></span>
              <span className="amap-zone-label">{z.label}</span>
            </button>
          );
        })}
        {/* case dots */}
        {cases.map(c=>{
          const p = casePos(c);
          const dim = matchSet && !matchSet.has(c.id);
          return (
            <button key={c.id} className={"amap-dot"+(dim?" dim":"")+(hover===c.id?" on":"")}
              style={{left:p.x+"%", top:p.y+"%", "--hue":STAGE_HUE[c.stage]}}
              onMouseEnter={()=>setHover(c.id)} onMouseLeave={()=>setHover(null)}
              onFocus={()=>setHover(c.id)} onBlur={()=>setHover(null)}
              onClick={()=>onOpen(c.id)} aria-label={c.title}>
            </button>
          );
        })}
        {/* hover tooltip */}
        {hc && (()=>{ const p=casePos(hc); return (
          <div className={"amap-tip"+(p.y>60?" flip":"")+(p.x>62?" left":p.x<38?" right":"")} style={{left:p.x+"%", top:p.y+"%"}}>
            <span className="amap-tip-coord">{hc.coord}</span>
            <span className="amap-tip-title">{hc.title}</span>
            <span className="amap-tip-meta"><Atag dot={false}>{STAGE[hc.stage].name}</Atag> {hc.country.name}</span>
          </div>
        );})()}
      </div>
      <div className="amap-legend">
        <span className="amap-legend-label">Project cycle</span>
        <div className="amap-legend-scale">
          {CYCLE.map(s=>(
            <span key={s.key} className="amap-legend-item" title={s.name}>
              <span className="amap-legend-sw" style={{background:STAGE_HUE[s.key]}}></span>{s.name}
            </span>
          ))}
        </div>
        <span className="amap-legend-hint meta">Click a region to filter · click a point to open</span>
      </div>
    </div>
  );
}

/* ---- filter dropdown ---- */
function Dropdown({label, count, children}){
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{
    if(!open) return;
    const on = (e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", on);
    return ()=>document.removeEventListener("mousedown", on);
  },[open]);
  return (
    <div className="fdrop" ref={ref}>
      <button className={"fdrop-btn"+(count>0?" has":"")+(open?" open":"")} onClick={()=>setOpen(o=>!o)}>
        {label}{count>0 && <span className="fdrop-count">{count}</span>}
        <Icon name="chevronDown" size={15} className="fdrop-caret"/>
      </button>
      {open && <div className="fdrop-pop">{children}</div>}
    </div>
  );
}

function Atlas({onContact}){
  const Q = (typeof window.hashQuery==="function") ? window.hashQuery() : {};
  const [stages,setStages]=useState([]);
  const [sectors,setSectors]=useState([]);
  const [regions,setRegions]=useState([]);
  const [clientTypes,setClientTypes]=useState([]);
  const [query,setQuery]=useState(Q.q||"");
  const [personF,setPersonF]=useState(Q.person||"");
  const [view,setView]=useState("grid");
  const [sort,setSort]=useState("year");

  const toggle=(arr,set)=>(k)=>set(arr.includes(k)?arr.filter(x=>x!==k):[...arr,k]);
  const clearAll=()=>{setStages([]);setSectors([]);setRegions([]);setClientTypes([]);setQuery("");setPersonF("");};
  const personObj = personF ? personById(personF) : null;
  const activeCount=stages.length+sectors.length+regions.length+clientTypes.length+(query?1:0)+(personF?1:0);

  const match=(c)=>{
    if(stages.length && !stages.includes(c.stage)) return false;
    if(sectors.length && !c.sectors.some(s=>sectors.includes(s))) return false;
    if(regions.length && !regions.includes(c.region)) return false;
    if(clientTypes.length && !clientTypes.includes(c.clientType)) return false;
    if(personF && !(c.people||[]).includes(personF)) return false;
    if(query){ const q=query.toLowerCase(); if(!(c.title+" "+c.client+" "+c.country.name).toLowerCase().includes(q)) return false; }
    return true;
  };
  const matchSet = new Set(CASES.filter(match).map(c=>c.id));
  let list = CASES.filter(c=>matchSet.has(c.id));
  list = [...list].sort((a,b)=> sort==="year" ? b.year-a.year
    : sort==="stage" ? CYCLE.findIndex(s=>s.key===a.stage)-CYCLE.findIndex(s=>s.key===b.stage)
    : a.country.name.localeCompare(b.country.name));

  const chips=[
    ...(personObj?[{k:"__person",label:"Work by "+personObj.name,rm:()=>setPersonF("")}]:[]),
    ...stages.map(k=>({k,label:STAGE[k].name,rm:()=>toggle(stages,setStages)(k)})),
    ...sectors.map(k=>({k,label:k,rm:()=>toggle(sectors,setSectors)(k)})),
    ...regions.map(k=>({k,label:k,rm:()=>toggle(regions,setRegions)(k)})),
    ...clientTypes.map(k=>({k,label:k,rm:()=>toggle(clientTypes,setClientTypes)(k)})),
  ];

  const pillGroup=(opts,val,onToggle)=>(
    <div className="fdrop-opts">{opts.map(o=>{
      const key=o.key||o; const on=val.includes(key);
      return <button key={key} className={"flt-chip"+(on?" on":"")} onClick={()=>onToggle(key)}>{o.n&&<span className="flt-n">{o.n}</span>}{o.name||o}</button>;
    })}</div>
  );

  return (
    <main className="atlas">
      <section className="page-hero">
        <div className="wrap page-hero-in">
          <div className="page-hero-text">
            <p className="eyebrow">The case study atlas</p>
            <h1 className="page-h1">Proof of what works, mapped across the region.</h1>
            <p className="fp-lead page-lead">Every assignment Future Partners has shaped — explore it on the map, or filter by where it sits in the project cycle, the region, the sector and the kind of client.</p>
          </div>
          <div className="page-hero-aside">
            {[[SITE_STATS.projects,"records"],[SITE_STATS.countries,"countries & regions"],[SITE_STATS.stages,"cycle stages"]].map(([n,l])=>(
              <div className="page-stat" key={l}><span className="page-stat-n">{n}</span><span className="page-stat-l">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap atlas-map-sec">
        <RealMap cases={CASES} matchSet={activeCount?matchSet:null} regions={regions}
          onRegion={toggle(regions,setRegions)} onOpen={(id)=>navigate("/case/"+id)}/>
      </section>

      <div className="atlas-bar-wrap">
        <div className="wrap atlas-bar">
          <label className="atlas-search">
            <Icon name="search" size={17}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the atlas…"/>
          </label>
          <div className="atlas-drops">
            <Dropdown label="Cycle" count={stages.length}>{pillGroup(CYCLE,stages,toggle(stages,setStages))}</Dropdown>
            <Dropdown label="Sector" count={sectors.length}>{pillGroup(SECTORS,sectors,toggle(sectors,setSectors))}</Dropdown>
            <Dropdown label="Region" count={regions.length}>{pillGroup(REGIONS,regions,toggle(regions,setRegions))}</Dropdown>
            <Dropdown label="Client" count={clientTypes.length}>{pillGroup(CLIENT_TYPES,clientTypes,toggle(clientTypes,setClientTypes))}</Dropdown>
          </div>
          <div className="atlas-bar-right">
            <div className="atlas-sort">
              <span className="meta">Sort</span>
              <select value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="year">Recent</option><option value="stage">Cycle</option><option value="country">Country</option>
              </select>
            </div>
            <div className="atlas-viewtoggle">
              <button className={view==="index"?"on":""} onClick={()=>setView("index")} aria-label="Index view"><Icon name="list" size={18}/></button>
              <button className={view==="grid"?"on":""} onClick={()=>setView("grid")} aria-label="Grid view"><Icon name="grid" size={18}/></button>
            </div>
          </div>
        </div>
        {chips.length>0 && (
          <div className="wrap atlas-chips">
            <span className="atlas-chips-label"><strong>{list.length}</strong> of {CASES.length}</span>
            {chips.map(ch=>(
              <button className="atlas-chip" key={ch.k} onClick={ch.rm}>{ch.label}<Icon name="x" size={13}/></button>
            ))}
            <button className="atlas-chip-clear" onClick={clearAll}>Clear all</button>
          </div>
        )}
      </div>

      <section className="wrap atlas-results-sec">
        {list.length===0 ? (
          <div className="atlas-empty">
            <Icon name="compass" size={32}/><h3>No records match those filters.</h3>
            <p>Try widening the cycle stage or region.</p><Btn kind="secondary" onClick={clearAll}>Clear filters</Btn>
          </div>
        ) : view==="index" ? (
          <div className="atlas-index">
            <div className="atlas-index-head"><span>Country</span><span>Project</span><span className="col-stage">Stage</span><span className="col-year">Year</span></div>
            {list.map(c=>(
              <Link to={"/case/"+c.id} className="atlas-row" key={c.id}>
                <div className="atlas-row-cc"><span className="atlas-row-country">{c.country.name}</span><span className="atlas-row-coord">{c.coord}</span></div>
                <div className="atlas-row-main"><span className="atlas-row-title">{c.title}</span><span className="atlas-row-client">{c.client} · {c.sectors[0]}</span></div>
                <div className="col-stage"><Atag>{STAGE[c.stage].name}</Atag></div>
                <div className="col-year"><span className="atlas-row-year">{c.year}</span><Icon name="chevron" size={16}/></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="atlas-grid">
            {list.map(c=>(
              <Link to={"/case/"+c.id} className="card card-link atlas-card" key={c.id}>
                <Photo fill={c.fill} seed={c.id} wash="wash-soft" className="atlas-card-photo">
                  <Atag variant="on-dark" className="atlas-card-stage">{STAGE[c.stage].name}</Atag>
                  <span className="atlas-card-coord">{c.coord}</span>
                </Photo>
                <div className="atlas-card-body">
                  <div className="atlas-card-tags"><Atag dot={false}>{c.sectors[0]}</Atag><span className="atlas-card-cc">{c.country.name}</span></div>
                  <h3 className="atlas-card-title">{c.title}</h3>
                  <p className="atlas-card-client">{c.client}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <CTAFooter onContact={onContact}/>
    </main>
  );
}
Object.assign(window, { Atlas });
