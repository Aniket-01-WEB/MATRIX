/* ═══════════════════════════════════════════════════
   MATRIX — FinTech Club | Script
   ═══════════════════════════════════════════════════ */

/* ==========================================================================
   CONFIGURATIONS — GOOGLE SHEETS INTEGRATION
   Paste your deployed Google Apps Script Web App URL ending in /exec below.
   Example: 'https://script.google.com/macros/s/AKfycb.../exec'
   ========================================================================== */
const GOOGLE_SHEET_WEBHOOK_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

// ─── DATA (easily editable) ───
const DOMAINS = [
  { num:'01', title:'FinTech Architecture', desc:'Engineering next-generation digital payment rails, core banking infrastructure, microservices, and cross-border API protocols.', highlights:['Core Payment Systems & ISO20022 Protocols','Open Banking & API Interoperability','Low-Latency Micro-Transaction Infrastructure'], stats:'4 Active Projects • 24 Technical Workshops', tags:['Payment Rails','Open Banking','Micro-Transactions'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>' },
  { num:'02', title:'Markets & Quantitative Investment', desc:'Understanding global capital markets, algorithmic trading strategies, portfolio optimization, and stochastic financial modeling.', highlights:['High-Frequency Algorithmic Execution','Portfolio Optimization & Black-Litterman Models','Risk Analytics & Monte Carlo Simulations'], stats:'$500K Simulated Portfolio • 18 Quant Models', tags:['Algo Trading','Portfolio Mgmt','Risk Analytics'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>' },
  { num:'03', title:'AI & Data Science in Finance', desc:'Leveraging predictive machine learning, deep learning, NLP for sentiment analysis, automated fraud detection, and credit scoring.', highlights:['Financial Sentiment Mining via LLMs','Automated Anomaly & Fraud Detection','Predictive Credit & Risk Scoring Models'], stats:'6 AI Hackathons • 95% Model Accuracy', tags:['Machine Learning','NLP Sentiment','Fraud Analytics'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M8.56 6A4 4 0 0 1 12 2"/><circle cx="12" cy="14" r="3"/><path d="M6 20a6 6 0 0 1 12 0"/></svg>' },
  { num:'04', title:'Blockchain & Decentralized Web3', desc:'Exploring decentralized smart contracts, Zero-Knowledge proofs, tokenomics, automated market makers (AMMs), and digital assets.', highlights:['Solidity & Rust Smart Contract Development','Automated Market Makers & DEX Protocol Design','Zero-Knowledge Proofs & Privacy Architecture'], stats:'3 Deployed Protocols • 100% On-Chain Audited', tags:['Smart Contracts','DeFi Protocols','ZK Proofs'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="9" height="9" rx="1"/><rect x="14" y="1" width="9" height="9" rx="1"/><rect x="1" y="14" width="9" height="9" rx="1"/><rect x="14" y="14" width="9" height="9" rx="1"/></svg>' },
  { num:'05', title:'Venture & Entrepreneurship', desc:'Incubating student fintech startups, pitching to institutional investors, building MVPs, and navigating financial regulatory compliance.', highlights:['Incubation Program & Pitch Decks','Regulatory Sandboxes & RegTech Compliance','Venture Capital & Seed Pitch Sessions'], stats:'5 Incubated Startups • $150K Seed Raised', tags:['Startup Accelerator','Venture Pitching','RegTech'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
  { num:'06', title:'Quantitative Research & Innovation', desc:'Publishing cutting-edge research whitepapers on macro-economics, central bank digital currencies (CBDCs), and high-frequency trading.', highlights:['Macroeconomic Policy & CBDC Research','Academic Whitepaper Publications','Industry Benchmark Analysis Reports'], stats:'8 Whitepapers Published • 2 International Journals', tags:['Research Whitepapers','CBDC Analytics','HFT Systems'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>' }
];

const EVENTS = [
  // Upcoming
  { name:'MATRIX FinTech Summit 2026', date:'Mar 15, 2026', location:'Main Auditorium', category:'Summit', desc:'Flagship summit uniting global industry founders, investors, and student innovators exploring the future of global finance.', status:'upcoming', color:'#0f172a' },
  { name:'Quantitative Trading Masterclass', date:'Feb 22, 2026', location:'Lab 301', category:'Workshop', desc:'Deep dive into systematic market analysis, high-frequency execution, and algorithmic trading strategies.', status:'upcoming', color:'#1e293b' },
  { name:'AI × Finance National Hackathon', date:'Apr 5, 2026', location:'Tech Center', category:'Hackathon', desc:'48-hour national hackathon challenging student developers to build AI-powered credit, risk, and trading bots.', status:'upcoming', color:'#334155' },
  { name:'Algorithmic Market Making Lab', date:'Apr 20, 2026', location:'Innovation Hub', category:'Lab', desc:'Hands-on session building order book simulation engines and liquidity management protocols.', status:'upcoming', color:'#475569' },
  { name:'DeFi & Tokenomics Symposium', date:'May 2, 2026', location:'Auditorium B', category:'Symposium', desc:'Panel discussion featuring blockchain architects on automated market makers, ZK proofs, and liquidity pools.', status:'upcoming', color:'#0f172a' },
  { name:'Venture Pitching & Angel Sandbox', date:'May 18, 2026', location:'Venture Hub', category:'Sandbox', desc:'Pitch session where student fintech startups present MVPs directly to institutional angel investors.', status:'upcoming', color:'#1e293b' },
  
  // Past
  { name:'Blockchain & Web3 Security Workshop', date:'Jan 18, 2026', location:'Innovation Hub', category:'Workshop', desc:'Hands-on workshop exploring smart contract auditing, vulnerability scanning, and decentralized protocols.', status:'past', color:'#475569' },
  { name:'Global FinTech Founder Fireside', date:'Dec 10, 2025', location:'Conference Hall', category:'Fireside', desc:'An exclusive evening with unicorn fintech founders sharing their journey from MVP to valuation.', status:'past', color:'#334155' },
  { name:'Automated Credit Scoring Challenge', date:'Nov 28, 2025', location:'Data Science Lab', category:'Challenge', desc:'Intense 24-hour machine learning competition targeting alternative data credit risk modeling.', status:'past', color:'#1e293b' },
  { name:'High-Frequency Trading Bootcamp', date:'Oct 14, 2025', location:'Virtual Lab', category:'Bootcamp', desc:'Comprehensive 3-day bootcamp covering low-latency C++ systems, order book dynamics, and market data APIs.', status:'past', color:'#0f172a' },
  { name:'Venture Capital & Seed Pitching Showcase', date:'Sep 30, 2025', location:'Main Auditorium', category:'Showcase', desc:'Student startup teams pitched their fintech MVPs live to top tier venture capital investors.', status:'past', color:'#64748b' },
  { name:'Decentralized Identity & ZK Hackathon', date:'Aug 15, 2025', location:'Tech Lab 102', category:'Hackathon', desc:'24-hour hackathon building zero-knowledge identity protocols for digital banking systems.', status:'past', color:'#334155' }
];

const PROJECTS = [
  { name:'MATRIX Pay', category:'Digital Payments', desc:'A conceptual digital payment ecosystem designed by students, exploring UPI alternatives and cross-border settlement rails.', tech:['React','Node.js','Stripe API','MongoDB'], color:'linear-gradient(135deg,#0f172a,#1e293b,#334155)', top:'10px', left:'2%', rotate:-2.5, zIndex:5, speed:0.35, theme:'theme-white' },
  { name:'MarketLens AI', category:'AI Analytics', desc:'AI-powered financial market analytics dashboard providing real-time NLP sentiment analysis and stock movement predictions.', tech:['Python','TensorFlow','D3.js','FastAPI'], color:'linear-gradient(135deg,#1e293b,#334155,#475569)', top:'70px', left:'22%', rotate:1.5, zIndex:2, speed:-0.45, theme:'theme-black' },
  { name:'FinTrack Engine', category:'Personal Finance', desc:'Personal finance and expense management platform with smart budgeting algorithms and credit risk goal tracking.', tech:['Flutter','Firebase','Charts','ML Kit'], color:'linear-gradient(135deg,#334155,#475569,#64748b)', top:'20px', left:'46%', rotate:-1.2, zIndex:4, speed:0.25, theme:'theme-gray' },
  { name:'DeFi Vault Protocol', category:'Web3 Architecture', desc:'Decentralized asset vault protocol utilizing automated yield farming strategies and audited Solidity smart contracts.', tech:['Solidity','Hardhat','Ethers.js','Web3.js'], color:'linear-gradient(135deg,#0f172a,#334155,#475569)', top:'50px', left:'68%', rotate:3, zIndex:6, speed:-0.35, theme:'theme-white' },
  { name:'QuantModel Alpha', category:'Algorithmic Trading', desc:'High-frequency stochastic backtesting engine modeling market impact and order book execution dynamics.', tech:['C++20','Python','Pandas','NumPy'], color:'linear-gradient(135deg,#1e293b,#475569,#64748b)', top:'410px', left:'10%', rotate:2.2, zIndex:3, speed:-0.4, theme:'theme-black' },
  { name:'MATRIX Research Hub', category:'Academic Research', desc:'Student-led research initiatives exploring central bank digital currencies (CBDCs) and publishing open whitepapers.', tech:['LaTeX','Python','R','Jupyter'], color:'linear-gradient(135deg,#0f172a,#1e293b,#475569)', top:'450px', left:'36%', rotate:-2, zIndex:5, speed:0.45, theme:'theme-gray' },
  { name:'CryptoRisk Sentinel', category:'Risk Engine', desc:'Real-time algorithmic risk monitoring and liquidity alert system for decentralized liquidity providers.', tech:['Rust','Web3','Python','Tailwind'], color:'linear-gradient(135deg,#1e293b,#334155,#0f172a)', top:'400px', left:'62%', rotate:-1.5, zIndex:4, speed:-0.28, theme:'theme-white' }
];

const TEAM = [
  { name:'Aniket', role:'Tech Lead', initials:'A', image:'prof_file/Aniket.jpeg', imgPos:'center 15%' },
  { name:'Souvik', role:'Faculty POC / Treasurer', initials:'S', image:'prof_file/souvik.jpeg', imgPos:'center 15%' },
  { name:'Pritesh', role:'President', initials:'P', image:'prof_file/pritesh.jpeg', imgPos:'center 15%', imgSize:'185%' },
  { name:'Gourav', role:'Design Lead', initials:'G', image:'prof_file/Gourav.jpeg', imgPos:'center 15%' },
  { name:'Shivam', role:'Vice President', initials:'S' },
  { name:'Debjit', role:'Secretary', initials:'D', image:'prof_file/debjit.jpeg', imgPos:'center 15%' },
  { name:'Jaydeep', role:'Marketing Lead', initials:'J', image:'prof_file/jaydeep.jpeg', imgPos:'center 15%' }
];

const BENEFITS = [
  { title:'LEARN', desc:'Build practical knowledge beyond the classroom through workshops, masterclasses, and industry sessions.' },
  { title:'BUILD', desc:'Work on real-world fintech projects that solve actual problems in finance and technology.' },
  { title:'CONNECT', desc:'Meet professionals, founders, investors, and like-minded students shaping the future.' },
  { title:'LEAD', desc:'Take ownership of initiatives and build leadership experience that stands out.' }
];

const RESOURCES = [
  { title:'Introduction to FinTech Ecosystem', category:'FinTech', date:'Feb 2026', desc:'A comprehensive guide to understanding the fintech landscape, key players, and emerging trends.' },
  { title:'Stock Market Analysis Framework', category:'Investment', date:'Jan 2026', desc:'Learn systematic approaches to analyzing stocks using fundamental and technical analysis.' },
  { title:'AI in Credit Risk Assessment', category:'AI', date:'Mar 2026', desc:'How machine learning models are revolutionizing credit scoring and risk management.' },
  { title:'DeFi Protocol Deep Dive', category:'Blockchain', date:'Feb 2026', desc:'Understanding decentralized finance protocols, yield farming, and liquidity pools.' },
  { title:'Personal Finance 101', category:'Finance', date:'Jan 2026', desc:'Essential financial literacy concepts every student should know — budgeting, saving, and investing.' },
  { title:'Emerging Trends in Digital Banking', category:'Research', date:'Mar 2026', desc:'Research paper on the evolution of neobanks and the future of digital-only financial services.' }
];

// ─── POPULATE DOM ───
function renderDomains(){
  const stack = document.getElementById('domainsStack');
  if(!stack) return;
  stack.innerHTML = DOMAINS.map((d, i) => {
    const theme = (i % 2 === 0) ? 'theme-white' : 'theme-black';
    const tagHtml = (d.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');
    const highlightHtml = (d.highlights || []).map(h => `<li class="domain-highlight-item"><span class="bullet">✦</span> ${h}</li>`).join('');

    return `
      <div class="domain-card-stack ${theme}" data-index="${i}">
        <div>
          <div class="domain-stack-top">
            <div class="domain-stack-header">
              <div class="domain-stack-icon">${d.icon}</div>
              <h3 class="domain-stack-title">${d.title}</h3>
            </div>
            <span class="domain-stack-num">${d.num}</span>
          </div>
          <p class="domain-stack-desc">${d.desc}</p>
          <ul class="domain-highlights-list">
            ${highlightHtml}
          </ul>
        </div>
        <div class="domain-card-footer">
          <div class="domain-stats-strip">${d.stats}</div>
          <div class="domain-tags">${tagHtml}</div>
        </div>
      </div>
    `;
  }).join('');
}
function renderEvents(filter='upcoming'){
  const g=document.getElementById('eventsGrid'); if(!g) return;
  const filtered=EVENTS.filter(e=>e.status===filter);
  if(!filtered.length) return;
  // Duplicate array 3x for seamless smooth horizontal marquee infinite scroll
  const displayList = [...filtered, ...filtered, ...filtered];
  g.innerHTML=displayList.map((e, i)=>{
    const theme = (i % 2 === 0) ? 'theme-white' : 'theme-black';
    return `
    <div class="event-card ${theme}">
      <div class="event-image" style="background:linear-gradient(135deg,${e.color}dd,${e.color}99),var(--bg-3)">
        <span class="event-category">${e.category}</span>
      </div>
      <div class="event-body">
        <h3 class="event-name">${e.name}</h3>
        <div class="event-meta">
          <span>📅 ${e.date}</span>
          <span>📍 ${e.location}</span>
        </div>
        <p class="event-desc">${e.desc}</p>
        <a href="#" class="text-link">Event Details <span class="arrow">→</span></a>
      </div>
    </div>
  `}).join('');
}
function renderProjects(){
  const g=document.getElementById('projectsGrid'); if(!g) return;
  g.innerHTML=PROJECTS.map((p, i)=>`
    <div class="project-card-scatter ${p.theme}" style="top:${p.top};left:${p.left};z-index:${p.zIndex};transform:rotate(${p.rotate}deg)" data-speed="${p.speed}" data-rotate="${p.rotate}">
      <div class="project-scatter-header">
        <span>${p.category}</span>
        <span>0${i+1}</span>
      </div>
      <h3 class="project-scatter-title">${p.name}</h3>
      <p class="project-scatter-desc">${p.desc}</p>
      <div class="project-scatter-preview">
        <div class="project-scatter-preview-inner" style="background:${p.color}"></div>
      </div>
      <div class="project-scatter-tags">
        ${p.tech.map(t=>`<span>${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}
function renderTeam(){
  const g=document.getElementById('teamGrid'); if(!g) return;
  // Duplicate array 4x for continuous seamless reverse horizontal marquee infinite scroll
  const displayList = [...TEAM, ...TEAM, ...TEAM, ...TEAM];
  g.innerHTML=displayList.map((m, i)=>{
    const theme = (i % 2 === 0) ? 'theme-white' : 'theme-black';
    const bgPos = m.imgPos || 'center 15%';
    const bgSize = m.imgSize || 'cover';
    const bgStyle = m.image ? `background-image:url('${m.image}'); background-position:${bgPos}; background-size:${bgSize};` : '';
    const hasBg = m.image ? 'has-bg-img' : '';
    return `
    <div class="team-card ${theme} flip-card" onclick="this.classList.toggle('flipped')">
      <div class="flip-card-inner">
        <div class="flip-card-front ${hasBg}" style="${bgStyle}">
          ${!m.image ? `<div class="team-avatar">${m.initials}</div>` : ''}
          <a href="#" class="team-linkedin" aria-label="LinkedIn" onclick="event.stopPropagation()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <span class="flip-hint">Click to reveal</span>
        </div>
        <div class="flip-card-back">
          <h3 class="team-name">${m.name}</h3>
        </div>
      </div>
    </div>
  `}).join('');
}
function renderBenefits(){
  const g=document.getElementById('benefitsGrid'); if(!g) return;
  g.innerHTML=BENEFITS.map(b=>`<div class="benefit-card reveal-up"><h3 class="benefit-title">${b.title}</h3><p class="benefit-desc">${b.desc}</p></div>`).join('');
}
function renderResources(){
  const g=document.getElementById('resourcesGrid'); if(!g) return;
  g.innerHTML=RESOURCES.map(r=>`<div class="resource-card reveal-up" data-category="${r.category}"><span class="resource-category">${r.category}</span><h3 class="resource-title">${r.title}</h3><p class="resource-date">${r.date}</p><p class="resource-desc">${r.desc}</p><a href="#" class="text-link">Read More <span class="arrow">→</span></a></div>`).join('');
}

// ─── SCROLL REVEAL ───
function initReveal(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}});
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal-up:not(.revealed)').forEach(el=>obs.observe(el));
}

// ─── NAVBAR ───
function initNavbar(){
  const nav=document.getElementById('navbar');
  const toggle=document.getElementById('navToggle');
  const menu=document.getElementById('mobileMenu');
  let open=false;
  window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>60)});
  toggle.addEventListener('click',()=>{
    open=!open;
    menu.classList.toggle('open',open);
    toggle.classList.toggle('active',open);
    document.body.style.overflow=open?'hidden':'';
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    open=false;menu.classList.remove('open');toggle.classList.remove('active');document.body.style.overflow='';
  }));
}

// ─── EVENT TABS ───
function initEventTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.dataset.tab);
    });
  });
}

// ─── RESOURCE FILTER & SEARCH ───
function initResourceFilters(){
  const cards=()=>document.querySelectorAll('.resource-card');
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      cards().forEach(c=>{c.classList.toggle('hidden',f!=='all'&&c.dataset.category!==f)});
    });
  });
  const search=document.getElementById('resourceSearch');
  if(search) search.addEventListener('input',()=>{
    const q=search.value.toLowerCase();
    cards().forEach(c=>{
      const text=(c.querySelector('.resource-title')?.textContent+' '+c.querySelector('.resource-desc')?.textContent).toLowerCase();
      c.classList.toggle('hidden',q&&!text.includes(q));
    });
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
  });
}

