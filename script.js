const GOOGLE_SHEET_WEBHOOK_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

const DOMAINS = [
  { num:'01', title:'FinTech Architecture', desc:'Engineering next-generation digital payment rails, core banking infrastructure, microservices, and cross-border API protocols.', highlights:['Core Payment Systems & ISO20022 Protocols','Open Banking & API Interoperability','Low-Latency Micro-Transaction Infrastructure'], stats:'4 Active Projects • 24 Technical Workshops', tags:['Payment Rails','Open Banking','Micro-Transactions'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>' },
  { num:'02', title:'Markets & Quantitative Investment', desc:'Understanding global capital markets, algorithmic trading strategies, portfolio optimization, and stochastic financial modeling.', highlights:['High-Frequency Algorithmic Execution','Portfolio Optimization & Black-Litterman Models','Risk Analytics & Monte Carlo Simulations'], stats:'$500K Simulated Portfolio • 18 Quant Models', tags:['Algo Trading','Portfolio Mgmt','Risk Analytics'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>' },
  { num:'03', title:'AI & Data Science in Finance', desc:'Leveraging predictive machine learning, deep learning, NLP for sentiment analysis, automated fraud detection, and credit scoring.', highlights:['Financial Sentiment Mining via LLMs','Automated Anomaly & Fraud Detection','Predictive Credit & Risk Scoring Models'], stats:'6 AI Hackathons • 95% Model Accuracy', tags:['Machine Learning','NLP Sentiment','Fraud Analytics'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M8.56 6A4 4 0 0 1 12 2"/><circle cx="12" cy="14" r="3"/><path d="M6 20a6 6 0 0 1 12 0"/></svg>' },
  { num:'04', title:'Blockchain & Decentralized Web3', desc:'Exploring decentralized smart contracts, Zero-Knowledge proofs, tokenomics, automated market makers (AMMs), and digital assets.', highlights:['Solidity & Rust Smart Contract Development','Automated Market Makers & DEX Protocol Design','Zero-Knowledge Proofs & Privacy Architecture'], stats:'3 Deployed Protocols • 100% On-Chain Audited', tags:['Smart Contracts','DeFi Protocols','ZK Proofs'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="9" height="9" rx="1"/><rect x="14" y="1" width="9" height="9" rx="1"/><rect x="1" y="14" width="9" height="9" rx="1"/><rect x="14" y="14" width="9" height="9" rx="1"/></svg>' },
  { num:'05', title:'Venture & Entrepreneurship', desc:'Incubating student fintech startups, pitching to institutional investors, building MVPs, and navigating financial regulatory compliance.', highlights:['Incubation Program & Pitch Decks','Regulatory Sandboxes & RegTech Compliance','Venture Capital & Seed Pitch Sessions'], stats:'5 Incubated Startups • $150K Seed Raised', tags:['Startup Accelerator','Venture Pitching','RegTech'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
  { num:'06', title:'Quantitative Research & Innovation', desc:'Publishing cutting-edge research whitepapers on macro-economics, central bank digital currencies (CBDCs), and high-frequency trading.', highlights:['Macroeconomic Policy & CBDC Research','Academic Whitepaper Publications','Industry Benchmark Analysis Reports'], stats:'8 Whitepapers Published • 2 International Journals', tags:['Research Whitepapers','CBDC Analytics','HFT Systems'], icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>' }
];

const EVENTS = [
  { name:'MATRIX FinTech Summit 2026', date:'Mar 15, 2026', location:'Main Auditorium', category:'Summit', desc:'Flagship summit uniting global industry founders, investors, and student innovators exploring the future of global finance.', status:'upcoming', color:'#0f172a' },
  { name:'Quantitative Trading Masterclass', date:'Feb 22, 2026', location:'Lab 301', category:'Workshop', desc:'Deep dive into systematic market analysis, high-frequency execution, and algorithmic trading strategies.', status:'upcoming', color:'#1e293b' },
  { name:'AI × Finance National Hackathon', date:'Apr 5, 2026', location:'Tech Center', category:'Hackathon', desc:'48-hour national hackathon challenging student developers to build AI-powered credit, risk, and trading bots.', status:'upcoming', color:'#334155' },
  { name:'Algorithmic Market Making Lab', date:'Apr 20, 2026', location:'Innovation Hub', category:'Lab', desc:'Hands-on session building order book simulation engines and liquidity management protocols.', status:'upcoming', color:'#475569' },
  { name:'DeFi & Tokenomics Symposium', date:'May 2, 2026', location:'Auditorium B', category:'Symposium', desc:'Panel discussion featuring blockchain architects on automated market makers, ZK proofs, and liquidity pools.', status:'upcoming', color:'#0f172a' },
  { name:'Venture Pitching & Angel Sandbox', date:'May 18, 2026', location:'Venture Hub', category:'Sandbox', desc:'Pitch session where student fintech startups present MVPs directly to institutional angel investors.', status:'upcoming', color:'#1e293b' },
  
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
  const displayList = [...filtered, ...filtered, ...filtered, ...filtered];
  g.dataset.originalCount = filtered.length;
  g.innerHTML=displayList.map((e, i)=>{
    const theme = (i % 2 === 0) ? 'theme-white' : 'theme-black';
    return `
    <div class="event-card ${theme}">
      <div class="event-image">
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
  if (g.__resetMarquee) g.__resetMarquee();
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
  const displayList = [...TEAM, ...TEAM, ...TEAM, ...TEAM];
  g.dataset.originalCount = TEAM.length;
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
  if (g.__resetMarquee) g.__resetMarquee();
}
function renderBenefits(){
  const g=document.getElementById('benefitsGrid'); if(!g) return;
  g.innerHTML=BENEFITS.map(b=>`<div class="benefit-card reveal-up"><h3 class="benefit-title">${b.title}</h3><p class="benefit-desc">${b.desc}</p></div>`).join('');
}
function renderResources(){
  const g=document.getElementById('resourcesGrid'); if(!g) return;
  g.innerHTML=RESOURCES.map(r=>`<div class="resource-card reveal-up" data-category="${r.category}"><span class="resource-category">${r.category}</span><h3 class="resource-title">${r.title}</h3><p class="resource-date">${r.date}</p><p class="resource-desc">${r.desc}</p><a href="#" class="text-link">Read More <span class="arrow">→</span></a></div>`).join('');
}

function initReveal(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target)}});
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal-up:not(.revealed)').forEach(el=>obs.observe(el));
}

function initNavbar(){
  const nav=document.getElementById('navbar');
  const toggle=document.getElementById('navToggle');
  const menu=document.getElementById('mobileMenu');
  const aboutSec=document.getElementById('about');
  let open=false;
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',window.scrollY>60);
    if(aboutSec) {
      const rect = aboutSec.getBoundingClientRect();
      const isOverAbout = rect.top <= 120 && rect.bottom >= 60;
      nav.classList.toggle('pink-nav', isOverAbout);
    }
  });
  toggle.addEventListener('click',()=>{
    open=!open;
    menu.classList.toggle('open',open);
    toggle.classList.toggle('active',open);
    document.body.style.overflow=open?'hidden':'';
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    open=false;menu.classList.remove('open');toggle.classList.remove('active');document.body.style.overflow='';
  }));

  initDockMagnification();
}

function initDockMagnification() {
  const container = document.getElementById('navLinks');
  if (!container) return;

  const items = container.querySelectorAll('li');
  const distance = 140;
  const maxScale = 1.45;

  container.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const d = Math.abs(mouseX - itemCenterX);

      if (d < distance) {
        const norm = (1 - d / distance);
        const scale = 1 + (maxScale - 1) * Math.pow(Math.cos((d / distance) * (Math.PI / 2)), 2);
        const translateY = -5 * norm;
        item.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(2)}px)`;
        item.style.zIndex = '10';

        const link = item.querySelector('a');
        if (link) {
          const weight = Math.round(500 + 280 * norm);
          link.style.fontWeight = `${weight}`;
        }
      } else {
        item.style.transform = 'scale(1) translateY(0px)';
        item.style.zIndex = '1';
        const link = item.querySelector('a');
        if (link) link.style.fontWeight = '';
      }
    });
  });

  container.addEventListener('mouseleave', () => {
    items.forEach((item) => {
      item.style.transform = 'scale(1) translateY(0px)';
      item.style.zIndex = '1';
      const link = item.querySelector('a');
      if (link) link.style.fontWeight = '';
    });
  });
}

function initEventTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderEvents(btn.dataset.tab);
    });
  });
}

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
    for(const p of this.particles){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>this.w)p.vx*=-1;
      if(p.y<0||p.y>this.h)p.vy*=-1;
      const dx=this.mouse.x-p.x,dy=this.mouse.y-p.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<180){p.x-=dx*.005;p.y-=dy*.005}
    }
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
    for(const p of this.particles){
      c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);
      if(p.type==='node'){c.fillStyle=`rgba(${this.opts.color},.6)`;c.fill();
        c.strokeStyle=`rgba(${this.opts.color},.3)`;c.lineWidth=1;c.stroke();
      }else{c.fillStyle=`rgba(${this.opts.lineColor},.25)`;c.fill()}
    }
    requestAnimationFrame(()=>this.animate());
  }
}

