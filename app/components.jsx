/* components.jsx — shared UI for the Field Atlas prototype */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------------- hash router ---------------- */
function useRoute(){
  const parse = () => {
    const h = (location.hash || "#/").replace(/^#/, "");
    const parts = h.split("/").filter(Boolean); // ["case","id"]
    return { path: "/"+parts.join("/"), parts };
  };
  const [route, setRoute] = useState(parse());
  useEffect(()=>{
    let sweeping=false;
    const on = ()=>{
      const apply = ()=>{ setRoute(parse()); window.scrollTo({top:0,behavior:"instant"}); };
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if(reduce || sweeping){ apply(); return; }   // skip the loader on rapid navigation
      sweeping=true;

      const c=document.createElement("div"); c.className="route-curtain";
      c.innerHTML='<div class="route-loader">'
        + '<img class="route-curtain-mark" src="assets/logo-white.png" alt="">'
        + '<div class="route-bar"><i></i></div>'
        + '<div class="route-pct">0</div></div>';
      document.body.appendChild(c);
      const fill=c.querySelector(".route-bar i"), pctEl=c.querySelector(".route-pct");

      setTimeout(()=>c.classList.add("cover"), 20);             // ease the curtain up to cover

      const dur = 820 + Math.random()*740;                     // simulated load time 0.82–1.56s
      const start = performance.now();
      let swapped=false, cleaned=false, iv=0;
      const swap=()=>{ if(swapped) return; swapped=true; try{ ReactDOM.flushSync(apply); }catch(e){ apply(); } };
      const done=()=>{ if(cleaned) return; cleaned=true; clearInterval(iv); swap(); c.remove(); sweeping=false; };

      iv=setInterval(()=>{
        const t=Math.min(1,(performance.now()-start)/dur);
        const p=Math.round((1-Math.pow(1-t,2.3))*100);          // eases fast then lingers, like a real load
        fill.style.width=p+"%"; pctEl.textContent=p;
        if(performance.now()-start>440) swap();                 // swap the page under cover
        if(t>=1){ clearInterval(iv); pctEl.textContent="100"; fill.style.width="100%"; c.classList.add("leave"); }
      }, 40);

      c.addEventListener("transitionend",(e)=>{ if(e.propertyName==="transform" && c.classList.contains("leave")) done(); });
      setTimeout(done, dur+1700);                                // safety: always clean up
    };
    window.addEventListener("hashchange", on);
    return ()=>window.removeEventListener("hashchange", on);
  },[]);
  return route;
}
function navigate(to){ if(("#"+to)!==location.hash) location.hash = to; else window.scrollTo({top:0}); }
function Link({to, children, className, ...rest}){
  return <a href={"#"+to} className={className} onClick={(e)=>{e.preventDefault(); navigate(to);}} {...rest}>{children}</a>;
}

/* ---------------- icons (lucide-style, 2px stroke) ---------------- */
const ICONS = {
  arrow:"M5 12h14M13 6l6 6-6 6",
  filter:"M4 5h16M7 12h10M10 19h4",
  search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  pin:"M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  compass:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16 8l-2.5 5.5L8 16l2.5-5.5L16 8z",
  users:"M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M22 19v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8",
  lock:"M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V7a4 4 0 1 1 8 0v4",
  file:"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6",
  folder:"M4 6a2 2 0 0 1 2-2h3l2 2.5h7A2 2 0 0 1 20 8.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
  chevron:"M9 6l6 6-6 6",
  chevronDown:"M6 9l6 6 6-6",
  x:"M6 6l12 12M18 6L6 18",
  menu:"M4 7h16M4 12h16M4 17h16",
  check:"M5 12l5 5L20 6",
  grid:"M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list:"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  download:"M12 3v12M7 11l5 5 5-5M5 21h14",
  external:"M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5",
  layers:"M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  heart:"M12 20s-7-4.7-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.3-7 10-7 10z",
  globe:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a14 14 0 0 1 0 20 14 14 0 0 1 0-20z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  book:"M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM18 3v18",
  mail:"M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6.5L12 13l8.5-6.5",
  phone:"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5l3 2",
  sprout:"M7 20h10M12 20V10M12 10C12 6 9 4 5 4c0 4 3 6 7 6zM12 12c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5z",
  link:"M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1",
  spark:"M12 4l1.7 4.6 4.6 1.7-4.6 1.7L12 16.6l-1.7-4.6L5.7 10.3l4.6-1.7zM18.5 13.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z",
  send:"M22 2L11 13M22 2l-7 20-4-9-9-4z",
};
/* brand share glyphs (filled) — rendered separately so they can use fill */
const BRAND_ICONS = {
  "x-social":"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  linkedin:"M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.51C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z",
  facebook:"M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.1 24 18.1 24 12.07z",
};
function Icon({name, size=20, className, stroke=2, style}){
  if(BRAND_ICONS[name]){
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
        style={style} aria-hidden="true"><path d={BRAND_ICONS[name]}/></svg>
    );
  }
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {(ICONS[name]||"").split("M").filter(Boolean).map((d,i)=><path key={i} d={"M"+d}/>)}
    </svg>
  );
}

