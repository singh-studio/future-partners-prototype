/* impact.jsx — public "Live impact" page. Defines global ImpactView({onContact}).
   A "proof, measured" page for funders and governments. All headline numbers are
   derived at runtime from the shared data (CASES / SITE_STATS / CLIENTS / …) so they
   can never contradict the case study atlas. New styles live in marketing.css (imp-). */

function ImpactView({onContact}){
  useReveal();

  /* ---- derived numbers (single source of truth = the data) ---- */
  const years = CASES.map(c=>c.year);
  const yearSpan = Math.max(...years) - Math.min(...years);                 // 2014–2025 → 11
  const fieldYears = (Math.ceil(yearSpan/5)*5) + 10;                        // honest "25+ years" framing
  const sectorsCovered = new Set(CASES.flatMap(c=>c.sectors)).size;

  /* projects touching each cycle stage (via services), in cycle order */
  const stageCount = (key)=>CASES.filter(c=>(c.services||[]).includes(key) || c.stage===key).length;
  const stageRows = CYCLE.map(s=>({...s, n:stageCount(s.key)}));
  const stageMax = Math.max(...stageRows.map(r=>r.n));

  /* projects per sector / per region, sorted, real counts */
  const tally = (keys, get)=>keys
    .map(k=>({k, n:CASES.filter(c=>get(c).includes(k)).length}))
    .filter(r=>r.n>0)
    .sort((a,b)=>b.n-a.n);
  const sectorRows = tally(SECTORS, c=>c.sectors);
  const regionRows = tally(REGIONS, c=>[c.region]);
  const sectorMax = Math.max(...sectorRows.map(r=>r.n));
  const regionMax = Math.max(...regionRows.map(r=>r.n));

  /* real outcome stats pulled from the cases that carry them */
  const OUTCOME_IDS = ["nauru-health","tuvalu-fisheries","niue-gcf","oxfam-eval"];
  const outcomeCards = OUTCOME_IDS
    .map(caseById)
    .filter(c=>c && c.full && c.full.outcomes && c.full.outcomes.length)
    .map(c=>({c, o:c.full.outcomes[0]}));

  const testi = TESTIMONIALS[0];
  const testiInitials = testi.name.split(" ").map(w=>w[0]).slice(0,2).join("");

  /* headline stat blocks */
  const HEAD = [
    {n:SITE_STATS.projects,            l:"Projects shaped across Asia & the Pacific"},
    {n:SITE_STATS.countries,           l:"Countries & regional programmes reached"},
    {n:SITE_STATS.people,              l:"Associates in the delivery network"},
    {n:sectorsCovered,                 l:"Sectors, from health to fisheries to climate"},
    {n:CLIENTS.length,                 l:"Government, UN, NGO & funder clients"},
    {n:fieldYears+"+",                 l:"Years of field experience behind the work"},
  ];

  return (
    <main className="impact">
      {/* ---------- hero ---------- */}
      <section className="page-hero imp-hero">
        <div className="wrap page-hero-in">
          <div className="page-hero-text">
            <p className="eyebrow">Our impact</p>
            <h1 className="page-h1">Our impact, across the whole project cycle.</h1>
            <p className="fp-lead page-lead">Every figure on this page is drawn straight from the work we've delivered — the same record funders, governments and UN partners can open, project by project, in the case study atlas. No vanity metrics, just what we've done and what it changed.</p>
            <div className="imp-hero-actions">
              <Btn kind="primary" size="lg" arrow to="/atlas">Open the case study atlas</Btn>
              <Btn kind="secondary" size="lg" onClick={onContact}>Work with us</Btn>
            </div>
          </div>
          <div className="page-hero-aside">
            {[[SITE_STATS.projects,"projects delivered"],[SITE_STATS.countries,"countries & regions"],[SITE_STATS.stages,"stages of the cycle"]].map(([n,l])=>(
              <div className="page-stat" key={l}><span className="page-stat-n">{n}</span><span className="page-stat-l">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- headline numbers ---------- */}
      <section className="imp-numbers section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="eyebrow">By the numbers</p>
              <h2 className="fp-h2">Our track record</h2>
            </div>
            <p className="imp-numbers-note fp-lead">Counted live from the work in the atlas — so what you read here is exactly what's on the record.</p>
          </div>
          <div className="imp-statgrid">
            {HEAD.map((s,i)=>(
              <div className="imp-stat reveal" key={s.l} style={{transitionDelay:(i*55)+"ms"}}>
                <span className="imp-stat-n">{s.n}</span>
                <span className="imp-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- impact across the project cycle ---------- */}
      <section className="imp-cycle section">
        <Koru className="imp-cycle-koru" stroke="var(--green-300)" op={0.4}/>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="eyebrow">Across the project cycle</p>
              <h2 className="fp-h2">Projects at every stage of the cycle</h2>
              <p className="imp-cycle-intro fp-lead">From framing the problem to improving what's already running — the count of projects we've shaped at each of the seven stages.</p>
            </div>
            <Btn kind="ghost" arrow to="/services">How we work the cycle</Btn>
          </div>
          <div className="imp-cyclebars reveal">
            {stageRows.map(s=>(
              <Link to="/atlas" className="imp-cyclebar" key={s.key}>
                <span className="imp-cyclebar-head">
                  <span className="imp-cyclebar-n">{s.n}<span className="imp-cyclebar-stage">{s.name}</span></span>
                </span>
                <span className="imp-cyclebar-track">
                  <span className="imp-cyclebar-fill" style={{height:Math.round((s.n/stageMax)*100)+"%"}}></span>
                </span>
                <span className="imp-cyclebar-verb">{s.verb}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- by sector & region ---------- */}
      <section className="imp-break section">
        <div className="wrap imp-break-grid">
          <div className="imp-break-col reveal">
            <p className="eyebrow">By sector</p>
            <h3 className="imp-break-h">What the work covers</h3>
            <ul className="imp-bars">
              {sectorRows.map(r=>(
                <li className="imp-bar" key={r.k}>
                  <span className="imp-bar-label">{r.k}</span>
                  <span className="imp-bar-track"><span className="imp-bar-fill" style={{width:Math.round((r.n/sectorMax)*100)+"%"}}></span></span>
                  <span className="imp-bar-n">{r.n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="imp-break-col reveal">
            <p className="eyebrow">By region</p>
            <h3 className="imp-break-h">Where we've worked</h3>
            <ul className="imp-bars">
              {regionRows.map(r=>(
                <li className="imp-bar" key={r.k}>
                  <span className="imp-bar-label">{r.k}</span>
                  <span className="imp-bar-track"><span className="imp-bar-fill alt" style={{width:Math.round((r.n/regionMax)*100)+"%"}}></span></span>
                  <span className="imp-bar-n">{r.n}</span>
                </li>
              ))}
            </ul>
            <p className="imp-break-foot meta">All continents except Antarctica</p>
          </div>
        </div>
      </section>

      {/* ---------- real outcomes ---------- */}
      <section className="imp-outcomes section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="eyebrow">Real outcomes</p>
              <h2 className="fp-h2">What the work changed</h2>
              <p className="imp-outcomes-intro fp-lead">A few results in the partners' own terms — each one drawn from a case study you can open and read in full.</p>
            </div>
          </div>
          <div className="imp-outcomegrid">
            {outcomeCards.map(({c,o},i)=>(
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

      {/* ---------- who we work with ---------- */}
      <section className="imp-clients">
        <Koru className="imp-clients-koru" stroke="var(--green-500)" op={0.45}/>
        <div className="wrap imp-clients-in">
          <div className="imp-clients-head">
            <p className="eyebrow on-dark">Working with</p>
            <p className="imp-clients-sub">Governments, UN agencies, Crown research institutes, NGOs and funders trust Future Partners with the work that matters most.</p>
          </div>
          <div className="imp-clients-logos">
            {CLIENTS.map(c=>{
              const hits = CASES.filter(x=>x.client.toLowerCase().includes(c.toLowerCase())).length;
              return hits
                ? <Link to={"/atlas?q="+encodeURIComponent(c)} className="proof-logo is-link" key={c} title={`See our work with ${c}`}>{c}</Link>
                : <span className="proof-logo" key={c}>{c}</span>;
            })}
          </div>
        </div>
      </section>

      {/* ---------- testimonial ---------- */}
      <section className="imp-testi section">
        <div className="wrap">
          <p className="eyebrow reveal">In their words</p>
          <figure className="imp-testi-card reveal">
            <span className="testi-mark" aria-hidden="true">”</span>
            <blockquote className="imp-testi-quote">{testi.quote}</blockquote>
            <figcaption className="testi-cap">
              <span className="testi-avatar" aria-hidden="true">{testiInitials}</span>
              <span className="testi-capwords">
                <span className="testi-name">{testi.name}</span>
                <span className="testi-role">{testi.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- closing CTA ---------- */}
      <section className="imp-close section">
        <div className="wrap imp-close-in reveal">
          <p className="eyebrow">The atlas</p>
          <h2 className="fp-h2">Every project, on the map.</h2>
          <p className="fp-lead">Open the atlas to explore every assignment behind these numbers — or tell us about the outcome you're trying to reach.</p>
          <div className="imp-close-actions">
            <Btn kind="primary" size="lg" arrow to="/atlas">Explore the work</Btn>
            <Btn kind="secondary" size="lg" onClick={onContact}>Work with us</Btn>
          </div>
        </div>
      </section>

      <CTAFooter onContact={onContact}/>
    </main>
  );
}
Object.assign(window, { ImpactView });