// ─── SEQUENTIAL TIMELINE COUNTER ANIMATION ───
function initCounters(){
  const items = document.querySelectorAll('.stat-item');
  if(!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      obs.unobserve(e.target);

      if (typeof anime !== 'undefined') {
        const tl = anime.timeline({
          easing: 'easeOutExpo'
        });

        items.forEach((item) => {
          const numEl = item.querySelector('.stat-number');
          if (!numEl) return;
          const targetVal = parseInt(numEl.dataset.target, 10) || 0;
          const obj = { val: 0 };

          tl.add({
            targets: obj,
            val: targetVal,
            duration: 700,
            round: 1,
            update: function() {
              numEl.textContent = obj.val;
            }
          });
        });
      } else {
        let delay = 0;
        items.forEach((item) => {
          const numEl = item.querySelector('.stat-number');
          if (!numEl) return;
          const targetVal = parseInt(numEl.dataset.target, 10) || 0;
          setTimeout(() => {
            const start = performance.now();
            const dur = 600;
            function step(now) {
              const p = Math.min(1, (now - start) / dur);
              numEl.textContent = Math.round(p * targetVal);
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }, delay);
          delay += 600;
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    obs.observe(statsSection);
  }
}

// ─── HERO CANVAS ───
class MatrixCanvas{
  constructor(canvas,opts={}){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');
    this.particles=[];this.mouse={x:-1000,y:-1000};
    this.opts={count:opts.count||50,color:opts.color||'100,116,139',lineColor:opts.lineColor||'100,116,139',maxDist:opts.maxDist||140};
    this.resize();this.createParticles();this.bindEvents();this.animate();
  }
  resize(){
    const r=devicePixelRatio||1;
    this.w=this.canvas.parentElement.offsetWidth;
    this.h=this.canvas.parentElement.offsetHeight;
    this.canvas.width=this.w*r;this.canvas.height=this.h*r;
    this.canvas.style.width=this.w+'px';this.canvas.style.height=this.h+'px';
    this.ctx.scale(r,r);
  }
  createParticles(){
    this.particles=[];
    for(let i=0;i<this.opts.count;i++){
      this.particles.push({
        x:Math.random()*this.w,y:Math.random()*this.h,
        vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
        r:Math.random()*2+1,type:Math.random()>.7?'node':'dot'
      });
    }
  }
  bindEvents(){
    const rect=()=>this.canvas.getBoundingClientRect();
    this.canvas.parentElement.addEventListener('mousemove',e=>{const r=rect();this.mouse={x:e.clientX-r.left,y:e.clientY-r.top}});
    this.canvas.parentElement.addEventListener('mouseleave',()=>{this.mouse={x:-1000,y:-1000}});
    window.addEventListener('resize',()=>{this.resize();this.createParticles()});
  }
  drawGrid(){
    const c=this.ctx;const s=60;
    c.strokeStyle='rgba(0,0,0,.035)';c.lineWidth=.5;
    for(let x=0;x<this.w;x+=s){c.beginPath();c.moveTo(x,0);c.lineTo(x,this.h);c.stroke()}
    for(let y=0;y<this.h;y+=s){c.beginPath();c.moveTo(0,y);c.lineTo(this.w,y);c.stroke()}
  }
  animate(){
    const c=this.ctx;
    c.clearRect(0,0,this.w,this.h);
    this.drawGrid();
    // update & draw particles
    for(const p of this.particles){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>this.w)p.vx*=-1;
      if(p.y<0||p.y>this.h)p.vy*=-1;
      // mouse interaction
      const dx=this.mouse.x-p.x,dy=this.mouse.y-p.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<180){p.x-=dx*.005;p.y-=dy*.005}
    }
    // connections
    for(let i=0;i<this.particles.length;i++){
      for(let j=i+1;j<this.particles.length;j++){
        const a=this.particles[i],b=this.particles[j];
        const dx=a.x-b.x,dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<this.opts.maxDist){
          c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);
          c.strokeStyle=`rgba(${this.opts.lineColor},${.12*(1-dist/this.opts.maxDist)})`;
          c.lineWidth=.5;c.stroke();
        }
      }
    }
    // dots
    for(const p of this.particles){
      c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);
      if(p.type==='node'){c.fillStyle=`rgba(${this.opts.color},.6)`;c.fill();
        c.strokeStyle=`rgba(${this.opts.color},.3)`;c.lineWidth=1;c.stroke();
      }else{c.fillStyle=`rgba(${this.opts.lineColor},.25)`;c.fill()}
    }
    requestAnimationFrame(()=>this.animate());
  }
}