/* ---------------- koru curve ---------------- */
function Koru({className, stroke="var(--green-500)", op=0.5, style}){
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" preserveAspectRatio="xMidYMid meet" style={style} aria-hidden="true">
      <path d="M40 540 C 300 540 470 420 470 250 C 470 130 390 56 286 56 C 200 56 140 118 140 200 C 140 270 192 318 262 318 C 320 318 360 280 360 230"
        stroke={stroke} strokeWidth="1.5" opacity={op}/>
      <path d="M20 560 C 330 560 520 430 520 240 C 520 100 424 18 300 18"
        stroke={stroke} strokeWidth="1.5" opacity={op*0.6}/>
      <path d="M262 318 a8 8 0 1 0 0.1 0" stroke={stroke} strokeWidth="1.5" opacity={op}/>
    </svg>
  );
}

/* ---------------- atlas tag ---------------- */
function Atag({children, variant, className, dot=true}){
  return <span className={"atag "+(variant||"")+(className?" "+className:"")}>{dot && <span className="dot"></span>}{children}</span>;
}

/* ---------------- photo placeholder ---------------- */
/* Real, free Pacific stock photography (Pexels), grouped by the brand's
   Sea · Forest · Crossing imagery system. Each fill category has a small pool;
   a per-element seed picks one so backgrounds vary across the site while
   staying on-theme. ~12 files total, all browser-cached. */