function initAboutCanvas(){
  const c=document.getElementById('aboutCanvas');
  if(!c)return;
  new MatrixCanvas(c,{count:20,maxDist:100});
}

function initOrbit() {
  const stage = document.getElementById('hero3dOrbitStage');
  if (!stage) return;

  const balls = stage.querySelectorAll('.hero-orbit-ball');
  if (!balls.length) return;

  const total = balls.length;

  function positionBallsStatic() {
    const isMobile = window.innerWidth < 600;
    const isTablet = window.innerWidth < 992;

    const radiusX = isMobile ? 180 : (isTablet ? 340 : Math.min(stage.offsetWidth * 0.44, 560));
    const radiusY = isMobile ? 160 : (isTablet ? 140 : 185);

    for (let i = 0; i < total; i++) {
      const ball = balls[i];
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;

      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;

      ball.style.position = 'absolute';
      ball.style.top = '50%';
      ball.style.left = '50%';
      ball.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(0.92)`;
      ball.style.opacity = '1';
      ball.style.zIndex = '10';
    }
  }

  positionBallsStatic();
  window.addEventListener('resize', positionBallsStatic);
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'})}
  });
});

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

    const totalWordWidth = 33;
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

function initDomainsScrollStack(){
  const section = document.querySelector('.domains-squeeze-section');
  const squeezeText = document.getElementById('domainsSqueezeText');

  if(!section || !squeezeText) return;

  if(window.innerWidth <= 768) return;

  function updateScale() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportH = window.innerHeight;
    const scrollableDistance = sectionHeight - viewportH;

    if(scrollableDistance <= 0) return;

    const scrolled = -rect.top;
    let progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    const scale = 1.0 - (progress * 0.3);
    squeezeText.style.transform = `scale(${scale.toFixed(4)})`;
    squeezeText.style.opacity = '1';
  }

  window.addEventListener('scroll', updateScale, { passive: true });
  updateScale();
}

function initInteractiveMarquee(wrapperSelector, speedPxPerSec = 85) {
  const wrapper = typeof wrapperSelector === 'string' ? document.querySelector(wrapperSelector) : wrapperSelector;
  if (!wrapper) return;
  const track = wrapper.firstElementChild;
  if (!track) return;

  let isDragging = false;
  let isWheelScrolling = false;
  let startX = 0;
  let dragStartX = 0;
  let currentX = 0;
  let wheelTimeout = null;
  let animId = null;
  let dragMoved = false;
  let lastTime = performance.now();

  function getSingleSetWidth() {
    const originalCount = parseInt(track.dataset.originalCount, 10) || Math.floor(track.children.length / 4);
    if (!track.children || track.children.length <= originalCount) return 0;
    const firstChild = track.children[0];
    const targetChild = track.children[originalCount];
    if (!firstChild || !targetChild) return 0;
    const dist = targetChild.offsetLeft - firstChild.offsetLeft;
    if (dist > 0) return dist;
    const reps = 4;
    return track.scrollWidth / reps;
  }

  function wrapX() {
    const setWidth = getSingleSetWidth();
    if (!setWidth || setWidth <= 0) return;

    while (currentX >= setWidth) {
      currentX -= setWidth;
    }
    while (currentX < 0) {
      currentX += setWidth;
    }
  }

  function applyTransform() {
    track.style.transform = `translate3d(${-currentX}px, 0, 0)`;
  }

  function resetMarquee() {
    currentX = 0;
    applyTransform();
  }

  track.__resetMarquee = resetMarquee;

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!isDragging && !isWheelScrolling) {
      currentX += speedPxPerSec * dt;
      wrapX();
      applyTransform();
    }
    animId = requestAnimationFrame(tick);
  }

  if (animId) cancelAnimationFrame(animId);
  lastTime = performance.now();
  animId = requestAnimationFrame(tick);

  wrapper.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      isWheelScrolling = true;
      currentX += e.deltaX;
      wrapX();
      applyTransform();

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        isWheelScrolling = false;
      }, 600);
    }
  }, { passive: true });

  wrapper.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragMoved = false;
    startX = e.clientX;
    dragStartX = currentX;
    wrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) dragMoved = true;
    currentX = dragStartX - dx;
    wrapX();
    applyTransform();
  });

  const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
  };

  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);

  wrapper.addEventListener('click', (e) => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved = false;
    }
  }, true);
}

function init3dTeamCards() {
  const teamGrid = document.getElementById('teamGrid');
  if (!teamGrid) return;

  teamGrid.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.team-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 16;
    const rotateY = ((x - centerX) / centerX) * 16;

    const inner = card.querySelector('.flip-card-inner');
    if (inner) {
      if (card.classList.contains('flipped')) {
        inner.style.transform = `rotateY(180deg) rotateX(${-rotateX}deg) rotateZ(${-rotateY * 0.25}deg) scale3d(1.05, 1.05, 1.05)`;
      } else {
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      }
    }
  });

  teamGrid.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.team-card');
    if (!card) return;
    const related = e.relatedTarget;
    if (related && card.contains(related)) return;

    const inner = card.querySelector('.flip-card-inner');
    if (inner) {
      if (card.classList.contains('flipped')) {
        inner.style.transform = 'rotateY(180deg)';
      } else {
        inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  renderEvents();renderProjects();renderTeam();renderBenefits();renderResources();
  initReveal();initNavbar();initEventTabs();initResourceFilters();initCounters();
  initInteractiveMarquee('.events-marquee-wrapper', 85);
  initInteractiveMarquee('.team-marquee-wrapper', -85);
  init3dTeamCards();
  const hc=document.getElementById('heroCanvas');
  if(hc) new MatrixCanvas(hc,{count:60,maxDist:150});
  const cc=document.getElementById('ctaCanvas');
  if(cc) new MatrixCanvas(cc,{count:30,maxDist:120});
  initAboutCanvas();
  initAboutScroll();
  initGithubGrid();
  initDomainsScrollStack();
  initOrbit();
  initAxeCursorRotation();
  initCta3dOrbit();
  initHeroMoneyTicker();
  initAboutVariableText();
  initJoinModal();
  initPreventTopOverscroll();
  document.querySelectorAll('.reveal-up').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i*.06,.4)}s`});
});

