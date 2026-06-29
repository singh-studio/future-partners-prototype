/* assistant.jsx — "Ask Future Partners": a natural-language content assistant for the
   staff space. CONCEPT/DEMO: it reads a plain-English request, proposes the exact change
   as a card, and (on confirm) shows it done. In a live version this would call the Claude
   API through the backend and write the change to the CMS. Responses here are deterministic
   and scripted on purpose — a demo should never stall, error, or surprise in front of Kirsty.
   Defines globals StfDeskAsk (the Desk command bar) + StfAssistant (the floating panel).
   Prefix for CSS: stfa-. */

/* example prompts shown on the Desk bar and the panel's empty state */
const STFA_SUGGESTIONS = [
  "Add a news post about the Samoa evaluation",
  "Update Greg Sherley's bio",
  "Mark the Nauru project as complete",
  "Add a case study for the Tuvalu fisheries review",
];

/* ---- light entity + topic extraction (just enough to feel like it understood) ---- */
/* fold case + diacritics so macrons in Pacific names (Kōtui, Manatū) match either way */
function stfaNorm(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function stfaFindPerson(text){
  const t = stfaNorm(text);
  return PEOPLE.find(p=>{
    const n = stfaNorm(p.name);
    if(t.includes(n)) return true;
    return n.split(/\s+/).some(part=>part.length>2 && t.includes(part));
  });
}
/* common words that appear in many project titles — too weak to match on */
const STFA_TITLE_STOP = new Set(["project","projects","review","reviews","evaluation","report","reports",
  "programme","program","partnership","management","development","support","national","regional","pacific",
  "through","across","strengthening","sector","plan","study","services"]);
function stfaFindCase(text){
  const t = stfaNorm(text);
  /* strong signal: the country is named in the request */
  const byCountry = CASES.find(c=>{
    const country = c.country ? stfaNorm(c.country.name) : "";
    return country && t.includes(country.split(/[ ·]/)[0]);
  });
  if(byCountry) return byCountry;
  /* weaker: a distinctive (non-filler) title word appears in the request */
  return CASES.find(c=>
    stfaNorm(c.title).split(/[^a-z]+/).some(w=>w.length>4 && !STFA_TITLE_STOP.has(w) && t.includes(w))
  );
}
function stfaTopic(text){
  const m = (text||"").match(/(?:about|for|on|titled|called|regarding)\s+(.+)$/i);
  let s = m ? m[1] : "";
  return s.replace(/^(the|a|an)\s+/i,"").replace(/["'.\s]+$/,"").trim();
}
function stfaSentence(s){ s=(s||"").trim(); return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
function stfaBioEdit(text){
  const m = (text||"").match(/(?:to mention|to say|to add|to note|to include|mention|add that)\s+(.+)$/i);
  if(m) return "Add — “"+stfaSentence(m[1].replace(/["'.\s]+$/,"").trim())+"”";
  return "Apply the edit you described";
}

/* interpret a request → a structured plan the panel renders + confirms, or null (fallback) */
function stfaInterpret(text){
  const t = (text||"").toLowerCase().trim();
  if(!t) return null;

  /* news post */
  if(/\b(news|post|article|announce|announcement|blog|publish a story)\b/.test(t)){
    const person = stfaFindPerson(text);
    const topic = stfaTopic(text);
    return {
      verb:"Create news post",
      intro:"I'll create a draft news post. Here's what I've filled in — publish it as-is or tweak it first.",
      fields:[
        {k:"Title", v: topic ? stfaSentence(topic) : "Untitled news post"},
        {k:"Date", v:"14 June 2026"},
        {k:"Author", v: person ? person.name : "Kirsty Burnett"},
        {k:"Category", v:"Published"},
        {k:"Status", v:"Draft — awaiting your review"},
      ],
      done:"Draft news post created. It stays a draft — nothing is public until you press publish.",
    };
  }
  /* update a bio */
  if(/\b(bio|biography|profile)\b/.test(t)){
    const person = stfaFindPerson(text);
    if(person) return {
      verb:"Update bio",
      intro:`I'll update ${person.name}'s profile. Here's the change drafted for your review.`,
      fields:[
        {k:"Person", v:person.name},
        {k:"Field", v:"Biography"},
        {k:"Change", v:stfaBioEdit(text)},
        {k:"Status", v:"Draft — awaiting your review"},
      ],
      done:`${person.name}'s bio updated as a draft. Review and publish when it reads right.`,
    };
  }
  /* mark a project complete / change status */
  if(/\b(complete|completed|finish|finished|done|close|closed|status|mark)\b/.test(t)){
    const c = stfaFindCase(text);
    if(c) return {
      verb:"Update project status",
      intro:"I'll update this project's status. Confirm and I'll make the change everywhere it appears.",
      fields:[
        {k:"Project", v:c.title},
        {k:"Client", v:c.client},
        {k:"New status", v: /complete|finish|done|close/.test(t) ? "Complete" : "Updated"},
        {k:"Stage", v:(STAGE[c.stage]||{}).name||c.stage},
      ],
      done:`“${c.title}” marked complete. The change is reflected wherever this project shows.`,
    };
  }
  /* add a case study */
  if(/\b(case study|case-study|project page|portfolio)\b/.test(t) || /\badd (a )?(new )?project\b/.test(t)){
    const c = stfaFindCase(text);
    const topic = stfaTopic(text);
    return {
      verb:"Add case study",
      intro:"I'll start a new case study from what you've told me. I've pre-filled what I can — the rest is ready for you to write.",
      fields:[
        {k:"Title", v: c ? c.title : stfaSentence(topic||"New case study")},
        {k:"Client", v: c ? c.client : "To add"},
        {k:"Sector", v: c ? ((c.sectors||[])[0]||"To add") : "To add"},
        {k:"Region", v: c ? c.region : "To add"},
        {k:"Status", v:"Draft — body ready for you to write"},
      ],
      done:"New case study started as a draft. Open it to add the full write-up, then publish.",
    };
  }
  /* edit a site detail (contact email, a page line, the footer) */
  if(/\b(email|phone|contact|address|footer|trust page|change the|edit the|update the)\b/.test(t)){
    const topic = stfaTopic(text);
    return {
      verb:"Update site detail",
      intro:"I'll make that edit. Here's the change — confirm to apply it.",
      fields:[
        {k:"What", v: topic ? stfaSentence(topic) : "A site detail"},
        {k:"Status", v:"Draft — awaiting your review"},
      ],
      done:"Site detail updated as a draft change, ready to publish.",
    };
  }
  return null;
}

/* ---- the proposed-change card ---- */
function StfaPlanCard({plan, status, onConfirm, onCancel}){
  return (
    <div className={"stfa-plan"+(status!=="pending"?" "+status:"")}>
      <div className="stfa-plan-head">
        <span className="stfa-plan-verb"><Icon name={status==="done"?"check":"file"} size={14}/> {plan.verb}</span>
        {status==="done" && <span className="stfa-plan-state done">Done</span>}
        {status==="cancelled" && <span className="stfa-plan-state cancelled">Left as it was</span>}
      </div>
      {status==="pending" && <p className="stfa-plan-intro">{plan.intro}</p>}
      <dl className="stfa-plan-fields">
        {plan.fields.map((f,i)=>(
          <div className="stfa-plan-field" key={i}><dt>{f.k}</dt><dd>{f.v}</dd></div>
        ))}
      </dl>
      {status==="pending" && (
        <div className="stfa-plan-actions">
          <button className="stfa-btn ghost" onClick={onCancel}>Cancel</button>
          <button className="stfa-btn primary" onClick={onConfirm}><Icon name="check" size={15}/> Confirm &amp; apply</button>
        </div>
      )}
    </div>
  );
}

/* ---- the Desk command bar (prominent entry point on the Director's Desk) ---- */
function StfDeskAsk({onAsk}){
  const [text, setText] = useState("");
  const submit = ()=>{ const v=text.trim(); if(!v) return; onAsk(v); setText(""); };
  return (
    <div className="stfa-ask">
      <div className="stfa-ask-bar">
        <span className="stfa-ask-ic"><Icon name="spark" size={18}/></span>
        <input className="stfa-ask-input" value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter") submit(); }}
          placeholder="Tell me what to change — “add a news post”, “update a bio”, “mark a project complete”…"/>
        <button className="stfa-ask-go" onClick={submit} aria-label="Ask"><Icon name="send" size={16}/></button>
      </div>
      <div className="stfa-ask-chips">
        {STFA_SUGGESTIONS.map(s=>(
          <button className="stfa-ask-chip" key={s} onClick={()=>onAsk(s)}>{s}</button>
        ))}
      </div>
      <span className="stfa-ask-note"><Icon name="spark" size={12}/> Concept — in a live version, this makes the change for real through the website's content tool.</span>
    </div>
  );
}

/* ---- the floating bubble + slide-out panel (persists across staff tabs) ---- */
function StfAssistant({open, showFab, onOpen, onClose, seed}){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);
  const seedRef = useRef(0);

  const respondTo = (text)=>{
    setMessages(prev=>[...prev, {role:"user", text}]);
    setThinking(true);
    setTimeout(()=>{
      const plan = stfaInterpret(text);
      setThinking(false);
      setMessages(prev=> plan
        ? [...prev, {role:"assistant", plan, status:"pending"}]
        : [...prev, {role:"assistant", text:"I can make content changes for you — try things like “add a news post about the Nauru project”, “update David Angelson's bio”, “mark the Kōtui evaluation complete”, or “add a case study for the Tuvalu fisheries review”."}]);
    }, 640);
  };

  /* seed from the Desk command bar (a {text, n} signal) */
  useEffect(()=>{
    if(seed && seed.n && seed.n!==seedRef.current){ seedRef.current = seed.n; respondTo(seed.text); }
  },[seed]);

  /* autoscroll + esc-to-close */
  useEffect(()=>{ if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; },[messages, thinking, open]);
  useEffect(()=>{
    const onKey=(e)=>{ if(e.key==="Escape") onClose(); };
    if(open) window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  },[open, onClose]);

  const submit = ()=>{ const v=input.trim(); if(!v) return; respondTo(v); setInput(""); };

  const resolvePlan = (idx, action)=>{
    setMessages(prev=>{
      const target = prev[idx];
      const next = prev.map((m,i)=> i===idx ? {...m, status:action} : m);
      if(action==="done" && target && target.plan) next.push({role:"assistant", text: target.plan.done || "Done."});
      else if(action==="cancelled") next.push({role:"assistant", text:"No problem — I've left it as it was."});
      return next;
    });
  };

  return (
    <React.Fragment>
      {!open && showFab && (
        <button className="stfa-fab" onClick={onOpen} aria-label="Open the assistant">
          <Icon name="spark" size={20}/> <span className="stfa-fab-label">Ask</span>
        </button>
      )}
      {open && (
        <div className="stfa-panel" role="dialog" aria-label="Content assistant">
          <header className="stfa-head">
            <span className="stfa-head-id">
              <span className="stfa-head-ic"><Icon name="spark" size={15}/></span> Assistant
              <span className="stfa-badge">Concept</span>
            </span>
            <button className="stfa-head-x" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button>
          </header>

          <div className="stfa-body" ref={bodyRef}>
            {messages.length===0 && !thinking && (
              <div className="stfa-empty">
                <span className="stfa-empty-ic"><Icon name="spark" size={26}/></span>
                <p className="stfa-empty-h">Tell me what you'd like to change.</p>
                <p className="stfa-empty-p">I can add news posts, update bios and case studies, mark projects complete, and edit site details — in plain English.</p>
                <div className="stfa-empty-chips">
                  {STFA_SUGGESTIONS.map(s=><button className="stfa-chip" key={s} onClick={()=>respondTo(s)}>{s}</button>)}
                </div>
              </div>
            )}

            {messages.map((m,i)=> m.role==="user"
              ? <div className="stfa-msg user" key={i}><span className="stfa-bubble">{m.text}</span></div>
              : <div className="stfa-msg bot" key={i}>
                  <span className="stfa-ava"><Icon name="spark" size={13}/></span>
                  <div className="stfa-bot-body">
                    {m.text && <span className="stfa-bubble bot">{m.text}</span>}
                    {m.plan && <StfaPlanCard plan={m.plan} status={m.status}
                      onConfirm={()=>resolvePlan(i,"done")} onCancel={()=>resolvePlan(i,"cancelled")}/>}
                  </div>
                </div>
            )}

            {thinking && (
              <div className="stfa-msg bot">
                <span className="stfa-ava"><Icon name="spark" size={13}/></span>
                <span className="stfa-typing"><i></i><i></i><i></i></span>
              </div>
            )}
          </div>

          <div className="stfa-foot">
            <div className="stfa-inputbar">
              <input className="stfa-input" value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter") submit(); }}
                placeholder="Ask me to change something…"/>
              <button className="stfa-send" onClick={submit} aria-label="Send"><Icon name="send" size={16}/></button>
            </div>
            <span className="stfa-foot-note">Concept — a live version connects to the Claude API through the backend and updates your content tool. Nothing here is saved.</span>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

Object.assign(window, { StfDeskAsk, StfAssistant });