// ─── ABOUT CANVAS (smaller) ───
function initAboutCanvas(){
  const c=document.getElementById('aboutCanvas');
  if(!c)return;
  new MatrixCanvas(c,{count:20,maxDist:100});
}

// ─── 3D REVOLVING CIRCULAR BALL BADGE ORBIT ANIMATION (SUBTLE TILT) ───
function initOrbit() {
  const stage = document.getElementById('hero3dOrbitStage');
  if (!stage) return;

  const balls = stage.querySelectorAll('.hero-orbit-ball');
  if (!balls.length) return;

  const total = balls.length;
  let angleOffset = 0;

  function animateOrbit() {
    angleOffset += 0.0035;

    const isMobile = window.innerWidth < 600;
    const radius = isMobile ? 260 : Math.min(stage.offsetWidth * 0.48, 620);
    const tiltAngle = 0.24; // Tilted to the opposite side (+14 degrees)
    const cosTilt = Math.cos(tiltAngle);
    const sinTilt = Math.sin(tiltAngle);

    for (let i = 0; i < total; i++) {
      const ball = balls[i];
      const angle = angleOffset + (i / total) * Math.PI * 2;

      const circleX = Math.cos(angle) * radius;
      const circleZ = Math.sin(angle) * radius;

      const x = circleX;
      const y = circleZ * sinTilt; // Subtle Y elevation tilt
      const z = circleZ * cosTilt;

      const normalizedDepth = (z + radius) / (2 * radius);
      
      const scale = 0.72 + normalizedDepth * 0.42;
      const zIndex = z > 0 ? 10 : 2;

      ball.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) scale(${scale})`;
      ball.style.opacity = '1';
      ball.style.zIndex = zIndex;
    }

    requestAnimationFrame(animateOrbit);
  }

  requestAnimationFrame(animateOrbit);
}

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'})}
  });
});

// ─── SCROLL-DRIVEN LETTER-BY-LETTER FILL EFFECT IN ABOUT SECTION ───
function initAboutScroll(){
  const container = document.getElementById('aboutScrollContainer');
  if(!container) return;

  const paragraphs = container.querySelectorAll('.about-scroll-text');
  let charSpans = [];

  paragraphs.forEach(p => {
    const text = p.innerText;
    p.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.className = 'char-span';
      span.textContent = char;
      p.appendChild(span);
      charSpans.push(span);
    }
  });

  const section = document.querySelector('.about-pinned-section');
  if (!section || !charSpans.length) return;

  function updateCharFill() {
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDist = rect.height - windowH;

    if (scrollableDist <= 0) return;

    const scrolled = -rect.top;
    let progress = scrolled / scrollableDist;
    progress = Math.max(0, Math.min(1, progress));

    const totalChars = charSpans.length;
    const filledCount = Math.floor(progress * totalChars);

    for (let i = 0; i < totalChars; i++) {
      if (i <= filledCount && progress > 0) {
        charSpans[i].classList.add('filled');
      } else {
        charSpans[i].classList.remove('filled');
      }
    }
  }

  window.addEventListener('scroll', updateCharFill, { passive: true });
  updateCharFill();
}

// ─── GITHUB CONTRIBUTION GRID (MATRIX PIXEL BITMAP) ───
function initGithubGrid(){
  const grid = document.getElementById('githubGrid');
  if(!grid) return;

  const letterData = [
    { char: 'M', width: 5, cols: [
      [1,1,1,1,1,1,1],
      [0,1,0,0,0,0,0],
      [0,0,1,0,0,0,0],
      [0,1,0,0,0,0,0],
      [1,1,1,1,1,1,1]
    ]},
    { char: 'A', width: 5, cols: [
      [0,1,1,1,1,1,1],
      [1,0,0,1,0,0,0],
      [1,0,0,1,0,0,0],
      [1,0,0,1,0,0,0],
      [0,1,1,1,1,1,1]
    ]},
    { char: 'T', width: 5, cols: [
      [1,0,0,0,0,0,0],
      [1,0,0,0,0,0,0],
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0],
      [1,0,0,0,0,0,0]
    ]},
    { char: 'R', width: 5, cols: [
      [1,1,1,1,1,1,1],
      [1,0,0,1,0,0,0],
      [1,0,0,1,0,0,0],
      [1,0,0,1,1,0,0],
      [0,1,1,0,0,1,1]
    ]},
    { char: 'I', width: 3, cols: [
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1]
    ]},
    { char: 'X', width: 5, cols: [
      [1,1,0,0,0,1,1],
      [0,0,1,0,1,0,0],
      [0,0,0,1,0,0,0],
      [0,0,1,0,1,0,0],
      [1,1,0,0,0,1,1]
    ]}
  ];

  function renderGrid() {
    const parentWidth = grid.parentElement.clientWidth - 40;
    const sqSize = 13.5;
    const cols = Math.max(35, Math.floor(parentWidth / sqSize));
    const rows = 7;
    let html = '';

    const totalWordWidth = 33; // M(5)+1+A(5)+1+T(5)+1+R(5)+1+I(3)+1+X(5)
    const startCol = Math.max(1, Math.floor((cols - totalWordWidth) / 2));

    const pixelMap = {};
    let currentCol = startCol;

    letterData.forEach(item => {
      for (let c = 0; c < item.width; c++) {
        pixelMap[currentCol + c] = item.cols[c];
      }
      currentCol += item.width + 1;
    });

    for (let c = 0; c < cols; c++) {
      const colPixels = pixelMap[c];
      for (let r = 0; r < rows; r++) {
        let level = 0;
        if (colPixels && colPixels[r] === 1) {
          level = Math.random() > 0.12 ? 4 : 3;
        } else {
          const rand = Math.random();
          if (rand > 0.90) level = 2;
          else if (rand > 0.70) level = 1;
          else level = 0;
        }
        html += `<div class="github-sq level-${level}" title="MATRIX (${c},${r})"></div>`;
      }
    }
    grid.innerHTML = html;
  }

  renderGrid();
  window.addEventListener('resize', renderGrid);
}

// ─── DOMAINS SLIDER & DECK STACK CONTROLS ───
function initDomainsScrollStack(){
  const container = document.getElementById('domainsStack');
  if(!container) return;

  const cards = container.querySelectorAll('.domain-card-stack');
  const prevBtn = document.getElementById('domainsPrevBtn');
  const nextBtn = document.getElementById('domainsNextBtn');
  const counter = document.getElementById('domainsCounter');

  if(!cards.length) return;

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateDeck() {
    cards.forEach((card, i) => {
      if (i === currentIndex) {
        // Front active card
        card.style.transform = `translateX(0) translateY(0) scale(1)`;
        card.style.opacity = '1';
        card.style.zIndex = '20';
        card.style.pointerEvents = 'auto';
      } else if (i > currentIndex) {
        // Stacked in the deck behind
        const offset = i - currentIndex;
        const translateY = -offset * 14;
        const scale = 1 - offset * 0.04;
        const opacity = offset <= 3 ? (1 - offset * 0.15) : 0;
        card.style.transform = `translateX(0) translateY(${translateY}px) scale(${scale})`;
        card.style.opacity = opacity.toString();
        card.style.zIndex = (10 - offset).toString();
        card.style.pointerEvents = 'none';
      } else {
        // Slid out to the left
        card.style.transform = `translateX(-115%) translateY(0) scale(0.9)`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
      }
    });

    if (counter) {
      const numStr = (currentIndex + 1).toString().padStart(2, '0');
      const totalStr = totalCards.toString().padStart(2, '0');
      counter.textContent = `${numStr} / ${totalStr}`;
    }

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === totalCards - 1;
  }

  function goToNext() {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateDeck();
    }
  }

  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateDeck();
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', goToPrev);
  if (nextBtn) nextBtn.addEventListener('click', goToNext);

  // Touch and Mouse Swipe/Drag Support (Right-to-Left: Next card appears | Left-to-Right: Prev card returns)
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;

  function handleStart(e) {
    isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    currentX = startX;
  }

  function handleMove(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    currentX = clientX;

    // Prevent default browser back/forward swipe history navigation
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(clientY - startY);
    if (diffX > diffY && diffX > 10) {
      if (e.cancelable) e.preventDefault();
    }
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;
    const diffX = currentX - startX;
    // Swiping Right-to-Left (finger/mouse moves left) -> Next card appears!
    if (diffX < -30) {
      goToNext();
    } 
    // Swiping Left-to-Right (finger/mouse moves right) -> Previous card returns!
    else if (diffX > 30) {
      goToPrev();
    }
  }

  container.addEventListener('touchstart', handleStart, { passive: true });
  container.addEventListener('touchmove', handleMove, { passive: false });
  container.addEventListener('touchend', handleEnd, { passive: true });

  container.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  // Trackpad Horizontal Scroll Support
  let wheelLock = false;
  container.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 320);
      if (e.deltaX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }, { passive: false });

  updateDeck();
}

// ─── PROJECTS SCATTER (STATIC - SCROLL ANIMATION REMOVED) ───
function initProjectsScatterScroll() {
  // Static: projects remain fixed in position with no scroll-driven parallax or movement
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded',()=>{
  renderDomains();renderEvents();renderProjects();renderTeam();renderBenefits();renderResources();
  initReveal();initNavbar();initEventTabs();initResourceFilters();initCounters();
  // Hero canvas
  const hc=document.getElementById('heroCanvas');
  if(hc) new MatrixCanvas(hc,{count:60,maxDist:150});
  // CTA canvas
  const cc=document.getElementById('ctaCanvas');
  if(cc) new MatrixCanvas(cc,{count:30,maxDist:120});
  initAboutCanvas();
  initAboutScroll();
  initGithubGrid();
  initDomainsScrollStack();
  // Orbit animation
  initOrbit();
  // Axe Cursor rotation
  initAxeCursorRotation();
  // 3D Saturn CTA Orbit
  initCta3dOrbit();
  // Join MATRIX Modal
  initJoinModal();
  // stagger reveal
  document.querySelectorAll('.reveal-up').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i*.06,.4)}s`});
});

