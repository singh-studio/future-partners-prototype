/* app.jsx — router, contact modal, mount */

function ContactModal({open, onClose}){
  const [sent, setSent] = useState(false);
  useEffect(()=>{ if(open){ setSent(false); const k=(e)=>e.key==="Escape"&&onClose(); window.addEventListener("keydown",k); return ()=>window.removeEventListener("keydown",k);} },[open]);
  if(!open) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="Close"><Icon name="x"/></button>
        {!sent ? (
          <>
            <p className="eyebrow">Work with us</p>
            <h3 className="modal-h">Tell us about the problem you're trying to solve.</h3>
            <p className="modal-sub">We'll come back to you with a sensible first step — no surprises. Kirsty is the first point of contact for every enquiry.</p>
            <form className="modal-form" onSubmit={(e)=>{e.preventDefault();
              const f=new FormData(e.target);
              const subject=`Enquiry from ${f.get("name")||"a partner"}${f.get("org")?" · "+f.get("org"):""}`;
              const body=`Name: ${f.get("name")||""}\nOrganisation: ${f.get("org")||""}\nEmail: ${f.get("email")||""}\nProject cycle stage: ${f.get("stage")||""}\n\n${f.get("detail")||""}`;
              window.location.href=`mailto:hello@futurepartners.co.nz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              setSent(true);
            }}>
              <div className="mf-row">
                <label className="mf-field"><span>Your name</span><input name="name" required placeholder="Name"/></label>
                <label className="mf-field"><span>Organisation</span><input name="org" placeholder="Department, agency or NGO"/></label>
              </div>
              <label className="mf-field"><span>Email</span><input name="email" type="email" required placeholder="you@organisation.org"/></label>
              <label className="mf-field"><span>Where are you in the project cycle?</span>
                <select name="stage" defaultValue=""><option value="" disabled>Choose a stage…</option>
                  {CYCLE.map(c=><option key={c.key}>{c.verb}</option>)}<option>Not sure yet</option></select>
              </label>
              <label className="mf-field"><span>What's the work?</span><textarea name="detail" rows="3" placeholder="A few lines about the programme, country and timing."></textarea></label>
              <Btn kind="primary" size="lg" arrow type="submit">Send enquiry</Btn>
              <p className="mf-note meta">Opens your email to Kirsty at hello@futurepartners.co.nz — or call +64 21 067 2680.</p>
            </form>
          </>
        ) : (
          <div className="modal-sent">
            <span className="modal-tick"><Icon name="check" size={30}/></span>
            <h3 className="modal-h">Thank you — your email is ready to send.</h3>
            <p className="modal-sub">We've opened a message to Kirsty with your details. Send it and we'll reply within two working days — no surprises.</p>
            <Btn kind="secondary" onClick={onClose}>Close</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function Placeholder({name}){
  return <main className="wrap" style={{padding:"120px 40px",minHeight:"60vh"}}>
    <p className="eyebrow">Coming up</p><h1 className="fp-h1">{name}</h1>
    <p className="fp-lead">This view is being built.</p><Btn kind="secondary" arrow to="/">Back home</Btn></main>;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "colourMood": "light",
  "heroLayout": "split",
  "cardStyle": "feature",
  "corners": "friendly"
}/*EDITMODE-END*/;

function FPTweaks({t, setTweak}){
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Colour mood" />
      <TweakRadio label="Home mood" value={t.colourMood}
        options={["light","deep"]}
        onChange={(v)=>setTweak("colourMood", v)} />
      <TweakSection label="Hero" />
      <TweakRadio label="Layout" value={t.heroLayout}
        options={["split","centred"]}
        onChange={(v)=>setTweak("heroLayout", v)} />
      <TweakSection label="Case studies" />
      <TweakRadio label="Featured cards" value={t.cardStyle}
        options={["feature","uniform"]}
        onChange={(v)=>setTweak("cardStyle", v)} />
      <TweakSection label="Detailing" />
      <TweakRadio label="Corners" value={t.corners}
        options={["friendly","crisp"]}
        onChange={(v)=>setTweak("corners", v)} />
    </TweaksPanel>
  );
}

function App(){
  const route = useRoute();
  const [contact, setContact] = useState(false);
  const onContact = ()=>setContact(true);
  const has = (n)=>typeof window[n]==="function";
  const hasTweaks = typeof useTweaks==="function";
  const [t, setTweak] = hasTweaks ? useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, ()=>{}];

  useEffect(()=>{
    const r = document.documentElement;
    r.dataset.mood = t.colourMood;
    r.dataset.hero = t.heroLayout;
    r.dataset.corners = t.corners;
  },[t.colourMood, t.heroLayout, t.corners]);

  let view;
  if(route.path==="/" ) view = has("Home") ? <Home onContact={onContact} t={t}/> : <Placeholder name="Home"/>;
  else if(route.path==="/atlas") view = has("Atlas") ? <Atlas onContact={onContact}/> : <Placeholder name="Case study atlas"/>;
  else if(route.parts[0]==="case") view = has("CaseStudy") ? <CaseStudy id={route.parts[1]} onContact={onContact}/> : <Placeholder name="Case study"/>;
  else if(route.parts[0]==="people" && route.parts[1]) view = has("AssociateProfile") ? <AssociateProfile id={route.parts[1]} onContact={onContact}/> : <Placeholder name="Associate"/>;
  else if(route.parts[0]==="people") view = has("People") ? <PeopleView onContact={onContact}/> : <Placeholder name="People & associates"/>;
  else if(route.path==="/members") view = has("Members") ? <Members onContact={onContact}/> : <Placeholder name="Members library"/>;
  else if(route.parts[0]==="news" && route.parts[1]) view = has("NewsArticle") ? <NewsArticle id={route.parts[1]} onContact={onContact}/> : <Placeholder name="Article"/>;
  else if(route.path==="/news") view = has("NewsView") ? <NewsView onContact={onContact}/> : <Placeholder name="News & insights"/>;
  else if(route.path==="/services") view = has("ServicesView") ? <ServicesView onContact={onContact}/> : <Placeholder name="Services"/>;
  else if(route.path==="/impact") view = has("ImpactView") ? <ImpactView onContact={onContact}/> : <Placeholder name="Live impact"/>;
  else if(route.path==="/trust") view = has("TrustView") ? <TrustView onContact={onContact}/> : <Placeholder name="Trust & security"/>;
  else view = <Placeholder name="Not found"/>;

  const bareMembers = route.path==="/members" && has("Members"); // members handles its own chrome
  return (
    <>
      {!bareMembers && <Header route={route} onContact={onContact}/>}
      {view}
      <ContactModal open={contact} onClose={()=>setContact(false)}/>
      {hasTweaks && <FPTweaks t={t} setTweak={setTweak}/>}
    </>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
