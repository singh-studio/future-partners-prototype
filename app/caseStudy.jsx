/* caseStudy.jsx — case study detail page */

/* Narrative: `challenge` is real, reshaped from the public project page (c.brief).
   The remaining sections summarise Future Partners' own stated approach applied
   to the project — not verbatim, but grounded in the firm's published methods. */
function draftNarrative(c){
  const place = c.country.name;
  const sec = (c.sectors[0]||"").toLowerCase();
  return {
    challenge: (c.full&&c.full.challenge) || c.brief || `${c.client} needed to move past a stuck point in their ${sec} work in ${place}. The picture was complex: real constraints on the ground, multiple stakeholders, and a need to get the underlying problem right before committing resources.`,
    did: (c.full&&c.full.did) || [
      `Worked alongside the ${place} team — not on their behalf — to map the real problem beneath the visible symptoms.`,
      `Built a practical, locally owned approach that fits the ${place} context rather than importing an off-the-shelf model.`,
      `Accounted for the people most easily left behind — women, youth, older people and those with disabilities.`,
      `Kept one clear point of contact throughout, with honest, open communication and no surprises.`,
    ],
    how: (c.full&&c.full.how) || `We assembled a small, multi-disciplinary team of associates with direct ${c.region} experience, and worked at a manageable size to keep value for money high and decisions close to the people affected.`,
    outputs: (c.full&&c.full.outputs) || [
      `A clear, usable ${STAGE[c.stage].verb.toLowerCase()} product the ${place} team owns`,
      `Evidence and analysis grounded in local knowledge`,
      `Practical recommendations sequenced for what comes next`,
    ],
    outcomes: (c.full&&c.full.outcomes) || [
      {n:"Locally owned", l:"Solutions the in-country team can carry forward without us"},
      {n:"Inclusive", l:"Designed so benefits reach the whole community"},
      {n:"Next phase ready", l:`Positioned to ${c.services[1]?STAGE[c.services[1]].verb.toLowerCase():"move forward"} with confidence`},
    ],
  };
}