const PXImg = (id,w=1100)=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const FILL_POOL = {
  "fill-sea":      [4318922,4321802,18846638],          // turquoise ocean & shorebreak
  "fill-forest":   [7867865,29556194,23515065],         // rainforest canopy
  "fill-coast":    [11807182,28408422,28769443],        // islands & lagoons
  "fill-earth":    [28408422,28769443,11807182],         // atolls & land from above
  "fill-crossing": [10756918,11807182,4321802],          // people / coming together
  "fill-dawn":     [34089633,18846638,15916211],         // sunrise over ocean
};
function hashSeed(s){ s=String(s||""); let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
function pickFill(fill, seed){
  const pool = FILL_POOL[fill] || FILL_POOL["fill-sea"];
  const idx = seed!=null ? hashSeed(seed)%pool.length : 0;
  return PXImg(pool[idx]);
}
const FILL_IMG = Object.fromEntries(Object.keys(FILL_POOL).map(k=>[k, PXImg(FILL_POOL[k][0])]));
if(typeof window!=="undefined"){ window.FILL_IMG = FILL_IMG; window.pickFill = pickFill; }
function Photo({fill, img, seed, wash="wash-soft", className, coord, label, children, style}){
  const src = img || (fill ? pickFill(fill, seed) : null);
  return (
    <div className={"photo "+(src?"":(fill||"fill-sea")+" ")+wash+(className?" "+className:"")}
      style={src?{...style, backgroundImage:`url(${src})`}:style}>
      {(coord||label) && (
        <div className="ph-cap">
          {coord && <span className="ph-coord">{coord}</span>}
          {label && <span className="ph-name">{label}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------- button ---------------- */
function Btn({to, href, kind="primary", size, children, arrow, onClick, className, type}){
  const cls = "btn btn-"+kind+(size?" btn-"+size:"")+(className?" "+className:"");
  const inner = <>{children}{arrow && <span className="arr">→</span>}</>;
  if(to) return <Link to={to} className={cls}>{inner}</Link>;
  if(href) return <a href={href} className={cls} onClick={onClick}>{inner}</a>;
  return <button type={type||"button"} className={cls} onClick={onClick}>{inner}</button>;
}

/* ---------------- reveal: CSS load-animation handles entrances now; hook kept as no-op ---------------- */
function useReveal(){ /* entrances are CSS-driven (.reveal); no JS class toggling to fight React */ }

/* ---------------- header ---------------- */
const NAV = [
  {label:"Services", to:"/services"},
  {label:"Our work", to:"/atlas"},
  {label:"Impact", to:"/impact"},
  {label:"People", to:"/people"},
  {label:"News", to:"/news"},
];
function Header({route, onContact}){
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const onDark = route.path==="/" ; // home has light hero now → always light header
  useEffect(()=>{
    const on=()=>setSolid(window.scrollY>20);
    on(); window.addEventListener("scroll",on); return ()=>window.removeEventListener("scroll",on);
  },[]);
  useEffect(()=>{
    document.body.style.overflow = open ? "hidden" : "";
    const esc=(e)=>{ if(e.key==="Escape") setOpen(false); };
    window.addEventListener("keydown",esc);
    return ()=>{ window.removeEventListener("keydown",esc); document.body.style.overflow=""; };
  },[open]);
  const go = (to)=>{ setOpen(false);
    if(to.startsWith("/#")){ const id=to.slice(2); if(route.path!=="/"){ navigate("/"); setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}),60);} else document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); }
    else navigate(to);
  };
  return (
    <>
    <header className={"site-head"+(solid?" solid":"")}>
      <div className="wrap site-head-in">
        <a href="#/" className="brand" onClick={(e)=>{e.preventDefault(); navigate("/");}}>
          <img src="assets/logo.png" alt="Future Partners — International development"/>
        </a>
        <nav className="site-nav">
          {NAV.map(n=>(
            <a key={n.label} href={"#"+n.to} className={"site-nav-a"+((route.path===n.to||(n.to==="/atlas"&&route.path.startsWith("/case")))?" active":"")}
              onClick={(e)=>{e.preventDefault(); go(n.to);}}>{n.label}</a>
          ))}
        </nav>
        <div className="site-head-cta">
          <a href="#/members" className="site-login" onClick={(e)=>{e.preventDefault(); go("/members");}}><Icon name="lock" size={14}/> Sign in</a>
          <Btn kind="primary" size="sm" arrow onClick={onContact}>Work with us</Btn>
        </div>
        <button className="site-burger" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)}><Icon name="menu"/></button>
      </div>
    </header>

      <div className={"mobmenu"+(open?" open":"")} aria-hidden={!open}>
        <Koru className="mobmenu-koru" stroke="var(--green-400)" op={0.4}/>
        <div className="wrap mobmenu-top">
          <a href="#/" className="brand" onClick={(e)=>{e.preventDefault(); setOpen(false); navigate("/");}}>
            <img src="assets/logo-white.png" alt="Future Partners — International development"/>
          </a>
          <button className="mobmenu-x" aria-label="Close menu" onClick={()=>setOpen(false)}><Icon name="x" size={24}/></button>
        </div>
        <nav className="wrap mobmenu-nav">
          {NAV.map((n,i)=>(
            <a key={n.label} href={"#"+n.to} className="mobmenu-link"
              style={{animationDelay:(150+i*65)+"ms"}}
              onClick={(e)=>{e.preventDefault(); go(n.to);}}>
              <span className="mobmenu-link-n">{String(i+1).padStart(2,"0")}</span>
              <span className="mobmenu-link-t">{n.label}</span>
              <Icon name="arrow" size={24}/>
            </a>
          ))}
        </nav>
        <div className="wrap mobmenu-foot" style={{animationDelay:(150+NAV.length*65)+"ms"}}>
          <a href="#/members" className="mobmenu-login" onClick={(e)=>{e.preventDefault(); go("/members");}}><Icon name="lock" size={15}/> Sign in</a>
          <Btn kind="primary" size="lg" arrow onClick={()=>{setOpen(false); onContact();}}>Work with us</Btn>
          <div className="mobmenu-contact">
            <a href="tel:+64210672680">+64 21 067 2680</a>
            <a href="mailto:hello@futurepartners.co.nz">hello@futurepartners.co.nz</a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- CTA + footer ---------------- */
function CTAFooter({onContact}){
  return (
    <>
    <section className="cta-band">
      <Koru className="cta-koru" stroke="var(--green-500)" op={0.55}/>
      <div className="wrap cta-in">
        <div>
          <p className="eyebrow on-dark">Let's talk</p>
          <h2 className="cta-h">Tell us about the problem you're trying to solve.</h2>
          <p className="cta-lead">We work alongside you — not on your behalf. Wherever you are in the project cycle, there's a sensible first conversation to be had.</p>
        </div>
        <div className="cta-actions">
          <Btn kind="white" size="lg" arrow onClick={onContact}>Work with us</Btn>
          <a className="cta-phone" href="tel:+64210672680"><Icon name="phone" size={18}/> +64 21 067 2680</a>
        </div>
      </div>
    </section>
    <footer className="site-foot">
      <div className="wrap foot-in">
        <div className="foot-brand">
          <img src="assets/logo.png" alt="Future Partners"/>
          <p className="foot-tag">Locally led, globally connected. Practical, relationship-led international development across Aotearoa, Asia and the Pacific.</p>
          <p className="meta">Wellington · Aotearoa New Zealand · Affiliated with NZ Council for International Development</p>
        </div>
        <div className="foot-cols">
          <div className="foot-col">
            <span className="foot-h">Explore</span>
            <Link to="/atlas">Case study atlas</Link>
            <Link to="/impact">Our impact</Link>
            <Link to="/services">Services &amp; the project cycle</Link>
            <Link to="/people">People &amp; associates</Link>
            <Link to="/news">News &amp; insights</Link>
            <Link to="/trust">Trust &amp; security</Link>
          </div>
          <div className="foot-col">
            <span className="foot-h">Members</span>
            <Link to="/members">Sign in</Link>
            <span className="meta" style={{textTransform:"none"}}>For clients, associates &amp; our team</span>
          </div>
          <div className="foot-col">
            <span className="foot-h">Contact</span>
            <a href="tel:+64210672680">+64 21 067 2680</a>
            <a href="mailto:hello@futurepartners.co.nz">hello@futurepartners.co.nz</a>
            <span className="meta" style={{textTransform:"none"}}>Wellington · Aotearoa New Zealand</span>
          </div>
        </div>
      </div>
      <div className="wrap foot-base">
        <span className="meta">© 2026 Future Partners Ltd</span>
        <span className="meta">Field Atlas concept · non-live mockup</span>
      </div>
    </footer>
    </>
  );
}

Object.assign(window, { useRoute, navigate, Link, Icon, Koru, Atag, Photo, Btn, useReveal, Header, CTAFooter });
