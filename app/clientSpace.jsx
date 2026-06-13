/* clientSpace.jsx — Client workspace (per-engagement).
   Defines global ClientSpace({clientId, staffView, signOut, switcher}).
   Demo anchor: caseById("nauru-health") — Nauru Ministry of Health, stage "deliver". */

(function(){

/* ── Demo engagement data ─────────────────────────────── */
const ENGAGEMENT = {
  id: "nauru-health",
  clientOrg: "Nauru Ministry of Health and Medical Services",
  clientOrgShort: "Nauru Ministry of Health",
  title: "Improving Pacific Health Systems — the Nauru Experience",
  ref: "FP-2024-NRU-01",
  stage: "deliver",        // CYCLE key
  stageIndex: 4,           // 0-based index in CYCLE array (deliver = index 4)
  startDate: "February 2024",
  targetDate: "December 2024",
  statusLine: "On track — field phase underway. Next milestone: systems review report, 14 July.",
  region: "Micronesia · Nauru",
  sector: "Health systems strengthening",
  funder: "MFAT · Manatū Aorere",
  contactEmail: "hello@futurepartners.co.nz",
  contactPhone: "+64 21 067 2680",
  pocPerson: "kirsty",  // personById key — Kirsty is always SPOC
};

/* ── Mock deliverables ─────────────────────────────────── */
const DELIVERABLES = [
  {id:"del1", title:"Inception Report", type:"PDF", status:"final",     version:"v1.0", date:"Mar 2024", summary:"Confirms scope, methodology, work plan and team arrangements."},
  {id:"del2", title:"Health Systems Assessment — Draft",  type:"DOCX", status:"review",   version:"v2.1 draft", date:"Jun 2024", summary:"Mapping referral pathways, supply chain and workforce capacity."},
  {id:"del3", title:"Workforce Development Plan",  type:"DOCX", status:"review",   version:"v1.0 draft", date:"Jun 2024", summary:"Training and mentoring schedule for clinical and management staff."},
  {id:"del4", title:"Field Visit Report — May 2024",      type:"PDF",  status:"final",     version:"final",      date:"May 2024", summary:"Summary of in-country activities, observations and immediate actions."},
  {id:"del5", title:"Supply Chain Diagnostic",            type:"XLSX", status:"progress",  version:"in progress", date:"—",        summary:"Medicines and consumables flow analysis — in preparation."},
  {id:"del6", title:"Quarterly Progress Report Q1",      type:"PDF",  status:"final",     version:"final",      date:"Apr 2024", summary:"Progress against work plan, expenditure and risk register."},
  {id:"del7", title:"Mid-term Review Framework",         type:"DOCX", status:"progress",  version:"in progress", date:"—",        summary:"Evaluation approach for the programme mid-term review, July 2024."},
];

/* ── Mock shared files ─────────────────────────────────── */
const SHARED_FROM_FP = [
  {id:"sf1", title:"Future Partners Capability Statement",   type:"PDF",  date:"May 2026",  summary:"Two-page overview of services, sectors and proof points."},
  {id:"sf2", title:"Team CVs — Kirsty Burnett & Dr David Angelson", type:"PDF",  date:"Jan 2024",  summary:"Professional profiles for both lead team members."},
  {id:"sf3", title:"Project Risk Register (live)",           type:"XLSX", date:"Jun 2024",  summary:"Current risk register — updated fortnightly."},
  {id:"sf4", title:"Work Plan — Programme Year 1",           type:"PDF",  date:"Feb 2024",  summary:"Full work plan with activities, milestones and responsibilities."},
];
const CLIENT_UPLOADS = [
  {id:"cu1", title:"Ministry Organogram (updated)",          type:"PDF",  date:"Mar 2024",  summary:"Uploaded by Ministry admin."},
  {id:"cu2", title:"Baseline NCD Data 2023",                 type:"XLSX", date:"Feb 2024",  summary:"National non-communicable disease statistics."},
];

/* ── Mock admin documents ──────────────────────────────── */
const ADMIN_DOCS = [
  {id:"ad1", title:"Contract — FP-2024-NRU-01",              type:"PDF",  date:"Jan 2024",  lifecycle:"current",  summary:"Signed services agreement between Future Partners and the Ministry."},
  {id:"ad2", title:"Terms of Reference",                     type:"PDF",  date:"Jan 2024",  lifecycle:"current",  summary:"Agreed ToR confirming scope, deliverables and governance."},
  {id:"ad3", title:"Invoice #INV-2024-031 — Q1",             type:"PDF",  date:"Apr 2024",  lifecycle:"current",  summary:"First-quarter invoice · NZD 28,400 · Paid."},
  {id:"ad4", title:"Invoice #INV-2024-056 — Q2",             type:"PDF",  date:"Jul 2024",  lifecycle:"current",  summary:"Second-quarter invoice · NZD 31,600 · Pending."},
  {id:"ad5", title:"Programme Progress Report — Q1",         type:"PDF",  date:"Apr 2024",  lifecycle:"current",  summary:"Formal progress report submitted to MFAT."},
  {id:"ad6", title:"Safeguarding Declaration — Team",        type:"PDF",  date:"Jan 2024",  lifecycle:"current",  summary:"Signed safeguarding declarations for all personnel."},
];

/* ── Mock reference docs ───────────────────────────────── */
const REF_DOCS = [
  {id:"ref1", title:"Future Partners Capability Statement",  type:"PDF",  date:"May 2026",  summary:"Services, sectors and proof for the Pacific and Asia."},
  {id:"ref2", title:"Child Safeguarding Policy",             type:"PDF",  date:"May 2026",  summary:"How Future Partners protects children across all programmes."},
  {id:"ref3", title:"Privacy Policy",                        type:"PDF",  date:"Jan 2026",  summary:"How personal information is collected, used and protected."},
];
const REF_CASES = ["nauru-health", "cook-health", "fred-hollows"];

/* ── Status helpers ────────────────────────────────────── */
const STATUS_META = {
  final:    { label:"Final",          cls:"cli-status-final"    },
  review:   { label:"For your review", cls:"cli-status-review"  },
  progress: { label:"In progress",    cls:"cli-status-progress" },
};

/* ================================================================
   ClientSpace component
   ================================================================ */
function ClientSpace({ clientId, staffView, signOut, switcher }) {
  const [nav, setNav] = useState("overview");
  const [openDoc, setOpenDoc] = useState(null);  // deliverable id currently open in reader
  const [dragOver, setDragOver] = useState(false);

  const eng    = ENGAGEMENT;
  const cs     = caseById(eng.id);
  const people = (cs?.people || []).map(id => personById(id)).filter(Boolean);
  const poc    = personById(eng.pocPerson);

  // ── Sidebar nav definition ──
  const NAV_ITEMS = [
    { id:"overview",    icon:"compass",  label:"Overview" },
    { id:"deliverables",icon:"file",     label:"Deliverables & drafts",  count: DELIVERABLES.length },
    { id:"files",       icon:"folder",   label:"Shared files",           count: SHARED_FROM_FP.length + CLIENT_UPLOADS.length },
    { id:"admin",       icon:"shield",   label:"Documents & admin",      count: ADMIN_DOCS.length },
    { id:"reference",   icon:"book",     label:"Reference" },
  ];

  // ── Derived data for the open document reader ──
  const openDeliv = openDoc ? DELIVERABLES.find(d => d.id === openDoc) : null;

  return (
    <div className="mem">
      {/* ── Sidebar ── */}
      <aside className="mem-side">
        <a href="#/" className="mem-logo" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <img src="assets/logo.png" alt="Future Partners"/>
        </a>
        <span className="mem-side-label">Client workspace</span>

        {switcher && <SpaceSwitcher {...switcher}/>}

        {staffView && (
          <div className="cli-staff-chip">
            <Icon name="shield" size={13}/> Previewing as staff
          </div>
        )}

        <nav className="mem-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={"mem-navitem" + (nav === item.id ? " on" : "")}
              onClick={() => { setNav(item.id); setOpenDoc(null); }}
            >
              <Icon name={item.icon} size={18}/> {item.label}
              {item.count != null && (
                <span className="mem-navcount">{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mem-side-foot">
          <div className="mem-user">
            <span className="mem-user-av">MH</span>
            <div className="mem-user-id">
              <span className="mem-user-name">Ministry of Health</span>
              <span className="mem-user-role">Role · Client</span>
            </div>
          </div>
          <button className="mem-signout" onClick={signOut}>
            <Icon name="lock" size={15}/> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="mem-main">
        <header className="mem-top">
          <div className="cli-eng-tag">
            <span className="cli-eng-ref">{eng.ref}</span>
            <span className="cli-eng-sep">·</span>
            <span className="cli-eng-region">{eng.region}</span>
          </div>
          <div className="mem-top-actions">
            <span className="mem-draftpill">DRAFT · concept</span>
            <a
              href="#/"
              onClick={(e) => { e.preventDefault(); navigate("/"); }}
              className="mem-backsite"
            >
              <Icon name="external" size={16}/> Public site
            </a>
          </div>
        </header>

        <div className="mem-content">
          {/* MEM-07: ConceptIntro — renders until user dismisses; manages its own state */}
          {typeof window.ConceptIntro === "function" && <ConceptIntro space="client"/>}
          {nav === "overview"      && <OverviewSection     eng={eng} cs={cs} people={people} poc={poc}/>}
          {nav === "deliverables"  && !openDoc && <DeliverablesSection onOpen={setOpenDoc}/>}
          {nav === "deliverables"  && openDoc  && <DelivDocReader doc={openDeliv} onBack={() => setOpenDoc(null)}/>}
          {nav === "files"         && <FilesSection dragOver={dragOver} setDragOver={setDragOver}/>}
          {nav === "admin"         && <AdminSection/>}
          {nav === "reference"     && <ReferenceSection refCases={REF_CASES}/>}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: Overview
   ================================================================ */
function OverviewSection({ eng, cs, people, poc }) {
  const stageIndex = CYCLE.findIndex(s => s.key === eng.stage);

  return (
    <div className="cli-overview">
      {/* Engagement header */}
      <div className="cli-eng-header">
        <div className="cli-eng-header-text">
          <p className="eyebrow">{eng.clientOrgShort}</p>
          <h1 className="cli-eng-title">{eng.title}</h1>
          <p className="cli-status-line">
            <span className="cli-status-dot"/>
            {eng.statusLine}
          </p>
        </div>
        <div className="cli-eng-facts">
          <div className="cli-fact">
            <span className="cli-fact-l">Sector</span>
            <span className="cli-fact-v">{eng.sector}</span>
          </div>
          <div className="cli-fact">
            <span className="cli-fact-l">Funder</span>
            <span className="cli-fact-v">{eng.funder}</span>
          </div>
          <div className="cli-fact">
            <span className="cli-fact-l">Start</span>
            <span className="cli-fact-v">{eng.startDate}</span>
          </div>
          <div className="cli-fact">
            <span className="cli-fact-l">Target end</span>
            <span className="cli-fact-v">{eng.targetDate}</span>
          </div>
        </div>
      </div>

      {/* Project cycle strip */}
      <span className="mem-sec-h">Project cycle</span>
      <div className="cli-cycle">
        {CYCLE.map((s, i) => {
          const isActive  = i === stageIndex;
          const isPast    = i < stageIndex;
          return (
            <div
              key={s.key}
              className={"cli-cycle-step" + (isActive ? " active" : "") + (isPast ? " past" : "")}
            >
              <div className="cli-cycle-node">
                {isPast
                  ? <Icon name="check" size={13}/>
                  : <span className="cli-cycle-n">{s.n}</span>
                }
              </div>
              <span className="cli-cycle-name">{s.name}</span>
              {i < CYCLE.length - 1 && <div className={"cli-cycle-line" + (isPast ? " past" : "")}/>}
            </div>
          );
        })}
      </div>
      {stageIndex >= 0 && (
        <p className="cli-cycle-blurb">{CYCLE[stageIndex].blurb}</p>
      )}

      {/* Timeline */}
      <span className="mem-sec-h">Timeline</span>
      <div className="cli-timeline-track">
        <div className="cli-tl-bar">
          <div className="cli-tl-fill" style={{width:"42%"}}/>
        </div>
        <div className="cli-tl-labels">
          <span>{eng.startDate}</span>
          <span className="cli-tl-now">Now · Jun 2024</span>
          <span>{eng.targetDate}</span>
        </div>
        <div className="cli-tl-milestones">
          <div className="cli-tl-ms" style={{left:"14%"}}>
            <div className="cli-tl-ms-dot past"/>
            <span className="cli-tl-ms-label">Inception complete</span>
          </div>
          <div className="cli-tl-ms" style={{left:"42%"}}>
            <div className="cli-tl-ms-dot active"/>
            <span className="cli-tl-ms-label">Systems review</span>
          </div>
          <div className="cli-tl-ms" style={{left:"70%"}}>
            <div className="cli-tl-ms-dot"/>
            <span className="cli-tl-ms-label">Mid-term review</span>
          </div>
          <div className="cli-tl-ms" style={{left:"100%"}}>
            <div className="cli-tl-ms-dot"/>
            <span className="cli-tl-ms-label">Final report</span>
          </div>
        </div>
      </div>

      {/* Your team */}
      <span className="mem-sec-h">Your team</span>
      <div className="cli-team">
        {people.map(p => {
          const isPoc = p.id === eng.pocPerson;
          return (
            <div key={p.id} className={"cli-team-card" + (isPoc ? " poc" : "")}>
              {p.photo
                ? <img src={p.photo} alt={p.name} className="cli-team-photo"/>
                : <span className="cli-team-av">{p.initials}</span>
              }
              <div className="cli-team-info">
                <span className="cli-team-name">{p.name}</span>
                <span className="cli-team-role">{p.role}</span>
                {isPoc && (
                  <span className="cli-poc-badge">
                    <Icon name="pin" size={11}/> Your single point of contact
                  </span>
                )}
              </div>
              {isPoc && (
                <div className="cli-poc-actions">
                  <a href={"mailto:" + eng.contactEmail} className="cli-poc-btn cli-poc-mail">
                    <Icon name="mail" size={15}/> Email Kirsty
                  </a>
                  <a href={"tel:" + eng.contactPhone.replace(/\s/g,"")} className="cli-poc-btn cli-poc-phone">
                    <Icon name="phone" size={15}/> Call
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SPOC promise panel */}
      <div className="cli-poc-promise">
        <div className="cli-poc-promise-icon">
          <Icon name="heart" size={20}/>
        </div>
        <div>
          <span className="cli-poc-promise-h">One point of contact, always</span>
          <p className="cli-poc-promise-p">Kirsty Burnett is your single point of contact for the life of this engagement. She oversees every assignment and is available to you directly — honest, regular communication and no surprises.</p>
          <div className="cli-poc-promise-links">
            <a href={"mailto:" + eng.contactEmail}><Icon name="mail" size={14}/> {eng.contactEmail}</a>
            <a href={"tel:" + eng.contactPhone.replace(/\s/g,"")}><Icon name="phone" size={14}/> {eng.contactPhone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: Deliverables & drafts
   ================================================================ */
function DeliverablesSection({ onOpen }) {
  const finals   = DELIVERABLES.filter(d => d.status === "final");
  const reviews  = DELIVERABLES.filter(d => d.status === "review");
  const progress = DELIVERABLES.filter(d => d.status === "progress");

  // MEM-02: per-deliverable interaction state
  // acts[id] = { approved, approvedAt, comment, commenting, draft }
  const [acts, setActs] = useState({});

  function getAct(id) {
    return acts[id] || { approved: false, approvedAt: null, comment: "", commenting: false, draft: "" };
  }

  function handleApprove(e, id) {
    e.stopPropagation();
    const when = new Date().toLocaleDateString("en-NZ", { day: "numeric", month: "short" });
    setActs(prev => ({ ...prev, [id]: { ...getAct(id), approved: true, approvedAt: when, commenting: false } }));
  }

  function handleToggleComment(e, id) {
    e.stopPropagation();
    const act = getAct(id);
    setActs(prev => ({ ...prev, [id]: { ...act, commenting: !act.commenting, draft: act.comment || act.draft } }));
  }

  function handleDraftChange(id, val) {
    setActs(prev => ({ ...prev, [id]: { ...getAct(id), draft: val } }));
  }

  function handleCommentSubmit(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const act = getAct(id);
    setActs(prev => ({ ...prev, [id]: { ...act, comment: act.draft, commenting: false } }));
  }

  function handleCommentClear(e, id) {
    e.stopPropagation();
    setActs(prev => ({ ...prev, [id]: { ...getAct(id), comment: "", draft: "", commenting: false } }));
  }

  const Group = ({ title, items }) => {
    if (!items.length) return null;
    return (
      <React.Fragment>
        <span className="mem-sec-h">{title}</span>
        <div className="mdoc-list">
          {items.map(d => {
            const act = getAct(d.id);
            const isReview = d.status === "review";
            return (
              <div className="cli-deliv-wrap" key={d.id}>
                <button
                  className="mdoc-row cli-deliv-row"
                  onClick={() => !isReview && onOpen(d.id)}
                  style={isReview ? { cursor: "default" } : {}}
                >
                  <DocIcon type={d.type}/>
                  <span className="mdoc-main">
                    <span className="mdoc-title">{d.title}</span>
                    <span className="mdoc-summary">{d.summary}</span>
                  </span>
                  <span className={"cli-status-pill " + STATUS_META[d.status].cls}>
                    {STATUS_META[d.status].label}
                  </span>
                  <span className="mdoc-meta-cell">{d.version}</span>
                  <span className="mdoc-meta-cell">{d.date}</span>
                  {isReview && (
                    act.approved ? (
                      <span className="cli-approved-pill">
                        <Icon name="check" size={12}/> Approved · {act.approvedAt}
                      </span>
                    ) : (
                      <span className="cli-review-actions" onClick={e => e.stopPropagation()}>
                        <button className="cli-review-btn cli-approve" onClick={e => handleApprove(e, d.id)}>
                          <Icon name="check" size={13}/> Approve
                        </button>
                        <button
                          className={"cli-review-btn cli-comment" + (act.commenting ? " active" : "")}
                          onClick={e => handleToggleComment(e, d.id)}
                        >
                          <Icon name="mail" size={13}/> Comment
                        </button>
                      </span>
                    )
                  )}
                  {!isReview && <Icon name="chevron" size={16}/>}
                </button>
                {isReview && act.commenting && (
                  <form
                    className="cli-comment-box"
                    onSubmit={e => handleCommentSubmit(e, d.id)}
                    onClick={e => e.stopPropagation()}
                  >
                    <textarea
                      className="cli-comment-input"
                      rows={3}
                      placeholder="Add a note or question for the Future Partners team…"
                      value={act.draft}
                      onChange={e => handleDraftChange(d.id, e.target.value)}
                    />
                    <div className="cli-comment-actions">
                      <button type="submit" className="cli-review-btn cli-approve" disabled={!act.draft.trim()}>
                        Send note
                      </button>
                      <button type="button" className="cli-review-btn cli-comment" onClick={e => handleToggleComment(e, d.id)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                {isReview && !act.commenting && act.comment && (
                  <div className="cli-comment-stored" onClick={e => e.stopPropagation()}>
                    <span className="cli-comment-label">Your note:</span>
                    <span className="cli-comment-text">{act.comment}</span>
                    <button className="cli-comment-edit" onClick={e => handleToggleComment(e, d.id)}>Edit</button>
                    <button className="cli-comment-clear" onClick={e => handleCommentClear(e, d.id)}>Clear</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="cli-deliverables">
      <div className="cli-sec-header">
        <div>
          <h2 className="cli-sec-h1">Deliverables &amp; drafts</h2>
          <p className="cli-sec-lead">Documents prepared for this engagement. Items marked "For your review" are awaiting your feedback before being finalised.</p>
        </div>
      </div>
      <Group title={"For your review — " + reviews.length + " item" + (reviews.length !== 1 ? "s" : "")} items={reviews}/>
      <Group title={"Final — " + finals.length + " item" + (finals.length !== 1 ? "s" : "")} items={finals}/>
      <Group title={"In progress — " + progress.length + " item" + (progress.length !== 1 ? "s" : "")} items={progress}/>
    </div>
  );
}

/* ── Inline document reader for deliverables ── */
function DelivDocReader({ doc, onBack }) {
  if (!doc) return null;
  const sm = STATUS_META[doc.status];
  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}>
        <Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/>
        Deliverables &amp; drafts
      </button>
      <div className="mdoc-detail">
        <div className="mdoc-reader">
          <div className="mdoc-doc-head">
            <DocIcon type={doc.type}/>
            <span className={"cli-status-pill " + sm.cls}>{sm.label}</span>
          </div>
          <h1 className="mdoc-h1">{doc.title}</h1>
          <p className="mdoc-lead">{doc.summary}</p>
          <div className="mdoc-actions">
            <Btn kind="primary" size="sm"><Icon name="download" size={16}/> Download {doc.type}</Btn>
            {doc.status === "review" && (
              <React.Fragment>
                <Btn kind="secondary" size="sm"><Icon name="check" size={15}/> Approve this draft</Btn>
                <Btn kind="secondary" size="sm"><Icon name="mail" size={15}/> Comment</Btn>
              </React.Fragment>
            )}
          </div>
          <div className="mdoc-preview">
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
              <div className="mdoc-ph-gap"></div>
              <div className="mdoc-ph-line w40 head"></div>
              <div className="mdoc-ph-line w88"></div>
              <div className="mdoc-ph-line w75"></div>
              <div className="mdoc-ph-line w93"></div>
            </div>
            <span className="mdoc-ph-cap">Preview — download for full document</span>
          </div>
        </div>
        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">Document details</span>
            <dl className="mem-facts">
              <div><dt>Type</dt><dd>{doc.type}</dd></div>
              <div><dt>Status</dt><dd>{sm.label}</dd></div>
              <div><dt>Version</dt><dd>{doc.version}</dd></div>
              <div><dt>Date</dt><dd>{doc.date}</dd></div>
            </dl>
          </div>
          {doc.status === "review" && (
            <div className="mem-panel cli-review-panel">
              <span className="mem-panel-h">Your action needed</span>
              <p className="cli-review-note">This draft is ready for your review. Please approve or send comments to Kirsty — we aim to turn feedback around within 5 business days.</p>
              <div className="cli-review-btns">
                <Btn kind="primary" size="sm"><Icon name="check" size={14}/> Approve</Btn>
                <Btn kind="secondary" size="sm">
                  <a href="mailto:hello@futurepartners.co.nz?subject=Comments: {doc.title}" className="cli-email-link">Comment by email</a>
                </Btn>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: Shared files
   ================================================================ */
function FilesSection({ dragOver, setDragOver }) {
  return (
    <div className="cli-files">
      <div className="cli-sec-header">
        <div>
          <h2 className="cli-sec-h1">Shared files</h2>
          <p className="cli-sec-lead">Files from Future Partners, plus a space to share documents with us. Large files can also be emailed to your project address.</p>
        </div>
      </div>

      {/* Files from FP → Client */}
      <span className="mem-sec-h">From Future Partners</span>
      <div className="mdoc-list">
        {SHARED_FROM_FP.map(f => (
          <div className="mdoc-row cli-file-row" key={f.id}>
            <DocIcon type={f.type}/>
            <span className="mdoc-main">
              <span className="mdoc-title">{f.title}</span>
              <span className="mdoc-summary">{f.summary}</span>
            </span>
            <span className="mdoc-meta-cell">{f.date}</span>
            <span className="cli-file-dl">
              <Icon name="download" size={15}/>
            </span>
          </div>
        ))}
      </div>

      {/* Client uploads */}
      <span className="mem-sec-h">Shared by your organisation</span>
      <div className="mdoc-list">
        {CLIENT_UPLOADS.map(f => (
          <div className="mdoc-row cli-file-row" key={f.id}>
            <DocIcon type={f.type}/>
            <span className="mdoc-main">
              <span className="mdoc-title">{f.title}</span>
              <span className="mdoc-summary">{f.summary}</span>
            </span>
            <span className="mdoc-meta-cell">{f.date}</span>
            <span className="cli-file-dl">
              <Icon name="download" size={15}/>
            </span>
          </div>
        ))}
      </div>

      {/* Upload dropzone */}
      <span className="mem-sec-h">Share a file with us</span>
      <div
        className={"cli-dropzone" + (dragOver ? " over" : "")}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <div className="cli-dropzone-icon">
          <Icon name="folder" size={28}/>
        </div>
        <div className="cli-dropzone-text">
          <span className="cli-dropzone-h">Drop files here to share with your Future Partners team</span>
          <span className="cli-dropzone-sub">PDF, DOCX, XLSX, images — up to 100 MB per file</span>
          <span className="cli-dropzone-or">or email them to <a href={"mailto:" + ENGAGEMENT.contactEmail}>{ENGAGEMENT.contactEmail}</a> with your project reference ({ENGAGEMENT.ref}).</span>
        </div>
        <Btn kind="secondary" size="sm">Browse files</Btn>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: Documents & admin
   ================================================================ */
function AdminSection() {
  const contracts = ADMIN_DOCS.filter(d => ["ad1","ad2"].includes(d.id));
  const invoices  = ADMIN_DOCS.filter(d => ["ad3","ad4"].includes(d.id));
  const reports   = ADMIN_DOCS.filter(d => ["ad5","ad6"].includes(d.id));

  const DocList = ({ items }) => (
    <div className="mdoc-list">
      {items.map(d => (
        <div className="mdoc-row cli-admin-row" key={d.id}>
          <DocIcon type={d.type}/>
          <span className="mdoc-main">
            <span className="mdoc-title">{d.title}</span>
            <span className="mdoc-summary">{d.summary}</span>
          </span>
          <span className={"vis vis-" + d.lifecycle}>{d.lifecycle === "current" ? "Current" : "Archived"}</span>
          <span className="mdoc-meta-cell">{d.date}</span>
          <span className="cli-file-dl"><Icon name="download" size={15}/></span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="cli-admin">
      <div className="cli-sec-header">
        <div>
          <h2 className="cli-sec-h1">Documents &amp; admin</h2>
          <p className="cli-sec-lead">Your contract, Terms of Reference, invoices and formal reports for this engagement.</p>
        </div>
      </div>
      <span className="mem-sec-h">Contract &amp; ToR</span>
      <DocList items={contracts}/>
      <span className="mem-sec-h">Invoices</span>
      <DocList items={invoices}/>
      <span className="mem-sec-h">Formal reports &amp; compliance</span>
      <DocList items={reports}/>
    </div>
  );
}

/* ================================================================
   SECTION: Reference
   ================================================================ */
function ReferenceSection({ refCases }) {
  const cases = refCases.map(id => caseById(id)).filter(Boolean);

  return (
    <div className="cli-reference">
      <div className="cli-sec-header">
        <div>
          <h2 className="cli-sec-h1">Reference</h2>
          <p className="cli-sec-lead">The Future Partners capability statement, relevant prior work, and public policies for your records.</p>
        </div>
      </div>

      {/* FP collateral */}
      <span className="mem-sec-h">Future Partners collateral</span>
      <div className="mdoc-list">
        {REF_DOCS.map(d => (
          <div className="mdoc-row cli-file-row" key={d.id}>
            <DocIcon type={d.type}/>
            <span className="mdoc-main">
              <span className="mdoc-title">{d.title}</span>
              <span className="mdoc-summary">{d.summary}</span>
            </span>
            <span className="mdoc-meta-cell">{d.date}</span>
            <span className="cli-file-dl"><Icon name="download" size={15}/></span>
          </div>
        ))}
      </div>

      {/* Relevant case studies */}
      <span className="mem-sec-h">Relevant prior work</span>
      <div className="cli-ref-cases">
        {cases.map(cs => {
          const stageMeta = STAGE[cs.stage];
          const csPeople  = (cs.people || []).map(id => personById(id)).filter(Boolean);
          return (
            <div className="cli-ref-case" key={cs.id}>
              <div className="cli-ref-case-head">
                <span className="cli-ref-case-stage">{stageMeta?.name || cs.stage}</span>
                <span className="cli-ref-case-year">{cs.year}</span>
              </div>
              <h3 className="cli-ref-case-title">{cs.title}</h3>
              <p className="cli-ref-case-client">{cs.client} · {cs.country?.name}</p>
              <p className="cli-ref-case-brief">{cs.brief}</p>
              <div className="cli-ref-case-team">
                {csPeople.slice(0,3).map(p => (
                  <span key={p.id} className="cli-ref-team-av" title={p.name}>
                    {p.photo
                      ? <img src={p.photo} alt={p.name}/>
                      : p.initials
                    }
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Register global ── */
Object.assign(window, { ClientSpace });

})();
