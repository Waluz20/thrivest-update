
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = n => '$' + Number(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});

// Session & user (demo only)
function saveUser(u){ localStorage.setItem('thriv_user', JSON.stringify(u)); }
function getUser(){ try{ return JSON.parse(localStorage.getItem('thriv_user')||'null'); }catch(e){ return null; } }
function setSession(email){ localStorage.setItem('thriv_session', email); }
function getSession(){ return localStorage.getItem('thriv_session'); }
function logout(){ localStorage.removeItem('thriv_session'); location.href='index.html'; }

// Parallax
function applyParallax(){
  const y = window.scrollY;
  $$('.parallax').forEach(el=>{
    const s = parseFloat(el.dataset.speed || '0.2');
    el.style.transform = `translateY(${y * -s}px)`;
  });
}
window.addEventListener('scroll', applyParallax);

// Markets
function seedMarkets(){
  const list = $('#marketList');
  if(!list) return;
  const syms = ['BTC','ETH','SOL','BNB','XRP','ADA','MATIC','LTC','DOGE','DOT'];
  for(let i=0;i<16;i++){
    const s = syms[i % syms.length];
    const price = (Math.random()*50000+500).toFixed(2);
    const chg = (Math.random()*6-3).toFixed(2);
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div class="sym">${s}/USDT</div><div>$${price}</div><div class="chg ${chg>=0?'pos':'neg'}">${chg}%</div>`;
    list.appendChild(row);
  }
}

// Ticker
function buildTicker(){
  const t = $('#ticker');
  if(!t) return;
  const items = ['BTC +2.4%','ETH +1.9%','SOL -0.7%','GOLD +0.5%','OIL -0.3%','NAS100 +0.6%','EURUSD +0.2%','GBPUSD -0.1%'];
  const html = items.concat(items).map(v=>`<span>${v}</span>`).join(' • ');
  t.innerHTML = html;
}

// Bot activity (fake)
function botActivity(){
  const el = $('#botStream');
  if(!el) return;
  const names = ['Alice','Brian','Carla','Dante','Eva','Felix','Grace','Hector','Ivy','Jamal','Kara','Leo'];
  const plans = ['Bronze','Silver','Gold','Platinum'];
  function push(msg){ const d=document.createElement('div'); d.className='msg'; d.textContent=msg; el.appendChild(d); el.scrollTop = el.scrollHeight; }
  function tick(){
    const n = names[Math.floor(Math.random()*names.length)];
    const p = plans[Math.floor(Math.random()*plans.length)];
    const amt = Math.floor(Math.random()*4000)+100;
    const side = Math.random()>0.5 ? 'BUY' : 'SELL';
    push(`${new Date().toLocaleTimeString()} — Bot executed ${side} ${Math.random()>0.5?'BTC':'ETH'} for ${n} (${p}) — ${fmt(amt)}`);
  }
  for(let i=0;i<5;i++) tick();
  setInterval(tick, 1800);
}

// Leaderboard (fake)
function seedLeaderboard(){
  const lb = $('#leaderboard');
  if(!lb) return;
  const data = [
    ['Noah', 15230], ['Maya', 13880], ['Omar', 12950],
    ['Ava', 11720], ['Zane', 10940], ['Liam', 10310],
  ];
  data.forEach(([name, val], i)=>{
    const row = document.createElement('div'); row.className='item';
    row.innerHTML = `<div class="avatar"></div><div><b>#${i+1} ${name}</b><div class="muted">7d PnL</div></div><div style="margin-left:auto;font-weight:800">${fmt(val)}</div>`;
    lb.appendChild(row);
  });
}

// Chat mock
function initChat(){
  const fab = $('#chatFab'), panel = $('#chatPanel'), input=$('#chatInput'), send=$('#chatSend'), msgs=$('#chatMessages');
  if(!fab) return;
  fab.onclick = ()=>{ panel.style.display = (panel.style.display==='block'?'none':'block'); };
  function push(role, text){
    const b = document.createElement('div');
    b.className = 'chip'; b.textContent = (role==='agent'?'Support: ':'You: ')+text;
    msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight;
  }
  if(send){
    send.onclick = ()=>{
      const v = (input.value||'').trim(); if(!v) return;
      push('user', v); input.value='';
      setTimeout(()=> push('agent', 'Thanks! A support agent will reply via email shortly.'), 600);
    };
  }
}

