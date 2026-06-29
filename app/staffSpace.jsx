/* staffSpace.jsx — Staff workspace: the private back-office for Kirsty & the core team.
   Four areas: Incoming (files however they arrive) · Library (every filed document) ·
   Contacts (people & organisations — a light address book with history) · Website guide.
   Plain, consumer-facing language throughout — written for a non-technical reader.
   Defines a global StaffSpace({signOut, switcher}). Prefix for new CSS: stf-. */

/* =====================================================================
   WHERE A FILE CAME FROM — each incoming item remembers its source.
   Distinct colour + icon per source. WeTransfer links expire, which is the
   whole reason we save a copy here the moment a file arrives.
   ===================================================================== */
const STF_SOURCES = {
  dropbox:     {label:"Dropbox",       icon:"folder",   color:"#0B6CFF", ephemeral:false},
  drive:       {label:"Google Drive",  icon:"layers",   color:"#1F8A5B", ephemeral:false},
  wetransfer:  {label:"WeTransfer",    icon:"clock",    color:"#D9742B", ephemeral:true},
  email:       {label:"Email",         icon:"mail",     color:"#6B5BD2", ephemeral:false},
  upload:      {label:"Uploaded here", icon:"download", color:"#157F69", ephemeral:false},
};

/* The ways files can arrive, shown at the top of Incoming */
const STF_ONRAMPS = [
  {id:"upload", icon:"download", title:"Drag & drop", sub:"Drop files straight in — they land here, ready to file.", tag:null},
  {id:"link",   icon:"link",    title:"Paste a link", sub:"Dropbox, Drive or WeTransfer. We save a copy here, so it never expires.", tag:null},
  {id:"email",  icon:"mail",    title:"Email them in", sub:"Forward attachments to the address below — they appear here.", tag:null},
  {id:"connect",icon:"globe",   title:"Connected folders", sub:"Pull in files automatically from a shared Drive or Dropbox.", tag:"Optional · later"},
];

/* The collections a file can be filed into */
const STF_COLLECTIONS = ["Policies & governance","Templates","Guides & how-tos","Brand & collateral","Client deliverables","Financials & admin","Team documents"];

/* Who can see a filed document (plain words, not "audience") */
const STF_AUDIENCES = [
  {id:"public",    label:"Everyone"},
  {id:"client",    label:"Clients"},
  {id:"associate", label:"Associates"},
  {id:"staff",     label:"Team only"},
];
const audLabel = id => (STF_AUDIENCES.find(a=>a.id===id)||{}).label || "Team only";

/* =====================================================================
   INCOMING — ~9 files that have just arrived from real associates (PEOPLE),
   through different systems. status: needs | filed. expiresIn marks a link
   that is about to die (the reason we keep our own copy).
   ===================================================================== */
const STF_INBOX = [
  {id:"i1", name:"Kōtui evaluation — final draft.docx",        type:"DOCX", source:"wetransfer", from:"eileen",   received:"Today · 09:12",   size:"4.2 MB",  status:"needs", expiresIn:2, suggest:"Client deliverables"},
  {id:"i2", name:"Nauru health systems — field photos.zip",     type:"ZIP",  source:"wetransfer", from:"david",    received:"Today · 08:47",   size:"312 MB", status:"needs", expiresIn:2, suggest:"Client deliverables"},
  {id:"i3", name:"Tuvalu fisheries HRD plan v4.docx",           type:"DOCX", source:"email",      from:"ian",      received:"Yesterday · 17:30",size:"1.1 MB",  status:"needs", expiresIn:null, suggest:"Client deliverables"},
  {id:"i4", name:"Niue GCF accreditation — financials.xlsx",    type:"XLSX", source:"dropbox",    from:"brucetta", received:"Yesterday · 14:05",size:"680 KB",  status:"needs", expiresIn:null, suggest:"Financials & admin"},
  {id:"i5", name:"Timor forestry strategy — annexes.pdf",       type:"PDF",  source:"drive",      from:"elvino",   received:"Yesterday · 11:18",size:"8.9 MB",  status:"needs", expiresIn:null, suggest:"Client deliverables"},
  {id:"i6", name:"Save the Children eval — inception report.pdf",type:"PDF",  source:"email",      from:"elisabeth",received:"2 days ago",      size:"2.3 MB",  status:"needs", expiresIn:null, suggest:"Client deliverables"},
  {id:"i7", name:"Updated capability statement.pdf",            type:"PDF",  source:"upload",     from:"kirsty",   received:"2 days ago",      size:"1.7 MB",  status:"needs", expiresIn:null, suggest:"Brand & collateral"},
  {id:"i8", name:"Pacific Broadcasting review — slide deck.pptx",type:"PPTX", source:"drive",      from:"faka",     received:"3 days ago",      size:"14 MB",   status:"needs", expiresIn:null, suggest:"Client deliverables"},
  {id:"i9", name:"MERL framework template v2.docx",             type:"DOCX", source:"dropbox",    from:"hilary",   received:"3 days ago",      size:"540 KB",  status:"needs", expiresIn:null, suggest:"Templates"},
];

/* =====================================================================
   LIBRARY — the home for every filed document. Seeded from three places so
   the filters feel real: documents already filed from Incoming, the practice's
   internal records (the old "Working documents", now the Team documents
   collection), and a handful of library staples.
   Shape: { id, name, type, collection, audience, owner, updated, size, source?, from? }
   A document can carry a `body` (reader content) or fall back to a placeholder.
   ===================================================================== */
const STF_LIBRARY_SEED = [
  /* —— already filed from Incoming —— */
  {id:"L1", name:"Child Safeguarding Policy v3.1.pdf", type:"PDF", collection:"Policies & governance", audience:"associate", owner:"Kirsty Burnett", updated:"Last week", size:"890 KB", source:"upload", from:"kirsty",
   body:[
     {p:"Future Partners is committed to the safety, wellbeing and dignity of every child who comes into contact with our work. This policy sets out the standards we hold ourselves to, and what every associate must do."},
     {h:"Who this applies to"},
     {p:"Everyone working under the Future Partners name — directors, associates, sub-contractors and partners — on every assignment, in every country, whether contact with children is direct or indirect."},
     {h:"Reporting a concern"},
     {p:"Any concern about the safety of a child is reported to the Director within 24 hours, and to local authorities where required. Reports are handled in confidence, taken seriously, and never result in retaliation. When in doubt, report."},
   ]},
  {id:"L2", name:"Kōtui evaluation — 2024 report.pdf", type:"PDF", collection:"Client deliverables", audience:"client", owner:"Kirsty Burnett", updated:"Last month", size:"6.4 MB", source:"wetransfer", from:"eileen"},
  {id:"L3", name:"Nauru health systems review.docx", type:"DOCX", collection:"Client deliverables", audience:"client", owner:"Dr David Angelson", updated:"May 2026", size:"3.1 MB", source:"email", from:"david"},
  {id:"L4", name:"MERL framework template.docx", type:"DOCX", collection:"Templates", audience:"associate", owner:"Hilary Gorman", updated:"Apr 2026", size:"540 KB", source:"dropbox", from:"hilary"},

  /* —— library staples —— */
  {id:"L5", name:"Code of Conduct.pdf", type:"PDF", collection:"Policies & governance", audience:"associate", owner:"Kirsty Burnett", updated:"Mar 2026", size:"420 KB",
   body:[
     {p:"The standards of behaviour expected of everyone working under the Future Partners name — honest, respectful, and always in the best interests of the communities we work with."},
     {h:"In short"},
     {list:["Treat people with respect and maintain professional boundaries.","Declare conflicts of interest early and openly.","Protect the information partners and communities trust us with.","Speak up if something is not right — it will be taken seriously."]},
   ]},
  {id:"L6", name:"Conflict of Interest Policy.pdf", type:"PDF", collection:"Policies & governance", audience:"associate", owner:"Kirsty Burnett", updated:"Feb 2026", size:"310 KB"},
  {id:"L7", name:"Health, Safety & Travel Policy.pdf", type:"PDF", collection:"Policies & governance", audience:"associate", owner:"Kirsty Burnett", updated:"Apr 2026", size:"680 KB"},
  {id:"L8", name:"Project Design template.docx", type:"DOCX", collection:"Templates", audience:"associate", owner:"Future Partners", updated:"May 2026", size:"220 KB"},
  {id:"L9", name:"Evaluation Terms of Reference.docx", type:"DOCX", collection:"Templates", audience:"associate", owner:"Future Partners", updated:"Apr 2026", size:"180 KB"},
  {id:"L10", name:"Programme Budget template.xlsx", type:"XLSX", collection:"Templates", audience:"associate", owner:"Future Partners", updated:"Mar 2026", size:"95 KB"},
  {id:"L11", name:"MERL framework guide.pdf", type:"PDF", collection:"Guides & how-tos", audience:"associate", owner:"Future Partners", updated:"May 2026", size:"1.4 MB",
   body:[
     {p:"A good monitoring, evaluation, research and learning (MERL) framework helps the people delivering a project see what is working, adapt, and improve — not just report upward to a donor. This guide sets out how we build MERL that partners actually use."},
     {h:"Start from the change"},
     {p:"Begin with a clear theory of change: the outcomes that matter, and the assumptions behind how the project expects to reach them. Indicators follow from the change you are trying to see."},
     {h:"Close the loop"},
     {p:"Build in regular moments to review the data together, ask what it means, and adjust. Learning that never changes a decision is not learning."},
   ]},
  {id:"L12", name:"Working in the Pacific — protocols.pdf", type:"PDF", collection:"Guides & how-tos", audience:"associate", owner:"Future Partners", updated:"Apr 2026", size:"1.1 MB"},
  {id:"L13", name:"Logo & brand pack.zip", type:"ZIP", collection:"Brand & collateral", audience:"associate", owner:"Kirsty Burnett", updated:"Mar 2026", size:"24 MB"},
  {id:"L14", name:"Capability statement.pdf", type:"PDF", collection:"Brand & collateral", audience:"public", owner:"Future Partners", updated:"May 2026", size:"1.7 MB",
   body:[
     {p:"A two-page overview of what Future Partners does — services, sectors and proof — written for a first conversation with a new client or funder."},
     {h:"What we do"},
     {p:"We work across the whole project cycle — scope, design, fund, plan, deliver, review and improve — alongside local teams in the Pacific and Asia, not from a desk."},
   ]},
  {id:"L15", name:"Slide template.pptx", type:"PPTX", collection:"Brand & collateral", audience:"associate", owner:"Future Partners", updated:"Apr 2026", size:"3.8 MB"},

  /* —— team documents (was "Working documents"); Team only —— */
  {id:"L16", name:"Live proposals tracker.xlsx", type:"XLSX", collection:"Team documents", audience:"staff", owner:"Kirsty Burnett", updated:"Today", size:"210 KB"},
  {id:"L17", name:"Engagement tracker — active assignments.xlsx", type:"XLSX", collection:"Team documents", audience:"staff", owner:"Kirsty Burnett", updated:"Today", size:"180 KB"},
  {id:"L18", name:"FY26 financial model.xlsx", type:"XLSX", collection:"Team documents", audience:"staff", owner:"Kirsty Burnett", updated:"This week", size:"320 KB"},
  {id:"L19", name:"Invoicing & receivables.xlsx", type:"XLSX", collection:"Team documents", audience:"staff", owner:"Admin", updated:"Today", size:"260 KB"},
  {id:"L20", name:"Associate agreement — master template.docx", type:"DOCX", collection:"Team documents", audience:"staff", owner:"Kirsty Burnett", updated:"Feb 2026", size:"140 KB"},
  {id:"L21", name:"Subcontractor rate card.pdf", type:"PDF", collection:"Team documents", audience:"staff", owner:"Kirsty Burnett", updated:"Mar 2026", size:"90 KB"},
];

