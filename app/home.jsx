/* home.jsx — Future Partners Field Atlas homepage */

function HomeHero({onContact}){
  return (
    <section className="home-hero">
      <div className="wrap home-hero-in">
        <div className="home-hero-text">
          <p className="eyebrow reveal">Locally led · Globally connected</p>
          <h1 className="home-h1 reveal">We help solve real problems, and <span className="fp-hl">improve lives and livelihoods</span>.</h1>
          <p className="fp-lead home-hero-lead reveal">Our network of seasoned international development professionals works with donors and development organisations to deliver projects that make lasting change — in true partnership with people and communities.</p>
          <div className="home-hero-actions reveal">
            <Btn kind="primary" size="lg" arrow to="/atlas">Explore our work</Btn>
            <Btn kind="secondary" size="lg" onClick={onContact}>Work with us</Btn>
          </div>
          <div className="home-stats reveal">
            {[[SITE_STATS.projects,"Projects across Asia & the Pacific"],[SITE_STATS.countries,"Countries & regional programmes"],["25+","Years of field experience"]].map(([n,l])=>(
              <div className="home-stat" key={l}><div className="home-stat-n">{n}</div><div className="home-stat-l">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="home-hero-media reveal">
          <Photo fill="fill-coast" wash="wash" className="home-hero-photo"
            coord="08°31′S 179°12′E · Funafuti" label="Strengthening fisheries · Tuvalu">
          </Photo>
          <div className="home-hero-meta">
            <Icon name="globe" size={16}/>
            <span className="meta">All continents except Antarctica</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* dark premium "working with" proof band */
function ProofBand(){
  return (
    <section className="proof">
      <Koru className="proof-koru" stroke="var(--green-500)" op={0.45}/>
      <div className="wrap proof-in">
        <div className="proof-head">
          <p className="eyebrow on-dark">Working with</p>
          <p className="proof-sub">Governments, UN agencies, Crown research institutes, NGOs and the private sector across the region.</p>
        </div>
        <div className="proof-logos">
          {CLIENTS.map(c=>{
            const hits = CASES.filter(x=>x.client.toLowerCase().includes(c.toLowerCase())).length;
            return hits
              ? <Link to={"/atlas?q="+encodeURIComponent(c)} className="proof-logo is-link" key={c} title={`See our work with ${c}`}>{c}</Link>
              : <span className="proof-logo" key={c}>{c}</span>;
          })}
        </div>
      </div>
    </section>
  );
}

/* featured case studies — B-style inverted feature + light minis, or uniform grid */
function Featured({cardStyle="feature"}){
  const feature = caseById("nauru-health");
  const minis = ["oxfam-eval","niue-gcf","childfund-wash"].map(caseById);
  const uniform = ["nauru-health","oxfam-eval","niue-gcf"].map(caseById);
  return (
    <section className="featured section">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">Proof, not blog posts</p>
            <h2 className="fp-h2">Selected case studies</h2>
          </div>
          <Btn kind="ghost" arrow to="/atlas">Open the case study atlas</Btn>
        </div>
        {cardStyle==="uniform" ? (
          <div className="featured-uniform">
            {uniform.map(c=>(
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
        ) : (
        <div className="featured-grid">
          <Link to={"/case/"+feature.id} className="feat-card reveal">
            <Photo fill={feature.fill} seed={feature.id} wash="wash" className="feat-photo">
              <Atag variant="on-dark" className="feat-photo-tag">{STAGE[feature.stage].name} · {feature.sectors[0]}</Atag>
              <span className="feat-photo-coord">{feature.coord}</span>
            </Photo>
            <div className="feat-body">
              <h3 className="feat-title">{feature.title}</h3>
              <p className="feat-client">{feature.client} · {feature.country.name}</p>
              <span className="feat-link">Read the case study <span className="arr">→</span></span>
            </div>
          </Link>
          <div className="feat-stack">
            {minis.map((m,i)=>(
              <Link to={"/case/"+m.id} className="feat-mini reveal" key={m.id} style={{transitionDelay:(i*70)+"ms"}}>
                <div className="feat-mini-top">
                  <Atag>{STAGE[m.stage].name}</Atag>
                  <span className="feat-mini-cc">{m.country.name}</span>
                </div>
                <h4 className="feat-mini-title">{m.title}</h4>
                <div className="feat-mini-foot">
                  <span className="meta">{m.client}</span>
                  <Icon name="arrow" size={16} className="feat-mini-arr"/>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

/* real outcomes — "what the work changed" (folded in from the old Impact page) */
function Outcomes(){
  const IDS = ["nauru-health","tuvalu-fisheries","niue-gcf","oxfam-eval"];
  const cards = IDS.map(caseById).filter(c=>c&&c.full&&c.full.outcomes&&c.full.outcomes.length).map(c=>({c, o:c.full.outcomes[0]}));
  if(!cards.length) return null;
  return (
    <section className="imp-outcomes section">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">Real outcomes</p>
            <h2 className="fp-h2">What the work changed</h2>
            <p className="imp-outcomes-intro fp-lead">A few results in the partners' own terms — each drawn from a case study you can open and read in full.</p>
          </div>
          <Btn kind="ghost" arrow to="/atlas">See all the work</Btn>
        </div>
        <div className="imp-outcomegrid">
          {cards.map(({c,o},i)=>(
            <Link to={"/case/"+c.id} className="imp-outcome reveal" key={c.id} style={{transitionDelay:(i*60)+"ms"}}>
              <Atag variant="solid" className="imp-outcome-stage">{STAGE[c.stage].name}</Atag>
              <span className="imp-outcome-n">{o.n}</span>
              <span className="imp-outcome-l">{o.l}</span>
              <span className="imp-outcome-foot">
                <span className="imp-outcome-place">{c.country.name} · {c.client}</span>
                <span className="imp-outcome-link">Read the case study <span className="arr">→</span></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* interactive project-cycle navigator */
function CycleNav(){
  const [active, setActive] = useState("scope");
  const stage = STAGE[active];
  const examples = CASES.filter(c=>c.stage===active).slice(0,3);
  return (
    <section className="cyclenav section" id="services">
      <Koru className="cyclenav-koru" stroke="var(--green-300)" op={0.5}/>
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow on-dark">What we do</p>
            <h2 className="fp-h2 on-dark-h">The project cycle</h2>
            <p className="cyclenav-intro">We help you scope, design, fund, plan, deliver, review and improve development projects — wherever you are in the work.</p>
          </div>
        </div>
        <div className="cyclenav-rail reveal">
          {CYCLE.map((c,i)=>(
            <React.Fragment key={c.key}>
              {i>0 && <span className="cyclenav-arr">→</span>}
              <button className={"cyclenav-chip"+(active===c.key?" active":"")} onClick={()=>setActive(c.key)}>
                <span className="cyclenav-n">{c.n}</span>{c.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="cyclenav-panel reveal">
          <div className="cyclenav-detail">
            <div className="cyclenav-stage">
              <span className="cyclenav-stage-n">{stage.n}</span>
              <h3 className="cyclenav-stage-name">{stage.verb}</h3>
            </div>
            <p className="cyclenav-blurb">{stage.blurb}</p>
            <ul className="cyclenav-services">
              {stage.services.map(s=><li key={s}><Icon name="check" size={18}/>{s}</li>)}
            </ul>
          </div>
          <div className="cyclenav-examples">
            <span className="meta">In the field · {stage.verb}</span>
            {examples.map(ex=>(
              <Link to={"/case/"+ex.id} className="cyclenav-ex" key={ex.id}>
                <span className="cyclenav-ex-main">
                  <span className="cyclenav-ex-cc">{ex.country.name}</span>
                  <span className="cyclenav-ex-title">{ex.title}</span>
                </span>
                <Icon name="chevron" size={16}/>
              </Link>
            ))}
            {examples.length===0 && <p className="meta" style={{textTransform:"none"}}>Case studies coming soon.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* delivery network — "the standing cast": a cinematic strip that recomposes around the work */
/* delivery network — "showcase marquee": a slow horizontal roll of associates that
   pauses on interaction; each card desaturated until hovered, then colours up and
   reveals what they do + their latest work. A showcase, not a tool. */
const CAST = ["kirsty","greg","brucetta","david","eileen","ben","elisabeth","faka","hilary"].map(personById).filter(Boolean);
function latestCase(p){
  const cs=(p.cases||[]).map(caseById).filter(Boolean);
  if(!cs.length) return null;
  return cs.slice().sort((a,b)=>b.year-a.year)[0];
}

function CastCard({p, dup}){
  const lc = latestCase(p);
  return (
    <Link to={"/people/"+p.id} className="marq-card" aria-hidden={dup?"true":undefined} tabIndex={dup?-1:undefined}>
      <Photo fill={p.fill} img={p.photo} wash="wash" className={"marq-photo"+(p.photo?" has-portrait":"")}>
        {!p.photo && <span className="marq-ini">{p.initials}</span>}
        {p.lead && <span className="cast-leadtag">Director</span>}
      </Photo>
      <div className="marq-base">
        <span className="marq-name">{p.name}</span>
        <span className="marq-role">{p.role}</span>
      </div>
      <div className="marq-reveal">
        <div className="marq-rv-body">
          <span className="marq-name">{p.name}</span>
          <span className="marq-rv-role">{p.role}</span>
          {lc && (
            <div className="marq-rv-case">
              <span className="marq-rv-label">Latest work</span>
              <span className="marq-rv-casetitle">{lc.title}</span>
              <span className="marq-rv-casemeta">{lc.country.name} · {STAGE[lc.stage].name} · {lc.year}</span>
            </div>
          )}
          <span className="marq-rv-link">View profile <span className="arr">→</span></span>
        </div>
      </div>
    </Link>
  );
}

function StandingCast(){
  return (
    <section className="cast-sec section">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">A delivery network, not a directory</p>
            <h2 className="fp-h2">The people who do the work</h2>
            <p className="network-intro fp-lead">Future Partners is a network of seasoned development professionals and subject specialists, living and working across Aotearoa and the Pacific. Slow down on anyone to see what they do.</p>
          </div>
          <Btn kind="ghost" arrow to="/people">Meet the network</Btn>
        </div>
      </div>
      <div className="marq reveal" role="group" aria-label="Associates showcase">
        <div className="marq-track">
          {CAST.map(p=><CastCard key={p.id} p={p}/>)}
          {CAST.map(p=><CastCard key={"dup-"+p.id} p={p} dup/>)}
        </div>
        <span className="marq-hint meta">Hover to pause · click to meet someone</span>
      </div>
    </section>
  );
}

/* approach */
const APPROACH = [
  {icon:"sprout", t:"Solutions people own", d:"Practical solutions that local people own and everyone benefits from. Often the low-tech answer beats the hi-tech one."},
  {icon:"compass", t:"Causes, not symptoms", d:"We look for the underlying cause of a problem, not just its visible symptoms — then design for the real issue."},
  {icon:"users", t:"Everyone counts", d:"We account for women, children and youth, older people, people with disabilities and other groups who can be left behind."},
  {icon:"heart", t:"No surprises", d:"One point of contact, honest and open communication, good value for money — and we stay engaged after the assignment ends."},
];
function Approach(){
  return (
    <section className="approach section" id="approach">
      <div className="wrap">
        <div className="approach-grid">
          <div className="approach-intro reveal">
            <p className="eyebrow">Our approach</p>
            <h2 className="fp-h2">We never cut corners, and we go the extra mile.</h2>
            <p className="fp-lead">We help you make sense of the complexity, create order from the unknown, and develop coherent plans from what may seem like ambiguity — with rigour that suits the context, never overly prescriptive.</p>
            <Btn kind="secondary" arrow to="/atlas">See it in the work</Btn>
          </div>
          <div className="approach-cards">
            {APPROACH.map((a,i)=>(
              <div className="approach-card reveal" key={a.t} style={{transitionDelay:(i*60)+"ms"}}>
                <span className="approach-icon"><Icon name={a.icon} size={22}/></span>
                <h4 className="approach-t">{a.t}</h4>
                <p className="approach-d">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testi(){
  return (
    <section className="testi section">
      <div className="wrap">
        <p className="eyebrow reveal">In their words</p>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i)=>{
            const initials = t.name.split(" ").map(w=>w[0]).slice(0,2).join("");
            return (
            <figure className="testi-card reveal" key={i} style={{transitionDelay:(i*80)+"ms"}}>
              <span className="testi-mark" aria-hidden="true">”</span>
              <blockquote className="testi-quote">{t.quote}</blockquote>
              <figcaption className="testi-cap">
                <span className="testi-avatar" aria-hidden="true">{initials}</span>
                <span className="testi-capwords">
                  <span className="testi-name">{t.name}</span>
                  <span className="testi-role">{t.role}</span>
                </span>
              </figcaption>
            </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home({onContact, t={}}){
  useReveal();
  return (
    <main>
      <HomeHero onContact={onContact}/>
      <ProofBand/>
      <Featured cardStyle={t.cardStyle}/>
      <Outcomes/>
      <CycleNav/>
      <StandingCast/>
      <Approach/>
      <Testi/>
      {window.HomeNews && <window.HomeNews/>}
      <CTAFooter onContact={onContact}/>
    </main>
  );
}
Object.assign(window, { Home });
