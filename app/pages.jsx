/* pages.jsx — News & Insights (+ article), and the Services (project cycle) detail page */

const NEWS_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(iso){
  const d = new Date(iso); if(isNaN(d)) return iso;
  return `${d.getDate()} ${NEWS_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
const newsSorted = ()=>[...NEWS].sort((a,b)=> new Date(b.date)-new Date(a.date));

/* resolve an article's author to a person (for avatar + profile link) */
function newsAuthor(n){
  const p = (window.PEOPLE||[]).find(pp=>pp.name===n.author);
  if(p) return {name:p.name, photo:p.photo, id:p.id, fill:p.fill};
  return {name:n.author||"Future Partners", photo:"assets/favicon-green.png", id:null, fill:"fill-forest", mono:true};
}
function Byline({n, size=30, light, plain}){
  const a = newsAuthor(n);
  const av = (
    <span className={"byline-av"+(a.mono?" mono":"")} style={{width:size,height:size,backgroundImage:a.photo?`url(${a.photo})`:"none"}} aria-hidden="true"></span>
  );
  const linkable = a.id && !plain;
  return (
    <span className={"byline"+(light?" light":"")}>
      {linkable ? <Link to={"/people/"+a.id} className="byline-avlink">{av}</Link> : av}
      <span className="byline-name">{linkable ? <Link to={"/people/"+a.id}>{a.name}</Link> : a.name}</span>
    </span>
  );
}

const SHARE = (n)=>{
  const url = encodeURIComponent(location.origin+location.pathname+"#/news/"+n.id);
  const text = encodeURIComponent(n.title);
  return [
    {key:"x", label:"X", icon:"x-social", href:`https://twitter.com/intent/tweet?text=${text}&url=${url}`},
    {key:"li", label:"LinkedIn", icon:"linkedin", href:`https://www.linkedin.com/sharing/share-offsite/?url=${url}`},
    {key:"fb", label:"Facebook", icon:"facebook", href:`https://www.facebook.com/sharer/sharer.php?u=${url}`},
    {key:"mail", label:"Email", icon:"mail", href:`mailto:?subject=${text}&body=${url}`},
  ];
};