function initPreventTopOverscroll() {
  window.addEventListener('wheel', (e) => {
    if (window.scrollY <= 0 && e.deltaY < 0) {
      e.preventDefault();
    }
  }, { passive: false });
}

function initAboutVariableText() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const targetEls = aboutSection.querySelectorAll('.habito-about-subtitle, .habito-about-desc');

  targetEls.forEach(el => {
    const childNodes = Array.from(el.childNodes);
    el.innerHTML = '';

    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const parts = text.split(/(\s+)/);
        parts.forEach(w => {
          if (w.trim().length > 0) {
            const span = document.createElement('span');
            span.className = 'v-word';
            span.textContent = w;
            el.appendChild(span);
          } else if (w.length > 0) {
            el.appendChild(document.createTextNode(w));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'STRONG') {
          const text = node.textContent;
          const parts = text.split(/(\s+)/);
          parts.forEach(w => {
            if (w.trim().length > 0) {
              const span = document.createElement('span');
              span.className = 'v-word v-strong';
              span.textContent = w;
              el.appendChild(span);
            } else if (w.length > 0) {
              el.appendChild(document.createTextNode(w));
            }
          });
        } else {
          el.appendChild(node);
        }
      }
    });
  });

  const allWords = aboutSection.querySelectorAll('.v-word');
  if (!allWords.length) return;

  const radius = 200;
  const minWeight = 300;
  const maxWeight = 850;

  let ticking = false;
  let mouseX = -9999;
  let mouseY = -9999;

  function updateWeights() {
    allWords.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordX = rect.left + rect.width / 2;
      const wordY = rect.top + rect.height / 2;

      const dist = Math.hypot(mouseX - wordX, mouseY - wordY);

      if (dist < radius) {
        const norm = 1 - (dist / radius);
        const falloff = Math.pow(norm, 1.3);
        const weight = Math.round(minWeight + (maxWeight - minWeight) * falloff);
        const scale = 1 + (0.06 * falloff);

        word.style.fontWeight = weight;
        word.style.transform = `scale(${scale.toFixed(3)})`;
        word.style.color = '#000000';
      } else {
        word.style.fontWeight = word.classList.contains('v-strong') ? '700' : '300';
        word.style.transform = '';
        word.style.color = '';
      }
    });

    ticking = false;
  }

  aboutSection.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateWeights);
    }
  });

  aboutSection.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
    allWords.forEach(word => {
      word.style.fontWeight = word.classList.contains('v-strong') ? '700' : '300';
      word.style.transform = '';
      word.style.color = '';
    });
  });
}