/* The collections, in order, with the icon used across the app */
const STF_LIB_COLLECTIONS = [
  {name:"Policies & governance", icon:"shield"},
  {name:"Templates",             icon:"file"},
  {name:"Guides & how-tos",      icon:"book"},
  {name:"Brand & collateral",    icon:"layers"},
  {name:"Client deliverables",   icon:"compass"},
  {name:"Financials & admin",    icon:"clock"},
  {name:"Team documents",        icon:"lock"},
];

/* =====================================================================
   CONTACTS — a light address book with relationship history.
   Shaped like spreadsheet columns on purpose: Kirsty has a master Excel
   sheet that will seed this later (see the "Import from spreadsheet" button).
   People reference an org by name; orgs are derived + enriched below.
   ===================================================================== */
const STF_CONTACT_TYPES = ["Client","Funder/Donor","Associate","Partner","Supplier","Prospect"];
const STF_CONTACT_STATUS = ["Active","Prospect","Past"];

/* Build associate contacts straight from PEOPLE so the roster stays in sync */
const STF_ASSOCIATE_CONTACTS = PEOPLE.map(p=>({
  id:"c-"+p.id,
  personId:p.id,
  name:p.name,
  initials:p.initials,
  fill:p.fill,
  title:p.role,
  org:"Future Partners",
  type:"Associate",
  status: p.id==="greg" || p.id==="julie" ? "Past" : "Active",
  email:(p.name.toLowerCase().replace(/[^a-z]+/g,".").replace(/^\.|\.$/g,""))+"@futurepartners.co.nz",
  phone:"+64 21 0"+(700+(p.name.length*7%300)),
  location:(p.regions||[])[0]||"Aotearoa NZ",
  tags:(p.sectors||[]).slice(0,2),
  cases:p.cases||[],
  lastContact: p.lead?"Today":["2 days ago","Last week","This week","Last month","Apr 2026"][p.name.length%5],
  history:[
    {d:"This week", t:"Assignment check-in call"},
    {d:"Last month", t:"Sent updated associate agreement"},
    {d:"Mar 2026", t:"Confirmed availability for upcoming work"},
  ],
}));

/* Invented-but-plausible client, funder, partner and prospect contacts at real
   organisations drawn from CLIENTS / CASES. Hand-written history per person. */
const STF_EXTERNAL_CONTACTS = [
  {id:"c-meresia", name:"Meresia Detenamo", initials:"MD", fill:"fill-sea",
   title:"Director of Public Health", org:"Nauru Ministry of Health", type:"Client", status:"Active",
   email:"m.detenamo@health.gov.nr", phone:"+674 557 3300", location:"Nauru · Micronesia",
   tags:["Health","Health systems"], cases:["nauru-health"],
   history:[
     {d:"14 Jun", t:"Sent Q2 invoice and progress note"},
     {d:"2 Jun", t:"Call re systems review report"},
     {d:"May 2026", t:"In-country workshop — Yaren"},
     {d:"Mar 2026", t:"Inception report signed off"},
   ]},
  {id:"c-tepaeru", name:"Tepaeru Herrmann", initials:"TH", fill:"fill-dawn",
   title:"Lead Adviser, Pacific Development", org:"MFAT · Manatū Aorere", type:"Funder/Donor", status:"Active",
   email:"tepaeru.herrmann@mfat.govt.nz", phone:"+64 4 439 8000", location:"Wellington · Aotearoa NZ",
   tags:["Governance & MERL","Funding"], cases:["oxfam-eval","savechildren-eval","kiribati-waste"],
   history:[
     {d:"10 Jun", t:"Proposal sent — Pacific panel response"},
     {d:"28 May", t:"Quarterly catch-up call"},
     {d:"Apr 2026", t:"Discussed evaluation findings"},
     {d:"Feb 2026", t:"Contract variation approved"},
   ]},
  {id:"c-naomi", name:"Naomi Watene", initials:"NW", fill:"fill-crossing",
   title:"Programmes Manager", org:"UNICEF Aotearoa", type:"Client", status:"Active",
   email:"nwatene@unicef.org.nz", phone:"+64 9 309 0726", location:"Auckland · Aotearoa NZ",
   tags:["Governance & MERL","Education"], cases:["unicef-merl"],
   history:[
     {d:"6 Jun", t:"Shared MERL framework draft"},
     {d:"22 May", t:"Workshop — outcome indicators"},
     {d:"Mar 2026", t:"Kicked off framework refresh"},
   ]},
  {id:"c-james-oxfam", name:"James Tugaga", initials:"JT", fill:"fill-coast",
   title:"Pacific Partnerships Lead", org:"Oxfam Aotearoa", type:"Client", status:"Active",
   email:"jamest@oxfam.org.nz", phone:"+64 4 472 9549", location:"Wellington · Aotearoa NZ",
   tags:["Governance & MERL"], cases:["oxfam-eval"],
   history:[
     {d:"12 Jun", t:"Final Kōtui report delivered"},
     {d:"30 May", t:"Reviewed draft recommendations"},
     {d:"Apr 2026", t:"Country visit debrief — PNG"},
   ]},
  {id:"c-sarah-stc", name:"Sarah Mafi", initials:"SM", fill:"fill-earth",
   title:"International Programmes Director", org:"Save the Children NZ", type:"Client", status:"Active",
   email:"sarah.mafi@savethechildren.org.nz", phone:"+64 4 385 6847", location:"Wellington · Aotearoa NZ",
   tags:["Education","Health"], cases:["savechildren-eval"],
   history:[
     {d:"9 Jun", t:"Inception report received"},
     {d:"24 May", t:"Evaluation scoping call"},
     {d:"Apr 2026", t:"Signed engagement letter"},
   ]},
  {id:"c-worldbank", name:"Anand Rai", initials:"AR", fill:"fill-sea",
   title:"Senior Fisheries Specialist", org:"World Bank", type:"Funder/Donor", status:"Past",
   email:"arai@worldbank.org", phone:"+1 202 473 1000", location:"Washington · regional",
   tags:["Fisheries & oceans"], cases:["prop-oceanscape"],
   history:[
     {d:"2022", t:"PROP review final report accepted"},
     {d:"2022", t:"Presented findings to task team"},
   ]},
  {id:"c-adb", name:"Latu Fifita", initials:"LF", fill:"fill-coast",
   title:"Climate Finance Officer", org:"Asian Development Bank", type:"Funder/Donor", status:"Active",
   email:"lfifita@adb.org", phone:"+63 2 8632 4444", location:"Manila · regional",
   tags:["Climate & environment","WASH"], cases:["childfund-wash"],
   history:[
     {d:"5 Jun", t:"Introductory call re WASH partnership"},
     {d:"Apr 2026", t:"Shared capability statement"},
   ]},
  {id:"c-spc", name:"Sione Tuʻihalangingie", initials:"ST", fill:"fill-forest",
   title:"Biosecurity Adviser", org:"SPC", type:"Partner", status:"Active",
   email:"sionet@spc.int", phone:"+687 26 20 00", location:"Suva · Pacific regional",
   tags:["Biosecurity","Climate & environment"], cases:["invasive-species","invasive-resource"],
   history:[
     {d:"3 Jun", t:"Coordinated on invasive-species plan"},
     {d:"May 2026", t:"Joint workshop — regional agencies"},
   ]},
  {id:"c-datatorque", name:"Raymond Marshall", initials:"RM", fill:"fill-earth",
   title:"Chief Operating Officer", org:"DataTorque Ltd", type:"Supplier", status:"Active",
   email:"r.marshall@datatorque.com", phone:"+64 4 801 8400", location:"Wellington · Aotearoa NZ",
   tags:["Partnerships"], cases:[],
   history:[
     {d:"1 Jun", t:"Referral — possible revenue-systems work"},
     {d:"Mar 2026", t:"Coffee — network catch-up"},
   ]},
  {id:"c-fredhollows", name:"Hana Leota", initials:"HL", fill:"fill-dawn",
   title:"Pacific Programmes Manager", org:"Fred Hollows Foundation NZ", type:"Prospect", status:"Prospect",
   email:"hleota@hollows.nz", phone:"+64 9 950 5400", location:"Auckland · Aotearoa NZ",
   tags:["Health"], cases:["fred-hollows","eye-institute"],
   history:[
     {d:"8 Jun", t:"Proposal sent — eye-health scale-up"},
     {d:"May 2026", t:"Intro call re ATScale business case"},
   ]},
  {id:"c-childfund", name:"Tomasi Rabuka", initials:"TR", fill:"fill-crossing",
   title:"Country Programme Lead", org:"ChildFund NZ", type:"Client", status:"Active",
   email:"trabuka@childfund.org.nz", phone:"+64 4 471 0300", location:"Tarawa · Micronesia",
   tags:["WASH"], cases:["childfund-wash"],
   history:[
     {d:"4 Jun", t:"WASH design workshop — Kiribati"},
     {d:"Apr 2026", t:"Confirmed community partners"},
   ]},
  {id:"c-prospect-wwf", name:"Eleanor Marsh", initials:"EM", fill:"fill-forest",
   title:"Conservation Programmes Lead", org:"WWF New Zealand", type:"Prospect", status:"Prospect",
   email:"emarsh@wwf.org.nz", phone:"+64 4 499 2930", location:"Wellington · Aotearoa NZ",
   tags:["Climate & environment"], cases:[],
   history:[
     {d:"7 Jun", t:"First conversation — possible evaluation"},
   ]},
];

const STF_CONTACTS = [...STF_EXTERNAL_CONTACTS, ...STF_ASSOCIATE_CONTACTS];

/* Organisations — derived from the external contacts (plus Future Partners),
   enriched with a type, region and the projects we link to them. */
const STF_ORGS = [
  {name:"Nauru Ministry of Health", type:"Government", region:"Micronesia · Nauru", cases:["nauru-health"]},
  {name:"MFAT · Manatū Aorere", type:"Funder", region:"Aotearoa NZ", cases:["oxfam-eval","savechildren-eval","kiribati-waste","cook-eval","epbp","market-access"]},
  {name:"UNICEF Aotearoa", type:"UN agency", region:"Aotearoa NZ", cases:["unicef-merl","wash-decade"]},
  {name:"Oxfam Aotearoa", type:"NGO", region:"Aotearoa NZ", cases:["oxfam-eval"]},
  {name:"Save the Children NZ", type:"NGO", region:"Aotearoa NZ", cases:["savechildren-eval"]},
  {name:"World Bank", type:"Multilateral", region:"Washington · regional", cases:["prop-oceanscape"]},
  {name:"Asian Development Bank", type:"Multilateral", region:"Manila · regional", cases:["childfund-wash"]},
  {name:"SPC", type:"Multilateral", region:"Suva · Pacific regional", cases:["invasive-species","invasive-resource","prop-oceanscape"]},
  {name:"DataTorque Ltd", type:"Crown research", region:"Wellington · Aotearoa NZ", cases:[]},
  {name:"Fred Hollows Foundation NZ", type:"NGO", region:"Auckland · Aotearoa NZ", cases:["fred-hollows","eye-institute"]},
  {name:"ChildFund NZ", type:"NGO", region:"Tarawa · Micronesia", cases:["childfund-wash"]},
  {name:"WWF New Zealand", type:"NGO", region:"Wellington · Aotearoa NZ", cases:[]},
  {name:"Future Partners", type:"Crown research", region:"Aotearoa NZ", cases:[]},
];
const orgByName = name => STF_ORGS.find(o=>o.name===name);
const contactsForOrg = name => STF_CONTACTS.filter(c=>c.org===name);