// Calculator
function initCalc(){
  const form = $('#calcForm'); if(!form) return;
  const amt = $('#amount'), plan = $('#planSelect'), result = $('#calcResult'), rv = $('#resultVals'), investBtn = $('#investDemo');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const a = Math.max(0, Number(amt.value||0));
    const rate = Number(plan.value); // 0.05, 0.10, 0.20, 0.35
    const roi = a * rate;
    rv.innerHTML = `Invest: <b>${fmt(a)}</b><br>Rate: <b>${(rate*100).toFixed(0)}%</b><br>Expected ROI: <b>${fmt(roi)}</b><br>Total: <b>${fmt(a+roi)}</b>`;
    result.classList.remove('hidden');
  });
  $('#resetCalc').onclick = ()=>{ amt.value=''; plan.value='0.05'; result.classList.add('hidden'); rv.innerHTML=''; };
  if(investBtn){
    investBtn.onclick = ()=>{
      const a = Math.max(0, Number(amt.value||0)); const rate = Number(plan.value);
      if(a<=0) return alert('Enter amount first');
      const invs = JSON.parse(localStorage.getItem('thriv_investments')||'[]');
      invs.push({ amount:a, rate, at: Date.now(), plan: { '0.05':'Bronze','0.10':'Silver','0.20':'Gold','0.35':'Platinum' }[String(rate)] });
      localStorage.setItem('thriv_investments', JSON.stringify(invs));
      alert('Demo investment added. See it on your dashboard.');
      location.href='dashboard.html';
    };
  }
}

// Auth
function initAuth(){
  const sForm = $('#signupForm'); const lForm = $('#loginForm');
  if(sForm){
    sForm.addEventListener('submit', e=>{
      e.preventDefault();
      const u = { name: $('#signupName').value.trim(), email: $('#signupEmail').value.trim(), pass: $('#signupPass').value };
      if(!u.name||!u.email||!u.pass) return;
      saveUser(u); setSession(u.email); location.href='dashboard.html';
    });
  }
  if(lForm){
    lForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = $('#loginEmail').value.trim(); const pass = $('#loginPass').value;
      const u = getUser();
      if(!u || u.email!==email || u.pass!==pass){
        // Allow demo login even if not signed up
        setSession(email||'demo@user.com');
      }else{
        setSession(u.email);
      }
      location.href='dashboard.html';
    });
  }
}

// Dashboard
function initDashboard(){
  if(!/dashboard\.html/.test(location.pathname)) return;
  const email = getSession(); if(!email){ location.href='login.html'; return; }
  $('#userEmail').textContent = email;
  const u = getUser(); $('#userName').textContent = (u && u.name) ? u.name : 'Investor';
  $('#logoutBtn').onclick = logout;
  const invs = JSON.parse(localStorage.getItem('thriv_investments')||'[]');
  const list = $('#portfolioList');
  if(invs.length===0){ list.innerHTML = '<div class="muted">No investments yet. Use the calculator to add one.</div>'; }
  let total = 0;
  invs.forEach(x=>{
    const roi = x.amount * x.rate;
    total += x.amount + roi;
    const div = document.createElement('div');
    div.className='item';
    div.innerHTML = `<div><b>${x.plan}</b> — ${fmt(x.amount)}</div><div>ROI: <b>${(x.rate*100).toFixed(0)}%</b> (${fmt(roi)})</div>`;
    list.appendChild(div);
  });
  $('#totalBalance').textContent = fmt(total);
  $('#activeInvest').textContent = String(invs.length);
  $('#weeklyROI').textContent = (invs.reduce((a,x)=>a+x.rate,0)*100).toFixed(1)+'%';
  const earnList = $('#earnList');
  if(earnList){
    earnList.innerHTML = '';
    invs.slice(-5).forEach(x=>{
      const li = document.createElement('li');
      li.textContent = `${x.plan} — Earned ${fmt(x.amount * x.rate)} this cycle`;
      earnList.appendChild(li);
    });
  }
  $('#addFake').onclick = ()=>{
    const amount = Math.floor(Math.random()*900+100);
    const rates = [0.05,0.10,0.20,0.35];
    const rate = rates[Math.floor(Math.random()*rates.length)];
    invs.push({amount, rate, at:Date.now(), plan:{'0.05':'Bronze','0.10':'Silver','0.20':'Gold','0.35':'Platinum'}[String(rate)]});
    localStorage.setItem('thriv_investments', JSON.stringify(invs));
    location.reload();
  };
}

document.addEventListener('DOMContentLoaded', ()=>{
  applyParallax();
  seedMarkets();
  buildTicker();
  botActivity();
  seedLeaderboard();
  initChat();
  initCalc();
  initAuth();
  initDashboard();
});
