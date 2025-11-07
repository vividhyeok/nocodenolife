async function fetchProjects(){
  const res = await fetch('projects.json');
  if(!res.ok) throw new Error('projects.json 로드 실패');
  return res.json();
}

// Skeleton 로딩 표시
function showSkeleton(count=6){
  const grid = document.getElementById('gallery');
  grid.dataset.state = 'loading';
  grid.innerHTML='';
  for(let i=0;i<count;i++){
    const card=document.createElement('article');
    card.className='card skeleton';
    card.innerHTML=`<div class="card-media"><div class="thumb"></div><div class="media-overlay"></div></div>
    <div class="card-body">
      <div class="card-top"><div class="title"></div><div class="badge" style="width:42px; height:16px;"></div></div>
      <div class="meta"></div>
      <div class="desc"></div>
      <div class="actions"></div>
    </div>`;
    grid.appendChild(card);
  }
}

function renderCards(items){
  const grid = document.getElementById('gallery');
  const tpl = document.getElementById('card-tpl');
  grid.innerHTML = '';
  grid.dataset.state='ready';
  items.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    const article = node.querySelector('.card');
    article.dataset.id = p.id;
    article.classList.add('reveal');

    const img = node.querySelector('.thumb');
    img.src = p.thumb || 'assets/thumb-default.svg';
    img.alt = `${p.title} thumbnail`;
    img.addEventListener('error', ()=>{ try { if(!img.dataset.fallback){ img.dataset.fallback='1'; img.src='assets/thumb-default.svg'; } } catch(e){} });

    node.querySelector('.title').textContent = p.title;
    node.querySelector('.badge').textContent = p.tech;
    node.querySelector('.meta').textContent = `${p.team} · ${p.type.toUpperCase()}`;
    node.querySelector('.desc').textContent = p.desc || '';

    const actions = node.querySelector('.actions');

    // overlay action
    const overlayBtn = node.querySelector('.action-primary');
    overlayBtn.textContent = (p.type==='video' || p.type==='minecraft') ? '영상 재생' : (p.type==='zip' ? '다운로드' : '바로 보기');
    overlayBtn.addEventListener('click', (e)=>{
      e.preventDefault(); openModal(p);
    });
    // also click on image opens
    img.addEventListener('click', (e)=>{ e.preventDefault(); openModal(p); });

    // team details button
    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'btn btn-secondary';
    detailsBtn.textContent = '팀 활동 상세';
    detailsBtn.addEventListener('click', (e) => { e.preventDefault(); openTeamModal(p); });
    actions.appendChild(detailsBtn);

    grid.appendChild(node);
  });
  observeReveal();
}

function wireFilters(all){
  const chips = document.querySelectorAll('#filters .chip');
  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('is-active'));
      ch.classList.add('is-active');
      const f = ch.dataset.filter;
      let list = all;
      if(f === 'zip') list = all.filter(p=>p.type==='zip');
      else if(f === 'video') list = all.filter(p=>p.type==='video' || p.type==='minecraft');
      else if(f === 'Scratch' || f === 'RenPy') list = all.filter(p=>p.tech===f);
      renderCards(list);
      document.getElementById('gallery').scrollIntoView({behavior:'smooth'});
    });
  });
}

function openModal(p){
  const modal = document.getElementById('modal');
  const frame = document.getElementById('modal-frame');
  const video = document.getElementById('modal-video');
  const title = document.getElementById('modal-title');
  const dlBox = document.getElementById('modal-download');
  const dlLink = document.getElementById('modal-download-link');
  if(!dlLink){ console.warn('modal-download-link 요소가 없습니다. index.html 수정 필요'); }

  title.textContent = `${p.title} – ${p.team}`;

  // reset
  frame.hidden = true; frame.src='about:blank';
  video.hidden = true; try { video.pause(); video.removeAttribute('src'); video.load(); } catch(e) {}
  dlBox.hidden = true; dlLink.removeAttribute('href'); dlLink.removeAttribute('download');

  if(p.type === 'zip'){
    dlBox.hidden = false;
    if(dlLink){ dlLink.href = p.url; dlLink.setAttribute('download', p.url.split('/').pop()); }
  } else if (p.type === 'video' || p.type === 'minecraft') {
    const source = document.createElement('source');
    source.src = p.url; source.type = guessMime(p.url);
    while (video.firstChild) video.removeChild(video.firstChild);
    video.appendChild(source);
    video.hidden = false;
    try { video.load(); video.play().catch(()=>{}); } catch(e) {}
  } else {
    frame.hidden = false;
    frame.src = p.url;
  }
  modal.hidden = false;
}