/* =====================================================================
   WEBSITE GUIDE — "how this website actually works". Kirsty asked for it.
   Honest, genuinely useful, clearly a draft. Reader bodies reuse .mdoc-doc.
   ===================================================================== */
const STF_GUIDE = [
  {id:"r1", title:"What the site is built on", type:"Web", icon:"layers", updated:"Jun 2026", summary:"What the website runs on today, and the plan for the live version.",
   body:[
     {p:"This page is an honest snapshot of how the Future Partners website is put together — today, and where it is heading. It is a working draft, kept up to date as decisions are made."},
     {h:"Where we are today"},
     {p:"Right now the site you are reading is a prototype that runs entirely in your browser. It is fast to change and perfect for agreeing the design and the way things are organised, but it is not the final, live system."},
     {h:"Where we are heading"},
     {list:[
       "A modern website framework (Next.js) so pages load fast and show up well in search.",
       "A content tool (CMS) you can edit yourself, without needing a developer for everyday changes.",
       "Hosting with predictable, simple pricing — kept together with the database and content tool.",
       "Safe file storage sitting behind Incoming, so every copy of a file we save has a permanent home.",
     ]},
     {h:"Why this shape"},
     {p:"The members area — and Incoming in particular — is the reason for a real system behind the scenes. Associates send working files from many places; the site needs a safe, lasting home for each one and a way to track where it belongs."},
   ]},
  {id:"r2", title:"How to edit the website", type:"Web", icon:"file", updated:"Jun 2026", summary:"Who edits what, and how a change reaches the live site.",
   body:[
     {p:"Most day-to-day changes — a new case study, a news post, an associate bio, a policy document — are content, not code. Once the live content tool is in place, you edit them yourself."},
     {h:"The everyday workflow"},
     {list:[
       "Sign in to the content tool (the same login as this members area).",
       "Find the section you want — Case studies, News, People, Documents.",
       "Edit in a simple form: title, summary, body, images, and tags.",
       "Save as a draft and preview. Publish when it reads right; unpublish to take something down.",
     ]},
     {h:"When you need a developer"},
     {p:"Layout, design and brand-new kinds of pages are code, and go through a developer. Everything inside an existing page is yours to edit. A simple rule: if it is words or images inside a kind of page that already exists, it is yours to change."},
   ]},
  {id:"r3", title:"Publishing & undo", type:"Web", icon:"clock", updated:"Jun 2026", summary:"How a change goes live, and how to undo one quickly if something looks wrong.",
   body:[
     {p:"Going live should be calm and boring. This is the routine for publishing a change and, just as importantly, for taking one back."},
     {h:"Publishing a change"},
     {list:[
       "A change is approved and saved.",
       "The site rebuilds itself automatically and runs a quick check.",
       "If the check passes, the new version goes live; if it fails, the previous version stays up — so visitors never see a broken site.",
     ]},
     {h:"Undoing a change"},
     {list:[
       "A content mistake — wrong words or image — is fixed by editing or unpublishing the entry in the content tool.",
       "A bigger problem is undone by switching back to the last version that worked, which takes about a minute.",
     ]},
     {h:"If the site looks down"},
     {p:"Nine times out of ten it is the most recent change. Switch back to the previous version first to get the site working again, then look into it calmly."},
   ]},
  {id:"r4", title:"The look & feel (brand)", type:"Web", icon:"heart", updated:"Jun 2026", summary:"The colours, type and spacing that keep every screen on-brand.",
   body:[
     {p:"The look of the site is defined once and reused everywhere, so every page feels like part of the same whole. Change it in one place and it updates consistently across the site."},
     {h:"Colour"},
     {p:"A green palette carries the brand, with calm neutral tones for text and backgrounds. Nothing on the site picks its own colour — everything draws from the shared set, so it always looks consistent."},
     {h:"Type & spacing"},
     {list:[
       "A confident display font for headings.",
       "A comfortable font for reading longer passages.",
       "A neat mono font for small labels and detail.",
     ]},
     {p:"Rounded corners, soft shadows and a steady spacing rhythm complete the feel. The brand pack — wordmarks, the koru monogram and favicons — lives in the Library under Brand & collateral."},
   ]},
  {id:"r5", title:"Where everything lives (Notion)", type:"Web", icon:"external", updated:"Jun 2026", summary:"The wider operating system sits in Notion; this is the pointer to it.",
   external:true,
   body:[
     {p:"The website is one part of a wider operating system that lives in Notion. This page is simply the pointer from the site back to that home — it does not copy it."},
     {h:"What lives in Notion"},
     {list:[
       "The content backlog — case studies, news and people, drafted before they reach the site.",
       "The project and engagement tracker the team documents here reflect.",
       "Brand guidelines, decisions, and the build log for the site itself.",
       "How-to notes for the way the team works.",
     ]},
     {h:"How they fit together"},
     {p:"Notion is where things are decided and drafted; the website and this members area are where the finished versions are published. Keep the thinking in Notion and the polished output here."},
   ]},
  {id:"r6", title:"Keeping old links working", type:"Web", icon:"link", updated:"Jun 2026", summary:"Every old web address points to its new home, so nothing breaks.",
   body:[
     {p:"The previous Future Partners site was built on Wix. When the new site goes live, every meaningful old web address points to its new equivalent — so search results and existing links keep working instead of leading nowhere."},
     {h:"How it works"},
     {list:[
       "A simple map lists each old address and the new address it points to.",
       "Visitors and search engines are sent straight to the right page.",
       "After launch we watch for any dead ends and add the missed ones to the map.",
     ]},
     {h:"A few examples"},
     {list:[
       "Old \"our projects\" page → the new Atlas",
       "Old \"about\" page → the approach section on the home page",
       "Old \"team\" page → the new People page",
     ]},
     {p:"The full map is kept alongside the site's settings. This is a draft sample, not the final list."},
   ]},
  {id:"r7", title:"Domains, logins & where things live", type:"Web", icon:"lock", updated:"Jun 2026", summary:"Where the domain and logins are kept — a list of pointers, never the passwords themselves.",
   body:[
     {p:"This is a deliberately short page: a list of where the keys are kept, not the keys themselves. No password or private value is ever written here, or anywhere on the site."},
     {h:"Domain"},
     {list:[
       "The website address is futurepartners.co.nz.",
       "The settings that point the address at the site are managed where the domain was bought.",
       "The security certificate renews itself automatically.",
     ]},
     {h:"Where the logins actually live"},
     {list:[
       "Behind-the-scenes settings live with the hosting, never in the website's code.",
       "Shared logins are kept in the team password manager.",
       "The mailbox behind the file-forwarding address is looked after with the other email accounts.",
     ]},
     {p:"If a login is missing or needs changing, go to the place that owns it — the hosting, the domain provider, or the password manager. This page only tells you which one."},
   ]},
];

/* ---------- a shared document reader (reused by Library + Website guide) ---------- */
function StfDocBody({body, footLine}){
  return (
    <article className="mdoc-doc">
      {body
        ? body.map((b,i)=> b.h ? <h3 className="mdoc-doc-h" key={i}>{b.h}</h3>
            : b.list ? <ul className="mdoc-doc-ul" key={i}>{b.list.map((x,j)=><li key={j}>{x}</li>)}</ul>
            : <p className="mdoc-doc-p" key={i}>{b.p}</p>)
        : (
          <React.Fragment>
            <p className="mdoc-doc-p">This is a saved copy. The full document opens or downloads from the buttons above — the preview here is a placeholder.</p>
            <ul className="mdoc-doc-ul">
              <li>Every file in the Library has a permanent copy saved here.</li>
              <li>Nothing relies on a link that might expire.</li>
            </ul>
          </React.Fragment>
        )}
      <p className="mdoc-doc-foot">{footLine}</p>
    </article>
  );
}

/* =====================================================================
   ROOT — StaffSpace. Filed items are lifted here so Incoming and Library
   share one list: filing a file in Incoming makes it appear in the Library.
   ===================================================================== */
function StaffSpace({signOut, switcher}){
  const [section, setSection] = useState("desk"); // desk | files | contacts | business
  const [filesTab, setFilesTab] = useState("library"); // library | inbox — the two states of Files
  const [helpOpen, setHelpOpen] = useState(false); // Website guide, now reached from the footer
  const [inbox, setInbox]     = useState(STF_INBOX);
  const [filed, setFiled]     = useState([]); // items filed this session → join the Library
  const [search, setSearch]   = useState("");
  const [newEng, setNewEng]   = useState(false); // the "+ New engagement" sub-view (Feature 3)
  const [contactJump, setContactJump] = useState(null); // a contact id the Desk wants to open
  const [askOpen, setAskOpen] = useState(false); // the content assistant panel (concept)
  const [askSeed, setAskSeed] = useState(null);  // {text, n} signal to seed it from the Desk bar
  const askAssistant = (text)=>{ setAskSeed({text, n:Date.now()}); setAskOpen(true); };

  /* file a freshly-arrived item: mark it filed in the inbox, add a Library record */
  const fileItem = (item, choice)=>{
    setInbox(prev=>prev.map(i=> i.id===item.id ? {...i, status:"filed", filedAs:choice} : i));
    setFiled(prev=>[{
      id:"F-"+item.id,
      name:item.name,
      type:item.type,
      collection:choice.collection,
      audience:choice.audience,
      owner:choice.owner,
      updated:"Just now",
      size:item.size,
      source:item.source,
      from:item.from,
      fresh:true,
    }, ...prev]);
  };

  const library = [...filed, ...STF_LIBRARY_SEED];
  const needsCount = inbox.filter(i=>i.status==="needs").length;

  const NAV = [
    {id:"desk",     icon:"grid",     label:"Desk",     owner:true},
    {id:"files",    icon:"folder",   label:"Files",    count:needsCount}, // Inbox + Library, merged
    {id:"contacts", icon:"users",    label:"Contacts", count:STF_CONTACTS.length},
    {id:"business", icon:"layers",   label:"Business", owner:true},
  ];

  /* jump helpers the Desk hands down — keep one routing path through the root.
     The Desk still points at "incoming"; route that to Files → Inbox sub-tab. */
  const goSection = (id)=>{
    setNewEng(false); setSearch(""); setHelpOpen(false);
    if(id==="incoming"){ setFilesTab("inbox"); setSection("files"); return; }
    if(id==="library"){ setFilesTab("library"); setSection("files"); return; }
    setSection(id);
  };
  const openContact = (id)=>{ setContactJump(id); setSearch(""); setHelpOpen(false); setSection("contacts"); };

  /* a tiny global search across the library, scoped to staff content */
  const searchHits = search.trim()
    ? library.filter(d=>(d.name+" "+d.collection+" "+(d.owner||"")).toLowerCase().includes(search.trim().toLowerCase()))
    : null;

  return (
    <div className="mem">
      <aside className="mem-side">
        <a href="#/" className="mem-logo" onClick={(e)=>{e.preventDefault(); navigate("/");}}>
          <img src="assets/logo.png" alt="Future Partners"/>
        </a>
        <span className="mem-side-label">Staff workspace</span>
        {switcher && <SpaceSwitcher {...switcher}/>}
        <nav className="mem-nav">
          {NAV.map(n=>(
            <button key={n.id} className={"mem-navitem"+(section===n.id && !helpOpen?" on":"")+(n.owner?" stf-nav-owner":"")} onClick={()=>{setSection(n.id); setNewEng(false); setSearch(""); setHelpOpen(false);}}>
              <Icon name={n.icon} size={18}/> {n.label}
              {n.owner && <span className="stf-nav-ownerdot" title="Owner — you & delegates"/>}
              {n.count!=null && <span className="mem-navcount">{n.count}</span>}
            </button>
          ))}
        </nav>
        <div className="mem-side-foot">
          <div className="mem-user">
            <span className="mem-user-av">KB</span>
            <div className="mem-user-id"><span className="mem-user-name">Kirsty Burnett</span><span className="mem-user-role">Role · Staff</span></div>
          </div>
          <div className="stf-foot-actions">
            <button className={"stf-help"+(helpOpen?" on":"")} onClick={()=>{ setHelpOpen(true); setNewEng(false); setSearch(""); }}><Icon name="book" size={15}/> Help</button>
            <button className="mem-signout" onClick={signOut}><Icon name="lock" size={15}/> Sign out</button>
          </div>
        </div>
      </aside>

      <div className="mem-main">
        <header className="mem-top">
          <label className="mem-search">
            <Icon name="search" size={18}/>
            <input value={search} onChange={e=>{setSearch(e.target.value); if(e.target.value.trim()){ setHelpOpen(false); setFilesTab("library"); setSection("files"); }}} placeholder="Search the Library…"/>
          </label>
          <div className="mem-top-actions">
            <span className="mem-draftpill">DRAFT · concept</span>
            <a href="#/" onClick={(e)=>{e.preventDefault(); navigate("/");}} className="mem-backsite"><Icon name="external" size={16}/> Public site</a>
          </div>
        </header>

        <div className="mem-content">
          {typeof ConceptIntro !== "undefined" && <ConceptIntro space="staff"/>}
          {searchHits
            ? <StfLibrary docs={library} externalHits={searchHits} searchTerm={search} onClearSearch={()=>setSearch("")}/>
            : helpOpen
              ? <StfGuide onClose={()=>setHelpOpen(false)}/>
              : newEng
                ? <StfNewEngagement onBack={()=>setNewEng(false)}/>
                : <React.Fragment>
                    {section==="desk"     && <StfDesk inbox={inbox} library={library} onSection={goSection} onContact={openContact} onNew={()=>setNewEng(true)} onAsk={askAssistant}/>}
                    {section==="files"    && <StfFiles tab={filesTab} onTab={setFilesTab} inbox={inbox} library={library} needsCount={needsCount} onFile={fileItem}/>}
                    {section==="contacts" && <StfContacts jumpTo={contactJump} onConsumeJump={()=>setContactJump(null)}/>}
                    {section==="business" && <StfBusiness/>}
                  </React.Fragment>}
        </div>
      </div>

      {typeof StfAssistant!=="undefined" && <StfAssistant open={askOpen} showFab={!(section==="desk" && !helpOpen && !newEng && !searchHits)} onOpen={()=>setAskOpen(true)} onClose={()=>setAskOpen(false)} seed={askSeed}/>}
    </div>
  );
}

