/* trust.jsx — public "Trust & security" page. Defines global TrustView({onContact}).
   A calm, credible page answering what government / UN / funder clients ask before
   they sign. Framed as how Future Partners is built and its security posture — plain
   and reassuring, not over-claiming. New styles live in marketing.css (tru-). */

const TRUST_SECTIONS = [
  {key:"data", icon:"globe", title:"Where your data lives",
   lead:"Hosted in reputable, well-run infrastructure — with data residency appropriate for Aotearoa New Zealand.",
   points:[
     "Engagement records and documents are held in established, reputable cloud infrastructure, not on ad-hoc personal devices.",
     "Hosting and storage are chosen with New Zealand-appropriate data residency in mind, so sensitive material stays where it should.",
     "Regular, monitored backups mean nothing important rests on a single point of failure.",
   ]},
  {key:"access", icon:"users", title:"Who can access it",
   lead:"Role-based access, granted on a least-privilege basis — people see only what their role needs.",
   points:[
     "Clients see only their own engagement — their documents, their milestones, nothing else.",
     "Associates reach the shared library and the resources relevant to their work, not client back-office.",
     "The Future Partners team holds the back-office; the most sensitive material is staff-only by default.",
   ]},
  {key:"protect", icon:"lock", title:"How it's protected",
   lead:"Encryption in transit and at rest, secure sign-in, and secrets kept well out of the open.",
   points:[
     "Data is encrypted in transit and at rest, so it can't be read in passing between you and us.",
     "Sign-in is secure, and we support strong authentication for the people who manage the work.",
     "Credentials and secrets are kept out of code and out of email — never shared in the clear.",
   ]},
  {key:"safeguard", icon:"shield", title:"Safeguarding & ethics",
   lead:"Child safeguarding, a code of conduct and conflict-of-interest declarations across the whole network.",
   points:[
     "Child safeguarding is taken seriously across every assignment — this sector demands nothing less.",
     "A shared code of conduct sets the standard of behaviour we hold ourselves and our associates to.",
     "Conflict-of-interest declarations are made across the network, so independence is visible, not assumed.",
   ]},
  {key:"privacy", icon:"file", title:"Privacy",
   lead:"Aligned with the New Zealand Privacy Act — consent at collection, data minimisation, and your data stays yours.",
   points:[
     "Our handling of personal information is aligned with the New Zealand Privacy Act.",
     "Consent is sought at the point of collection, and we collect only what the work genuinely needs.",
     "Your data stays yours — we hold it to do the work, and we don't repurpose it behind your back.",
   ]},
  {key:"account", icon:"check", title:"Accountability",
   lead:"A clear audit trail, version history, and unambiguous ownership of every document.",
   points:[
     "Key actions are recorded, so there's an audit trail of who did what and when.",
     "Documents carry version history — you can see how a deliverable evolved, not just its final state.",
     "Every document has a clear owner, so nothing falls into an accountability gap.",
   ]},
];

function TrustView({onContact}){
  useReveal();
  return (
    <main className="trust">
      {/* ---------- hero ---------- */}
      <section className="page-hero tru-hero">
        <div className="wrap page-hero-in">
          <div className="page-hero-text">
            <p className="eyebrow">Trust &amp; security</p>
            <h1 className="page-h1">How we handle data, access and trust.</h1>
            <p className="fp-lead page-lead">Governments, UN agencies and funders ask the hard questions before they sign — about data, access, privacy and conduct. Here is how Future Partners is built to answer them: plainly, and without over-claiming.</p>
            <div className="tru-hero-actions">
              <Btn kind="primary" size="lg" arrow onClick={onContact}>Talk to us about your requirements</Btn>
            </div>
          </div>
          <div className="page-hero-aside">
            <div className="tru-hero-badge">
              <span className="tru-hero-badge-ic"><Icon name="shield" size={26}/></span>
              <span className="tru-hero-badge-t">A security posture you can put in a procurement form.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the sections ---------- */}
      <section className="tru-sections section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <p className="eyebrow">The essentials</p>
              <h2 className="fp-h2">What we look after</h2>
              <p className="tru-intro fp-lead">Six things every serious client checks — answered the way we'd answer them in a tender response.</p>
            </div>
          </div>
          <div className="tru-grid">
            {TRUST_SECTIONS.map((s,i)=>(
              <article className="tru-card reveal" key={s.key} style={{transitionDelay:(i*50)+"ms"}}>
                <span className="tru-card-ic"><Icon name={s.icon} size={22}/></span>
                <h3 className="tru-card-h">{s.title}</h3>
                <p className="tru-card-lead">{s.lead}</p>
                <ul className="tru-card-list">
                  {s.points.map((p,j)=>(
                    <li key={j}><Icon name="check" size={17}/><span>{p}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- standards & affiliations ---------- */}
      <section className="tru-standards">
        <Koru className="tru-standards-koru" stroke="var(--green-500)" op={0.45}/>
        <div className="wrap tru-standards-in">
          <div className="tru-standards-head">
            <p className="eyebrow on-dark">Standards &amp; affiliations</p>
            <h2 className="tru-standards-h">The standards we work to.</h2>
            <p className="tru-standards-sub">Future Partners is affiliated with the New Zealand Council for International Development — and holds itself to the conduct, safeguarding and accountability expectations that come with it.</p>
          </div>
          <div className="tru-standards-list">
            {[
              {icon:"globe", t:"NZ Council for International Development", d:"Affiliated member of the sector's national body."},
              {icon:"shield", t:"Safeguarding-first", d:"Child safeguarding and a code of conduct across the network."},
              {icon:"file", t:"NZ Privacy Act aligned", d:"Consent at collection, data minimisation, your data stays yours."},
              {icon:"clock", t:"Accountable by design", d:"Audit trail, version history and clear document ownership."},
            ].map(item=>(
              <div className="tru-standard" key={item.t}>
                <span className="tru-standard-ic"><Icon name={item.icon} size={20}/></span>
                <div className="tru-standard-body">
                  <span className="tru-standard-t">{item.t}</span>
                  <span className="tru-standard-d">{item.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- reassuring close + CTA ---------- */}
      <section className="tru-close section">
        <div className="wrap tru-close-in reveal">
          <span className="tru-close-ic"><Icon name="shield" size={30}/></span>
          <p className="eyebrow">No surprises</p>
          <h2 className="fp-h2">Tell us what you need.</h2>
          <p className="fp-lead">Every client comes with their own security, privacy and reporting obligations. Tell us yours, and we'll show you exactly how we'll meet them — one point of contact, honest answers, no surprises.</p>
          <div className="tru-close-actions">
            <Btn kind="primary" size="lg" arrow onClick={onContact}>Talk to us about your requirements</Btn>
          </div>
        </div>
      </section>

      <CTAFooter onContact={onContact}/>
    </main>
  );
}
Object.assign(window, { TrustView });