function closeModal(){
  const modal = document.getElementById('modal');
  const frame = document.getElementById('modal-frame');
  frame.src = 'about:blank';
  modal.hidden = true;
}

function wireModal(){
  const modal = document.getElementById('modal');
  modal.addEventListener('click', (e)=>{
    if (e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && !modal.hidden) closeModal();
  });
}

async function main(){
  try {
    const modalEl = document.getElementById('modal');
    if (modalEl) {
      modalEl.style.display = 'none';
      modalEl.hidden = true;
    }
    closeModal();
  } catch(e) {}
  try{
    showSkeleton();
    const items = await fetchProjects();
    renderCards(items);
    wireFilters(items);
    wireModal();
    wireTeamModal();
    setTimeout(()=>{ const m=document.getElementById('modal'); if(m && !m.hidden){ m.style.display='none'; closeModal(); } }, 50);
    window.addEventListener('load', ()=>{ const m=document.getElementById('modal'); if(m && !m.hidden){ m.style.display='none'; closeModal(); } });
  }catch(err){
    console.error(err);
    document.getElementById('gallery').innerHTML = '<p style="color:#f88">프로젝트 목록을 불러오지 못했습니다.</p>';
  }
}

main();

function guessMime(url){
  const u = url.split('?')[0].toLowerCase();
  if (u.endsWith('.mp4')) return 'video/mp4';
  if (u.endsWith('.webm')) return 'video/webm';
  if (u.endsWith('.ogg') || u.endsWith('.ogv')) return 'video/ogg';
  return 'application/octet-stream';
}

function openTeamModal(p){
  const modal = document.getElementById('team-modal');
  const title = document.getElementById('team-modal-title');
  const content = document.getElementById('team-modal-content');
  title.textContent = `${p.team} 활동 상세`;
  content.innerHTML = `<pre>${p.details || '상세 정보가 없습니다.'}</pre>`;
  modal.hidden = false;
}

function closeTeamModal(){
  const modal = document.getElementById('team-modal');
  modal.hidden = true;
}

function wireTeamModal(){
  const modal = document.getElementById('team-modal');
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeTeamModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modal.hidden) closeTeamModal();
  });
}

// IntersectionObserver 로 카드 순차 등장
function observeReveal(){
  const cards=[...document.querySelectorAll('.reveal')];
  if(!('IntersectionObserver' in window)){
    cards.forEach(c=>c.classList.add('is-visible')); return;
  }
  const io=new IntersectionObserver(entries=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('is-visible');
        io.unobserve(ent.target);
      }
    });
  },{threshold:.12});
  cards.forEach(c=>io.observe(c));
}

// 버튼 ripple 효과(이벤트 위임)
document.addEventListener('click', e=>{
  const btn=e.target.closest('.btn, .chip');
  if(!btn) return;
  const rect=btn.getBoundingClientRect();
  const span=document.createElement('span');
  span.className='ripple';
  const size=Math.max(rect.width, rect.height);
  span.style.width=span.style.height=size+'px';
  span.style.left=(e.clientX-rect.left-size/2)+'px';
  span.style.top=(e.clientY-rect.top-size/2)+'px';
  btn.appendChild(span);
  setTimeout(()=>{ span.remove(); }, 650);
});

// 카드 3D 틸트(마우스) 효과
document.addEventListener('mousemove', e=>{
  document.querySelectorAll('.card').forEach(card=>{
    if(!card.matches(':hover')) return; // hover 된 카드만
    const r=card.getBoundingClientRect();
    const x=(e.clientX - r.left)/r.width; // 0..1
    const y=(e.clientY - r.top)/r.height;
    const tiltX=(y-.5)*8; // -4..4
    const tiltY=(x-.5)*8;
    card.style.transform=`translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
});

document.addEventListener('mouseleave', ()=>{
  document.querySelectorAll('.card').forEach(c=>{ c.style.transform=''; });
});

// 테마 토글 (light/dark)
const themeBtn=document.getElementById('theme-toggle');
if(themeBtn){
  themeBtn.addEventListener('click', ()=>{
    const body=document.body;
    const light = body.getAttribute('data-theme')==='light';
    if(light){ body.removeAttribute('data-theme'); }
    else { body.setAttribute('data-theme','light'); }
  });
}