/* ---------- shared little pieces ---------- */
function StfSourceChip({source}){
  const s = STF_SOURCES[source] || STF_SOURCES.upload;
  return (
    <span className="stf-source" style={{color:s.color, background:s.color+"14", borderColor:s.color+"33"}}>
      <Icon name={s.icon} size={13}/> {s.label}
    </span>
  );
}
function StfFromAvatar({person}){
  if(!person) return null;
  return <span className={"stf-av "+(person.fill||"fill-forest")} title={person.name}>{person.initials}</span>;
}
/* who-can-see-it badge — maps to the existing visibility chip styles */
function StfWhoBadge({audience}){
  const cls = audience==="public" ? "vis-public" : audience==="staff" ? "vis-archived" : "vis-membersOnly";
  return <span className={"vis "+cls}>{audLabel(audience)}</span>;
}
/* the small owner treatment shown on Desk + Business (conceptual — no RBAC) */
function StfOwnerChip(){
  return <span className="stf-ownerchip"><Icon name="shield" size={12}/> Owner · you &amp; delegates</span>;
}
/* Honest caveat for the aspirational, whole-business views (Desk, Business): a real
   version would have to integrate the tools Kirsty already uses — it's vision, not a quick add. */
function StfAspirational(){
  return (
    <div className="stf-aspir">
      <span className="stf-aspir-ic"><Icon name="link" size={15}/></span>
      <span className="stf-aspir-text"><strong>Aspirational.</strong> A live version would connect to the tools you already use — Outlook, your accounting software, your file storage. It's here to show the idea of one place to glance at everything; building it for real is a deep, integrated piece of work, not a quick add.</span>
    </div>
  );
}
/* a compact 7-dot project-cycle strip (mirrors the client space cycle, dots only) */
function StfCycleDots({stageKey}){
  const idx = CYCLE.findIndex(s=>s.key===stageKey);
  return (
    <span className="stf-dots" title={`Stage ${idx+1} of ${CYCLE.length}`}>
      {CYCLE.map((s,i)=>(
        <span key={s.key} className={"stf-dot"+(i<idx?" done":"")+(i===idx?" now":"")}/>
      ))}
    </span>
  );
}

/* =====================================================================
   DESK + BUSINESS — derived numbers, kept consistent with the file's mock
   data so the owner's morning view never contradicts the rest of the app.
   Receivables / margins / utilisation are believable NZD mock figures.
   ===================================================================== */
const fmtNZD = n => "$"+Number(n).toLocaleString("en-NZ");

/* the live engagements Kirsty is watching — drawn from CASES, varied stages,
   each with a believable next milestone. Order = least → most progressed. */
const STF_ACTIVE = [
  {id:"nauru-health",  milestone:"Systems review — final sign-off (Fri)"},
  {id:"childfund-wash",milestone:"WASH design workshop write-up due"},
  {id:"niue-gcf",      milestone:"GCF accreditation — financials to lodge"},
  {id:"savechildren-eval", milestone:"Inception report → client review"},
  {id:"oxfam-eval",    milestone:"Kōtui report with MFAT for approval"},
  {id:"unicef-merl",   milestone:"Framework refresh — phase 2 scoping"},
];

/* outstanding invoices (receivables) — real orgs from CASES / STF_CONTACTS */
const STF_RECEIVABLES = [
  {id:"056", org:"Nauru Ministry of Health", amount:31600, age:12, overdue:true},
  {id:"061", org:"MFAT · Manatū Aorere",     amount:48200, age:9,  overdue:false},
  {id:"058", org:"Oxfam Aotearoa",           amount:22400, age:24, overdue:true},
  {id:"063", org:"UNICEF Aotearoa",          amount:17800, age:6,  overdue:false},
  {id:"064", org:"Save the Children NZ",      amount:14500, age:3,  overdue:false},
  {id:"055", org:"ChildFund NZ",             amount:9600,  age:18, overdue:false},
];

/* associate utilisation — believable % against capacity, derived names from PEOPLE */
const STF_UTIL = [
  {pid:"david",     util:92},
  {pid:"eileen",    util:78},
  {pid:"brucetta",  util:64},
  {pid:"elisabeth", util:48},
  {pid:"ian",       util:34},
];

/* project margins — budget vs spent, on-track / at-risk */
const STF_MARGINS = [
  {id:"nauru-health",  budget:142000, spent:96000},
  {id:"oxfam-eval",    budget:88000,  spent:81000},
  {id:"unicef-merl",   budget:64000,  spent:39000},
  {id:"savechildren-eval", budget:74000, spent:71500},
];

/* =====================================================================
   FILES — one home, two states. Inbox = files not yet filed; Library =
   filed files. A segmented toggle (reusing the Contacts stf-toggle pattern)
   switches between them; both share the root's inbox/library/onFile, so
   filing in the Inbox makes a file appear in the Library — same loop, one section.
   ===================================================================== */
function StfFiles({tab, onTab, inbox, library, needsCount, onFile}){
  return (
    <div className="stf-files">
      <div className="mhome-head">
        <p className="eyebrow">Files</p>
        <h1 className="mhome-h1">Inbox and Library</h1>
        <p className="mhome-lead fp-lead">Inbox is what's just arrived and not yet filed; the Library is everything that's been filed. Two states, one place — file something in the Inbox and it lands in the Library.</p>
      </div>

      {/* Library · Inbox sub-tab toggle */}
      <div className="stf-toggle stf-files-toggle">
        <button className={"stf-toggle-btn"+(tab==="library"?" on":"")} onClick={()=>onTab("library")}><Icon name="folder" size={15}/> Library <span className="stf-pill-n">{library.length}</span></button>
        <button className={"stf-toggle-btn"+(tab==="inbox"?" on":"")} onClick={()=>onTab("inbox")}><Icon name="download" size={15}/> Inbox {needsCount>0 && <span className="stf-pill-n stf-pill-warn">{needsCount}</span>}</button>
      </div>

      {tab==="library"
        ? <StfLibrary docs={library} hideHead/>
        : <StfIncoming inbox={inbox} onFile={onFile} hideHead/>}
    </div>
  );
}

/* =====================================================================
   1 · INCOMING — the showpiece. Files arrive from anywhere, we save a copy
   the moment they land, and a quick "File it" step puts each one in the Library.
   ===================================================================== */