function CaseStudy({id, onContact}){
  const c = caseById(id);
  if(!c) return (
    <main className="wrap" style={{padding:"120px 40px",minHeight:"60vh"}}>
      <p className="eyebrow">Not found</p><h1 className="fp-h1">That case study isn't in the atlas.</h1>
      <Btn kind="secondary" arrow to="/atlas">Back to the atlas</Btn>
    </main>
  );
  const n = draftNarrative(c);
  const people = c.people.map(personById).filter(Boolean);
  const related = CASES.filter(x=>x.id!==c.id && (x.stage===c.stage || x.sectors.some(s=>c.sectors.includes(s)))).slice(0,3);
  const stageIdx = CYCLE.findIndex(s=>s.key===c.stage);

  return (
    <main className="cs">
      {/* hero */}
      <section className="cs-hero">
        <Photo fill={c.fill} seed={c.id} wash="wash" className="cs-hero-photo">
          <span className="cs-hero-coord">{c.coord}</span>
        </Photo>
        <div className="wrap cs-hero-in">
          <Link to="/atlas" className="cs-back"><Icon name="arrow" size={16} style={{transform:"rotate(180deg)"}}/> Case study atlas</Link>
          <div className="cs-hero-tags">
            <Atag variant="solid">{STAGE[c.stage].name}</Atag>
            {c.sectors.map(s=><Atag key={s} variant="on-dark" dot={false}>{s}</Atag>)}
          </div>
          <h1 className="cs-h1">{c.title}</h1>
          <div className="cs-hero-meta">
            <span><Icon name="pin" size={16}/> {c.country.name}</span>
            <span><Icon name="users" size={16}/> {c.client}</span>
            <span><Icon name="clock" size={16}/> {c.year}</span>
          </div>
        </div>
      </section>

      {/* summary + cycle position */}
      <section className="wrap cs-body">
        <div className="cs-main">
          <p className="cs-summary">{c.summary}</p>

          <div className="cs-block">
            <h2 className="cs-h2">The challenge</h2>
            <p>{n.challenge}</p>
          </div>
          <div className="cs-block">
            <h2 className="cs-h2">What we did</h2>
            <ul className="cs-list">{n.did.map((d,i)=><li key={i}><Icon name="check" size={18}/><span>{d}</span></li>)}</ul>
          </div>
          <div className="cs-block">
            <h2 className="cs-h2">How we worked</h2>
            <p>{n.how}</p>
          </div>
          <div className="cs-block">
            <h2 className="cs-h2">Outputs</h2>
            <div className="cs-outputs">{n.outputs.map((o,i)=>(
              <div className="cs-output" key={i}><span className="cs-output-n">{String(i+1).padStart(2,"0")}</span><span>{o}</span></div>
            ))}</div>
          </div>
          <div className="cs-block">
            <h2 className="cs-h2">Outcomes</h2>
            <div className="cs-outcomes">{n.outcomes.map((o,i)=>(
              <div className="cs-outcome" key={i}><span className="cs-outcome-n">{o.n}</span><span className="cs-outcome-l">{o.l}</span></div>
            ))}</div>
          </div>
        </div>

        {/* sidebar */}
        <aside className="cs-side">
          <div className="cs-panel cs-panel-dl">
            <span className="cs-dl-h"><Icon name="file" size={16}/> Full case study</span>
            <p className="cs-dl-desc">The complete write-up — challenge, approach, results and lessons learned.</p>
            <a href="#/" className="btn btn-white btn-sm cs-dl-btn" onClick={(e)=>e.preventDefault()}><Icon name="download" size={16}/> Download PDF</a>
            <span className="cs-dl-meta">PDF · {c.country.name} · {c.year}</span>
          </div>

          <div className="cs-panel">
            <span className="cs-panel-h">At a glance</span>
            <dl className="cs-facts">
              <div><dt>Client</dt><dd>{c.client}</dd></div>
              <div><dt>Client type</dt><dd>{c.clientType}</dd></div>
              <div><dt>Country</dt><dd>{c.country.name}</dd></div>
              <div><dt>Region</dt><dd>{c.region}</dd></div>
              <div><dt>Sector</dt><dd>{c.sectors.join(", ")}</dd></div>
              <div><dt>Year</dt><dd>{c.year}</dd></div>
              <div><dt>Coordinates</dt><dd className="cs-fact-mono">{c.coord}</dd></div>
            </dl>
          </div>

          <div className="cs-panel">
            <span className="cs-panel-h">Where this sits in the cycle</span>
            <div className="cs-cyclemap">
              {CYCLE.map((s,i)=>(
                <div className={"cs-cyclemap-step"+(s.key===c.stage?" here":"")+(c.services.includes(s.key)?" touched":"")} key={s.key}>
                  <span className="cs-cyclemap-dot"></span>
                  <span className="cs-cyclemap-name">{s.name}</span>
                  {s.key===c.stage && <span className="cs-cyclemap-tag">This project</span>}
                </div>
              ))}
            </div>
          </div>

          {people.length>0 && (
            <div className="cs-panel">
              <span className="cs-panel-h">Who worked on this</span>
              <div className="cs-people">
                {people.map(p=>(
                  <Link to={"/people/"+p.id} className="cs-person" key={p.id}>
                    <Photo fill={p.fill} img={p.photo} wash="wash-soft" className={"cs-person-av"+(p.photo?" has-portrait":"")}>{!p.photo && <span className="cs-person-ini">{p.initials}</span>}</Photo>
                    <span className="cs-person-info"><span className="cs-person-name">{p.name}</span><span className="cs-person-role">{p.role}</span></span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="cs-panel cs-panel-cta">
            <span className="cs-panel-h">Related services</span>
            <div className="cs-services">
              {c.services.map(sk=>(
                <Link to="/#services" className="cs-service" key={sk}><span className="cs-service-n">{STAGE[sk].n}</span>{STAGE[sk].verb}<Icon name="chevron" size={15}/></Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* related */}
      {related.length>0 && (
        <section className="cs-related section">
          <div className="wrap">
            <div className="sec-head">
              <div><p className="eyebrow">Nearby in the atlas</p><h2 className="fp-h2">Related case studies</h2></div>
              <Btn kind="ghost" arrow to="/atlas">Open the atlas</Btn>
            </div>
            <div className="atlas-grid">
              {related.map(r=>(
                <Link to={"/case/"+r.id} className="card card-link atlas-card" key={r.id}>
                  <Photo fill={r.fill} seed={r.id} wash="wash-soft" className="atlas-card-photo">
                    <Atag variant="on-dark" className="atlas-card-stage">{STAGE[r.stage].name}</Atag>
                    <span className="atlas-card-coord">{r.coord}</span>
                  </Photo>
                  <div className="atlas-card-body">
                    <div className="atlas-card-tags"><Atag dot={false}>{r.sectors[0]}</Atag><span className="atlas-card-cc">{r.country.name}</span></div>
                    <h3 className="atlas-card-title">{r.title}</h3>
                    <p className="atlas-card-client">{r.client}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTAFooter onContact={()=>onContact({heading:"Interested in work like this?", sub:`Tell us about your programme and we'll suggest a sensible first step — ${c.client} worked with us on this, and we'd be glad to talk about yours.`, detail:`I'm interested in work similar to "${c.title}" (${c.client}, ${c.country.name}, ${c.year}).`, stageVerb:STAGE[c.stage].verb, source:`Case study: ${c.title}`})}/>
    </main>
  );
}
Object.assign(window, { CaseStudy });