function initHeroMoneyTicker() {
  const el = document.getElementById('heroMoneyTicker');
  if (!el) return;

  const words = [
    'MONEY',
    'पैसा',
    'টাকা',
    'お金',
    '钱',
    'Dinero',
    'Argent',
    'مال',
    'Деньги'
  ];

  let currentIndex = 0;

  function rotateWord() {
    const currentWord = words[currentIndex];
    const holdDuration = (currentWord === 'MONEY') ? 3000 : 200;

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      el.textContent = words[currentIndex];
      rotateWord();
    }, holdDuration);
  }

  rotateWord();
}

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

  document.querySelectorAll('.trigger-join-modal, .nav-cta').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.join-submit-btn');

      const isUnconfigured = !GOOGLE_SHEET_WEBHOOK_URL ||
        GOOGLE_SHEET_WEBHOOK_URL.trim() === '' ||
        GOOGLE_SHEET_WEBHOOK_URL.includes('PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE');

      if (isUnconfigured) {
        console.error('Google Sheets Integration Error: GOOGLE_SHEET_WEBHOOK_URL is not configured. Please paste your deployed Web App URL ending in /exec into script.js.');
        alert('Configuration Notice: The Google Sheets Web App URL is not set yet in script.js. Please paste your deployed Google Apps Script URL ending in /exec into GOOGLE_SHEET_WEBHOOK_URL.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

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

      try {
        const savedMembers = JSON.parse(localStorage.getItem('matrixMembers') || '[]');
        savedMembers.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('matrixMembers', JSON.stringify(savedMembers));
      } catch (backupErr) {
        console.warn('LocalStorage backup error:', backupErr);
      }

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

function initCta3dOrbit() {
  const stage = document.getElementById('cta3dOrbitStage');
  if (!stage) return;

  const tags = stage.querySelectorAll('.cta-orbit-tag');
  if (!tags.length) return;

  const total = tags.length;

  function positionCtaTagsStatic() {
    const isMobile = window.innerWidth < 600;
    const Rx = isMobile ? 210 : 480;
    const Ry = isMobile ? 90 : 175;

    tags.forEach((tag, idx) => {
      const angle = (idx / total) * Math.PI * 2;
      const x = Math.cos(angle) * Rx;
      const y = Math.sin(angle) * Ry;

      tag.style.position = 'absolute';
      tag.style.top = '50%';
      tag.style.left = '50%';
      tag.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(0.85)`;
      tag.style.opacity = '0.9';
      tag.style.zIndex = '5';
    });
  }

  positionCtaTagsStatic();
  window.addEventListener('resize', positionCtaTagsStatic);
}