// ─── JOIN MATRIX SPREADSHEET MODAL ───
function initJoinModal() {
  const backdrop = document.getElementById('joinModalBackdrop');
  const openBtn = document.getElementById('joinMatrixBtn');
  const closeBtn = document.getElementById('closeJoinModalBtn');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const form = document.getElementById('joinSpreadsheetForm');
  const successState = document.getElementById('joinSuccessState');

  if (!backdrop) return;

  function openModal(e) {
    if (e) e.preventDefault();
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (form) form.style.display = 'block';
    if (successState) successState.style.display = 'none';
  }

  function closeModal() {
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Trigger modal for any element with class 'trigger-join-modal' or nav CTA buttons
  document.querySelectorAll('.trigger-join-modal, .nav-cta').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  // Close when clicking outside modal container
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.join-submit-btn');

      // Check if GOOGLE_SHEET_WEBHOOK_URL is configured properly
      const isUnconfigured = !GOOGLE_SHEET_WEBHOOK_URL ||
        GOOGLE_SHEET_WEBHOOK_URL.trim() === '' ||
        GOOGLE_SHEET_WEBHOOK_URL.includes('PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE');

      if (isUnconfigured) {
        console.error('Google Sheets Integration Error: GOOGLE_SHEET_WEBHOOK_URL is not configured. Please paste your deployed Web App URL ending in /exec into script.js.');
        alert('Configuration Notice: The Google Sheets Web App URL is not set yet in script.js. Please paste your deployed Google Apps Script URL ending in /exec into GOOGLE_SHEET_WEBHOOK_URL.');
        return;
      }

      // Disable button to prevent duplicate submissions
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      // Collect spreadsheet row data matching all 10 columns exactly:
      // A=name, B=regNumber, C=rollNumber, D=school, E=department, F=section, G=currentYear, H=contactNumber, I=gmail, J=interestedDomain
      const formData = {
        name: document.getElementById('studentName')?.value?.trim() || '',
        regNumber: document.getElementById('regNumber')?.value?.trim() || '',
        rollNumber: document.getElementById('rollNumber')?.value?.trim() || '',
        school: document.getElementById('studentSchool')?.value?.trim() || '',
        department: document.getElementById('studentDept')?.value?.trim() || '',
        section: document.getElementById('studentSection')?.value?.trim() || '',
        currentYear: document.getElementById('currentYear')?.value?.trim() || '',
        contactNumber: document.getElementById('contactNumber')?.value?.trim() || '',
        gmail: document.getElementById('studentEmail')?.value?.trim() || '',
        interestedDomain: document.getElementById('interestedDomain')?.value?.trim() || ''
      };

      console.log('MATRIX Registration Data Submission:', formData);

      // Backup to localStorage
      try {
        const savedMembers = JSON.parse(localStorage.getItem('matrixMembers') || '[]');
        savedMembers.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('matrixMembers', JSON.stringify(savedMembers));
      } catch (backupErr) {
        console.warn('LocalStorage backup error:', backupErr);
      }

      // Submit via POST to Google Apps Script Web App URL
      try {
        const bodyData = new URLSearchParams(formData);
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyData.toString()
        });

        // Show Success State after submission attempt
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Registration <span class="arrow">→</span>';
        }
        form.style.display = 'none';
        if (successState) successState.style.display = 'block';
        form.reset();
      } catch (error) {
        console.error('Google Sheets POST submission failed:', error);
        alert('Network Error: Unable to submit registration. Please check your connection and try again.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Registration <span class="arrow">→</span>';
        }
      }
    });
  }
}