function StfIncoming({inbox, onFile, hideHead}){
  const [filing, setFiling] = useState(null); // the item being filed

  const needs    = inbox.filter(i=>i.status==="needs");
  const expiring = needs.filter(i=>i.expiresIn!=null);
  const filedThisWeek = 14 + inbox.filter(i=>i.status==="filed").length; // rolling count (mock)

  return (
    <div className="stf-inbox">
      {!hideHead && (
        <div className="mhome-head">
          <p className="eyebrow">Inbox</p>
          <h1 className="mhome-h1">Files waiting to be filed</h1>
          <p className="mhome-lead fp-lead">Associates send working files from wherever they are — Dropbox, Drive, WeTransfer, a plain email. Everything lands here, we save a copy the moment it arrives, and a quick step files each one into the Library. No more links that stop working.</p>
        </div>
      )}

      {/* WAYS IN */}
      <span className="mem-sec-h">Add files</span>
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

      {/* THE FLOW — said like a person would */}
      <div className="stf-flow">
        <div className="stf-flow-step">
          <span className="stf-flow-ic"><Icon name="layers" size={18}/></span>
          <div><span className="stf-flow-t">Arrives from anywhere</span><span className="stf-flow-s">Dropbox · Drive · WeTransfer · Email</span></div>
        </div>
        <span className="stf-flow-arrow"><Icon name="arrow" size={18}/></span>
        <div className="stf-flow-step">
          <span className="stf-flow-ic"><Icon name="download" size={18}/></span>
          <div><span className="stf-flow-t">Saved safely here</span><span className="stf-flow-s">A copy is kept the moment it arrives</span></div>
        </div>
        <span className="stf-flow-arrow"><Icon name="arrow" size={18}/></span>
        <div className="stf-flow-step">
          <span className="stf-flow-ic"><Icon name="check" size={18}/></span>
          <div><span className="stf-flow-t">Filed where you'll find it</span><span className="stf-flow-s">Into a Library collection</span></div>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="stf-stats">
        <div className="stf-stat">
          <span className="stf-stat-n">{needs.length}</span>
          <span className="stf-stat-l">Waiting to be filed</span>
        </div>
        <div className="stf-stat stf-stat-warn">
          <span className="stf-stat-n">{expiring.length}</span>
          <span className="stf-stat-l">From WeTransfer · link expiring</span>
        </div>
        <div className="stf-stat">
          <span className="stf-stat-n">{filedThisWeek}</span>
          <span className="stf-stat-l">Filed this week</span>
        </div>
      </div>

      {/* THE LIST */}
      <span className="mem-sec-h">Just arrived</span>
      <div className="stf-list">
        <div className="stf-listhead">
          <span>File</span><span className="stf-col">Came from</span><span className="stf-col">Sent by</span><span className="stf-col">Arrived</span><span className="stf-col">Size</span><span className="stf-col stf-col-act">Status</span>
        </div>
        {inbox.map(it=>{
          const person = personById(it.from);
          const isExpiring = it.expiresIn!=null && it.status==="needs";
          return (
            <div className={"stf-row"+(it.status==="filed"?" stf-row-filed":"")} key={it.id}>
              <span className="stf-file">
                <DocIcon type={it.type}/>
                <span className="stf-file-main">
                  <span className="stf-file-name">{it.name}</span>
                  {isExpiring
                    ? <span className="stf-expire"><Icon name="clock" size={12}/> Link expires in {it.expiresIn} day{it.expiresIn===1?"":"s"} — copy already saved here</span>
                    : it.status==="filed"
                      ? <span className="stf-filed-as"><Icon name="check" size={12}/> Filed → {it.filedAs.collection} · {audLabel(it.filedAs.audience)}</span>
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

      {filing && <StfFileModal item={filing} onClose={()=>setFiling(null)} onFile={(choice)=>{onFile(filing, choice); setFiling(null);}}/>}
    </div>
  );
}

/* ---------- the "File it" modal: a just-arrived file → a tidy Library item ---------- */
function StfFileModal({item, onClose, onFile}){
  const person = personById(item.from);
  const [collection, setCollection] = useState(item.suggest || STF_COLLECTIONS[0]);
  const [audience,   setAudience]   = useState("associate");
  const [owner,      setOwner]      = useState("Kirsty Burnett");

  useEffect(()=>{
    const onKey = (e)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  },[onClose]);

  const src = STF_SOURCES[item.source] || STF_SOURCES.upload;

  return (
    <div className="stf-modal-scrim" onClick={onClose}>
      <div className="stf-modal" onClick={(e)=>e.stopPropagation()} role="dialog" aria-label="File this item">
        <button className="stf-modal-x" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button>
        <span className="mem-panel-h">Sort this into the Library</span>
        <h2 className="stf-modal-h">{item.name}</h2>

        <div className="stf-triage">
          <div className="stf-triage-side stf-triage-from">
            <span className="stf-triage-cap">Where it came from</span>
            <StfSourceChip source={item.source}/>
            <ul className="stf-triage-facts">
              <li><span>Sent by</span><b>{person ? person.name : item.from}</b></li>
              <li><span>Arrived</span><b>{item.received}</b></li>
              <li><span>Size</span><b>{item.size}</b></li>
              <li><span>Original link</span><b className={src.ephemeral?"stf-rot":""}>{src.ephemeral?`Expires in ${item.expiresIn} days`:"Still good"}</b></li>
            </ul>
          </div>
          <span className="stf-triage-arrow"><Icon name="arrow" size={22}/></span>
          <div className="stf-triage-side stf-triage-to">
            <span className="stf-triage-cap">File it as</span>
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
                <span>Who can see it</span>
                <div className="stf-seg">
                  {STF_AUDIENCES.map(a=>(
                    <button type="button" key={a.id} className={"stf-seg-btn"+(audience===a.id?" on":"")} onClick={()=>setAudience(a.id)}>{a.label}</button>
                  ))}
                </div>
              </label>
              <label className="stf-field">
                <span>Owner</span>
                <input className="stf-input" value={owner} onChange={e=>setOwner(e.target.value)}/>
              </label>
            </div>
          </div>
        </div>

        <div className="stf-modal-foot">
          <span className="stf-modal-note"><Icon name="shield" size={14}/> We've already saved a copy — filing just tells us where it belongs.</span>
          <div className="stf-modal-actions">
            <Btn kind="secondary" size="sm" onClick={onClose}>Cancel</Btn>
            <Btn kind="primary" size="sm" arrow onClick={()=>onFile({collection, audience, owner})}>File into Library</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   2 · LIBRARY — every filed document, searchable & filterable.
   Filters: collection · file type · who can see it. Click a row to read it.
   `externalHits` (optional) wires the top-bar search into the same view.
   ===================================================================== */
function StfLibrary({docs, externalHits, searchTerm, onClearSearch, hideHead}){
  const [openId, setOpenId]   = useState(null);
  const [collection, setColl] = useState("All");
  const [ftype, setFtype]     = useState("All");
  const [who, setWho]         = useState("All");
  const [localSearch, setLocalSearch] = useState("");

  const open = openId ? docs.find(d=>d.id===openId) : null;
  if(open) return <StfLibraryDoc doc={open} onBack={()=>setOpenId(null)}/>;

  const types = ["All", ...Array.from(new Set(docs.map(d=>d.type)))];
  const usingTopSearch = !!externalHits;

  let results = usingTopSearch ? externalHits : docs;
  if(!usingTopSearch){
    if(collection!=="All") results = results.filter(d=>d.collection===collection);
    if(ftype!=="All")      results = results.filter(d=>d.type===ftype);
    if(who!=="All")        results = results.filter(d=>d.audience===who);
    if(localSearch.trim()){
      const q = localSearch.trim().toLowerCase();
      results = results.filter(d=>(d.name+" "+d.collection+" "+(d.owner||"")).toLowerCase().includes(q));
    }
  }

  const anyFilter = collection!=="All" || ftype!=="All" || who!=="All" || localSearch.trim();

  return (
    <div className="stf-library">
      {!hideHead && (
        <div className="mhome-head">
          <p className="eyebrow">Library</p>
          <h1 className="mhome-h1">Every filed document</h1>
          <p className="mhome-lead fp-lead">Everything that's been filed lives here — policies, templates, guides, brand files, client work and the team's own records. Search it, or narrow it down by collection, file type, or who can see it.</p>
        </div>
      )}

      {usingTopSearch ? (
        <div className="stf-lib-searchnote">
          <span><Icon name="search" size={15}/> {externalHits.length} result{externalHits.length===1?"":"s"} for “{searchTerm}”</span>
          <button className="stf-chip" onClick={onClearSearch}>Clear search</button>
        </div>
      ) : (
        <React.Fragment>
          {/* COLLECTION PILLS */}
          <div className="stf-pillrow">
            <button className={"stf-pill"+(collection==="All"?" on":"")} onClick={()=>setColl("All")}>
              All collections <span className="stf-pill-n">{docs.length}</span>
            </button>
            {STF_LIB_COLLECTIONS.map(c=>{
              const n = docs.filter(d=>d.collection===c.name).length;
              return (
                <button key={c.name} className={"stf-pill"+(collection===c.name?" on":"")} onClick={()=>setColl(c.name)}>
                  <Icon name={c.icon} size={14}/> {c.name} <span className="stf-pill-n">{n}</span>
                </button>
              );
            })}
          </div>

          {/* SECONDARY FILTERS: search + type + who */}
          <div className="stf-filterbar">
            <label className="stf-libsearch">
              <Icon name="search" size={16}/>
              <input value={localSearch} onChange={e=>setLocalSearch(e.target.value)} placeholder="Search documents…"/>
            </label>
            <div className="stf-selwrap">
              <Icon name="file" size={14}/>
              <select value={ftype} onChange={e=>setFtype(e.target.value)}>
                {types.map(t=><option key={t} value={t}>{t==="All"?"Any file type":t}</option>)}
              </select>
              <Icon name="chevronDown" size={14}/>
            </div>
            <div className="stf-selwrap">
              <Icon name="users" size={14}/>
              <select value={who} onChange={e=>setWho(e.target.value)}>
                <option value="All">Anyone can see</option>
                {STF_AUDIENCES.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
              <Icon name="chevronDown" size={14}/>
            </div>
            {anyFilter && <button className="stf-chip" onClick={()=>{setColl("All");setFtype("All");setWho("All");setLocalSearch("");}}>Reset</button>}
          </div>
        </React.Fragment>
      )}

      {/* RESULTS */}
      {results.length>0 ? (
        <div className="stf-list stf-lib-list">
          <div className="stf-lib-head">
            <span>Document</span><span className="stf-col">Collection</span><span className="stf-col">Who can see it</span><span className="stf-col">Updated</span><span className="stf-col">Owner</span><span></span>
          </div>
          {results.map(d=>{
            const person = d.from ? personById(d.from) : null;
            return (
              <button className="stf-librow" key={d.id} onClick={()=>setOpenId(d.id)}>
                <span className="stf-file">
                  <DocIcon type={d.type}/>
                  <span className="stf-file-main">
                    <span className="stf-file-name">{d.name}</span>
                    {d.fresh
                      ? <span className="stf-filed-as"><Icon name="check" size={12}/> Just filed{person?` · from ${person.name}`:""}</span>
                      : <span className="stf-lib-sub">{d.size}{d.source?` · saved from ${(STF_SOURCES[d.source]||{}).label}`:""}</span>}
                  </span>
                </span>
                <span className="stf-col stf-meta stf-lib-coll">{d.collection}</span>
                <span className="stf-col"><StfWhoBadge audience={d.audience}/></span>
                <span className="stf-col stf-meta">{d.updated}</span>
                <span className="stf-col stf-meta">{d.owner}</span>
                <Icon name="chevron" size={16}/>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="atlas-empty stf-empty">
          <Icon name="search" size={28}/>
          <h3>Nothing matches those filters.</h3>
          <p>Try a different collection, file type, or clear the filters to see everything.</p>
          <Btn kind="secondary" size="sm" onClick={()=>{setColl("All");setFtype("All");setWho("All");setLocalSearch("");}}>Clear filters</Btn>
        </div>
      )}
    </div>
  );
}

function StfLibraryDoc({doc, onBack}){
  const person = doc.from ? personById(doc.from) : null;
  const coll = STF_LIB_COLLECTIONS.find(c=>c.name===doc.collection);
  const related = STF_LIBRARY_SEED.filter(d=>d.collection===doc.collection && d.id!==doc.id).slice(0,4);
  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Library</button>
      <div className="mdoc-detail">
        <div className="mdoc-reader">
          <div className="mdoc-doc-head">
            <DocIcon type={doc.type}/>
            <StfWhoBadge audience={doc.audience}/>
          </div>
          <h1 className="mdoc-h1">{doc.name}</h1>
          <p className="mdoc-lead">Filed under {doc.collection}. {person?`Sent by ${person.name}, `:""}owned by {doc.owner}.</p>
          <div className="mdoc-actions">
            <Btn kind="primary" size="sm"><Icon name="download" size={16}/> Download {doc.type}</Btn>
            <Btn kind="secondary" size="sm">Open in browser</Btn>
          </div>
          <div className="mdoc-preview">
            <StfDocBody body={doc.body} footLine={`Future Partners · Library · ${doc.name} · Updated ${doc.updated}`}/>
          </div>
        </div>
        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">Document details</span>
            <dl className="mem-facts">
              <div><dt>Type</dt><dd>{doc.type}</dd></div>
              <div><dt>Collection</dt><dd>{doc.collection}</dd></div>
              <div><dt>Who can see it</dt><dd>{audLabel(doc.audience)}</dd></div>
              <div><dt>Owner</dt><dd>{doc.owner}</dd></div>
              <div><dt>Updated</dt><dd>{doc.updated}</dd></div>
              {doc.size && <div><dt>Size</dt><dd>{doc.size}</dd></div>}
              {doc.source && <div><dt>Came from</dt><dd>{(STF_SOURCES[doc.source]||{}).label}</dd></div>}
            </dl>
          </div>
          {related.length>0 && (
            <div className="mem-panel">
              <span className="mem-panel-h">More in {coll?coll.name:doc.collection}</span>
              <div className="mdoc-related">
                {related.map(r=>(
                  <button className="mdoc-relrow" key={r.id} onClick={()=>{}} disabled>
                    <DocIcon type={r.type}/>
                    <span className="mdoc-relrow-title">{r.name}</span>
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

/* =====================================================================
   3 · CONTACts — a light address book with relationship history.
   People · Organisations. Filter people by type & status; open a person
   to see their details, projects, files and a history of contact.
   ===================================================================== */
function StfContacts({jumpTo, onConsumeJump}){
  const [tab, setTab]       = useState("people"); // people | orgs
  const [openPerson, setOpenPerson] = useState(null);
  const [openOrg, setOpenOrg]       = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType]     = useState("All");
  const [status, setStatus] = useState("All");

  /* the Desk can ask us to open a specific contact (a "going quiet" nudge) */
  useEffect(()=>{
    if(jumpTo){ setTab("people"); setOpenPerson(jumpTo); onConsumeJump && onConsumeJump(); }
  },[jumpTo]);

  if(openPerson){
    const c = STF_CONTACTS.find(x=>x.id===openPerson);
    return <StfPersonDetail c={c} onBack={()=>setOpenPerson(null)} onOrg={(name)=>{setOpenPerson(null); setOpenOrg(name); setTab("orgs");}}/>;
  }
  if(openOrg){
    const o = orgByName(openOrg);
    return <StfOrgDetail org={o} onBack={()=>setOpenOrg(null)} onPerson={(id)=>{setOpenOrg(null); setOpenPerson(id); setTab("people");}}/>;
  }

  /* filtered people */
  let people = STF_CONTACTS;
  if(type!=="All")   people = people.filter(c=>c.type===type);
  if(status!=="All") people = people.filter(c=>c.status===status);
  if(search.trim()){
    const q = search.trim().toLowerCase();
    people = people.filter(c=>(c.name+" "+c.org+" "+c.title+" "+(c.tags||[]).join(" ")).toLowerCase().includes(q));
  }

  return (
    <div className="stf-contacts">
      <div className="stf-team-head">
        <div className="mhome-head">
          <p className="eyebrow">Contacts</p>
          <h1 className="mhome-h1">People and organisations</h1>
          <p className="mhome-lead fp-lead">A shared address book for clients, funders, associates, partners and prospects — with each person's details, the projects they're linked to, and a history of when you last spoke.</p>
        </div>
        <div className="stf-import">
          <Btn kind="secondary" size="sm"><Icon name="download" size={16}/> Import from spreadsheet</Btn>
          <span className="stf-import-note">Seeded from your master contact sheet</span>
        </div>
      </div>

      {/* People · Organisations toggle */}
      <div className="stf-toggle">
        <button className={"stf-toggle-btn"+(tab==="people"?" on":"")} onClick={()=>setTab("people")}><Icon name="users" size={15}/> People <span className="stf-pill-n">{STF_CONTACTS.length}</span></button>
        <button className={"stf-toggle-btn"+(tab==="orgs"?" on":"")} onClick={()=>setTab("orgs")}><Icon name="globe" size={15}/> Organisations <span className="stf-pill-n">{STF_ORGS.length}</span></button>
      </div>

      {tab==="people" ? (
        <React.Fragment>
          {/* filters */}
          <div className="stf-filterbar">
            <label className="stf-libsearch">
              <Icon name="search" size={16}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search people, organisations…"/>
            </label>
            <div className="stf-selwrap">
              <Icon name="users" size={14}/>
              <select value={type} onChange={e=>setType(e.target.value)}>
                <option value="All">Any type</option>
                {STF_CONTACT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <Icon name="chevronDown" size={14}/>
            </div>
            <div className="stf-selwrap">
              <Icon name="compass" size={14}/>
              <select value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="All">Any status</option>
                {STF_CONTACT_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <Icon name="chevronDown" size={14}/>
            </div>
            {(type!=="All"||status!=="All"||search.trim()) && <button className="stf-chip" onClick={()=>{setType("All");setStatus("All");setSearch("");}}>Reset</button>}
          </div>

          {people.length>0 ? (
            <div className="stf-list stf-people-list">
              <div className="stf-ppl-head">
                <span>Name</span><span className="stf-col">Organisation</span><span className="stf-col">Type</span><span className="stf-col">Status</span><span className="stf-col">Last contact</span><span></span>
              </div>
              {people.map(c=>(
                <button className="stf-pplrow" key={c.id} onClick={()=>setOpenPerson(c.id)}>
                  <span className="stf-ppl-name-cell">
                    <span className={"stf-av "+(c.fill||"fill-forest")}>{c.initials}</span>
                    <span className="stf-file-main">
                      <span className="stf-file-name">{c.name}</span>
                      <span className="stf-lib-sub">{c.title}</span>
                    </span>
                  </span>
                  <span className="stf-col stf-meta">{c.org}</span>
                  <span className="stf-col"><span className={"stf-typechip stf-type-"+c.type.replace(/[^a-z]+/gi,"").toLowerCase()}>{c.type}</span></span>
                  <span className="stf-col"><span className={"stf-statuschip"+(c.status==="Active"?" on":c.status==="Prospect"?" prospect":"")}>{c.status}</span></span>
                  <span className="stf-col stf-meta">{c.lastContact}</span>
                  <Icon name="chevron" size={16}/>
                </button>
              ))}
            </div>
          ) : (
            <div className="atlas-empty stf-empty">
              <Icon name="users" size={28}/>
              <h3>No one matches those filters.</h3>
              <p>Try a different type or status, or clear the filters.</p>
              <Btn kind="secondary" size="sm" onClick={()=>{setType("All");setStatus("All");setSearch("");}}>Clear filters</Btn>
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="stf-orggrid">
          {STF_ORGS.filter(o=>o.name!=="Future Partners").map(o=>{
            const n = contactsForOrg(o.name).length;
            return (
              <button className="stf-orgcard" key={o.name} onClick={()=>setOpenOrg(o.name)}>
                <span className="stf-org-ic"><Icon name="globe" size={20}/></span>
                <span className="stf-org-body">
                  <span className="stf-org-name">{o.name}</span>
                  <span className="stf-org-type">{o.type} · {o.region}</span>
                </span>
                <span className="stf-org-foot">
                  <span className="stf-org-stat">{n} contact{n===1?"":"s"}</span>
                  <span className="stf-org-stat">{o.cases.length} project{o.cases.length===1?"":"s"}</span>
                  <Icon name="chevron" size={16}/>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- person detail: details, org, projects, files, history ---------- */
/* Email at a glance — a CRM concept. In the live version this reads Kirsty's
   Outlook (Microsoft 365) via Microsoft Graph (metadata only, staff-only); here
   it's deterministic mock data so each contact shows a stable, believable overview. */
function stfEmailGlance(c){
  var id=(c.id||c.name||"x"), h=0; for(var i=0;i<id.length;i++) h=(h*31+id.charCodeAt(i))>>>0;
  var pick=function(arr,salt){ return arr[((h>>(salt||0))>>>0)%arr.length]; };
  var recencies=["Today","Yesterday","2 days ago","Last week","2 weeks ago","3 weeks ago","Last month"];
  var lastIdx = c.lead ? 0 : (h % recencies.length);
  var proj=(c.cases||[]).map(function(x){return caseById(x);}).filter(Boolean)[0];
  var ctx = proj ? proj.title.split(/[—:]/)[0].trim() : (c.org||"your work");
  var place = proj && proj.country ? proj.country.name : (c.location||"in-country");
  var second = c.type==="Funder/Donor" ? "Reporting timeline & milestones"
             : c.type==="Associate"    ? "Availability for the next assignment"
             :                            "Q2 invoice & progress note";
  return {
    last: recencies[lastIdx],
    quiet: lastIdx>=5,
    count: c.lead ? 0 : (6 + (h % 46)),
    dir: (h&1) ? "in" : "out",
    reply: pick(["within an hour","~2 hours","~4 hours","same day","next day","~2 days"],2),
    lastMet: pick(["12 May 2026","28 Apr 2026","6 Mar 2026","9 Feb 2026",null,null],5),
    subjects: [
      {s:"Re: "+ctx,            d:recencies[lastIdx],                            dir:(h&1)?"in":"out"},
      {s:second,                d:pick(["Last week","2 weeks ago","Apr 2026"],7),  dir:"out"},
      {s:"Field notes — "+place, d:pick(["Apr 2026","Mar 2026","Feb 2026"],11),     dir:"in"},
    ],
  };
}

function StfPersonDetail({c, onBack, onOrg}){
  if(!c) return null;
  const projects = (c.cases||[]).map(id=>caseById(id)).filter(Boolean).slice(0,4);
  /* a couple of plausibly-linked Library files (by collection / sector) */
  const linkedFiles = STF_LIBRARY_SEED.filter(d=>
    (c.type==="Associate" && d.collection==="Templates") ||
    (c.type!=="Associate" && d.collection==="Client deliverables") ||
    d.collection==="Brand & collateral"
  ).slice(0,3);
  const org = orgByName(c.org);

  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Contacts</button>

      <div className="stf-person-hero">
        <span className={"stf-av xl "+(c.fill||"fill-forest")}>{c.initials}</span>
        <div className="stf-person-hero-id">
          <h1 className="stf-person-hero-name">{c.name}</h1>
          <p className="stf-person-hero-role">{c.title}{c.org?` · ${c.org}`:""}</p>
          <div className="stf-person-hero-chips">
            <span className={"stf-typechip stf-type-"+c.type.replace(/[^a-z]+/gi,"").toLowerCase()}>{c.type}</span>
            <span className={"stf-statuschip"+(c.status==="Active"?" on":c.status==="Prospect"?" prospect":"")}>{c.status}</span>
            {(c.tags||[]).map(t=><span className="stf-tag" key={t}>{t}</span>)}
          </div>
        </div>
        <div className="stf-person-hero-actions">
          <a href={"mailto:"+c.email} className="stf-contact-btn"><Icon name="mail" size={15}/> Email</a>
          <a href={"tel:"+c.phone.replace(/\s/g,"")} className="stf-contact-btn ghost"><Icon name="phone" size={15}/> Call</a>
        </div>
      </div>

      {(function(){ var g=stfEmailGlance(c); return (
        <div className={"stf-email"+(g.quiet?" quiet":"")}>
          <div className="stf-email-head">
            <span className="stf-email-h"><Icon name="mail" size={16}/> Email activity</span>
            <span className="stf-email-src">Outlook · Microsoft 365 <span className="stf-email-preview">preview</span></span>
          </div>
          <div className="stf-email-stats">
            <div className="stf-email-stat"><span className="stf-email-n">{g.last}</span><span className="stf-email-l">{g.dir==="in"?"they emailed":"you emailed"}</span></div>
            <div className="stf-email-stat"><span className="stf-email-n">{g.count}</span><span className="stf-email-l">emails exchanged</span></div>
            <div className="stf-email-stat"><span className="stf-email-n">{g.reply}</span><span className="stf-email-l">typical reply</span></div>
            <div className="stf-email-stat"><span className="stf-email-n">{g.lastMet||"—"}</span><span className="stf-email-l">last meeting</span></div>
          </div>
          <div className="stf-email-threads">
            {g.subjects.map(function(s,i){ return (
              <div className="stf-email-thread" key={i}>
                <span className={"stf-email-dir "+s.dir}>{s.dir==="in"?"In":"Out"}</span>
                <span className="stf-email-subj">{s.s}</span>
                <span className="stf-email-when">{s.d}</span>
              </div>
            ); })}
          </div>
          {g.quiet && <div className="stf-email-quiet"><Icon name="clock" size={13}/> No email in a few weeks — might be worth a check-in.</div>}
          <span className="stf-email-note">Concept — in the live version this connects to Kirsty's Outlook (Microsoft 365) and shows real activity. Metadata only, staff-only.</span>
        </div>
      ); })()}

      <div className="mdoc-detail">
        <div className="mdoc-reader">
          {/* history of contact */}
          <span className="mem-sec-h">History of contact</span>
          <div className="stf-timeline">
            {(c.history||[]).map((h,i)=>(
              <div className="stf-tl-item" key={i}>
                <span className="stf-tl-dot"></span>
                <div className="stf-tl-body">
                  <span className="stf-tl-t">{h.t}</span>
                  <span className="stf-tl-d">{h.d}</span>
                </div>
              </div>
            ))}
            <button className="stf-tl-log"><Icon name="mail" size={14}/> Log contact</button>
          </div>

          {/* linked projects */}
          {projects.length>0 && (
            <React.Fragment>
              <span className="mem-sec-h">Linked projects</span>
              <div className="stf-list">
                {projects.map(p=>(
                  <div className="stf-wrow stf-projrow" key={p.id}>
                    <span className="stf-proj-stage">{(STAGE[p.stage]||{}).name||p.stage}</span>
                    <span className="stf-file-main">
                      <span className="stf-file-name">{p.title}</span>
                      <span className="stf-lib-sub">{p.client} · {p.country?p.country.name:""} · {p.year}</span>
                    </span>
                    <span className="stf-col stf-meta stf-projrow-region">{p.region}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}

          {/* linked files */}
          <span className="mem-sec-h">Linked files</span>
          <div className="stf-list">
            {linkedFiles.map(d=>(
              <div className="stf-wrow" key={d.id}>
                <DocIcon type={d.type}/>
                <span className="stf-file-main">
                  <span className="stf-file-name">{d.name}</span>
                  <span className="stf-lib-sub">{d.collection} · {audLabel(d.audience)}</span>
                </span>
                <span className="stf-col stf-meta">{d.updated}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">Contact details</span>
            <dl className="mem-facts">
              <div><dt>Email</dt><dd><a href={"mailto:"+c.email} className="stf-link">{c.email}</a></dd></div>
              <div><dt>Phone</dt><dd><a href={"tel:"+c.phone.replace(/\s/g,"")} className="stf-link">{c.phone}</a></dd></div>
              <div><dt>Organisation</dt><dd>{org && org.name!=="Future Partners" ? <button className="stf-link stf-linkbtn" onClick={()=>onOrg(c.org)}>{c.org}</button> : c.org}</dd></div>
              <div><dt>Type</dt><dd>{c.type}</dd></div>
              <div><dt>Status</dt><dd>{c.status}</dd></div>
              <div><dt>Location</dt><dd>{c.location}</dd></div>
              <div><dt>Last contact</dt><dd>{c.lastContact}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- organisation detail: its people + its projects ---------- */
function StfOrgDetail({org, onBack, onPerson}){
  if(!org) return null;
  const people   = contactsForOrg(org.name);
  const projects = (org.cases||[]).map(id=>caseById(id)).filter(Boolean);

  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Contacts</button>

      <div className="stf-person-hero">
        <span className="stf-org-ic lg"><Icon name="globe" size={26}/></span>
        <div className="stf-person-hero-id">
          <h1 className="stf-person-hero-name">{org.name}</h1>
          <p className="stf-person-hero-role">{org.type} · {org.region}</p>
          <div className="stf-person-hero-chips">
            <span className="stf-tag">{people.length} contact{people.length===1?"":"s"}</span>
            <span className="stf-tag">{projects.length} project{projects.length===1?"":"s"}</span>
          </div>
        </div>
      </div>

      <div className="mdoc-detail">
        <div className="mdoc-reader">
          <span className="mem-sec-h">People here</span>
          {people.length>0 ? (
            <div className="stf-list">
              {people.map(c=>(
                <button className="stf-wrow stf-orgppl" key={c.id} onClick={()=>onPerson(c.id)}>
                  <span className={"stf-av "+(c.fill||"fill-forest")}>{c.initials}</span>
                  <span className="stf-file-main">
                    <span className="stf-file-name">{c.name}</span>
                    <span className="stf-lib-sub">{c.title}</span>
                  </span>
                  <span className="stf-col stf-meta">{c.lastContact}</span>
                  <Icon name="chevron" size={15}/>
                </button>
              ))}
            </div>
          ) : <p className="stf-empty-inline">No contacts recorded here yet.</p>}

          {projects.length>0 && (
            <React.Fragment>
              <span className="mem-sec-h">Projects with {org.name}</span>
              <div className="stf-list">
                {projects.map(p=>(
                  <div className="stf-wrow stf-projrow" key={p.id}>
                    <span className="stf-proj-stage">{(STAGE[p.stage]||{}).name||p.stage}</span>
                    <span className="stf-file-main">
                      <span className="stf-file-name">{p.title}</span>
                      <span className="stf-lib-sub">{p.country?p.country.name:""} · {p.year}</span>
                    </span>
                    <span className="stf-col stf-meta stf-projrow-region">{p.region}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>

        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">Organisation</span>
            <dl className="mem-facts">
              <div><dt>Type</dt><dd>{org.type}</dd></div>
              <div><dt>Region</dt><dd>{org.region}</dd></div>
              <div><dt>Contacts</dt><dd>{people.length}</dd></div>
              <div><dt>Projects</dt><dd>{projects.length}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =====================================================================
   4 · WEBSITE GUIDE — doc cards → reader body (reuses .mdoc-doc)
   ===================================================================== */
function StfGuide({onClose}){
  const [openId, setOpenId] = useState(null);
  const doc = openId ? STF_GUIDE.find(r=>r.id===openId) : null;
  if(doc) return <StfGuideDoc doc={doc} onBack={()=>setOpenId(null)}/>;

  return (
    <div className="stf-guide">
      {onClose && <button className="mdoc-back" onClick={onClose}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Back</button>}
      <div className="mhome-head">
        <p className="eyebrow">Help · Website guide</p>
        <h1 className="mhome-h1">Website guide</h1>
        <p className="mhome-lead fp-lead">How this website actually works, in plain words — what it's built on, how to edit it, how to publish a change and undo one, the look and feel, and where the logins are kept. A living draft for Kirsty and the team.</p>
      </div>
      <div className="stf-rb-grid">
        {STF_GUIDE.map(r=>(
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

function StfGuideDoc({doc, onBack}){
  return (
    <div className="mdoc">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Website guide</button>
      <div className="mdoc-detail">
        <div className="mdoc-reader">
          <div className="mdoc-doc-head">
            <DocIcon type={doc.type}/>
            <span className="vis vis-draft">Draft</span>
          </div>
          <h1 className="mdoc-h1">{doc.title}</h1>
          <p className="mdoc-lead">{doc.summary}</p>
          <div className="mdoc-preview">
            <StfDocBody body={doc.body} footLine={`Future Partners · Website guide · ${doc.title} · Updated ${doc.updated} · DRAFT`}/>
          </div>
        </div>
        <aside className="mdoc-meta">
          <div className="mem-panel">
            <span className="mem-panel-h">In this guide</span>
            <div className="mdoc-related">
              {STF_GUIDE.map(r=>(
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
   FEATURE 1 · DIRECTOR'S DESK — Kirsty's morning command centre.
   Everything here derives from the file's own mock data so the numbers stay
   consistent with Incoming, Contacts and the active engagements.
   ===================================================================== */
function StfDesk({inbox, library, onSection, onContact, onNew, onAsk}){
  /* — derive the day's realities from existing data — */
  const needs    = inbox.filter(i=>i.status==="needs");
  const expiring = needs.filter(i=>i.expiresIn!=null);

  const active = STF_ACTIVE.map(a=>({...a, c:caseById(a.id)})).filter(a=>a.c);
  const overdueTotal = STF_RECEIVABLES.filter(r=>r.overdue).reduce((s,r)=>s+r.amount,0);
  const newEnquiries = 2;

  /* network pulse */
  const associates = PEOPLE.filter(p=>!p.lead && (p.id!=="greg"&&p.id!=="julie")).length;
  const countries  = new Set(active.map(a=>a.c.country && a.c.country.name).filter(Boolean)).size;

  /* the prioritised "needs you today" list — built from the data above */
  const actions = [
    {icon:"file",  title:"Nauru systems review — your sign-off", sub:"David sent it · due Friday", tag:"Due soon", tagCls:"due", onClick:()=>onSection("incoming")},
    {icon:"clock", title:`Invoice #056 — Nauru MoH · ${fmtNZD(31600)}`, sub:"12 days overdue · worth a chase", tag:"Overdue", tagCls:"over", onClick:()=>onSection("business")},
    {icon:"mail",  title:"Kōtui report — with MFAT for approval", sub:"James Tugaga · waiting 4 days", tag:"Chase", tagCls:"neutral", onClick:()=>onContact("c-james-oxfam")},
    {icon:"download", title:`${needs.length} file${needs.length===1?"":"s"} to file in Incoming`, sub:expiring.length?`${expiring.length} from WeTransfer — link expiring`:"Waiting to be filed", tag:expiring.length?"Expiring":"To file", tagCls:expiring.length?"due":"neutral", onClick:()=>onSection("incoming")},
    {icon:"users", title:"MFAT — no contact in 5 weeks", sub:"Tepaeru Herrmann · relationship going quiet", tag:"Nudge", tagCls:"neutral", onClick:()=>onContact("c-tepaeru")},
    {icon:"globe", title:`${newEnquiries} new enquiries from the website`, sub:"Fred Hollows · WWF New Zealand", tag:"New", tagCls:"info", onClick:()=>onContact("c-fredhollows")},
  ];

  const pulse = [
    {n:active.length, l:"Live engagements", sub:"on the cycle"},
    {n:actions.filter(a=>a.tagCls==="due"||a.tagCls==="over").length, l:"Need you today", sub:"time-sensitive"},
    {n:newEnquiries, l:"New enquiries", sub:"from the website"},
    {n:fmtNZD(overdueTotal), l:"Overdue", sub:"across 2 invoices", warn:true},
  ];

  const today = "Sunday · 14 June 2026";

  return (
    <div className="stf-desk">
      {/* header / greeting */}
      <div className="stf-desk-head">
        <div className="stf-desk-greet">
          <div className="stf-desk-greet-row">
            <p className="eyebrow">Director's Desk</p>
            <StfOwnerChip/>
          </div>
          <h1 className="mhome-h1">Kia ora, Kirsty</h1>
          <p className="mhome-lead fp-lead">Here's your desk this morning. <span className="stf-desk-date">{today}</span></p>
        </div>
        <button className="stf-newbtn" onClick={onNew}><span className="stf-newbtn-plus">+</span> New engagement</button>
      </div>

      {onAsk && typeof StfDeskAsk!=="undefined" && <StfDeskAsk onAsk={onAsk}/>}

      <StfAspirational/>

      {/* pulse tiles */}
      <div className="stf-pulse">
        {pulse.map((p,i)=>(
          <div className={"stf-pulse-tile"+(p.warn?" warn":"")} key={i}>
            <span className="stf-pulse-n">{p.n}</span>
            <span className="stf-pulse-l">{p.l}</span>
            <span className="stf-pulse-sub">{p.sub}</span>
          </div>
        ))}
      </div>

      <div className="stf-desk-grid">
        {/* needs you today */}
        <div className="stf-desk-col">
          <span className="mem-sec-h">Needs you today</span>
          <div className="stf-actions">
            {actions.map((a,i)=>(
              <button className="stf-action" key={i} onClick={a.onClick}>
                <span className={"stf-action-ic "+a.tagCls}><Icon name={a.icon} size={17}/></span>
                <span className="stf-action-body">
                  <span className="stf-action-t">{a.title}</span>
                  <span className="stf-action-s">{a.sub}</span>
                </span>
                <span className={"stf-utag "+a.tagCls}>{a.tag}</span>
                <Icon name="chevron" size={15}/>
              </button>
            ))}
          </div>
        </div>

        {/* live engagements */}
        <div className="stf-desk-col">
          <span className="mem-sec-h">Live engagements, on the cycle</span>
          <div className="stf-list stf-engs">
            {active.map(a=>{
              const stage = STAGE[a.c.stage]||{};
              return (
                <div className="stf-eng" key={a.id}>
                  <div className="stf-eng-top">
                    <span className="stf-eng-title">{a.c.title}</span>
                    <span className="stf-eng-stage">{stage.name}</span>
                  </div>
                  <span className="stf-eng-next"><Icon name="arrow" size={13}/> {a.milestone}</span>
                  <StfCycleDots stageKey={a.c.stage}/>
                </div>
              );
            })}
          </div>
          <p className="stf-netpulse">
            <Icon name="globe" size={14}/> Network pulse — {associates} associates engaged · {countries} countries active this week
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 2 · BUSINESS HEALTH — a calm, owner-only financial view.
   Mock NZD figures; receivables reuse real orgs; bars are plain CSS.
   ===================================================================== */
function StfBusiness(){
  const invoiced  = 412800;
  const outstanding = STF_RECEIVABLES.reduce((s,r)=>s+r.amount,0);
  const overdue   = STF_RECEIVABLES.filter(r=>r.overdue).reduce((s,r)=>s+r.amount,0);
  const pipeline  = 286000;

  const metrics = [
    {n:fmtNZD(invoiced), l:"Invoiced this quarter", sub:"Apr–Jun FY26"},
    {n:fmtNZD(outstanding), l:"Outstanding (owed)", sub:`${STF_RECEIVABLES.length} invoices`},
    {n:fmtNZD(overdue), l:"Overdue", sub:"needs chasing", warn:true},
    {n:fmtNZD(pipeline), l:"Pipeline (weighted)", sub:"proposals out"},
  ];

  return (
    <div className="stf-biz">
      <div className="stf-desk-head">
        <div className="stf-desk-greet">
          <div className="stf-desk-greet-row">
            <p className="eyebrow">Business health</p>
            <StfOwnerChip/>
          </div>
          <h1 className="mhome-h1">Invoices, money owed and utilisation</h1>
          <p className="mhome-lead fp-lead">A calm read on the numbers that matter — what's been invoiced, what's owed, who's busy, and whether projects are on budget. A concept view; figures here are illustrative.</p>
        </div>
      </div>

      <StfAspirational/>

      {/* top metrics */}
      <div className="stf-pulse">
        {metrics.map((m,i)=>(
          <div className={"stf-pulse-tile"+(m.warn?" warn":"")} key={i}>
            <span className="stf-pulse-n">{m.n}</span>
            <span className="stf-pulse-l">{m.l}</span>
            <span className="stf-pulse-sub">{m.sub}</span>
          </div>
        ))}
      </div>

      <div className="stf-desk-grid">
        {/* receivables */}
        <div className="stf-desk-col">
          <span className="mem-sec-h">Receivables — what's owed</span>
          <div className="stf-list">
            <div className="stf-recv-head">
              <span>Invoice</span><span className="stf-col">Client</span><span className="stf-col stf-num">Amount</span><span className="stf-col stf-num">Age</span><span className="stf-col stf-num">Status</span>
            </div>
            {STF_RECEIVABLES.map(r=>(
              <div className="stf-recv" key={r.id}>
                <span className="stf-recv-id">#{r.id}</span>
                <span className="stf-col stf-recv-org">{r.org}</span>
                <span className="stf-col stf-num stf-recv-amt">{fmtNZD(r.amount)}</span>
                <span className="stf-col stf-num stf-meta">{r.age}d</span>
                <span className="stf-col stf-num">
                  <span className={"stf-bizflag "+(r.overdue?"over":"ok")}>{r.overdue?"Overdue":"Open"}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* utilisation */}
        <div className="stf-desk-col">
          <span className="mem-sec-h">Associate utilisation</span>
          <div className="stf-list stf-utilbox">
            {STF_UTIL.map(u=>{
              const p = personById(u.pid);
              const band = u.util>=85 ? "high" : u.util<45 ? "low" : "ok";
              return (
                <div className="stf-util" key={u.pid}>
                  <span className={"stf-av "+(p&&p.fill||"fill-forest")}>{p?p.initials:"—"}</span>
                  <div className="stf-util-body">
                    <div className="stf-util-row">
                      <span className="stf-util-name">{p?p.name:u.pid}</span>
                      <span className={"stf-util-pct "+band}>{u.util}%</span>
                    </div>
                    <div className="stf-bar"><span className={"stf-bar-fill "+band} style={{width:u.util+"%"}}/></div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="stf-netpulse"><Icon name="users" size={14}/> Aim for 60–85% — over is a burnout risk, under is bench time.</p>
        </div>
      </div>

      {/* project margins */}
      <span className="mem-sec-h">Project margins — budget vs spent</span>
      <div className="stf-margins">
        {STF_MARGINS.map(m=>{
          const c = caseById(m.id)||{};
          const pct = Math.round(m.spent/m.budget*100);
          const risk = pct>=95;
          const left = m.budget - m.spent;
          return (
            <div className={"stf-margin"+(risk?" risk":"")} key={m.id}>
              <div className="stf-margin-top">
                <span className="stf-margin-title">{c.title||m.id}</span>
                <span className={"stf-bizflag "+(risk?"over":"ok")}>{risk?"At risk":"On track"}</span>
              </div>
              <div className="stf-bar lg"><span className={"stf-bar-fill "+(risk?"high":"ok")} style={{width:Math.min(100,pct)+"%"}}/></div>
              <div className="stf-margin-foot">
                <span>{fmtNZD(m.spent)} of {fmtNZD(m.budget)} · {pct}%</span>
                <span className="stf-margin-left">{fmtNZD(left)} left</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================================
   FEATURE 3 · NEW ENGAGEMENT — "day-one structure, zero setup".
   A light, inert form + a preview of everything that gets auto-built.
   ===================================================================== */
function StfNewEngagement({onBack}){
  const [name, setName]   = useState("");
  const [org, setOrg]     = useState("");
  const [sector, setSec]  = useState(SECTORS[0]);
  const [region, setReg]  = useState(REGIONS[0]);
  const [lead, setLead]   = useState("kirsty");

  const deliverables = ["Inception report","Work plan & schedule","Stakeholder map","Risk register","Final report"];
  const compliance   = ["Safeguarding declaration","Conflict-of-interest checks","Health, safety & travel sign-off"];

  return (
    <div className="stf-newengage">
      <button className="mdoc-back" onClick={onBack}><Icon name="arrow" size={15} style={{transform:"rotate(180deg)"}}/> Back to the desk</button>

      <div className="stf-desk-greet" style={{marginBottom:"20px"}}>
        <div className="stf-desk-greet-row">
          <p className="eyebrow">New engagement</p>
          <StfOwnerChip/>
        </div>
        <h1 className="mhome-h1">Set up a new project</h1>
        <p className="mhome-lead fp-lead">Tell us the basics. The moment you create it, Future Partners builds out the whole engagement for you — the cycle, the deliverables, the team, the folders and the compliance checks — so you start with structure, not a blank page.</p>
      </div>

      <div className="stf-ne-grid">
        {/* the light form */}
        <div className="mem-panel stf-ne-form">
          <span className="mem-panel-h">The basics</span>
          <div className="stf-fields">
            <label className="stf-field">
              <span>Engagement name</span>
              <input className="stf-input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Tonga health systems review"/>
            </label>
            <label className="stf-field">
              <span>Client / organisation</span>
              <input className="stf-input" value={org} onChange={e=>setOrg(e.target.value)} placeholder="e.g. MFAT · Manatū Aorere" list="stf-ne-orgs"/>
              <datalist id="stf-ne-orgs">{CLIENTS.map(c=><option key={c} value={c}/>)}</datalist>
            </label>
            <div className="stf-field-row">
              <label className="stf-field">
                <span>Sector</span>
                <div className="stf-select"><Icon name="compass" size={15}/>
                  <select value={sector} onChange={e=>setSec(e.target.value)}>{SECTORS.map(s=><option key={s} value={s}>{s}</option>)}</select>
                  <Icon name="chevronDown" size={15}/>
                </div>
              </label>
              <label className="stf-field">
                <span>Region</span>
                <div className="stf-select"><Icon name="globe" size={15}/>
                  <select value={region} onChange={e=>setReg(e.target.value)}>{REGIONS.map(r=><option key={r} value={r}>{r}</option>)}</select>
                  <Icon name="chevronDown" size={15}/>
                </div>
              </label>
            </div>
            <label className="stf-field">
              <span>Lead</span>
              <div className="stf-select"><Icon name="users" size={15}/>
                <select value={lead} onChange={e=>setLead(e.target.value)}>{PEOPLE.filter(p=>p.id!=="greg"&&p.id!=="julie").map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <Icon name="chevronDown" size={15}/>
              </div>
            </label>
          </div>
          <div className="stf-ne-actions">
            <Btn kind="secondary" size="sm" onClick={onBack}>Cancel</Btn>
            <Btn kind="primary" size="sm" arrow onClick={onBack}>Create engagement</Btn>
          </div>
          <span className="stf-ne-note"><Icon name="shield" size={13}/> Concept — nothing is saved. Creating it would scaffold everything on the right.</span>
        </div>

        {/* what we'll set up for you */}
        <div className="stf-ne-preview">
          <span className="mem-panel-h">What we'll set up for you</span>

          <div className="stf-ne-block">
            <span className="stf-ne-blk-h"><Icon name="compass" size={15}/> Project cycle — starts at Scope</span>
            <div className="stf-list">
              <div className="stf-eng" style={{borderTop:"none"}}>
                <StfCycleDots stageKey="scope"/>
                <span className="stf-eng-next" style={{marginTop:"8px"}}>The 7-stage cycle, initialised — first milestone lands in Scope.</span>
              </div>
            </div>
          </div>

          <div className="stf-ne-cols">
            <div className="stf-ne-block">
              <span className="stf-ne-blk-h"><Icon name="check" size={15}/> Deliverable checklist</span>
              <ul className="stf-ne-checklist">
                {deliverables.map(d=><li key={d}><span className="stf-ne-box"/>{d}</li>)}
              </ul>
            </div>
            <div className="stf-ne-block">
              <span className="stf-ne-blk-h"><Icon name="users" size={15}/> Team slots</span>
              <ul className="stf-ne-slots">
                <li><span className={"stf-av "+(personById(lead)&&personById(lead).fill||"fill-forest")}>{personById(lead)?personById(lead).initials:"—"}</span> {personById(lead)?personById(lead).name:"Lead"} <span className="stf-tag">Lead</span></li>
                <li><span className="stf-av stf-av-empty">+</span> Associate to assign</li>
                <li><span className="stf-av stf-av-empty">+</span> Associate to assign</li>
              </ul>
            </div>
          </div>

          <div className="stf-ne-cols">
            <div className="stf-ne-block">
              <span className="stf-ne-blk-h"><Icon name="folder" size={15}/> Library folders</span>
              <ul className="stf-ne-folders">
                {STF_COLLECTIONS.map(c=><li key={c}><Icon name="folder" size={13}/> {c}</li>)}
              </ul>
            </div>
            <div className="stf-ne-block">
              <span className="stf-ne-blk-h"><Icon name="shield" size={15}/> Compliance queued</span>
              <ul className="stf-ne-compliance">
                {compliance.map(c=><li key={c}><Icon name="clock" size={13}/> {c} <span className="stf-utag neutral">Queued</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StaffSpace });