function NewsView({onContact}){
  useReveal();
  const [cat,setCat]=useState("All");
  const [q,setQ]=useState("");
  const [topic,setTopic]=useState(null);

  const all = newsSorted();
  const filtering = cat!=="All" || q.trim() || topic;
  const ql = q.trim().toLowerCase();
  const list = all.filter(n=>{
    if(cat!=="All" && n.cat!==cat) return false;
    if(topic && !(n.topics||[]).includes(topic)) return false;
    if(ql){
      const hay = (n.title+" "+n.excerpt+" "+(n.topics||[]).join(" ")+" "+(n.author||"")).toLowerCase();
      if(!hay.includes(ql)) return false;
    }
    return true;
  });
  const feature = !filtering ? all[0] : null;
  const grid = feature ? list.slice(1) : list;
  const counts = c => c==="All" ? all.length : all.filter(n=>n.cat===c).length;

  return (
    <main className="news">
      <section className="page-hero news-hero">
        <div className="wrap page-hero-in news-hero-in">
          <div className="page-hero-text">
            <p className="eyebrow">News &amp; insights</p>
            <h1 className="page-h1">From the field, and from the network.</h1>
            <p className="fp-lead page-lead">Notes on the work, the people and the issues we care about — locally led development across Aotearoa, Asia and the Pacific.</p>
          </div>
        </div>
      </section>

      {/* filter bar */}
      <div className="news-toolbar">
        <div className="wrap news-toolbar-in">
          <div className="news-cats" role="tablist">
            {["All",...NEWS_CATS].map(c=>(
              <button key={c} role="tab" aria-selected={cat===c}
                className={"news-cat"+(cat===c?" on":"")} onClick={()=>setCat(c)}>
                {c}<span className="news-cat-n">{counts(c)}</span>
              </button>
            ))}
          </div>
          <label className="news-search">
            <Icon name="search" size={16}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search news…" aria-label="Search news"/>
            {q && <button className="news-search-clear" onClick={()=>setQ("")} aria-label="Clear search"><Icon name="x" size={14}/></button>}
          </label>
        </div>
      </div>

      <section className="wrap news-body section">
        {topic && (
          <div className="news-activetopic">
            <span>Filtered by topic</span>
            <button className="news-topicpill on" onClick={()=>setTopic(null)}>{topic} <Icon name="x" size={13}/></button>
          </div>
        )}

        {feature && (
          <Link to={"/news/"+feature.id} className="news-feature reveal">
            <Photo fill={feature.fill} seed={feature.id} wash="wash" className="news-feature-photo">
              <Atag variant="on-dark" className="news-feature-cat">{feature.cat}</Atag>
              <span className="news-feature-date">{fmtDate(feature.date)}</span>
            </Photo>
            <div className="news-feature-body">
              <span className="eyebrow">Latest</span>
              <h2 className="news-feature-title">{feature.title}</h2>
              <p className="news-feature-excerpt">{feature.excerpt}</p>
              <div className="news-meta-row">
                <Byline n={feature} size={34} plain/>
                <span className="news-dot">·</span>
                <span>{feature.read} min read</span>
              </div>
              <span className="news-readmore">Read the update <span className="arr">→</span></span>
            </div>
          </Link>
        )}

        {filtering && (
          <div className="news-resultline">
            <span className="news-count">{list.length} {list.length===1?"article":"articles"}{cat!=="All"?` in ${cat}`:""}{topic?` · ${topic}`:""}{ql?` · “${q}”`:""}</span>
            <button className="news-clearall" onClick={()=>{setCat("All");setQ("");setTopic(null);}}>Clear filters</button>
          </div>
        )}

        {grid.length>0 ? (
          <div className="news-grid">
            {grid.map((n,i)=>(
              <article className="news-card reveal" key={n.id} style={{transitionDelay:(i*45)+"ms"}}>
                <Link to={"/news/"+n.id} className="news-card-photolink">
                  <Photo fill={n.fill} seed={n.id} wash="wash-soft" className="news-card-photo">
                    <Atag variant="on-dark" className="news-card-cat">{n.cat}</Atag>
                  </Photo>
                </Link>
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span className="news-card-date">{fmtDate(n.date)}</span>
                    <span className="news-dot">·</span>
                    <span>{n.read} min</span>
                  </div>
                  <h3 className="news-card-title"><Link to={"/news/"+n.id}>{n.title}</Link></h3>
                  <p className="news-card-excerpt">{n.excerpt}</p>
                  <div className="news-card-foot">
                    <Byline n={n} size={26}/>
                  </div>
                  <div className="news-card-topics">
                    {(n.topics||[]).slice(0,3).map(tp=>(
                      <button key={tp} className="news-topicpill" onClick={()=>setTopic(tp)}>{tp}</button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="news-empty">
            <Icon name="search" size={28}/>
            <h3>No articles match.</h3>
            <p>Try a different category or search term.</p>
            <Btn kind="secondary" onClick={()=>{setCat("All");setQ("");setTopic(null);}}>Clear filters</Btn>
          </div>
        )}
      </section>
      <CTAFooter onContact={onContact}/>
    </main>
  );
}

function NewsArticle({id, onContact}){
  useReveal();
  const [copied,setCopied]=useState(false);
  const n = newsById(id);
  if(!n) return (
    <main className="wrap" style={{padding:"120px 40px",minHeight:"60vh"}}>
      <p className="eyebrow">Not found</p><h1 className="fp-h1">That article isn't here.</h1>
      <Btn kind="secondary" arrow to="/news">Back to news</Btn>
    </main>
  );
  const related = newsSorted().filter(x=>x.id!==n.id && (x.cat===n.cat || (x.topics||[]).some(t=>(n.topics||[]).includes(t)))).slice(0,3);
  return (
    <main className="nart">
      <section className="nart-hero">
        <Photo fill={n.fill} seed={n.id} wash="wash" className="nart-hero-photo"/>
        <div className="wrap nart-hero-in">
          <Link to="/news" className="cs-back"><Icon name="arrow" size={16} style={{transform:"rotate(180deg)"}}/> News &amp; insights</Link>
          <Atag variant="solid" className="nart-cat">{n.cat}</Atag>
          <h1 className="nart-h1">{n.title}</h1>
          <div className="nart-meta">
            <Byline n={n} size={38} light/>
            <span className="news-dot">·</span>
            <span>{fmtDate(n.date)}</span><span className="news-dot">·</span>
            <span>{n.read} min read</span>
          </div>
        </div>
      </section>

      <section className="wrap nart-body">
        <article className="nart-prose">
          <p className="nart-lead">{n.excerpt}</p>
          {(n.body||[]).map((p,i)=><p key={i}>{p}</p>)}
          <div className="nart-topics">
            {(n.topics||[]).map(tp=>(
              <Link key={tp} to="/news" className="news-topicpill">{tp}</Link>
            ))}
          </div>
        </article>
        <aside className="nart-side">
          <div className="cs-panel">
            <span className="cs-panel-h">Share</span>
            <div className="nart-share">
              {SHARE(n).map(s=>(
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="nart-share-icon" aria-label={"Share on "+s.label} title={s.label}><Icon name={s.icon} size={17}/></a>
              ))}
              <button onClick={()=>{if(navigator.clipboard){navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(()=>setCopied(false),1600);}}} className="nart-share-icon" aria-label="Copy link" title="Copy link"><Icon name={copied?"check":"link"} size={17}/></button>
            </div>
            {copied && <span className="nart-copied">Link copied</span>}
          </div>
          <div className="cs-panel cs-panel-cta">
            <span className="cs-panel-h">Work with us</span>
            <p className="nart-cta-desc">Have a programme we could help with? We'd love to hear from you.</p>
            <Btn kind="primary" size="sm" arrow onClick={onContact}>Get in touch</Btn>
          </div>
        </aside>
      </section>

      {related.length>0 && (
        <section className="news-related section">
          <div className="wrap">
            <div className="sec-head">
              <div><p className="eyebrow">Keep reading</p><h2 className="fp-h2">Related updates</h2></div>
              <Btn kind="ghost" arrow to="/news">All news</Btn>
            </div>
            <div className="news-grid">
              {related.map(r=>(
                <article className="news-card" key={r.id}>
                  <Link to={"/news/"+r.id} className="news-card-photolink">
                    <Photo fill={r.fill} seed={r.id} wash="wash-soft" className="news-card-photo">
                      <Atag variant="on-dark" className="news-card-cat">{r.cat}</Atag>
                    </Photo>
                  </Link>
                  <div className="news-card-body">
                    <div className="news-card-meta"><span className="news-card-date">{fmtDate(r.date)}</span><span className="news-dot">·</span><span>{r.read} min</span></div>
                    <h3 className="news-card-title"><Link to={"/news/"+r.id}>{r.title}</Link></h3>
                    <p className="news-card-excerpt">{r.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTAFooter onContact={onContact}/>
    </main>
  );
}

function ServicesView({onContact}){
  useReveal();
  const [active,setActive]=useState(0);
  const stepRefs=React.useRef([]);
  useEffect(()=>{
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) setActive(+e.target.dataset.i); });
    },{rootMargin:"-50% 0px -50% 0px", threshold:0});
    stepRefs.current.forEach(el=>el&&obs.observe(el));
    return ()=>obs.disconnect();
  },[]);
  const A=CYCLE[active];
  return (
    <main className="srv">
      <section className="page-hero">
        <div className="wrap page-hero-in">
          <div className="page-hero-text">
            <p className="eyebrow">Our services</p>
            <h1 className="page-h1">Support across the whole project cycle.</h1>
            <p className="fp-lead page-lead">We help you scope, design, fund, plan, deliver, review and improve development projects — from one part of the cycle to a programme end to end. We make sense of the complexity and develop coherent plans from what may seem like ambiguity.</p>
            <div className="srv-hero-actions">
              <Btn kind="primary" size="lg" arrow onClick={onContact}>Work with us</Btn>
              <Btn kind="secondary" size="lg" arrow to="/atlas">See it in the work</Btn>
            </div>
          </div>
          <div className="page-hero-aside">
            <div className="page-stat"><span className="page-stat-n">{SITE_STATS.stages}</span><span className="page-stat-l">stages of the cycle</span></div>
            <div className="page-stat"><span className="page-stat-n">{SITE_STATS.projects}</span><span className="page-stat-l">projects delivered</span></div>
          </div>
        </div>
      </section>

      <section className="srv-scrolly section">
        <div className="wrap srv-scrolly-grid">
          <aside className="srv-sticky">
            <div className="srv-sticky-inner">
              <span className="eyebrow">The project cycle</span>
              <div className="srv-now" key={active}>
                <span className="srv-now-n">{A.n}</span>
                <h2 className="srv-now-name">{A.verb}</h2>
              </div>
              <ol className="srv-rail" style={{"--prog":(active/(CYCLE.length-1))}}>
                {CYCLE.map((s,i)=>(
                  <li key={s.key} className={"srv-rail-step"+(i===active?" on":"")+(i<active?" done":"")} onClick={()=>{const el=stepRefs.current[i]; if(el){const y=el.getBoundingClientRect().top+window.scrollY-140; window.scrollTo({top:y,behavior:"smooth"});}}}>
                    <span className="srv-rail-dot"></span>
                    <span className="srv-rail-name">{s.verb}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
          <div className="srv-steps">
            {CYCLE.map((s,i)=>{
              const examples = CASES.filter(c=>c.stage===s.key).slice(0,3);
              return (
                <section className="srv-step" key={s.key} data-i={i} ref={el=>stepRefs.current[i]=el}>
                  <div className="srv-step-head">
                    <span className="srv-step-n">{s.n}</span>
                    <h3 className="srv-step-name">{s.verb}</h3>
                  </div>
                  <p className="srv-step-blurb">{s.blurb}</p>
                  <ul className="srv-services">
                    {s.services.map(x=><li key={x}><Icon name="check" size={18}/>{x}</li>)}
                  </ul>
                  {examples.length>0 && (
                    <div className="srv-examples">
                      <span className="meta">In the field · {s.verb}</span>
                      {examples.map(ex=>(
                        <Link key={ex.id} to={"/case/"+ex.id} className="srv-ex">
                          <span className="srv-ex-cc">{ex.country.name}</span>
                          <span className="srv-ex-t">{ex.title}</span>
                          <Icon name="chevron" size={15}/>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <CTAFooter onContact={onContact}/>
    </main>
  );
}

Object.assign(window, { NewsView, NewsArticle, ServicesView, HomeNews });

/* compact 3-up "latest" strip for the homepage */
function HomeNews(){
  const latest = newsSorted().slice(0,3);
  return (
    <section className="homenews section">
      <div className="wrap">
        <div className="sec-head reveal">
          <div><p className="eyebrow">News &amp; insights</p><h2 className="fp-h2">Latest from the field</h2></div>
          <Btn kind="ghost" arrow to="/news">All news</Btn>
        </div>
        <div className="news-grid">
          {latest.map((n,i)=>(
            <article className="news-card reveal" key={n.id} style={{transitionDelay:(i*60)+"ms"}}>
              <Link to={"/news/"+n.id} className="news-card-photolink">
                <Photo fill={n.fill} seed={n.id} wash="wash-soft" className="news-card-photo">
                  <Atag variant="on-dark" className="news-card-cat">{n.cat}</Atag>
                </Photo>
              </Link>
              <div className="news-card-body">
                <div className="news-card-meta"><span className="news-card-date">{fmtDate(n.date)}</span><span className="news-dot">·</span><span>{n.read} min</span></div>
                <h3 className="news-card-title"><Link to={"/news/"+n.id}>{n.title}</Link></h3>
                <p className="news-card-excerpt">{n.excerpt}</p>
                <div className="news-card-foot"><Byline n={n} size={26}/></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