// ─── AXE CURSOR 90-DEGREE ROTATION ON CLICK ───
function initAxeCursorRotation() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  let cursor = document.getElementById('customAxeCursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'customAxeCursor';
    cursor.className = 'custom-axe-cursor';
    document.body.appendChild(cursor);
  }

  document.body.classList.add('has-custom-cursor');

  let mouseX = -100, mouseY = -100;
  let currentRotation = 0;
  let rotateTimer = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(${currentRotation}deg)`;
  }, { passive: true });

  window.addEventListener('click', () => {
    currentRotation = -90;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(${currentRotation}deg)`;

    if (rotateTimer) clearTimeout(rotateTimer);

    rotateTimer = setTimeout(() => {
      currentRotation = 0;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(${currentRotation}deg)`;
    }, 150);
  });
}

// ─── 3D SATURN-RING ORBIT CTA ───
function initCta3dOrbit() {
  const stage = document.getElementById('cta3dOrbitStage');
  if (!stage) return;

  const tags = stage.querySelectorAll('.cta-orbit-tag');
  if (!tags.length) return;

  const total = tags.length;
  let angleOffset = 0;

  function animateOrbit() {
    angleOffset += 0.0055;

    const isMobile = window.innerWidth < 600;
    const Rx = isMobile ? 210 : 480;
    const Ry = isMobile ? 90 : 175;

    tags.forEach((tag, idx) => {
      const angle = angleOffset + (idx / total) * Math.PI * 2;
      const x = Math.cos(angle) * Rx;
      const y = Math.sin(angle) * Ry;
      const z = Math.sin(angle);

      const scale = 0.72 + (z + 1) * 0.24;
      const opacity = 0.5 + (z + 1) * 0.25;
      const zIndex = z > 0 ? 10 : 2;

      tag.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
      tag.style.opacity = opacity;
      tag.style.zIndex = zIndex;
    });

    requestAnimationFrame(animateOrbit);
  }

  requestAnimationFrame(animateOrbit);
}

