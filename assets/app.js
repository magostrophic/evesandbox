/* ---- where am I? one file per page, or the single-file preview ---- */
var EVE_PAGE=document.body.getAttribute('data-page')||'';
var EVE_BASE=(function(){
 if(!EVE_PAGE)return '';
 if(EVE_PAGE==='404')return '/';
 var p=location.pathname.replace(/index\.html$/,'');if(p.slice(-1)!=='/')p+='/';
 var seg=EVE_PAGE==='home'?'':EVE_PAGE+'/';
 return seg&&p.slice(-seg.length)===seg?p.slice(0,-seg.length):p;
})();
/* ---- themed dropdowns, number steppers and a visible scroll bar ---- */
(function(){
 var CH='<svg class="cs-c" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
 var UP='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';
 var DN='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
 var OPEN=null;
 function fire(el){el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
 /* keep the look in sync when code sets a select's value directly */
 ['value','selectedIndex'].forEach(function(k){var d=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,k);if(!d||!d.set)return;
  Object.defineProperty(HTMLSelectElement.prototype,k,{get:d.get,set:function(v){d.set.call(this,v);if(this._cs)this._cs.sync();},configurable:true});});
 function closeP(){if(!OPEN)return;var o=OPEN;OPEN=null;o.p.remove();o.t.setAttribute('aria-expanded','false');o.t.classList.remove('open');
  document.removeEventListener('pointerdown',o.dn,true);document.removeEventListener('keydown',o.kd,true);window.removeEventListener('resize',closeP);window.removeEventListener('scroll',o.sc,true);}
 function openP(s,t){
  closeP();if(s.disabled)return;
  var opts=Array.prototype.slice.call(s.options),p=document.createElement('div');
  p.className='cs-p';p.setAttribute('role','listbox');p.tabIndex=-1;
  opts.forEach(function(o,i){var d=document.createElement('div');d.className='cs-o'+(i===s.selectedIndex?' sel':'')+(o.disabled?' dis':'');d.setAttribute('role','option');d.setAttribute('aria-selected',i===s.selectedIndex?'true':'false');d.dataset.i=i;
   d.innerHTML='<span>'+(o.textContent.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];})||'&nbsp;')+'</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';p.appendChild(d);});
  document.body.appendChild(p);
  var r=t.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight;
  p.style.minWidth=Math.max(r.width,150)+'px';p.style.maxWidth=Math.min(vw-16,360)+'px';
  var ph=Math.min(p.scrollHeight,280),below=vh-r.bottom-12,above=r.top-12,up=below<ph&&above>below;
  p.style.maxHeight=Math.max(120,Math.min(280,up?above:below))+'px';
  var pw=p.offsetWidth,left=Math.max(8,Math.min(r.left,vw-pw-8));p.style.left=left+'px';
  if(up)p.style.bottom=(vh-r.top+6)+'px';else p.style.top=(r.bottom+6)+'px';
  t.setAttribute('aria-expanded','true');t.classList.add('open');
  var cur=p.querySelector('.sel');if(cur)p.scrollTop=Math.max(0,cur.offsetTop-p.clientHeight/2+cur.offsetHeight/2);
  var hi=s.selectedIndex;
  function mark(i){var els=p.children;if(hi>=0&&els[hi])els[hi].classList.remove('hi');hi=i;if(els[hi]){els[hi].classList.add('hi');els[hi].scrollIntoView({block:'nearest'});}}
  function pick(i){var o=opts[i];if(!o||o.disabled)return;var ch=s.selectedIndex!==i;s.selectedIndex=i;closeP();t.focus({preventScroll:true});if(ch)fire(s);}
  p.onpointerdown=function(e){e.preventDefault();};
  p.onclick=function(e){var d=e.target.closest('.cs-o');if(d)pick(+d.dataset.i);};
  p.onpointermove=function(e){var d=e.target.closest('.cs-o');if(d&&!d.classList.contains('dis')&&+d.dataset.i!==hi)mark(+d.dataset.i);};
  var ta='',tt=0;
  var kd=function(e){
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeP();t.focus({preventScroll:true});return;}
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();var n=hi+(e.key==='ArrowDown'?1:-1);while(opts[n]&&opts[n].disabled)n+=e.key==='ArrowDown'?1:-1;if(opts[n])mark(n);return;}
   if(e.key==='Home'||e.key==='End'){e.preventDefault();mark(e.key==='Home'?0:opts.length-1);return;}
   if(e.key==='Enter'||(e.key===' '&&!(ta&&Date.now()-tt<700))){e.preventDefault();pick(hi);return;}
   if(e.key==='Tab'){closeP();return;}
   if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){e.preventDefault();var now=Date.now();ta=(now-tt<700?ta:'')+e.key.toLowerCase();tt=now;var hit=-1,i,kk;
    for(i=0;i<opts.length&&hit<0;i++){kk=opts[i].getAttribute('data-a');if(kk&&!opts[i].disabled&&(' '+kk+' ').indexOf(' '+ta+' ')>=0)hit=i;}
    for(i=0;i<opts.length&&hit<0;i++)if(!opts[i].disabled&&opts[i].textContent.trim().toLowerCase().indexOf(ta)===0)hit=i;
    for(i=0;i<opts.length&&hit<0;i++){kk=opts[i].getAttribute('data-k');if(kk&&!opts[i].disabled&&(' '+kk).indexOf(' '+ta)>=0)hit=i;}
    if(hit>=0)mark(hit);}
  };
  var dn=function(e){if(!p.contains(e.target)&&!t.contains(e.target))closeP();};
  var sc=function(e){if(!p.contains(e.target))closeP();};
  document.addEventListener('pointerdown',dn,true);document.addEventListener('keydown',kd,true);window.addEventListener('resize',closeP);window.addEventListener('scroll',sc,true);
  OPEN={p:p,t:t,dn:dn,kd:kd,sc:sc};mark(hi);
 }
 function selEnh(s){
  if(s._cs||s.multiple||s.size>1||!s.parentNode)return;
  var t=document.createElement('button');t.type='button';t.className='cs-t '+(s.className||'');
  var st=s.getAttribute('style');if(st)t.setAttribute('style',st);
  t.setAttribute('aria-haspopup','listbox');t.setAttribute('aria-expanded','false');
  var al=s.getAttribute('aria-label');if(al)t.setAttribute('aria-label',al);
  t.innerHTML='<span class="cs-v"></span>'+CH;
  s.parentNode.insertBefore(t,s.nextSibling);
  s.classList.add('cs-h');s.tabIndex=-1;s.setAttribute('aria-hidden','true');
  var api={sync:function(){var o=s.options[s.selectedIndex];t.firstChild.textContent=o?(o.getAttribute('data-short')||o.textContent):'';if(!t.firstChild.textContent)t.firstChild.innerHTML='&nbsp;';t.disabled=s.disabled;}};
  s._cs=api;api.sync();
  t.addEventListener('click',function(e){e.preventDefault();if(OPEN&&OPEN.t===t)closeP();else{api.sync();openP(s,t);}});
  t.addEventListener('keydown',function(e){if(OPEN&&OPEN.t===t)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();api.sync();openP(s,t);}});
  s.addEventListener('click',function(e){if(e.isTrusted===false||e.detail===0){api.sync();t.focus({preventScroll:true});openP(s,t);}});
 }
 function numEnh(i){
  if(i._nw||i.type!=='number'||!i.parentNode)return;
  var w=document.createElement('span');w.className='nw';
  if(i.style.width){w.style.width=i.style.width;w.style.display='inline-block';i.style.width='100%';}
  i.parentNode.insertBefore(w,i);w.appendChild(i);
  var st=document.createElement('span');st.className='nst';st.innerHTML='<button type="button" tabindex="-1" aria-label="Increase">'+UP+'</button><button type="button" tabindex="-1" aria-label="Decrease">'+DN+'</button>';
  w.appendChild(st);i._nw=1;
  function step(dir){try{if(dir>0)i.stepUp();else i.stepDown();}catch(e){var v=parseFloat(i.value)||0;i.value=v+dir;}fire(i);}
  var tm=0,iv=0;function stop(){clearTimeout(tm);clearInterval(iv);}
  Array.prototype.forEach.call(st.children,function(b,k){var dir=k===0?1:-1;
   b.addEventListener('pointerdown',function(e){e.preventDefault();if(i.disabled||i.readOnly)return;i.focus({preventScroll:true});step(dir);stop();tm=setTimeout(function(){iv=setInterval(function(){step(dir);},70);},400);});
   ['pointerup','pointerleave','pointercancel'].forEach(function(n){b.addEventListener(n,stop);});});
 }
 function scan(n){
  if(n.nodeType!==1)return;
  if(n.tagName==='SELECT')selEnh(n);else if(n.tagName==='INPUT')numEnh(n);
  if(n.querySelectorAll){n.querySelectorAll('select').forEach(selEnh);n.querySelectorAll('input[type=number]').forEach(numEnh);}
 }
 new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan);});}).observe(document.body,{childList:true,subtree:true});
 scan(document.body);
 window.addEventListener('hashchange',closeP);
 /* a slim blue scroll indicator for phones: shows while scrolling, fades away when idle */
 var bar=document.createElement('div'),th=document.createElement('div'),de=document.documentElement,hd=document.getElementById('hdr'),raf=0,hideT=0,lastY=-1;
 bar.id='sbar';bar.setAttribute('aria-hidden','true');th.id='sthumb';bar.appendChild(th);document.body.appendChild(bar);
 function upd(){raf=0;
  if(window.innerWidth-de.clientWidth>2){bar.style.display='none';return;}
  var H=window.innerHeight,T=Math.max(de.scrollHeight,document.body.scrollHeight),max=T-H;
  if(max<24){bar.style.display='none';return;}
  bar.style.display='block';
  var top=Math.max(0,hd?hd.getBoundingClientRect().bottom:0)+6,tr=Math.max(40,H-top-10),h=Math.max(36,Math.min(tr,Math.round(tr*H/T))),y=top+(tr-h)*Math.min(1,Math.max(0,(window.pageYOffset||de.scrollTop)/max));
  th.style.height=h+'px';th.style.transform='translate3d(0,'+Math.round(y)+'px,0)';
 }
 function onScroll(){
  var y=window.pageYOffset||de.scrollTop;
  if(y!==lastY){lastY=y;bar.classList.add('show');clearTimeout(hideT);hideT=setTimeout(function(){bar.classList.remove('show');},900);}
  if(!raf)raf=requestAnimationFrame(upd);
 }
 function refresh(){if(!raf)raf=requestAnimationFrame(upd);}
 window.addEventListener('scroll',onScroll,{passive:true});
 window.addEventListener('resize',refresh);window.addEventListener('orientationchange',refresh);window.addEventListener('load',refresh);
 window.addEventListener('hashchange',function(){bar.classList.remove('show');setTimeout(refresh,120);});
 if(window.visualViewport)window.visualViewport.addEventListener('resize',refresh);
 if(window.ResizeObserver){var ro=new ResizeObserver(refresh);ro.observe(document.body);ro.observe(de);}
 refresh();setTimeout(refresh,400);
})();

(function(){var im=new Image();im.onload=function(){document.querySelectorAll('.lm').forEach(function(e){e.classList.add('on');});};im.src=EVE_BASE+'evesandbox.png';
['gesturestart','gesturechange','gestureend'].forEach(function(n){document.addEventListener(n,function(e){e.preventDefault();});});
document.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1&&!(e.target.closest&&e.target.closest('.pvw,.vqb')))e.preventDefault();},{passive:false});
document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('.logo'))e.preventDefault();});
document.addEventListener('dragstart',function(e){if(e.target.closest&&e.target.closest('.logo'))e.preventDefault();});})();

/* sliders: keep the blue fill under the thumb, and let the arrow keys move in useful steps */
(function(){
 function fill(el){var mn=el.min===''?0:+el.min,mx=el.max===''?100:+el.max,r=mx>mn?(+el.value-mn)/(mx-mn):0;el.style.setProperty('--r',String(Math.max(0,Math.min(1,r))));}
 function scan(n){if(!n||n.nodeType!==1)return;if(n.matches&&n.matches('input[type=range]'))fill(n);if(n.querySelectorAll)n.querySelectorAll('input[type=range]').forEach(fill);}
 document.addEventListener('input',function(e){var t=e.target;if(t&&t.type==='range')fill(t);},true);
 document.addEventListener('keydown',function(e){var t=e.target;if(!t||t.type!=='range'||!t.dataset.ks)return;
  var k=e.key,ks=+t.dataset.ks,d=k==='ArrowRight'||k==='ArrowUp'?ks:k==='ArrowLeft'||k==='ArrowDown'?-ks:k==='PageUp'?ks*5:k==='PageDown'?-ks*5:0;if(!d)return;
  e.preventDefault();var mn=t.min===''?0:+t.min,mx=t.max===''?100:+t.max;t.value=String(Math.min(mx,Math.max(mn,+t.value+d)));
  t.dispatchEvent(new Event('input',{bubbles:true}));t.dispatchEvent(new Event('change',{bubbles:true}));},true);
 if(window.MutationObserver)new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan);});}).observe(document.documentElement,{childList:true,subtree:true});
 scan(document.documentElement);
})();

(function(){
var IC={
 calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
 pdf:'<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
 shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
 trend:'<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
 down:'<path d="M12 5v14M19 12l-7 7-7-7"/>',
 up:'<path d="m18 15-6-6-6 6"/>',
 dn:'<path d="m6 9 6 6 6-6"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 alert:'<path d="M12 7v6M12 17h.01"/>',
 info:'<path d="M12 16v-5M12 8h.01"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
 ext:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
 calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
 tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
 qr:'<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/>',
 copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
 plus:'<path d="M5 12h14M12 5v14"/>',
 minus:'<path d="M5 12h14"/>',
 fit:'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
 hand:'<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
 swap:'<path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 play:'<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/>',
 code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
 dlbox:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
 upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 speaker:'<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
 mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
 screen:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
 stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>'};
function ico(n,z,w){z=z||20;return '<svg class="i" viewBox="0 0 24 24" width="'+z+'" height="'+z+'" fill="none" stroke="currentColor" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>';}
var COLORS=['#fde68a','#bfdbfe','#fbcfe8','#bbf7d0','#ddd6fe','#fed7aa','#a5f3fc','#fecaca','#d9f99d','#e9d5ff'];
var ALLDAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var KEY='eve-sandbox:planner:v1';
var S={title:'My Study Plan',weekend:true,
 subjects:[{n:'Math',c:COLORS[0]},{n:'Science',c:COLORS[1]},{n:'English',c:COLORS[2]},{n:'History',c:COLORS[3]},{n:'Break',c:COLORS[4]}],
 times:['8:00 - 9:00','9:00 - 10:00','10:00 - 11:00','11:00 - 12:00','2:00 - 3:00'],grid:[]};
try{var raw=localStorage.getItem(KEY);if(raw){var p=JSON.parse(raw);if(p&&p.subjects&&p.times&&p.grid)S=p;}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function days(){return S.weekend?ALLDAYS:ALLDAYS.slice(0,5);}
function cell(r,d){return (S.grid[r]&&S.grid[r][d])||'';}
function colorOf(n){for(var i=0;i<S.subjects.length;i++)if(S.subjects[i].n===n)return S.subjects[i].c;return '';}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var app=document.getElementById('app');

function nav(r){r=({planner:'tools',image:'tools',pdf:'tools',virus:'tools',calc:'tools',deal:'tools',tts:'tools',qr:'tools',grab:'tools',convert:'tools',ide:'tools',eve:'tools',translate:'tools',privacy:'terms'})[r]||r;document.querySelectorAll('#hdr .link').forEach(function(a){a.classList.toggle('on',a.dataset.r===r);});}

function planner(){
 nav('planner');
 var D=days(),h='';
 h+='<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">Study Planner</h1>';
 h+='<input class="title-in" id="ttl" type="text" value="'+esc(S.title)+'" aria-label="Planner title">';
 h+='<div class="chips-wrap"><p class="hint" style="margin:.2em 0 8px">1. Add your subjects</p><div class="chips">';
 S.subjects.forEach(function(s,i){h+='<span class="chip" style="background:'+s.c+'">'+esc(s.n)+'<button data-del="'+i+'" aria-label="Remove '+esc(s.n)+'">'+ico('x',12,3)+'</button></span>';});
 h+='<input type="text" id="ns" placeholder="New subject" maxlength="24" style="width:150px"><button class="btn" id="addS">Add</button></div></div>';
 h+='<p class="hint" style="margin:16px 0 8px">2. Edit the times, then choose a subject for each slot</p>';
 h+='<div class="wrap"><table><thead><tr><th>Time</th>';
 D.forEach(function(d){h+='<th>'+d+'</th>';});
 h+='<th class="x noprint" style="border:0;background:transparent"></th></tr></thead><tbody>';
 S.times.forEach(function(t,r){
  h+='<tr><td class="t"><input type="text" data-t="'+r+'" value="'+esc(t)+'" aria-label="Time slot"></td>';
  D.forEach(function(d,di){
   var v=cell(r,di),c=colorOf(v);
   h+='<td style="background:'+(c||'transparent')+'"><select data-r="'+r+'" data-d="'+di+'" aria-label="'+d+' '+esc(t)+'"><option value="">-</option>';
   S.subjects.forEach(function(s){h+='<option'+(s.n===v?' selected':'')+'>'+esc(s.n)+'</option>';});
   h+='</select></td>';
  });
  h+='<td class="x"><button data-rr="'+r+'" aria-label="Remove row">'+ico('x',16)+'</button></td></tr>';
 });
 h+='</tbody></table></div>';
 h+='<div class="bar"><button class="btn" id="addR">+ Add time slot</button>'+
 '<label class="hint"><input type="checkbox" id="wk"'+(S.weekend?' checked':'')+'> Include weekend</label><span class="sp"></span>'+
 '<button class="btn" id="clr">Clear grid</button><button class="btn" id="prt">Print</button><button class="btn pri" id="dl">Download image</button></div>';
 h+='<p class="hint">Your plan is saved on this device automatically.</p>';
 app.innerHTML=h;

 var $=function(i){return document.getElementById(i);};
 $('ttl').oninput=function(e){S.title=e.target.value;save();};
 function addSubject(){var v=$('ns').value.trim();if(!v)return;
  if(S.subjects.some(function(s){return s.n.toLowerCase()===v.toLowerCase();})){toast('That subject already exists');return;}
  S.subjects.push({n:v,c:COLORS[S.subjects.length%COLORS.length]});save();planner();}
 $('addS').onclick=addSubject;
 $('ns').onkeydown=function(e){if(e.key==='Enter')addSubject();};
 app.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){
  var n=S.subjects.splice(+b.dataset.del,1)[0].n;
  S.grid.forEach(function(row){if(row)for(var i=0;i<row.length;i++)if(row[i]===n)row[i]='';});
  save();planner();};});
 app.querySelectorAll('[data-t]').forEach(function(i){i.oninput=function(){S.times[+i.dataset.t]=i.value;save();};});
 app.querySelectorAll('select').forEach(function(s){s.onchange=function(){
  var r=+s.dataset.r,d=+s.dataset.d;if(!S.grid[r])S.grid[r]=[];S.grid[r][d]=s.value;
  s.parentNode.style.background=colorOf(s.value)||'transparent';save();};});
 app.querySelectorAll('[data-rr]').forEach(function(b){b.onclick=function(){
  var r=+b.dataset.rr;S.times.splice(r,1);S.grid.splice(r,1);save();planner();};});
 $('addR').onclick=function(){S.times.push('Time');save();planner();};
 $('wk').onchange=function(e){S.weekend=e.target.checked;save();planner();};
 $('clr').onclick=function(){S.grid=[];save();planner();};
 $('prt').onclick=printPlan;
 $('dl').onclick=download;
}

function printPlan(){
 var did=false,mark=function(){did=true;};window.addEventListener('beforeprint',mark);
 try{window.print();}catch(e){}
 setTimeout(function(){window.removeEventListener('beforeprint',mark);if(!did)planPdf();},600);
}
async function planPdf(){
 toast('Making a PDF you can print\u2026');
 var cv=render();
 try{
  await Promise.race([need('pdflib'),new Promise(function(_,j){setTimeout(function(){j(new Error('timeout'));},10000);})]);var L=PDFLib,doc=await L.PDFDocument.create();
  var png=await new Promise(function(r){cv.toBlob(function(b){b.arrayBuffer().then(r);},'image/png');});
  var im=await doc.embedPng(png),W=841.89,H=595.28,m=28,pg=doc.addPage([W,H]),k=Math.min((W-2*m)/im.width,(H-2*m)/im.height),w=im.width*k,h=im.height*k;
  pg.drawImage(im,{x:(W-w)/2,y:H-m-h,width:w,height:h});
  var b=new Blob([await doc.save()],{type:'application/pdf'}),nm=(S.title||'study-plan').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')||'study-plan';
  await saveBlob(b,nm+'.pdf');
 }catch(e){
  document.getElementById('prev').src=cv.toDataURL('image/png');document.getElementById('modal').classList.add('show');
 }
}
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.style.display='block';clearTimeout(toast.k);toast.k=setTimeout(function(){t.style.display='none';},2600);}

function render(){
 var D=days(),sc=2,tw=150,cw=130,rh=56,hh=48,top=90,pad=24;
 var W=pad*2+tw+cw*D.length,H=top+hh+rh*S.times.length+pad+20;
 var cv=document.createElement('canvas');cv.width=W*sc;cv.height=H*sc;
 var x=cv.getContext('2d');x.scale(sc,sc);
 x.fillStyle='#ffffff';x.fillRect(0,0,W,H);
 var F='system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
 x.fillStyle='#1f2340';x.font='800 28px '+F;x.textBaseline='middle';x.textAlign='left';x.fillText(S.title||'Study Plan',pad,45);
 x.fillStyle='#007aff';x.font='600 13px '+F;x.textAlign='right';x.fillText('Eve Sandbox',W-pad,45);
 var cols=[tw].concat(D.map(function(){return cw;}));
 function box(cx,cy,w,h,fill,txt,font,col){
  x.fillStyle=fill;x.fillRect(cx,cy,w,h);x.strokeStyle='#d1d1d6';x.lineWidth=1;x.strokeRect(cx+.5,cy+.5,w,h);
  if(txt){x.fillStyle=col||'#1f2937';x.font=font;x.textAlign='center';x.fillText(txt.length>16?txt.slice(0,15)+'\u2026':txt,cx+w/2,cy+h/2);}}
 box(pad,top,tw,hh,'#eef4ff','Time','700 15px '+F,'#0a4fb3');
 D.forEach(function(d,i){box(pad+tw+i*cw,top,cw,hh,'#eef4ff',d,'700 15px '+F,'#0a4fb3');});
 S.times.forEach(function(t,r){
  var y=top+hh+r*rh;
  box(pad,y,tw,rh,'#f7f9fc',t,'600 15px '+F);
  D.forEach(function(d,i){var v=cell(r,i);box(pad+tw+i*cw,y,cw,rh,colorOf(v)||'#ffffff',v,'600 15px '+F);});
 });
 return cv;
}

function download(){
 var cv=render(),name=(S.title||'study-plan').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')||'study-plan';
 cv.toBlob(async function(blob){
  if(!blob){toast('Could not create the image');return;}
  if(await fileSave(blob,name+'.png'))return;
  document.getElementById('prev').src=cv.toDataURL('image/png');
  document.getElementById('modal').classList.add('show');
 },'image/png');
}
document.getElementById('closeM').onclick=function(){document.getElementById('modal').classList.remove('show');};


var I=null;
function mk(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;try{c.getContext('2d',{willReadFrequently:true});}catch(e){}return c;}
function fb(n){return n>1048576?(n/1048576).toFixed(2)+' MB':Math.max(1,Math.round(n/1024))+' KB';}
function cl(v,a,b){return Math.max(a,Math.min(b,v));}
var $$=function(i){return document.getElementById(i);};
async function fileSave(b,name){
 var dls=null;try{dls=window.claude&&await window.claude.use('downloads');}catch(e){}
 if(dls){try{await dls.save({filename:name,data:b});toast('Saved!');return true;}catch(e){if(e&&e.code==='declined')return true;}}
 if(window.showSaveFilePicker&&window.isSecureContext){
  try{
   var ex=(/\.([A-Za-z0-9]+)$/.exec(name)||[])[1]||'',h=await window.showSaveFilePicker({suggestedName:name,types:ex?[{description:ex.toUpperCase()+' file',accept:{[(b.type||'application/octet-stream').split(';')[0]]:['.'+ex.toLowerCase()]}}]:undefined});
   var w=await h.createWritable();await w.write(b);await w.close();toast('Saved!');return true;
  }catch(e){if(e&&e.name==='AbortError')return true;}
 }
 try{
  var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.rel='noopener';a.style.display='none';
  document.body.appendChild(a);a.click();
  setTimeout(function(){a.remove();URL.revokeObjectURL(u);},4000);
  toast('Downloading '+name);return true;
 }catch(e){return false;}
}
async function saveBlob(b,name){
 if(await fileSave(b,name))return;
 if(!/^image\//.test(b.type)){toast('This file could not be saved');return;}
 $$('prev').src=URL.createObjectURL(b);$$('modal').classList.add('show');
}
function imagetool(){
 nav('image');
 app.innerHTML='<h1 style="font-size:2.2rem">Image Tool</h1><p class="lead" style="font-size:1rem">Compress, resize, crop and remove plain backgrounds. Everything happens on your device, so nothing is uploaded.</p>'+
 '<label class="card drop" id="drop"><input type="file" id="file" accept="image/*" hidden>'+ico('upload',28)+'<b>Choose an image</b><span class="hint">or drop it here</span></label><div id="ws"></div>';
 $$('file').onchange=function(e){if(e.target.files[0])loadImg(e.target.files[0]);};
 var d=$$('drop');d.ondragover=function(e){e.preventDefault();};
 d.ondrop=function(e){e.preventDefault();var f=e.dataTransfer.files[0];if(f)loadImg(f);};
 if(I)workspace();
}
function scaled(im){var w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,2500/Math.max(w,h)),c=mk(Math.round(w*k),Math.round(h*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c;}
function blobImg(b){return new Promise(function(res,rej){var u=URL.createObjectURL(b),im=new Image();im.onload=function(){URL.revokeObjectURL(u);res(im);};im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('decode'));};im.src=u;});}
function cvBlank(c){try{var x=c.getContext('2d'),w=c.width,h=c.height;if(!w||!h)return true;for(var i=1;i<6;i++)for(var j=1;j<6;j++){if(x.getImageData(Math.min(w-1,Math.floor(w*i/6)),Math.min(h-1,Math.floor(h*j/6)),1,1).data[3]!==0)return false;}return true;}catch(e){return false;}}
function snapSave(){clearTimeout(snapSave.k);var c=I&&I.cur;if(!c)return;snapSave.k=setTimeout(function(){if(!I||I.cur!==c)return;try{c.toBlob(function(b){if(b&&I&&I.cur===c)I.snap=b;},'image/png');}catch(e){}},500);}
/* phones can throw away a canvas while the page sits in the background: put the picture back when the person returns */
function itRestore(){
 if(!I||!$$('pv')||document.hidden)return;
 var pv=$$('pv');
 if(!cvBlank(I.cur)){if(cvBlank(pv)&&pv.width===I.cur.width)paint();return;}
 var src=I.snap||I.file;if(!src)return;
 var tok=I.rt=(I.rt||0)+1,oldOrig=I.orig,oldCur=I.cur;
 blobImg(src).then(function(im){
  if(!I||I.rt!==tok||I.cur!==oldCur)return;
  var m=I.snap?mk(im.naturalWidth,im.naturalHeight):scaled(im);if(I.snap)m.getContext('2d').drawImage(im,0,0);
  var same=oldCur===oldOrig;I.cur=m;I.base=null;if(same)I.orig=m;
  var fin=function(){
   I.hist=I.hist.map(function(h){return h===oldOrig?I.orig:h;}).filter(function(h){return !cvBlank(h);});
   paint();ctl();
  };
  if(!same&&cvBlank(I.orig)&&I.file){blobImg(I.file).then(function(o){var no=scaled(o);I.hist=I.hist.map(function(h){return h===oldOrig?no:h;});I.orig=no;fin();},fin);}
  else fin();
 },function(){});
}
if(!window.__itR){window.__itR=1;document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(itRestore,60);});window.addEventListener('pageshow',function(){setTimeout(itRestore,60);});window.addEventListener('focus',function(){setTimeout(itRestore,60);});}
function loadImg(file){
 if(!/^image\//.test(file.type)){toast('Please choose an image file');return;}
 var u=URL.createObjectURL(file),im=new Image();
 im.onload=function(){
  var c=scaled(im);URL.revokeObjectURL(u);
  I={file:file,snap:null,vw:0,vh:0,orig:c,cur:c,hist:[],name:file.name.replace(/\.[^.]+$/,'')||'image',size:file.size,tab:'compress',fmt:file.type==='image/png'?'image/png':'image/jpeg',q:.8,tol:30,contig:true,soft:2,gaps:0,bgm:'brush',z:1,pan:false,pd:null,tool:'erase',bs:6,paint:null,last:null,base:null,bgc:null,sel:null,ratio:0,drag:null,est:0};
  workspace();
 };
 im.onerror=function(){toast("Couldn't read that image");};im.src=u;
}
function workspace(){
 var T=[['compress','Compress'],['resize','Resize'],['crop','Crop'],['bg','Remove BG']];
 $$('ws').innerHTML='<div class="seg" id="tabs" style="margin:16px 0">'+T.map(function(t){return '<a data-tab="'+t[0]+'" href="javascript:void 0">'+t[1]+'</a>';}).join('')+'</div>'+
 '<div class="card pcard"><div class="row zb" id="zb"><button class="btn" id="zout" aria-label="Zoom out">'+ico('minus',16,2.5)+'</button><span id="zl">100%</span><button class="btn" id="zin" aria-label="Zoom in">'+ico('plus',16,2.5)+'</button><button class="btn" id="zfit">'+ico('fit',16)+' Fit</button><button class="btn" id="z100">100%</button><button class="btn" id="zpan" aria-label="Move image">'+ico('hand',16)+' Move</button></div><div class="pvw" id="pw"><div id="pin"><canvas id="pv"></canvas><div class="selbox" id="sb"><i style="left:-7px;top:-7px"></i><i style="right:-7px;top:-7px"></i><i style="left:-7px;bottom:-7px"></i><i style="right:-7px;bottom:-7px"></i></div></div></div><p class="hint" id="info" style="margin:8px 0 0"></p></div>'+
 '<div class="card" id="ctl" style="margin-top:14px"></div>'+
 '<div class="bar"><button class="btn" id="undo">Undo</button><button class="btn" id="reset">Reset</button><span class="sp"></span><button class="btn pri" id="save">Download</button></div>';
 $$('tabs').onclick=function(e){var t=e.target.dataset.tab;if(!t)return;I.tab=t;I.sel=null;tabs();ctl();sel();};
 $$('undo').onclick=function(){if(I.hist.length){I.cur=I.hist.pop();I.sel=null;if(I.base&&(I.base.width!==I.cur.width||I.base.height!==I.cur.height))I.base=null;paint();ctl();}};
 $$('reset').onclick=function(){I.cur=I.orig;I.hist=[];I.sel=null;I.base=null;paint();ctl();};
 $$('save').onclick=function(){blobOf(function(b){if(!b){toast('Could not create the image');return;}
  saveBlob(b,I.name+'-edited.'+({'image/jpeg':'jpg','image/webp':'webp','image/png':'png'}[b.type]||'png'));});};
 var pw=$$('pw');
 function pt(e){var r=$$('pv').getBoundingClientRect(),c=I.cur;return {x:cl((e.clientX-r.left)/r.width*c.width,0,c.width),y:cl((e.clientY-r.top)/r.height*c.height,0,c.height)};}
 pw.onpointerdown=function(e){if(I.pan){I.pd={x:e.clientX,y:e.clientY,l:pw.scrollLeft,t:pw.scrollTop};pw.setPointerCapture(e.pointerId);return;}var p=pt(e);
  if(I.tab==='crop'){var ht=cropHit(p);pw.setPointerCapture(e.pointerId);
   if(ht&&ht.k==='move'){I.mv={dx:p.x-I.sel.x,dy:p.y-I.sel.y};}
   else if(ht){I.drag=ht.anchor;}
   else{I.drag=p;I.sel={x:p.x,y:p.y,w:0,h:0};}
   sel();}
  else if(I.tab==='bg'&&I.bgm==='plain'){var d=I.cur.getContext('2d').getImageData(Math.floor(p.x),Math.floor(p.y),1,1).data;I.bgc=[d[0],d[1],d[2]];ctl();}
  else if(I.tab==='bg'){startBrush();I.paint=1;I.last=p;pw.setPointerCapture(e.pointerId);stroke(p);}};
 pw.onpointermove=function(e){if(I.pd){pw.scrollLeft=I.pd.l-(e.clientX-I.pd.x);pw.scrollTop=I.pd.t-(e.clientY-I.pd.y);return;}if(I.paint){stroke(pt(e));return;}
  if(I.mv){var q=pt(e),s0=I.sel,c0=I.cur;I.sel={x:cl(q.x-I.mv.dx,0,c0.width-s0.w),y:cl(q.y-I.mv.dy,0,c0.height-s0.h),w:s0.w,h:s0.h};sel();return;}
  if(!I.drag){if(I.tab==='crop'&&!I.pan){var hh0=cropHit(pt(e));pw.style.cursor=!hh0?'':hh0.k==='move'?'move':(hh0.k==='nw'||hh0.k==='se')?'nwse-resize':'nesw-resize';}return;}var p=pt(e),a=I.drag,c=I.cur,w=p.x-a.x,h=p.y-a.y,aw=Math.abs(w),ah=Math.abs(h);
  if(I.ratio){aw=Math.min(aw,(w>=0?c.width-a.x:a.x),(h>=0?c.height-a.y:a.y)*I.ratio);ah=aw/I.ratio;}
  I.sel={x:w>=0?a.x:a.x-aw,y:h>=0?a.y:a.y-ah,w:aw,h:ah};sel();};
 pw.onpointerup=pw.onpointercancel=function(){I.pd=null;I.drag=null;I.mv=null;if(I.paint){I.paint=null;est();snapSave();}};
 $$('zin').onclick=function(){zoom(1.25);};$$('zout').onclick=function(){zoom(.8);};
 $$('zfit').onclick=function(){I.z=1;zapply();pw.scrollLeft=pw.scrollTop=0;};
 $$('z100').onclick=function(){setZ(1/fitS());};
 $$('zpan').onclick=function(){I.pan=!I.pan;zpanUI();};
 pw.addEventListener('wheel',function(e){if(!e.ctrlKey)return;e.preventDefault();zoom(e.deltaY<0?1.12:1/1.12);},{passive:false});
 window.addEventListener('resize',function(){if(I&&$$('pv'))zapply();});
 tabs();paint();ctl();zpanUI();
}
function cropHit(p){var s=I.sel,pv=$$('pv');if(!s||s.w<4||s.h<4||!pv)return null;
 var k=I.cur.width/(pv.getBoundingClientRect().width||1),tol=16*k,cs=[['nw',s.x,s.y,s.x+s.w,s.y+s.h],['ne',s.x+s.w,s.y,s.x,s.y+s.h],['sw',s.x,s.y+s.h,s.x+s.w,s.y],['se',s.x+s.w,s.y+s.h,s.x,s.y]];
 for(var i=0;i<4;i++){var c=cs[i];if(Math.abs(p.x-c[1])<=tol&&Math.abs(p.y-c[2])<=tol)return {k:c[0],anchor:{x:c[3],y:c[4]}};}
 if(p.x>=s.x&&p.x<=s.x+s.w&&p.y>=s.y&&p.y<=s.y+s.h)return {k:'move'};
 return null;}
function stableVh(){var w=window.innerWidth,h=window.innerHeight;
 if(!(window.matchMedia&&matchMedia('(hover:none)').matches))return h;
 /* on phones the address bar slides in and out and changes the window height; use the fixed screen size so the preview never changes size while scrolling */
 var sw=(window.screen&&screen.width)||0,sh=(window.screen&&screen.height)||0;if(!sw||!sh)return h;
 var v=w>h?Math.min(sw,sh):Math.max(sw,sh);return Math.max(h,Math.min(v,1400));}
function fitS(){var c=I.cur,box=$$('pw').parentNode,mw=Math.max(200,Math.min(920,(box.clientWidth||600)-36)),mh=Math.max(240,stableVh()*.6);return Math.min(1,mw/c.width,mh/c.height);}
function zapply(){var c=I.cur,pv=$$('pv');if(!pv)return;var f=fitS(),sc=f*I.z;pv.style.width=Math.round(c.width*sc)+'px';pv.style.height=Math.round(c.height*sc)+'px';$$('zl').textContent=Math.round(sc*100)+'%';}
function setZ(z){var pw=$$('pw'),pv=$$('pv'),ow=pv.offsetWidth||1,oh=pv.offsetHeight||1,cx=(pw.scrollLeft+pw.clientWidth/2)/ow,cy=(pw.scrollTop+pw.clientHeight/2)/oh;
 I.z=cl(z,.25,12);zapply();pw.scrollLeft=cx*pv.offsetWidth-pw.clientWidth/2;pw.scrollTop=cy*pv.offsetHeight-pw.clientHeight/2;}
function zoom(k){setZ(I.z*k);}
function zpanUI(){var b=$$('zpan'),p=$$('pw');if(b)b.classList.toggle('pri',!!I.pan);if(p)p.classList.toggle('pan',!!I.pan);}
function tabs(){document.querySelectorAll('#tabs a').forEach(function(a){a.classList.toggle('on',a.dataset.tab===I.tab);});}
function sel(){var b=$$('sb'),c=I.cur,s=I.sel;if(!b)return;
 if(I.tab!=='crop'||!s||s.w<1){b.style.display='none';return;}
 b.style.display='block';b.style.left=s.x/c.width*100+'%';b.style.top=s.y/c.height*100+'%';b.style.width=s.w/c.width*100+'%';b.style.height=s.h/c.height*100+'%';}
function paint(){var c=I.cur,pv=$$('pv');try{pv.getContext('2d',{willReadFrequently:true});}catch(e){}pv.width=c.width;pv.height=c.height;pv.getContext('2d').drawImage(c,0,0);zapply();sel();info();est();snapSave();}
function info(){var c=I.cur,t=c.width+' \u00d7 '+c.height+' px'+(I.est?' \u00b7 about '+fb(I.est):'');$$('info').textContent=t;
 var cs=$$('cs');if(cs&&I.est){var p=Math.round((1-I.est/I.size)*100);cs.textContent='Original file: '+fb(I.size)+'  \u2192  New: about '+fb(I.est)+' ('+(p>=0?'\u2212'+p+'% smaller':'+'+(-p)+'% larger')+')';}}
function blobOf(cb){var c=I.cur;
 if(I.fmt==='image/jpeg'){var m=mk(c.width,c.height),x=m.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,m.width,m.height);x.drawImage(c,0,0);c=m;}
 c.toBlob(cb,I.fmt,I.q);}
function est(){clearTimeout(est.k);est.k=setTimeout(function(){blobOf(function(b){I.est=b?b.size:0;info();});},250);}
function apply(c){I.hist.push(I.cur);if(I.hist.length>6)I.hist.shift();I.cur=c;I.sel=null;I.base=null;paint();ctl();}
function ctl(){
 var el=$$('ctl'),t=I.tab,c=I.cur,h='';
 var modeH='<div class="row" style="margin-bottom:12px"><button class="btn'+(I.bgm==='brush'?' pri':'')+'" data-bm="brush">Eraser brush</button><button class="btn'+(I.bgm==='plain'?' pri':'')+'" data-bm="plain">Plain color</button></div>';
 var brush=t==='bg'&&I.bgm==='brush';
 $$('pw').className='pvw '+(t==='crop'||brush?'crop':t==='bg'?'bg':'')+(I.pan?' pan':'');
 if(t==='compress'){
  h='<div class="row"><label>Format <select id="fmt" style="width:auto;background:var(--fill);padding:8px 12px;color:var(--ink)">'+[['image/jpeg','JPEG'],['image/webp','WebP'],['image/png','PNG']].map(function(o){return '<option value="'+o[0]+'"'+(I.fmt===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></label>'+
  '<label>Quality <input type="range" id="q" min="10" max="100" value="'+Math.round(I.q*100)+'"'+(I.fmt==='image/png'?' disabled':'')+'> <span id="qv">'+Math.round(I.q*100)+'%</span></label></div><p class="hint" id="cs" style="margin-bottom:0"></p>'+
  '<p class="hint">Tip: JPEG or WebP at 70\u201380% is usually much smaller with little visible change. PNG keeps transparency but is not reduced by quality.</p>';
 }else if(t==='resize'){
  h='<div class="row"><label>Width <input type="number" id="rw" min="1" max="8000" value="'+c.width+'" style="width:100px"></label><label>Height <input type="number" id="rh" min="1" max="8000" value="'+c.height+'" style="width:100px"></label><label class="hint"><input type="checkbox" id="lk" checked> Lock ratio</label></div>'+
  '<div class="row" style="margin-top:12px"><button class="btn" data-p="75">75%</button><button class="btn" data-p="50">50%</button><button class="btn" data-p="25">25%</button><span class="sp"></span><button class="btn pri" id="ap">Apply resize</button></div>';
 }else if(t==='crop'){
  h='<p class="hint" style="margin-top:0">Drag on the image to choose the area to keep. Then drag inside the box to move it, or drag a corner to resize it.</p><div class="row">'+[['Free',0],['1:1',1],['4:3',4/3],['16:9',16/9]].map(function(r){return '<button class="btn'+(I.ratio===r[1]?' pri':'')+'" data-ra="'+r[1]+'">'+r[0]+'</button>';}).join('')+'<span class="sp"></span><button class="btn pri" id="ap">Apply crop</button></div>';
 }else if(brush){
  h=modeH+'<p class="hint" style="margin-top:0">Rub over the background to erase it. Switch to Restore to bring back anything removed by mistake. Use a smaller brush near edges.</p>'+
   '<div class="row"><button class="btn'+(I.tool==='erase'?' pri':'')+'" data-tool="erase">Erase</button><button class="btn'+(I.tool==='restore'?' pri':'')+'" data-tool="restore">Restore</button><label>Brush size <input type="range" id="bs" min="1" max="20" step="0.1" data-ks="1" value="'+I.bs+'"></label></div>';
 }else{
  if(!I.bgc)I.bgc=edgeColor(c);
  h=modeH+'<p class="hint" style="margin-top:0">Click the background on the image to pick its color (the edge color is picked automatically).</p>'+
  '<div class="row"><span>Color <span class="swatch" style="background:rgb('+I.bgc.join(',')+')"></span></span><label>Tolerance <input type="range" id="tol" min="1" max="100" value="'+I.tol+'"></label><label>Edge cleanup <input type="range" id="sf" min="0" max="3" step="0.1" data-ks="0.5" value="'+I.soft+'"></label><label>Enclosed areas <select id="gp" style="width:auto;background:var(--fill);padding:8px 12px;color:var(--ink)">'+[[0,'Keep (eyes, teeth)'],[1,'Remove near edges (hair gaps)'],[2,'Remove all']].map(function(o){return '<option value="'+o[0]+'"'+(I.gaps===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></label></div>'+
  '<div class="row" style="margin-top:12px"><span class="sp"></span><button class="btn pri" id="ap">Remove background</button></div>'+
  '<p class="hint">Works best on plain backgrounds like a white wall or a flat color. Edge cleanup smooths the outline and removes the light fringe. Busy backgrounds will not cut out cleanly. The result is saved as PNG to keep transparency.</p>';
 }
 el.innerHTML=h;info();
 var g=function(i){return $$(i);};
 if(t==='compress'){
  g('fmt').onchange=function(e){I.fmt=e.target.value;ctl();est();};
  g('q').oninput=function(e){I.q=e.target.value/100;g('qv').textContent=e.target.value+'%';est();};
 }else if(t==='resize'){
  var rw=g('rw'),rh=g('rh'),lk=g('lk');
  rw.oninput=function(){if(lk.checked)rh.value=Math.round(rw.value*c.height/c.width);};
  rh.oninput=function(){if(lk.checked)rw.value=Math.round(rh.value*c.width/c.height);};
  el.querySelectorAll('[data-p]').forEach(function(b){b.onclick=function(){rw.value=Math.round(c.width*b.dataset.p/100);rh.value=Math.round(c.height*b.dataset.p/100);};});
  g('ap').onclick=function(){var w=Math.round(+rw.value),hh=Math.round(+rh.value);
   if(!(w>0&&hh>0)||w>8000||hh>8000){toast('Enter a size between 1 and 8000 px');return;}
   var m=mk(w,hh),x=m.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,w,hh);apply(m);};
 }else if(t==='crop'){
  el.querySelectorAll('[data-ra]').forEach(function(b){b.onclick=function(){I.ratio=+b.dataset.ra;I.sel=null;ctl();sel();};});
  g('ap').onclick=function(){var s=I.sel;if(!s||s.w<4||s.h<4){toast('Drag on the image to choose an area first');return;}
   var w=Math.round(s.w),hh=Math.round(s.h),m=mk(w,hh);m.getContext('2d').drawImage(c,Math.round(s.x),Math.round(s.y),w,hh,0,0,w,hh);apply(m);};
 }else if(brush){
  el.querySelectorAll('[data-tool]').forEach(function(b){b.onclick=function(){I.tool=b.dataset.tool;ctl();};});
  g('bs').oninput=function(e){I.bs=+e.target.value;};
 }else{
  g('tol').oninput=function(e){I.tol=+e.target.value;};
  g('sf').oninput=function(e){I.soft=+e.target.value;};g('gp').onchange=function(e){I.gaps=+e.target.value;};
  g('ap').onclick=removeBg;
 }
 if(t==='bg')el.querySelectorAll('[data-bm]').forEach(function(b){b.onclick=function(){I.bgm=b.dataset.bm;ctl();};});
}

function cc(c){var m=mk(c.width,c.height);m.getContext('2d').drawImage(c,0,0);return m;}
function startBrush(){var n=cc(I.cur);I.hist.push(I.cur);if(I.hist.length>6)I.hist.shift();if(!I.base)I.base=I.hist[I.hist.length-1];I.cur=n;}
function stroke(p){var l=I.last,er=I.tool==='erase',bs=Math.max(3,Math.max(I.cur.width,I.cur.height)*I.bs/300)/I.z;
 [I.cur.getContext('2d'),$$('pv').getContext('2d')].forEach(function(x){x.save();x.lineWidth=bs;x.lineCap='round';x.lineJoin='round';
  if(er){x.globalCompositeOperation='destination-out';x.strokeStyle='#000';}else{x.strokeStyle=x.createPattern(I.base,'no-repeat');}
  x.beginPath();x.moveTo(l.x,l.y);x.lineTo(p.x+.01,p.y);x.stroke();x.restore();});
 I.last=p;}
function edgeColor(c){var w=c.width,h=c.height,x=c.getContext('2d'),r=[],g=[],bl=[];
 [[0,0,w,1],[0,h-1,w,1],[0,0,1,h],[w-1,0,1,h]].forEach(function(a){var d=x.getImageData(a[0],a[1],a[2],a[3]).data;for(var i=0;i<d.length;i+=4){r.push(d[i]);g.push(d[i+1]);bl.push(d[i+2]);}});
 var m=function(a){a.sort(function(p,q){return p-q;});return a[a.length>>1];};return [m(r),m(g),m(bl)];}
function removeBg(){
 var c=I.cur,w=c.width,h=c.height,N=w*h,d=c.getContext('2d').getImageData(0,0,w,h).data,b=I.bgc,b0=b[0],b1=b[1],b2=b[2],th=I.tol*4.41,R=2+I.soft,bias=I.soft*0.1,k,p,t;
 function dist(i){if(d[i+3]<10)return 0;var r=d[i]-b0,g=d[i+1]-b1,e=d[i+2]-b2;return Math.sqrt(r*r+g*g+e*e);}
 var M=new Uint8Array(N),st=[];
 function push(p){if(!M[p]&&dist(p*4)<=th){M[p]=1;st.push(p);}}
 for(k=0;k<w;k++){push(k);push((h-1)*w+k);}
 for(k=0;k<h;k++){push(k*w);push(k*w+w-1);}
 while(st.length){p=st.pop();var x=p%w,y=(p/w)|0;if(x>0)push(p-1);if(x<w-1)push(p+1);if(y>0)push(p-w);if(y<h-1)push(p+w);}
 if(I.gaps){
  var t2=th*.75,cand=new Uint8Array(N),Dm=new Uint8Array(N).fill(255),qq=[],lab=new Uint8Array(N);
  for(k=0;k<N;k++)if(!M[k]&&dist(k*4)<=t2)cand[k]=1;
  if(I.gaps===1){
   var md=Math.min(60,Math.max(4,Math.round(Math.max(w,h)*.025)));
   for(k=0;k<N;k++)if(M[k]){var x=k%w,y=(k/w)|0;if((x>0&&!M[k-1])||(x<w-1&&!M[k+1])||(y>0&&!M[k-w])||(y<h-1&&!M[k+w])){Dm[k]=0;qq.push(k);}}
   for(var a=0;a<qq.length;a++){p=qq[a];var dv=Dm[p];if(dv>=md)continue;var x=p%w,y=(p/w)|0;
    if(x>0&&!M[p-1]&&Dm[p-1]===255){Dm[p-1]=dv+1;qq.push(p-1);}
    if(x<w-1&&!M[p+1]&&Dm[p+1]===255){Dm[p+1]=dv+1;qq.push(p+1);}
    if(y>0&&!M[p-w]&&Dm[p-w]===255){Dm[p-w]=dv+1;qq.push(p-w);}
    if(y<h-1&&!M[p+w]&&Dm[p+w]===255){Dm[p+w]=dv+1;qq.push(p+w);}}
  }
  for(k=0;k<N;k++){if(!cand[k]||lab[k])continue;
   var comp=[k],ok=I.gaps===2||Dm[k]<255;lab[k]=1;
   for(var c2=0;c2<comp.length;c2++){p=comp[c2];if(Dm[p]<255)ok=true;var x=p%w,y=(p/w)|0;
    if(x>0&&cand[p-1]&&!lab[p-1]){lab[p-1]=1;comp.push(p-1);}
    if(x<w-1&&cand[p+1]&&!lab[p+1]){lab[p+1]=1;comp.push(p+1);}
    if(y>0&&cand[p-w]&&!lab[p-w]){lab[p-w]=1;comp.push(p-w);}
    if(y<h-1&&cand[p+w]&&!lab[p+w]){lab[p+w]=1;comp.push(p+w);}}
   if(ok)for(var z=0;z<comp.length;z++)M[comp[z]]=1;}
 }
 function open(k,f){var x=k%w,y=(k/w)|0;return (x>0&&f(k-1))||(x<w-1&&f(k+1))||(y>0&&f(k-w))||(y<h-1&&f(k+w));}
 var D=new Uint8Array(N).fill(255),q=[],isFg=function(n){return !M[n];},inBand=function(n){return !M[n]&&D[n]<255;};
 for(k=0;k<N;k++)if(M[k]&&open(k,isFg)){D[k]=0;q.push(k);}
 for(var hd=0;hd<q.length;hd++){p=q[hd];var dd=D[p];if(dd>=R)continue;var x=p%w,y=(p/w)|0;
  if(x>0){t=p-1;if(!M[t]&&D[t]===255){D[t]=dd+1;q.push(t);}}
  if(x<w-1){t=p+1;if(!M[t]&&D[t]===255){D[t]=dd+1;q.push(t);}}
  if(y>0){t=p-w;if(!M[t]&&D[t]===255){D[t]=dd+1;q.push(t);}}
  if(y<h-1){t=p+w;if(!M[t]&&D[t]===255){D[t]=dd+1;q.push(t);}}}
 var F=new Uint8Array(N*3),got=new Uint8Array(N),q2=[];
 for(k=0;k<N;k++)if(!M[k]&&D[k]===255&&open(k,inBand)){F[k*3]=d[k*4];F[k*3+1]=d[k*4+1];F[k*3+2]=d[k*4+2];q2.push(k);}
 for(var h2=0;h2<q2.length;h2++){var s=q2[h2],x=s%w,y=(s/w)|0,nb=[];
  if(x>0)nb.push(s-1);if(x<w-1)nb.push(s+1);if(y>0)nb.push(s-w);if(y<h-1)nb.push(s+w);
  for(var j=0;j<nb.length;j++){t=nb[j];if(!M[t]&&D[t]<255&&!got[t]){got[t]=1;F[t*3]=F[s*3];F[t*3+1]=F[s*3+1];F[t*3+2]=F[s*3+2];q2.push(t);}}}
 var o=new Uint8ClampedArray(d);
 for(k=0;k<N;k++){var i=k*4;
  if(M[k]){o[i+3]=0;continue;}
  if(D[k]===255||!got[k])continue;
  var fr=F[k*3],fg=F[k*3+1],fb=F[k*3+2],vx=fr-b0,vy=fg-b1,vz=fb-b2,vv=vx*vx+vy*vy+vz*vz;
  if(vv<900)continue;
  var ar=((d[i]-b0)*vx+(d[i+1]-b1)*vy+(d[i+2]-b2)*vz)/vv;ar=ar<0?0:ar>1?1:ar;
  var a=(ar-bias)/(1-bias);a=a<0?0:a>1?1:a;
  if(a<=0.02){o[i+3]=0;continue;}
  o[i+3]=Math.round(a*255);
  if(ar<0.2){o[i]=fr;o[i+1]=fg;o[i+2]=fb;}
  else{o[i]=b0+(d[i]-b0)/ar;o[i+1]=b1+(d[i+1]-b1)/ar;o[i+2]=b2+(d[i+2]-b2)/ar;}}
 var out=mk(w,h);out.getContext('2d').putImageData(new ImageData(o,w,h),0,0);
 /* keep the picture from before the first background edit as the Restore source, so the brush can bring back what a colour removal took away */
 var keep=(I.base&&I.base.width===c.width&&I.base.height===c.height)?I.base:c;
 I.fmt='image/png';apply(out);I.base=keep;toast('Background removed. Use Undo to go back.');
}


var P={tool:'maker',files:[],out:null};
var TOOLS=[['maker','PDF Maker'],['merge','Merger'],['split','Splitter'],['compress','Compressor'],['protect','Protect'],['unlock','Remove password']];
var CD='https://cdnjs.cloudflare.com/ajax/libs/';
var URLS={pdflib:['https://unpkg.com/@cantoo/pdf-lib@2.11.1/dist/pdf-lib.min.js'],jspdf:[CD+'jspdf/2.5.1/jspdf.umd.min.js'],pdfjs:[CD+'pdf.js/3.11.174/pdf.min.js',CD+'pdf.js/3.11.174/pdf.worker.min.js'],zip:[CD+'jszip/3.10.1/jszip.min.js']};
var ALT={pdflib:'https://cdn.jsdelivr.net/npm/@cantoo/pdf-lib@2.11.1/dist/pdf-lib.min.js'};
var LD={};
function ldScript(u){return new Promise(function(res,rej){var e=document.createElement('script');e.src=u;e.onload=res;e.onerror=function(){rej(new Error('Could not load part of this tool. Check your connection and try again.'));};document.head.appendChild(e);});}
function need(n){if(!LD[n])LD[n]=URLS[n].reduce(function(p,u){return p.then(function(){return ldScript(u).catch(function(e){if(ALT[n])return ldScript(ALT[n]);throw e;});});},Promise.resolve()).then(function(){if(n==='pdfjs')window.pdfjsLib.GlobalWorkerOptions.workerSrc=URLS.pdfjs[1];}).catch(function(e){LD[n]=null;throw e;});return LD[n];}
function tick(){return new Promise(function(r){setTimeout(r,0);});}
function st(m){var e=$$('st');if(e)e.textContent=m||'';}
function pdfMsg(e){var m=(e&&e.message)||String(e);
 if(e&&e.name==='PasswordException')return e.code===2?'That password is not correct.':'This PDF is password protected. Enter its password first.';
 if(/encrypt/i.test(m))return 'This PDF is password protected. Use "Remove password" on it first.';
 return 'Something went wrong: '+m;}
var INFO={
 maker:['Choose images (JPG, PNG, WebP) and/or type text. Images become pages in the order shown; text goes on pages after them.','image/*',true,'Create PDF'],
 merge:['Choose two or more PDFs. They are joined in the order shown.','application/pdf,.pdf',true,'Merge PDFs'],
 split:['Choose a PDF, then pick how to split it.','application/pdf,.pdf',false,'Split PDF'],
 compress:['Choose a PDF to make smaller. Pages are re-saved as images, so text will no longer be selectable.','application/pdf,.pdf',false,'Compress PDF'],
 protect:['Choose a PDF and set a password. The file is encrypted with AES-256 and keeps its text.','application/pdf,.pdf',false,'Protect PDF'],
 unlock:['Choose a PDF you have the password for. The result opens without a password. This cannot guess or crack passwords.','application/pdf,.pdf',false,'Remove password']};
function pdftool(){
 nav('pdf');
 app.innerHTML='<h1 style="font-size:2.2rem">PDF Tool</h1><p class="lead" style="font-size:1rem">Everything happens on your device, so your files are never uploaded.</p>'+
 '<div class="row" style="margin:16px 0" id="ptabs">'+TOOLS.map(function(t){return '<button class="btn" data-t="'+t[0]+'">'+t[1]+'</button>';}).join('')+'</div><div id="pp"></div>';
 $$('ptabs').onclick=function(e){var t=e.target.dataset.t;if(!t)return;P.tool=t;P.files=[];P.out=null;ptool();};
 ptool();
}
function ptool(){
 var t=P.tool,inf=INFO[t];
 document.querySelectorAll('#ptabs .btn').forEach(function(b){b.classList.toggle('pri',b.dataset.t===t);});
 var h='<p class="hint" style="margin-top:0">'+inf[0]+'</p>'+
  '<label class="card drop" id="pdrop"><input type="file" id="pfi" hidden accept="'+inf[1]+'"'+(inf[2]?' multiple':'')+'>'+ico('upload',28)+'<b>'+(inf[2]?'Choose files':'Choose a file')+'</b><span class="hint">or drop here</span></label><div id="fl"></div><div class="card" id="opt" style="margin-top:12px"></div>'+
  '<div class="bar"><span class="sp"></span><button class="btn pri" id="go">'+inf[3]+'</button></div><p class="hint" id="st"></p><div id="res"></div>';
 $$('pp').innerHTML=h;
 var opt='';
 if(t==='maker')opt='<div class="row"><label>Page size <select id="ps" class="sel"><option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Fit to image</option></select></label></div><p class="hint" style="margin-bottom:6px">Optional text pages (plain text, Latin letters work best)</p><textarea id="tx" placeholder="Type or paste text here"></textarea>';
 if(t==='split')opt='<div class="row"><label>Mode <select id="sm" class="sel"><option value="range">Extract pages</option><option value="single">Every page as its own PDF (ZIP)</option><option value="every">Every N pages (ZIP)</option></select></label><span id="sx"></span></div><p class="hint" id="pc" style="margin-bottom:0"></p>';
 if(t==='compress')opt='<div class="row"><label>Strength <select id="cs" class="sel"><option value="l">Light (best quality)</option><option value="b" selected>Balanced</option><option value="s">Strong (smallest)</option></select></label></div>';
 if(t==='protect')opt='<div class="row"><label>New password <input type="password" id="pw" autocomplete="new-password"></label><label>Current password (if it has one) <input type="password" id="pw0" autocomplete="off"></label></div><label class="hint" style="display:block;margin-top:10px"><input type="checkbox" id="pr" checked> Allow printing</label>';
 if(t==='unlock')opt='<div class="row"><label>Password <input type="password" id="pw" autocomplete="off"></label></div>';
 if(opt)$$('opt').innerHTML=opt;else $$('opt').style.display='none';
 var sm=$$('sm');if(sm){var sx=function(){$$('sx').innerHTML=sm.value==='range'?'<input type="text" id="rg" placeholder="e.g. 1-3, 5, 8-10">':sm.value==='every'?'<input type="number" id="nn" min="1" value="2" style="width:80px">':'';};sm.onchange=sx;sx();}
 $$('pfi').onchange=function(e){addFiles(e.target.files);e.target.value='';};
 var d=$$('pdrop');d.ondragover=function(e){e.preventDefault();};d.ondrop=function(e){e.preventDefault();addFiles(e.dataTransfer.files);};
 $$('go').onclick=run;
 list();
}
function addFiles(fl){
 var t=P.tool,img=t==='maker',ok=Array.prototype.filter.call(fl,function(f){return img?/^image\//.test(f.type):(f.type==='application/pdf'||/\.pdf$/i.test(f.name));});
 if(!ok.length){toast(img?'Please choose image files':'Please choose PDF files');return;}
 P.files=INFO[t][2]?P.files.concat(ok):[ok[0]];P.out=null;$$('res').innerHTML='';st('');list();
 if(t==='split')pageCount();
}
function list(){
 var el=$$('fl'),multi=INFO[P.tool][2];
 el.innerHTML=P.files.map(function(f,i){return '<div class="it"><span class="n">'+esc(f.name)+'</span><span class="hint">'+fb(f.size)+'</span>'+(multi?'<button data-i="'+i+'" data-a="u" aria-label="Move up">'+ico('up',16)+'</button><button data-i="'+i+'" data-a="d" aria-label="Move down">'+ico('dn',16)+'</button>':'')+'<button data-i="'+i+'" data-a="x" aria-label="Remove">'+ico('x',16)+'</button></div>';}).join('');
 el.onclick=function(e){var b=e.target,a=b.dataset.a,i=+b.dataset.i;if(!a)return;
  if(a==='x')P.files.splice(i,1);else{var j=a==='u'?i-1:i+1;if(j<0||j>=P.files.length)return;var x=P.files[i];P.files[i]=P.files[j];P.files[j]=x;}
  P.out=null;$$('res').innerHTML='';list();if(P.tool==='split')pageCount();};
}
async function pageCount(){var pc=$$('pc');if(!pc)return;if(!P.files[0]){pc.textContent='';return;}
 try{await need('pdflib');var d=await PDFLib.PDFDocument.load(await P.files[0].arrayBuffer());P.pages=d.getPageCount();pc.textContent='This PDF has '+P.pages+' page'+(P.pages===1?'':'s')+'.';}
 catch(e){P.pages=0;pc.textContent=pdfMsg(e);}}
function done(blob,name,note){
 P.out={b:blob,n:name};
 $$('res').innerHTML='<div class="card" style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><div style="flex:1"><b>Ready: '+esc(name)+'</b><div class="hint">'+fb(blob.size)+(note?' \u00b7 '+note:'')+'</div></div><button class="btn pri" id="dlr">Download</button></div>';
 $$('dlr').onclick=function(){saveBlob(P.out.b,P.out.n);};
 st('');}
async function run(){
 var t=P.tool,go=$$('go');
 if(t==='maker'){if(!P.files.length&&!$$('tx').value.trim()){toast('Add images or some text first');return;}}
 else if(INFO[t][2]?P.files.length<(t==='merge'?2:1):!P.files.length){toast(t==='merge'?'Choose at least two PDFs':'Choose a file first');return;}
 go.disabled=true;$$('res').innerHTML='';st('Working\u2026');
 try{await tick();await ({maker:runMaker,merge:runMerge,split:runSplit,compress:runCompress,protect:runProtect,unlock:runUnlock}[t])();}
 catch(e){st(pdfMsg(e));}
 go.disabled=false;
}
var base=function(f){return f.name.replace(/\.[^.]+$/,'');};
var pdfBlob=function(b){return new Blob([b],{type:'application/pdf'});};
function toJpeg(f){return new Promise(function(res,rej){var u=URL.createObjectURL(f),im=new Image();
 im.onload=function(){var k=Math.min(1,2500/Math.max(im.naturalWidth,im.naturalHeight)),c=mk(Math.round(im.naturalWidth*k),Math.round(im.naturalHeight*k)),x=c.getContext('2d');
  x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
  c.toBlob(function(b){b.arrayBuffer().then(res);},'image/jpeg',.92);};
 im.onerror=function(){rej(new Error('Could not read '+f.name));};im.src=u;});}
async function runMaker(){
 await need('pdflib');var L=PDFLib,doc=await L.PDFDocument.create(),size=$$('ps').value,dm={a4:[595.28,841.89],letter:[612,792],fit:[595.28,841.89]}[size],i;
 for(i=0;i<P.files.length;i++){st('Adding image '+(i+1)+' of '+P.files.length+'\u2026');await tick();
  var im=await doc.embedJpg(await toJpeg(P.files[i])),iw=im.width,ih=im.height,pg;
  if(size==='fit'){pg=doc.addPage([iw*.75,ih*.75]);pg.drawImage(im,{x:0,y:0,width:iw*.75,height:ih*.75});}
  else{var pw=dm[0],ph=dm[1];if(iw>ih){var tt=pw;pw=ph;ph=tt;}pg=doc.addPage([pw,ph]);var m=28,sc=Math.min((pw-2*m)/iw,(ph-2*m)/ih),w=iw*sc,h=ih*sc;pg.drawImage(im,{x:(pw-w)/2,y:(ph-h)/2,width:w,height:h});}}
 var txt=$$('tx').value.replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,'-').replace(/\u2026/g,'...').replace(/\t/g,'    ').replace(/[^\n\x20-\x7E\xA0-\xFF]/g,'?');
 if(txt.trim()){
  var font=await doc.embedFont(L.StandardFonts.Helvetica),fs=12,lh=17,mg=56,W=dm[0],H=dm[1],pg2=doc.addPage([W,H]),y=H-mg;
  var line=function(s){if(y<mg){pg2=doc.addPage([W,H]);y=H-mg;}if(s)pg2.drawText(s,{x:mg,y:y,size:fs,font:font});y-=lh;};
  txt.split('\n').forEach(function(para){
   if(!para.trim()){line('');return;}
   var cur='';para.split(' ').forEach(function(wd){
    while(font.widthOfTextAtSize(wd,fs)>W-2*mg){var k=wd.length;while(k>1&&font.widthOfTextAtSize(wd.slice(0,k),fs)>W-2*mg)k--;if(cur){line(cur);cur='';}line(wd.slice(0,k));wd=wd.slice(k);}
    var tryS=cur?cur+' '+wd:wd;if(font.widthOfTextAtSize(tryS,fs)>W-2*mg){line(cur);cur=wd;}else cur=tryS;});
   line(cur);});
 }
 var by=await doc.save();done(pdfBlob(by),'my-document.pdf',doc.getPageCount()+' page'+(doc.getPageCount()===1?'':'s'));
}
async function runMerge(){
 await need('pdflib');var L=PDFLib,out=await L.PDFDocument.create();
 for(var i=0;i<P.files.length;i++){st('Adding '+P.files[i].name+'\u2026');await tick();
  var src;try{src=await L.PDFDocument.load(await P.files[i].arrayBuffer());}catch(e){throw new Error(P.files[i].name+': '+pdfMsg(e).replace('Something went wrong: ',''));}
  (await out.copyPages(src,src.getPageIndices())).forEach(function(p){out.addPage(p);});}
 done(pdfBlob(await out.save()),'merged.pdf',out.getPageCount()+' pages');
}
function parseRange(t,n){var o=[];t.split(',').forEach(function(p){p=p.trim();if(!p)return;var m=p.match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!m)throw new Error('Invalid range: '+p);var a=+m[1],b=m[2]?+m[2]:a;if(a<1||b>n||a>b)throw new Error('Pages must be between 1 and '+n);for(var i=a;i<=b;i++)o.push(i-1);});if(!o.length)throw new Error('Enter the pages you want, like 1-3, 5');return o;}
async function runSplit(){
 await need('pdflib');var L=PDFLib,f=P.files[0],src=await L.PDFDocument.load(await f.arrayBuffer()),n=src.getPageCount(),mode=$$('sm').value;
 async function part(ix){var d=await L.PDFDocument.create();(await d.copyPages(src,ix)).forEach(function(p){d.addPage(p);});return d.save();}
 if(mode==='range'){var ix=parseRange($$('rg').value,n);done(pdfBlob(await part(ix)),base(f)+'-extract.pdf',ix.length+' page'+(ix.length===1?'':'s'));return;}
 await need('zip');var z=new JSZip(),step=mode==='single'?1:Math.max(1,Math.round(+$$('nn').value)||1),c=0;
 for(var i=0;i<n;i+=step){var ix2=[];for(var j=i;j<Math.min(n,i+step);j++)ix2.push(j);c++;st('Creating file '+c+'\u2026');await tick();
  z.file(base(f)+(step===1?'-page-'+(i+1):'-pages-'+(i+1)+'-'+(ix2[ix2.length-1]+1))+'.pdf',await part(ix2));}
 done(await z.generateAsync({type:'blob'}),base(f)+'-split.zip',c+' PDF files');
}
async function raster(f,pw,scale,q){
 await need('pdfjs');var doc=await pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer()),password:pw||undefined}).promise,pages=[];
 if(doc.numPages>200)throw new Error('This PDF has more than 200 pages. Split it first.');
 for(var i=1;i<=doc.numPages;i++){st('Page '+i+' of '+doc.numPages+'\u2026');await tick();
  var pg=await doc.getPage(i),b=pg.getViewport({scale:1}),vp=pg.getViewport({scale:scale}),c=mk(Math.floor(vp.width),Math.floor(vp.height)),x=c.getContext('2d');
  x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);await pg.render({canvasContext:x,viewport:vp}).promise;
  pages.push({d:c.toDataURL('image/jpeg',q),w:b.width,h:b.height});c.width=c.height=1;pg.cleanup();}
 doc.destroy();return pages;}
async function build(pages,enc){
 await need('jspdf');var J=window.jspdf.jsPDF,p0=pages[0],o={unit:'pt',format:[p0.w,p0.h],orientation:p0.w>p0.h?'l':'p',compress:true};if(enc)o.encryption=enc;
 var d=new J(o);pages.forEach(function(p,i){if(i)d.addPage([p.w,p.h],p.w>p.h?'l':'p');d.addImage(p.d,'JPEG',0,0,p.w,p.h,undefined,'FAST');});
 return d.output('blob');}
async function runCompress(){
 var f=P.files[0],o={l:[1.6,.8],b:[1.25,.65],s:[1,.5]}[$$('cs').value],pg=await raster(f,'',o[0],o[1]);st('Building PDF\u2026');await tick();
 var b=await build(pg),p=Math.round((1-b.size/f.size)*100);
 done(b,base(f)+'-compressed.pdf',p>=0?fb(f.size)+' \u2192 '+fb(b.size)+' ('+p+'% smaller)':'Larger than the original ('+fb(f.size)+'). Try Strong, or keep the original.');
}
async function runProtect(){
 var f=P.files[0],pw=$$('pw').value;if(!pw){st('Enter a password first.');return;}
 await need('pdflib');var L=PDFLib,buf=await f.arrayBuffer(),src;
 try{src=await L.PDFDocument.load(buf,{password:$$('pw0').value||undefined});}catch(e){throw new Error(/incorrect/i.test(e.message)?'The current password is not correct.':/encrypted/i.test(e.message)?'This PDF already has a password. Enter it in "Current password".':e.message);}
 var out=await L.PDFDocument.create();(await out.copyPages(src,src.getPageIndices())).forEach(function(p){out.addPage(p);});
 var rnd=Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(16)),function(x){return x.toString(16);}).join('');
 out.encrypt({userPassword:pw,ownerPassword:rnd,permissions:{printing:$$('pr').checked,modifying:false,copying:true,annotating:false}});
 done(pdfBlob(await out.save()),base(f)+'-protected.pdf','Opens only with your password');
}
async function runUnlock(){
 var f=P.files[0],pw=$$('pw').value;await need('pdflib');var L=PDFLib,buf=await f.arrayBuffer();
 try{await L.PDFDocument.load(buf);st('This PDF is not password protected, so there is nothing to remove.');return;}catch(e){if(!/encrypted/i.test(e.message))throw e;}
 if(!pw){st('Enter the PDF password first.');return;}
 var src;try{src=await L.PDFDocument.load(buf,{password:pw});}catch(e){throw new Error(/incorrect/i.test(e.message)?'That password is not correct.':e.message);}
 var out=await L.PDFDocument.create();(await out.copyPages(src,src.getPageIndices())).forEach(function(p){out.addPage(p);});
 done(pdfBlob(await out.save()),base(f)+'-unlocked.pdf','Opens without a password');
}


var VWELL=['google.com','google.co.in','youtube.com','facebook.com','instagram.com','whatsapp.com','wikipedia.org','amazon.com','amazon.in','apple.com','microsoft.com','github.com','reddit.com','linkedin.com','twitter.com','x.com','netflix.com','openai.com','anthropic.com','claude.ai','stackoverflow.com','khanacademy.org','coursera.org','udemy.com','duolingo.com','canva.com','zoom.us','spotify.com','discord.com','telegram.org','dropbox.com','adobe.com','paypal.com','ebay.com','bbc.com','nytimes.com','mozilla.org','cloudflare.com','yahoo.com','bing.com','duckduckgo.com','quora.com','medium.com','pinterest.com','twitch.tv','steampowered.com','epicgames.com','flipkart.com','paytm.com','irctc.co.in','nptel.ac.in'];
var VBR=['google','youtube','facebook','instagram','whatsapp','amazon','paypal','apple','icloud','microsoft','outlook','netflix','gmail','linkedin','twitter','github','dropbox','flipkart','paytm','phonepe','irctc','wikipedia','reddit','spotify','discord','telegram','snapchat','tiktok','openai','chatgpt','anthropic','ebay','walmart','binance','coinbase','roblox','fortnite','epicgames','playstation','adobe','coursera','udemy','duolingo','hdfcbank','icicibank','onlinesbi'];
var VBADTLD=['zip','mov','xyz','top','click','country','gq','tk','ml','ga','cf','work','support','loan','men','rest','fit','icu','cyou','monster','buzz','cam','sbs','quest','download','review','stream','racing','win','bid','party','date','faith','accountant','science','trade','webcam'];
var VNORMTLD=['com','net','org','in','co.in','co.uk','de','fr','ca','com.au','jp','es','it','nl','com.br','com.mx','ai','io','us','edu','gov','co'];
var VSLD2=['co.uk','org.uk','ac.uk','gov.uk','com.au','net.au','org.au','co.in','net.in','org.in','ac.in','gov.in','com.br','co.jp','co.nz','co.za','com.cn','com.mx','com.sg','com.tr','co.kr','com.hk','com.pk','com.bd','com.ng'];
var VSHORT=['bit.ly','tinyurl.com','t.co','goo.gl','is.gd','ow.ly','cutt.ly','rb.gy','shorturl.at','tiny.cc','buff.ly'];
var VFREE=['duckdns.org','ddns.net','no-ip.org','no-ip.com','hopto.org','zapto.org','000webhostapp.com','ngrok.io','ngrok-free.app','trycloudflare.com','workers.dev','weebly.com','blogspot.com','wixsite.com'];
var VKW=['login','signin','verify','secure','account','update','wallet','free','bonus','prize','gift','claim','support','billing','recover','unlock','confirm','password','alert','giveaway','reward'];
function vParse(inp){
 var s=(inp||'').trim();if(!s)return {err:'Type a domain or paste a link first.'};
 var raw=s;if(!/^[a-z][a-z0-9+.-]*:\/\//i.test(s))s='http://'+s;
 var u;try{u=new URL(s);}catch(e){return {err:'That does not look like a valid domain. Try something like example.com'};}
 var h=u.hostname.toLowerCase().replace(/\.$/,'');
 if(!h)return {err:'That does not look like a valid domain.'};
 if(h.charAt(0)==='[')return {err:'IPv6 addresses are not supported. Enter a domain name or an IPv4 address.'};
 var ip=/^\d{1,3}(\.\d{1,3}){3}$/.test(h);
 if(!ip){var L=h.split('.');if(L.length<2||!/^[a-z0-9.-]+$/.test(h)||L.some(function(x){return !x||x.length>63||/^-|-$/.test(x);})||!/^([a-z]{2,}|xn--[a-z0-9-]+)$/.test(L[L.length-1]))return {err:'That does not look like a valid domain. Try something like example.com'};}
 return {host:h,ip:ip,idn:/[^\x00-\x7F]/.test(raw)||h.indexOf('xn--')>=0,userinfo:!!u.username||!!u.password,shown:raw};
}
function vReg(h){var L=h.split('.'),l2=L.slice(-2).join('.');return (VSLD2.indexOf(l2)>=0&&L.length>=3)?L.slice(-3).join('.'):l2;}
function vLev(a,b){var m=a.length,n=b.length,p=[],i,j;for(j=0;j<=n;j++)p[j]=j;for(i=1;i<=m;i++){var c=[i];for(j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
function vNorm(x,alt){return x.replace(/-/g,'').replace(/0/g,'o').replace(/1/g,alt?'i':'l').replace(/3/g,'e').replace(/5/g,'s').replace(/rn/g,'m').replace(/vv/g,'w');}
function vAnalyze(P){
 var it=[],h=P.host,add=function(l,t,d,p){it.push({l:l,t:t,d:d,p:p||0});};
 if(P.userinfo)add('bad','Hidden-destination trick','This link has a name and @ sign before the real address. Everything before the @ is ignored, so the link actually goes to '+h+'.',4);
 if(P.ip){add('warn','Address is a number, not a name','Real websites almost always use a name. Links that use a raw IP address are a common sign of scams or malware.',3);return {items:it,reg:h,sld:h,tld:''};}
 var reg=vReg(h),rl=reg.split('.'),sld=rl[0],tld=rl.slice(1).join('.'),sub=h.length>reg.length?h.slice(0,h.length-reg.length-1).split('.'):[];
 var well=VWELL.indexOf(reg)>=0;
 if(well)add('good','Recognized well-known site','"'+reg+'" is a large, well-known website. Be aware that big sites can still host pages made by other people.',-3);
 if(P.idn)add('warn','Contains special characters','This name uses letters from other alphabets (shown as xn--). Scammers use look-alike letters to imitate real sites.',3);
 if(VBADTLD.indexOf(tld)>=0)add('warn','Ending ".'+tld+'" is often abused','Cheap or free endings like this are used more often by scam sites. Many are harmless, so treat it as a small warning only.',2);
 if(VSHORT.indexOf(reg)>=0)add('warn','Link shortener','Short links hide the real destination. Use a link expander before opening it.',3);
 else if(VFREE.some(function(f){return h===f||h.slice(-f.length-1)==='.'+f;}))add('info','Free hosting or tunnel service','Anyone can create a site on this service, so the name tells you nothing about who is behind it.',1);
 if(!well){
  var hit=null;
  VBR.forEach(function(b){if(hit)return;
   if(sld===b){if(VNORMTLD.indexOf(tld)<0)hit={l:'warn',t:'Uses the name "'+b+'" on an unusual domain',d:'The real '+b+' website normally ends in .com. Check you are not on a copy.',p:3};return;}
   if(b.length>=6&&sld.length>=4&&(vNorm(sld,0)===b||vNorm(sld,1)===b||vLev(sld,b)<=(b.length>=9?2:1))){hit={l:'bad',t:'Looks like a copy of "'+b+'"',d:'"'+sld+'" is almost the same as "'+b+'". It could be a look-alike made to trick people.',p:4};return;}
   var tok=sld.split('-');
   if(b.length>=5&&(tok.indexOf(b)>=0&&tok.length>1||VKW.some(function(k){return sld===b+k||sld===k+b;})))hit={l:'warn',t:'Mixes "'+b+'" with other words',d:'Names like this are often used to imitate the real site. The real one is '+b+'.com.',p:3};
  });
  if(!hit)VBR.forEach(function(b){if(hit)return;if(sub.indexOf(b)>=0&&sld!==b)hit={l:'bad',t:'"'+b+'" appears before the real domain',d:'In "'+h+'" the real domain is "'+reg+'", not '+b+'. The first part is just decoration.',p:4};});
  if(hit)add(hit.l,hit.t,hit.d,hit.p);
 }
 var kw=VKW.filter(function(k){return h.indexOf(k)>=0;});
 if(kw.length&&!well)add('warn','Pressure words in the name','Contains: '+kw.slice(0,4).join(', ')+'. Scam sites often use words like these to rush you.',kw.length>1?3:2);
 if(sub.length>=4)add('warn','Very many sub-parts','"'+h+'" has '+sub.length+' parts before the main domain, which can hide the real one.',2);
 if(h.length>45)add('warn','Unusually long address','Long addresses make it harder to spot what the real domain is.',1);
 if(sld.indexOf('xn--')<0&&(sld.match(/-/g)||[]).length>=3)add('warn','Many hyphens','Lots of hyphens are common in throwaway scam domains.',2);
 if(sld.length>=6&&(sld.replace(/\D/g,'').length/sld.length>.4))add('warn','Mostly numbers','Names made mostly of numbers are often auto-generated.',1);
 var lt=sld.replace(/[^a-z]/g,'');
 if(!well&&sld.indexOf('xn--')<0&&lt.length>=8&&(lt.replace(/[^aeiouy]/g,'').length/lt.length<.2||/[^aeiouy]{6,}/.test(lt)))add('warn','Looks randomly generated','The name does not look like normal words. Machine-made names are common for malicious domains.',1);
 if(!it.some(function(x){return x.l==='warn'||x.l==='bad';}))add('good','Name looks normal','No look-alike tricks, unusual endings, pressure words or hidden destinations found in the address itself.',0);
 return {items:it,reg:reg,sld:sld,tld:tld};
}
function vVerdict(items,live){
 var sc=items.reduce(function(a,x){return a+x.p;},0);
 if(items.some(function(x){return x.flag;}))return ['bad','Risky','A security filter flags this domain. Do not open it or enter any details.'];
 if(sc>=6||items.some(function(x){return x.l==='bad';}))return ['bad','Risky','Several warning signs. Do not enter passwords or personal details, and avoid downloading anything.'];
 if(sc>=3)return ['warn','Be careful','Some warning signs. Check it with the tools below before trusting it.'];
 return ['good','No red flags found',live?'Nothing suspicious in the checks that ran. This is not a guarantee. New sites can be dangerous before anyone reports them.':'Nothing suspicious in the address itself. This is not a guarantee.'];
}
function vjf(url,ms){var c=new AbortController(),t=setTimeout(function(){c.abort();},ms||7000);
 return fetch(url,{headers:{accept:'application/dns-json, application/rdap+json, application/json'},signal:c.signal,credentials:'omit'}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('http '+r.status);return r.json();},function(e){clearTimeout(t);throw e;});}
var V={id:0,a:null,items:[],reddit:null,pend:0,live:false};
function vtool(){
 nav('virus');
 app.innerHTML='<h1 style="font-size:2.2rem">Virus Checker</h1><p class="lead" style="font-size:1rem">Check if a website or link looks safe before you open it. This tool never visits the site you enter.</p>'+
 '<div class="vin"><input type="text" id="vd" placeholder="example.com or paste a link" autocapitalize="off" autocomplete="off" spellcheck="false"><button class="btn pri" id="vgo">Check</button></div><div id="vout"></div>'+
 '<div class="card" style="margin-top:20px"><b>Staying safe online</b><p>Look at the address before you click. Never enter a password on a page you reached from a message. Avoid cracked software and "free" downloads. Turn on two-step login for your accounts.</p></div>';
 var go=function(){vRun($$('vd').value);};
 $$('vgo').onclick=go;$$('vd').onkeydown=function(e){if(e.key==='Enter')go();};
 if(V.a){$$('vd').value=V.a.host;vDraw();}
}
function vRun(inp){
 var P=vParse(inp);if(P.err){$$('vout').innerHTML='<div class="card" style="margin-top:16px">'+esc(P.err)+'</div>';V.a=null;return;}
 var A=vAnalyze(P);V.id++;var id=V.id;V.a={host:P.host,ip:P.ip,reg:A.reg};V.items=A.items.slice();V.reddit=null;V.live=false;V.pend=P.ip?0:3;
 vDraw();if(P.ip){V.reddit='skip';vDraw();return;}
 var fails=[],fin=function(name,ok){if(id!==V.id)return;if(!ok)fails.push(name);V.pend--;if(V.pend===0){if(fails.length===3)V.items.push({l:'info',t:'Online checks unavailable',d:'We could not reach the online services. Check your connection, or use the links below to check with trusted websites.',p:0});V.live=fails.length<3;}vDraw();};
 var sec='https://security.cloudflare-dns.com/dns-query?type=A&name=',pl='https://cloudflare-dns.com/dns-query?type=A&name=';
 Promise.all([vjf(sec+encodeURIComponent(P.host)),vjf(pl+encodeURIComponent(P.host))]).then(function(r){if(id!==V.id)return;
  var ips=function(j){return (j.Answer||[]).filter(function(a){return a.type===1;}).map(function(a){return a.data;});},si=ips(r[0]),pi=ips(r[1]);
  var blocked=(si.length>0&&si.every(function(x){return x==='0.0.0.0';}))||(pi.length>0&&r[0].Status===3);
  if(blocked)V.items.push({l:'bad',t:'Flagged as malware or phishing',d:'Cloudflare’s security DNS blocks this domain because it is known for malware or phishing.',p:10,flag:1});
  else if(r[1].Status===3)V.items.push({l:'warn',t:'Domain does not exist',d:'This name does not resolve to any server. It may be mistyped or no longer active.',p:1});
  else if(pi.length)V.items.push({l:'good',t:'Not on Cloudflare’s malware and phishing blocklist',d:'It resolves normally. Server address: '+pi.slice(0,2).join(', ')+'.',p:0});
  fin('dns',true);},function(){fin('dns',false);});
 vjf('https://rdap.org/domain/'+encodeURIComponent(A.reg)).then(function(j){if(id!==V.id)return;
  var ev=function(a){var e=(j.events||[]).filter(function(x){return x.eventAction===a;})[0];return e&&e.eventDate?new Date(e.eventDate):null;},reg=ev('registration'),ex=ev('expiration'),rr='';
  try{var en=(j.entities||[]).filter(function(e){return (e.roles||[]).indexOf('registrar')>=0;})[0];rr=en.vcardArray[1].filter(function(x){return x[0]==='fn';})[0][3];}catch(e){}
  if(reg&&!isNaN(reg)){var days=Math.floor((Date.now()-reg)/864e5),ys=days/365,txt=ys>=1?Math.floor(ys)+' year'+(Math.floor(ys)===1?'':'s'):days+' day'+(days===1?'':'s');
   var d='Registered '+reg.toISOString().slice(0,10)+(rr?' with '+rr:'')+(ex&&!isNaN(ex)?'. Expires '+ex.toISOString().slice(0,10):'')+'.';
   if(days<30)V.items.push({l:'warn',t:'Brand new domain ('+txt+' old)',d:d+' Most scam sites are only a few weeks old.',p:3});
   else if(days<180)V.items.push({l:'warn',t:'Fairly new domain ('+txt+' old)',d:d,p:1});
   else V.items.push({l:'good',t:'Established domain ('+txt+' old)',d:d,p:ys>=2?-1:0});}
  else V.items.push({l:'info',t:'Registration date not published',d:'The registry did not share when this domain was created.',p:0});
  fin('rdap',true);},function(){fin('rdap',false);});
 vjf('https://www.reddit.com/search.json?limit=8&sort=relevance&q='+encodeURIComponent('"'+A.reg+'"')).then(function(j){if(id!==V.id)return;
  V.reddit=((j.data&&j.data.children)||[]).map(function(c){return c.data;}).filter(function(p){return p&&/^\/r\/[\w-]+\/comments\//.test(p.permalink||'');}).slice(0,6);fin('reddit',true);},function(){if(id===V.id)V.reddit='fail';fin('reddit',false);});
}
function vDraw(){
 var o=$$('vout');if(!o||!V.a)return;var A=V.a,v=vVerdict(V.items,V.live),dm=encodeURIComponent(A.host),rg=encodeURIComponent(A.reg),pend=V.pend>0;
 var sym={good:ico('check',14,3),warn:ico('alert',14,3),bad:ico('x',14,3),info:ico('info',14,3)};
 var h='<div class="card" style="margin-top:16px"><div class="row"><span class="vbad '+v[0]+'">'+esc(v[1])+'</span><b style="font-size:1.05rem;word-break:break-all">'+esc(A.host)+'</b></div><p style="margin:10px 0 0;color:var(--ink)">'+esc(v[2])+'</p>'+(pend?'<p class="hint" style="margin:8px 0 0">Running online checks…</p>':'')+'</div>';
 h+='<div class="card" style="margin-top:14px"><b>What we found</b><div style="margin-top:8px">'+V.items.map(function(x){return '<div class="fi"><span class="fd '+x.l+'">'+sym[x.l]+'</span><div><b>'+esc(x.t)+'</b><div class="hint">'+esc(x.d)+'</div></div></div>';}).join('')+'</div></div>';
 var r=V.reddit,rl='https://www.reddit.com/search/?q='+rg;
 if(r!=='skip'){h+='<div class="card" style="margin-top:14px"><b>What people say on Reddit</b>';
  if(Array.isArray(r)){h+=r.length?'<div style="margin-top:8px">'+r.map(function(p){return '<a class="rp" target="_blank" rel="noopener noreferrer" href="https://www.reddit.com'+esc(p.permalink)+'"><b>'+esc(p.title||'')+'</b><span class="hint">r/'+esc(p.subreddit||'')+' · '+(+p.score||0)+' points · '+(+p.num_comments||0)+' comments'+(p.created_utc?' · '+new Date(p.created_utc*1000).toISOString().slice(0,10):'')+'</span></a>';}).join('')+'</div><p class="hint" style="margin-bottom:0">Posts are personal opinions, not proof either way.</p>':'<p class="hint">No Reddit posts found for this domain. That is neither good nor bad.</p>';}
  else if(r==='fail'||(!pend&&r===null))h+='<p class="hint">Reddit results could not be loaded here. <a href="'+rl+'" target="_blank" rel="noopener noreferrer" style="color:var(--brand)">Search Reddit for '+esc(A.reg)+'</a></p>';
  else h+='<p class="hint">Loading…</p>';
  h+='</div>';}
 var L=[['VirusTotal','Scans with 70+ security engines','https://www.virustotal.com/gui/'+(A.ip?'ip-address/':'domain/')+dm],['Google Safe Browsing','Google’s unsafe site list','https://transparencyreport.google.com/safe-browsing/search?url='+dm],['urlscan.io','See what the site loads, safely','https://urlscan.io/search/#domain:'+dm],['Sucuri SiteCheck','Malware and blocklist scan','https://sitecheck.sucuri.net/results/'+dm],['ScamAdviser','Trust score and reviews','https://www.scamadviser.com/check-website/'+dm],['Who.is','Who owns it and when','https://who.is/whois/'+dm],['Trustpilot','Customer reviews','https://www.trustpilot.com/review/'+dm],['Reddit search','Discussions about this site',rl]];
 h+='<div class="card" style="margin-top:14px"><b>Double-check with trusted tools</b><p class="hint" style="margin:4px 0 0">These open in a new tab on their own websites.</p><div class="lk">'+L.map(function(x){return '<a href="'+x[2]+'" target="_blank" rel="noopener noreferrer">'+x[0]+'<span>'+x[1]+'</span></a>';}).join('')+'</div></div>';
 h+='<p class="hint" style="margin-top:14px">This is an automated check, not a guarantee. If you are unsure, do not enter passwords, payment details or personal information, and do not download files.</p>';
 o.innerHTML=h;
}

var CFG=Object.assign({email:'',phone:'',legalName:'',address:'',donate:[],donateApi:'',dealApi:'',grabApi:'',runApi:'',aiApi:'',turnstileKey:''},window.EVE_CFG||{});
var TL=[
 {r:'calc',c:'i5',ic:'calc',n:'Complex Calculator',d:'Work out your CGPA and attendance, and see what you need to hit your targets.'},
 {r:'deal',c:'i10',ic:'tag',n:'Deal or No Deal',d:'Tell Eve what you want to buy. She suggests what to look for, links the top stores and shows which price is the real best deal.'},
 {r:'eve',c:'i1',ic:'spark',n:'Eve AI',d:'Your caring study buddy. Ask questions, get step-by-step help, make flashcards and practice tests, and learn from your own notes.'},
 {r:'ide',c:'ired',ic:'code',n:'Eve IDE',d:'Write and run Python, C and Java programs, with input and output right on the page.'},
 {r:'convert',c:'i8',ic:'swap',n:'File Converter',d:'Turn pictures, PDFs, documents, spreadsheets and audio into another format, right on your device.'},
 {r:'grab',c:'i7',ic:'dlbox',lock:1,n:'Grab Box',d:'Paste a link to a file or a page and download the video, audio or document on it.'},
  {r:'image',c:'i2',ic:'image',n:'Image Tool',d:'Compress, resize, crop and remove plain backgrounds from images.'},
 {r:'translate',c:'i12',ic:'globe',n:'Live Translate',d:'Speak in one language and read it in another as you talk, or share your screen and see it translated in real time.'},
 {r:'pdf',c:'i3',ic:'pdf',n:'PDF Tool',d:'Make, merge, split and compress PDFs, and add or remove passwords.'},
 {r:'qr',c:'i9',ic:'qr',n:'QR Code Generator',d:'Make a QR code for a link, text, Wi-Fi, email, phone number or contact card, and download it as PNG or SVG.'},
 {r:'planner',c:'',ic:'calendar',n:'Study Planner',d:'Plan your week with subjects and time slots, then print it or save it as an image.'},
 {r:'tts',c:'i11',ic:'speaker',n:'Text to Speech',d:'Hear your words read out loud as you type, or turn a paragraph into an audio file you can download.'},
 {r:'virus',c:'i4',ic:'shield',n:'Virus Checker',d:'Check whether a website or link looks safe before you open it.'}];
var LOCKED={};TL.forEach(function(t){if(t.lock)LOCKED[t.r]=1;});
/*RANKDATA*/var RANKD={"stages":[["a","Arcane Stage"],["0","Stage Zero"],["1","Stage One"],["2","Stage Two"],["3","Stage Three"],["4","Stage Four"],["5","Stage Five"],["6","Stage Six"],["7","Stage Seven"],["8","Stage Eight"],["9","Stage Nine"]],"tools":{"eve":["0","The most capable tool here. It answers questions, teaches step by step, makes flashcards and practice tests, and works from your own notes."],"translate":["1","Turns speech and the text on a shared screen into another language as it happens, across many languages."],"ide":["2","Runs real Python, C and Java programs with live input and output, right on the page."],"convert":["3","Converts pictures, PDFs, documents, spreadsheets and audio between many formats, right on your device."],"tts":["4","Two ways to listen: hear words read out as you type, or turn a paragraph into a downloadable audio file, with voices for many countries."],"pdf":["5","Several useful jobs in one place: make, merge, split and compress PDFs, and add or remove passwords."],"virus":["6","Weighs several signals about a link, such as warning lists and domain age, without ever opening it. A good first look, not a full scan."],"image":["6","Compresses, resizes, crops and removes plain backgrounds. A few jobs done well, each one fairly simple."],"deal":["7","Helps you decide what to buy and sends you to the right stores. It guides your shopping rather than fetching every price itself."],"qr":["7","Makes codes for links, text, Wi-Fi, email, phone numbers and contacts. One job, done cleanly."],"calc":["8","Works out CGPA and attendance and shows what you need for your targets. Useful, but a small single-purpose tool."],"planner":["8","A simple weekly grid you can print or save as a picture. Easy to use and light on features."],"grab":["9","Locked, so it cannot do anything yet. Its stage will be looked at again when it opens."]}};/*ENDRANKDATA*/
function rankBadge(k){var s=RANKD.stages.filter(function(x){return x[0]===k;})[0];return '<span class="rk s'+k+'">'+(k==='a'?ico('spark',12,2.4):'')+s[1]+'</span>';}
function rankList(){return '<div class="rkl">'+RANKD.stages.map(function(s){
 var ts=TL.filter(function(t){var r=RANKD.tools[t.r];return r&&r[0]===s[0];}).sort(function(a,b){return a.n<b.n?-1:1;});
 var inner=ts.length?ts.map(function(t){return '<div class="rkt"><span class="ic '+t.c+'">'+ico(t.ic,20)+'</span><div><b>'+t.n+'</b><p>'+RANKD.tools[t.r][1]+'</p></div></div>';}).join(''):'<p class="rkn">'+(s[0]==='a'?'Reserved for a tool on a whole other level. No tool has reached it yet.':'No tool is on this stage right now.')+'</p>';
 return '<div class="rkr'+(ts.length?'':' none')+'">'+rankBadge(s[0])+'<div>'+inner+'</div></div>';}).join('')+'</div>';}

function toolsGrid(){return '<div class="grid">'+TL.map(function(t){if(t.lock)return '<div class="card tool locked" role="group" aria-label="'+t.n+', locked"><span class="ic '+t.c+'">'+ico(t.ic,24)+'</span><span class="lockb">'+ico('lock',12,2.6)+'Locked</span><h3>'+t.n+'</h3><p>'+t.d+'</p></div>';return '<a class="card tool" href="#/'+t.r+'"><span class="ic '+t.c+'">'+ico(t.ic,24)+'</span><h3>'+t.n+'</h3><p>'+t.d+'</p></a>';}).join('')+'<div class="card soon"><span class="tag">Coming soon</span><h3>More tools</h3><p>New features are on the way.</p></div></div>';}
function blobs(){return '<span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span><span class="blob b4"></span>';}
function banner(tag,title,sub){return '<section class="hero sm">'+blobs()+'<div class="hin"><span class="pill">'+tag+'</span><h1>'+title+'</h1><p class="lead">'+sub+'</p></div></section>';}
function home(){
 nav('home');
 app.innerHTML='<section class="hero big">'+blobs()+'<div class="hin"><span class="pill">Made for students</span>'+
 '<h1>Less stress.<br>More getting things done.</h1>'+
 '<p class="lead">Eve Sandbox is a growing set of free, simple tools for the daily things students struggle with: planning your week, fixing images, handling PDFs and checking links before you click.</p>'+
 '<div class="cta"><a class="hbtn" href="#/tools">Explore the tools</a><a class="hbtn gl" href="#/about">About Eve Sandbox</a></div>'+
 '</div>'+
 '<button class="scue" id="scue" aria-label="Scroll to tools">'+ico('down',20)+'</button></section>'+
 '<div class="wrapc" id="tl"><h2 class="sech">Pick a tool</h2><p class="lead" style="margin:0">Everything runs in your browser, with no sign-up.</p>'+toolsGrid()+'</div>';
 try{var hr=app.querySelector('.hero.big');if(hr&&window.IntersectionObserver){new IntersectionObserver(function(en){hr.classList.toggle('off',!en[0].isIntersecting);}).observe(hr);}}catch(e){}
 document.getElementById('scue').onclick=function(){var e=document.getElementById('tl');e.scrollIntoView({behavior:'smooth',block:'start'});};
}
function lockedPage(r){var t=TL.filter(function(x){return x.r===r;})[0]||{n:'This tool'};nav('tools');
 app.innerHTML=banner('Locked',t.n,'This tool is locked. It will open again soon.')+'<div class="wrapc"><div class="card" style="text-align:center;padding:32px 20px"><span class="ic i7" style="margin:0 auto 10px">'+ico('lock',24)+'</span><h3>'+t.n+' is locked</h3><p>We are getting it ready. Please check back soon.</p><p style="margin-top:16px"><a class="btn pri" href="#/tools">Back to tools</a></p></div></div>';}
function toolsPage(){nav('tools');app.innerHTML=banner('All tools','Tools','Everything you can do on Eve Sandbox. More are on the way.')+'<div class="wrapc">'+toolsGrid().replace('class="grid"','class="grid" style="margin-top:0"')+'</div>';}
function aboutPage(){nav('about');
 app.innerHTML=banner('About','Built for students, by an independent developer','Eve Sandbox exists to take small daily headaches off a student’s plate.')+
 '<div class="wrapc doc"><h2 style="margin-top:0">Why it exists</h2><p>Students juggle deadlines, file formats, forms and links from every direction. Most tools for these jobs are cluttered, locked behind sign-ups, or upload your files to someone else’s server. Eve Sandbox puts the common ones in one clean place.</p>'+
 '<div class="grid" style="margin-top:20px"><div class="card"><span class="ic">'+ico('lock',24)+'</span><h3>Private by design</h3><p>Images and PDFs are processed in your browser. They are not uploaded.</p></div><div class="card"><span class="ic i2">'+ico('heart',24)+'</span><h3>Free and simple</h3><p>No accounts, no paywalls, no clutter. Open a tool and use it.</p></div><div class="card"><span class="ic i3">'+ico('trend',24)+'</span><h3>Always growing</h3><p>New tools are added over time, shaped by what students actually need.</p></div></div>'+
 '<h2>What you can do today</h2><ul>'+TL.filter(function(t){return !t.lock;}).map(function(t){return '<li><b>'+t.n+'.</b> '+t.d+'</li>';}).join('')+'</ul>'+
 '<h2>How the tools rank</h2><p>Every tool sits on a ladder of stages. Stage Nine is the weakest and Stage Zero is the strongest. Above the whole ladder is the Arcane Stage, a level of its own that is far beyond every other stage.</p>'+
 '<p>The placements are our own assessment of what each tool can do, how much work goes into it and how well it copes with real use. They are judgements, not test scores, and they will change as the tools grow.</p>'+rankList()+
 (CFG.legalName?'<h2>Who runs it</h2><p>Eve Sandbox is operated by '+esc(CFG.legalName)+'. You can reach us on the <a href="#/contact" style="color:var(--brand)">Contact</a> page.</p>':'')+
 '<h2>Get involved</h2><p>Have an idea for a tool, or found something that does not work? <a href="#/contact" style="color:var(--brand)">Tell us</a>. If Eve Sandbox helps you, you can <a href="#/donate" style="color:var(--brand)">support its development</a>.</p></div>';}
/* ---------- Cloudflare Turnstile (bot check for the Contact form). Off until turnstileKey is set in config.js ---------- */
var TSQ={p:null};
function tsOn(){return !!CFG.turnstileKey;}
function tsLib(){if(TSQ.p)return TSQ.p;TSQ.p=new Promise(function(ok,no){
 if(window.turnstile)return ok(window.turnstile);
 var sc=document.createElement('script');sc.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';sc.async=true;
 sc.onload=function(){window.turnstile?ok(window.turnstile):(TSQ.p=null,no(new Error('ts')));};sc.onerror=function(){TSQ.p=null;no(new Error('ts'));};document.head.appendChild(sc);});return TSQ.p;}
function contactDetails(){
 var r=[];if(CFG.legalName)r.push(['Operated by',esc(CFG.legalName)]);
 if(CFG.email)r.push(['Email','<a href="mailto:'+esc(CFG.email)+'" style="color:var(--brand)">'+esc(CFG.email)+'</a>']);
 if(CFG.phone)r.push(['Phone','<a href="tel:'+esc(String(CFG.phone).replace(/[^\d+]/g,''))+'" style="color:var(--brand)">'+esc(CFG.phone)+'</a>']);
 if(CFG.address)r.push(['Address',esc(CFG.address)]);
 return (CFG.legalName||CFG.phone||CFG.address)&&r.length?'<div class="card" style="max-width:640px;margin-top:16px"><h3 style="margin:0 0 8px">Contact details</h3>'+r.map(function(x){return '<p style="margin:4px 0"><b>'+x[0]+':</b> '+x[1]+'</p>';}).join('')+'</div>':'';}
function contactPage(){nav('contact');
 app.innerHTML=banner('Contact','Get in touch','Ideas, bug reports and questions are all welcome.')+
 '<div class="wrapc"><div class="card" style="max-width:640px"><form id="cf" novalidate>'+
 '<label class="fld">Your name<input id="cn" type="text" maxlength="80" autocomplete="name"></label>'+
 '<label class="fld">Your email (so we can reply)<input id="ce" type="text" inputmode="email" maxlength="120" autocomplete="email"></label>'+
 '<label class="fld">Topic<select id="ct"><option>Question</option><option>Bug report</option><option>Tool idea</option><option>Other</option></select></label>'+
 '<label class="fld">Message<textarea id="cm" maxlength="3000"></textarea></label>'+
 '<div class="hp" aria-hidden="true"><label>Leave this empty<input id="cw" type="text" tabindex="-1" autocomplete="off"></label></div>'+
 (tsOn()?'<div class="cts" id="cts"></div>':'')+'<div class="bar"><span class="sp"></span><button class="btn pri" id="cb" type="submit">Send message</button></div>'+
 '<p class="cfs" id="cs" role="status" aria-live="polite"></p></form>'+
 '</div>'+contactDetails()+'</div>';
 var st=document.getElementById('cs'),bt=document.getElementById('cb');
 function say(t,k){st.className='cfs'+(k?' '+k:'');st.textContent=t;}
 var tok='',tid=null;
 if(tsOn()&&CFG.aiApi){tsLib().then(function(T){var h=document.getElementById('cts');if(!h)return;tid=T.render(h,{sitekey:CFG.turnstileKey,theme:'auto',callback:function(x){tok=x;},'expired-callback':function(){tok='';},'error-callback':function(){tok='';}});},function(){say('The security check could not load. Please reload the page.','bad');});}
 function tsReset(){tok='';try{if(tid!=null&&window.turnstile)turnstile.reset(tid);}catch(e){}}
 function viaMail(t,body){if(!CFG.email)return false;location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent('Eve Sandbox: '+t)+'&body='+encodeURIComponent(body);return true;}
 document.getElementById('cf').onsubmit=function(e){e.preventDefault();
  var n=document.getElementById('cn').value.trim(),em=document.getElementById('ce').value.trim(),t=document.getElementById('ct').value,m=document.getElementById('cm').value.trim(),hp=document.getElementById('cw').value;
  if(m.length<5){say('Please write a short message first.','bad');return;}
  if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){say('That email address does not look right. Please check it, or leave it empty.','bad');return;}
  var body=m+'\n\n- '+(n||'Anonymous')+(em?' ('+em+')':'');
  if(!CFG.aiApi){if(!viaMail(t,body)){say('Sending is not available yet. Please try again soon.','bad');}else say('Your email app should open with the message ready to send.');return;}
  if(tsOn()&&!tok){say('Please finish the security check above first.','bad');return;}
  bt.disabled=true;bt.textContent='Sending...';say('');
  var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},20000);
  function fail(msg){bt.disabled=false;bt.textContent='Send message';say(msg,'bad');}
  function backup(){fail('We could not send that right now.'+(CFG.email?' Please email us at '+CFG.email+' instead.':' Please try again in a little while.'));}
  fetch(String(CFG.aiApi).replace(/\/+$/,'')+'/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n,email:em,topic:t,message:m,website:hp,token:tok}),signal:ctl.signal})
  .then(function(r){return r.json().catch(function(){return {};}).then(function(j){return {r:r,j:j};});})
  .then(function(x){clearTimeout(tm);tsReset();
   if(!(x.r.ok&&x.j.ok))console.warn('contact form refused:',x.r.status,x.j.error||'');
   if(x.j.error==='captcha'){fail('The security check did not pass. Please try again.');return;}
   if(x.r.ok&&x.j.ok){document.getElementById('cf').reset();bt.disabled=false;bt.textContent='Send message';say('Thank you! Your message has been sent.'+(em?' We will reply by email.':''),'ok');return;}
   if(x.j.error==='slow'){fail('You have sent a few messages already. Please try again a little later.');return;}
   if(x.j.error==='short'){fail('Please write a short message first.');return;}
   if(x.j.error==='email'){fail('That email address does not look right. Please check it, or leave it empty.');return;}
   backup();})
  .catch(function(e){clearTimeout(tm);tsReset();console.warn('contact form could not reach the server:',e&&e.message);backup();});};}
var DN={amt:'',busy:false};
var DQ=[50,100,250,500,1000];
function inr(n){return '₹'+Number(n).toLocaleString('en-IN');}
function donatePage(){nav('donate');
 var links=(CFG.donate||[]).filter(function(d){return /^https:\/\//.test(d.url||'');}),api=(CFG.donateApi||'').replace(/\/+$/,'');
 var box;
 if(api){
  box='<div id="dnote"></div><h3 style="margin:0 0 4px">Support Eve Sandbox</h3><p style="margin:0 0 6px">Choose an amount, or type your own. You will pay on a secure page run by our payment partner.</p>'+
   '<form id="dform" novalidate autocomplete="on"><div class="dch" id="dch">'+DQ.map(function(v){return '<button type="button" class="btn" data-v="'+v+'">'+inr(v)+'</button>';}).join('')+'</div>'+
   '<label class="qfl" for="damt">Amount in rupees (₹)<input type="text" id="damt" inputmode="numeric" maxlength="6" placeholder="Enter an amount" autocomplete="off"></label>'+
   '<div class="qfl dph-w"><label for="dph">Mobile number</label><div class="dph-r"><select class="sel" id="dcc" aria-label="Country code">'+dcOpts()+'</select><input type="text" id="dph" inputmode="tel" maxlength="24" autocomplete="tel-national"></div></div>'+
   '<div class="qg2"><label class="qfl" for="dnm">Name (optional)<input type="text" id="dnm" maxlength="60" autocomplete="name"></label><label class="qfl" for="dem">Email (optional)<input type="text" id="dem" inputmode="email" maxlength="120" autocomplete="email" autocapitalize="off" spellcheck="false"></label></div>'+
   '<div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" id="dws" tabindex="-1" autocomplete="off"></label></div>'+
   '<p class="hint" style="margin:10px 0 0">Our payment partner needs a mobile number to start a payment. Your details go to our payment partner and are not stored by Eve Sandbox. Donations are optional and every tool stays free.</p>'+
   '<div class="bar"><button class="btn pri" id="dgo" type="submit" disabled>Donate</button></div><p class="cfs" id="dmsg" role="status" aria-live="polite"></p></form>';
 }else if(links.length){
  box='<h3 style="margin:0 0 6px">Support Eve Sandbox</h3><p style="margin:0 0 12px">Choose a way to give. Every contribution, big or small, helps.</p><div class="cta" style="margin-top:0">'+links.map(function(d){return '<a class="btn pri" target="_blank" rel="noopener noreferrer" href="'+esc(d.url)+'">'+esc(d.label||'Donate')+'</a>';}).join('')+'</div>';
 }else box='<h3 style="margin:0 0 6px">Support Eve Sandbox</h3><p style="margin:0">Donations are not open yet. Thank you for thinking of it. Check back soon, or <a href="#/contact" style="color:var(--brand)">get in touch</a> if you would like to help in another way.</p>';
 app.innerHTML=banner('Donate','Help keep it free','Eve Sandbox is free for every student. Donations pay for the time and hosting that keep it going.')+
 '<div class="wrapc doc"><div class="card" style="max-width:640px">'+box+'</div>'+
 '<h2>Where the money goes</h2><ul><li>Building and improving the tools.</li><li>Hosting and keeping the site fast and online.</li><li>Keeping Eve Sandbox free, with no ads and no sign-up.</li></ul>'+
 '<p>Donating is optional and does not unlock anything. Every tool stays free for everyone.</p></div>';
 if(api){dInit(api);dThanks(api);}
}
function dAmt(){var t=($$('damt').value||'').replace(/[,\s]/g,'');return /^\d{1,6}$/.test(t)?parseInt(t,10):NaN;}
function dnSync(){var a=dAmt(),ok=a>=10&&a<=50000;
 $$('dgo').disabled=!ok||DN.busy;$$('dgo').textContent=DN.busy?'Opening payment page...':(ok?'Donate '+inr(a):'Donate');
 document.querySelectorAll('#dch .btn').forEach(function(b){b.classList.toggle('pri',ok&&+b.dataset.v===a);});}
/* country code + number: each country has its own allowed length (ISO country, name, calling code, shortest, longest, trunk prefix) */
var DCN='IN|India|91|10|10|0;AF|Afghanistan|93|9|9|0;AX|Åland Islands|358|7|10|0;AL|Albania|355|9|9|0;DZ|Algeria|213|9|9|0;AS|American Samoa|1|10|10|1;AD|Andorra|376|6|9|;AO|Angola|244|9|9|;AI|Anguilla|1|10|10|1;AG|Antigua & Barbuda|1|10|10|1;AR|Argentina|54|10|11|0;AM|Armenia|374|8|8|0;AW|Aruba|297|7|7|;AC|Ascension Island|247|5|5|;AU|Australia|61|9|9|0;AT|Austria|43|10|13|0;AZ|Azerbaijan|994|9|9|0;BS|Bahamas|1|10|10|1;BH|Bahrain|973|8|8|;BD|Bangladesh|880|10|10|0;BB|Barbados|1|10|10|1;BY|Belarus|375|9|9|8;BE|Belgium|32|9|9|0;BZ|Belize|501|7|7|;BJ|Benin|229|8|10|;BM|Bermuda|1|10|10|1;BT|Bhutan|975|8|8|;BO|Bolivia|591|8|8|0;BA|Bosnia & Herzegovina|387|8|9|0;BW|Botswana|267|8|8|;BR|Brazil|55|10|11|0;IO|British Indian Ocean Territory|246|7|7|;VG|British Virgin Islands|1|10|10|1;BN|Brunei|673|7|7|;BG|Bulgaria|359|8|9|0;BF|Burkina Faso|226|8|8|;BI|Burundi|257|8|8|;KH|Cambodia|855|8|9|0;CM|Cameroon|237|9|9|;CA|Canada|1|10|10|1;CV|Cape Verde|238|7|7|;BQ|Caribbean Netherlands|599|7|7|;KY|Cayman Islands|1|10|10|1;CF|Central African Republic|236|8|8|;TD|Chad|235|8|8|;CL|Chile|56|9|9|;CN|China|86|11|11|0;CX|Christmas Island|61|9|9|0;CC|Cocos (Keeling) Islands|61|9|9|0;CO|Colombia|57|10|10|0;KM|Comoros|269|7|7|;CG|Congo - Brazzaville|242|9|9|;CD|Congo - Kinshasa|243|7|9|0;CK|Cook Islands|682|5|5|;CR|Costa Rica|506|8|8|;CI|Côte d’Ivoire|225|10|10|;HR|Croatia|385|8|9|0;CU|Cuba|53|8|8|0;CW|Curaçao|599|7|8|;CY|Cyprus|357|8|8|;CZ|Czechia|420|9|9|;DK|Denmark|45|8|8|;DJ|Djibouti|253|8|8|;DM|Dominica|1|10|10|1;DO|Dominican Republic|1|10|10|1;EC|Ecuador|593|9|9|0;EG|Egypt|20|10|10|0;SV|El Salvador|503|8|8|;GQ|Equatorial Guinea|240|9|9|;ER|Eritrea|291|7|7|0;EE|Estonia|372|7|8|;SZ|Eswatini|268|8|8|;ET|Ethiopia|251|9|9|0;FK|Falkland Islands|500|5|5|;FO|Faroe Islands|298|6|6|;FJ|Fiji|679|7|7|;FI|Finland|358|7|10|0;FR|France|33|9|9|0;GF|French Guiana|594|9|9|0;PF|French Polynesia|689|8|8|;GA|Gabon|241|7|8|;GM|Gambia|220|7|7|;GE|Georgia|995|9|9|0;DE|Germany|49|10|11|0;GH|Ghana|233|9|9|0;GI|Gibraltar|350|8|8|;GR|Greece|30|10|10|;GL|Greenland|299|6|6|;GD|Grenada|1|10|10|1;GP|Guadeloupe|590|9|9|0;GU|Guam|1|10|10|1;GT|Guatemala|502|8|8|;GG|Guernsey|44|10|10|0;GN|Guinea|224|9|9|;GW|Guinea-Bissau|245|9|9|;GY|Guyana|592|7|7|;HT|Haiti|509|8|8|;HN|Honduras|504|8|8|;HK|Hong Kong SAR China|852|8|8|;HU|Hungary|36|9|9|06;IS|Iceland|354|7|9|;ID|Indonesia|62|9|12|0;IR|Iran|98|10|10|0;IQ|Iraq|964|10|10|0;IE|Ireland|353|9|9|0;IM|Isle of Man|44|10|10|0;IL|Israel|972|9|9|0;IT|Italy|39|9|10|;JM|Jamaica|1|10|10|1;JP|Japan|81|10|10|0;JE|Jersey|44|10|10|0;JO|Jordan|962|9|9|0;KZ|Kazakhstan|7|10|10|8;KE|Kenya|254|9|9|0;KI|Kiribati|686|8|8|0;XK|Kosovo|383|8|8|0;KW|Kuwait|965|8|8|;KG|Kyrgyzstan|996|9|9|0;LA|Laos|856|9|10|0;LV|Latvia|371|8|8|;LB|Lebanon|961|7|8|0;LS|Lesotho|266|8|8|;LR|Liberia|231|7|9|0;LY|Libya|218|9|9|0;LI|Liechtenstein|423|7|9|0;LT|Lithuania|370|8|8|0;LU|Luxembourg|352|9|9|;MO|Macao SAR China|853|8|8|;MG|Madagascar|261|9|9|0;MW|Malawi|265|9|9|0;MY|Malaysia|60|9|10|0;MV|Maldives|960|7|7|;ML|Mali|223|8|8|;MT|Malta|356|8|8|;MH|Marshall Islands|692|7|7|1;MQ|Martinique|596|9|9|0;MR|Mauritania|222|8|8|;MU|Mauritius|230|8|8|;YT|Mayotte|262|9|9|0;MX|Mexico|52|10|10|;FM|Micronesia|691|7|7|;MD|Moldova|373|8|8|0;MC|Monaco|377|8|9|0;MN|Mongolia|976|8|8|0;ME|Montenegro|382|8|8|0;MS|Montserrat|1|10|10|1;MA|Morocco|212|9|9|0;MZ|Mozambique|258|9|9|;MM|Myanmar (Burma)|95|7|10|0;NA|Namibia|264|9|9|0;NR|Nauru|674|7|7|;NP|Nepal|977|10|10|0;NL|Netherlands|31|9|11|0;NC|New Caledonia|687|6|6|;NZ|New Zealand|64|8|10|0;NI|Nicaragua|505|8|8|;NE|Niger|227|8|8|;NG|Nigeria|234|10|10|0;NU|Niue|683|4|7|;NF|Norfolk Island|672|6|6|;KP|North Korea|850|10|10|0;MK|North Macedonia|389|8|8|0;MP|Northern Mariana Islands|1|10|10|1;NO|Norway|47|8|8|;OM|Oman|968|8|8|;PK|Pakistan|92|10|10|0;PW|Palau|680|7|7|;PS|Palestinian Territories|970|9|9|0;PA|Panama|507|7|8|;PG|Papua New Guinea|675|8|8|;PY|Paraguay|595|9|9|0;PE|Peru|51|9|9|0;PH|Philippines|63|10|10|0;PL|Poland|48|9|9|;PT|Portugal|351|9|9|;PR|Puerto Rico|1|10|10|1;QA|Qatar|974|8|8|;RE|Réunion|262|9|9|0;RO|Romania|40|9|9|0;RU|Russia|7|10|10|8;RW|Rwanda|250|9|9|0;WS|Samoa|685|7|10|;SM|San Marino|378|8|8|;ST|São Tomé & Príncipe|239|7|7|;SA|Saudi Arabia|966|9|9|0;SN|Senegal|221|9|9|;RS|Serbia|381|8|10|0;SC|Seychelles|248|7|7|;SL|Sierra Leone|232|8|8|0;SG|Singapore|65|8|8|;SX|Sint Maarten|1|10|10|1;SK|Slovakia|421|9|9|0;SI|Slovenia|386|8|8|0;SB|Solomon Islands|677|5|7|;SO|Somalia|252|7|9|0;ZA|South Africa|27|6|9|0;KR|South Korea|82|9|10|0;SS|South Sudan|211|9|9|0;ES|Spain|34|9|9|;LK|Sri Lanka|94|9|9|0;BL|St. Barthélemy|590|9|9|0;SH|St. Helena|290|5|5|;KN|St. Kitts & Nevis|1|10|10|1;LC|St. Lucia|1|10|10|1;MF|St. Martin|590|9|9|0;PM|St. Pierre & Miquelon|508|6|9|0;VC|St. Vincent & Grenadines|1|10|10|1;SD|Sudan|249|9|9|0;SR|Suriname|597|7|7|;SJ|Svalbard & Jan Mayen|47|8|8|;SE|Sweden|46|9|9|0;CH|Switzerland|41|9|9|0;SY|Syria|963|9|9|0;TW|Taiwan|886|9|9|0;TJ|Tajikistan|992|9|9|;TZ|Tanzania|255|9|9|0;TH|Thailand|66|9|9|0;TL|Timor-Leste|670|8|8|;TG|Togo|228|8|8|;TK|Tokelau|690|4|7|;TO|Tonga|676|7|7|;TT|Trinidad & Tobago|1|10|10|1;TA|Tristan da Cunha|290|4|4|;TN|Tunisia|216|8|8|;TR|Türkiye|90|10|10|0;TM|Turkmenistan|993|8|8|8;TC|Turks & Caicos Islands|1|10|10|1;TV|Tuvalu|688|6|7|;VI|U.S. Virgin Islands|1|10|10|1;UG|Uganda|256|9|9|0;UA|Ukraine|380|9|9|0;AE|United Arab Emirates|971|9|9|0;GB|United Kingdom|44|10|10|0;US|United States|1|10|10|1;UY|Uruguay|598|8|8|0;UZ|Uzbekistan|998|9|9|;VU|Vanuatu|678|7|7|;VA|Vatican City|39|9|10|;VE|Venezuela|58|10|10|0;VN|Vietnam|84|9|9|0;WF|Wallis & Futuna|681|6|6|;EH|Western Sahara|212|9|9|0;YE|Yemen|967|9|9|0;ZM|Zambia|260|9|9|0;ZW|Zimbabwe|263|9|9|0';
var DCM={"1":"US","7":"RU","39":"IT","44":"GB","47":"NO","61":"AU","212":"MA","262":"RE","290":"SH","358":"FI","590":"GP","599":"CW"};
var DCK={GB:'uk',US:'usa america',AE:'uae emirates',TR:'turkey',CZ:'czech republic',CI:'ivory coast',SZ:'swaziland',CV:'cape verde',TL:'east timor',MK:'macedonia',PS:'palestine'};
var DCL=null;
function dcList(){if(DCL)return DCL;DCL=DCN.split(';').map(function(r){var a=r.split('|');return {c:a[0],n:a[1],d:a[2],mn:+a[3],mx:+a[4],np:a[5]||''};});return DCL;}
function dcOpts(){return dcList().map(function(c){var k=(c.c+' '+c.n+' +'+c.d+' '+c.d+(DCK[c.c]?' '+DCK[c.c]:'')).toLowerCase();
 return '<option value="'+c.c+'" data-short="'+c.c+' +'+c.d+'" data-k="'+esc(k)+'"'+(DCK[c.c]?' data-a="'+esc(DCK[c.c])+'"':'')+(c.c==='IN'?' selected':'')+'>'+esc(c.n)+' (+'+c.d+')</option>';}).join('');}
function dcCur(){var e=$$('dcc'),v=e?e.value:'',L=dcList();for(var i=0;i<L.length;i++)if(L[i].c===v)return L[i];return L[0];}
/* keep only the digits, whatever alphabet they were typed in */
function dcDigits(s){var o='',z=[0x660,0x6F0,0x966,0x9E6,0xA66,0xAE6,0xB66,0xBE6,0xC66,0xCE6,0xD66,0xE50,0xFF10];s=String(s==null?'':s);
 for(var i=0;i<s.length;i++){var k=s.charCodeAt(i);if(k>=48&&k<=57){o+=s.charAt(i);continue;}
  for(var j=0;j<z.length;j++)if(k>=z[j]&&k<z[j]+10){o+=String(k-z[j]);break;}}
 return o;}
/* "+44 7700 900123" pasted or typed: find the calling code at the front (they never overlap) */
function dcByDial(d,cur){var L=dcList();
 for(var n=1;n<=3;n++){var p=d.slice(0,n);if(p.length<n)break;if(cur.d===p)return {c:cur,len:n};
  var hit=null;for(var i=0;i<L.length;i++)if(L[i].d===p&&(!hit||L[i].c===DCM[p]))hit=L[i];
  if(hit)return {c:hit,len:n};}
 return null;}
/* drop a repeated country code or trunk prefix when the number is too long for the country, then stop at the longest allowed */
function dcTrim(d,c){var k=c.d.length;
 if(d.length>c.mx&&d.indexOf(c.d)===0&&d.length-k>=c.mn&&d.length-k<=c.mx)d=d.slice(k);
 if(c.np&&d.length>c.mx&&d.indexOf(c.np)===0)d=d.slice(c.np.length);
 return d.slice(0,c.mx);}
function dcRange(c){return c.mn===c.mx?c.mx+' digits':c.mn+' to '+c.mx+' digits';}
function dcHint(){var c=dcCur(),p=$$('dph');
 if(p)p.placeholder=c.mn===c.mx?c.mx+'-digit number':dcRange(c);}
function dcFinal(raw){var c=dcCur(),d=dcTrim(dcDigits(raw),c);
 if(c.np==='0'&&d.charAt(0)==='0')d=d.slice(1);
 var ok=d.length>=c.mn&&d.length<=c.mx&&(c.c!=='IN'||/^[6-9]/.test(d));
 return {c:c,d:d,ok:ok};}
function dcMsg(c){return c.c==='IN'?'Please enter a valid 10-digit mobile number.':'Please enter a valid mobile number for '+c.n+': '+dcRange(c)+', without the country code.';}
function dcInput(){var el=$$('dph'),raw=el.value,c=dcCur(),d=dcDigits(raw);
 if(/^\s*\+/.test(raw)){var f=dcByDial(d,c);
  if(f){if(f.c.c!==c.c){$$('dcc').value=f.c.c;c=f.c;dcHint();}d=d.slice(f.len);}
  else if(d.length<3){$$('dmsg').textContent='';dnSync();return;}}
 d=dcTrim(d,c);if(el.value!==d)el.value=d;
 $$('dmsg').textContent='';dnSync();}
function dInit(api){
 dcHint();
 $$('dch').onclick=function(e){var v=e.target.dataset&&e.target.dataset.v;if(!v)return;$$('damt').value=v;$$('dmsg').textContent='';dnSync();};
 $$('damt').oninput=function(){this.value=this.value.replace(/[^\d,\s]/g,'');$$('dmsg').textContent='';dnSync();};
 $$('dph').oninput=dcInput;
 $$('dcc').onchange=function(){dcHint();dcInput();};
 $$('dnm').oninput=$$('dem').oninput=function(){$$('dmsg').textContent='';};
 $$('dform').onsubmit=async function(e){e.preventDefault();if(DN.busy)return;
  var a=dAmt(),m=$$('dmsg');m.className='cfs';
  if(!(a>=10&&a<=50000)){m.className='cfs bad';m.textContent='Please enter an amount between ₹10 and ₹50,000.';return;}
  var pn=dcFinal($$('dph').value);
  if(!pn.ok){m.className='cfs bad';m.textContent=dcMsg(pn.c);$$('dph').focus();return;}
  var em=$$('dem').value.trim();
  if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.className='cfs bad';m.textContent='That email address does not look right.';$$('dem').focus();return;}
  DN.busy=true;dnSync();m.textContent='';
  try{
   var r=await fetch(api+'/donate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:a,cc:pn.c.d,phone:pn.d,name:$$('dnm').value,email:em,website:$$('dws').value})});
   var j=null;try{j=await r.json();}catch(x){}
   if(r.ok&&j&&/^session_/.test(j.session||'')){m.textContent='Taking you to the secure payment page...';
    try{var CF=await cfSdk();CF({mode:j.mode==='production'?'production':'sandbox'}).checkout({paymentSessionId:j.session,redirectTarget:'_self'});setTimeout(function(){DN.busy=false;dnSync();},5000);return;}
    catch(x){console.warn('payment page could not open:',x);}
   }
   var er=(j&&j.error)||'';console.warn('donation not started:',r.status,er);
   m.className='cfs bad';
   m.textContent=er==='amount'?'Please enter an amount between ₹10 and ₹50,000.':er==='phone'?dcMsg(pn.c):er==='email'?'That email address does not look right.':er==='slow'?'That was a lot of tries. Please wait a little while and try again.':'We could not start the payment right now. Please try again in a little while.';
  }catch(x){console.warn('donation could not reach the server:',x);m.className='cfs bad';m.textContent='We could not start the payment right now. Please check your internet connection and try again.';}
  DN.busy=false;dnSync();};
 dnSync();
}
function cfSdk(){if(window.Cashfree)return Promise.resolve(window.Cashfree);
 if(!cfSdk.p)cfSdk.p=new Promise(function(ok,no){var sc=document.createElement('script');sc.src='https://sdk.cashfree.com/js/v3/cashfree.js';sc.async=true;
  sc.onload=function(){window.Cashfree?ok(window.Cashfree):(cfSdk.p=null,no(new Error('sdk')));};sc.onerror=function(){cfSdk.p=null;no(new Error('sdk'));};document.head.appendChild(sc);});
 return cfSdk.p;}
async function dThanks(api){
 var id=(new URLSearchParams(location.search)).get('thanks');if(!id||!/^don_[a-z0-9]{8,40}$/.test(id))return;
 var n=$$('dnote');if(!n)return;
 n.innerHTML='<div class="note" style="margin:0 0 16px">Checking your payment...</div>';
 try{history.replaceState(null,'',U('donate'));}catch(e){}
 var st='UNKNOWN',amt=0;
 try{var r=await fetch(api+'/status?id='+encodeURIComponent(id));var j=await r.json();st=j.status||'UNKNOWN';amt=j.amount||0;}catch(e){}
 if(!$$('dnote'))return;
 if(st==='PAID')n.innerHTML='<div class="note" style="margin:0 0 16px;background:rgba(52,199,89,.16)"><b>Thank you!</b> Your donation'+(amt?' of '+esc(inr(amt)):'')+' went through. It really helps keep Eve Sandbox free for every student.</div>';
 else if(st==='PENDING')n.innerHTML='<div class="note" style="margin:0 0 16px"><b>We have not received the payment yet.</b> If you completed it, it can take a few minutes to show up. If you did not finish, you are welcome to try again below.</div>';
 else if(st==='EXPIRED')n.innerHTML='<div class="note" style="margin:0 0 16px">That payment link has expired, so nothing was charged. You are welcome to try again below.</div>';
 else n.innerHTML='<div class="note" style="margin:0 0 16px">We could not check that payment just now. If money left your account, it will be shown in your bank or UPI app, and you can <a href="#/contact">contact us</a>.</div>';
}
function termsPage(){nav('terms');
 app.innerHTML=banner('Legal','Terms of Service','Last updated: October 10, 2026')+
 '<div class="wrapc doc" style="max-width:760px"><p>By using Eve Sandbox you agree to these terms. If you do not agree, please do not use the site.</p>'+
 '<h2>1. Using the site</h2><p>Eve Sandbox provides free tools for personal and educational use. You must use them lawfully and must not use the site to harm others, break the law, or interfere with how the site works.</p>'+
 '<h2>2. Your files and data</h2><p>The image and PDF tools work inside your browser. Your files are not uploaded to Eve Sandbox. You keep all rights to your files and are responsible for having the right to edit them. Keep a copy of your originals, because we cannot recover files for you. See the <a href="#/privacy" style="color:var(--brand)">Privacy</a> page for details.</p>'+
 '<h2>3. Passwords on PDFs</h2><p>If you protect a PDF with a password, we cannot recover that password for you. Only remove a password from a file you own or have permission to unlock. The tool cannot guess or crack passwords.</p>'+
 '<h2>4. Virus Checker</h2><p>The Virus Checker gives an automated opinion based on the look of an address and on third-party services. It is not a guarantee that a site is safe or unsafe. Use your own judgment, and do not enter passwords or payment details on a site you are unsure about.</p>'+
 '<h2>5. Prices and suggestions</h2><p>Suggestions, price ranges and verdicts in Deal or No Deal and Eve AI are automated estimates, not live prices or professional advice. Prices, offers and stock change often, so check everything on the store’s own page before you pay. Product links come from an automated web search and can be out of date, sold out or not exactly what you meant. Eve Sandbox does not sell products and is not connected to the stores it links to.</p>'+
 '<h2>6. No warranty</h2><p>The site and its tools are provided “as is” and “as available”, without promises of accuracy, availability or fitness for a particular purpose. To the fullest extent the law allows, we are not liable for any loss or damage from using the site or relying on its results.</p>'+
 '<h2>7. Third-party services and links</h2><p>Some features use or link to services run by others, such as lookup services, security-checking websites and payment and email services. We do not control them and are not responsible for their content or policies.</p>'+
 '<h2>8. Changes</h2><p>We may change the site or these terms from time to time. Continuing to use the site after a change means you accept the updated terms.</p>'+
 '<h2>9. Contact</h2><p>Questions about these terms? Use the <a href="#/contact" style="color:var(--brand)">Contact</a> page.</p></div>';}
function privacyPage(){nav('privacy');
 app.innerHTML=banner('Legal','Privacy','Last updated: October 10, 2026')+
 '<div class="wrapc doc" style="max-width:760px"><h2 style="margin-top:0">The short version</h2><p>No accounts. Your images and PDFs stay on your device. We do not add analytics or advertising code to this site.</p>'+
 '<h2>What stays on your device</h2><ul><li>Images and PDFs you open in the tools are processed in your browser and are never sent to us.</li><li>The Study Planner, the Complex Calculator and your Eve AI chats save their data in your browser so it is there next time. Clearing your browser data removes it.</li></ul>'+
 '<h2>What leaves your device</h2><p>Some features need help from outside services. We keep this to the minimum each feature needs, and those services follow their own privacy policies.</p><ul>'+
 '<li><b>Virus Checker:</b> the address you enter is sent to a few public lookup services to find out about it. The tool never visits the address itself.</li>'+
 '<li><b>Supporting software:</b> some tools (such as the PDF tools, the File Converter and Eve IDE) download the extra software they need from a public source the first time you use them.</li>'+
 '<li><b>Eve IDE:</b> Python runs on your device. When you run C or Java, your code and input are sent to an online service that runs them and sends back the result.</li>'+
 '<li><b>Grab Box:</b> it fetches the link you paste from the website it points to.</li>'+
 '<li><b>Eve AI:</b> the messages you send Eve, and any notes you attach, are sent to an AI service so it can write a reply. They are not stored by this website. Your chat history and saved flashcards stay on your device. Please do not share passwords or private personal details.</li>'+
 '<li><b>Deal or No Deal:</b> what you type about the item you want, your budget, and any prices you add are sent to an AI service so it can write its suggestions, and to a web search service that looks for matching product pages. They are not stored by this website. Please do not type personal details.</li>'+
 '<li><b>Text to Speech:</b> the Speak as you type section runs on your device and sends nothing. When you make an audio file, the paragraph you wrote is sent to a speech service so it can create the audio. It is not stored by this website. Please do not type personal details.</li>'+
 '<li><b>Live Translate:</b> in Speak, your browser’s own speech service turns what you say into text. If that service cannot be used, short clips of your voice are sent to a speech service instead so they can be turned into text, and they are not stored by this website. In Screen, the picture of your screen never leaves your device; the words on it are read on your device. The words are then translated on your device when your browser can do that, or sent to a translation service so they can be translated. They are not stored by this website. Please do not share private personal details.</li>'+
 '<li><b>Links you open</b> take you to other websites with their own policies.</li>'+
 '<li><b>Contact form:</b> the form uses a security check to tell people from automated programs, and the check provider may look at technical details of your browser to do this. The name, email and message you type are sent to us by email so they reach us. We use them only to read and answer your message.</li>'+
 '<li><b>Donations:</b> if you donate, the amount and the mobile number you type (plus the name and email, if you give them) are sent to our payment partner to start the payment, and you pay on their page under their own privacy policy. Eve Sandbox does not store your payment details or your mobile number.</li></ul>'+
 '<h2>Hosting</h2><p>Whoever hosts the site may keep ordinary server logs, such as IP addresses and page requests, under their own policy.</p>'+
 '<h2>Questions</h2><p>Use the <a href="#/contact" style="color:var(--brand)">Contact</a> page.</p></div>';}
var CKEY='eve-sandbox:calc:v1';
var G10=[['O',10],['A+',9],['A',8],['B+',7],['B',6],['C',5],['P',4],['F',0]];
var G4=[['A',4],['A-',3.7],['B+',3.3],['B',3],['B-',2.7],['C+',2.3],['C',2],['C-',1.7],['D',1],['F',0]];
function cRows(n,mkRow){var a=[];for(var i=0;i<n;i++)a.push(mkRow());return a;}
function cDef(){return {tab:'cgpa',cg:{scale:'10',method:'credit',mult:9.5,max:10,sems:[{rows:cRows(5,function(){return {n:'',c:'',g:''};})}],tgt:{t:'',rem:''}},at:{req:75,rows:cRows(4,function(){return {n:'',a:'',t:''};}),fut:{n:'',m:''}}};}
var C=cDef();
try{var craw=localStorage.getItem(CKEY);if(craw){var cp=JSON.parse(craw);
 if(cp&&cp.cg&&cp.at&&Array.isArray(cp.cg.sems)&&cp.cg.sems.length&&cp.cg.sems.every(function(s){return s&&Array.isArray(s.rows);})&&Array.isArray(cp.at.rows)&&cp.at.rows.length&&cp.cg.tgt&&cp.at.fut)C=cp;}}catch(e){}
function cSave(){try{localStorage.setItem(CKEY,JSON.stringify(C));}catch(e){}}
function nm(v){var x=parseFloat(v);return isFinite(x)?x:NaN;}
function f2(x){return (Math.round(x*100)/100).toFixed(2);}
function f1(x){return (Math.round(x*10)/10).toFixed(1);}
function maxGp(){var c=C.cg;return c.scale==='10'?10:c.scale==='4'?4:(nm(c.max)>0?nm(c.max):10);}
function gpOf(g){var c=C.cg;if(c.scale==='10'||c.scale==='4'){var L=c.scale==='10'?G10:G4;for(var i=0;i<L.length;i++)if(L[i][0]===g)return L[i][1];return NaN;}var x=nm(g);return (x>=0&&x<=maxGp())?x:NaN;}
function cgCalc(){var cg=C.cg,TP=0,TC=0,sg=[],sum=0,cnt=0;
 cg.sems.forEach(function(s){var p=0,cr=0;s.rows.forEach(function(r){var c=nm(r.c),g=gpOf(r.g);if(c>0&&!isNaN(g)){p+=c*g;cr+=c;}});TP+=p;TC+=cr;var sgpa=cr>0?p/cr:NaN;sg.push({sgpa:sgpa,cr:cr});if(cr>0){sum+=sgpa;cnt++;}});
 return {TP:TP,TC:TC,sg:sg,cnt:cnt,cgpa:cg.method==='avg'?(cnt?sum/cnt:NaN):(TC>0?TP/TC:NaN)};}
function atAdvice(a,t,req){var r=req/100,p=a/t*100;
 if(r>=1)return a===t?{k:'warn',m:'Perfect so far. You cannot miss any class.'}:{k:'bad',m:'100% can no longer be reached.'};
 if(p+1e-9>=req){var x=Math.floor(a/r-t+1e-9);return x>0?{k:'good',m:'You can miss '+x+' more class'+(x===1?'':'es')+' and stay at '+req+'% or above.'}:{k:'warn',m:'Right at the limit. Missing the next class drops you below '+req+'%.'};}
 var y=Math.ceil((r*t-a)/(1-r)-1e-9);return {k:'bad',m:'Attend the next '+y+' class'+(y===1?'':'es')+' in a row to reach '+req+'%.'};}
function atCalc(){var A=0,T=0,rows=C.at.rows.map(function(r){var a=nm(r.a),t=nm(r.t),ok=t>0&&a>=0&&a<=t;if(ok){A+=a;T+=t;}return {ok:ok,bad:(r.a!==''||r.t!=='')&&!ok,a:a,t:t};});return {A:A,T:T,rows:rows};}
function reqPct(){var q=nm(C.at.req);return (q>=1&&q<=100)?q:NaN;}

function calcPage(){nav('calc');
 app.innerHTML='<h1 style="font-size:2.2rem">Complex Calculator</h1><p class="lead" style="font-size:1rem">Work out your CGPA and your attendance, and see what you need to reach your targets. Your entries are saved on this device.</p>'+
 '<div class="seg" id="ctabs" style="margin:16px 0"><a data-ct="cgpa" href="javascript:void 0">CGPA</a><a data-ct="att" href="javascript:void 0">Attendance</a></div><div id="cbody"></div>';
 $$('ctabs').onclick=function(e){var t=e.target.dataset.ct;if(!t)return;C.tab=t;cSave();cView();};
 cView();
}
function cView(){document.querySelectorAll('#ctabs a').forEach(function(a){a.classList.toggle('on',a.dataset.ct===C.tab);});if(C.tab==='att')atView();else cgView();}

function cgView(){
 var cg=C.cg,sc=cg.scale,L=sc==='10'?G10:G4,h='';
 h+='<div class="card cres"><div class="hint" style="color:rgba(255,255,255,.8);margin:0">Your CGPA</div><div class="big" id="cgv">-</div><div class="chipsr" style="margin-top:14px" id="cgc"></div></div>';
 h+='<div class="card" style="margin-top:14px"><b>Settings</b><div class="row" style="margin-top:10px">'+
  '<label class="hint">Grading scale<br><select class="sel" id="cgsc"><option value="10"'+(sc==='10'?' selected':'')+'>10 point (O, A+, A...)</option><option value="4"'+(sc==='4'?' selected':'')+'>4.0 scale (A, B+, B...)</option><option value="custom"'+(sc==='custom'?' selected':'')+'>Type grade points</option></select></label>'+
  '<label class="hint">CGPA method<br><select class="sel" id="cgm"><option value="credit"'+(cg.method==='credit'?' selected':'')+'>Credit weighted</option><option value="avg"'+(cg.method==='avg'?' selected':'')+'>Average of semester GPAs</option></select></label>'+
  (sc==='10'?'<label class="hint">Percentage = CGPA ×<br><input type="number" id="cgx" min="1" max="20" step="0.1" value="'+esc(cg.mult)+'" style="width:90px"></label>':'')+
  (sc==='custom'?'<label class="hint">Highest grade point<br><input type="number" id="cgmx" min="1" step="0.5" value="'+esc(cg.max)+'" style="width:90px"></label>':'')+'</div>'+
  '<p class="hint" style="margin:10px 0 0">Rows with no credits or no grade are skipped. Some universities use a different percentage formula, so you can change the multiplier.</p></div>';
 h+='<div id="cgs">';
 cg.sems.forEach(function(s,si){
  h+='<div class="card" style="margin-top:14px"><div class="row"><b>Semester '+(si+1)+'</b><span class="pl2" id="sg'+si+'">GPA -</span><span class="sp"></span><button class="btn" data-rs="'+si+'" aria-label="Remove semester">'+ico('x',14,2.5)+'</button></div>'+
  '<div class="cr ch"><span>Course</span><span>Credits</span><span>Grade</span><span></span></div>';
  s.rows.forEach(function(r,ri){
   var d=' data-s="'+si+'" data-r="'+ri+'"';
   var gc=sc==='custom'?'<input type="number" inputmode="decimal" min="0" step="0.1" data-k="g"'+d+' value="'+esc(r.g)+'" placeholder="0-'+esc(maxGp())+'" aria-label="Grade points">':
    '<select data-k="g"'+d+' aria-label="Grade"><option value="">-</option>'+L.map(function(g){return '<option'+(g[0]===r.g?' selected':'')+'>'+esc(g[0])+'</option>';}).join('')+'</select>';
   h+='<div class="cr"><input type="text" data-k="n"'+d+' value="'+esc(r.n)+'" placeholder="Optional" maxlength="40" aria-label="Course name"><input type="number" inputmode="decimal" min="0" step="0.5" data-k="c"'+d+' value="'+esc(r.c)+'" placeholder="0" aria-label="Credits">'+gc+'<button class="rm" data-rr="'+si+':'+ri+'" aria-label="Remove course">'+ico('x',16)+'</button></div>';});
  h+='<div class="bar" style="margin-bottom:0"><button class="btn" data-ac="'+si+'">+ Add course</button></div></div>';});
 h+='</div><div class="bar"><button class="btn" id="addsem">+ Add semester</button><span class="sp"></span><button class="btn" id="cgclr">Clear all</button></div>';
 h+='<div class="card"><b>Target planner</b><p class="hint" style="margin:4px 0 0">Find the average grade you need in your remaining credits to reach a target CGPA (credit weighted).</p><div class="row" style="margin-top:10px"><label class="hint">Target CGPA<br><input type="number" id="tgt" inputmode="decimal" min="0" step="0.01" value="'+esc(cg.tgt.t)+'" style="width:110px"></label><label class="hint">Credits still to take<br><input type="number" id="trem" inputmode="decimal" min="0" step="0.5" value="'+esc(cg.tgt.rem)+'" style="width:130px"></label></div><div id="tgo"></div></div>';
 $$('cbody').innerHTML=h;
 var b=$$('cbody');
 b.oninput=b.onchange=function(e){var t=e.target,k=t.dataset.k;
  if(k){C.cg.sems[+t.dataset.s].rows[+t.dataset.r][k]=t.value;}
  else if(t.id==='cgx')C.cg.mult=t.value;else if(t.id==='cgmx'){C.cg.max=t.value;}
  else if(t.id==='tgt')C.cg.tgt.t=t.value;else if(t.id==='trem')C.cg.tgt.rem=t.value;
  else if(t.id==='cgm')C.cg.method=t.value;
  else if(t.id==='cgsc'&&e.type==='change'){if(t.value!==C.cg.scale){C.cg.scale=t.value;C.cg.sems.forEach(function(s){s.rows.forEach(function(r){r.g='';});});cSave();cgView();return;}}
  else return;
  cSave();cgOut();};
 b.onclick=function(e){var t=e.target.closest('button');if(!t)return;
  if(t.dataset.ac!=null){C.cg.sems[+t.dataset.ac].rows.push({n:'',c:'',g:''});}
  else if(t.dataset.rr){var p=t.dataset.rr.split(':'),rows=C.cg.sems[+p[0]].rows;if(rows.length>1)rows.splice(+p[1],1);else rows[0]={n:'',c:'',g:''};}
  else if(t.dataset.rs!=null){if(C.cg.sems.length>1)C.cg.sems.splice(+t.dataset.rs,1);else C.cg.sems[0].rows=cRows(5,function(){return {n:'',c:'',g:''};});}
  else if(t.id==='addsem'){C.cg.sems.push({rows:cRows(5,function(){return {n:'',c:'',g:''};})});}
  else if(t.id==='cgclr'){C.cg=cDef().cg;}
  else return;
  cSave();cgView();};
 cgOut();
}
function cgOut(){var cg=C.cg,r=cgCalc(),v=$$('cgv');if(!v)return;
 v.textContent=isNaN(r.cgpa)?'-':f2(r.cgpa);
 var chips='';
 if(!isNaN(r.cgpa)){if(cg.scale==='10'&&nm(cg.mult)>0)chips+='<span class="pill">Approx. '+f1(Math.min(100,r.cgpa*nm(cg.mult)))+'%</span>';chips+='<span class="pill">out of '+maxGp()+'</span><span class="pill">'+(Math.round(r.TC*100)/100)+' credits counted</span>';}
 else chips='<span class="pill">Enter credits and grades to see your CGPA</span>';
 $$('cgc').innerHTML=chips;
 r.sg.forEach(function(s,i){var e=$$('sg'+i);if(e)e.textContent=isNaN(s.sgpa)?'GPA -':'GPA '+f2(s.sgpa)+' · '+(Math.round(s.cr*100)/100)+' cr';});
 var t=nm(cg.tgt.t),rem=nm(cg.tgt.rem),o=$$('tgo'),m='';
 if(t>=0&&rem>0&&r.TC>0){var mx=maxGp(),need=(t*(r.TC+rem)-r.TP)/rem,best=(r.TP+mx*rem)/(r.TC+rem);
  if(t>mx)m='<div class="msg bad"><span class="dotk"></span>Your target is above the top of the scale ('+mx+').</div>';
  else if(need<=0)m='<div class="msg good"><span class="dotk"></span>You already have enough. Even scoring 0 in the rest keeps you at '+f2(r.TP/(r.TC+rem))+' or above.</div>';
  else if(need>mx+1e-9)m='<div class="msg bad"><span class="dotk"></span>Not reachable. Even top grades in all '+rem+' credits would give a CGPA of '+f2(best)+'.</div>';
  else m='<div class="msg good"><span class="dotk"></span>You need an average of <b>'+f2(need)+'</b> over the next '+rem+' credits to finish at '+f2(t)+'.</div>';}
 else if(t>=0&&rem>0)m='<div class="msg"><span class="dotk"></span>Add your grades above first.</div>';
 o.innerHTML=m;}

function atView(){
 var at=C.at,h='';
 h+='<div class="card cres" id="atc"><div class="hint" style="color:rgba(255,255,255,.8);margin:0">Overall attendance</div><div class="big" id="atv">-</div><div class="chipsr" style="margin-top:14px" id="atch"></div></div>';
 h+='<div id="atm"></div>';
 h+='<div class="card" style="margin-top:14px"><div class="row"><label class="hint">Required attendance (%)<br><input type="number" id="atq" inputmode="decimal" min="1" max="100" step="1" value="'+esc(at.req)+'" style="width:110px"></label></div><p class="hint" style="margin:10px 0 0">Enter classes attended and total classes held so far for each subject. Leave unused rows empty.</p></div>';
 h+='<div id="ats">';
 at.rows.forEach(function(r,i){var d=' data-i="'+i+'"';
  h+='<div class="card" style="margin-top:14px;padding:14px 18px"><div class="cr cr3" style="margin-top:0"><input type="text" data-k="n"'+d+' value="'+esc(r.n)+'" placeholder="Subject '+(i+1)+'" maxlength="40" aria-label="Subject name"><input type="number" inputmode="numeric" min="0" step="1" data-k="a"'+d+' value="'+esc(r.a)+'" placeholder="Attended" aria-label="Classes attended"><input type="number" inputmode="numeric" min="0" step="1" data-k="t"'+d+' value="'+esc(r.t)+'" placeholder="Total" aria-label="Total classes"><button class="rm" data-rr="'+i+'" aria-label="Remove subject">'+ico('x',16)+'</button></div><div id="ar'+i+'"></div></div>';});
 h+='</div><div class="bar"><button class="btn" id="atadd">+ Add subject</button><span class="sp"></span><button class="btn" id="atclr">Clear all</button></div>';
 h+='<div class="card"><b>What if?</b><p class="hint" style="margin:4px 0 0">See your overall attendance after upcoming classes.</p><div class="row" style="margin-top:10px"><label class="hint">Upcoming classes<br><input type="number" id="fn" inputmode="numeric" min="0" step="1" value="'+esc(at.fut.n)+'" style="width:120px"></label><label class="hint">I will attend<br><input type="number" id="fm" inputmode="numeric" min="0" step="1" value="'+esc(at.fut.m)+'" style="width:120px"></label></div><div id="fo"></div></div>';
 $$('cbody').innerHTML=h;
 var b=$$('cbody');
 b.oninput=function(e){var t=e.target,k=t.dataset.k;
  if(k)C.at.rows[+t.dataset.i][k]=t.value;else if(t.id==='atq')C.at.req=t.value;else if(t.id==='fn')C.at.fut.n=t.value;else if(t.id==='fm')C.at.fut.m=t.value;else return;
  cSave();atOut();};
 b.onclick=function(e){var t=e.target.closest('button');if(!t)return;
  if(t.dataset.rr!=null){if(C.at.rows.length>1)C.at.rows.splice(+t.dataset.rr,1);else C.at.rows[0]={n:'',a:'',t:''};}
  else if(t.id==='atadd')C.at.rows.push({n:'',a:'',t:''});
  else if(t.id==='atclr')C.at=cDef().at;
  else return;
  cSave();atView();};
 atOut();
}
function atOut(){var at=C.at,r=atCalc(),req=reqPct(),v=$$('atv');if(!v)return;
 var dot=function(k,m){return '<div class="msg '+k+'"><span class="dotk"></span>'+m+'</div>';};
 r.rows.forEach(function(x,i){var e=$$('ar'+i);if(!e)return;
  if(x.ok&&!isNaN(req)){var p=x.a/x.t*100,ad=atAdvice(x.a,x.t,req);e.innerHTML=dot(ad.k,'<b>'+f1(p)+'%</b> · '+ad.m);}
  else if(x.bad)e.innerHTML=dot('bad','Attended classes cannot be more than total classes.');
  else e.innerHTML='';});
 var ch='',m='';
 if(isNaN(req)){v.textContent='-';ch='<span class="pill">Enter a required percentage between 1 and 100</span>';}
 else if(r.T>0){var p=r.A/r.T*100,ad=atAdvice(r.A,r.T,req);v.textContent=f1(p)+'%';
  ch='<span class="pill">'+r.A+' of '+r.T+' classes</span><span class="pill">Required '+req+'%</span>';
  m=dot(ad.k,ad.m);}
 else{v.textContent='-';ch='<span class="pill">Enter classes attended and total classes</span>';}
 $$('atch').innerHTML=ch;$$('atm').innerHTML=m?'<div style="margin-top:10px">'+m+'</div>':'';
 var n=nm(at.fut.n),a=nm(at.fut.m),o=$$('fo'),fm='';
 if(n>=0&&a>=0){if(a>n)fm=dot('bad','You cannot attend more classes than are held.');
  else if(r.T+n>0){var pp=(r.A+a)/(r.T+n)*100;fm=dot(!isNaN(req)?(pp+1e-9>=req?'good':'bad'):'','Projected overall attendance: <b>'+f1(pp)+'%</b> ('+(r.A+a)+' of '+(r.T+n)+' classes).');}}
 o.innerHTML=fm;}

function menu(o){var b=document.getElementById('burger');if(!b)return;b.setAttribute('aria-expanded',o?'true':'false');var hd=document.getElementById('hdr');clearTimeout(menu.t);hd.classList.remove('mset');hd.classList.toggle('open',!!o);if(o)menu.t=setTimeout(function(){hd.classList.add('mset');},400);document.body.style.overflow=o?'hidden':'';}
document.getElementById('burger').onclick=function(){menu(this.getAttribute('aria-expanded')!=='true');};
document.getElementById('mpanel').addEventListener('click',function(e){if(e.target.closest('a'))menu(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false);});
document.addEventListener('visibilitychange',function(){document.documentElement.classList.toggle('bgpause',document.hidden);});
window.addEventListener('resize',function(){if(window.innerWidth>820)menu(false);});
var FULL={tools:toolsPage,about:aboutPage,contact:contactPage,donate:donatePage,terms:termsPage,privacy:privacyPage};

/* ---------- pages and addresses ---------- */
var PAGE=EVE_PAGE,PM=!!PAGE,BASEP=EVE_BASE,INIT404=PAGE==='404';
var ROUTES=['tools','about','contact','donate','terms','privacy','planner','image','pdf','virus','calc','deal','tts','qr','grab','convert','ide','eve','translate'];
var TITLES={home:'Home',tools:'Tools',about:'About',contact:'Contact',donate:'Donate',terms:'Terms of Service',privacy:'Privacy',planner:'Study Planner',image:'Image Tool',pdf:'PDF Tool',virus:'Virus Checker',calc:'Complex Calculator',deal:'Deal or No Deal',tts:'Text to Speech',qr:'QR Code Generator',grab:'Grab Box',convert:'File Converter',ide:'Eve IDE',eve:'Eve AI',translate:'Live Translate','404':'Page Not Found'};
function U(r){r=(!r||r==='home')?'':r;return PM?BASEP+(r?r+'/':''):'#/'+r;}
function curR(){
 if(!PM)return location.hash.replace('#/','');
 if(INIT404)return '404';
 var p=location.pathname.replace(/index\.html$/,'');
 if(p.indexOf(BASEP)===0)p=p.slice(BASEP.length);
 return p.replace(/^\/+|\/+$/g,'');
}
function setTitle(r){document.title='Eve Sandbox - '+(TITLES[r]||'Page Not Found');}
function fixLinks(root){if(!PM)return;(root||document).querySelectorAll('a[href^="#/"]').forEach(function(a){var m=/^#\/([a-z-]*)$/.exec(a.getAttribute('href'));if(m&&(m[1]===''||ROUTES.indexOf(m[1])>=0))a.setAttribute('href',U(m[1]));});}
function fire(){window.dispatchEvent(new Event('hashchange'));}
function go(r){var u=U(r);
 if(location.pathname===u&&!INIT404){window.scrollTo(0,0);return;}
 INIT404=false;
 try{history.pushState(null,'',u);}catch(e){location.href=u;return;}
 fire();}
function notFound(){nav('404');
 app.innerHTML=banner('404','Page not found','That page does not exist.')+'<div class="wrapc"><div class="card" style="text-align:center;padding:32px 20px"><h3>We could not find that page</h3><p>The link may be old or mistyped.</p><div class="cta" style="justify-content:center;margin-top:16px"><a class="btn pri" href="#/">Go to the home page</a><a class="btn" href="#/tools">See the tools</a></div><p style="margin-top:26px">Or jump straight to a tool:</p><div class="cta" style="justify-content:center;margin-top:10px"><a class="btn" href="#/eve">Eve AI</a><a class="btn" href="#/planner">Study Planner</a><a class="btn" href="#/image">Image Tool</a><a class="btn" href="#/pdf">PDF Tool</a><a class="btn" href="#/calc">Complex Calculator</a></div></div></div>';}
/* ---------- Grab Box: direct file links ---------- */
var GB={ab:null,blob:null,url:''};
function gbName(u,ct){
 var n='';try{n=decodeURIComponent(new URL(u).pathname.split('/').filter(Boolean).pop()||'');}catch(e){}
 n=n.replace(/[^\w.\- ]+/g,'').trim();
 var ext={'video/mp4':'mp4','video/webm':'webm','audio/mpeg':'mp3','audio/mp4':'m4a','audio/ogg':'ogg','audio/wav':'wav','image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif','image/svg+xml':'svg','application/pdf':'pdf','application/zip':'zip'}[(ct||'').split(';')[0]]||'';
 if(!n)n='download';
 if(!/\.[A-Za-z0-9]{2,5}$/.test(n)&&ext)n+='.'+ext;
 return n;
}
function gbMsg(h,bad){var e=$$('gbmsg');e.className='note'+(bad?' bad':'');e.innerHTML=h;e.style.display='block';}
function gbBlocked(h){return /(^|\.)(youtube\.com|youtu\.be|instagram\.com|facebook\.com|fb\.watch|fb\.com|twitter\.com|x\.com|t\.co)$/i.test(h);}
async function gbFetch(href,sig){
 var r=null;
 try{r=await fetch(href,{signal:sig,credentials:'omit',referrerPolicy:'no-referrer'});}
 catch(e){if(!CFG.grabApi||(e&&e.name==='AbortError'))throw e;}
 if(r&&r.ok)return r;
 if(!CFG.grabApi)return r||Promise.reject(new TypeError('blocked'));
 return fetch(CFG.grabApi+(CFG.grabApi.indexOf('?')<0?'?':'&')+'url='+encodeURIComponent(href),{signal:sig,credentials:'omit'});
}
async function gbGo(direct){
 var raw=($$('gbu').value||'').trim(),u;
 $$('gbout').innerHTML='';$$('gbmsg').style.display='none';
 if(!raw){gbMsg('Paste a direct link to a file first.',1);return;}
 if(!/^[a-z][a-z0-9+.\-]*:/i.test(raw))raw='https://'+raw;
 try{u=new URL(raw);}catch(e){gbMsg('That does not look like a valid link.',1);return;}
 if(u.protocol!=='https:'&&u.protocol!=='http:'){gbMsg('Only http and https links work.',1);return;}
 if(gbBlocked(u.hostname)){gbMsg('Links to video sites and social networks are not supported. Paste a direct file link (ending in .mp4, .mp3, .jpg, .pdf and so on) or a link to an ordinary web page that has the file on it.',1);return;}
 if(location.protocol==='https:'&&u.protocol==='http:'){gbMsg('This site is secure, so the browser blocks plain http downloads. Try the https version of the link.',1);return;}
 GB.blob=null;if(GB.ab)GB.ab.abort();GB.ab=new AbortController();
 var go=$$('gbgo');go.disabled=true;
 $$('gbout').innerHTML='<div class="card" style="margin-top:14px"><b id="gbt">Connecting...</b><div class="gbbar"><i id="gbp"></i></div><div class="row" style="justify-content:space-between;margin-top:8px"><span class="hint" id="gbs"></span><button class="btn" id="gbx">Cancel</button></div></div>';
 $$('gbx').onclick=function(){if(GB.ab)GB.ab.abort();};
 try{
  var r=await gbFetch(u.href,GB.ab.signal);
  if(!r.ok){if(r.status===415&&CFG.grabApi&&!direct){await gbScan(u);go.disabled=false;return;}throw {http:r.status};}
  var ct=r.headers.get('content-type')||'',tot=+r.headers.get('content-length')||0;
  if(/text\/html/i.test(ct)){if(direct)throw {page:1};await gbScan(u);go.disabled=false;return;}
  if(tot>400*1048576){throw {big:1};}
  var rd=r.body&&r.body.getReader?r.body.getReader():null,parts=[],got=0;
  $$('gbt').textContent='Downloading...';
  if(rd){
   for(;;){var x=await rd.read();if(x.done)break;parts.push(x.value);got+=x.value.length;
    if(got>400*1048576){GB.ab.abort();throw {big:1};}
    $$('gbp').style.width=(tot?Math.min(100,got/tot*100):50)+'%';
    if(!tot)$$('gbp').classList.add('ind');
    $$('gbs').textContent=fb(got)+(tot?' of '+fb(tot):'');}
  }else{var bb=await r.blob();parts=[bb];got=bb.size;}
  var blob=new Blob(parts,{type:ct.split(';')[0]||'application/octet-stream'});
  GB.blob=blob;var nm=gbName(u.href,ct);
  var pv='',ou=URL.createObjectURL(blob);
  if(/^video\//.test(blob.type))pv='<video controls playsinline preload="metadata" src="'+ou+'" class="gbpv"></video>';
  else if(/^audio\//.test(blob.type))pv='<audio controls src="'+ou+'" style="width:100%;margin-top:12px"></audio>';
  else if(/^image\//.test(blob.type))pv='<img src="'+ou+'" alt="Preview" class="gbpv" draggable="false">';
  $$('gbout').innerHTML='<div class="card" style="margin-top:14px"><b>Ready</b><p class="hint" style="margin:.2em 0 0">'+esc(nm)+' &middot; '+fb(blob.size)+'</p>'+pv+'<div class="row" style="margin-top:12px"><button class="btn pri" id="gbdl">'+ico('dlbox',16,2.4)+' Download</button></div></div>';
  $$('gbdl').onclick=function(){fileSave(GB.blob,nm);};
 }catch(e){
  $$('gbout').innerHTML='';
  if(e&&e.name==='AbortError'){gbMsg('Download cancelled.');}
  else if(e&&e.http)gbMsg('The site answered with an error ('+e.http+'). Check that the link still works.',1);
  else if(e&&e.page)gbMsg('That link opens a web page, not a file. Right-click the file on that page and copy its link address, then paste it here.',1);
  else if(e&&e.big)gbMsg('That file is larger than 400 MB, which is too big to download in the browser.',1);
  else if(!direct&&!CFG.grabApi){gbMsg('That website does not let this link be downloaded here. <a href="'+esc(u.href)+'" target="_blank" rel="noopener noreferrer">Open the link directly</a> instead.',1);}
  else gbMsg('The browser could not fetch that file. Most often the other website does not allow downloads from other sites. <a href="'+esc(u.href)+'" target="_blank" rel="noopener noreferrer">Open the link directly</a> instead.',1);
 }
 go.disabled=false;
}
function gbScanHtml(html,base){
 var found=[],seen={},EXT=/\.(mp4|webm|m4v|mov|ogv|mp3|m4a|ogg|wav|flac)(\?|#|$)/i;
 function add(x){if(!x||found.length>=12)return;try{var a=new URL(String(x).replace(/\\\//g,'/'),base);if(!/^https?:$/.test(a.protocol)||gbBlocked(a.hostname)||seen[a.href])return;seen[a.href]=1;found.push(a.href);}catch(e){}}
 var d;try{d=new DOMParser().parseFromString(html,'text/html');}catch(e){return found;}
 d.querySelectorAll('meta[property^="og:video"],meta[property^="og:audio"],meta[name="twitter:player:stream"]').forEach(function(m){var c=m.getAttribute('content');if(c&&(EXT.test(c)||/og:(video|audio)(:url|:secure_url)?$/.test(m.getAttribute('property')||'')))add(c);});
 d.querySelectorAll('video[src],audio[src],source[src]').forEach(function(m){add(m.getAttribute('src'));});
 d.querySelectorAll('a[href]').forEach(function(a){var h=a.getAttribute('href')||'';if(EXT.test(h))add(h);});
 (html.replace(/\\\//g,'/').match(/https?:\/\/[^\s"'<>\\]+?\.(?:mp4|webm|m4v|mov|ogv|mp3|m4a|ogg|wav|flac)(?:\?[^\s"'<>\\]*)?/gi)||[]).forEach(add);
 return found;
}
function gbShowFound(list,pageUrl){
 $$('gbout').innerHTML='';
 if(!list.length){gbMsg('No downloadable files were found on that page. Some sites hide their files or use streaming, which Grab Box cannot save. If you can see the file in your browser\'s Network tab, paste its link here instead.',1);return;}
 $$('gbout').innerHTML='<div class="card" style="margin-top:14px"><b>Found '+list.length+' file'+(list.length>1?'s':'')+'</b><p class="hint" style="margin:.2em 0 0">on '+esc((function(){try{return new URL(pageUrl).hostname;}catch(e){return pageUrl;}})())+'</p>'+list.map(function(u,i){var n=gbName(u,'');var h='';try{h=new URL(u).hostname;}catch(e){}return '<div class="gbfound"><div style="min-width:0"><b class="gbtt" style="-webkit-line-clamp:1">'+esc(n)+'</b><span class="hint">'+esc(h)+'</span></div><button class="btn pri" data-i="'+i+'">Grab</button></div>';}).join('')+'</div>';
 $$('gbout').querySelectorAll('button[data-i]').forEach(function(b){b.onclick=function(){$$('gbu').value=list[+b.dataset.i];gbGo(true);};});
}
async function gbScan(u){
 $$('gbout').innerHTML='<div class="card" style="margin-top:14px"><b>Looking for files on that page...</b><div class="gbbar"><i class="ind"></i></div></div>';
 var html=null;
 try{var r=await fetch(u.href,{credentials:'omit',referrerPolicy:'no-referrer',signal:GB.ab&&GB.ab.signal});if(r.ok)html=await r.text();}catch(e){}
 if(html===null&&CFG.grabApi){
  try{var r2=await fetch(CFG.grabApi.replace(/\/fetch\/?$/,'')+'/page?url='+encodeURIComponent(u.href),{credentials:'omit'});if(r2.ok){var j=await r2.json();html=j.html;}}catch(e){}
 }
 if(html===null){$$('gbout').innerHTML='';gbMsg('Could not read that page. Try pasting the direct link to the file instead.',1);return;}
 gbShowFound(gbScanHtml(html,u.href),u.href);
}
function grabPage(){nav('grab');
 app.innerHTML='<h1 style="font-size:2.2rem">Grab Box</h1><p class="lead" style="font-size:1rem">Paste a link to a file, or to a page that has a video or audio file on it, and Grab Box finds it so you can download it.</p>'+
 '<div class="card" style="margin-top:16px"><div class="row" style="flex-wrap:nowrap;gap:8px"><input type="text" id="gbu" inputmode="url" placeholder="Paste a link here" style="flex:1;font-size:1.05rem;padding:11px 14px" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn pri" id="gbgo">Grab</button></div>'+
 '<p class="hint" style="margin:10px 0 0">Only download files you made or have permission to save. Video sites and social networks are not supported.</p></div><div class="note" id="gbmsg" style="display:none"></div><div id="gbout"></div>';
 $$('gbgo').onclick=function(){gbGo();};$$('gbu').onkeydown=function(e){if(e.key==='Enter')gbGo();};
}
/* ---------- Deal or No Deal ---------- */
var DS={need:'',budget:'',pri:'value',cond:'new',state:'idle',err:'',plan:null,offers:[],judge:null,jstate:'idle',jerr:'',seq:0,run:0,fq:'',flt:{min:'',max:'',sort:'rel',rate:false,fast:false}};
var DPRI=[['price','Lowest price'],['value','Best value'],['quality','Quality'],['speed','Fast delivery']];
var DPRIN={price:'lowest price',value:'best value for money',quality:'quality and long life',speed:'fast delivery'};
var DSTORES=['Amazon','Flipkart','Croma','Reliance Digital','Vijay Sales','Other'];
var DEX=['Laptop with an Intel i7 and a good graphics card','Phone with a great camera under ₹20,000','Noise-cancelling headphones for studying','Scientific calculator for exams'];
var DERR={short:'Tell Eve a little more about what you need.',slow:'That was a lot of requests in a short time. Please wait a few minutes and try again.',limit:'Eve has used up her free help for today. Please try again tomorrow.',busy:'Eve is busy right now. Please try again in a minute.',big:'That is too long. Please shorten it and try again.',net:'Could not connect. Please check your internet and try again.',timeout:'That is taking too long. Please try again.'};
function dErr(c){return DERR[c]||'Eve could not answer right now. Please try again in a moment.';}
function dNum(v){var x=parseFloat(String(v==null?'':v).replace(/[^0-9.]/g,''));return isFinite(x)&&x>=0?Math.min(Math.round(x),100000000):0;}
function dCall(path,body){var base=String(CFG.dealApi||'').replace(/\/+$/,''),ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},55000);
 return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal}).then(function(r){
  return r.json().catch(function(){return {};}).then(function(j){clearTimeout(tm);if(r.ok&&j&&j.ok&&j.data)return j.data;var e=new Error('x');e.code=(j&&j.error)||'down';throw e;});
 },function(e){clearTimeout(tm);var x=new Error('net');x.code=(e&&e.name==='AbortError')?'timeout':'net';throw x;});}
function dQ(q){return encodeURIComponent(String(q).slice(0,120));}
var DST=[['amazon','Amazon.in'],['flipkart','Flipkart'],['croma','Croma'],['reliance','Reliance Digital'],['vijay','Vijay Sales']];
/* the address of a store's own results page, with the student's filters already set where the store accepts them in the link
   (Amazon.in and Flipkart do; the others only take the words) */
function dStoreUrl(id,q){var f=DS.flt||{},mn=dNum(f.min),mx=dNum(f.max),w=String(q||DS.fq||DS.need||'').replace(/\s+/g,' ').trim();
 if(DS.cond==='refurb'&&!/refurb|renewed|used|pre-?owned/i.test(w))w+=' refurbished';
 var e=dQ(w);if(mn&&mx&&mn>mx){var t=mn;mn=mx;mx=t;}
 if(id==='amazon'){var u='https://www.amazon.in/s?k='+e;
  if(mn)u+='&low-price='+mn;if(mx)u+='&high-price='+mx;
  var so={low:'price-asc-rank',high:'price-desc-rank',rate:'review-rank',new:'date-desc-rank'}[f.sort];if(so)u+='&s='+so;
  var rh=[];if(f.fast)rh.push('p_85:10440599031');if(f.rate)rh.push('p_72:1318476031');
  if(rh.length)u+='&rh='+encodeURIComponent(rh.join(','));
  return u;}
 if(id==='flipkart'){var u2='https://www.flipkart.com/search?q='+e,P=function(k){u2+='&p%5B%5D='+k;};
  var s2={low:'price_asc',high:'price_desc',rate:'popularity',new:'recency_desc'}[f.sort];if(s2)u2+='&sort='+s2;
  if(mn||mx){P('facets.price_range.from%3D'+(mn||'Min'));P('facets.price_range.to%3D'+(mx||'Max'));}
  if(f.rate)P('facets.rating%255B%255D%3D4%25E2%2598%2585%2B%2526%2Babove');
  if(f.fast)P('facets.fulfilled_by%255B%255D%3DFlipkart%2BAssured');
  return u2;}
 if(id==='croma')return 'https://www.croma.com/searchB?q='+e+'%3Arelevance&text='+e;
 if(id==='reliance')return 'https://www.reliancedigital.in/products?q='+e;
 return 'https://www.vijaysales.com/search/'+e;}
function dBtns(q){var a=function(x,c){return '<a class="btn sm'+c+'" data-st="'+x[0]+'" data-q="'+esc(q)+'" href="'+esc(dStoreUrl(x[0],q))+'" target="_blank" rel="noopener noreferrer">Search '+esc(x[1])+'</a>';};
 return '<div class="dl-bt">'+DST.slice(0,2).map(function(x){return a(x,'');}).join('')+DST.slice(2).map(function(x){return a(x,' dl-xm');}).join('')+'<button class="btn sm dl-mb" type="button" data-more="1" aria-expanded="false">More stores</button></div>';}
function dStoreBtns(){return '<div class="dl-bt">'+DST.map(function(x,i){return '<a class="btn sm'+(i<2?' pri':'')+'" data-st="'+x[0]+'" href="'+esc(dStoreUrl(x[0],DS.fq))+'" target="_blank" rel="noopener noreferrer">'+esc(x[1])+ico('ext',14,2.4)+'</a>';}).join('')+'</div>';}
function dQueries(p){var q=(p&&p.queries&&p.queries.length)?p.queries.slice():(p&&p.words&&p.words.length)?p.words.slice():[];
 if(!q.length)((p&&p.picks)||[]).forEach(function(x){var t=String((x&&(x.search||x.name))||'').trim();if(t&&q.indexOf(t)<0)q.push(t);});
 return q.slice(0,4);}
/* starting filters come from what the student said they care about */
function dFltInit(p){var q=dQueries(p),pr=DS.pri;DS.fq=q[0]||DS.need;
 DS.flt={min:'',max:DS.budget||'',sort:pr==='price'?'low':pr==='quality'?'rate':'rel',rate:pr==='quality'||pr==='value',fast:pr==='speed'};}
function dFltNote(){var f=DS.flt,mn=dNum(f.min),mx=dNum(f.max),a=[];if(mn&&mx&&mn>mx){var t=mn;mn=mx;mx=t;}
 if(mn&&mx)a.push(inr(mn)+' to '+inr(mx));else if(mx)a.push('up to '+inr(mx));else if(mn)a.push(inr(mn)+' and above');
 var so={low:'lowest price first',high:'highest price first',rate:'top rated first',new:'newest first'}[f.sort];if(so)a.push(so);
 if(f.rate)a.push('4★ and above');if(f.fast)a.push('Prime / Flipkart Assured');
 return a.length?'Amazon.in and Flipkart will open with: '+a.join(' · ')+'.':'No filters set. Amazon.in and Flipkart will open with just your search words.';}
/* every store button on the page follows the filters */
function dFltApply(){var r=$$('dres');if(!r)return;
 r.querySelectorAll('a[data-st]').forEach(function(a){a.href=dStoreUrl(a.dataset.st,a.dataset.q||DS.fq);});
 var n=$$('dfn');if(n)n.textContent=dFltNote();}
function dPanel(p){var qs=dQueries(p),f=DS.flt,SO=[['rel','Best match'],['low','Price: low to high'],['high','Price: high to low'],['rate','Customer rating'],['new','Newest first']];
 var tg=function(k,t){var on=!!f[k];return '<button type="button" class="dl-tg'+(on?' on':'')+'" data-tg="'+k+'" aria-pressed="'+(on?'true':'false')+'">'+t+'</button>';};
 return dRt('Search the stores with your filters','Change the words or the filters and the store buttons update. Amazon.in and Flipkart open with your filters already applied.')+
 '<section class="card dl-sec dl-f dl-fl" id="dfl">'+
 '<label class="qfl" for="dfq">Search words<input type="text" id="dfq" maxlength="120" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+esc(DS.fq)+'"></label>'+
 (qs.length>1?'<div class="dl-ex"><span>Eve’s searches:</span>'+qs.map(function(q,i){return '<button class="dl-xb" type="button" data-fq="'+i+'">'+esc(q)+'</button>';}).join('')+'</div>':'')+
 '<div class="dl-g3"><label class="qfl" for="dfmin">Lowest price (₹)<input type="text" id="dfmin" inputmode="numeric" maxlength="9" autocomplete="off" placeholder="0" value="'+esc(f.min)+'"></label>'+
 '<label class="qfl" for="dfmax">Highest price (₹)<input type="text" id="dfmax" inputmode="numeric" maxlength="9" autocomplete="off" placeholder="No limit" value="'+esc(f.max)+'"></label>'+
 '<label class="qfl" for="dfs">Sort by<select class="sel" id="dfs">'+SO.map(function(x){return '<option value="'+x[0]+'"'+(f.sort===x[0]?' selected':'')+'>'+x[1]+'</option>';}).join('')+'</select></label></div>'+
 '<div class="dl-tgs">'+tg('rate','4★ and above')+tg('fast','Fast delivery: Prime / Flipkart Assured')+'</div>'+
 dStoreBtns()+
 '<p class="hint dl-fn" id="dfn">'+esc(dFltNote())+'</p>'+
 '<p class="hint dl-fn">Croma, Reliance Digital and Vijay Sales do not take filters in the link, so they open with your search words only.</p></section>';}
function dItems(){var p=DS.plan;return p?((p.products&&p.products.length)?p.products:(p.picks||[])):[];}
function dRange(name){var p=dItems().filter(function(x){return x.name===name;})[0];return p&&p.price_low>0?p:null;}
function dRangeTxt(p){return p.price_high>p.price_low?inr(p.price_low)+' to '+inr(p.price_high):'about '+inr(p.price_low);}
function dRangeShort(p){return p.price_high>p.price_low?inr(p.price_low)+' – '+inr(p.price_high):inr(p.price_low);}
function dVerdict(total,p){if(!p)return null;var lo=p.price_low,hi=p.price_high||lo;
 if(total<lo*.75)return {k:'warn',t:'Too good to be true?',m:'This is far below the usual price ('+dRangeTxt(p)+'). Check that it is the same model, brand new, and sold by a trusted seller.'};
 if(total<=lo+(hi-lo)*.25)return {k:'good',t:'Deal',m:'This is at the low end of the usual price ('+dRangeTxt(p)+').'};
 if(total<=hi*1.05)return {k:'',t:'Fair price',m:'This is within the usual price ('+dRangeTxt(p)+'). A sale or a bank offer could bring it down.'};
 return {k:'bad',t:'No deal',m:'This is about '+inr(total-hi)+' above the usual price ('+dRangeTxt(p)+'). Try another store or wait for a sale.'};}
function dMsg(t,k){var e=$$('dmsg');if(e)e.innerHTML=t?'<div class="msg '+(k||'')+'"><span class="dotk"></span><span>'+esc(t)+'</span></div>':'';}
function dSync(s){if(s&&s._cs&&s._cs.sync)s._cs.sync();}
function dChoice(box,attr,val){box.querySelectorAll('.dl-c').forEach(function(b){var on=b.getAttribute(attr)===val;b.classList.toggle('on',on);b.setAttribute('aria-checked',on?'true':'false');});}
function dChips(id,lab,attr,list,cur,one){return '<div class="dl-ch'+(one?' one':'')+'" id="'+id+'" role="radiogroup" aria-labelledby="'+lab+'">'+list.map(function(x){return '<button type="button" class="dl-c'+(cur===x[0]?' on':'')+'" role="radio" aria-checked="'+(cur===x[0])+'" '+attr+'="'+x[0]+'">'+x[1]+'</button>';}).join('')+'</div>';}
var DSTEPS=[['dform','Describe'],['dres','Matches'],['dcmp','Compare']];

function dealPage(){nav('deal');
 app.innerHTML='<div class="dl-hd"><div class="ic i10">'+ico('tag',26)+'</div><h1>Deal or No Deal</h1></div>'+
 '<p class="lead dl-lead">Tell Eve what you want to buy. She suggests what to look for, takes you to the top stores, and works out which price is the real best deal after delivery and discounts.</p>'+
 '<div class="dl-steps" id="dsteps">'+DSTEPS.map(function(x,i){return '<button type="button" class="dl-sp" data-go="'+x[0]+'"><b>'+(i+1)+'</b><span>'+x[1]+'</span></button>';}).join('')+'</div>'+
 '<section class="card dl-sec dl-f" id="dform"><div class="dl-sh"><span class="dl-n">1</span><div><h2>What do you need?</h2><span class="hint">The more you tell Eve, the better her picks.</span></div></div>'+
 '<textarea id="dnd" rows="3" maxlength="400" aria-label="What do you need?" placeholder="For example: a laptop for engineering with an Intel i7 and a good graphics card">'+esc(DS.need)+'</textarea>'+
 '<div class="dl-ex"><span>Try:</span>'+DEX.map(function(x,i){return '<button class="dl-xb" data-ex="'+i+'" type="button">'+esc(x)+'</button>';}).join('')+'</div>'+
 '<div class="dl-opts">'+
 '<div><label class="dl-ol" for="dbd">Your budget in rupees (optional)</label><div class="dl-cur"><input type="text" id="dbd" inputmode="numeric" maxlength="9" autocomplete="off" placeholder="80000" value="'+esc(DS.budget)+'"></div></div>'+
 '<div><div class="dl-ol" id="dprii">What matters most to you?</div>'+dChips('dpri','dprii','data-p',DPRI,DS.pri,false)+'</div>'+
 '<div><div class="dl-ol" id="dcondi">New or refurbished?</div>'+dChips('dcond','dcondi','data-c',[['new','New only'],['refurb','Refurbished is fine']],DS.cond,true)+'</div>'+
 '</div>'+
 '<div class="dl-cta"><button class="btn pri dl-big" id="dgo" type="button">'+ico('search',18,2.4)+'Find my deals</button></div><div id="dmsg"></div></section>'+
 '<div id="dres"></div>'+
 '<section class="card dl-sec dl-f" id="dcmp"><div class="dl-sh"><span class="dl-n">3</span><div><h2>Compare the prices you find</h2><span class="hint">Open the stores, find the same product and type each price here. Eve works out the real final price: price plus delivery and other charges, minus discounts, coupons and bank offers.</span></div></div>'+
 '<div class="dl-cw"><div class="dl-cf">'+
 '<label class="qfl" id="dpkw" for="dpk">Which product?<select class="sel" id="dpk"></select></label>'+
 '<label class="qfl" id="dptw" for="dpt" style="display:none">Product name<input type="text" id="dpt" maxlength="100" autocomplete="off" placeholder="For example: Laptop with i7 and RTX 4050"></label>'+
 '<div class="dl-g2 stk"><label class="qfl" for="dsk">Which store?<select class="sel" id="dsk">'+DSTORES.map(function(s){return '<option>'+s+'</option>';}).join('')+'</select></label>'+
 '<label class="qfl" for="dpp">Price (₹)<input type="text" id="dpp" inputmode="numeric" maxlength="9" autocomplete="off" placeholder="74990"></label></div>'+
 '<label class="qfl" id="dsow" for="dso" style="display:none">Store name<input type="text" id="dso" maxlength="40" autocomplete="off" placeholder="Store name"></label>'+
 '<div class="dl-g2"><label class="qfl" for="dch">Delivery &amp; charges (₹)<input type="text" id="dch" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="0"></label>'+
 '<label class="qfl" for="dds">Discounts &amp; offers (₹)<input type="text" id="dds" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="0"></label></div>'+
 '<div class="dl-g2"><label class="qfl" for="dwr">Warranty (years)<input type="text" id="dwr" inputmode="numeric" maxlength="2" autocomplete="off" placeholder="1"></label>'+
 '<label class="qfl" for="drt">Returns (days)<input type="text" id="drt" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="7"></label></div>'+
 '<div class="dl-add"><div class="dl-fin"><small>Final price</small><b id="dfin">'+inr(0)+'</b></div><button class="btn pri" id="dadd" type="button">Add this price</button></div><div id="dmsg2"></div>'+
 '</div><div class="dl-co"><div id="doffers"></div><div id="dact"></div></div></div></section>'+
 '<p class="dl-note">Eve gives rough price estimates, not live prices. Always check the final price, the seller, the warranty and the return rules on the store’s own page before you pay. Eve Sandbox does not sell anything and is not connected to any of these stores.</p>';
 $$('dsteps').onclick=function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;var id=t.dataset.go,el=$$(id==='dres'&&!$$('dres').firstChild?'dform':id);if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'start'});};
 $$('dform').onclick=function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
  if(t.dataset.ex!=null){$$('dnd').value=DEX[+t.dataset.ex];$$('dnd').focus();}
  else if(t.dataset.p){DS.pri=t.dataset.p;dChoice($$('dpri'),'data-p',DS.pri);}
  else if(t.dataset.c){DS.cond=t.dataset.c;dChoice($$('dcond'),'data-c',DS.cond);}
  else if(t.id==='dgo')dFind();};
 $$('dpk').onchange=dProdSync;$$('dsk').onchange=function(){$$('dsow').style.display=this.value==='Other'?'block':'none';};
 ['dpp','dch','dds','dwr','drt'].forEach(function(id){var i=$$(id);i.oninput=function(){var v=this.value.replace(/[^\d.,]/g,'');if(v!==this.value)this.value=v;dFin();};i.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();dAdd();}};});
 $$('dadd').onclick=dAdd;
 $$('dres').onclick=function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
  if(t.dataset.more!=null){var bt=t.parentNode,o=bt.classList.toggle('open');t.textContent=o?'Fewer stores':'More stores';t.setAttribute('aria-expanded',o?'true':'false');return;}
  if(t.dataset.tg){var k=t.dataset.tg;DS.flt[k]=!DS.flt[k];t.classList.toggle('on',!!DS.flt[k]);t.setAttribute('aria-pressed',DS.flt[k]?'true':'false');dFltApply();return;}
  if(t.dataset.fq!=null){var qq=dQueries(DS.plan)[+t.dataset.fq];if(qq){DS.fq=qq;var fi=$$('dfq');if(fi)fi.value=qq;dFltApply();}return;}
  if(t.dataset.use==null)return;var p=dItems()[+t.dataset.use];if(!p)return;dProdOpts(p.name);dProdSync();
  if(p.store){var sk=$$('dsk'),key=p.store==='Amazon.in'?'Amazon':p.store,hit=DSTORES.indexOf(key)>=0&&key!=='Other';sk.value=hit?key:'Other';dSync(sk);$$('dsow').style.display=hit?'none':'block';if(!hit)$$('dso').value=p.store;}
  $$('dpp').value=p.price>0?String(p.price):'';dFin();
  var c=$$('dcmp');if(c&&c.scrollIntoView)c.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){$$('dpp').focus({preventScroll:true});},350);};
 $$('dres').oninput=function(e){var t=e.target;if(!t||!t.id)return;
  if(t.id==='dfq')DS.fq=t.value;
  else if(t.id==='dfmin'||t.id==='dfmax'){var v=t.value.replace(/\D/g,'');if(v!==t.value)t.value=v;DS.flt[t.id==='dfmin'?'min':'max']=v;}
  else if(t.id==='dfs')DS.flt.sort=t.value;
  else return;
  dFltApply();};
 $$('doffers').onclick=function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t||t.dataset.rm==null)return;var id=+t.dataset.rm;DS.offers=DS.offers.filter(function(o){return o.id!==id;});DS.judge=null;DS.jstate='idle';dOffers();dAct();};
 $$('dact').onclick=function(e){var t=e.target.closest?e.target.closest('button'):null;if(t&&t.id==='djb')dJudge();};
 dProdOpts();dProdSync();dRender();dOffers();dAct();dFin();
}
function dFin(){var e=$$('dfin');if(!e)return;e.textContent=inr(Math.max(0,dNum($$('dpp').value)+dNum($$('dch').value)-dNum($$('dds').value)));}
function dSteps(){var b=$$('dsteps');if(!b)return;
 var cur=DS.jstate==='ok'?4:DS.offers.length?3:(DS.state==='ok'||DS.state==='err')?2:1;
 b.querySelectorAll('.dl-sp').forEach(function(e,i){var n=i+1;e.classList.toggle('on',n===cur);e.classList.toggle('done',n<cur);if(n===cur)e.setAttribute('aria-current','step');else e.removeAttribute('aria-current');e.firstChild.innerHTML=n<cur?ico('check',13,3.2):String(n);});}
function dProdOpts(sel){var s=$$('dpk');if(!s)return;var names=[];dItems().forEach(function(p){names.push(p.name);});DS.offers.forEach(function(o){if(names.indexOf(o.pick)<0)names.push(o.pick);});
 var cur=sel||s.value;s.innerHTML=names.map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>';}).join('')+'<option value="__o">Another product…</option>';
 s.value=(cur&&(names.indexOf(cur)>=0||cur==='__o'))?cur:(names.length?names[0]:'__o');dSync(s);}
function dProdSync(){var s=$$('dpk'),w=$$('dptw'),k=$$('dpkw');if(!s||!w)return;var only=s.options.length<2,o=s.value==='__o'||only;if(k)k.style.display=only?'none':'block';w.style.display=o?'block':'none';}
function dRender(){var h='',el=$$('dres');if(!el)return;
 if(DS.state==='busy')h='<div class="card dl-wait"><div class="dl-dots"><i></i><i></i><i></i></div><div><b>Eve is looking for good options…</b><div class="hint">This can take up to half a minute.</div></div></div>';
 else if(DS.state==='err')h='<div class="msg bad dl-er"><span class="dotk"></span><span>'+esc(DS.err)+'</span></div><div class="card dl-sec"><div class="dl-tl">You can still search the stores yourself</div><div class="hint" style="display:block;margin:6px 0 12px">Searching for: '+esc(DS.need)+'</div>'+dBtns(DS.need)+'</div>';
 else if(DS.state==='ok'&&DS.plan)h=dPlanHtml(DS.plan);
 el.innerHTML=h;dSteps();}
function dRt(t,sub){return '<div class="dl-rt"><h3>'+t+'</h3>'+(sub?'<span class="hint">'+sub+'</span>':'')+'</div>';}
function dNotes(x,lab){return (x.why||x.tradeoff)?'<div class="dl-nt">'+(x.why?'<div class="dl-nx"><b>Why it fits</b>'+esc(x.why)+'</div>':'')+(x.tradeoff?'<div class="dl-nx c"><b>'+lab+'</b>'+esc(x.tradeoff)+'</div>':'')+'</div>':'<div class="dl-nt"></div>';}
function dProd(x,i,live,top){
 var pr=live?(x.price>0?'<div class="dl-pv">'+inr(x.price)+'</div><span class="hint">Seen in search</span>':'<div class="dl-pv q">Check the price</div><span class="hint">on the store page</span>'):(x.price_low>0?'<div class="dl-pv r">'+dRangeShort(x)+'</div><span class="hint">Rough estimate</span>':'');
 return '<article class="card dl-p'+(top?' top':'')+'"><div class="dl-hd2"><div class="dl-ph"><span class="dl-no">'+(i+1)+'</span>'+(live?'<span class="dl-sb">'+esc(x.store)+'</span>':'')+(top?'<span class="dl-tp">Top pick</span>':'')+'</div><h4 class="dl-pn">'+esc(x.name)+'</h4></div>'+
  '<div class="dl-pr">'+pr+'</div>'+
  '<div class="dl-nw">'+dNotes(x,live?'Check first':'Trade-off')+(live?'':'<div class="dl-gs">'+dBtns(x.search||x.name)+'</div>')+'</div>'+
  '<div class="dl-ac">'+(live?'<a class="btn pri" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer nofollow">Open on '+esc(x.store)+ico('ext',14,2.4)+'</a>':'')+'<button class="btn" type="button" data-use="'+i+'">Add a price I found</button></div></article>';}
function dPlanHtml(p){var live=p.products&&p.products.length,multi=dItems().length>1,h='<div class="dl-res2"><div class="dl-sh"><span class="dl-n">2</span><div><h2>Eve’s picks for you</h2></div></div>';
 if(p.summary)h+='<div class="card dl-sum"><div class="dl-sl">'+ico('spark',16)+'Eve’s take</div><div class="dl-sx">'+esc(p.summary)+'</div></div>';
 if(p.specs&&p.specs.length)h+=dRt('What to look for')+'<div class="card dl-spec">'+p.specs.map(function(s){return '<div class="dl-sr"><b>'+esc(s.name)+'</b><div><span class="w">'+esc(s.want)+'</span>'+(s.why?'<span class="y">'+esc(s.why)+'</span>':'')+'</div></div>';}).join('')+'</div>';
 if(live)h+=dRt('Best matches we found','Real product pages from Amazon.in, Flipkart, Croma, Reliance Digital and Vijay Sales. A price shown here comes from the search result and may be out of date, so always check the store page.')+p.products.map(function(x,i){return dProd(x,i,true,multi&&i===0);}).join('');
 else{
  if(p.mode==='guide'&&p.queries&&p.queries.length)h+='<div class="msg warn" style="margin-top:14px"><span class="dotk"></span><span>'+(p.capped?'Eve has used today’s product searches, so here are searches you can open on the stores. Product links are back tomorrow.':p.searchFailed?'Eve could not reach the store search just now, so here are searches you can open on the stores.':'No matching product pages turned up. Try the searches below on the stores.')+'</span></div>';
  if(p.picks&&p.picks.length)h+=dRt('Good options to check')+p.picks.map(function(x,i){return dProd(x,i,false,false);}).join('');}
 if(dQueries(p).length)h+=dPanel(p);
 var av=p.avoid&&p.avoid.length,tm=!!p.timing;
 if(av||tm)h+='<div class="dl-2">'+(av?'<div class="card dl-tc"><div class="dl-tl"><span class="dl-bi">'+ico('alert',16,2.6)+'</span>Watch out for</div><ul class="dl-ul">'+p.avoid.map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ul></div>':'')+(tm?'<div class="card dl-tc"><div class="dl-tl"><span class="dl-bi g">'+ico('check',16,2.8)+'</span>Buying tip</div><div class="dl-tx">'+esc(p.timing)+'</div></div>':'')+'</div>';
 return h+'</div>';}
function dFind(){if(DS.state==='busy')return;
 var need=$$('dnd').value.replace(/\s+/g,' ').trim(),bud=dNum($$('dbd').value);DS.need=need;DS.budget=bud?String(bud):'';
 if(need.length<4){dMsg('Tell Eve what you need first, for example: a laptop with an Intel i7 and a good graphics card.','warn');return;}
 dMsg('');
 if(!CFG.dealApi){DS.state='err';DS.err='Eve’s suggestions are not open yet. Please check back soon.';dRender();return;}
 var run=++DS.run;DS.state='busy';DS.plan=null;DS.judge=null;DS.jstate='idle';dRender();dAct();var b=$$('dgo');if(b){b.disabled=true;b.classList.add('busy');}
 dCall('/plan',{need:need,budget:bud,priority:DS.pri,condition:DS.cond}).then(function(d){if(run!==DS.run)return;DS.plan=d;DS.state='ok';dFltInit(d);},function(e){if(run!==DS.run)return;DS.state='err';DS.err=dErr(e.code);}).then(function(){if(run!==DS.run)return;
  var b=$$('dgo');if(b){b.disabled=false;b.classList.remove('busy');}var f=dItems()[0],pk=$$('dpk'),pt=$$('dpt');dProdOpts(f&&pk&&pk.value==='__o'&&!(pt&&pt.value.trim())?f.name:undefined);dProdSync();dRender();dAct();
  var r=$$('dres');if(r&&r.scrollIntoView)r.scrollIntoView({behavior:'smooth',block:'start'});});}
function dAdd(){var s=$$('dpk'),m=$$('dmsg2'),say=function(t){m.innerHTML='<div class="msg warn"><span class="dotk"></span><span>'+esc(t)+'</span></div>';};
 var prod=(s.value==='__o'?$$('dpt').value:s.value).replace(/\s+/g,' ').trim().slice(0,100);
 var store=$$('dsk').value==='Other'?($$('dso').value.trim().slice(0,40)||'Other store'):$$('dsk').value;
 var price=dNum($$('dpp').value);
 if(!prod){say('Choose the product, or type its name.');return;}
 if(price<=0){say('Type the price you saw on the store.');return;}
 if(DS.offers.length>=14){say('That is plenty to compare. Remove one before you add another.');return;}
 var del=dNum($$('dch').value),disc=dNum($$('dds').value),war=Math.min(10,dNum($$('dwr').value)),ret=Math.min(365,dNum($$('drt').value));
 m.innerHTML='';DS.offers.push({id:++DS.seq,pick:prod,store:store,price:price,del:del,disc:disc,war:war,ret:ret,total:Math.max(0,price+del-disc)});
 DS.judge=null;DS.jstate='idle';['dpp','dch','dds','dwr','drt'].forEach(function(i){$$(i).value='';});dFin();
 if(s.value==='__o'){dProdOpts(prod);dProdSync();$$('dpt').value='';}
 dOffers();dAct();$$('dpp').focus({preventScroll:true});}
function dOffers(){var el=$$('doffers');if(!el)return;
 if(!DS.offers.length){el.innerHTML='<div class="dl-empty">'+ico('tag',28)+'<div><b>No prices added yet</b><br>Prices you add appear here, cheapest first.</div></div>';dSteps();return;}
 var groups=[],map={};DS.offers.forEach(function(o){var k=o.pick.toLowerCase();if(!map[k]){map[k]={name:o.pick,list:[]};groups.push(map[k]);}map[k].list.push(o);});
 var h='';groups.forEach(function(g){g.list.sort(function(a,b){return a.total-b.total||b.war-a.war||b.ret-a.ret;});
  var rg=dRange(g.name),hi=g.list[g.list.length-1].total,multi=g.list.length>1;
  h+='<div class="dl-gh">'+esc(g.name)+'</div>';
  g.list.forEach(function(o,i){var best=i===0,v=best?dVerdict(o.total,rg):null;
   var det=inr(o.price)+(o.del?' + '+inr(o.del)+' charges':'')+(o.disc?' − '+inr(o.disc)+' off':'');
   var ex=[];if(o.war)ex.push(o.war+' year'+(o.war===1?'':'s')+' warranty');if(o.ret)ex.push(o.ret+'-day returns');
   h+='<div class="dl-o'+(best&&multi?' best':'')+'"><div class="dl-ot"><b>'+esc(o.store)+'</b>'+(best&&multi?'<span class="dl-bd">Best deal</span>':'')+'<span class="dl-op">'+inr(o.total)+'</span></div>'+
    '<div class="hint">'+det+(ex.length?' · '+ex.join(' · '):'')+'</div>'+
    (best&&multi&&hi>o.total?'<div class="dl-sv">Saves '+inr(hi-o.total)+' compared with the most expensive.</div>':'')+
    (v?'<div class="msg '+v.k+'"><span class="dotk"></span><span><b>'+v.t+'.</b> '+esc(v.m)+'</span></div>':'')+
    '<button class="dl-x" type="button" data-rm="'+o.id+'" aria-label="Remove this price">'+ico('x',14,2.6)+'</button></div>';});});
 el.innerHTML=h;dSteps();}
function dAct(){var el=$$('dact');if(!el)return;
 if(!DS.offers.length){el.innerHTML='';dSteps();return;}
 var h='';
 if(!CFG.dealApi)h='';
 else if(DS.jstate==='busy')h='<div class="dl-wait sm"><div class="dl-dots"><i></i><i></i><i></i></div><b>Eve is thinking it over…</b></div>';
 else{h='<button class="btn pri dl-ask" id="djb" type="button">'+ico('spark',16)+'Ask Eve what she thinks</button>';
  if(DS.jstate==='err')h+='<div class="msg bad"><span class="dotk"></span><span>'+esc(DS.jerr)+'</span></div>';
  if(DS.jstate==='ok'&&DS.judge){var j=DS.judge;h+='<div class="dl-v"><div class="dl-sl">'+ico('spark',16)+'Eve’s verdict</div><div class="dl-vh">'+esc(j.headline)+'</div>'+
   (j.reasons.length?'<ul class="dl-ul">'+j.reasons.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'')+
   j.warnings.map(function(x){return '<div class="msg warn"><span class="dotk"></span><span>'+esc(x)+'</span></div>';}).join('')+
   (j.tips.length?'<div class="hint" style="display:block;margin:12px 0 2px"><b>Tips</b></div><ul class="dl-ul">'+j.tips.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'')+'</div>';}}
 el.innerHTML=h;dSteps();}
function dJudge(){if(DS.jstate==='busy'||!DS.offers.length)return;var run=++DS.run;DS.jstate='busy';dAct();
 var picks=dItems().map(function(p){return {name:p.name,low:p.price_low,high:p.price_high};});
 dCall('/judge',{need:DS.need,priority:DPRIN[DS.pri],picks:picks,offers:DS.offers.map(function(o){return {pick:o.pick,store:o.store,price:o.price,delivery:o.del,discount:o.disc,warranty:o.war,returns:o.ret,total:o.total};})}).then(function(d){if(run!==DS.run)return;DS.judge=d;DS.jstate='ok';},function(e){if(run!==DS.run)return;DS.jstate='err';DS.jerr=dErr(e.code);}).then(function(){if(run!==DS.run)return;dAct();});}

/* ---------- Text to Speech ---------- */
var TS={voice:'',loc:'',rate:1,live:true,pend:0,spoken:0,rt:0,nt:0,reading:false,run:0,ctl:null,busy:false,para:'',lang:'en',blob:null,ext:'mp3',url:'',vl:false};
var TLANGS=[['en','English'],['zh','Chinese (Mandarin)'],['es','Spanish'],['fr','French'],['ja','Japanese'],['ko','Korean']];
/* Japanese and Korean only come out as real sound when the voice service has them switched on, so they are listed only when it says so (null = not asked yet) */
var TSJK=null;
function tsLangs(){return TLANGS.filter(function(l){return (l[0]!=='ja'&&l[0]!=='ko')||TSJK===true;});}
function tsLangOpts(){return tsLangs().map(function(l){return '<option value="'+l[0]+'"'+(TS.lang===l[0]?' selected':'')+'>'+l[1]+'</option>';}).join('');}
function tsAsk(){var s=$$('tsl');if(!s||!CFG.aiApi||TSJK!==null)return;
 var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},8000);
 fetch(String(CFG.aiApi).replace(/\/+$/,'')+'/health',{signal:ctl.signal}).then(function(r){return r.json();}).then(function(j){TSJK=!!(j&&j.ttsJaKo);},function(){}).then(function(){clearTimeout(tm);
  var e=$$('tsl');if(!e||TSJK!==true)return;e.innerHTML=tsLangOpts();e.value=TS.lang;if(e.value!==TS.lang)e.selectedIndex=0;if(e._cs)e._cs.sync();});}
var TMAX=3000,TPIECE=380;
var TSC={tok:'',id:null,want:false};
var TERR={short:'Write something with a few words first.',slow:'That was a lot of requests in a short time. Please wait a few minutes and try again.',limit:'Eve has used up her free help for today. Please try again tomorrow.',busy:'Eve is busy right now. Please try again in a minute.',big:'That piece was too long. Please try again.',net:'Could not connect. Please check your internet and try again.',timeout:'That is taking too long. Please try again.',captcha:'The security check did not pass or has run out. Please complete it again and press Make audio.'};
function tsErr(c){
 if(c==='empty'){var n=(TLANGS.filter(function(l){return l[0]===TS.lang;})[0]||[])[1];
  return (TS.lang==='ja'||TS.lang==='ko')?n+' audio is not coming through from our voice service right now, so no sound was made. Please try again later, or choose another language.':'No sound came back for that text. Please try different wording, or try again in a moment.';}
 return TERR[c]||'The audio could not be made right now. Please try again in a moment.';}
/* Japanese and Korean need text in their own writing; romaji or English gives the voice nothing to say */
var TSOWN={ja:/[\u3040-\u30ff\u3400-\u9fff]/,ko:/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/};
/* how long is this audio? 0 = it would not decode, -1 = could not tell */
function tsProbe(b){return new Promise(function(res){var a=new Audio(),u=URL.createObjectURL(b),done=false;
 function fin(d){if(done)return;done=true;try{a.removeAttribute('src');a.load();}catch(e){}try{URL.revokeObjectURL(u);}catch(e){}res(d);}
 a.preload='metadata';a.onloadedmetadata=function(){fin(isFinite(a.duration)?a.duration:-1);};a.onerror=function(){fin(0);};
 setTimeout(function(){fin(-1);},6000);a.src=u;});}
/* the real length and loudness of finished audio, read by decoding it. null = this browser could not decode it, {sec:-1} = this browser cannot check */
async function tsMeasure(b){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return {sec:-1,peak:-1};var ac=new AC();
 try{var ab=await b.arrayBuffer(),buf=await new Promise(function(res,rej){var p=ac.decodeAudioData(ab,res,rej);if(p&&p.catch)p.catch(rej);}),pk=0;
  for(var c=0;c<buf.numberOfChannels;c++){var d=buf.getChannelData(c);for(var i=0;i<d.length;i+=5){var v=d[i]<0?-d[i]:d[i];if(v>pk)pk=v;}}
  return {sec:buf.duration,peak:pk};}
 catch(e){return null;}
 finally{try{ac.close();}catch(x){}}}
function tsCan(){return 'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';}
function tsVoice(){var l=aiVoices(),v=l.filter(function(x){return (x.voiceURI||x.name)===TS.voice;})[0];return v||aiVoice();}
/* the voices belong to the device, so they are listed by language and country, with the world's most populous countries first */
var TSRG=['IN','CN','US','ID','PK','NG','BR','BD','RU','MX','JP','ET','PH','EG','VN','CD','TR','IR','DE','TH','GB','FR','IT','ZA','TZ','KR','ES','CA','AU','AR','SA','PL','UA','MY'];
var TSPR={hi:'IN',zh:'CN',en:'US',id:'ID',ur:'PK',pt:'BR',bn:'BD',ru:'RU',es:'MX',ja:'JP',fil:'PH',ar:'EG',vi:'VN',tr:'TR',fa:'IR',de:'DE',th:'TH',fr:'FR',it:'IT',sw:'TZ',ko:'KR',pl:'PL',uk:'UA',ms:'MY',am:'ET',ta:'IN',te:'IN',mr:'IN',gu:'IN',kn:'IN',ml:'IN',pa:'IN'};
var TSHI={en:'Hello',hi:'नमस्ते',zh:'你好',es:'Hola',pt:'Olá',ru:'Привет',ja:'こんにちは',de:'Hallo',fr:'Bonjour',ar:'مرحبا',bn:'হ্যালো',id:'Halo',ur:'ہیلو',tr:'Merhaba',ko:'안녕하세요',it:'Ciao',vi:'Xin chào',th:'สวัสดี',fil:'Kumusta',fa:'سلام',sw:'Habari',pl:'Cześć',uk:'Привіт',nl:'Hallo',ta:'வணக்கம்',te:'నమస్కారం',mr:'नमस्कार',ms:'Halo',gu:'નમસ્તે',kn:'ನಮಸ್ಕಾರ',ml:'ഹലോ',pa:'ਸਤ ਸ੍ਰੀ ਅਕਾਲ'};
function tsLocKey(v){var p=String(v.lang||'').replace(/_/g,'-').split('-').filter(Boolean),l=(p[0]||'und').toLowerCase(),r='';for(var i=1;i<p.length;i++)if(/^[A-Za-z]{2}$/.test(p[i]))r=p[i].toUpperCase();return r?l+'-'+r:l;}
function tsLocRank(k){var a=k.split('-'),r=a[1]||TSPR[a[0]]||'',i=TSRG.indexOf(r);return i<0?99:i;}
function tsLocName(k){var a=k.split('-'),l=a[0],r=a[1]||'',n=l;if(l==='und')return 'Other voices';
 try{n=new Intl.DisplayNames(['en'],{type:'language'}).of(l)||l;}catch(e){}
 if(r){var rn=r;try{rn=new Intl.DisplayNames(['en'],{type:'region'}).of(r)||r;}catch(e){}n+=' ('+rn+')';}
 return n;}
function tsVoiceOpts(){var s=$$('tsv'),ls=$$('tsvl');if(!s||!ls)return;
 var r=aiRank();
 if(!r.length){ls.innerHTML='<option value="">Default</option>';s.innerHTML='<option value="">Default voice</option>';TS.loc='';TS.voice='';dSync(ls);dSync(s);var h0=$$('tsvh');if(h0)h0.textContent='Your device did not list any voices.';return;}
 var map={},keys=[];
 r.forEach(function(x){var k=tsLocKey(x.v);if(!map[k]){map[k]=[];keys.push(k);}map[k].push(x.v);});
 var best=keys[0];
 keys.sort(function(a,b){var d=tsLocRank(a)-tsLocRank(b);if(d)return d;var na=tsLocName(a),nb=tsLocName(b);return na<nb?-1:na>nb?1:0;});
 if(!map[TS.loc])TS.loc=best;
 ls.innerHTML=keys.map(function(k){return '<option value="'+esc(k)+'">'+esc(tsLocName(k))+'</option>';}).join('');
 ls.value=TS.loc;dSync(ls);
 var vs=map[TS.loc];
 s.innerHTML=vs.map(function(v){return '<option value="'+esc(v.voiceURI||v.name)+'">'+esc(v.name)+'</option>';}).join('');
 var has=vs.some(function(v){return (v.voiceURI||v.name)===TS.voice;});
 if(!has)TS.voice=vs[0].voiceURI||vs[0].name;
 s.value=TS.voice;dSync(s);
 var n=0,seen={};keys.forEach(function(k){var l=k.split('-')[0];if(!seen[l]){seen[l]=1;n++;}});
 var h=$$('tsvh');if(h)h.textContent='These voices come from your device ('+n+' language'+(n===1?'':'s')+' found).';}
function tsHi(){if(!tsCan())return;try{speechSynthesis.cancel();}catch(e){}TS.pend=0;var v=tsVoice(),l=String((v&&v.lang)||TS.loc||'en').split(/[-_]/)[0].toLowerCase();tsWord(TSHI[l]||'Hello');}
function tsNoSpace(){var v=tsVoice();return !!v&&/^(zh|ja|th|lo|km|my|yue)/i.test(String(v.lang||''));}
function tsUtter(text){var u=new SpeechSynthesisUtterance(text),v=tsVoice();if(v){try{u.voice=v;u.lang=v.lang;}catch(e){}}u.rate=TS.rate;u.pitch=1;u.volume=1;return u;}
function tsWord(w){if(!tsCan())return;var ss=speechSynthesis;
 if(TS.pend>=3){ss.cancel();TS.pend=0;}
 var u=tsUtter(w),d=function(){TS.pend=Math.max(0,TS.pend-1);};u.onend=d;u.onerror=d;TS.pend++;ss.speak(u);}
function tsM1(t,k){var e=$$('tsm1');if(e)e.innerHTML=t?'<div class="msg '+(k||'')+'"><span class="dotk"></span><span>'+esc(t)+'</span></div>':'';}
function tsSay(t){t=String(t).replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,'');if(t)tsWord(t);}
function tsInput(e){var t=e.target,v=t.value,c=t.selectionStart==null?v.length:t.selectionStart,it=e.inputType||'';
 if(TS.reading){try{speechSynthesis.cancel();}catch(x){}TS.reading=false;TS.rt++;tsAllUI();}
 clearTimeout(TS.nt);
 if(e.isComposing)return;
 if(/^(insertFromPaste|insertFromDrop|insertReplacementText|historyUndo|historyRedo|deleteByCut)/.test(it)){TS.spoken=c;return;}
 if(c<TS.spoken){var s=v.slice(0,c).search(/\S+$/);TS.spoken=s<0?c:s;}
 if(!TS.live){TS.spoken=c;return;}
 if(tsNoSpace()){
  /* Chinese, Japanese and similar scripts have no spaces between words: say what was typed at a pause or at punctuation */
  var seg2=v.slice(TS.spoken,c),mm=seg2.match(/^[\s\S]*[\s,.!?;:、。，！？；：]/);
  if(mm){TS.spoken+=mm[0].length;tsSay(mm[0]);return;}
  if(seg2)TS.nt=setTimeout(function(){var a=$$('tsa');if(!a)return;var cc=a.selectionStart==null?a.value.length:a.selectionStart;if(cc<=TS.spoken)return;var x=a.value.slice(TS.spoken,cc);TS.spoken=cc;tsSay(x);},700);
  return;}
 var seg=v.slice(TS.spoken,c),m=seg.match(/^[\s\S]*\s/);if(!m)return;
 TS.spoken+=m[0].length;
 m[0].split(/\s+/).forEach(function(w){w=w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,'');if(w)tsWord(w);});}
function tsAllUI(){var b=$$('tsall');if(!b)return;b.innerHTML=(TS.reading?ico('x',18,2.6)+'Stop':ico('play',18,2.2)+'Read it all');b.classList.toggle('pri',!TS.reading);}
function tsAll(){if(!tsCan()){tsM1('Speaking out loud is not available in this browser.','warn');return;}
 var ss=speechSynthesis;tsM1('');
 if(TS.reading){ss.cancel();TS.reading=false;TS.rt++;tsAllUI();return;}
 var txt=$$('tsa').value.trim();if(!txt){tsM1('Type something first, then press Read it all.','warn');return;}
 ss.cancel();TS.pend=0;var tok=++TS.rt,parts=aiChunks(txt);TS.reading=true;tsAllUI();
 aiVoicesReady(function(){if(tok!==TS.rt)return;
  parts.forEach(function(p,i){var u=tsUtter(p),end=function(){if(i===parts.length-1&&tok===TS.rt){TS.reading=false;tsAllUI();}};u.onend=end;u.onerror=end;ss.speak(u);});});}
function tsSplit(s,max){var out=[],cur='';s.split(/\s+/).forEach(function(w){if(cur&&(cur+' '+w).length>max){out.push(cur);cur=w;}else cur=cur?cur+' '+w:w;});if(cur)out.push(cur);return out;}
/* cut the paragraph at sentence ends into pieces the voice can say in one go */
function tsChunks(t,max){
 t=String(t).replace(/\r\n?/g,'\n').replace(/([^.!?。！？:;,\s])[ \t]*\n+/g,'$1. ').replace(/\s+/g,' ').trim();
 var sents=t.match(/[^.!?。！？]+[.!?。！？]+["'”’)\]]*\s*|[^.!?。！？]+$/g)||[t],out=[],cur='';
 sents.forEach(function(x){x=x.trim();if(!x)return;
  if(x.length>max){if(cur){out.push(cur);cur='';}tsSplit(x,max).forEach(function(p){out.push(p);});return;}
  if(cur&&(cur+' '+x).length>max){out.push(cur);cur=x;}else cur=cur?cur+' '+x:x;});
 if(cur)out.push(cur);
 return out.filter(function(p){return /[\p{L}\p{N}]/u.test(p);});}
function tsPiece(base,text,lang,pass){return new Promise(function(res,rej){var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},50000);TS.ctl=ctl;
 fetch(base+'/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text,lang:lang,pass:pass||''}),signal:ctl.signal}).then(function(r){
  if(r.ok)return r.blob().then(function(b){clearTimeout(tm);if(!b.size){var e=new Error('x');e.code='down';throw e;}res(b);});
  return r.json().catch(function(){return {};}).then(function(j){clearTimeout(tm);var e=new Error('x');e.code=(j&&j.error)||'down';rej(e);});
 },function(e){clearTimeout(tm);var x=new Error('net');x.code=(e&&e.name==='AbortError')?'timeout':'net';rej(x);}).catch(rej);});}
function tsPieceR(base,text,lang,pass){return tsPiece(base,text,lang,pass).catch(function(e){if(e&&(e.code==='busy'||e.code==='down')){return new Promise(function(r){setTimeout(r,1500);}).then(function(){return tsPiece(base,text,lang,pass);});}throw e;});}
/* security check: a solved check works once, so it is swapped for a short-lived pass that covers every piece of this one paragraph */
function tsCapReset(){TSC.tok='';try{if(TSC.id!=null&&window.turnstile)turnstile.reset(TSC.id);}catch(e){}}
function tsCapDrop(){TSC.tok='';TSC.want=false;try{if(TSC.id!=null&&window.turnstile)turnstile.remove(TSC.id);}catch(e){}TSC.id=null;}
function tsPass(base,tok){return new Promise(function(res,rej){var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},20000);TS.ctl=ctl;
 fetch(base+'/tts-pass',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tok}),signal:ctl.signal}).then(function(r){
  if(r.status===404){clearTimeout(tm);res('');return;}
  return r.json().catch(function(){return {};}).then(function(j){clearTimeout(tm);if(r.ok&&j&&typeof j.pass==='string'){res(j.pass);return;}var e=new Error('x');e.code=(j&&j.error)||'down';rej(e);});
 },function(e){clearTimeout(tm);var x=new Error('net');x.code=(e&&e.name==='AbortError')?'timeout':'net';rej(x);}).catch(rej);});}
function tsBusy(on,done,total){TS.busy=on;var m=$$('tsmk'),c=$$('tsstop'),p=$$('tsprog');if(!m)return;
 m.disabled=on;m.classList.toggle('busy',on);c.style.display=on?'inline-flex':'none';
 p.innerHTML=on?'<div class="ts-prog"><i style="width:'+Math.max(4,Math.round(100*done/total))+'%"></i></div><div class="hint" style="display:block;margin-top:8px">Making your audio… '+Math.min(total,done+1)+' of '+total+'</div>':'';}
function tsM2(t,k){var e=$$('tsm2');if(e)e.innerHTML=t?'<div class="msg '+(k||'')+'"><span class="dotk"></span><span>'+esc(t)+'</span></div>':'';}
/* our own player: play, seek, speed and volume, and no Download item or menu, so the Download audio button is the way to save the file */
var TSP={au:null,raf:0,drag:false,ri:0,rates:[1,1.25,1.5,2,0.75]};
var TSI={play:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"/></svg>',
 pause:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4.4" height="15" rx="1.4"/><rect x="13.6" y="4.5" width="4.4" height="15" rx="1.4"/></svg>',
 vol:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
 mute:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>'};
function tsT(x){x=isFinite(x)&&x>0?x:0;var m=Math.floor(x/60),y=Math.floor(x%60);return m+':'+(y<10?'0':'')+y;}
function tsStop(){cancelAnimationFrame(TSP.raf);if(TSP.au){try{TSP.au.pause();TSP.au.removeAttribute('src');TSP.au.load();}catch(e){}TSP.au=null;}TSP.drag=false;}
function tsPlayerHTML(){return '<div class="ap" role="group" aria-label="Audio player">'+
 '<button class="ap-b" id="tsapp" type="button" aria-label="Play">'+TSI.play+'</button>'+
 '<span class="ap-t" id="tsapc">0:00</span>'+
 '<input class="ap-s" id="tsaps" type="range" min="0" max="1000" step="1" value="0" aria-label="Seek">'+
 '<span class="ap-t" id="tsapd">0:00</span>'+
 '<button class="ap-r" id="tsapr" type="button" aria-label="Playback speed">1×</button>'+
 '<span class="ap-v"><button class="ap-m" id="tsapm" type="button" aria-label="Mute">'+TSI.vol+'</button><input class="ap-vs" id="tsapv" type="range" min="0" max="1" step="0.01" value="1" aria-label="Volume"></span></div>';}
function tsPlayerInit(){
 tsStop();
 var au=TSP.au=new Audio(),b=$$('tsapp'),sk=$$('tsaps'),ct=$$('tsapc'),dt=$$('tsapd'),rt=$$('tsapr'),mt=$$('tsapm'),vl=$$('tsapv');
 if(!b)return;
 au.preload='auto';au.src=TS.url;TSP.ri=0;
 function dur(){var x=au.duration;return isFinite(x)&&x>0?x:(TS.dur>0?TS.dur:0);}
 function paint(){var d=dur(),p=d?Math.min(1,au.currentTime/d):0;
  if(!TSP.drag){sk.value=String(Math.round(p*1000));sk.style.setProperty('--r',String(p));}
  ct.textContent=tsT(TSP.drag?sk.value/1000*d:au.currentTime);dt.textContent=tsT(d);
  sk.setAttribute('aria-valuetext',tsT(au.currentTime)+' of '+tsT(d));}
 function tick(){paint();if(!au.paused&&!au.ended)TSP.raf=requestAnimationFrame(tick);}
 function icon(){var on=!au.paused&&!au.ended;b.innerHTML=on?TSI.pause:TSI.play;b.setAttribute('aria-label',on?'Pause':'Play');}
 function toggle(){if(au.paused||au.ended){if(au.ended)au.currentTime=0;var p=au.play();if(p&&p.catch)p.catch(function(){});}else au.pause();}
 b.onclick=toggle;
 au.addEventListener('play',function(){icon();cancelAnimationFrame(TSP.raf);tick();});
 au.addEventListener('pause',function(){icon();paint();});
 au.addEventListener('ended',function(){icon();paint();});
 ['loadedmetadata','durationchange','timeupdate','seeked'].forEach(function(n){au.addEventListener(n,function(){if(au.paused)paint();});});
 sk.addEventListener('pointerdown',function(){TSP.drag=true;});
 ['pointerup','pointercancel','change','blur'].forEach(function(n){sk.addEventListener(n,function(){TSP.drag=false;paint();});});
 sk.addEventListener('input',function(){var d=dur();if(!d)return;TSP.drag=true;au.currentTime=sk.value/1000*d;ct.textContent=tsT(au.currentTime);});
 sk.addEventListener('keydown',function(e){var d=dur(),k=e.key,x=null;
  if(k==='ArrowRight'||k==='ArrowUp')x=au.currentTime+5;else if(k==='ArrowLeft'||k==='ArrowDown')x=au.currentTime-5;else if(k==='Home')x=0;else if(k==='End')x=d;
  else if(k===' '||k==='Enter'){e.preventDefault();toggle();return;}
  if(x===null)return;e.preventDefault();au.currentTime=Math.max(0,Math.min(d||0,x));paint();});
 rt.onclick=function(){TSP.ri=(TSP.ri+1)%TSP.rates.length;var r=TSP.rates[TSP.ri];au.playbackRate=r;rt.textContent=r+'×';};
 mt.onclick=function(){au.muted=!au.muted;mt.innerHTML=au.muted?TSI.mute:TSI.vol;mt.setAttribute('aria-label',au.muted?'Unmute':'Mute');};
 vl.addEventListener('input',function(){au.volume=+vl.value;au.muted=+vl.value===0;mt.innerHTML=au.muted?TSI.mute:TSI.vol;});
 paint();}
function tsResult(){var o=$$('tsout');if(!o)return;tsStop();
 if(!TS.blob){o.innerHTML='';return;}
 o.innerHTML='<div class="ts-res"><div class="dl-sl">'+ico('speaker',16)+'Your audio is ready</div>'+tsPlayerHTML()+'<div class="hint" style="display:block;margin-top:8px">'+(TS.ext==='wav'?'WAV':'MP3')+' · '+fb(TS.blob.size)+'</div><div class="dl-cta"><button class="btn pri" id="tsdl" type="button">Download audio</button><button class="btn" id="tsnew" type="button">Start over</button></div></div>';
 tsPlayerInit();}
function tsDrop(){tsStop();if(TS.url){try{URL.revokeObjectURL(TS.url);}catch(e){}}TS.url='';TS.blob=null;}
/* the speech service may send each piece as WAV or as MP3: tell them apart by their first bytes, and join WAV pieces properly so the file plays all the way through */
function tsIsWav(u){return u.length>44&&u[0]===82&&u[1]===73&&u[2]===70&&u[3]===70&&u[8]===87&&u[9]===65&&u[10]===86&&u[11]===69;}
function tsWavParts(u){var dv=new DataView(u.buffer,u.byteOffset,u.byteLength),p=12,fmt=null;
 while(p+8<=u.length){var id=String.fromCharCode(u[p],u[p+1],u[p+2],u[p+3]),sz=dv.getUint32(p+4,true);
  if(id==='fmt ')fmt=u.subarray(p+8,Math.min(u.length,p+8+sz));
  else if(id==='data'){var e=(sz===0||sz===4294967295||p+8+sz>u.length)?u.length:p+8+sz;return fmt&&fmt.length>=16?{fmt:fmt,data:u.subarray(p+8,e)}:null;}
  p+=8+sz+(sz&1);}
 return null;}
async function tsJoin(blobs){
 var bufs=[];for(var i=0;i<blobs.length;i++)bufs.push(new Uint8Array(await blobs[i].arrayBuffer()));
 if(bufs.length&&bufs.every(tsIsWav)){var ps=bufs.map(tsWavParts);
  if(ps.every(Boolean)){var f=ps[0].fmt,fv=new DataView(f.buffer,f.byteOffset,f.byteLength),sr=fv.getUint32(4,true),ba=fv.getUint16(12,true),bits=fv.getUint16(14,true);
   if(sr>0&&ba>0){var gap=new Uint8Array(Math.round(sr*0.12)*ba);if(bits===8)gap.fill(128);
    var parts=[],n=0;ps.forEach(function(q,k){if(k){parts.push(gap);n+=gap.length;}parts.push(q.data);n+=q.data.length;});
    var fl=f.length+(f.length&1),h=new Uint8Array(12+8+fl+8),hv=new DataView(h.buffer);
    var w4=function(o,t){for(var j=0;j<4;j++)h[o+j]=t.charCodeAt(j);};
    w4(0,'RIFF');hv.setUint32(4,h.length+n-8,true);w4(8,'WAVE');w4(12,'fmt ');hv.setUint32(16,f.length,true);h.set(f,20);w4(20+fl,'data');hv.setUint32(24+fl,n,true);
    return {blob:new Blob([h].concat(parts),{type:'audio/wav'}),ext:'wav'};}}}
 return {blob:new Blob(blobs,{type:'audio/mpeg'}),ext:'mp3'};}
async function tsMake(){if(TS.busy)return;
 var txt=$$('tst').value;TS.para=txt;TS.lang=$$('tsl').value;tsM2('');
 if(txt.replace(/[^\p{L}\p{N}]/gu,'').length<2){tsM2('Write or paste a paragraph first.','warn');return;}
 if(TSOWN[TS.lang]&&!TSOWN[TS.lang].test(txt)){tsM2('Write the text in '+(TS.lang==='ja'?'Japanese':'Korean')+' so the voice can read it, or choose another language.','warn');return;}
 if(!CFG.aiApi){tsM2('Audio files are not open yet. Please check back soon.','warn');return;}
 var base=String(CFG.aiApi).replace(/\/+$/,''),parts=tsChunks(txt,TPIECE),run=++TS.run,blobs=[];
 if(!parts.length){tsM2('Write or paste a paragraph first.','warn');return;}
 var cap=tsOn()&&!!$$('tscap');
 if(cap&&!TSC.tok){TSC.want=true;tsM2('Please complete the security check above. Your audio starts as soon as it is done.','warn');var ch=$$('tscap');if(ch&&ch.scrollIntoView)ch.scrollIntoView({behavior:'smooth',block:'center'});return;}
 TSC.want=false;
 tsDrop();tsResult();tsBusy(true,0,parts.length);
 try{
  var pass='';
  if(cap){var tk=TSC.tok;tsCapReset();pass=await tsPass(base,tk);if(run!==TS.run)return;}
  for(var i=0;i<parts.length;i++){if(run!==TS.run)return;tsBusy(true,i,parts.length);blobs.push(await tsPieceR(base,parts[i],TS.lang,pass));}
  if(run!==TS.run)return;
  var jn=await tsJoin(blobs);if(run!==TS.run)return;
  var dur=await tsProbe(jn.blob);if(run!==TS.run)return;
  var ms=await tsMeasure(jn.blob);if(run!==TS.run)return;
  if((dur>=0&&dur<0.25)||(ms&&ms.sec>=0&&(ms.sec<0.25||ms.peak<0.004))||(!ms&&dur<=0)){var e0=new Error('x');e0.code='empty';throw e0;}
  TS.dur=ms&&ms.sec>0?ms.sec:(dur>0?dur:0);
  TS.blob=jn.blob;TS.ext=jn.ext;TS.url=URL.createObjectURL(TS.blob);tsBusy(false);tsResult();
  var r=$$('tsout');if(r&&r.scrollIntoView)r.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(e){if(run!==TS.run)return;tsBusy(false);if(cap&&e&&e.code==='captcha')tsCapReset();tsM2(tsErr(e&&e.code),'bad');}}
function tsCancel(){TSC.want=false;TS.run++;try{if(TS.ctl)TS.ctl.abort();}catch(e){}tsBusy(false);tsM2('');}

function ttsPage(){nav('tts');
 app.innerHTML='<div class="dl-hd"><div class="ic i11">'+ico('speaker',26)+'</div><h1>Text to Speech</h1></div>'+
 '<p class="lead dl-lead">Hear your words read out loud as you type them, or turn a whole paragraph into an audio file you can download.</p>'+
 '<section class="card dl-sec dl-f" id="tsl1"><div class="dl-sh"><span class="dl-n">1</span><div><h2>Speak as you type</h2><span class="hint">Each word is read out loud the moment you finish it. Press space after a word to hear it.</span></div></div>'+
 '<textarea id="tsa" rows="3" maxlength="600" aria-label="Type here to hear each word" placeholder="Start typing here"></textarea>'+
 '<div class="ts-bar"><label class="qfl" for="tsvl">Language<select class="sel" id="tsvl"></select></label>'+
 '<label class="qfl" for="tsv">Voice<select class="sel" id="tsv"></select></label></div>'+
 '<div class="ts-bar full"><label class="qfl" for="tsr">Speed <span class="ts-rv" id="tsrv"></span><input type="range" id="tsr" min="0.6" max="1.6" step="0.01" data-ks="0.05" value="'+TS.rate+'"></label></div>'+
 '<p class="hint ts-vh" id="tsvh"></p>'+
 '<label class="qck"><input type="checkbox" id="tslive"'+(TS.live?' checked':'')+'> Speak each word as I type</label>'+
 '<div class="dl-cta"><button class="btn pri dl-big" id="tsall" type="button"></button><button class="btn" id="tsclr" type="button">Clear</button></div><div id="tsm1"></div></section>'+
 '<section class="card dl-sec dl-f" id="tsl2"><div class="dl-sh"><span class="dl-n">2</span><div><h2>Paragraph to audio file</h2><span class="hint">Write or paste a paragraph. Nothing is spoken while you write. When you are ready, make the audio and download it.</span></div></div>'+
 '<textarea id="tst" rows="8" maxlength="'+TMAX+'" aria-label="Your paragraph" placeholder="Write or paste your paragraph here">'+esc(TS.para)+'</textarea>'+
 '<div class="ts-count" id="tsc"></div>'+
 '<div class="ts-bar one"><label class="qfl" for="tsl">Language<select class="sel" id="tsl">'+tsLangOpts()+'</select></label></div>'+
 (tsOn()&&CFG.aiApi?'<div class="cts ts-cap" id="tscap"></div>':'')+'<div class="dl-cta"><button class="btn pri dl-big" id="tsmk" type="button">'+ico('speaker',18,2.2)+'Make audio</button><button class="btn" id="tsstop" type="button" style="display:none">Cancel</button></div>'+
 '<div id="tsprog"></div><div id="tsm2"></div><div id="tsout"></div></section>'+
 '<p class="dl-note">The voices are automated, so names and unusual words may not sound perfect. Audio files are made from the text you type and are not kept by this website. Please do not type personal details.</p>';
 var a=$$('tsa'),unlocked=false;
 a.addEventListener('input',tsInput);
 a.addEventListener('pointerdown',function(){if(unlocked||!tsCan())return;unlocked=true;try{var u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){}});
 $$('tsr').oninput=function(){TS.rate=parseFloat(this.value)||1;$$('tsrv').textContent=TS.rate.toFixed(2).replace(/0$/,'')+'×';};$$('tsr').oninput();
 $$('tslive').onchange=function(){TS.live=this.checked;TS.spoken=$$('tsa').selectionStart||0;};
 $$('tsvl').onchange=function(){TS.loc=this.value;TS.voice='';tsVoiceOpts();tsHi();};
 $$('tsv').onchange=function(){TS.voice=this.value;tsHi();};
 a.addEventListener('compositionend',function(){tsInput({target:a,inputType:'insertText'});});
 $$('tsall').onclick=tsAll;
 $$('tsclr').onclick=function(){try{speechSynthesis.cancel();}catch(e){}TS.reading=false;TS.rt++;TS.pend=0;TS.spoken=0;a.value='';tsAllUI();tsM1('');a.focus();};
 var t=$$('tst'),cnt=function(){$$('tsc').textContent=t.value.length+' / '+TMAX;};cnt();
 t.addEventListener('input',function(){cnt();TS.para=t.value;});
 $$('tsl').onchange=function(){TS.lang=this.value;};
 $$('tsmk').onclick=tsMake;$$('tsstop').onclick=tsCancel;tsAsk();
 tsCapDrop();
 if($$('tscap')){tsLib().then(function(T){var h=$$('tscap');if(!h||TSC.id!=null)return;
  TSC.id=T.render(h,{sitekey:CFG.turnstileKey,theme:'auto',callback:function(x){TSC.tok=x;if(TSC.want&&$$('tsmk')){TSC.want=false;tsMake();}},'expired-callback':function(){TSC.tok='';},'error-callback':function(){TSC.tok='';}});},
  function(){tsM2('The security check could not load. Please reload the page.','bad');});}
 $$('tsout').onclick=function(e){var b=e.target.closest?e.target.closest('button'):null;if(!b)return;
  if(b.id==='tsdl'&&TS.blob)saveBlob(TS.blob,'eve-speech.'+TS.ext);
  else if(b.id==='tsnew'){tsDrop();tsResult();t.value='';TS.para='';cnt();t.focus();}};
 tsAllUI();tsResult();
 if(tsCan()){tsVoiceOpts();aiVoicesReady(tsVoiceOpts);if(!TS.vl){TS.vl=true;try{speechSynthesis.addEventListener('voiceschanged',tsVoiceOpts);}catch(e){}}}
 else{$$('tsv').innerHTML='<option value="">Not available</option>';$$('tsvl').innerHTML='<option value="">Not available</option>';tsM1('Speaking out loud is not available in this browser, but you can still make an audio file below.','warn');}
}

/* ---------- Live Translate ---------- */
/* code, name, speech-recognition code, text-reader code, flag ('dev' = only a device translator can do it) */
var LLANGS=[['en','English','en-US','eng'],['hi','Hindi','hi-IN','hin'],['bn','Bengali','bn-IN','ben'],['ta','Tamil','ta-IN','tam'],['te','Telugu','te-IN','tel','dev'],['mr','Marathi','mr-IN','mar'],['gu','Gujarati','gu-IN','guj'],['kn','Kannada','kn-IN','kan'],['ml','Malayalam','ml-IN','mal'],['pa','Punjabi','pa-IN','pan'],['ur','Urdu','ur-PK','urd'],['ne','Nepali','ne-NP','nep'],
 ['es','Spanish','es-ES','spa'],['fr','French','fr-FR','fra'],['de','German','de-DE','deu'],['it','Italian','it-IT','ita'],['pt','Portuguese','pt-BR','por'],['nl','Dutch','nl-NL','nld'],['ru','Russian','ru-RU','rus'],['uk','Ukrainian','uk-UA','ukr'],['pl','Polish','pl-PL','pol'],['tr','Turkish','tr-TR','tur'],['ar','Arabic','ar-SA','ara'],['fa','Persian','fa-IR','fas'],['he','Hebrew','he-IL','heb'],
 ['ja','Japanese','ja-JP','jpn'],['ko','Korean','ko-KR','kor'],['zh','Chinese (Simplified)','zh-CN','chi_sim'],['id','Indonesian','id-ID','ind'],['ms','Malay','ms-MY','msa'],['vi','Vietnamese','vi-VN','vie'],['th','Thai','th-TH','tha'],['tl','Filipino','fil-PH','fil'],['sv','Swedish','sv-SE','swe'],['el','Greek','el-GR','ell'],['cs','Czech','cs-CZ','ces'],['ro','Romanian','ro-RO','ron'],['hu','Hungarian','hu-HU','hun'],['da','Danish','da-DK','dan'],['fi','Finnish','fi-FI','fin'],['no','Norwegian','nb-NO','nor'],['sw','Swahili','sw-KE','swa']]
 .sort(function(a,b){return a[1]<b[1]?-1:a[1]>b[1]?1:0;});
var LRTL={ar:1,he:1,fa:1,ur:1};
var LT={mode:'speak',from:'en',to:'hi',dev:true,say:false,over:true,rec:null,listening:false,hold:0,lines:[],id:0,interim:'',itr:'',itBusy:false,itNext:null,via:'',scr:null,sr:0,eng:'browser',netTry:0,w:null,wq:Promise.resolve(),proc:0};
URLS.tesseract=['https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'];
ALT.tesseract='https://unpkg.com/tesseract.js@5.1.1/dist/tesseract.min.js';
var LTERR={setup:'Live Translate is not switched on yet. Please check back soon.',slow:'That was a lot of translating in a short time. Please wait a few minutes and try again.',limit:'Eve has used up her free translating for today. Please try again tomorrow.',busy:'The translator is busy right now. Please try again in a moment.',big:'That was too long to translate in one go.',net:'Could not connect. Please check your internet and try again.',timeout:'That is taking too long. Please try again.',lang:'That pair of languages is not available.',devonly:'This language can only be translated by Chrome on a computer for now. Please choose another language.',devwait:'The translator for this language is still getting ready on this device. Please try again in a moment.',down:'The translator could not answer right now. Please try again in a moment.'};
function ltErr(c){return LTERR[c]||LTERR.down;}
function ltE(c){var e=new Error('x');e.code=c;return e;}
function ltL(c){for(var i=0;i<LLANGS.length;i++)if(LLANGS[i][0]===c)return LLANGS[i];return LLANGS[0];}
function ltOpts(sel){return LLANGS.map(function(l){return '<option value="'+l[0]+'"'+(l[0]===sel?' selected':'')+'>'+l[1]+'</option>';}).join('');}
/* ---- the translator: this device's own (Chrome on a computer) when it can do the pair, otherwise Eve's online one ---- */
var LTD={},LTDR={},LTDM={},LTDP={};
function ltDevReset(){Object.keys(LTD).forEach(function(k){if(!LTDR[k]){delete LTD[k];delete LTDM[k];}});}
function ltDevCan(){return typeof self!=='undefined'&&('Translator' in self);}
function ltDevKey(){return LT.from+'>'+LT.to;}
/* starts (once) getting this device's own translator for a pair of languages; never throws, gives null when it cannot */
function ltDevGet(from,to,onprog){var k=from+'>'+to;if(!LT.dev||!ltDevCan())return Promise.resolve(null);if(onprog)LTDP[k]=onprog;if(LTD[k])return LTD[k];
 LTD[k]=(async function(){try{var a=await Translator.availability({sourceLanguage:from,targetLanguage:to});LTDM[k]=a;if(a==='unavailable')return null;
  var t=await Translator.create({sourceLanguage:from,targetLanguage:to,monitor:function(m){m.addEventListener('downloadprogress',function(e){var f=LTDP[k];if(f)f(Math.round((e.loaded||0)*100));});}});
  LTDR[k]=t;return t;}catch(e){LTDM[k]='unavailable';return null;}})();return LTD[k];}
function ltWeb(texts,from,to){var base=String(CFG.aiApi||'').replace(/\/+$/,'');if(!base)return Promise.reject(ltE('setup'));
 var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},30000);
 return fetch(base+'/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({texts:texts,from:from,to:to}),signal:ctl.signal}).then(function(r){
  return r.json().catch(function(){return {};}).then(function(j){clearTimeout(tm);if(r.ok&&j&&j.ok&&Array.isArray(j.out))return j.out;throw ltE((j&&j.error)||'down');});
 },function(e){clearTimeout(tm);throw ltE(e&&e.name==='AbortError'?'timeout':'net');});}
var LTC={},LTCN=0;
async function ltTr(texts,from,to){if(from===to)return texts.slice();var out=new Array(texts.length),need=[],idx=[];
 texts.forEach(function(t,i){var k=from+'|'+to+'|'+t;if(LTC[k])out[i]=LTC[k];else{need.push(t);idx.push(i);}});
 if(need.length){var res=null,k=from+'>'+to,pr=ltDevGet(from,to),dev=LTDR[k]||null;
  if(!dev&&LT.dev&&ltDevCan()&&!LTDM[k]){dev=await Promise.race([pr,ltWait(1500).then(function(){return null;})]);}
  if(dev){try{res=[];var fails=0;for(var i=0;i<need.length;i++){var x='';try{x=await dev.translate(need[i]);}catch(e){fails++;}res.push(x||'');}if(fails===need.length)throw 0;LT.via='device';}catch(e){res=null;delete LTDR[k];LTD[k]=Promise.resolve(null);LTDM[k]='unavailable';}}
  if(!res){if(ltL(from)[4]==='dev'||ltL(to)[4]==='dev')throw ltE(LTDM[k]==='downloadable'||LTDM[k]==='downloading'||!LTDM[k]&&LT.dev&&ltDevCan()?'devwait':'devonly');res=await ltWeb(need,from,to);LT.via='online';}
  if(LTCN>1500){LTC={};LTCN=0;}
  res.forEach(function(t,j){t=t||'';out[idx[j]]=t;if(t){LTC[from+'|'+to+'|'+need[j]]=t;LTCN++;}});}
 return out;}
function ltSt(t,k){var e=$$('ltst');if(e)e.innerHTML=t?'<div class="msg '+(k||'')+'"><span class="dotk"></span><span>'+esc(t)+'</span></div>':'';}
function ltViaNote(){var a=(LT.eng==='eve'&&LT.mode==='speak'&&LT.listening)?'Your voice is sent to be turned into text. ':'';return a+(LT.via==='device'?'Translated on this device. Nothing is sent anywhere.':LT.via==='online'?'Only the words are sent for translation.':'');}
function ltCopyText(t){try{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t);}catch(e){}
 return new Promise(function(res,rej){try{var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();var ok=document.execCommand('copy');document.body.removeChild(a);ok?res():rej();}catch(e){rej(e);}});}
function ltFlash(id,t){var b=$$(id);if(!b)return;var o=b.getAttribute('data-l')||b.textContent;b.setAttribute('data-l',o);b.textContent=t;setTimeout(function(){var x=$$(id);if(x)x.textContent=o;},1400);}
/* ---- speaking and listening ---- */
function ltSR(){return window.SpeechRecognition||window.webkitSpeechRecognition||null;}
function ltMicUI(){var b=$$('ltmic');if(!b)return;b.classList.toggle('rec',LT.listening);b.innerHTML=(LT.listening?ico('stop',18,2.2)+'Stop listening':ico('mic',18,2.2)+'Start listening');b.setAttribute('aria-pressed',LT.listening?'true':'false');}
function ltListRender(){var el=$$('ltlist');if(!el)return;
 var near=el.scrollHeight-el.scrollTop-el.clientHeight<60,rtl=LRTL[LT.to]?' dir="rtl"':'',h='';
 LT.lines.forEach(function(l){h+='<div class="lt-l"><div class="lt-o">'+esc(l.o)+'</div><div class="lt-t"'+rtl+'>'+(l.t?esc(l.t):l.err?'<span class="lt-x">Could not translate this part.</span>':'<span class="lt-w">Translating…</span>')+'</div></div>';});
 if(LT.interim)h+='<div class="lt-l int"><div class="lt-o">'+esc(LT.interim)+'</div>'+(LT.itr?'<div class="lt-t"'+rtl+'>'+esc(LT.itr)+'</div>':'')+'</div>';

 if(LT.proc>0&&!LT.interim)h+='<div class="lt-l int"><div class="lt-o">Working on what you said…</div></div>';
 if(!h)h='<div class="lt-em">'+(LT.listening?'Listening… start speaking.':'Press Start listening and speak. What you say appears here with its translation under it.')+'</div>';
 el.innerHTML=h;if(near)el.scrollTop=el.scrollHeight;ltPipRender();}
function ltAdd(t){t=String(t||'').replace(/\s+/g,' ').trim();if(!t)return;var L={o:t,t:'',err:'',id:++LT.id};LT.lines.push(L);if(LT.lines.length>200)LT.lines.shift();LT.interim='';LT.itr='';ltListRender();
 var from=LT.from,to=LT.to;
 ltTr([t],from,to).then(function(o){L.t=o[0]||'';if(!L.t)L.err='x';ltListRender();ltSt(L.t?'':'Could not translate that part.',L.t?'':'warn');if(L.t&&LT.say)ltSay(L.t);var n=$$('ltvia');if(n)n.textContent=ltViaNote();},
  function(e){L.err=e.code||'down';ltListRender();ltSt(ltErr(e.code),'bad');});}
function ltIntTr(t){var k=ltDevKey(),dv=LT.dev?LTDR[k]:null;if(!dv||!t){LT.itr='';return;}
 if(LT.itBusy){LT.itNext=t;return;}LT.itBusy=true;
 dv.translate(t).then(function(x){if(ltDevKey()===k&&LT.interim)LT.itr=x;},function(){}).then(function(){LT.itBusy=false;ltListRender();var n=LT.itNext;LT.itNext=null;if(n&&n!==t&&LT.interim)ltIntTr(n);});}
function ltSay(t){if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return;
 var u=new SpeechSynthesisUtterance(t),c=ltL(LT.to)[2];u.lang=c;
 try{var vs=speechSynthesis.getVoices(),v=vs.filter(function(x){return x.lang===c||String(x.lang).replace('_','-')===c;})[0]||vs.filter(function(x){return String(x.lang).slice(0,2)===c.slice(0,2);})[0];if(v)u.voice=v;}catch(e){}
 LT.hold++;try{if(LT.rec)LT.rec.abort();}catch(e){}
 var done=function(){LT.hold=Math.max(0,LT.hold-1);if(!LT.hold&&LT.listening&&!LT.rec&&LT.eng!=='eve')setTimeout(function(){if(LT.listening&&!LT.hold&&!LT.rec&&LT.eng!=='eve')ltRecStart();},250);};
 u.onend=done;u.onerror=done;try{speechSynthesis.speak(u);}catch(e){done();}}
function ltRecStart(){var SR=ltSR();if(!SR||!LT.listening||LT.hold||LT.eng==='eve')return;var r=new SR();LT.rec=r;
 r.lang=ltL(LT.from)[2];r.continuous=true;r.interimResults=true;r.maxAlternatives=1;
 r.onresult=function(e){if(LT.rec!==r)return;var im='';for(var i=e.resultIndex;i<e.results.length;i++){var res=e.results[i],t=res[0]&&res[0].transcript||'';if(res.isFinal)ltAdd(t);else im+=t;}
  if(im!==LT.interim){LT.interim=im;if(!im)LT.itr='';ltListRender();ltIntTr(im);}};
 r.onerror=function(e){if(LT.rec!==r)return;var c=e&&e.error;
  if(c==='no-speech'||c==='aborted')return;
  if(c==='network'&&LT.netTry<2){LT.netTry++;LT.rec=null;ltSt('Reconnecting to the speech service…','');setTimeout(function(){if(LT.listening&&!LT.rec&&LT.eng==='browser')ltRecStart();},700*LT.netTry);return;}
  if((c==='network'||c==='service-not-allowed'||c==='language-not-supported')&&ltCanRec()&&String(CFG.aiApi||'')){LT.rec=null;ltToEve();return;}
  var m=c==='not-allowed'||c==='service-not-allowed'?'The microphone is blocked. Allow the microphone for this website in your browser, then press Start listening again.':c==='audio-capture'?'No microphone was found on this device.':c==='language-not-supported'?'This browser cannot listen in '+ltL(LT.from)[1]+'. Please choose another language.':c==='network'?'The browser’s speech service could not be reached. Check your internet and try again.':'Listening stopped. Please try again.';
  LT.listening=false;LT.rec=null;ltMicUI();ltListRender();ltSt(m,'bad');};
 r.onend=function(){if(LT.rec!==r)return;LT.rec=null;if(LT.listening&&!LT.hold)setTimeout(function(){if(LT.listening&&!LT.rec&&!LT.hold)ltRecStart();},250);};
 try{r.start();}catch(x){LT.rec=null;}}
function ltMic(){if(LT.listening){ltMicStop();return;}
 var own=!ltSR()||LT.eng==='eve';
 if(own&&!(ltCanRec()&&String(CFG.aiApi||''))){ltSt('This browser cannot listen to the microphone. Please use Chrome, Edge or Safari.','warn');return;}
 ltSt('');ltDevReset();LT.listening=true;LT.interim='';LT.itr='';LT.netTry=0;LT.eng=own?'eve':'browser';ltMicUI();ltListRender();if(own)ltWStart();else ltRecStart();
 var vn=$$('ltvia');if(vn)vn.textContent=ltViaNote();
 ltDevGet(LT.from,LT.to,function(p){if(LT.listening)ltSt('Getting the translator ready on this device… '+p+'%','');}).then(function(){var e=$$('ltst');if(e&&/Getting the translator/.test(e.textContent))ltSt('');});}
function ltMicStop(){LT.listening=false;var r=LT.rec;LT.rec=null;try{if(r)r.abort();}catch(e){}ltWStop();LT.proc=0;try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}LT.hold=0;LT.interim='';LT.itr='';ltMicUI();ltListRender();}
function ltMicRestart(){if(!LT.listening)return;if(LT.eng==='eve'){if(LT.w){LT.w.seg=null;LT.w.pre=[];}LT.interim='';ltListRender();return;}var r=LT.rec;LT.rec=null;try{if(r)r.abort();}catch(e){}LT.interim='';LT.itr='';ltListRender();setTimeout(function(){if(LT.listening&&!LT.rec&&!LT.hold)ltRecStart();},300);}
/* ---- Eve's own listening: used when the browser's speech service cannot be reached, or the browser has none.
   The microphone is cut into spoken sentences on this device; each sentence goes to Eve as a short sound clip and comes back as text. ---- */
function ltCanRec(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(window.AudioContext||window.webkitAudioContext));}
function ltToEve(){LT.eng='eve';ltSt('Your browser’s speech service could not be reached, so Eve is listening another way. Your voice is sent to be turned into text.','');var n=$$('ltvia');if(n)n.textContent=ltViaNote();ltWStart();}
function ltWav(chunks,sr){var n=0,o=0,i,j;chunks.forEach(function(c){n+=c.length;});var all=new Float32Array(n);chunks.forEach(function(c){all.set(c,o);o+=c.length;});
 var ratio=sr/16000,m=Math.floor(n/ratio),buf=new ArrayBuffer(44+m*2),dv=new DataView(buf);
 function str(p,t){for(var k=0;k<t.length;k++)dv.setUint8(p+k,t.charCodeAt(k));}
 str(0,'RIFF');dv.setUint32(4,36+m*2,true);str(8,'WAVE');str(12,'fmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,16000,true);dv.setUint32(28,32000,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);str(36,'data');dv.setUint32(40,m*2,true);
 for(i=0;i<m;i++){var a=Math.floor(i*ratio),b=Math.min(n,Math.floor((i+1)*ratio)),t=0;for(j=a;j<b;j++)t+=all[j];var v=b>a?t/(b-a):0;v=v>1?1:v<-1?-1:v;dv.setInt16(44+i*2,v<0?v*32768:v*32767,true);}
 return new Blob([buf],{type:'audio/wav'});}
function ltSend(blob,lang){var base=String(CFG.aiApi||'').replace(/\/+$/,'');if(!base)return Promise.reject(ltE('setup'));
 var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort();},40000);
 return fetch(base+'/listen?lang='+encodeURIComponent(lang),{method:'POST',headers:{'Content-Type':'audio/wav'},body:blob,signal:ctl.signal}).then(function(r){
  return r.json().catch(function(){return {};}).then(function(j){clearTimeout(tm);if(r.ok&&j&&j.ok)return String(j.text||'');throw ltE((j&&j.error)||'down');});
 },function(e){clearTimeout(tm);throw ltE(e&&e.name==='AbortError'?'timeout':'net');});}
function ltWEnd(W){var chunks=W.seg,vt=W.vt;W.seg=null;W.pre=[];LT.interim='';
 if(!chunks||vt<0.25){ltListRender();return;}
 LT.proc++;ltListRender();var blob=ltWav(chunks,W.sr),lang=LT.from;
 LT.wq=LT.wq.then(function(){if(!LT.listening||LT.eng!=='eve'){LT.proc=Math.max(0,LT.proc-1);return;}
  return ltSend(blob,lang).then(function(t){LT.proc=Math.max(0,LT.proc-1);if(lang===LT.from&&t)ltAdd(t);else ltListRender();},
   function(e){LT.proc=Math.max(0,LT.proc-1);ltListRender();ltSt(ltErr(e.code),'bad');if(e.code==='limit')ltMicStop();});});}
async function ltWStart(){var AC=window.AudioContext||window.webkitAudioContext,stream;
 try{stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});}
 catch(e){if(!LT.listening)return;var n=e&&e.name;LT.listening=false;ltMicUI();ltListRender();
  ltSt(n==='NotAllowedError'||n==='SecurityError'?'The microphone is blocked. Allow the microphone for this website in your browser, then press Start listening again.':n==='NotFoundError'?'No microphone was found on this device.':'Listening stopped. Please try again.','bad');return;}
 if(!LT.listening||LT.eng!=='eve'){stream.getTracks().forEach(function(t){t.stop();});return;}
 var ctx=new AC(),src=ctx.createMediaStreamSource(stream),proc=ctx.createScriptProcessor(4096,1,1),mute=ctx.createGain();mute.gain.value=0;
 var W=LT.w={stream:stream,ctx:ctx,src:src,proc:proc,mute:mute,pre:[],seg:null,vt:0,last:0,start:0,t:0,sr:ctx.sampleRate,floor:0.004};
 proc.onaudioprocess=function(e){if(LT.w!==W||!LT.listening)return;var f=new Float32Array(e.inputBuffer.getChannelData(0));
  if(LT.hold){W.pre=[];if(W.seg){W.seg=null;LT.interim='';ltListRender();}return;}
  var s=0,i;for(i=0;i<f.length;i++)s+=f[i]*f[i];var rms=Math.sqrt(s/f.length),dt=f.length/W.sr;W.t+=dt;
  var loud=rms>Math.max(0.012,W.floor*3.5);if(!loud)W.floor=W.floor*0.97+rms*0.03;
  if(!W.seg){W.pre.push(f);while(W.pre.length*f.length/W.sr>0.45)W.pre.shift();
   if(loud){W.seg=W.pre;W.pre=[];W.vt=dt;W.last=W.t;W.start=W.t;LT.interim='…';ltListRender();}}
  else{W.seg.push(f);if(loud){W.last=W.t;W.vt+=dt;}if(W.t-W.last>0.9||W.t-W.start>18)ltWEnd(W);}};
 src.connect(proc);proc.connect(mute);mute.connect(ctx.destination);try{if(ctx.state==='suspended')ctx.resume();}catch(e){}}
function ltWStop(){var W=LT.w;LT.w=null;if(!W)return;try{W.proc.onaudioprocess=null;W.src.disconnect();W.proc.disconnect();}catch(e){}try{W.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}try{W.ctx.close();}catch(e){}}
/* ---- reading the screen ---- */
/* a timer that is not slowed down when this tab is in the background (the page keeps translating while you watch the video) */
var LTW=null,LTWN=0,LTWM={};
function ltWait(ms){if(LTW===null){try{LTW=new Worker(URL.createObjectURL(new Blob(['onmessage=function(e){var d=e.data;setTimeout(function(){postMessage(d.i)},d.ms)}'],{type:'text/javascript'})));LTW.onmessage=function(e){var f=LTWM[e.data];delete LTWM[e.data];if(f)f();};}catch(e){LTW=false;}}
 if(!LTW)return new Promise(function(r){setTimeout(r,ms);});
 return new Promise(function(r){var i=++LTWN;LTWM[i]=r;LTW.postMessage({i:i,ms:ms});});}
/* a message the screen loop put up itself; it only takes down its own message, never an error from somewhere else */
function ltScrMsg(S,t,k){if(t){var e0=$$('ltst2');if(S.own===t&&e0&&e0.textContent===t)return;ltSt2(t,k||'');S.own=t;}else if(S.own){var e=$$('ltst2');if(e&&e.textContent===S.own)ltSt2('');S.own='';}}
function ltSt2(t,k){var e=$$('ltst2');if(e)e.innerHTML=t?'<div class="msg '+(k||'')+'"><span class="dotk"></span><span>'+esc(t)+'</span></div>':'';}
function ltKey(t){return String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');}
function ltDice(a,b){if(a===b)return 1;if(a.length<5||b.length<5)return 0;var m={},n=0,i;for(i=0;i<a.length-1;i++){var g=a.substr(i,2);m[g]=(m[g]||0)+1;}
 for(i=0;i<b.length-1;i++){var h=b.substr(i,2);if(m[h]>0){m[h]--;n++;}}return 2*n/(a.length+b.length-2);}
function ltLookup(S,key){if(S.tr[key])return S.tr[key];var best=0,hit='';for(var i=S.keys.length-1;i>=0&&i>S.keys.length-80;i--){var k=S.keys[i];if(Math.abs(k.length-key.length)>key.length*0.2)continue;var d=ltDice(k,key);if(d>best){best=d;hit=k;}}
 return best>=(LDENSE[LT.from]?0.78:0.88)?S.tr[hit]:'';}
/* the text reader gives lines; lines that sit right under each other and line up belong to one block of text */
/* a reading of the picture gives lines; only believable ones are kept (guesses from photos, icons and tiny marks are dropped) */
/* the writing system of each language, so a line in another writing system (English on a Chinese page, say) is not read as that language */
var LSCR={zh:['Han'],ja:['Han','Hiragana','Katakana'],ko:['Hangul'],hi:['Devanagari'],mr:['Devanagari'],ne:['Devanagari'],bn:['Bengali'],ta:['Tamil'],te:['Telugu'],kn:['Kannada'],ml:['Malayalam'],gu:['Gujarati'],pa:['Gurmukhi'],ur:['Arabic'],ar:['Arabic'],fa:['Arabic'],he:['Hebrew'],th:['Thai'],ru:['Cyrillic'],uk:['Cyrillic'],el:['Greek']},LSRE={},LDENSE={zh:1,ja:1,ko:1};
function ltScr(lang){if(!LSRE[lang]){var a=LSCR[lang]||['Latin'];LSRE[lang]=new RegExp('['+a.map(function(x){return '\\p{Script='+x+'}';}).join('')+']','gu');}return LSRE[lang];}
/* a reading of the picture gives lines; only believable ones in the chosen language are kept (guesses from photos, icons and tiny marks are dropped) */
function ltLineOk(l,lang,min){var t=String(l.text||'').replace(/\s+/g,' ').trim();
 if(lang==='zh'||lang==='ja')t=t.replace(/([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}，。！？、：；「」（）])\s+(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}，。！？、：；「」（）])/gu,'$1');
 if(lang==='en')t=t.replace(/(^|\s)\|(?=\s+[a-z])/g,'$1I');
 if(!t)return null;var dn=!!LDENSE[lang],bw=l.bbox.x1-l.bbox.x0,bh=l.bbox.y1-l.bbox.y0,n=(t.match(/\p{L}/gu)||[]).length,sn=(t.match(ltScr(lang))||[]).length;
 /* the reader is often unsure about Chinese, Japanese and Korean on moving video, so those are let in at a lower score; the writing-system check keeps the junk out. A single character must be a sure one.
    A line that is partly in another writing system (Chinese with its pinyin or English underneath) is let in when enough of it is in the chosen one */
 if(l.confidence<(min||(dn?40:60))||n<(dn?1:3)||(dn&&sn<2&&l.confidence<75)||bh<9||bw<10||(!dn&&n/t.length<0.55)||!(dn?(sn/n>=0.5||(sn>=2&&sn/n>=0.25&&l.confidence>=60)):sn/n>=0.6))return null;var per=bw/t.length/bh;if(per<0.18||per>(dn?2.5:1.6))return null;
 /* Chinese with pinyin or English beside it: only the Chinese words are kept (the pinyin is read badly and cannot be translated) */
 if(lang==='zh'&&sn/n<0.8){var re=ltScr(lang);t=t.split(' ').filter(function(w){if(!/\p{Script=Latin}/u.test(w))return true;re.lastIndex=0;var k=re.test(w);re.lastIndex=0;return k;}).join(' ').trim();if(!t)return null;n=(t.match(/\p{L}/gu)||[]).length;}
 return {t:t,x0:l.bbox.x0,y0:l.bbox.y0,x1:l.bbox.x1,y1:l.bbox.y1,s:l.confidence*n};}
/* the same spot can be read more than once (normal and bright-text readings): keep the best reading for each spot */
function ltPick(c){c.sort(function(a,b){return b.s-a.s;});var keep=[];
 c.forEach(function(l){var ar=(l.x1-l.x0)*(l.y1-l.y0),bad=false;
  for(var i=0;i<keep.length;i++){var k=keep[i],ix=Math.min(l.x1,k.x1)-Math.max(l.x0,k.x0),iy=Math.min(l.y1,k.y1)-Math.max(l.y0,k.y0);if(ix>0&&iy>0&&ix*iy>0.35*ar){bad=true;break;}}
  if(!bad)keep.push(l);});return keep;}
/* only the bright, colourless pixels (white subtitles and captions) turned into black text on white, which is far easier to read on top of a photo */
/* gives the picture to read and how far down the screen it starts. Only the rows that hold bright text are kept, so a subtitle at the bottom is far quicker to read than the whole screen */
function ltMask(img,w,h,mc,done){var N=w*h,n=0,left=0,i,p,r,g,b,mx,mn,rows=new Uint32Array(h),cov=null;
 /* "done" = places the first reading already read with confidence: when they hold nearly all the bright text there is nothing left for this second look */
 if(done&&done.length){cov=new Uint8Array(N);done.forEach(function(k){var x0=Math.max(0,Math.floor(k.x0)-6),x1=Math.min(w,Math.ceil(k.x1)+6),y0=Math.max(0,Math.floor(k.y0)-6),y1=Math.min(h,Math.ceil(k.y1)+6);for(var y=y0;y<y1;y++)cov.fill(1,y*w+x0,y*w+x1);});}
 for(i=0,p=0;p<N;i+=4,p++){r=img[i];g=img[i+1];b=img[i+2];mx=r>g?(r>b?r:b):(g>b?g:b);mn=r<g?(r<b?r:b):(g<b?g:b);if(0.299*r+0.587*g+0.114*b>225&&mx-mn<60){n++;rows[(p/w)|0]++;if(cov&&!cov[p])left++;}}
 if(n<N*0.002||n>N*0.3)return null;if(cov&&left<n*0.3)return null;
 var y0=0,y1=h-1,th=Math.max(3,w*0.004);while(y0<h&&rows[y0]<th)y0++;
 if(y0<h){while(y1>y0&&rows[y1]<th)y1--;y0=Math.max(0,y0-16);y1=Math.min(h-1,y1+16);if(y1-y0+1>h*0.8){y0=0;y1=h-1;}}else{y0=0;y1=h-1;}
 var mh=y1-y0+1,M=w*mh;mc.width=w;mc.height=mh;var x=mc.getContext('2d'),o=x.createImageData(w,mh),d=o.data,q;
 for(p=0;p<M;p++){i=(y0*w+p)*4;r=img[i];g=img[i+1];b=img[i+2];mx=r>g?(r>b?r:b):(g>b?g:b);mn=r<g?(r<b?r:b):(g<b?g:b);var v=(0.299*r+0.587*g+0.114*b>225&&mx-mn<60)?0:255;q=p*4;d[q]=d[q+1]=d[q+2]=v;d[q+3]=255;}
 x.putImageData(o,0,0);return {c:mc,oy:y0};}
function ltShift(l,oy){return oy?{text:l.text,confidence:l.confidence,bbox:{x0:l.bbox.x0,x1:l.bbox.x1,y0:l.bbox.y0+oy,y1:l.bbox.y1+oy}}:l;}
/* lines that sit right under each other and line up belong to one block of text */
function ltBlocks(ls,img,w,h){ls=ls.slice();
 ls.sort(function(a,b){return a.y0-b.y0||a.x0-b.x0;});var bl=[];
 ls.forEach(function(l){var lh=l.y1-l.y0,best=null;
  for(var i=bl.length-1;i>=0&&i>=bl.length-14;i--){var b=bl[i],gap=l.y0-b.y1,dx=Math.abs(l.x0-b.x0),hs=Math.min(lh,b.lh)/Math.max(lh,b.lh),ov=Math.min(l.x1,b.x1)-Math.max(l.x0,b.x0);
   if(gap>=-b.lh*0.35&&gap<=b.lh*0.8&&hs>0.7&&(dx<=b.lh*1.6||ov>0.5*Math.min(l.x1-l.x0,b.x1-b.x0))&&b.n<14){best=b;break;}}
  if(best){best.t+=' '+l.t;best.x0=Math.min(best.x0,l.x0);best.y0=Math.min(best.y0,l.y0);best.x1=Math.max(best.x1,l.x1);best.y1=Math.max(best.y1,l.y1);best.n++;best.lh=Math.max(best.lh,lh);}
  else bl.push({t:l.t,x0:l.x0,y0:l.y0,x1:l.x1,y1:l.y1,lh:lh,n:1});});
 bl=bl.filter(function(b){return (b.t.match(/\p{L}/gu)||[]).length>=(LDENSE[LT.from]?1:2);}).slice(0,40);
 bl.forEach(function(b){b.key=ltKey(b.t);ltBg(b,img,w,h);});
 return bl.filter(function(b){return b.key;});}
/* the colour around a block of text, so the translation can be painted over it in a matching colour */
function ltBg(b,img,w,h){var p=3,x0=Math.max(0,b.x0-p),y0=Math.max(0,b.y0-p),x1=Math.min(w-1,b.x1+p),y1=Math.min(h-1,b.y1+p),R=[],G=[],B=[];
 function at(x,y){x=Math.max(0,Math.min(w-1,Math.round(x)));y=Math.max(0,Math.min(h-1,Math.round(y)));var i=(y*w+x)*4;R.push(img[i]);G.push(img[i+1]);B.push(img[i+2]);}
 for(var k=0;k<=16;k++){var fx=x0+(x1-x0)*k/16,fy=y0+(y1-y0)*k/16;at(fx,y0);at(fx,y1);at(x0,fy);at(x1,fy);}
 var med=function(a){a.sort(function(x,y){return x-y;});return a[a.length>>1];};b.r=med(R);b.g=med(G);b.b=med(B);b.dark=(0.299*b.r+0.587*b.g+0.114*b.b)<140;}
function ltFit(cx,text,W,H,rtl){var cjk=/[぀-ヿ㐀-鿿가-힯฀-๿]/.test(text),best=null;
 function wrap(sz){cx.font=sz+'px Inter,system-ui,-apple-system,"Segoe UI",sans-serif';var u=cjk?Array.from(text):text.split(' '),sp=cjk?'':' ',ls=[],cur='';
  u.forEach(function(x){var t=cur?cur+sp+x:x;if(cur&&cx.measureText(t).width>W){ls.push(cur);cur=x;}else cur=t;});if(cur)ls.push(cur);return ls;}
 var lo=8,hi=Math.max(8,Math.min(Math.floor(H),64));
 while(lo<=hi){var mid=(lo+hi)>>1,ls=wrap(mid),ok=ls.length*mid*1.2<=H&&ls.every(function(l){return cx.measureText(l).width<=W+1;});if(ok){best={sz:mid,ls:ls};lo=mid+1;}else hi=mid-1;}
 return best||{sz:8,ls:wrap(8)};}
function ltDraw(S){var c=$$('ltov');if(!c||!S||!S.w)return;if(c.width!==S.w||c.height!==S.h){c.width=S.w;c.height=S.h;}var x=c.getContext('2d');x.clearRect(0,0,S.w,S.h);if(!LT.over)return;var rtl=!!LRTL[LT.to];
 (S.blocks||[]).forEach(function(b){var t=ltLookup(S,b.key);if(!t)return;var padX=Math.max(3,b.lh*0.25),padY=Math.max(2,b.lh*0.12),bx=Math.max(0,b.x0-padX),by=Math.max(0,b.y0-padY),bw=Math.min(S.w,b.x1+padX)-bx,bh=Math.min(S.h,b.y1+padY)-by;
  x.fillStyle='rgb('+b.r+','+b.g+','+b.b+')';x.fillRect(bx,by,bw,bh);
  var f=ltFit(x,t,bw-padX,bh-padY,rtl);x.fillStyle=b.dark?'#fff':'#111';x.textBaseline='top';x.direction=rtl?'rtl':'ltr';x.textAlign=rtl?'right':'left';x.font=f.sz+'px Inter,system-ui,-apple-system,"Segoe UI",sans-serif';
  var ty=by+Math.max(0,(bh-f.ls.length*f.sz*1.2)/2),tx=rtl?bx+bw-padX/2:bx+padX/2;f.ls.forEach(function(l,i){x.fillText(l,tx,ty+i*f.sz*1.2);});});}
function ltSideList(S){var el=$$('ltsl');if(!el)return;var rtl=LRTL[LT.to]?' dir="rtl"':'',H=S.hist||(S.hist=[]),h='';
 /* what was read is kept in a running list (newest at the bottom), so a subtitle can still be read after it has left the screen */
 (S.blocks||[]).forEach(function(b){var t=ltLookup(S,b.key);if(!t)return;var hit=-1,i,e;
  for(i=H.length-1;i>=0&&i>=H.length-14;i--){e=H[i];if(e.k===b.key||(Math.min(e.k.length,b.key.length)>=2&&(e.k.indexOf(b.key)===0||b.key.indexOf(e.k)===0))||ltDice(e.k,b.key)>=0.7){hit=i;break;}}
  if(hit<0){H.push({k:b.key,o:b.t,t:t});if(H.length>80)H.shift();}
  else if(b.key.length>=H[hit].k.length)H[hit]={k:b.key,o:b.t,t:t};});
 H.forEach(function(e){h+='<div class="lt-l"><div class="lt-o">'+esc(e.o)+'</div><div class="lt-t"'+rtl+'>'+esc(e.t)+'</div></div>';});
 var sig=H.length+':'+h.length+':'+h.slice(-160);if(S.lsig===sig)return;S.lsig=sig;var near=el.scrollHeight-el.scrollTop-el.clientHeight<60;
 el.innerHTML=h||'<div class="lt-em">Text found on your screen will appear here with its translation.</div>';if(near)el.scrollTop=el.scrollHeight;ltPipRender();}
function ltTrNeed(S){if(S.busy||Date.now()<S.errUntil)return;var from=LT.from,to=LT.to,need=[],seen={};
 (S.blocks||[]).forEach(function(b){if(!seen[b.key]&&!S.bad[b.key]&&!ltLookup(S,b.key)&&!S.pend[b.key]){seen[b.key]=1;need.push(b);}});if(!need.length)return;need=need.slice(0,16);
 need.forEach(function(b){S.pend[b.key]=1;});S.busy=true;ltSt2('Translating…','');
 ltTr(need.map(function(b){return b.t.slice(0,690);}),from,to).then(function(o){if(S.pair!==from+'>'+to)return;need.forEach(function(b,i){delete S.pend[b.key];if(o[i]&&ltKey(o[i])!==b.key){S.tr[b.key]=o[i];S.keys.push(b.key);}else S.bad[b.key]=1;});if(S.keys.length>400){S.keys.splice(0,200).forEach(function(k){delete S.tr[k];});}
   ltDraw(S);ltSideList(S);ltSt2('');var n=$$('ltvia');if(n)n.textContent=ltViaNote();},
  function(e){need.forEach(function(b){delete S.pend[b.key];});S.errUntil=Date.now()+12000;ltSt2(ltErr(e.code),'bad');}).then(function(){S.busy=false;});}
/* ---- the Chinese reader. A text finder and a reader that run in the background on this device (free, nothing is sent anywhere).
   They are far more accurate than the general reader on video: big lesson text, small subtitles and text over pictures. The worker's code is below; the files it loads are public and cached by the browser after the first time (about 27 MB) ---- */
function ltPPWorker(){
 var ort=null,det=null,rec=null,chars=null,cfg=null;
 function say(m){postMessage(m);}
 async function grab(url,label,lo,hi){
  var r=await fetch(url);if(!r.ok)throw new Error('http '+r.status);var tot=+r.headers.get('content-length')||0,rd=r.body&&r.body.getReader();
  if(!rd){var b=await r.arrayBuffer();say({t:'prog',p:hi});return b;}
  var parts=[],got=0;for(;;){var x=await rd.read();if(x.done)break;parts.push(x.value);got+=x.value.length;if(tot)say({t:'prog',p:lo+(hi-lo)*Math.min(1,got/tot)});}
  var out=new Uint8Array(got),o=0;parts.forEach(function(p){out.set(p,o);o+=p.length;});return out.buffer;}
 async function load(c){cfg=c;
  ort=await import(c.ort);ort.env.wasm.wasmPaths=c.wasm;ort.env.wasm.numThreads=1;ort.env.wasm.proxy=false;ort.env.logLevel='error';
  var d=await grab(c.det,'det',0,30),r=await grab(c.rec,'rec',30,90),k=await (await fetch(c.keys)).text();
  chars=['']; k.split('\n').forEach(function(x){if(x!=='')chars.push(x.replace(/\r$/,''));}); chars.push(' ');
  var o={executionProviders:['wasm'],graphOptimizationLevel:'all'};
  det=await ort.InferenceSession.create(new Uint8Array(d),o);say({t:'prog',p:95});rec=await ort.InferenceSession.create(new Uint8Array(r),o);}
 /* pixels (RGBA) of the rectangle [x0,x1) x [y0,y1) shrunk or stretched to dw x dh. Shrinking averages the covered pixels so thin strokes survive */
 function resize(src,sw,sh,x0,y0,x1,y1,dw,dh){var out=new Float32Array(dw*dh*3),cw=x1-x0,ch=y1-y0,fx=cw/dw,fy=ch/dh,x,y,i,j,k=0;
  for(y=0;y<dh;y++){var ya=y0+y*fy,yb=ya+fy,ys=Math.max(0,Math.floor(ya)),ye=Math.min(sh-1,Math.max(ys,Math.ceil(yb)-1));
   for(x=0;x<dw;x++){var xa=x0+x*fx,xb=xa+fx,xs=Math.max(0,Math.floor(xa)),xe=Math.min(sw-1,Math.max(xs,Math.ceil(xb)-1)),r=0,g=0,b=0,n=0;
    if(fx<=1&&fy<=1){var sx=Math.min(sw-1,Math.max(0,x0+(x+0.5)*fx-0.5)),sy=Math.min(sh-1,Math.max(0,y0+(y+0.5)*fy-0.5)),ix=sx|0,iy=sy|0,jx=Math.min(sw-1,ix+1),jy=Math.min(sh-1,iy+1),ax=sx-ix,ay=sy-iy,p00=(iy*sw+ix)*4,p10=(iy*sw+jx)*4,p01=(jy*sw+ix)*4,p11=(jy*sw+jx)*4;
     r=(src[p00]*(1-ax)+src[p10]*ax)*(1-ay)+(src[p01]*(1-ax)+src[p11]*ax)*ay;g=(src[p00+1]*(1-ax)+src[p10+1]*ax)*(1-ay)+(src[p01+1]*(1-ax)+src[p11+1]*ax)*ay;b=(src[p00+2]*(1-ax)+src[p10+2]*ax)*(1-ay)+(src[p01+2]*(1-ax)+src[p11+2]*ax)*ay;n=1;}
    else{for(j=ys;j<=ye;j++)for(i=xs;i<=xe;i++){var q=(j*sw+i)*4;r+=src[q];g+=src[q+1];b+=src[q+2];n++;}}
    out[k++]=r/n;out[k++]=g/n;out[k++]=b/n;}}
  return out;}
 /* the text finder: gives the places where writing is, as rectangles in the picture's own pixels */
 async function find(src,W,H,lim){var ms=Math.max(W,H),ra=ms>lim?lim/ms:1,nw=Math.max(32,Math.round(W*ra/32)*32),nh=Math.max(32,Math.round(H*ra/32)*32),px=resize(src,W,H,0,0,W,H,nw,nh),N=nw*nh,t=new Float32Array(3*N),i;
  var mean=[0.485,0.456,0.406],std=[0.229,0.224,0.225];
  for(i=0;i<N;i++){var r=px[i*3],g=px[i*3+1],b=px[i*3+2];t[i]=(b/255-mean[0])/std[0];t[N+i]=(g/255-mean[1])/std[1];t[2*N+i]=(r/255-mean[2])/std[2];}
  var o=await det.run({x:new ort.Tensor('float32',t,[1,3,nh,nw])}),p=o[det.outputNames[0]].data,lab=new Int32Array(N),st=new Int32Array(N),boxes=[],cur=0;
  for(i=0;i<N;i++){if(p[i]<=0.3||lab[i])continue;cur++;var sp=0,x0=nw,y0=nh,x1=0,y1=0,cnt=0,sum=0;st[sp++]=i;lab[i]=cur;
   while(sp){var q=st[--sp],qx=q%nw,qy=(q/nw)|0;cnt++;sum+=p[q];if(qx<x0)x0=qx;if(qx>x1)x1=qx;if(qy<y0)y0=qy;if(qy>y1)y1=qy;
    for(var dy=-1;dy<=1;dy++){var yy=qy+dy;if(yy<0||yy>=nh)continue;for(var dx=-1;dx<=1;dx++){var xx=qx+dx;if(xx<0||xx>=nw)continue;var nb=yy*nw+xx;if(!lab[nb]&&p[nb]>0.3){lab[nb]=cur;st[sp++]=nb;}}}}
   var bw=x1-x0+1,bh=y1-y0+1;if(bw<3||bh<3||cnt<12||sum/cnt<cfg.box)continue;
   var d=bw*bh*1.5/(2*(bw+bh));boxes.push({x0:Math.max(0,(x0-d)/nw*W),y0:Math.max(0,(y0-d)/nh*H),x1:Math.min(W,(x1+1+d)/nw*W),y1:Math.min(H,(y1+1+d)/nh*H),sc:sum/cnt});}
  return boxes;}
 /* the reader: one line of writing to its words */
 async function readLine(src,W,H,b){var bw=b.x1-b.x0,bh=b.y1-b.y0;if(bw<6||bh<6)return null;var dh=48,dw=Math.max(16,Math.min(2400,Math.round(dh*bw/bh)));
  var px=resize(src,W,H,b.x0,b.y0,b.x1,b.y1,dw,dh),N=dw*dh,t=new Float32Array(3*N),i;
  for(i=0;i<N;i++){t[i]=(px[i*3+2]/255-0.5)/0.5;t[N+i]=(px[i*3+1]/255-0.5)/0.5;t[2*N+i]=(px[i*3]/255-0.5)/0.5;}
  var o=await rec.run({x:new ort.Tensor('float32',t,[1,3,dh,dw])}),out=o[rec.outputNames[0]],T=out.dims[1],C=out.dims[2],d=out.data,prev=0,txt='',sc=0,n=0;
  for(var s=0;s<T;s++){var best=0,bv=-1,off=s*C;for(var c=0;c<C;c++){if(d[off+c]>bv){bv=d[off+c];best=c;}}
   if(best!==0&&best!==prev){txt+=chars[best]||'';sc+=bv;n++;}prev=best;}
  return {text:txt,conf:n?sc/n:0};}
 async function run(m){var src=new Uint8ClampedArray(m.buf),W=m.w,H=m.h,t0=performance.now(),bx=await find(src,W,H,m.lim||1280),t1=performance.now(),res=[];
  bx.sort(function(a,b){return (b.x1-b.x0)*(b.y1-b.y0)-(a.x1-a.x0)*(a.y1-a.y0);});bx=bx.slice(0,m.max||22);
  for(var i=0;i<bx.length;i++){var b=bx[i];if((b.y1-b.y0)>2.5*(b.x1-b.x0))continue;var r=await readLine(src,W,H,b);if(r&&r.text.trim())res.push({text:r.text,confidence:r.conf*100,bbox:{x0:b.x0,y0:b.y0,x1:b.x1,y1:b.y1}});}
  return {lines:res,ms:[Math.round(t1-t0),Math.round(performance.now()-t1)],boxes:bx.length};}
 onmessage=async function(e){var m=e.data;try{
  if(m.t==='load'){await load(m.cfg);say({t:'ready'});}
  else if(m.t==='run'){var r=await run(m);say({t:'done',id:m.id,lines:r.lines,ms:r.ms,boxes:r.boxes});}
 }catch(err){say({t:'err',id:m.id,e:String(err&&err.message||err)});}};
}
var LTPPB=['https://cdn.jsdelivr.net/npm/','https://unpkg.com/'];
function ltPPLoad(S,onprog){
 function tryBase(i){if(i>=LTPPB.length)return Promise.reject(new Error('reader'));
  var o=LTPPB[i]+'onnxruntime-web@1.20.1/dist/',m=LTPPB[i]+'@gutenye/ocr-models@1.4.2/assets/';
  return new Promise(function(res,rej){var w;try{w=new Worker(URL.createObjectURL(new Blob(['('+ltPPWorker.toString()+')()'],{type:'text/javascript'})),{type:'module'});}catch(e){return rej(e);}
   var P={w:w,q:{},n:0,ready:false};
   w.onmessage=function(e){var d=e.data;if(d.t==='ready'){P.ready=true;res(P);}else if(d.t==='prog'){if(onprog)onprog(Math.round(d.p));}
    else if(d.t==='err'&&!d.id){try{w.terminate();}catch(x){}rej(new Error(d.e));}
    else if(d.id&&P.q[d.id]){var q=P.q[d.id];delete P.q[d.id];clearTimeout(q.tm);d.t==='err'?q.rej(new Error(d.e)):q.res(d);}};
   w.onerror=function(){if(!P.ready){try{w.terminate();}catch(x){}rej(new Error('reader'));}};
   w.postMessage({t:'load',cfg:{ort:o+'ort.wasm.min.mjs',wasm:o,det:m+'ch_PP-OCRv4_det_infer.onnx',rec:m+'ch_PP-OCRv4_rec_infer.onnx',keys:m+'ppocr_keys_v1.txt',box:0.55}});
  }).catch(function(){return tryBase(i+1);});}
 return tryBase(0).then(function(P){S.pp=P;return P;});}
function ltPPRun(S,img,w,h){var P=S.pp;if(!P)return Promise.reject(new Error('reader'));
 return new Promise(function(res,rej){var id=++P.n,b=img.slice();P.q[id]={res:res,rej:rej,tm:setTimeout(function(){delete P.q[id];rej(new Error('slow'));},40000)};P.w.postMessage({t:'run',id:id,buf:b.buffer,w:w,h:h,lim:1280,max:22},[b.buffer]);});}
function ltPPStop(S){var P=S&&S.pp;if(!P)return;S.pp=null;try{P.w.terminate();}catch(e){}Object.keys(P.q).forEach(function(k){clearTimeout(P.q[k].tm);try{P.q[k].rej(new Error('stopped'));}catch(e){}});}
async function ltReadPP(S,img,w,h,lang){var r=await ltPPRun(S,img,w,h);if(LT.scr!==S)return null;var cand=[],done=[],seen=0;
 (r.lines||[]).forEach(function(l){if(l.confidence>=40)seen++;if(l.confidence>=90)done.push(l.bbox);var k=ltLineOk(l,lang,62);if(k)cand.push(k);});
 return {cand:cand,done:done,seen:seen};}
async function ltOcrLoad(S,code){S.ready=false;if(S.worker){try{await S.worker.terminate();}catch(e){}S.worker=null;}ltPPStop(S);
 if(code==='chi_sim'){ltSt2('Loading the Chinese reader… the first time it downloads about 27 MB.','');
  try{await ltPPLoad(S,function(p){if(LT.scr===S)ltSt2('Downloading the Chinese reader… '+p+'%','');});
   if(LT.scr!==S){ltPPStop(S);return;}S.code=code;S.ready=true;ltSt2('');return;}
  catch(e){ltPPStop(S);console.warn('the Chinese reader could not be loaded, using the general reader instead',e);}}
 ltSt2('Loading the text reader for '+ltL(LT.from)[1]+'… the first time can take a little while.','');
 await need('tesseract');
 var w=await Tesseract.createWorker(code,1,{langPath:'https://cdn.jsdelivr.net/npm/@tesseract.js-data/'+code+'/4.0.0_best_int',logger:function(m){if(LT.scr===S&&m&&/traineddata/.test(m.status||'')&&m.progress>0&&m.progress<1)ltSt2('Downloading the '+ltL(LT.from)[1]+' reading data… '+Math.round(m.progress*100)+'%','');}});
 if(LT.scr!==S){try{await w.terminate();}catch(e){}return;}
 try{await w.setParameters({tessedit_pageseg_mode:'11'});}catch(e){}
 S.worker=w;S.code=code;S.ready=true;ltSt2('');}
var LTSG=null;
/* a tiny grey copy of the picture (64 by 36), to notice when something on the screen changed */
function ltSig(cx,w,h){var s=LTSG||(LTSG=document.createElement('canvas'));s.width=64;s.height=36;var x=s.getContext('2d',{willReadFrequently:true});x.drawImage(cx.canvas,0,0,64,36);var d=x.getImageData(0,0,64,36).data,o=new Float32Array(64*36);for(var i=0;i<o.length;i++)o[i]=(d[i*4]*0.3+d[i*4+1]*0.59+d[i*4+2]*0.11);return o;}
/* how much the picture changed: the average change, or the change inside any one small tile (a new subtitle line changes one tile a lot while the average barely moves). Above 2 counts as changed */
function ltSigDiff(a,b){if(!a||!b)return 99;var t=0,tl=new Float32Array(48),x,y,m=0;
 for(y=0;y<36;y++)for(x=0;x<64;x++){var d=Math.abs(a[y*64+x]-b[y*64+x]);t+=d;tl[((y/6)|0)*8+(x>>3)]+=d;}
 for(x=0;x<48;x++)if(tl[x]>m)m=tl[x];return Math.max(t/2304,m/48*0.4);}
/* a small coloured strip on this page (see the "Eve is reading a shared screen" badge): if it shows up in the shared picture, the picture contains Eve herself */
function ltBeacon(img,w,h){var best=null;
 for(var y=0;y<h;y+=2){var o=y*w*4,cur=0,len=0,gap=9,alt=0,cs=-1,ce=-1,rs=0;
  for(var x=0;x<=w;x++){var c=0;if(x<w){var i=o+x*4,r=img[i],g=img[i+1],b=img[i+2];c=(b>190&&r>190&&g<90)?1:(b>190&&g>190&&r<90)?2:0;}
   if(c&&c===cur){len++;gap=0;ce=x;continue;}
   if(c){if(cur&&len>=2&&gap<=2){alt++;if(alt===1)cs=rs;}else{alt=0;cs=-1;}cur=c;len=1;gap=0;rs=x;ce=x;continue;}
   if(x===w||++gap>2){if(alt>=5&&len>=2){var f=ltBeaconAt(img,w,y,cs,ce);if(!best||f.w>best.w)best=f;}cur=0;len=0;alt=0;cs=-1;}}}
 return best;}
function ltBeaconAt(img,w,y,cs,ce){var xm=cs+2,t=y;while(t>0){var i=((t-1)*w+xm)*4,r=img[i],g=img[i+1],b=img[i+2];if(b>190&&((r>190&&g<90)||(g>190&&r<90)))t--;else break;}
 return {x:cs,w:ce-cs+1,y:t};}
/* where this page sits inside the shared picture (worked out from where the strip appears), so it can be left out */
function ltSelfRect(bc,w,h){var e=$$('ltbc');if(!e)return null;var r=e.getBoundingClientRect();if(!r.width)return null;var sc=bc.w/64;if(sc<0.3||sc>8)return null;
 var m=6*sc,x=Math.max(0,bc.x-r.left*sc-m),y=Math.max(0,bc.y-r.top*sc-m),x2=Math.min(w,bc.x-r.left*sc+window.innerWidth*sc+m),y2=Math.min(h,bc.y-r.top*sc+window.innerHeight*sc+m);
 if(x2<=x||y2<=y)return null;return {x:x,y:y,w:x2-x,h:y2-y,f:(x2-x)*(y2-y)/(w*h)};}
/* the preview: the live picture normally; the last good picture (or the picture with this page blanked out) when the shared picture contains Eve herself */
function ltFreeze(S,on,msg){var pv=$$('ltpv');if(!!S.frozen!==on){S.frozen=on;
  if(on&&pv){var g=S.gd;if(g&&g.width){pv.width=g.width;pv.height=g.height;pv.getContext('2d').drawImage(g,0,0);}else{pv.width=16;pv.height=9;var q=pv.getContext('2d');q.fillStyle='#000';q.fillRect(0,0,16,9);}}}
 if(msg!==undefined)ltScrMsg(S,msg,'');ltPv(S);}
function ltPv(S){var pv=$$('ltpv');if(pv)pv.style.display=(S.frozen||S.mask)?'block':'none';}
function ltPvMask(S,cv){var pv=$$('ltpv'),m=S.mask;if(!pv||!m)return;pv.width=cv.width;pv.height=cv.height;var q=pv.getContext('2d');q.drawImage(cv,0,0);
 q.fillStyle='#2b2b30';q.fillRect(m.x,m.y,m.w,m.h);q.fillStyle='#fff';q.font='600 '+Math.max(12,Math.min(28,m.h/12))+'px Inter,system-ui,sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText('This page (hidden from the reader)',m.x+m.w/2,m.y+m.h/2);}
/* frames from the shared screen: read straight from the stream when the browser can (works even while this tab is in the background), else from the preview video */
function ltPump(S){if(typeof MediaStreamTrackProcessor==='undefined')return;
 try{var rd=new MediaStreamTrackProcessor({track:S.stream.getVideoTracks()[0]}).readable.getReader();S.rd=rd;
  (async function(){try{while(LT.scr===S){var r=await rd.read();if(r.done)break;if(S.vf){try{S.vf.close();}catch(e){}}S.vf=r.value;}}catch(e){}})();}catch(e){S.rd=null;}}
/* The text reader is best with letters about 25 to 60 pixels tall. On a screen they can be much bigger (a lesson slide) or much smaller (a subtitle in a small video), so the picture is read at a few sizes and the best reading of each spot is kept.
   Gives the believable lines, the places the reader was sure about, and how many text lines were seen at all. */
var LTDOWN=[0.5,0.3];
async function ltRead(S,cv,w,h,lang){var cand=[],done=[],seen=0;
 async function pass(src,sc){var r=await S.worker.recognize(src,{},{blocks:true});if(LT.scr!==S)return false;
  (r.data.lines||[]).forEach(function(l){if(!l.bbox||!String(l.text||'').trim())return;
   var m={text:l.text,confidence:l.confidence,bbox:{x0:l.bbox.x0/sc,x1:l.bbox.x1/sc,y0:l.bbox.y0/sc,y1:l.bbox.y1/sc}};
   if(l.confidence>=30)seen++;if(l.confidence>=75)done.push(m.bbox);
   var k=ltLineOk(m,lang);if(k)cand.push(k);});return true;}
 if(!await pass(cv,1))return null;
 var rc=S.rc||(S.rc=document.createElement('canvas')),rx=rc.getContext('2d'),i;
 function scaled(s){rc.width=Math.round(w*s);rc.height=Math.round(h*s);rx.imageSmoothingQuality='high';rx.drawImage(cv,0,0,rc.width,rc.height);return rc.width/w;}
 for(i=0;i<LTDOWN.length;i++){if(w*LTDOWN[i]<300||h*LTDOWN[i]<170)continue;if(!await pass(rc,scaled(LTDOWN[i])))return null;}
 /* small print, or nothing readable yet: look again, bigger (on a screen with nothing on it this is done only every other time) */
 var minH=cand.length?Math.min.apply(null,cand.map(function(c){return c.y1-c.y0;})):0,f=Math.min(2,Math.sqrt(6000000/(w*h)));
 if((!cand.length||minH<30)&&f>=1.3&&(cand.length||(S.empty||0)<3||(S.empty&1))){if(!await pass(rc,scaled(f)))return null;}
 return {cand:cand,done:done,seen:seen};}
async function ltScrLoop(S){var cv=document.createElement('canvas'),mc=document.createElement('canvas'),cx=cv.getContext('2d',{willReadFrequently:true}),idle=0;
 while(LT.scr===S){
  try{
   var src=null,sw=0,sh=0,vf=S.vf;
   if(vf&&vf.displayWidth>1){src=vf;sw=vf.displayWidth;sh=vf.displayHeight;}
   else{var v=$$('ltv');if(v&&v.videoWidth>1&&v.readyState>=2){src=v;sw=v.videoWidth;sh=v.videoHeight;}}
   if(!src){await ltWait(250);continue;}
   var lang=LT.from,code=ltL(lang)[3],pair=lang+'>'+LT.to;
   if(S.code!==code){S.blocks=[];S.sig=null;S.tr={};S.keys=[];S.pend={};S.bad={};S.lsig='';S.hist=[];ltDraw(S);ltSideList(S);await ltOcrLoad(S,code);if(LT.scr!==S)return;}
   if(S.pair!==pair){S.pair=pair;S.tr={};S.keys=[];S.pend={};S.bad={};S.lsig='';S.hist=[];S.sig=null;ltDraw(S);ltSideList(S);if(ltDevCan())ltDevGet(LT.from,LT.to);}
   /* the browser only sends a new picture when something on the screen moves; when it has not, there is nothing to draw or compare */
   var still=!!(vf&&vf===S.lastVf&&S.sig&&!S.frozen&&!S.mask&&cv.width>1),img=null,sig=null,ch=false;
   if(!still){
    var sc=Math.min(1,1920/sw),nw=Math.round(sw*sc),nh=Math.round(sh*sc);if(cv.width!==nw||cv.height!==nh){cv.width=nw;cv.height=nh;}cx.drawImage(src,0,0,nw,nh);S.lastVf=vf||null;
    /* does this picture contain Eve herself? (only possible when a whole window or screen is shared, not another tab) */
    if(S.surface!=='browser'){
     img=cx.getImageData(0,0,nw,nh).data;var bc=ltBeacon(img,nw,nh),rc=bc?ltSelfRect(bc,nw,nh):null;
     if(bc){if(!rc||rc.f>0.7){S.selfN=2;S.mask=null;ltFreeze(S,true,'The shared picture shows Eve herself, so it is paused. Go back to the tab or window you are translating and Eve carries on.'+(ltPipCan()?' To read the translation while you watch, press Float translation.':' To read the translation while you watch, open this page in its own window beside it.'));await ltWait(300);continue;}
      S.mask=rc;S.maskN=3;S.selfN=0;}
     else{if(S.selfN>0)S.selfN--;if(S.mask&&--S.maskN<=0){S.mask=null;S.sig=null;}}
     if(S.frozen){if(S.selfN>0||Date.now()<S.hold){await ltWait(250);continue;}ltFreeze(S,false,'');S.sig=null;}
     /* leave this page out of what is read, and out of the preview */
     if(S.mask){cx.fillStyle='#808080';cx.fillRect(S.mask.x,S.mask.y,S.mask.w,S.mask.h);img=null;ltPvMask(S,cv);}
    }
    sig=ltSig(cx,nw,nh);ch=ltSigDiff(S.sig,sig)>2;
   }
   var w=cv.width,h=cv.height;
   ltPv(S);
   /* a screen with no text is looked at again now and then, less and less often */
   if(ch||(!S.blocks.length&&idle>Math.min(40,6+(S.empty||0)*4))){var t0=Date.now();if(sig)S.sig=sig;idle=0;
    if(!img)img=cx.getImageData(0,0,w,h).data;
    var g=S.gd;if(g.width!==w||g.height!==h){g.width=w;g.height=h;}g.getContext('2d').drawImage(cv,0,0);
    ltScrMsg(S,S.blocks.length?'':'Reading your screen…');
    var rd=S.pp?await ltReadPP(S,img,w,h,lang):await ltRead(S,cv,w,h,lang);if(!rd||LT.scr!==S)return;
    var cand=rd.cand,mk=S.pp?null:ltMask(img,w,h,mc,rd.done);
    if(mk){var r2=await S.worker.recognize(mk.c,{},{blocks:true});if(LT.scr!==S)return;cand=cand.concat((r2.data.lines||[]).map(function(l){return ltLineOk(ltShift(l,mk.oy),lang);}).filter(Boolean));}
    if(lang!==LT.from)continue;
    S.w=w;S.h=h;S.blocks=ltBlocks(ltPick(cand),img,w,h);
    /* when the same text keeps coming back (a video playing behind fixed subtitles), look less often */
    var ks=S.blocks.map(function(b){return b.key;}).join('|');if(S.ksig&&(ks===S.ksig||ltDice(ks,S.ksig)>=0.85))S.same=Math.min(4,S.same+1);else{S.ksig=ks;S.same=0;}
    ltDraw(S);ltSideList(S);
    if(!S.blocks.length){S.empty=(S.empty||0)+1;ltScrMsg(S,rd.seen?'Eve can see writing on this screen, but none of it looks like '+ltL(lang)[1]+'. Make sure the “From” language is the one on the screen.':'No '+ltL(lang)[1]+' text found on this screen yet. It will appear here as soon as some shows up.','warn');}else{S.empty=0;ltScrMsg(S,'');}
    ltTrNeed(S);S.ms=Date.now()-t0;
    await ltWait(Math.max(150,Math.min(1500,S.ms*0.5))+Math.min(2000,(S.empty||0)*300)+S.same*300);
   }else{idle++;ltTrNeed(S);await ltWait(S.frozen||S.mask?250:(S.surface==='browser'?700:500));}
  }catch(e){if(LT.scr!==S)return;console.warn('screen translation step failed:',e);ltScrMsg(S,'Something went wrong while reading the screen. Trying again…','warn');await ltWait(1500);}
 }}
function ltScrUI(){var b=$$('ltsh'),vw=$$('ltvw'),pl=$$('ltpill');if(!b)return;var on=!!LT.scr;b.classList.toggle('rec',on);b.innerHTML=on?ico('stop',18,2.2)+'Stop sharing':ico('screen',18,2.2)+'Share a screen or window';if(vw)vw.style.display=on?'block':'none';if(pl)pl.style.display=on?'flex':'none';}
async function ltScrStart(){if(LT.scr){ltScrStop('');return;}
 if(!(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia)){ltSt2('Your browser cannot share the screen. Please use Chrome, Edge or Firefox on a computer.','warn');return;}
 ltSt2('');ltDevReset();ltDevGet(LT.from,LT.to,function(p){if(LT.scr)ltSt2('Getting the translator ready on this device… '+p+'%','');}).then(function(){var e=$$('ltst2');if(e&&/Getting the translator/.test(e.textContent))ltSt2('');});
 var stream;try{stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:5,max:10}},audio:false,selfBrowserSurface:'exclude'});}
 catch(e){ltSt2(e&&e.name==='NotAllowedError'?'Screen sharing was cancelled. Press Share a screen or window and choose what to share.':'Screen sharing could not start in this browser.','warn');return;}
 var S=LT.scr={stream:stream,worker:null,code:'',pair:'',sig:null,blocks:[],tr:{},keys:[],pend:{},bad:{},busy:false,errUntil:0,w:0,h:0,lsig:'',ready:false,gd:document.createElement('canvas'),frozen:false,mask:null,selfN:0,maskN:0,hold:0,surface:'',vf:null,rd:null,ms:0,empty:0,lastVf:null,same:0,ksig:''};
 var vt=stream.getVideoTracks()[0];vt.addEventListener('ended',function(){if(LT.scr===S)ltScrStop('Screen sharing ended.');});
 var ds='';try{ds=(vt.getSettings()||{}).displaySurface||'';}catch(e){}S.surface=ds;ltPump(S);
 /* coming back to this tab: if a whole window or screen is shared it may now show this page, so hold the last good picture for a moment */
 S.vis=function(){if(LT.scr===S&&document.visibilityState==='visible'&&S.surface!=='browser'&&S.gd.width){S.hold=Date.now()+800;ltFreeze(S,true);}};
 document.addEventListener('visibilitychange',S.vis);
 ltScrUI();var v=$$('ltv');v.srcObject=stream;try{await v.play();}catch(e){}
 if(LT.scr!==S)return;if(vt.readyState==='ended'){ltScrStop('Screen sharing ended.');return;}
 try{await ltOcrLoad(S,ltL(LT.from)[3]);}catch(e){if(LT.scr===S){ltScrStop('');ltSt2('The text reader could not be loaded. Please check your internet connection and try again.','bad');}return;}
 if(LT.scr===S)ltScrLoop(S);}
function ltScrStop(msg){var S=LT.scr;LT.scr=null;if(S){if(S.hist)LT.hist=S.hist;try{S.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}try{if(S.worker)S.worker.terminate();}catch(e){}try{ltPPStop(S);}catch(e){}try{document.removeEventListener('visibilitychange',S.vis);}catch(e){}try{if(S.rd)S.rd.cancel();}catch(e){}try{if(S.vf)S.vf.close();}catch(e){}}
 var v=$$('ltv');if(v){try{v.srcObject=null;}catch(e){}}var pv=$$('ltpv');if(pv)pv.style.display='none';var c=$$('ltov');if(c){try{c.getContext('2d').clearRect(0,0,c.width,c.height);}catch(e){}}ltScrUI();if(msg!==undefined)ltSt2(msg,'');ltPipRender();}
/* ---- a small window that stays on top of everything (Chrome and Edge), so the translation can be read while watching the video ---- */
var LTP=null;
function ltPipCan(){return !!(window.documentPictureInPicture&&documentPictureInPicture.requestWindow);}
function ltPipUI(){var b=$$('ltpip');if(b)b.textContent=LTP?'Close floating window':'Float translation';}
function ltPipRender(){if(!LTP)return;try{var d=LTP.document,el=d.getElementById('ltpl');if(!el)return;var src=$$(LT.mode==='speak'?'ltlist':'ltsl');var near=el.scrollHeight-el.scrollTop-el.clientHeight<60||!el.getAttribute('data-r');el.setAttribute('data-r','1');
 el.innerHTML=src?src.innerHTML:'';if(near)el.scrollTop=el.scrollHeight;}catch(e){}}
async function ltPip(){if(LTP){try{LTP.close();}catch(e){}LTP=null;ltPipUI();return;}
 var w;try{w=await documentPictureInPicture.requestWindow({width:460,height:300});}catch(e){var m=LT.mode==='speak'?'ltst':'ltst2';(LT.mode==='speak'?ltSt:ltSt2)('The floating window could not be opened in this browser.','warn');return;}
 LTP=w;var d=w.document;
 try{Array.prototype.forEach.call(document.styleSheets,function(ss){try{var css='';Array.prototype.forEach.call(ss.cssRules,function(r){css+=r.cssText+'\n';});var st=d.createElement('style');st.textContent=css;d.head.appendChild(st);}catch(e){if(ss.href){var l=d.createElement('link');l.rel='stylesheet';l.href=ss.href;d.head.appendChild(l);}}});}catch(e){}
 try{d.documentElement.className=document.documentElement.className;var th=document.documentElement.getAttribute('data-theme');if(th)d.documentElement.setAttribute('data-theme',th);}catch(e){}
 d.body.style.cssText='margin:0;padding:10px;background:var(--bg,#000);color:var(--ink,#fff);font-family:Inter,system-ui,sans-serif';
 d.body.innerHTML='<div class="lt-log lt-pl" id="ltpl" role="log" aria-live="polite" style="max-height:none;height:calc(100vh - 20px);margin:0"></div>';
 w.addEventListener('pagehide',function(){if(LTP===w){LTP=null;ltPipUI();}});
 ltPipUI();ltPipRender();}
function ltStop(){if(LT.listening||LT.rec)ltMicStop();if(LT.scr)ltScrStop();try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}if(LTP){try{LTP.close();}catch(e){}LTP=null;}if(LTW){try{LTW.terminate();}catch(e){}LTW=null;LTWM={};}}
/* ---- the page ---- */
function ltPane(){var sp=LT.mode==='speak',mob=ltPhone();
 var dev=ltDevCan()?'<label class="qck"><input type="checkbox" id="ltdev"'+(LT.dev?' checked':'')+'> Translate on this device when possible (private, nothing is sent)</label>':'';
 if(sp)return '<div class="dl-cta lt-cta"><button class="btn pri dl-big" id="ltmic" type="button" aria-pressed="false"></button><button class="btn" id="ltclr" type="button">Clear</button><button class="btn" id="ltcp" type="button">Copy translation</button>'+(ltPipCan()?'<button class="btn" id="ltpip" type="button">Float translation</button>':'')+'</div>'+
  '<label class="qck"><input type="checkbox" id="ltsay"'+(LT.say?' checked':'')+'> Read the translation out loud (use headphones so the microphone does not hear it)</label>'+dev+
  '<div id="ltst" role="status" aria-live="polite"></div><div class="lt-log" id="ltlist" role="log" aria-live="polite"></div><p class="hint lt-via" id="ltvia"></p>';
 return '<p class="hint lt-in">Share a browser tab, a window or a screen. Choose the language that is <b>on the screen</b> in the From box: only text in that language is read and translated. A browser tab works best.</p>'+
  '<div class="dl-cta lt-cta"><button class="btn pri dl-big" id="ltsh" type="button"></button><button class="btn" id="ltcp2" type="button">Copy translation</button>'+(ltPipCan()?'<button class="btn" id="ltpip" type="button">Float translation</button>':'')+'</div>'+
  '<label class="qck"><input type="checkbox" id="ltover"'+(LT.over?' checked':'')+'> Show the translation over the picture</label>'+dev+
  '<div id="ltst2" role="status" aria-live="polite">'+(mob?'<div class="msg warn"><span class="dotk"></span><span>Screen sharing is not available in phone browsers. Please open this page in Chrome, Edge or Firefox on a computer.</span></div>':'')+'</div>'+
  '<div class="lt-vw" id="ltvw" style="display:none"><video id="ltv" muted playsinline></video><canvas id="ltpv" class="lt-pv" aria-hidden="true"></canvas><canvas id="ltov" aria-hidden="true"></canvas></div>'+
  '<div class="lt-log lt-sl" id="ltsl" aria-live="off"></div><p class="hint lt-via" id="ltvia"></p>';}
function ltBind(){var sp=LT.mode==='speak';
 var dv=$$('ltdev');if(dv)dv.onchange=function(){LT.dev=this.checked;LT.itr='';LTD={};LTDR={};LTDM={};};
 var pp=$$('ltpip');if(pp){pp.onclick=ltPip;ltPipUI();}ltPipRender();
 if(sp){$$('ltmic').onclick=ltMic;ltMicUI();ltListRender();
  $$('ltclr').onclick=function(){LT.lines=[];LT.interim='';LT.itr='';ltListRender();ltSt('');};
  $$('ltcp').onclick=function(){var t=LT.lines.filter(function(l){return l.t;}).map(function(l){return l.t;}).join('\n');if(!t){ltFlash('ltcp','Nothing yet');return;}ltCopyText(t).then(function(){ltFlash('ltcp','Copied');},function(){ltFlash('ltcp','Could not copy');});};
  $$('ltsay').onchange=function(){LT.say=this.checked;if(!this.checked){try{speechSynthesis.cancel();}catch(e){}}};
  if(!ltSR()&&!(ltCanRec()&&String(CFG.aiApi||'')))ltSt('This browser cannot listen to the microphone. Please use Chrome, Edge or Safari.','warn');}
 else{$$('ltsh').onclick=ltScrStart;ltScrUI();var S=LT.scr;
  $$('ltover').onchange=function(){LT.over=this.checked;ltDraw(LT.scr);};
  $$('ltcp2').onclick=function(){var hs=LT.scr?LT.scr.hist:LT.hist,t=(hs||[]).map(function(e){return e.t;}).join('\n');if(!t){ltFlash('ltcp2','Nothing yet');return;}ltCopyText(t).then(function(){ltFlash('ltcp2','Copied');},function(){ltFlash('ltcp2','Could not copy');});};
  if(!(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia)&&!$$('ltst2').firstChild)ltSt2('Your browser cannot share the screen. Please use Chrome, Edge or Firefox on a computer.','warn');
  if(ltPhone())$$('ltsh').disabled=true;ltSideList({blocks:[],tr:{},keys:[],lsig:''});}}
function ltPhone(){return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||'');}
function ltTabs(){document.querySelectorAll('#lttabs a').forEach(function(b){var on=b.dataset.m===LT.mode;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false');});}
function ltSetMode(m){if(m===LT.mode)return;ltStop();LT.mode=m;$$('ltpane').innerHTML=ltPane();ltTabs();ltBind();}
function translatePage(){nav('translate');
 app.innerHTML='<div class="dl-hd"><div class="ic i12">'+ico('globe',26)+'</div><h1>Live Translate</h1></div>'+
 '<p class="lead dl-lead">Speak and read your words in another language as you talk, or share your screen and see it translated right on the picture.</p>'+
 '<section class="card dl-sec dl-f" id="ltsec"><div class="lt-bar"><label class="qfl" for="ltfrom">From<select class="sel" id="ltfrom">'+ltOpts(LT.from)+'</select></label>'+
 '<button class="btn lt-sw" id="ltswap" type="button" aria-label="Swap the two languages">'+ico('swap',18,2.2)+'</button>'+
 '<label class="qfl" for="ltto">To<select class="sel" id="ltto">'+ltOpts(LT.to)+'</select></label></div>'+
 '<div class="seg lt-tabs" id="lttabs" role="tablist"><a href="javascript:void 0" role="tab" data-m="speak">'+ico('mic',16,2.2)+'Speak</a><a href="javascript:void 0" role="tab" data-m="screen">'+ico('screen',16,2.2)+'Screen</a></div>'+
 '<div id="ltpane">'+ltPane()+'</div></section>'+
 '<p class="dl-note">Translations are automatic, so check anything important. Your screen picture never leaves your device: the text on it is read on your device and only those words are translated. What you say is turned into text by your browser’s own speech service (or, if that cannot be used, short clips of your voice are sent to a speech service), and the words are then translated on your device or sent to be translated.</p>'+
 '<div class="lt-pill" id="ltpill" style="display:none"><span class="lt-bc" id="ltbc" aria-hidden="true"></span><span>Eve is reading a shared screen</span><button class="lt-ps" id="ltpst" type="button">Stop</button></div>';
 $$('ltpst').onclick=function(){ltScrStop('');};
 var chg=function(){LT.from=$$('ltfrom').value;LT.to=$$('ltto').value;LT.itr='';if(LT.mode==='speak'){ltMicRestart();ltSt('');if(LT.listening&&ltDevCan())ltDevGet(LT.from,LT.to);}};
 $$('ltfrom').onchange=$$('ltto').onchange=chg;
 $$('ltswap').onclick=function(){var f=LT.from;LT.from=LT.to;LT.to=f;$$('ltfrom').value=LT.from;$$('ltto').value=LT.to;[$$('ltfrom'),$$('ltto')].forEach(function(s){if(s._cs)s._cs.sync();});LT.itr='';if(LT.mode==='speak'){ltMicRestart();ltSt('');if(LT.listening&&ltDevCan())ltDevGet(LT.from,LT.to);}};
 $$('lttabs').onclick=function(e){var b=e.target.closest?e.target.closest('a'):null;if(b&&b.dataset.m)ltSetMode(b.dataset.m);};
 ltTabs();ltBind();}

/* ---------- QR Code Generator ---------- */
/* QR encoder: qrcode-generator by Kazuhiko Arase, MIT license (https://github.com/kazuhikoarase/qrcode-generator). Bundled so the tool works offline. */
var QRL=(function(){var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1})},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(o*r,n*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}(function(){return qrcode});;return qrcode;})();
QRL.stringToBytes=QRL.stringToBytesFuncs['UTF-8'];
var QKEY='eve-sandbox:qr:v1';
var QS={tab:'link',v:{link:'',text:'',ssid:'',wpw:'',wsec:'WPA',whid:'',eto:'',esub:'',ebody:'',ph:'',smn:'',smm:'',cfn:'',cln:'',corg:'',ctel:'',cem:'',curl:''},
 fg:'#000000',bg:'#ffffff',tr:false,ecl:'M',st:'square',mg:4,px:1024,logo:null,logoUrl:'',res:null};
try{var qraw=localStorage.getItem(QKEY);if(qraw){var qp=JSON.parse(qraw);
 if(qp&&/^#[0-9a-f]{6}$/i.test(qp.fg)&&/^#[0-9a-f]{6}$/i.test(qp.bg)){QS.fg=qp.fg;QS.bg=qp.bg;QS.tr=!!qp.tr;
  if('LMQH'.indexOf(qp.ecl)>=0&&qp.ecl)QS.ecl=qp.ecl;if(['square','rounded','dots'].indexOf(qp.st)>=0)QS.st=qp.st;
  if([0,2,4,6,8].indexOf(qp.mg)>=0)QS.mg=qp.mg;if([512,1024,2048,4096].indexOf(qp.px)>=0)QS.px=qp.px;}}}catch(e){}
function qSave(){try{localStorage.setItem(QKEY,JSON.stringify({fg:QS.fg,bg:QS.bg,tr:QS.tr,ecl:QS.ecl,st:QS.st,mg:QS.mg,px:QS.px}));}catch(e){}}
var QTABS=[['link','Link'],['text','Text'],['wifi','Wi-Fi'],['email','Email'],['phone','Phone'],['sms','SMS'],['card','Contact']];
function qWifiEsc(s){return String(s).replace(/([\\;,:"])/g,'\\$1');}
function qVcEsc(s){return String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([;,])/g,'\\$1');}
function qData(){var v=QS.v,t=QS.tab;
 if(t==='link'){var u=v.link.trim();if(!u)return '';return /^[a-z][a-z0-9+.\-]*:/i.test(u)&&!/^[^\s\/:]+:\d+(\/|$)/.test(u)?u:'https://'+u;}
 if(t==='text')return v.text.trim()?v.text:'';
 if(t==='wifi'){if(!v.ssid.trim())return '';var nop=v.wsec==='nopass';
  return 'WIFI:T:'+v.wsec+';S:'+qWifiEsc(v.ssid)+';'+(nop?'':'P:'+qWifiEsc(v.wpw)+';')+(v.whid?'H:true;':'')+';';}
 if(t==='email'){var to=v.eto.trim();if(!to)return '';var q=[];if(v.esub)q.push('subject='+encodeURIComponent(v.esub));if(v.ebody)q.push('body='+encodeURIComponent(v.ebody));
  return 'mailto:'+to+(q.length?'?'+q.join('&'):'');}
 if(t==='phone'){var n=v.ph.replace(/[^\d+]/g,'');return n?'tel:'+n:'';}
 if(t==='sms'){var n2=v.smn.replace(/[^\d+]/g,'');return n2?'SMSTO:'+n2+':'+v.smm:'';}
 if(t==='card'){var fn=v.cfn.trim(),ln=v.cln.trim();if(!(fn||ln||v.corg.trim()||v.ctel.trim()||v.cem.trim()||v.curl.trim()))return '';
  var L=['BEGIN:VCARD','VERSION:3.0','N:'+qVcEsc(ln)+';'+qVcEsc(fn)+';;;','FN:'+qVcEsc((fn+' '+ln).trim()||v.corg.trim())];
  if(v.corg.trim())L.push('ORG:'+qVcEsc(v.corg.trim()));if(v.ctel.trim())L.push('TEL:'+v.ctel.trim());if(v.cem.trim())L.push('EMAIL:'+v.cem.trim());if(v.curl.trim())L.push('URL:'+v.curl.trim());
  L.push('END:VCARD');return L.join('\n');}
 return '';}
function qBuild(data){var lv=(QS.logo?'H':QS.ecl),q=QRL(0,lv);q.addData(data);q.make();
 var n=q.getModuleCount(),m=[];for(var r=0;r<n;r++){m[r]=[];for(var c=0;c<n;c++)m[r][c]=q.isDark(r,c);}
 var ls=0;if(QS.logo){ls=Math.max(3,Math.floor(n*0.22));if((n-ls)%2)ls++;}
 return {n:n,m:m,lv:lv,ls:ls};}
function qRR(x,y,w,h,r){if(r<=0)return 'M'+x+' '+y+'h'+w+'v'+h+'h-'+w+'z';
 var a='a'+r+' '+r+' 0 0 1 ';
 return 'M'+(x+r)+' '+y+'h'+(w-2*r)+a+r+' '+r+'v'+(h-2*r)+a+'-'+r+' '+r+'h-'+(w-2*r)+a+'-'+r+' -'+r+'v-'+(h-2*r)+a+r+' -'+r+'z';}
function qFind(r,c,n){return (r<7&&c<7)||(r<7&&c>=n-7)||(r>=n-7&&c<7);}
function qPath(res){var n=res.n,m=res.m,mg=QS.mg,st=QS.st,d='',r,c;
 var skip=function(r,c){return res.ls&&r>=(n-res.ls)/2&&r<(n+res.ls)/2&&c>=(n-res.ls)/2&&c<(n+res.ls)/2;};
 if(st==='square'){
  for(r=0;r<n;r++){c=0;while(c<n){if(m[r][c]&&!skip(r,c)){var s=c;while(c<n&&m[r][c]&&!skip(r,c))c++;d+='M'+(s+mg)+' '+(r+mg)+'h'+(c-s)+'v1h-'+(c-s)+'z';}else c++;}}
  return d;}
 var rad=st==='dots'?0.42:0.3;
 for(r=0;r<n;r++)for(c=0;c<n;c++){
  if(!m[r][c]||qFind(r,c,n)||skip(r,c))continue;
  var x=c+mg,y=r+mg;
  if(st==='dots'){var cx=x+0.5,cy=y+0.5;d+='M'+(cx-rad)+' '+cy+'a'+rad+' '+rad+' 0 1 0 '+(rad*2)+' 0a'+rad+' '+rad+' 0 1 0 -'+(rad*2)+' 0z';}
  else d+=qRR(x,y,1,1,rad);}
 [[0,0],[0,n-7],[n-7,0]].forEach(function(p){var x=p[1]+mg,y=p[0]+mg;
  d+=qRR(x,y,7,7,st==='dots'?3.2:2.2)+qRR(x+1,y+1,5,5,st==='dots'?2.2:1.3)+qRR(x+2,y+2,3,3,st==='dots'?1.5:0.9);});
 return d;}
function qLogoBox(res){var mg=QS.mg,o=Math.floor((res.n-res.ls)/2)+mg;return {x:o,y:o,s:res.ls};}
function qCanvas(res,px){var T=res.n+2*QS.mg,cell=Math.max(1,Math.floor(px/T)),W=cell*T,cv=document.createElement('canvas');
 cv.width=cv.height=W;var x=cv.getContext('2d');
 if(!QS.tr){x.fillStyle=QS.bg;x.fillRect(0,0,W,W);}
 x.fillStyle=QS.fg;x.save();x.scale(cell,cell);x.fill(new Path2D(qPath(res)),'evenodd');x.restore();
 if(res.ls&&QS.logo){var b=qLogoBox(res),pad=0.45,iw=QS.logo.naturalWidth||QS.logo.width,ih=QS.logo.naturalHeight||QS.logo.height,inner=b.s-pad*2,k=Math.min(inner/iw,inner/ih),w=iw*k,h=ih*k;
  x.save();x.scale(cell,cell);
  if(QS.tr){x.fillStyle='#ffffff';}else x.fillStyle=QS.bg;
  x.fill(new Path2D(qRR(b.x,b.y,b.s,b.s,0.8)));
  x.drawImage(QS.logo,b.x+(b.s-w)/2,b.y+(b.s-h)/2,w,h);x.restore();}
 return cv;}
function qSvg(res){var T=res.n+2*QS.mg,s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+T+' '+T+'" width="1024" height="1024" shape-rendering="'+(QS.st==='square'?'crispEdges':'geometricPrecision')+'">';
 if(!QS.tr)s+='<rect width="'+T+'" height="'+T+'" fill="'+QS.bg+'"/>';
 s+='<path fill-rule="evenodd" fill="'+QS.fg+'" d="'+qPath(res)+'"/>';
 if(res.ls&&QS.logoUrl){var b=qLogoBox(res),pad=0.45;
  s+='<path fill="'+(QS.tr?'#ffffff':QS.bg)+'" d="'+qRR(b.x,b.y,b.s,b.s,0.8)+'"/><image href="'+QS.logoUrl+'" x="'+(b.x+pad)+'" y="'+(b.y+pad)+'" width="'+(b.s-pad*2)+'" height="'+(b.s-pad*2)+'" preserveAspectRatio="xMidYMid meet"/>';}
 return s+'</svg>';}
function qLum(h){var c=[1,3,5].map(function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
function qContrast(){var a=qLum(QS.fg),b=qLum(QS.bg),hi=Math.max(a,b),lo=Math.min(a,b);return {ratio:(hi+0.05)/(lo+0.05),inverted:a>b};}
var QERR={L:'Low (7%)',M:'Medium (15%)',Q:'Quartile (25%)',H:'High (30%)'};

function qrPage(){nav('qr');
 app.innerHTML='<h1 style="font-size:2.2rem">QR Code Generator</h1><p class="lead" style="font-size:1rem">Make a QR code for a link, text, Wi-Fi, email, phone number or contact card. Everything is made on your device, so nothing you type is uploaded.</p>'+
 '<div class="qrw"><div class="qrl">'+
 '<div class="seg" id="qtabs" style="margin:16px 0 0">'+QTABS.map(function(t){return '<a data-qt="'+t[0]+'" href="javascript:void 0">'+t[1]+'</a>';}).join('')+'</div>'+
 '<div class="card" style="margin-top:12px" id="qf"></div>'+
 '<div class="card" style="margin-top:14px" id="qo"></div></div>'+
 '<div class="qrr"><div class="card qrp" id="qp"></div></div></div>';
 $$('qtabs').onclick=function(e){var t=e.target.dataset.qt;if(!t)return;QS.tab=t;qForm();qUpdate();};
 qPanel();qForm();qOpts();qUpdate();
}
function qField(k,label,o){o=o||{};var id='qi-'+k,val=esc(QS.v[k]);
 if(o.area)return '<label class="qfl" for="'+id+'">'+label+'<textarea id="'+id+'" data-qk="'+k+'" rows="'+(o.rows||4)+'" maxlength="'+(o.max||1200)+'" placeholder="'+esc(o.ph||'')+'">'+val+'</textarea></label>';
 return '<label class="qfl" for="'+id+'">'+label+'<input type="text" id="'+id+'" data-qk="'+k+'" value="'+val+'" maxlength="'+(o.max||300)+'" placeholder="'+esc(o.ph||'')+'"'+(o.im?' inputmode="'+o.im+'"':'')+' autocomplete="off" autocapitalize="off" spellcheck="false"></label>';}
function qForm(){var t=QS.tab,h='';
 document.querySelectorAll('#qtabs a').forEach(function(a){a.classList.toggle('on',a.dataset.qt===t);});
 if(t==='link')h=qField('link','Website link',{ph:'https://example.com',im:'url',max:1000})+'<p class="hint" style="margin:8px 0 0">If you leave out the https://, we add it for you.</p>';
 else if(t==='text')h=qField('text','Your text',{area:1,rows:5,ph:'Type or paste anything',max:1200});
 else if(t==='wifi')h=qField('ssid','Network name',{ph:'MyWiFi',max:60})+qField('wpw','Password',{ph:'Leave empty for an open network',max:80})+
  '<label class="qfl" for="qi-wsec">Security<select class="sel" id="qi-wsec" data-qk="wsec"><option value="WPA"'+(QS.v.wsec==='WPA'?' selected':'')+'>WPA / WPA2 / WPA3</option><option value="WEP"'+(QS.v.wsec==='WEP'?' selected':'')+'>WEP</option><option value="nopass"'+(QS.v.wsec==='nopass'?' selected':'')+'>No password</option></select></label>'+
  '<label class="qck"><input type="checkbox" id="qi-whid" data-qk="whid"'+(QS.v.whid?' checked':'')+'> Hidden network</label>'+
  '<p class="hint" style="margin:8px 0 0">Anyone who scans this code can join your network, so only share it with people you trust.</p>';
 else if(t==='email')h=qField('eto','Send to',{ph:'name@example.com',im:'email',max:200})+qField('esub','Subject (optional)',{max:200})+qField('ebody','Message (optional)',{area:1,rows:3,max:800});
 else if(t==='phone')h=qField('ph','Phone number',{ph:'+91 98765 43210',im:'tel',max:30});
 else if(t==='sms')h=qField('smn','Phone number',{ph:'+91 98765 43210',im:'tel',max:30})+qField('smm','Message (optional)',{area:1,rows:3,max:400});
 else if(t==='card')h='<div class="qg2">'+qField('cfn','First name',{max:60})+qField('cln','Last name',{max:60})+'</div>'+qField('corg','Organisation or school',{max:100})+
  '<div class="qg2">'+qField('ctel','Phone',{im:'tel',max:30})+qField('cem','Email',{im:'email',max:120})+'</div>'+qField('curl','Website',{im:'url',max:200});
 var f=$$('qf');f.innerHTML=h;
 f.oninput=f.onchange=function(e){var k=e.target.dataset.qk;if(!k)return;var v=e.target.type==='checkbox'?e.target.checked:e.target.value;if(QS.v[k]===v)return;QS.v[k]=v;qUpdate();};
}
function qOpts(){var o=$$('qo'),lv=QS.logo?'H':QS.ecl;
 function sel(id,list,cur,dis){return '<select class="sel" id="'+id+'"'+(dis?' disabled':'')+'>'+list.map(function(x){return '<option value="'+x[0]+'"'+(String(x[0])===String(cur)?' selected':'')+'>'+x[1]+'</option>';}).join('')+'</select>';}
 o.innerHTML='<b>Style</b><div class="qg2" style="margin-top:6px">'+
  '<label class="qfl">Code colour<input type="color" id="qfg" value="'+QS.fg+'"></label>'+
  '<label class="qfl">Background<input type="color" id="qbg" value="'+QS.bg+'"'+(QS.tr?' disabled':'')+'></label></div>'+
  '<label class="qck"><input type="checkbox" id="qtr"'+(QS.tr?' checked':'')+'> Transparent background</label>'+
  '<div class="qfl">Shape</div><div class="seg" id="qst" style="width:fit-content;max-width:100%;margin-top:5px"><a data-s="square" href="javascript:void 0">Square</a><a data-s="rounded" href="javascript:void 0">Rounded</a><a data-s="dots" href="javascript:void 0">Dots</a></div>'+
  '<div class="qg2"><label class="qfl">Error correction'+sel('qec',[['L',QERR.L],['M',QERR.M],['Q',QERR.Q],['H',QERR.H]],lv,!!QS.logo)+'</label>'+
  '<label class="qfl">Margin'+sel('qmg',[[0,'None'],[2,'Small'],[4,'Standard'],[6,'Wide'],[8,'Extra wide']],QS.mg)+'</label></div>'+
  '<p class="hint" style="margin:8px 0 0">Higher error correction lets a code survive smudges or a logo, but makes it denser.</p>'+
  '<div class="qfl" style="margin-top:14px">Logo in the middle (optional)</div>'+
  '<div class="row" style="margin-top:6px;gap:8px"><label class="btn" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">'+ico('upload',16)+(QS.logo?'Change logo':'Add logo')+'<input type="file" id="qlg" accept="image/*" hidden></label>'+(QS.logo?'<button class="btn" id="qlx" type="button">Remove</button>':'')+'</div>'+
  (QS.logo?'<p class="hint" style="margin:8px 0 0">Error correction is set to High so the code still scans. Always test it with your phone.</p>':'');
 $$('qfg').oninput=function(){QS.fg=this.value;qSave();qUpdate();};
 $$('qbg').oninput=function(){QS.bg=this.value;qSave();qUpdate();};
 $$('qtr').onchange=function(){QS.tr=this.checked;qSave();qOpts();qUpdate();};
 document.querySelectorAll('#qst a').forEach(function(a){a.classList.toggle('on',a.dataset.s===QS.st);});
 $$('qst').onclick=function(e){var s=e.target.dataset.s;if(!s)return;QS.st=s;qSave();document.querySelectorAll('#qst a').forEach(function(a){a.classList.toggle('on',a.dataset.s===QS.st);});qUpdate();};
 $$('qec').onchange=function(){QS.ecl=this.value;qSave();qUpdate();};
 $$('qmg').onchange=function(){QS.mg=+this.value;qSave();qUpdate();};
 $$('qlg').onchange=function(e){var f=e.target.files[0];e.target.value='';if(f)qLoadLogo(f);};
 if($$('qlx'))$$('qlx').onclick=function(){QS.logo=null;QS.logoUrl='';qOpts();qUpdate();};
}
function qLoadLogo(f){
 if(!/^image\//.test(f.type)){toast('Please choose an image file');return;}
 var rd=new FileReader();
 rd.onerror=function(){toast('That image could not be read');};
 rd.onload=function(){var im=new Image();
  im.onerror=function(){toast('That image could not be read');};
  im.onload=function(){
   var w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;
   if(!w||!h){toast('That image could not be read');return;}
   var k=Math.min(1,320/Math.max(w,h)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(w*k));cv.height=Math.max(1,Math.round(h*k));
   cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
   var url=cv.toDataURL('image/png'),i2=new Image();
   i2.onload=function(){QS.logo=i2;QS.logoUrl=url;qOpts();qUpdate();};
   i2.src=url;};
  im.src=rd.result;};
 rd.readAsDataURL(f);
}
function qPanel(){var p=$$('qp');
 p.innerHTML='<div class="qbox" id="qbox"></div><div id="qnote"></div>'+
  '<div class="row" style="margin-top:14px;gap:8px;justify-content:center"><button class="btn pri" id="qdp" type="button">Download PNG</button><button class="btn" id="qds" type="button">Download SVG</button></div>'+
  '<div class="row" style="margin-top:8px;gap:8px;justify-content:center"><button class="btn" id="qcp" type="button" style="display:inline-flex;align-items:center;gap:6px">'+ico('copy',15,2)+'Copy image</button>'+
  '<label class="qfl" style="margin:0;display:flex;align-items:center;gap:6px;font-size:.84rem">PNG size<select class="sel" id="qsz" style="width:auto">'+[[512,'512 px'],[1024,'1024 px'],[2048,'2048 px'],[4096,'4096 px']].map(function(x){return '<option value="'+x[0]+'"'+(x[0]===QS.px?' selected':'')+'>'+x[1]+'</option>';}).join('')+'</select></label></div>'+
  '<p class="hint" style="margin:12px 0 0;text-align:center">Test the code with your phone before you print or share it.</p>';
 var base='eve-sandbox-qr';
 $$('qsz').onchange=function(){QS.px=+this.value;qSave();};
 $$('qdp').onclick=function(){if(!QS.res)return;qCanvas(QS.res,QS.px).toBlob(function(b){if(b)saveBlob(b,base+'.png');else toast('Could not make the PNG');},'image/png');};
 $$('qds').onclick=function(){if(!QS.res)return;saveBlob(new Blob([qSvg(QS.res)],{type:'image/svg+xml'}),base+'.svg');};
 $$('qcp').onclick=function(){if(!QS.res)return;
  if(!(navigator.clipboard&&window.ClipboardItem&&navigator.clipboard.write)){toast('Copying is not supported here. Please use Download.');return;}
  qCanvas(QS.res,Math.min(QS.px,2048)).toBlob(function(b){if(!b){toast('Could not copy the image');return;}
   navigator.clipboard.write([new ClipboardItem({'image/png':b})]).then(function(){toast('Copied!');},function(){toast('Copying was blocked. Please use Download.');});},'image/png');};
}
function qUpdate(){var box=$$('qbox');if(!box)return;
 var data=qData(),res=null,err='';
 if(data){try{res=qBuild(data);}catch(e){err='That is too much for one QR code. Please shorten it'+(QS.logo?', remove the logo':'')+' or lower the error correction.';}}
 QS.res=res;
 var ok=!!res,note='',ct=qContrast();
 if(ok&&!QS.tr){if(ct.ratio<3)note='The colours are too close together, so phones may not be able to scan this code. Pick a darker code colour or a lighter background.';
  else if(ct.inverted)note='Light code on a dark background is hard for some scanner apps to read. If it does not scan, swap the colours.';}
 box.classList.toggle('tr',!!QS.tr);
 if(ok){var cv=qCanvas(res,640),shown=$$('qcv');
  if(!shown){box.innerHTML='<canvas id="qcv" aria-label="Your QR code" role="img"></canvas>';shown=$$('qcv');}
  shown.width=cv.width;shown.height=cv.height;shown.getContext('2d').drawImage(cv,0,0);}
 else box.innerHTML='<div class="qempty">'+ico('qr',56,1.6)+'<span>'+(err?esc(err):'Your QR code will appear here as you type.')+'</span></div>';
 $$('qnote').innerHTML=ok&&note?'<div class="note" style="margin-top:12px">'+esc(note)+'</div>':'';
 ['qdp','qds','qcp'].forEach(function(i){$$(i).disabled=!ok;});
}
/* ---------- File Converter ---------- */
URLS.lame=['https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js'];
URLS.xlsx=['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'];
URLS.mammoth=['https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js'];
var FC={rows:[],n:0,q:'high',busy:false,from:'',to:''};
var FCX={png:'img',jpg:'img',jpeg:'img',webp:'img',bmp:'img',gif:'img',svg:'img',avif:'img',ico:'img',pdf:'pdf',txt:'txt',log:'txt',md:'md',markdown:'md',html:'html',htm:'html',csv:'csv',tsv:'csv',json:'json',xlsx:'sheet',xls:'sheet',ods:'sheet',docx:'docx',mp3:'aud',wav:'aud',ogg:'aud',oga:'aud',m4a:'aud',aac:'aud',flac:'aud',opus:'aud',weba:'aud',wma:'aud',amr:'aud',aiff:'aud',aif:'aud',ac3:'aud',mka:'aud',mp4:'vid',webm:'vid',mov:'vid',m4v:'vid',mkv:'vid',avi:'vid',wmv:'vid',flv:'vid','3gp':'vid',mpg:'vid',mpeg:'vid',ts:'vid'};
var FCL={png:'PNG image',jpg:'JPG image',webp:'WebP image',bmp:'BMP image',pdf:'PDF document',txt:'Plain text (.txt)',html:'Web page (.html)',json:'JSON',csv:'CSV',tsv:'TSV',xlsx:'Excel (.xlsx)',wav:'WAV audio',mp3:'MP3 audio'};
function fcExt(n){var m=/\.([A-Za-z0-9]+)$/.exec(n||'');return m?m[1].toLowerCase():'';}
function fcBase(n){return (n||'file').replace(/\.[^.]+$/,'')||'file';}
function fcKind(f){var e=fcExt(f.name),k=FCX[e];if(k)return k;var t=f.type||'';if(/^image\//.test(t))return 'img';if(/^audio\//.test(t))return 'aud';if(/^video\//.test(t))return 'vid';if(/^text\//.test(t))return 'txt';return '';}
function fcTargets(f,k){
 var e=fcExt(f.name);if(e==='jpeg')e='jpg';
 var m={img:['png','jpg','webp','bmp','pdf'],pdf:['png','jpg','txt'],txt:['pdf','html'],md:['html','txt','pdf'],html:['txt','pdf'],csv:['json','xlsx',e==='tsv'?'csv':'tsv','html'],json:['csv','xlsx'],sheet:['csv','json','html'],docx:['txt','html','pdf'],aud:['wav','mp3'],vid:['mp3','wav']}[k]||[];
 return m.filter(function(t){return t!==e;});
}
function fcLabel(k,t){return FCL[t]+(k==='vid'&&(t==='mp3'||t==='wav')?' (sound only)':'')+(k==='pdf'&&(t==='png'||t==='jpg')?' (one per page)':'');}
var FCF=[['png','PNG',['png'],'img'],['jpg','JPG',['jpg','jpeg'],'img'],['webp','WebP',['webp'],'img'],['bmp','BMP',['bmp'],'img'],['gif','GIF',['gif'],'img'],['svg','SVG',['svg'],'img'],['pdf','PDF',['pdf'],'pdf'],['docx','Word (.docx)',['docx'],'docx'],['html','HTML',['html','htm'],'html'],['md','Markdown',['md','markdown'],'md'],['txt','Text (.txt)',['txt','log'],'txt'],['csv','CSV',['csv'],'csv'],['tsv','TSV',['tsv'],'csv'],['json','JSON',['json'],'json'],['xlsx','Excel',['xlsx','xls','ods'],'sheet'],['mp3','MP3',['mp3'],'aud'],['wav','WAV',['wav'],'aud'],['ogg','OGG',['ogg','oga','opus'],'aud'],['m4a','M4A',['m4a','aac'],'aud'],['flac','FLAC',['flac'],'aud'],['mp4','MP4',['mp4','m4v'],'vid'],['webm','WebM',['webm'],'vid'],['mov','MOV',['mov'],'vid'],['mkv','MKV',['mkv'],'vid'],['avi','AVI',['avi'],'vid']];
var FCT={png:'PNG',jpg:'JPG',webp:'WebP',bmp:'BMP',pdf:'PDF',txt:'Text (.txt)',html:'HTML',json:'JSON',csv:'CSV',tsv:'TSV',xlsx:'Excel (.xlsx)',wav:'WAV',mp3:'MP3'};
var FCALL=['png','jpg','webp','bmp','pdf','txt','html','json','csv','tsv','xlsx','wav','mp3'];
function fcFmt(k){for(var i=0;i<FCF.length;i++)if(FCF[i][0]===k)return FCF[i];return null;}
function fcToList(){var f=FC.from&&fcFmt(FC.from);return f?fcTargets({name:'x.'+f[0]},f[3]):FCALL;}
function fcFix(){var l=fcToList();if(FC.from){if(l.indexOf(FC.to)<0)FC.to=l[0]||'';}else if(FC.to&&l.indexOf(FC.to)<0)FC.to='';}
function fcMatch(file,key){var f=fcFmt(key);if(!f)return true;var e=fcExt(file.name);if(f[2].indexOf(e)>=0)return true;return !FCX[e]&&fcKind(file)===f[3]&&f[2].length>0&&!e;}
function fcAssign(r){
 r.bad='';if(!r.kind){r.target='';return;}
 var ts=fcTargets(r.file,r.kind);
 if(FC.from&&!fcMatch(r.file,FC.from)){r.target='';r.bad='nomatch';return;}
 if(FC.to){r.target=ts.indexOf(FC.to)>=0?FC.to:'';if(!r.target)r.bad=fcExt(r.file.name)===FC.to||(FC.to==='jpg'&&fcExt(r.file.name)==='jpeg')?'same':'cant';}
 else r.target=ts[0]||'';
}
function fcNote(){var f=FC.from,t=FC.to;
 if(f==='pdf'&&(t==='png'||t==='jpg'))return 'Every page of the PDF becomes its own picture.';
 var fm=fcFmt(f);if(fm&&fm[3]==='vid'&&(t==='mp3'||t==='wav'))return 'Only the sound is kept from the video.';
 if(!f&&!t)return 'Not sure? Leave both as they are, then pick a format for each file after you add it.';
 return '';}
function fcPick(){
 var fo='<option value="">Any file</option>'+FCF.map(function(f){return '<option value="'+f[0]+'"'+(FC.from===f[0]?' selected':'')+'>'+esc(f[1])+'</option>';}).join('');
 var to=(FC.from?'':'<option value="">Per file</option>')+fcToList().map(function(t){return '<option value="'+t+'"'+(FC.to===t?' selected':'')+'>'+esc(FCT[t])+'</option>';}).join('');
 var n=fcNote();
 $$('fcpick').innerHTML='<div class="fcsel"><div class="fld"><label for="fcfrom">From</label><select id="fcfrom">'+fo+'</select></div><div class="fcarr" aria-hidden="true">'+ico('arrow',20,2.2)+'</div><div class="fld"><label for="fcto">To</label><select id="fcto">'+to+'</select></div></div>'+(n?'<p class="hint" style="margin:12px 0 0">'+esc(n)+'</p>':'');
 $$('fcfrom').onchange=function(){FC.from=this.value;fcFix();fcChanged();};
 $$('fcto').onchange=function(){FC.to=this.value;fcChanged();};
 var f=FC.from&&fcFmt(FC.from),inp=$$('fcfile'),dt=$$('fcdt');
 if(inp){if(f)inp.setAttribute('accept',f[2].map(function(e){return '.'+e;}).join(','));else inp.removeAttribute('accept');}
 if(dt)dt.textContent=f?'Choose '+f[1]+' files':'Choose files';
}
function fcChanged(){FC.rows.forEach(function(r){if(r.status==='busy')return;fcAssign(r);r.status='';r.out=null;r.msg='';});fcPick();fcRows();}
function fcQ(){return {high:{i:.92,k:192},medium:{i:.8,k:128},low:{i:.6,k:96}}[FC.q];}
function fcBlob(cv,type,q){return new Promise(function(res,rej){cv.toBlob(function(b){if(!b||(type!=='image/png'&&b.type!==type))rej(new Error('This browser cannot make '+type.split('/')[1].toUpperCase()+' images.'));else res(b);},type,q);});}
function fcCanvas(w,h){var c=mk(w,h);return c;}
async function fcLoadImg(f){
 var ext=fcExt(f.name);
 if(ext==='svg'||f.type==='image/svg+xml'){
  var tx=await f.text(),w=0,h=0,m=/viewBox\s*=\s*"[\s,]*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/i.exec(tx);
  var mw=/<svg[^>]*\swidth\s*=\s*"([\d.]+)(px)?"/i.exec(tx),mh=/<svg[^>]*\sheight\s*=\s*"([\d.]+)(px)?"/i.exec(tx);
  if(mw&&mh){w=+mw[1];h=+mh[1];}else if(m){w=+m[1];h=+m[2];}
  if(!(w>0&&h>0)){w=1024;h=1024;}
  var k=Math.max(1,1024/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);
  var u=URL.createObjectURL(new Blob([tx],{type:'image/svg+xml'}));
  var im=await new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i);};i.onerror=function(){rej(new Error('That SVG could not be read.'));};i.src=u;});
  var c=fcCanvas(w,h);c.getContext('2d').drawImage(im,0,0,w,h);URL.revokeObjectURL(u);return c;
 }
 var src;
 try{src=await createImageBitmap(f);}catch(e){
  var u2=URL.createObjectURL(f);
  src=await new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i);};i.onerror=function(){rej(new Error('Your browser could not read this image.'));};i.src=u2;});
 }
 var W=src.width||src.naturalWidth,H=src.height||src.naturalHeight,k2=Math.min(1,Math.sqrt(40e6/(W*H)));
 var cv=fcCanvas(Math.max(1,Math.round(W*k2)),Math.max(1,Math.round(H*k2)));cv.getContext('2d').drawImage(src,0,0,cv.width,cv.height);
 return cv;
}
function fcFlat(cv){var c=fcCanvas(cv.width,cv.height),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(cv,0,0);return c;}
function fcBmp(cv){
 var f=fcFlat(cv),w=f.width,h=f.height,d=f.getContext('2d').getImageData(0,0,w,h).data,row=(w*3+3)&~3,size=54+row*h,b=new Uint8Array(size),v=new DataView(b.buffer);
 b[0]=66;b[1]=77;v.setUint32(2,size,true);v.setUint32(10,54,true);v.setUint32(14,40,true);v.setInt32(18,w,true);v.setInt32(22,h,true);v.setUint16(26,1,true);v.setUint16(28,24,true);v.setUint32(34,row*h,true);v.setInt32(38,2835,true);v.setInt32(42,2835,true);
 for(var y=0;y<h;y++){var o=54+(h-1-y)*row;for(var x=0;x<w;x++){var s=(y*w+x)*4;b[o++]=d[s+2];b[o++]=d[s+1];b[o++]=d[s];}}
 return new Blob([b],{type:'image/bmp'});
}
async function fcTextPdf(text,warns){
 await need('pdflib');var P=window.PDFLib,doc=await P.PDFDocument.create(),font=await doc.embedFont(P.StandardFonts.Helvetica);
 var set={};font.getCharacterSet().forEach(function(c){set[c]=1;});
 var bad=0;text=String(text).replace(/\r\n?/g,'\n').replace(/\t/g,'    ');
 var clean='';for(var i=0;i<text.length;i++){var c=text.charCodeAt(i);if(c===10||set[c])clean+=text[i];else{clean+='?';bad++;}}
 if(bad&&warns)warns.push(bad+' character'+(bad>1?'s':'')+' that PDF text cannot show were replaced with "?".');
 var PW=595,PH=842,M=56,S=11,LH=15,maxW=PW-2*M,page=doc.addPage([PW,PH]),y=PH-M;
 function line(t){if(y<M+LH){page=doc.addPage([PW,PH]);y=PH-M;}if(t)page.drawText(t,{x:M,y:y-S,size:S,font:font});y-=LH;}
 clean.split('\n').forEach(function(para){
  if(!para.trim()){line('');return;}
  var words=para.split(' '),cur='';
  words.forEach(function(w){
   var t=cur?cur+' '+w:w;
   if(font.widthOfTextAtSize(t,S)<=maxW){cur=t;return;}
   if(cur)line(cur);cur='';
   while(font.widthOfTextAtSize(w,S)>maxW){var n=w.length;while(n>1&&font.widthOfTextAtSize(w.slice(0,n),S)>maxW)n--;line(w.slice(0,n));w=w.slice(n);}
   cur=w;
  });
  line(cur);
 });
 return new Blob([await doc.save()],{type:'application/pdf'});
}
async function fcImgPdf(cv,keepPng){
 await need('pdflib');var P=window.PDFLib,doc=await P.PDFDocument.create();
 var b=keepPng?await fcBlob(cv,'image/png'):await fcBlob(fcFlat(cv),'image/jpeg',fcQ().i);
 var img=keepPng?await doc.embedPng(await b.arrayBuffer()):await doc.embedJpg(await b.arrayBuffer());
 var k=Math.min(1,842/Math.max(cv.width*.75,cv.height*.75))*.75,w=cv.width*k,h=cv.height*k;
 var pg=doc.addPage([w,h]);pg.drawImage(img,{x:0,y:0,width:w,height:h});
 return new Blob([await doc.save()],{type:'application/pdf'});
}
function fcCsvParse(t,d){
 var rows=[],r=[],c='',q=false,i=0;t=String(t).replace(/^﻿/,'');
 for(;i<t.length;i++){var ch=t[i];
  if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++;}else q=false;}else c+=ch;}
  else if(ch==='"')q=true;
  else if(ch===d){r.push(c);c='';}
  else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;r.push(c);c='';rows.push(r);r=[];}
  else c+=ch;}
 if(c!==''||r.length){r.push(c);rows.push(r);}
 while(rows.length&&rows[rows.length-1].every(function(x){return x==='';}))rows.pop();
 return rows;
}
function fcDelim(name,t){if(fcExt(name)==='tsv')return '\t';var l=String(t).split(/\r?\n/)[0]||'',best=',',n=-1;[',',';','\t','|'].forEach(function(d){var k=l.split(d).length;if(k>n+0&&k>1){n=k;best=d;}});return best;}
function fcCsvOut(rows,d){return rows.map(function(r){return r.map(function(v){v=v==null?'':(typeof v==='object'?JSON.stringify(v):String(v));return (v.indexOf(d)>=0||/["\r\n]/.test(v))?'"'+v.replace(/"/g,'""')+'"':v;}).join(d);}).join('\r\n')+'\r\n';}
function fcHtmlDoc(title,body){return '<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;color:#222}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px 10px;text-align:left}pre{background:#f4f4f4;padding:12px;overflow:auto}code{background:#f4f4f4;padding:1px 4px}blockquote{margin-left:0;padding-left:1em;border-left:3px solid #ccc;color:#555}</style></head><body>\n'+body+'\n</body></html>\n';}
function fcInline(s){
 s=esc(s);
 s=s.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>').replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,function(m,a,u){return /^(https?:|data:image)/i.test(u)?'<img src="'+u+'" alt="'+a+'">':m;}).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,function(m,a,u){return /^(https?:|mailto:|#)/i.test(u)?'<a href="'+u+'">'+a+'</a>':a;});
 return s;
}
function fcMd(t){
 var L=String(t).replace(/\r\n?/g,'\n').split('\n'),o=[],i=0,list=null;
 function endList(){if(list){o.push('</'+list+'>');list=null;}}
 while(i<L.length){var l=L[i],m;
  if(/^```/.test(l)){endList();var code=[];i++;while(i<L.length&&!/^```/.test(L[i])){code.push(L[i]);i++;}i++;o.push('<pre><code>'+esc(code.join('\n'))+'</code></pre>');continue;}
  if((m=/^(#{1,6})\s+(.*)$/.exec(l))){endList();o.push('<h'+m[1].length+'>'+fcInline(m[2])+'</h'+m[1].length+'>');i++;continue;}
  if(/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)){endList();o.push('<hr>');i++;continue;}
  if((m=/^>\s?(.*)$/.exec(l))){endList();o.push('<blockquote>'+fcInline(m[1])+'</blockquote>');i++;continue;}
  if((m=/^\s*[-*+]\s+(.*)$/.exec(l))){if(list!=='ul'){endList();o.push('<ul>');list='ul';}o.push('<li>'+fcInline(m[1])+'</li>');i++;continue;}
  if((m=/^\s*\d+[.)]\s+(.*)$/.exec(l))){if(list!=='ol'){endList();o.push('<ol>');list='ol';}o.push('<li>'+fcInline(m[1])+'</li>');i++;continue;}
  if(!l.trim()){endList();i++;continue;}
  endList();var p=[l];i++;while(i<L.length&&L[i].trim()&&!/^(#{1,6}\s|```|>|\s*[-*+]\s|\s*\d+[.)]\s)/.test(L[i])){p.push(L[i]);i++;}
  o.push('<p>'+fcInline(p.join('\n')).replace(/\n/g,'<br>')+'</p>');}
 endList();return o.join('\n');
}
function fcHtmlText(h){
 var d=new DOMParser().parseFromString(h,'text/html');d.querySelectorAll('script,style,noscript,template').forEach(function(e){e.remove();});
 d.querySelectorAll('br,p,div,h1,h2,h3,h4,h5,h6,li,tr,blockquote,pre,section,article').forEach(function(e){e.append('\n');});
 d.querySelectorAll('td,th').forEach(function(e){e.append('\t');});
 return (d.body?d.body.textContent:'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+'\n';
}
async function fcDecode(f){
 if(f.size>250*1048576)throw new Error('That file is too large to convert in the browser (limit 250 MB).');
 var AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('This browser cannot read audio files.');
 var ac=new AC(),buf=await f.arrayBuffer();
 try{return await new Promise(function(res,rej){var p=ac.decodeAudioData(buf,res,rej);if(p&&p.catch)p.catch(rej);});}
 catch(e){throw new Error(fcExt(f.name)&&/mp4|mov|m4v|mkv|webm/.test(fcExt(f.name))?'No sound could be read from this video.':'Your browser could not read this audio file.');}
 finally{try{ac.close();}catch(e){}}
}
function fcWav(ab){
 var ch=ab.numberOfChannels,sr=ab.sampleRate,n=ab.length,data=new DataView(new ArrayBuffer(44+n*ch*2)),o=0;
 function s(t){for(var i=0;i<t.length;i++)data.setUint8(o++,t.charCodeAt(i));}
 s('RIFF');data.setUint32(o,36+n*ch*2,true);o+=4;s('WAVEfmt ');data.setUint32(o,16,true);o+=4;data.setUint16(o,1,true);o+=2;data.setUint16(o,ch,true);o+=2;data.setUint32(o,sr,true);o+=4;data.setUint32(o,sr*ch*2,true);o+=4;data.setUint16(o,ch*2,true);o+=2;data.setUint16(o,16,true);o+=2;s('data');data.setUint32(o,n*ch*2,true);o+=4;
 var cs=[];for(var c=0;c<ch;c++)cs.push(ab.getChannelData(c));
 for(var i=0;i<n;i++)for(c=0;c<ch;c++){var v=Math.max(-1,Math.min(1,cs[c][i]));data.setInt16(o,v<0?v*32768:v*32767,true);o+=2;}
 return new Blob([data],{type:'audio/wav'});
}
async function fcMp3(ab,step){
 await need('lame');
 var sr=ab.sampleRate,ok=[8000,11025,12000,16000,22050,24000,32000,44100,48000];
 if(ok.indexOf(sr)<0){var oc=new OfflineAudioContext(Math.min(2,ab.numberOfChannels),Math.ceil(ab.duration*44100),44100),sc=oc.createBufferSource();sc.buffer=ab;sc.connect(oc.destination);sc.start();ab=await oc.startRendering();sr=44100;}
 var ch=Math.min(2,ab.numberOfChannels),enc=new window.lamejs.Mp3Encoder(ch,sr,fcQ().k),L=ab.getChannelData(0),R=ch>1?ab.getChannelData(1):null,out=[],N=ab.length,B=1152*20;
 function i16(a,s,e){var r=new Int16Array(e-s);for(var i=s;i<e;i++){var v=Math.max(-1,Math.min(1,a[i]));r[i-s]=v<0?v*32768:v*32767;}return r;}
 for(var s=0;s<N;s+=B){var e=Math.min(N,s+B),d=ch>1?enc.encodeBuffer(i16(L,s,e),i16(R,s,e)):enc.encodeBuffer(i16(L,s,e));if(d.length)out.push(new Int8Array(d));if((s/B)%25===0){step(Math.round(s/N*100));await tick();}}
 var f=enc.flush();if(f.length)out.push(new Int8Array(f));
 return new Blob(out,{type:'audio/mpeg'});
}
function fcSheetRows(j){
 if(Array.isArray(j)){if(j.length&&j.every(function(r){return Array.isArray(r);}))return j;
  var keys=[];j.forEach(function(r){if(r&&typeof r==='object'&&!Array.isArray(r))Object.keys(r).forEach(function(k){if(keys.indexOf(k)<0)keys.push(k);});});
  if(!keys.length)return j.map(function(v){return [v];});
  return [keys].concat(j.map(function(r){return keys.map(function(k){return r&&typeof r==='object'?r[k]:'';});}));}
 if(j&&typeof j==='object'){var ks=Object.keys(j);if(ks.length===1&&Array.isArray(j[ks[0]]))return fcSheetRows(j[ks[0]]);return [ks,ks.map(function(k){return j[k];})];}
 return [[j]];
}
var FFU={lib:'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js',wk:'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js',js:'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',wasm:'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm'};
URLS.ffl=[FFU.lib];
async function fcBlobUrl(u,type){var r=await fetch(u);if(!r.ok)throw new Error('load');return URL.createObjectURL(new Blob([await r.arrayBuffer()],{type:type}));}
async function fcFFmpeg(note){
 if(FC.ff)return FC.ff;
 if(!FC.ffp)FC.ffp=(async function(){
  note('Loading the sound converter (about 30 MB, only the first time)...');
  try{
   await need('ffl');var ff=new window.FFmpegWASM.FFmpeg();ff._log=[];ff.on('log',function(m){ff._log.push(m.message);if(ff._log.length>40)ff._log.shift();});
   await ff.load({classWorkerURL:await fcBlobUrl(FFU.wk,'text/javascript'),coreURL:await fcBlobUrl(FFU.js,'text/javascript'),wasmURL:await fcBlobUrl(FFU.wasm,'application/wasm')});
   FC.ff=ff;return ff;
  }catch(e){FC.ffp=null;throw new Error('This file needs an extra converter that could not be loaded. Check your connection and try again.');}
 })();
 return FC.ffp;
}
async function fcFfRun(file,t,step,note){
 var ff=await fcFFmpeg(note);note('Converting...');ff._log.length=0;
 var ext=fcExt(file.name).replace(/[^a-z0-9]/g,''),inName='input'+(ext?'.'+ext:''),dir='/in'+Date.now(),out='out.'+t,onp=function(e){if(e&&e.progress>0&&e.progress<=1)step(Math.round(e.progress*100));};
 var up=new File([file],inName);
 await ff.createDir(dir);await ff.mount('WORKERFS',{files:[up]},dir);ff.on('progress',onp);
 try{
  var args=['-i',dir+'/'+inName,'-vn','-map','0:a:0'];
  if(t==='wav')args.push('-acodec','pcm_s16le');else args.push('-codec:a','libmp3lame','-b:a',fcQ().k+'k');
  args.push(out);
  var code=await ff.exec(args);
  if(code!==0){var lg=ff._log.join('\n');throw new Error(/matches no streams|does not contain any stream|Stream map/i.test(lg)?'No sound was found in this file.':'This file could not be converted. It may be damaged or use a format that cannot be read.');}
  var data=await ff.readFile(out);
  return new Blob([data],{type:t==='wav'?'audio/wav':'audio/mpeg'});
 }finally{try{ff.off('progress',onp);}catch(e){}try{await ff.deleteFile(out);}catch(e){}try{await ff.unmount(dir);}catch(e){}try{await ff.deleteDir(dir);}catch(e){}}
}
async function fcRun(f,t,step,warns,note){
 var k=f.kind,b=fcBase(f.file.name),file=f.file,q=fcQ();
 function one(blob,ext){return [{name:b+'.'+ext,blob:blob}];}
 if(file.size>(k==='aud'||k==='vid'?2000:400)*1048576)throw new Error('That file is too large to convert in the browser.');
 if(k==='img'){
  var cv=await fcLoadImg(file);
  if(t==='png')return one(await fcBlob(cv,'image/png'),'png');
  if(t==='jpg')return one(await fcBlob(fcFlat(cv),'image/jpeg',q.i),'jpg');
  if(t==='webp')return one(await fcBlob(cv,'image/webp',q.i),'webp');
  if(t==='bmp')return one(fcBmp(cv),'bmp');
  if(t==='pdf')return one(await fcImgPdf(cv,!/^(jpe?g)$/.test(fcExt(file.name))),'pdf');
 }
 if(k==='pdf'){
  await need('pdfjs');var doc;
  try{doc=await window.pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;}catch(e){throw new Error(pdfMsg(e));}
  var np=doc.numPages,lim=Math.min(np,t==='txt'?500:100);
  if(np>lim)warns.push('Only the first '+lim+' of '+np+' pages were converted.');
  if(t==='txt'){
   var parts=[];
   for(var p=1;p<=lim;p++){var pg=await doc.getPage(p),tc=await pg.getTextContent(),s='';tc.items.forEach(function(it){s+=it.str+(it.hasEOL?'\n':' ');});parts.push(s.replace(/[ \t]+\n/g,'\n').trim());step(Math.round(p/lim*100));await tick();}
   var all=parts.join('\n\n').trim();if(!all)throw new Error('No selectable text was found. This PDF may be scanned pictures.');
   return one(new Blob([all+'\n'],{type:'text/plain'}),'txt');
  }
  var outs=[];
  for(var p2=1;p2<=lim;p2++){var pg2=await doc.getPage(p2),vp=pg2.getViewport({scale:2}),sc=Math.min(1,4096/Math.max(vp.width,vp.height));if(sc<1)vp=pg2.getViewport({scale:2*sc});
   var c2=fcCanvas(Math.ceil(vp.width),Math.ceil(vp.height)),x=c2.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c2.width,c2.height);
   await pg2.render({canvasContext:x,viewport:vp}).promise;
   var bl=await fcBlob(c2,t==='png'?'image/png':'image/jpeg',q.i);
   outs.push({name:b+(lim>1?'-page-'+p2:'')+'.'+t,blob:bl});step(Math.round(p2/lim*100));await tick();}
  return outs;
 }
 if(k==='txt'||k==='md'||k==='html'||k==='csv'||k==='json'){
  var tx=await file.text();
  if(k==='txt'){if(t==='pdf')return one(await fcTextPdf(tx,warns),'pdf');if(t==='html')return one(new Blob([fcHtmlDoc(b,tx.replace(/\r\n?/g,'\n').split(/\n{2,}/).map(function(p){return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>';}).join('\n'))],{type:'text/html'}),'html');}
  if(k==='md'){if(t==='html')return one(new Blob([fcHtmlDoc(b,fcMd(tx))],{type:'text/html'}),'html');
   var plain=tx.replace(/```[^\n]*\n?/g,'').replace(/^#{1,6}\s+/gm,'').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1$2').replace(/`([^`]+)`/g,'$1').replace(/!?\[([^\]]*)\]\(([^)]+)\)/g,'$1 ($2)');
   if(t==='txt')return one(new Blob([plain],{type:'text/plain'}),'txt');if(t==='pdf')return one(await fcTextPdf(plain,warns),'pdf');}
  if(k==='html'){var ht=fcHtmlText(tx);if(t==='txt')return one(new Blob([ht],{type:'text/plain'}),'txt');if(t==='pdf'){warns.push('Only the text of the page was kept.');return one(await fcTextPdf(ht,warns),'pdf');}}
  if(k==='csv'){
   var d=fcDelim(file.name,tx),rows=fcCsvParse(tx,d);if(!rows.length)throw new Error('That file is empty.');
   if(t==='json'){var hd=rows[0].map(function(h,i){return h||'column'+(i+1);}),objs=rows.slice(1).map(function(r){var o={};hd.forEach(function(h,i){o[h]=r[i]==null?'':r[i];});return o;});return one(new Blob([JSON.stringify(objs,null,2)+'\n'],{type:'application/json'}),'json');}
   if(t==='csv')return one(new Blob(['﻿'+fcCsvOut(rows,',')],{type:'text/csv'}),'csv');
   if(t==='tsv')return one(new Blob([fcCsvOut(rows,'\t')],{type:'text/tab-separated-values'}),'tsv');
   if(t==='html')return one(new Blob([fcHtmlDoc(b,'<table>'+rows.map(function(r,i){return '<tr>'+r.map(function(v){return '<'+(i?'td':'th')+'>'+esc(v)+'</'+(i?'td':'th')+'>';}).join('')+'</tr>';}).join('\n')+'</table>')],{type:'text/html'}),'html');
   if(t==='xlsx'){await need('xlsx');var X=window.XLSX,wb=X.read(fcCsvOut(rows,','),{type:'string'});return one(new Blob([X.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'xlsx');}
  }
  if(k==='json'){
   var j;try{j=JSON.parse(tx);}catch(e){throw new Error('That JSON file has a mistake in it and could not be read.');}
   var jr=fcSheetRows(j);
   if(t==='csv')return one(new Blob(['﻿'+fcCsvOut(jr,',')],{type:'text/csv'}),'csv');
   if(t==='xlsx'){await need('xlsx');var X2=window.XLSX,wb2=X2.utils.book_new();X2.utils.book_append_sheet(wb2,X2.utils.aoa_to_sheet(jr.map(function(r){return r.map(function(v){return v!=null&&typeof v==='object'?JSON.stringify(v):v;});})),'Sheet1');return one(new Blob([X2.write(wb2,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'xlsx');}
  }
 }
 if(k==='sheet'){
  await need('xlsx');var X3=window.XLSX,wb3;
  try{wb3=X3.read(await file.arrayBuffer(),{type:'array'});}catch(e){throw new Error('That spreadsheet could not be read.');}
  var names=wb3.SheetNames;if(!names.length)throw new Error('That spreadsheet has no sheets.');
  return names.map(function(sn){var ws=wb3.Sheets[sn],blob,ext=t;
   if(t==='csv')blob=new Blob(['﻿'+X3.utils.sheet_to_csv(ws)],{type:'text/csv'});
   else if(t==='json')blob=new Blob([JSON.stringify(X3.utils.sheet_to_json(ws,{defval:''}),null,2)+'\n'],{type:'application/json'});
   else blob=new Blob([fcHtmlDoc(b+' - '+sn,X3.utils.sheet_to_html(ws).replace(/^[\s\S]*?<table/i,'<table').replace(/<\/table>[\s\S]*$/i,'</table>'))],{type:'text/html'});
   return {name:b+(names.length>1?'-'+sn.replace(/[^\w\- ]+/g,'').trim():'')+'.'+ext,blob:blob};});
 }
 if(k==='docx'){
  await need('mammoth');var ab0=await file.arrayBuffer();
  if(t==='html'){var r=await window.mammoth.convertToHtml({arrayBuffer:ab0});return one(new Blob([fcHtmlDoc(b,r.value)],{type:'text/html'}),'html');}
  var rt=(await window.mammoth.extractRawText({arrayBuffer:ab0})).value;
  if(t==='txt')return one(new Blob([rt],{type:'text/plain'}),'txt');
  if(t==='pdf'){warns.push('Text only: pictures, tables and fonts from the document are not kept.');return one(await fcTextPdf(rt,warns),'pdf');}
 }
 if(k==='aud'||k==='vid'){
  step(5);await tick();var ab=null;
  if(file.size<=60*1048576){try{ab=await fcDecode(file);}catch(e){ab=null;}}
  if(ab){
   if(t==='wav')return one(fcWav(ab),'wav');
   if(t==='mp3')return one(await fcMp3(ab,step),'mp3');
  }
  return one(await fcFfRun(file,t,step,note||function(){}),t);
 }
 throw new Error('That conversion is not available.');
}
function fcSet(f,m){var e=$$('fcs'+f.id);if(e)e.textContent=m;}
function fcRows(){
 var any=FC.rows.some(function(r){return ['jpg','webp','mp3'].indexOf(r.target)>=0;});
 var h=FC.rows.map(function(f){
  var ts=f.kind?fcTargets(f.file,f.kind):[],body;
  if(!f.kind)body='<span class="hint">This kind of file is not supported yet.</span>';
  else if(f.bad==='nomatch'){var ff=fcFmt(FC.from);body='<div class="note bad">This is not a '+esc(ff?ff[1]:'matching')+' file. Change From to Any file, or choose a different file.</div>';}
  else if(f.bad==='same')body='<div class="note bad">This file is already in that format. Pick a different To format.</div>';
  else if(f.bad==='cant')body='<div class="note bad">This file cannot be turned into '+esc(FCT[FC.to]||'that format')+'. Pick a different To format.</div>';
  else if(!ts.length)body='<span class="hint">This kind of file is not supported yet.</span>';
  else if(FC.to)body='<span class="hint">Will become <b style="color:var(--ink)">'+esc(FCT[f.target]||f.target)+'</b></span>';
  else body='<label class="hint">Convert to <select class="sel" data-fid="'+f.id+'"'+(f.status==='busy'?' disabled':'')+'>'+ts.map(function(t){return '<option value="'+t+'"'+(t===f.target?' selected':'')+'>'+esc(fcLabel(f.kind,t))+'</option>';}).join('')+'</select></label>';
  var res='';
  if(f.status==='busy')res='<span class="hint" id="fcs'+f.id+'">Converting...</span>';
  else if(f.status==='err')res='<div class="note bad" style="margin-top:8px">'+esc(f.msg)+'</div>';
  else if(f.status==='done'){
   res='<div class="fcres">'+f.out.map(function(o,i){return '<button class="btn pri" data-dl="'+f.id+':'+i+'">'+ico('dlbox',15,2.4)+' '+esc(o.name.length>34?o.name.slice(0,30)+'...'+fcExt(o.name):o.name)+' <span style="opacity:.8;font-weight:500">'+fb(o.blob.size)+'</span></button>';}).join('')+(f.out.length>1?'<button class="btn" data-zip="'+f.id+'">Download all (.zip)</button>':'')+'</div>'+(f.warn.length?'<p class="hint" style="margin:8px 0 0">'+f.warn.map(esc).join(' ')+'</p>':'');
  }
  return '<div class="card fcrow"><div class="fctop"><div style="min-width:0"><b class="gbtt" style="-webkit-line-clamp:1">'+esc(f.file.name)+'</b><span class="hint">'+fb(f.file.size)+'</span></div><button class="rm" data-rm="'+f.id+'" aria-label="Remove">'+ico('x',16,2.4)+'</button></div><div style="margin-top:8px">'+body+'</div>'+res+'</div>';}).join('');
 var go=FC.rows.some(function(r){return r.kind&&r.target&&r.status!=='done'&&r.status!=='busy';});
 $$('fclist').innerHTML=h+(FC.rows.length?'<div class="card" style="margin-top:12px"><div class="row" style="justify-content:space-between;gap:10px">'+(any?'<div class="seg" id="fcq" style="min-width:0">'+['high','medium','low'].map(function(q){return '<a href="javascript:void 0" data-q="'+q+'" class="'+(FC.q===q?'on':'')+'">'+({high:'High quality',medium:'Medium',low:'Smaller file'})[q]+'</a>';}).join('')+'</div>':'<span></span>')+'<div class="row" style="gap:8px"><button class="btn" id="fcclr">Clear</button><button class="btn pri" id="fcgo"'+(go&&!FC.busy?'':' disabled')+'>Convert</button></div></div></div>':'');
 $$('fclist').querySelectorAll('select[data-fid]').forEach(function(s){s.onchange=function(){var f=FC.rows.filter(function(r){return r.id===+s.dataset.fid;})[0];f.target=s.value;f.status='';f.out=null;fcRows();};});
 $$('fclist').querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(){FC.rows=FC.rows.filter(function(r){return r.id!==+b.dataset.rm;});fcRows();};});
 $$('fclist').querySelectorAll('[data-dl]').forEach(function(b){b.onclick=function(){var a=b.dataset.dl.split(':'),f=FC.rows.filter(function(r){return r.id===+a[0];})[0],o=f.out[+a[1]];fileSave(o.blob,o.name);};});
 $$('fclist').querySelectorAll('[data-zip]').forEach(function(b){b.onclick=async function(){var f=FC.rows.filter(function(r){return r.id===+b.dataset.zip;})[0];try{await need('zip');var z=new window.JSZip();f.out.forEach(function(o){z.file(o.name,o.blob);});fileSave(await z.generateAsync({type:'blob'}),fcBase(f.file.name)+'.zip');}catch(e){toast('Could not make the zip file');}};});
 var qs=$$('fcq');if(qs)qs.querySelectorAll('a').forEach(function(a){a.onclick=function(){FC.q=a.dataset.q;FC.rows.forEach(function(r){if(r.status==='done'&&['jpg','webp','mp3'].indexOf(r.target)>=0){r.status='';r.out=null;}});fcRows();};});
 var c=$$('fcclr');if(c)c.onclick=function(){FC.rows=[];fcRows();};
 var g=$$('fcgo');if(g)g.onclick=fcConvert;
}
async function fcConvert(){
 if(FC.busy)return;FC.busy=true;
 for(var i=0;i<FC.rows.length;i++){var f=FC.rows[i];if(!f.kind||!f.target||f.status==='done')continue;
  f.status='busy';f.warn=[];fcRows();await tick();
  try{f.out=await fcRun(f,f.target,function(p){fcSet(f,'Converting... '+p+'%');},f.warn,function(m){fcSet(f,m);});f.status='done';}
  catch(e){f.status='err';f.msg=(e&&e.message)||'Something went wrong while converting this file.';}
 }
 FC.busy=false;fcRows();
}
function fcAdd(files){
 Array.prototype.forEach.call(files,function(file){
  var k=fcKind(file),r={id:++FC.n,file:file,kind:k,target:'',bad:'',status:'',out:null,warn:[],msg:''};fcAssign(r);FC.rows.push(r);});
 fcRows();
}
function convertPage(){nav('convert');
 FC.rows=[];FC.busy=false;FC.from='';FC.to='';
 app.innerHTML='<h1 style="font-size:2.2rem">File Converter</h1><p class="lead" style="font-size:1rem">Turn a file into another format that suits it. Pictures, PDFs, documents, spreadsheets, text and audio are supported, and everything is converted on your device, so your files are never uploaded.</p>'+
 '<div class="card" id="fcpick" style="margin-top:16px;padding:16px"></div>'+
 '<label class="card drop" id="fcdrop" style="margin-top:14px"><input type="file" id="fcfile" multiple hidden>'+ico('upload',28)+'<b id="fcdt">Choose files</b><span class="hint">or drop them here</span></label>'+
 '<p class="hint" style="margin:10px 2px 0">Pictures: PNG, JPG, WebP, BMP, GIF, SVG &middot; Documents: PDF, Word (.docx), HTML, Markdown, text &middot; Data: Excel, CSV, TSV, JSON &middot; Sound: MP3, WAV, OGG, M4A, FLAC and sound from videos</p><div id="fclist" style="margin-top:14px"></div>';
 var inp=$$('fcfile');inp.onchange=function(){if(inp.files.length)fcAdd(inp.files);inp.value='';};
 var d=$$('fcdrop');d.ondragover=function(e){e.preventDefault();};d.ondrop=function(e){e.preventDefault();if(e.dataTransfer.files.length)fcAdd(e.dataTransfer.files);};
 fcPick();fcRows();
}
/* ---------- Eve AI ---------- */
URLS.katex=['https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js'];
var AI={msgs:[],mode:'chat',level:'college',hints:false,deep:false,count:0,busy:false,ctl:null,notes:null,pin:true,loaded:false,tm:0};
var AIK='eveai',AID='evedecks',AIX={};
var AIMODES=[['chat','Chat'],['explain','Explain'],['solve','Solve'],['summarize','Summarize'],['cards','Flashcards'],['test','Practice test'],['quiz','Quiz me'],['essay','Writing'],['memory','Memory'],['plan','Plan']];
var AIPH={chat:'Ask Eve anything about your studies',explain:'What would you like explained?',solve:'Paste a problem and we will solve it step by step',summarize:'Paste your notes, or attach a file',cards:'A topic for your flashcards, or attach your notes',test:'A topic for your practice test, or attach your notes',quiz:'What should I quiz you on?',essay:'Paste your writing, or tell me about the assignment',memory:'What do you need to remember?',plan:'Tell me about your exams and how much time you have'};
var AIPHS={chat:'Ask Eve anything...',explain:'What shall I explain?',solve:'Paste a problem to solve',summarize:'Paste notes or attach a file',cards:'A topic or your notes',test:'A topic or your notes',quiz:'What should I quiz you on?',essay:'Paste your writing',memory:'What should you remember?',plan:'Your exams and free time'};
function aiPh(m){var t=(window.innerWidth<560?AIPHS:AIPH);return t[m]||t.chat;}
var AILV=[['primary','Primary school'],['middle','Middle school'],['high','High school'],['college','College'],['advanced','Advanced']];
var AIFU=[['Explain it more simply','Can you explain that more simply, with an everyday example?'],['Give me an example','Can you give me a worked example?'],['Quiz me on this','Quiz me on this, one question at a time.','quiz']];
var AISUG=[['explain','Explain a topic simply','Start from the basics'],['cards','Make flashcards','From a topic or your notes'],['test','Practice test','Check what you know'],['solve','Solve step by step','Maths, science and more'],['summarize','Summarize my notes','Attach a file or paste text'],['plan','Plan my study week','Around your exams']];
var AIBOX=[0,1,3,7,14,30];
var AIDIS=/\b(kill(ing)? myself|(i am|i'm|im|feel|feeling|so) suicidal|end(ing)? my (own )?life|want(ed)? to die|wanna die|(been|keep|keeps|am|i'm|im) self[- ]?harming|hurt(ing)? myself|harm(ing)? myself|cut(ting)? myself|no reason to live|don'?t want to (be here|live|exist|be alive)|better off (dead|without me))\b/i;
function aiCareEl(){
 var e=document.createElement('div');e.className='aim eve aicare';
 e.innerHTML='<span class="aiav sm">'+ico('spark',15,2)+'</span><div class="aic"><div class="aib"><p><b>I am really glad you told me.</b> You matter, and you do not have to carry this alone. Please talk to someone you trust today, like a parent, a teacher or a school counsellor.</p><p>If you are in India, you can call <b>Tele-MANAS</b> for free at any hour: <a href="tel:14416">14416</a> or <a href="tel:1800914416">1-800-91-4416</a>. If you are in danger right now, call <a href="tel:112">112</a>. Anywhere else, <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> lists free helplines by country.</p></div></div>';
 return e;
}
IC.spark='<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>';
IC.clip='<path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l9-9a3.3 3.3 0 0 1 4.7 4.7l-9 9a1.7 1.7 0 0 1-2.4-2.4l8.3-8.3"/>';
IC.send='<path d="M12 19V5M5 12l7-7 7 7"/>';
IC.stopsq='<rect x="6" y="6" width="12" height="12" rx="2.5"/>';
IC.copy='<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>';
IC.vol='<path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>';
IC.redo='<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>';
IC.deck='<rect x="3" y="7" width="14" height="13" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v11"/>';
IC.test='<path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="3"/>';
function aiLoad(){try{var d=JSON.parse(localStorage.getItem(AIK)||'null');if(d){
 if(Array.isArray(d.msgs))AI.msgs=d.msgs.filter(function(m){return m&&(m.r==='u'||m.r==='e')&&typeof m.t==='string';}).slice(-60);
 if(AILV.some(function(l){return l[0]===d.level;}))AI.level=d.level;
 AI.hints=d.hints===true;AI.deep=d.deep===true;AI.count=+d.count||0;
 if(AIMODES.some(function(m){return m[0]===d.mode;}))AI.mode=d.mode;
 if(d.notes&&typeof d.notes.text==='string')AI.notes=d.notes;}}catch(e){}}
function aiSave(){try{localStorage.setItem(AIK,JSON.stringify({msgs:AI.msgs.slice(-60),level:AI.level,hints:AI.hints,deep:AI.deep,count:AI.count,mode:AI.mode,notes:AI.notes}));}catch(e){}}
function aiDecks(){try{var a=JSON.parse(localStorage.getItem(AID)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function aiDecksSave(a){try{localStorage.setItem(AID,JSON.stringify(a.slice(0,30)));return true;}catch(e){return false;}}
function aiDueN(d){var n=Date.now();return d.cards.filter(function(c){return !c.d||c.d<=n;}).length;}

/* markdown + maths, written for chat: nothing from the model is ever inserted as raw HTML */
function aiMd(src,inlineOnly){
 var codes=[],inl=[],maths=[];
 src=String(src==null?'':src).replace(/[\u0001-\u0003]/g,'').replace(/\r\n?/g,'\n');
 src=src.replace(/```([\w+#.-]*)[ \t]*\n([\s\S]*?)(?:\n?```|$)/g,function(m,l,c){codes.push([l,c]);return '\n\u0001'+(codes.length-1)+'\u0001\n';});
 src=src.replace(/`([^`\n]+)`/g,function(m,c){inl.push(c);return '\u0003'+(inl.length-1)+'\u0003';});
 var mp=function(t,d){maths.push([t,d]);return '\u0002'+(maths.length-1)+'\u0002';};
 src=src.replace(/\$\$([\s\S]+?)\$\$/g,function(m,t){return mp(t.trim(),1);}).replace(/\\\[([\s\S]+?)\\\]/g,function(m,t){return mp(t.trim(),1);}).replace(/\\\(([\s\S]+?)\\\)/g,function(m,t){return mp(t.trim(),0);}).replace(/\$([^\s$](?:[^$\n]*?[^\s$\\])?)\$(?!\d)/g,function(m,t){return mp(t,0);});
 src=esc(src);
 function back(s){
  return s.replace(/\u0003(\d+)\u0003/g,function(m,k){return '<code>'+esc(inl[+k])+'</code>';}).replace(/\u0002(\d+)\u0002/g,function(m,k){var x=maths[+k];return '<span class="aimath" data-d="'+x[1]+'" data-t="'+esc(x[0])+'">'+(x[1]?'$$':'$')+esc(x[0])+(x[1]?'$$':'$')+'</span>';});
 }
 function inline(s){
  s=s.replace(/\[([^\]\n]+)\]\((#\/(?:planner|calc|ide|image|pdf|convert))\)/g,function(m,t,h){return '<a href="'+U(h.slice(2))+'">'+t+'</a>';}).replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,function(m,t,u){return '<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+t+'</a>';})
   .replace(/(^|[\s(])(https?:\/\/[^\s<)]*[^\s<).,;:!?])/g,function(m,p,u){return p+'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+'</a>';})
   .replace(/\*\*(?=\S)([^\n]*?\S)\*\*/g,'<strong>$1</strong>').replace(/__(?=\S)([^\n]*?\S)__/g,'<strong>$1</strong>')
   .replace(/(^|[^*\w])\*(?![\s*])([^*\n]*?[^\s*])\*(?![*\w])/g,'$1<em>$2</em>').replace(/(^|[^\w])_(?![\s_])([^_\n]*?[^\s_])_(?![\w])/g,'$1<em>$2</em>')
   .replace(/~~(?=\S)([^\n]*?\S)~~/g,'<del>$1</del>');
  return back(s);
 }
 if(inlineOnly)return inline(src.replace(/\n+/g,' '));
 var L=src.split('\n'),out=[],i=0,m;
 var LI=/^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/;
 function cells(r){r=r.trim().replace(/^\|/,'').replace(/\|$/,'');return r.split('|').map(function(c){return c.trim();});}
 function listHtml(items){
  var h='',st=[];
  items.forEach(function(it,ix){
   var ind=it[0],o=it[1],top=st.length?st[st.length-1]:null;
   while(st.length&&ind<st[st.length-1].ind){h+='</li></'+(st.pop().o?'ol':'ul')+'>';top=st.length?st[st.length-1]:null;}
   if(top&&ind===top.ind){h+='</li><li>'+inline(it[2]);}
   else{st.push({ind:ind,o:o});h+=(o?'<ol>':'<ul>')+'<li>'+inline(it[2]);}
  });
  while(st.length)h+='</li></'+(st.pop().o?'ol':'ul')+'>';
  return h;
 }
 function isBlock(ln,nx){return /^\u0001\d+\u0001$/.test(ln.trim())||/^#{1,4}\s/.test(ln)||/^&gt;/.test(ln)||LI.test(ln)||/^\s*([-*_])(\s*\1){2,}\s*$/.test(ln)||(ln.indexOf('|')>=0&&nx!==undefined&&/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(nx));}
 while(i<L.length){
  var ln=L[i];
  if(!ln.trim()){i++;continue;}
  if((m=/^\u0001(\d+)\u0001$/.exec(ln.trim()))){var cd=codes[+m[1]];out.push('<div class="aicode"><div class="aich"><span>'+esc(cd[0]||'code')+'</span><button type="button" class="aicp" data-a="cp">Copy</button></div><pre><code>'+esc(cd[1])+'</code></pre></div>');i++;continue;}
  if((m=/^(#{1,4})\s+(.+)$/.exec(ln))){out.push('<h'+(m[1].length<3?3:4)+'>'+inline(m[2])+'</h'+(m[1].length<3?3:4)+'>');i++;continue;}
  if(/^\s*([-*_])(\s*\1){2,}\s*$/.test(ln)){out.push('<hr>');i++;continue;}
  if(/^&gt;/.test(ln)){var q=[];while(i<L.length&&/^&gt;/.test(L[i])){q.push(L[i].replace(/^&gt;\s?/,''));i++;}out.push('<blockquote>'+inline(q.join('\n').replace(/\n/g,'<br>'))+'</blockquote>');continue;}
  if(ln.indexOf('|')>=0&&i+1<L.length&&/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(L[i+1])){
   var hd=cells(ln),rows=[];i+=2;while(i<L.length&&L[i].indexOf('|')>=0&&L[i].trim()){rows.push(cells(L[i]));i++;}
   out.push('<div class="aitw"><table class="aitb"><thead><tr>'+hd.map(function(c){return '<th>'+inline(c)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+hd.map(function(_,k){return '<td>'+inline(r[k]||'')+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>');continue;}
  if((m=LI.exec(ln))){
   var its=[];
   for(;;){
    var mm=i<L.length&&LI.exec(L[i]);
    if(mm){var di=mm[1].replace(/\t/g,'    ').length,dn=/\d/.test(mm[2].charAt(0));if(its.length&&di===its[0][0]&&dn!==its[0][1])break;its.push([di,dn,mm[3],parseInt(mm[2],10)||1]);i++;continue;}
    var j=i;while(j<L.length&&!L[j].trim())j++;
    if(i<L.length&&!L[i].trim()&&j<L.length&&LI.test(L[j])){i=j;continue;}
    if(its.length&&i<L.length&&L[i].trim()&&/^\s{2,}\S/.test(L[i])&&!LI.test(L[i])){its[its.length-1][2]+='<br>'+L[i].trim();i++;continue;}
    break;
   }
   var first=its[0];out.push(listHtml(its).replace(/^<ol>/,first[1]&&first[3]>1?'<ol start="'+first[3]+'">':'<ol>'));continue;}
  var p=[ln];i++;
  while(i<L.length&&L[i].trim()&&!isBlock(L[i],L[i+1])){p.push(L[i]);i++;}
  out.push('<p>'+inline(p.join('\n').replace(/\n/g,'<br>'))+'</p>');
 }
 return out.join('');
}
function aiKatex(){
 if(AIX.kx)return AIX.kx;
 if(AIX.kxf&&Date.now()-AIX.kxf<60000)return Promise.reject(new Error('x'));
 if(!AIX.css){AIX.css=1;var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';document.head.appendChild(l);}
 AIX.kx=need('katex').then(function(){return window.katex;},function(e){AIX.kx=null;AIX.kxf=Date.now();throw e;});
 return AIX.kx;
}
function aiMath(root){
 var els=(root||document).querySelectorAll('.aimath:not([data-k])');if(!els.length)return;
 if(window.katex){els.forEach(function(e){try{window.katex.render(e.dataset.t,e,{displayMode:e.dataset.d==='1',throwOnError:false,strict:'ignore',trust:false});e.dataset.k='1';}catch(x){e.dataset.k='0';}});return;}
 aiKatex().then(function(){aiMath(root);},function(){});
}
function aiPlain(t){
 return String(t).replace(/```[\s\S]*?(```|$)/g,' (code) ').replace(/\$\$[\s\S]+?\$\$/g,' (equation) ').replace(/\\\[[\s\S]+?\\\]/g,' (equation) ').replace(/\$([^$\n]+)\$/g,function(m,x){return ' '+x.replace(/\\[a-zA-Z]+/g,' ').replace(/[{}^_\\]/g,' ')+' ';}).replace(/!?\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/https?:\/\/\S+/g,' link ').replace(/[#*_`>~|]/g,' ').replace(/\s+/g,' ').trim();
}
var AIFEM=/\b(aria|jenny|sonia|libby|maisie|ava|emma|michelle|nancy|jane|sara|amber|ashley|cora|elizabeth|monica|clara|natasha|annette|molly|zira|hazel|susan|heera|neerja|swara|veena|lekha|kalpana|priya|samantha|karen|moira|tessa|fiona|victoria|allison|serena|kate|nicky|zoe|joanna|salli|kendra|kimberly|ivy|amy|olivia|isabella|aditi|raveena|catherine|linda|laura|helena|paulina|sabina|lucia|elsa)|female|woman|google us english|google (हिन्दी|hindi)/i;
var AIMAL=/\b(david|mark|george|ravi|hemant|prabhat|rishi|guy|ryan|christopher|eric|brian|andrew|daniel|alex|fred|tom|james|thomas|oliver|aaron|arthur|wilson|jason|tony|jacob|roger|davis|mitchell|william|clark|alfie|sam|rocko|reed|eddy|diego|jorge|luca|henry|matthew|joey|justin|kevin|russell|geraint|liam|alan|bruce|ralph|albert|gordon|noah|mike|steffan|connor|jacques|cellos|bells|boing|bubbles|trinoids|zarvox|whisper|wobble|jester|organ|superstar|hysterical|deranged)\b|\bmale\b/i;
function aiVoices(){try{return (window.speechSynthesis.getVoices()||[]).filter(function(v){return v&&v.name;});}catch(e){return [];}}
function aiIsFem(v){return !!v&&AIFEM.test(v.name)&&!AIMAL.test(v.name);}
function aiRank(){
 var lg=(navigator.language||'en').slice(0,2).toLowerCase(),full=(navigator.language||'').toLowerCase().replace('_','-');
 return aiVoices().map(function(v){var n=v.name,l=(v.lang||'').toLowerCase().replace('_','-'),s=0;
  if(AIMAL.test(n))s-=300;if(AIFEM.test(n))s+=120;if(/natural|neural|premium|enhanced|online/i.test(n))s+=30;
  if(l.indexOf(lg)===0)s+=40;if(l===full)s+=10;if(l.indexOf('en')===0)s+=6;
  return {v:v,s:s};}).sort(function(a,b){return b.s-a.s;});
}
function aiVoice(){
 var r=aiRank();return r.length?r[0].v:null;
}
/* voices arrive a moment after the page opens on many browsers: ask early, and Listen waits for them if they are late */
function aiVoiceInit(){
 if(!('speechSynthesis' in window))return;
 try{localStorage.removeItem('evevoice');}catch(e){}
 aiVoices();
}
function aiVoicesReady(cb){var n=0;(function t(){if(aiVoices().length||n++>6)return cb();setTimeout(t,120);})();}
function aiChunks(t){
 var out=[],cur='',parts=String(t).match(/[^.!?;:\n]+[.!?;:]*\s*/g)||[String(t)];
 parts.forEach(function(x){if(cur&&(cur+x).length>200){out.push(cur.trim());cur=x;}else cur+=x;});
 if(cur.trim())out.push(cur.trim());return out.filter(Boolean);
}
/* a soft, slightly slow delivery, one short sentence group at a time so it sounds natural and never cuts off */
function aiSpeakText(text,onDone){
 var ss=window.speechSynthesis,parts=aiChunks(text);if(!parts.length){if(onDone)onDone();return;}
 var v=aiVoice(),lift=v&&!aiIsFem(v);
 parts.forEach(function(p,i){var u=new SpeechSynthesisUtterance(p);if(v){try{u.voice=v;u.lang=v.lang;}catch(e){}}u.rate=.92;u.pitch=lift?1.2:1;u.volume=1;
  if(onDone){if(i===parts.length-1)u.onend=onDone;u.onerror=onDone;}ss.speak(u);});
}
function aiSayUI(){document.querySelectorAll('[data-a="say"]').forEach(function(b){var on=AIX.say===b;b.classList.toggle('on',on);var s=b.querySelector('span');if(s)s.textContent=on?'Stop':'Listen';});}
function aiSpeak(text,btn){
 if(!('speechSynthesis' in window)){toast('Reading aloud is not available on this device');return;}
 var ss=speechSynthesis;
 if(AIX.say===btn){AIX.tok=(AIX.tok||0)+1;ss.cancel();AIX.say=null;aiSayUI();return;}
 var was=ss.speaking||ss.pending;if(was)ss.cancel();
 var tok=AIX.tok=(AIX.tok||0)+1;AIX.say=btn;aiSayUI();
 var done=function(){if(AIX.tok===tok&&AIX.say===btn){AIX.say=null;aiSayUI();}};
 aiVoicesReady(function(){
  if(AIX.tok!==tok)return;
  setTimeout(function(){if(AIX.tok!==tok)return;aiSpeakText(aiPlain(text),done);},was?90:0);
 });
}
function aiLeave(){
 if(AI.ctl){try{AI.ctl.abort();}catch(e){}}
 AI.busy=false;try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}AIX.say=null;
 var s=document.querySelector('.aish');if(s)s.remove();
}
function aiHistory(){
 var h=[];AI.msgs.forEach(function(m){if(!m.t)return;h.push({role:m.r==='u'?'user':'assistant',content:m.t});});
 return h;
}
function aiErr(code,st){
 var T={limit:'I have helped so many students today that I need a little rest. Please come back in a while. My energy comes back every day.',slow:'Let us take a short breather. You are sending messages very quickly. Try again in a minute.',busy:'I am having a little trouble thinking right now. Please try again in a moment.',down:'I am having a little trouble thinking right now. Please try again in a moment.',big:'That is a lot for me to read at once. Try a shorter message, or attach fewer notes.',empty:'I could not put an answer together that time. Please try again.',format:'I could not put that together this time. Please try again.',net:'I cannot reach my study room right now. Please check your connection and try again.',forbidden:'Eve is not available from here yet.'};
 return T[code]||(st===429?T.limit:T.down);
}
/* ----- thread ----- */
function aiTh(){return $$('aith');}
function aiNear(){var th=aiTh(),c=$$('aicomp');if(!th||!c)return true;return th.getBoundingClientRect().bottom-c.getBoundingClientRect().top<90;}
function aiReveal(el){var c=$$('aicomp'),th=aiTh();if(!el||!c||!th||!th.contains(el))return;var d=el.getBoundingClientRect().bottom-(c.getBoundingClientRect().top-12);if(d>0)window.scrollBy(0,d);}
function aiScroll(force){
 if(!force&&!AI.pin)return;var th=aiTh(),c=$$('aicomp');if(!th||!c)return;
 var d=th.getBoundingClientRect().bottom-c.getBoundingClientRect().top+14;if(d>0)window.scrollBy(0,d);
}
function aiEl(m,ix){
 var d=document.createElement('div');d.className='aim '+(m.r==='u'?'me':'eve');d.dataset.i=ix;
 if(m.r==='u'){d.innerHTML='<div class="aib"></div>';d.firstChild.textContent=m.t;return d;}
 d.innerHTML='<span class="aiav sm">'+ico('spark',15,2)+'</span><div class="aic"><div class="aib"></div><div class="aiact"></div></div>';
 return d;
}
function aiBubble(el){return el.querySelector('.aib');}
function aiFill(el,m){
 var b=aiBubble(el);
 if(m.k==='cards'||m.k==='quiz'){
  el.classList.add('wide');b.innerHTML='<p style="margin:0 0 10px">'+aiMd(m.t,true)+'</p><div class="aiwg"></div>';
  var host=b.querySelector('.aiwg');
  if(m.k==='cards')aiCards(host,m.d,{save:true});else aiQuiz(host,m.d,{});
  return;
 }
 b.innerHTML=aiMd(m.t);aiMath(b);
}
function aiActs(el,m,last){
 var a=el.querySelector('.aiact');if(!a)return;var h='';
 if(m.k){if(last)h='<button type="button" data-a="redo">'+ico('redo',14,2)+'<span>Make a new one</span></button>';}
 else{
  h='<button type="button" data-a="copy">'+ico('copy',14,2)+'<span>Copy</span></button><button type="button" data-a="say">'+ico('vol',14,2)+'<span>Listen</span></button>';
  if(m.t.length>140)h+='<button type="button" data-a="mkc">'+ico('deck',14,2)+'<span>Flashcards</span></button><button type="button" data-a="mkt">'+ico('test',14,2)+'<span>Practice test</span></button>';
  if(last)h+='<button type="button" data-a="redo">'+ico('redo',14,2)+'<span>Redo</span></button>';
 }
 if(last&&!m.k){h+='<div class="aifu">'+AIFU.map(function(f,k){return '<button type="button" data-a="fu" data-k="'+k+'">'+esc(f[0])+'</button>';}).join('')+'</div>';}
 a.innerHTML=h;
}
function aiRender(){
 var th=aiTh();if(!th)return;th.innerHTML='';
 if(!AI.msgs.length){aiWelcome();return;}
 AI.msgs.forEach(function(m,ix){var el=aiEl(m,ix);th.appendChild(el);if(m.r==='u'&&m.care)th.appendChild(aiCareEl());if(m.r==='e'){aiFill(el,m);aiActs(el,m,ix===AI.msgs.length-1);}});
 aiBadge();
}
function aiWelcome(){
 var th=aiTh(),off=!CFG.aiApi;
 th.innerHTML='<div class="aiwel"><span class="aiav big">'+ico('spark',30,1.8)+'</span><h2>'+(off?'Eve is getting ready':'Hi, I am Eve')+'</h2><p>'+(off?'She will be here very soon. You can still look at your saved flashcards.':'I am here to help you understand, practise and remember. What shall we learn today?')+'</p>'+
  (off?'':'<div class="aisug">'+AISUG.map(function(s){return '<button type="button" data-s="'+s[0]+'"><b>'+esc(s[1])+'</b><span>'+esc(s[2])+'</span></button>';}).join('')+'</div>')+'</div>';
}
function aiBadge(){var b=$$('aibg'),n=aiDecks().length;if(b){b.textContent=n?n:'';b.style.display=n?'':'none';}}
function aiNotesUI(){
 var e=$$('ainote');if(!e)return;
 if(!AI.notes){e.innerHTML='';e.style.display='none';return;}
 e.style.display='';e.innerHTML='<div class="ainchip">'+ico('clip',14,2)+'<span class="aint">'+esc(AI.notes.name)+'</span><em>'+AI.notes.words.toLocaleString()+' words'+(AI.notes.cut?', first part used':'')+'</em><button type="button" data-a="rmnote" aria-label="Remove notes">'+ico('x',14,2.4)+'</button></div>';
}
async function aiReadNotes(file){
 var e=fcExt(file.name),t='';
 if(file.size>30*1048576)throw new Error('That file is too big. Try one under 30 MB.');
 if(e==='pdf'){
  await need('pdfjs');var doc;
  try{doc=await window.pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;}catch(x){throw new Error(pdfMsg(x));}
  for(var p=1;p<=Math.min(doc.numPages,80)&&t.length<20000;p++){var pg=await doc.getPage(p),tc=await pg.getTextContent(),s='';tc.items.forEach(function(it){s+=it.str+(it.hasEOL?'\n':' ');});t+=s+'\n\n';}
 }else if(e==='docx'){await need('mammoth');t=(await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value;}
 else if(/^(html?|xhtml)$/.test(e)){t=fcHtmlText(await file.text());}
 else if(/^(txt|md|markdown|csv|tsv|json|log)$/.test(e)||/^text\//.test(file.type)){t=await file.text();}
 else throw new Error('Eve can read text files, PDFs and Word documents.');
 t=t.replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
 if(!t)throw new Error('I could not find any text in that file. Scanned pictures cannot be read yet.');
 return {name:file.name.length>40?file.name.slice(0,36)+'...':file.name,text:t.slice(0,14000),cut:t.length>14000,words:t.split(/\s+/).length};
}
/* ----- sending ----- */
function aiBusy(b){
 AI.busy=b;var s=$$('aisend');if(!s)return;
 s.innerHTML=ico(b?'stopsq':'send',b?20:20,2.4);s.setAttribute('aria-label',b?'Stop':'Send');s.classList.toggle('stop',b);
}
function aiFail(host,code,st,retry){
 var e=document.createElement('div');e.className='aim eve aierr';e.innerHTML='<span class="aiav sm">'+ico('spark',15,2)+'</span><div class="aic"><div class="aib">'+esc(aiErr(code,st))+'</div>'+(retry?'<div class="aiact"><button type="button" data-a="retry">'+ico('redo',14,2)+'<span>Try again</span></button></div>':'')+'</div>';
 host.appendChild(e);aiScroll(true);
}
function aiClearErr(){document.querySelectorAll('.aierr').forEach(function(e){e.remove();});}
function aiSend(text,mo){
 if(AI.busy){return;}
 var mode=mo||AI.mode;text=String(text||'').trim();
 if(!text&&AI.notes){text=({summarize:'Please summarize my notes.',cards:'Make flashcards from my notes.',test:'Make a practice test from my notes.',explain:'Please explain my notes.'})[mode]||'';}
 if(!text){toast('Type a message for Eve first');return;}
 if(!CFG.aiApi)return;
 aiClearErr();
 if(!AI.msgs.length)aiTh().innerHTML='';
 var um={r:'u',t:text.slice(0,6000),mo:mode};if(AIDIS.test(text.replace(/[\u2018\u2019]/g,"'")))um.care=true;AI.msgs.push(um);
 aiTh().appendChild(aiEl(um,AI.msgs.length-1));if(um.care)aiTh().appendChild(aiCareEl());
 var inp=$$('aiin');inp.value='';aiGrow();
 AI.pin=true;aiScroll(true);aiSave();
 aiRespond(mode);
}
function aiRespond(mode){
 aiClearErr();
 var last=AI.msgs[AI.msgs.length-1];
 if(mode==='cards'||mode==='test')return aiTask(mode==='cards'?'cards':'quiz',last.src?'':last.t,last.src);
 return aiChat(mode);
}
function aiUrl(){return String(CFG.aiApi).replace(/\/+$/,'')+'/chat';}
async function aiChat(mode){
 var th=aiTh(),m={r:'e',t:'',mo:mode},ix=AI.msgs.length;
 var el=aiEl(m,ix);th.appendChild(el);aiBubble(el).innerHTML='<span class="aidots"><i></i><i></i><i></i></span>';
 AI.ctl=new AbortController();aiBusy(true);AI.pin=true;aiScroll(true);
 var started=false,raf=0,body={messages:aiHistory(),mode:mode==='chat'?'chat':mode,level:AI.level,hints:AI.hints,deep:AI.deep,adult:aiAdultOn(),notes:AI.notes?AI.notes.text:''};
 function paint(){raf=0;if(!el.isConnected)return;aiBubble(el).innerHTML=aiMd(m.t);aiMath(aiBubble(el));aiScroll();}
 var code='',status=0;
 try{
  var res=await fetch(aiUrl(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AI.ctl.signal});
  status=res.status;
  if(!res.ok){try{code=(await res.json()).error||'';}catch(e){}throw new Error('http');}
  if(!res.body||!res.body.getReader){var tx=await res.text();tx.split('\n').forEach(function(l){if(l.indexOf('data:')===0){try{var j=JSON.parse(l.slice(5));if(j.t)m.t+=j.t;else if(j.error)code=j.error;}catch(e){}}});paint();}
  else{
   var rd=res.body.getReader(),dec=new TextDecoder(),buf='';
   for(;;){
    var r=await rd.read();if(r.done)break;buf+=dec.decode(r.value,{stream:true});var i;
    while((i=buf.indexOf('\n'))>=0){
     var ln=buf.slice(0,i).trim();buf=buf.slice(i+1);if(ln.indexOf('data:')!==0)continue;
     var j;try{j=JSON.parse(ln.slice(5));}catch(e){continue;}
     if(j.t){started=true;m.t+=j.t;if(!raf)raf=requestAnimationFrame(paint);}
     else if(j.k==='think'&&!started){var b0=aiBubble(el);if(!b0.querySelector('.aithk'))b0.innerHTML='<span class="aithk">Eve is thinking</span><span class="aidots"><i></i><i></i><i></i></span>';}
     else if(j.error)code=j.error;
    }
   }
  }
 }catch(e){
  if(e&&e.name==='AbortError'){code='';}
  else if(!code){code=m.t?'':'net';}
 }
 if(raf)cancelAnimationFrame(raf);
 AI.ctl=null;aiBusy(false);
 if(!el.isConnected)return;
 if(m.t){aiBubble(el).innerHTML=aiMd(m.t);aiMath(aiBubble(el));AI.msgs.push(m);aiActs(el,m,true);aiSave();AI.pin&&aiScroll();AIX.lastEl=el;aiPrevActs(el);}
 else{el.remove();if(code)aiFail(th,code,status,true);}
 if(m.t&&code&&code!=='empty')aiFail(th,code,status,false);
}
function aiPrevActs(cur){
 var th=aiTh();if(!th)return;th.querySelectorAll('.aim.eve:not(.aierr)').forEach(function(e){if(e===cur)return;var f=e.querySelector('.aifu');if(f)f.remove();var r=e.querySelector('[data-a="redo"]');if(r)r.remove();});
}
async function aiTask(kind,topic,notesOverride){
 var th=aiTh(),ix=AI.msgs.length,label=kind==='cards'?'Making your flashcards':'Writing your practice test';
 var el=aiEl({r:'e',t:''},ix);th.appendChild(el);aiBubble(el).innerHTML='<span class="aithk">'+label+'</span><span class="aidots"><i></i><i></i><i></i></span>';
 AI.ctl=new AbortController();aiBusy(true);AI.pin=true;aiScroll(true);
 var n=aiCountFor(kind==='cards'?'cards':'test'),notes=notesOverride!=null?notesOverride:(AI.notes?AI.notes.text:''),code='',status=0,data=null;
 try{
  var res=await fetch(aiUrl(),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:kind,topic:topic,notes:notes,count:n,level:AI.level}),signal:AI.ctl.signal});
  status=res.status;var j=null;try{j=await res.json();}catch(e){}
  if(!res.ok||!j||!j.ok){code=(j&&j.error)||'down';}else data=j.data;
 }catch(e){code=(e&&e.name==='AbortError')?'':'net';}
 AI.ctl=null;aiBusy(false);
 if(!el.isConnected)return;
 el.remove();
 if(!data){if(code)aiFail(th,code,status,true);return;}
 var cnt=kind==='cards'?data.cards.length:data.questions.length;
 var m={r:'e',k:kind==='cards'?'cards':'quiz',d:data,t:kind==='cards'?'I made '+cnt+' flashcards for you: '+data.title+'.':'I made a practice test with '+cnt+' questions: '+data.title+'.',mo:kind==='cards'?'cards':'test'};
 AI.msgs.push(m);var e2=aiEl(m,AI.msgs.length-1);th.appendChild(e2);aiFill(e2,m);aiActs(e2,m,true);aiPrevActs(e2);aiSave();aiScroll(true);
}
function aiCountFor(m){var cnt=m==='cards'?[5,10,15,20]:[3,5,8,10],def=m==='cards'?10:5;return AI.count&&cnt.indexOf(AI.count)>=0?AI.count:def;}
function aiStop(){if(AI.ctl)AI.ctl.abort();}
function aiRedo(){
 if(AI.busy)return;var last=AI.msgs[AI.msgs.length-1];
 if(!last||last.r!=='e')return;var mo=last.mo||'chat';AI.msgs.pop();aiSave();
 var th=aiTh(),els=th.querySelectorAll('.aim.eve');if(els.length)els[els.length-1].remove();
 aiRespond(mo);
}
function aiFromText(t,kind){
 if(AI.busy)return;if(!CFG.aiApi)return;
 var src=String(t).slice(0,8000),um={r:'u',t:kind==='cards'?'Make flashcards from that.':'Make a practice test from that.',mo:kind,src:src};AI.msgs.push(um);aiTh().appendChild(aiEl(um,AI.msgs.length-1));aiSave();AI.pin=true;aiScroll(true);aiTask(kind==='cards'?'cards':'quiz','',src);
}
/* ----- flashcards ----- */
function aiCards(host,deck,opt){
 opt=opt||{};var list=deck.cards,q=list.map(function(_,i){return i;}),first={},flip=false,done=0,total=list.length,saved=false;
 function draw(){
  if(!q.length)return end();
  var c=list[q[0]];
  host.innerHTML='<div class="aicf"><div class="aict"><b>'+esc(deck.title)+'</b><span>'+Math.min(done+1,total)+' / '+total+'</span></div><div class="aibar"><i style="width:'+Math.round(done/total*100)+'%"></i></div>'+
   '<button type="button" class="aifc'+(flip?' back':'')+'" data-f="1"><span class="aifl">'+(flip?'Answer':'Question')+'</span><div class="aift">'+aiMd(flip?c.a:c.q)+'</div></button>'+
   '<div class="aicb">'+(flip?'<button type="button" class="btn" data-f="no">Still learning</button><button type="button" class="btn pri" data-f="yes">Got it</button>':'<button type="button" class="btn pri" data-f="1">Show answer</button>')+'</div></div>';
  aiMath(host);
 }
 function end(){
  var ok=0,miss=[];list.forEach(function(c,i){if(first[i])ok++;else miss.push(i);});
  var msg=ok===total?'You knew every card. Lovely work!':ok/total>=.7?'Nice work. A little more practice and these will stick.':'Good effort. Going over them again is how memory grows. You have got this.';
  host.innerHTML='<div class="aicf aiend"><div class="aibig">'+ok+' / '+total+'</div><p>'+msg+'</p><div class="aicb">'+(miss.length?'<button type="button" class="btn" data-f="miss">Practise the '+miss.length+' I missed</button>':'')+(opt.save&&!saved?'<button type="button" class="btn pri" data-f="save">Save deck</button>':'')+(saved?'<span class="hint">Saved to My decks</span>':'')+'<button type="button" class="btn" data-f="again">Start again</button></div></div>';
  host._miss=miss;
 }
 host.onclick=function(e){
  var t=e.target.closest('[data-f]');if(!t||!host.contains(t))return;var a=t.dataset.f,idx=q[0];
  if(a==='1'){flip=!flip;draw();}
  else if(a==='yes'){if(first[idx]===undefined){first[idx]=true;if(opt.onRate)opt.onRate(list[idx],true);}q.shift();done++;flip=false;draw();}
  else if(a==='no'){if(first[idx]===undefined){first[idx]=false;if(opt.onRate)opt.onRate(list[idx],false);}q.push(q.shift());flip=false;draw();}
  else if(a==='again'){q=list.map(function(_,i){return i;});first={};done=0;flip=false;draw();}
  else if(a==='miss'){q=(host._miss||[]).slice();q.forEach(function(i){delete first[i];});done=total-q.length;flip=false;draw();}
  else if(a==='save'){saved=aiSaveDeck(deck);if(saved)toast('Saved to My decks');end();}
  aiReveal(host.querySelector('.aicb'));
 };
 draw();
}
function aiSaveDeck(deck){
 var a=aiDecks();a.unshift({id:Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36),title:deck.title,t:Date.now(),cards:deck.cards.slice(0,200).map(function(c){return {q:c.q,a:c.a,b:0,d:0};})});
 var ok=aiDecksSave(a);if(!ok)toast('Could not save on this device');aiBadge();return ok;
}
/* ----- practice test ----- */
function aiQuiz(host,quiz,opt){
 var qs=quiz.questions,i=0,score=0,miss=[],pick=-1;
 function draw(){
  if(i>=qs.length)return end();var q=qs[i];pick=-1;
  host.innerHTML='<div class="aicf"><div class="aict"><b>'+esc(quiz.title)+'</b><span>Question '+(i+1)+' of '+qs.length+'</span></div><div class="aibar"><i style="width:'+Math.round(i/qs.length*100)+'%"></i></div><div class="aiqq">'+aiMd(q.q)+'</div><div class="aiops">'+
   q.options.map(function(o,k){return '<button type="button" class="aiop" data-o="'+k+'"><span class="aik">'+'ABCDE'.charAt(k)+'</span><span class="aiot">'+aiMd(o,true)+'</span></button>';}).join('')+'</div><div class="aiwhy" style="display:none"></div><div class="aicb"></div></div>';
  aiMath(host);
 }
 function end(){
  var pc=score/qs.length,msg=pc===1?'Perfect score. You really know this!':pc>=.7?'Great work. You have a solid grip on this.':pc>=.4?'A good start. Let us look at what to review.':'This one was tough, and that is okay. Seeing what you missed is the first step to learning it.';
  host.innerHTML='<div class="aicf aiend"><div class="aibig">'+score+' / '+qs.length+'</div><p>'+msg+'</p>'+(miss.length?'<div class="aimiss">'+miss.map(function(k){var q=qs[k];return '<div><b>'+aiMd(q.q,true)+'</b><span>Answer: '+aiMd(q.options[q.answer],true)+'</span>'+(q.why?'<em>'+aiMd(q.why,true)+'</em>':'')+'</div>';}).join('')+'</div>':'')+'<div class="aicb">'+(miss.length?'<button type="button" class="btn pri" data-q="retry">Try the ones I missed</button>':'')+'<button type="button" class="btn" data-q="again">Take it again</button></div></div>';
  aiMath(host);host._miss=miss.slice();
 }
 host.onclick=function(e){
  var t=e.target.closest('[data-o],[data-q]');if(!t||!host.contains(t))return;
  if(t.dataset.o!==undefined){
   if(pick>=0)return;pick=+t.dataset.o;var q=qs[i],ok=pick===q.answer;if(ok)score++;else miss.push(i);
   host.querySelectorAll('.aiop').forEach(function(b,k){b.disabled=true;if(k===q.answer)b.classList.add('ok');else if(k===pick)b.classList.add('no');});
   var w=host.querySelector('.aiwhy');w.style.display='';w.innerHTML='<b>'+(ok?'Correct!':'Not quite.')+'</b> '+(q.why?aiMd(q.why,true):'');aiMath(w);
   host.querySelector('.aicb').innerHTML='<button type="button" class="btn pri" data-q="next">'+(i+1>=qs.length?'See my score':'Next')+'</button>';aiReveal(host.querySelector('.aicb'));
  }else if(t.dataset.q==='next'){i++;draw();}
  else if(t.dataset.q==='again'){i=0;score=0;miss=[];draw();}
  else if(t.dataset.q==='retry'){var ms=(host._miss||[]).map(function(k){return qs[k];});qs=ms;i=0;score=0;miss=[];draw();}
 };
 draw();
}
/* ----- saved decks ----- */
function aiSheet(){
 var s=document.createElement('div');s.className='aish';s.innerHTML='<div class="aish-p" role="dialog" aria-modal="true"><button type="button" class="aish-x" aria-label="Close">'+ico('x',18,2.4)+'</button><div class="aish-b"></div></div>';
 document.body.appendChild(s);
 function close(){s.remove();document.removeEventListener('keydown',kd);aiBadge();}
 function kd(e){if(e.key==='Escape')close();}
 s.addEventListener('click',function(e){if(e.target===s||e.target.closest('.aish-x'))close();});document.addEventListener('keydown',kd);
 return s.querySelector('.aish-b');
}
function aiDecksUI(){
 var body=aiSheet();
 function list(){
  var a=aiDecks();
  body.innerHTML='<h2 style="margin:0 0 4px;font-size:1.3rem">My decks</h2><p class="hint" style="margin:0 0 14px">Cards you get right come back later, and ones you miss come back sooner. That is how memory sticks.</p>'+
   (a.length?a.map(function(d){var due=aiDueN(d);return '<div class="aidk" data-id="'+d.id+'"><div><b>'+esc(d.title)+'</b><span>'+d.cards.length+' cards &middot; '+(due?due+' ready to review':'all caught up')+'</span></div><div class="row" style="gap:6px;flex-wrap:nowrap"><button type="button" class="btn sm pri" data-k="go">'+(due?'Review':'Practise')+'</button><button type="button" class="btn sm" data-k="del" aria-label="Delete deck">'+ico('x',14,2.4)+'</button></div></div>';}).join(''):'<div class="note">No saved decks yet. Ask Eve for flashcards, then tap <b>Save deck</b> at the end.</div>');
 }
 list();
 body.onclick=function(e){
  var b=e.target.closest('[data-k]');if(!b)return;
  if(b.dataset.k==='back'){list();return;}
  var row=b.closest('[data-id]'),all=aiDecks(),d=all.filter(function(x){return x.id===row.dataset.id;})[0];if(!d)return;
  if(b.dataset.k==='del'){aiDecksSave(all.filter(function(x){return x.id!==d.id;}));list();aiBadge();return;}
  var now=Date.now(),idx=[];d.cards.forEach(function(c,i){if(!c.d||c.d<=now)idx.push(i);});
  if(!idx.length)d.cards.forEach(function(c,i){idx.push(i);});
  var deck={title:d.title,cards:idx.map(function(i){var c=d.cards[i];return {q:c.q,a:c.a,_i:i};})};
  body.innerHTML='<button type="button" class="btn sm" data-k="back" style="margin-bottom:12px">Back</button><div class="aiwg"></div>';
  aiCards(body.querySelector('.aiwg'),deck,{onRate:function(c,ok){
   var cur=aiDecks(),dd=cur.filter(function(x){return x.id===d.id;})[0];if(!dd)return;var cc=dd.cards[c._i];if(!cc)return;
   if(ok){cc.b=Math.min(5,(cc.b||0)+1);cc.d=Date.now()+AIBOX[cc.b]*864e5;}else{cc.b=0;cc.d=0;}
   aiDecksSave(cur);}});
 };
}
/* ----- page ----- */
function aiGrow(){var t=$$('aiin');if(!t)return;if(!t.value){t.style.height='';t.style.overflowY='hidden';return;}t.style.height='auto';var sh=t.scrollHeight;t.style.height=Math.min(sh,170)+'px';t.style.overflowY=sh>171?'auto':'hidden';}
function aiModeSet(m){
 AI.mode=m;aiSave();
 var c=$$('aichips');if(c){c.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.m===m);});var on=c.querySelector('.on');if(on&&on.scrollIntoView&&c.scrollWidth>c.clientWidth){c.scrollLeft=Math.max(0,on.offsetLeft-12);}}
 var t=$$('aiin');if(t)t.placeholder=aiPh(m);
 aiOpts();
}
function aiAdultStored(){try{return localStorage.getItem('eveadult')==='1';}catch(e){return false;}}
function aiAdultSet(v){try{if(v)localStorage.setItem('eveadult','1');else localStorage.removeItem('eveadult');}catch(e){}}
function aiAdultOn(){return aiAdultStored()&&(AI.level==='college'||AI.level==='advanced');}
function aiAsk18(yes){
 var m=document.createElement('div');m.className='modal show';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','18+ mode');
 m.innerHTML='<div class="box aiask"><h3 style="margin:0 0 6px">Turn on 18+ mode?</h3><p class="hint" style="margin:0">In 18+ mode Eve talks frankly about adult biology and health topics, and she is more playful and a little cheeky. She still does not do romance roleplay or explicit content. Only turn it on if you are 18 or older.</p><div class="bar"><span class="sp"></span><button type="button" class="btn" data-x="no">Cancel</button><button type="button" class="btn pri" data-x="yes">I am 18 or older</button></div></div>';
 function close(){m.remove();document.removeEventListener('keydown',key);}
 function key(e){if(e.key==='Escape')close();}
 m.addEventListener('click',function(e){var x=e.target.closest('[data-x]');if(x){close();if(x.getAttribute('data-x')==='yes')yes();}else if(e.target===m)close();});
 document.addEventListener('keydown',key);document.body.appendChild(m);
 var b=m.querySelector('[data-x="yes"]');if(b)b.focus();
}
function aiOpts(){
 var o=$$('aiopt');if(!o)return;var m=AI.mode,tk=(m==='cards'||m==='test');
 var cnt=m==='cards'?[5,10,15,20]:[3,5,8,10],cur=aiCountFor(m);
 o.innerHTML='<label class="aisel">Level <select class="sel" id="ailv">'+AILV.map(function(l){return '<option value="'+l[0]+'"'+(AI.level===l[0]?' selected':'')+'>'+l[1]+'</option>';}).join('')+'</select></label>'+
  (tk?'<label class="aisel">'+(m==='cards'?'Cards':'Questions')+' <select class="sel" id="aicnt">'+cnt.map(function(n){return '<option value="'+n+'"'+(cur===n?' selected':'')+'>'+n+'</option>';}).join('')+'</select></label>':'')+
  '<button type="button" class="aipill'+(AI.hints?' on':'')+'" id="aihint" aria-pressed="'+AI.hints+'" title="Eve guides you with hints before giving the answer">Hints first</button>'+
  '<button type="button" class="aipill'+(AI.deep?' on':'')+'" id="aideep" aria-pressed="'+AI.deep+'" title="Slower, but better for hard problems">Think deeper</button>'+
  '<button type="button" class="aipill'+(aiAdultOn()?' on':'')+'" id="aiadult" aria-pressed="'+aiAdultOn()+'" title="Frank adult talk about biology and health, and a more playful Eve. For people 18 and over.">18+ mode</button>';
 $$('ailv').onchange=function(){AI.level=this.value;aiSave();if(aiAdultStored()&&AI.level!=='college'&&AI.level!=='advanced'){aiAdultSet(false);aiOpts();toast('18+ mode is off. It needs the College or Advanced level.');}};
 $$('aiadult').onclick=function(){
  if(aiAdultOn()){aiAdultSet(false);aiOpts();toast('18+ mode is off');return;}
  aiAsk18(function(){aiAdultSet(true);if(AI.level!=='college'&&AI.level!=='advanced'){AI.level='college';aiSave();}aiOpts();toast('18+ mode is on');});};
 if(tk)$$('aicnt').onchange=function(){AI.count=+this.value;aiSave();};
 $$('aihint').onclick=function(){AI.hints=!AI.hints;this.classList.toggle('on',AI.hints);this.setAttribute('aria-pressed',AI.hints);aiSave();toast(AI.hints?'Hints first is on. Eve will guide you before giving answers.':'Hints first is off');};
 $$('aideep').onclick=function(){AI.deep=!AI.deep;this.classList.toggle('on',AI.deep);this.setAttribute('aria-pressed',AI.deep);aiSave();toast(AI.deep?'Think deeper is on. Replies are slower but better for hard problems.':'Think deeper is off');};
}
function aiPage(){
 nav('eve');aiVoiceInit();
 if(!AI.loaded){aiLoad();AI.loaded=true;}
 AI.busy=false;AI.ctl=null;AI.pin=true;var off=!CFG.aiApi;
 app.innerHTML='<div class="aiw"><div class="aihd"><span class="aiav">'+ico('spark',24,1.8)+'</span><div style="min-width:0"><h1>Eve</h1><p>Your study buddy</p></div><span class="sp"></span><button type="button" class="btn sm aibt" id="aidk" aria-label="My decks">'+ico('deck',15,2)+'<span>My decks</span><em id="aibg" style="display:none"></em></button><button type="button" class="btn sm aibt" id="ainew" aria-label="New chat">'+ico('plus',15,2.4)+'<span>New chat</span></button></div>'+
  '<div class="aichips" id="aichips">'+AIMODES.map(function(m){return '<button type="button" data-m="'+m[0]+'">'+m[1]+'</button>';}).join('')+'</div>'+
  '<div class="aiopt" id="aiopt"></div><div class="aith" id="aith" role="log" aria-live="polite"></div>'+
  '<div class="aicomp" id="aicomp"><div class="ainote" id="ainote" style="display:none"></div><div class="aicrow"><button type="button" class="aiicon" id="aiat" aria-label="Attach notes" title="Attach notes (PDF, Word or text)"'+(off?' disabled':'')+'>'+ico('clip',20,2)+'</button><textarea id="aiin" rows="1" maxlength="6000" aria-label="Message Eve" placeholder=""'+(off?' disabled':'')+'></textarea><button type="button" class="aisend" id="aisend" aria-label="Send"'+(off?' disabled':'')+'>'+ico('send',20,2.4)+'</button></div><p class="aifoot">Eve is an AI and can make mistakes.<span class="aif2"> Check anything important.</span></p></div></div><input type="file" id="aifile" hidden accept=".txt,.md,.markdown,.csv,.tsv,.json,.html,.htm,.pdf,.docx">';
 aiModeSet(AI.mode);aiNotesUI();aiRender();aiBadge();
 $$('aichips').onclick=function(e){var b=e.target.closest('button');if(b){aiModeSet(b.dataset.m);$$('aiin').focus({preventScroll:true});}};
 $$('ainew').onclick=function(){if(AI.busy)aiStop();AI.msgs=[];AI.notes=null;aiSave();aiNotesUI();aiClearErr();aiRender();window.scrollTo(0,0);toast('Started a new chat');};
 $$('aidk').onclick=aiDecksUI;
 var inp=$$('aiin'),fine=window.matchMedia&&matchMedia('(pointer:fine)').matches;
 inp.oninput=aiGrow;
 inp.onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey&&fine&&!e.isComposing){e.preventDefault();if(!AI.busy)aiSend(inp.value);}};
 $$('aisend').onclick=function(){if(AI.busy)aiStop();else aiSend(inp.value);};
 $$('aiat').onclick=function(){$$('aifile').click();};
 $$('aifile').onchange=async function(e){
  var f=e.target.files[0];e.target.value='';if(!f)return;
  toast('Reading '+f.name+'...');
  try{AI.notes=await aiReadNotes(f);aiSave();aiNotesUI();toast('Eve has your notes. Ask her about them!');}
  catch(x){toast((x&&x.message)||'I could not read that file');}
 };
 $$('ainote').onclick=function(e){if(e.target.closest('[data-a="rmnote"]')){AI.notes=null;aiSave();aiNotesUI();}};
 var th=$$('aith');
 th.onclick=function(e){
  var s=e.target.closest('[data-s]');
  if(s){aiModeSet(s.dataset.s);var t=$$('aiin');t.focus();if(s.dataset.s==='summarize'&&!AI.notes)$$('aifile').click();return;}
  var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,msgEl=b.closest('.aim'),m=msgEl&&AI.msgs[+msgEl.dataset.i];
  if(a==='cp'){var pre=b.closest('.aicode').querySelector('pre');aiCopy(pre.textContent);}
  else if(a==='copy'&&m)aiCopy(m.t);
  else if(a==='say'&&m)aiSpeak(m.t,b);
  else if(a==='redo')aiRedo();
  else if(a==='retry'){aiClearErr();var l=AI.msgs[AI.msgs.length-1];if(l&&l.r==='u')aiRespond(l.mo||AI.mode);}
  else if(a==='mkc'&&m)aiFromText(m.t,'cards');
  else if(a==='mkt'&&m)aiFromText(m.t,'test');
  else if(a==='fu'){var f=AIFU[+b.dataset.k];if(f)aiSend(f[1],f[2]);}
 };
 window.addEventListener('scroll',aiOnScroll,{passive:true});
}
function aiOnScroll(){if(!aiTh()){window.removeEventListener('scroll',aiOnScroll);return;}if(!AI.busy)return;AI.pin=aiNear();}
function aiCopy(t){
 function ok(){toast('Copied');}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){aiCopyOld(t);});}else aiCopyOld(t);
}
function aiCopyOld(t){try{var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();toast('Copied');}catch(e){toast('Could not copy');}}
/* ---------- Eve IDE ---------- */
var PYBASES=[].concat(/^https?:/.test(location.protocol)?[new URL(EVE_BASE+'pyodide/',location.href).href]:[],['https://cdn.jsdelivr.net/pyodide/v0.27.7/full/','https://cdn.jsdelivr.net/npm/pyodide@0.27.7/','https://unpkg.com/pyodide@0.27.7/']);
var IDEW=[
"var py=null,stdin=[],si=0,ob=[],eb=[],mem={},STALL=20000;",
"var SZ={'pyodide.js':14913,'pyodide.asm.js':1255688,'pyodide-lock.json':112205,'python_stdlib.zip':2360737,'pyodide.asm.wasm':10105545},TOTAL=0;",
"for(var k0 in SZ)TOTAL+=SZ[k0];",
"var _fetch=self.fetch.bind(self),_imp=self.importScripts.bind(self);",
"self.fetch=function(u,o){var s=typeof u==='string'?u:(u&&u.url)||String(u);if(mem.base&&s.indexOf(mem.base)===0){var n=s.slice(mem.base.length).split(/[?#]/)[0];if(mem[n])return Promise.resolve(new Response(mem[n].b.slice(0),{status:200,headers:{'Content-Type':mem[n].t}}));}return _fetch(u,o);};",
"function fl(a,t){if(a.length){postMessage({t:t,s:new TextDecoder().decode(new Uint8Array(a))});a.length=0;}}",
"function clean(m){var L=String(m).split('\\n'),o=[];for(var i=0;i<L.length;i++){var l=L[i];if(/^\\s+File \"(\\/lib\\/python|\\/home\\/pyodide|<exec>|<console>)/.test(l)&&!/<exec>/.test(l)){i++;continue;}o.push(l.replace(/File \"<exec>\"/,'File \"main.py\"'));}return o.join('\\n').replace(/\\s+$/,'');}",
"function host(u){try{return new URL(u).host+(/\\/npm\\//.test(u)?' (npm)':'');}catch(e){return String(u);}}",
"async function grab(url,onb){",
" var ac=new AbortController(),tm=0;",
" function arm(){clearTimeout(tm);tm=setTimeout(function(){ac.abort();},STALL);}",
" arm();",
" try{",
"  var r=await _fetch(url,{signal:ac.signal});",
"  if(!r.ok)throw new Error(r.status===404?'file not found':'error '+r.status);",
"  if(/text\\/html/i.test(r.headers.get('content-type')||''))throw new Error('file not found');",
"  if(!r.body||!r.body.getReader){var ab=await r.arrayBuffer();onb(ab.byteLength);return ab;}",
"  var rd=r.body.getReader(),parts=[],n=0;",
"  for(;;){var x=await rd.read();if(x.done)break;parts.push(x.value);n+=x.value.length;onb(x.value.length);arm();}",
"  var out=new Uint8Array(n),o=0;for(var i=0;i<parts.length;i++){out.set(parts[i],o);o+=parts[i].length;}",
"  return out.buffer;",
" }catch(e){if(e&&e.name==='AbortError')throw new Error('no data for '+Math.round(STALL/1000)+' seconds');throw e;}",
" finally{clearTimeout(tm);}",
"}",
"async function boot(bases){",
" var why=[];",
" for(var i=0;i<bases.length;i++){",
"  var base=bases[i],done=0,last=-1;",
"  var prog=function(n){done+=n;var p=Math.min(99,Math.floor(done*100/TOTAL));if(p!==last){last=p;postMessage({t:'prog',p:p});}};",
"  mem={base:base};",
"  try{",
"   postMessage({t:'prog',p:0});",
"   await grab(base+'pyodide.js',prog);",
"   await grab(base+'pyodide.asm.js',prog);",
"   mem['pyodide-lock.json']={b:await grab(base+'pyodide-lock.json',prog),t:'application/json'};",
"   mem['python_stdlib.zip']={b:await grab(base+'python_stdlib.zip',prog),t:'application/zip'};",
"   mem['pyodide.asm.wasm']={b:await grab(base+'pyodide.asm.wasm',prog),t:'application/wasm'};",
"   postMessage({t:'status',s:'Starting Python...'});",
"   _imp(base+'pyodide.js');",
"   var p=await loadPyodide({indexURL:base});",
"   mem={};return p;",
"  }catch(e){mem={};why.push(host(base)+': '+((e&&e.message)||e));}",
" }",
" var err=new Error('Could not load the Python engine.\\n'+why.join('\\n'));err.load=1;throw err;",
"}",
"onmessage=async function(e){var m=e.data;",
" if(m.stall)STALL=m.stall;",
" try{",
"  if(!py){postMessage({t:'status',s:'Loading Python...'});py=await boot(m.bases);",
"   py.setStdout({raw:function(b){ob.push(b&255);if(b===10||ob.length>=512)fl(ob,'out');}});",
"   py.setStderr({raw:function(b){eb.push(b&255);if(b===10||eb.length>=512)fl(eb,'err');}});",
"   py.setStdin({stdin:function(){return si<stdin.length?stdin[si++]:undefined;}});",
"   postMessage({t:'ready'});}",
"  stdin=String(m.stdin||'').replace(/\\r\\n?/g,'\\n').split('\\n');if(stdin.length&&stdin[stdin.length-1]==='')stdin.pop();si=0;",
"  postMessage({t:'status',s:'Running...'});",
"  try{await py.loadPackagesFromImports(m.code);}catch(x){}",
"  var g=py.globals.get('dict')();g.set('__name__','__main__');",
"  try{await py.runPythonAsync(m.code,{globals:g});}finally{g.destroy();fl(ob,'out');fl(eb,'err');}",
"  postMessage({t:'done',ok:true});",
" }catch(x){fl(ob,'out');fl(eb,'err');postMessage({t:'err',s:clean((x&&x.message)||x)+'\\n'});postMessage({t:'done',ok:false,load:x&&x.load?1:0});}",
"};"
].join('\n');
var IDET={
 python:'# Python runs right here on your device.\nname = input("Your name? ")\nprint("Hello,", name + "!")\n\nfor i in range(1, 4):\n    print(i, "x", i, "=", i * i)\n',
 c:'#include <stdio.h>\n\nint main(void) {\n    char name[64];\n    printf("Your name? ");\n    scanf("%63s", name);\n    printf("Hello, %s!\\n", name);\n    for (int i = 1; i <= 3; i++) {\n        printf("%d x %d = %d\\n", i, i, i * i);\n    }\n    return 0;\n}\n',
 java:'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        System.out.print("Your name? ");\n        String name = in.next();\n        System.out.println("Hello, " + name + "!");\n        for (int i = 1; i <= 3; i++) {\n            System.out.println(i + " x " + i + " = " + (i * i));\n        }\n    }\n}\n'
};
var IDEN={python:'main.py',c:'main.c',java:'Main.java'},IDEL={python:'Python',c:'C',java:'Java'};
var IDE={lang:'python',code:{python:IDET.python,c:IDET.c,java:IDET.java},stdin:'',w:null,busy:false,tok:0,ab:null,wReady:false};
function ideLoad(){try{var d=JSON.parse(localStorage.getItem('eveide')||'null');if(d&&d.code){['python','c','java'].forEach(function(k){if(typeof d.code[k]==='string')IDE.code[k]=d.code[k];});if(IDET[d.lang])IDE.lang=d.lang;if(typeof d.stdin==='string')IDE.stdin=d.stdin;}}catch(e){}}
function ideSave(){try{localStorage.setItem('eveide',JSON.stringify({lang:IDE.lang,code:IDE.code,stdin:IDE.stdin}));}catch(e){}}
function ideHl(src,lang){
 var kw={python:'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield',
  c:'auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while',
  java:'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static super switch synchronized this throw throws try void volatile while var record true false null String'}[lang];
 var str='"(?:\\\\.|[^"\\\\\\n])*"?|\'(?:\\\\.|[^\'\\\\\\n])*\'?';
 var cm=lang==='python'?'#.*|\'\'\'[\\s\\S]*?(?:\'\'\'|$)|"""[\\s\\S]*?(?:"""|$)':'\\/\\/.*|\\/\\*[\\s\\S]*?(?:\\*\\/|$)';
 var pre=lang==='c'?'|^[ \\t]*#[ \\t]*\\w+':'';
 var re=new RegExp('('+cm+'|'+str+pre+')|\\b(\\d[\\w.]*)\\b|\\b('+kw.split(' ').join('|')+')\\b','gm');
 var out='',last=0,m;
 while((m=re.exec(src))){
  if(m[0]==='')break;
  out+=esc(src.slice(last,m.index));
  var c=m[1]!==undefined?(/^\s*#\s*\w/.test(m[1])&&lang==='c'?'hp':(/^(#|\/\/|\/\*)/.test(m[1])?'hc':'hs')):(m[2]!==undefined?'hn':'hk');
  out+='<span class="'+c+'">'+esc(m[0])+'</span>';last=m.index+m[0].length;
 }
 return out+esc(src.slice(last))+'\n ';
}
function ideOut(s,cls){var o=$$('ideout');if(!o)return;var sp=document.createElement('span');if(cls)sp.className=cls;sp.textContent=s;o.appendChild(sp);var near=o.scrollHeight-o.scrollTop-o.clientHeight<80;if(near)o.scrollTop=o.scrollHeight;if(o.childNodes.length>4000)o.removeChild(o.firstChild);}
function ideStatus(s){var e=$$('idest');if(e)e.textContent=s||'';}
function ideSync(){
 var t=$$('idecode');if(!t)return;
 $$('idehl').firstChild.innerHTML=ideHl(t.value,IDE.lang);
 var n=t.value.split('\n').length,g='';for(var i=1;i<=n;i++)g+=i+'\n';$$('idegut').textContent=g;
 $$('idehl').scrollTop=t.scrollTop;$$('idehl').scrollLeft=t.scrollLeft;$$('idegut').scrollTop=t.scrollTop;
}
function ideBusy(b){IDE.busy=b;var r=$$('iderun'),s=$$('idestop');if(r){r.disabled=b;r.classList.toggle('busy',b);}if(s)s.style.display=b?'':'none';}
function ideWd(on){clearTimeout(IDE.wd);IDE.wd=0;if(!on)return;IDE.wd=setTimeout(function(){IDE.wd=0;if(!IDE.busy||IDE.wReady)return;try{IDE.w.terminate();}catch(x){}IDE.w=null;ideOut('\nThe Python engine did not start in time. Check your connection and try again.\n','ide-e');ideStatus('');ideBusy(false);},60000);}
function ideWorker(){
 if(IDE.w)return IDE.w;
 var w=new Worker(URL.createObjectURL(new Blob([IDEW],{type:'text/javascript'})));
 w.onmessage=function(e){var m=e.data;
  if(IDE.w!==w)return;
  if(m.t==='out')ideOut(m.s);else if(m.t==='err')ideOut(m.s,'ide-e');
  else if(m.t==='prog'){ideStatus('Loading Python... '+m.p+'% (about 14 MB, only the first time)');ideWd(true);}
  else if(m.t==='status'){ideStatus(m.s);if(m.s==='Starting Python...')ideWd(true);}
  else if(m.t==='ready'){IDE.wReady=true;ideWd(false);}
  else if(m.t==='done'){ideWd(false);var ms=Math.round(performance.now()-IDE.t0);
   if(m.load)ideOut('\nCheck your connection and try again.\n','ide-i');
   else ideOut('\n'+(m.ok?'Finished':'Stopped by an error')+' in '+(ms>1500?(ms/1000).toFixed(1)+' s':ms+' ms')+'\n','ide-i');
   ideStatus('');ideBusy(false);}};
 w.onerror=function(){ideWd(false);ideOut('\nThe Python engine could not be started in this browser.\n','ide-e');ideStatus('');ideBusy(false);IDE.w=null;try{w.terminate();}catch(x){}};
 IDE.w=w;return w;
}
async function ideRemote(lang,code,stdin,sig){
 var base=(CFG.runApi||'https://ce.judge0.com').replace(/\/+$/,''),id={c:50,java:62}[lang];
 var b64=function(s){return btoa(unescape(encodeURIComponent(s)));},un=function(s){try{return s?decodeURIComponent(escape(atob(s))):'';}catch(e){return s||'';}};
 var r=await fetch(base+'/submissions?base64_encoded=true&wait=false',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source_code:b64(code),language_id:id,stdin:b64(stdin||'')}),signal:sig});
 if(r.status===429)throw {busy:1};if(!r.ok)throw {http:r.status};
 var tok=(await r.json()).token;if(!tok)throw {http:0};
 for(var i=0;i<50;i++){
  await new Promise(function(res){setTimeout(res,i<3?500:900);});
  if(sig.aborted)throw {abort:1};
  var g=await fetch(base+'/submissions/'+encodeURIComponent(tok)+'?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,time,memory',{signal:sig});
  if(g.status===429)throw {busy:1};if(!g.ok)throw {http:g.status};
  var d=await g.json();
  if(d.status&&d.status.id>2)return {id:d.status.id,desc:d.status.description,out:un(d.stdout),err:un(d.stderr),comp:un(d.compile_output),msg:un(d.message),time:d.time,mem:d.memory};
 }
 throw {timeout:1};
}
async function ideRun(){
 if(IDE.busy)return;
 var code=$$('idecode').value,stdin=$$('idein').value,lang=IDE.lang,tok=++IDE.tok;
 if(!code.trim()){toast('Write some code first');return;}
 ideSave();$$('ideout').textContent='';ideBusy(true);IDE.t0=performance.now();
 if(lang==='python'){
  ideStatus(IDE.wReady?'Running...':'Loading Python...');
  if(!IDE.wReady)ideWd(true);
  ideWorker().postMessage({t:'run',code:code,stdin:stdin,bases:PYBASES});
  return;
 }
 ideStatus('Sending to the compile server...');
 IDE.ab=new AbortController();
 try{
  var d=await ideRemote(lang,code,stdin,IDE.ab.signal);
  if(tok!==IDE.tok)return;
  if(d.id===6){ideOut(d.comp||d.msg||'Compilation failed.','ide-e');ideOut('\nCompilation failed.\n','ide-i');}
  else{
   if(d.out)ideOut(d.out);if(d.err)ideOut(d.err,'ide-e');
   if(d.id===5)ideOut('\nTime limit exceeded. The program ran for too long.\n','ide-e');
   else if(d.id===3)ideOut('\nFinished'+(d.time?' in '+Math.round(parseFloat(d.time)*1000)+' ms':'')+'\n','ide-i');
   else if(d.id===13||d.id===14)ideOut('\n'+(d.msg||d.desc)+'\n','ide-e');
   else ideOut('\n'+(d.desc||'Stopped by an error')+(d.msg?': '+d.msg:'')+'\n','ide-e');
  }
 }catch(e){
  if(tok!==IDE.tok)return;
  if(e&&(e.abort||e.name==='AbortError'))ideOut('Stopped.\n','ide-i');
  else if(e&&e.busy)ideOut('The free compile server is busy right now. Wait a minute and try again. Python programs are not affected.\n','ide-e');
  else if(e&&e.timeout)ideOut('The compile server took too long to answer. Try again in a moment.\n','ide-e');
  else if(e&&e.http)ideOut('The compile server answered with an error ('+e.http+'). Try again in a moment.\n','ide-e');
  else ideOut('The free C and Java compile server could not be reached. Check your connection and try again. Python programs still run on your device.\n','ide-e');
 }
 if(tok===IDE.tok){ideStatus('');ideBusy(false);}
}
function ideStop(){
 if(!IDE.busy)return;IDE.tok++;
 if(IDE.lang==='python'&&IDE.w){ideWd(false);try{IDE.w.terminate();}catch(e){}IDE.w=null;IDE.wReady=false;ideStatus('');ideOut('\nStopped.\n','ide-i');}
 else if(IDE.ab){try{IDE.ab.abort();}catch(e){}ideOut('\nStopped.\n','ide-i');}
 ideStatus('');ideBusy(false);
}
function ideSetLang(l){
 var t=$$('idecode');if(t)IDE.code[IDE.lang]=t.value;
 IDE.lang=l;ideSave();
 $$('idetabs').querySelectorAll('a').forEach(function(a){a.classList.toggle('on',a.dataset.l===l);});
 t.value=IDE.code[l];$$('idefn').textContent=IDEN[l];
 $$('idenote').style.display=l==='python'?'none':'';
 ideSync();
}
function ideIns(txt){var t=$$('idecode');t.focus();var s=t.selectionStart,e=t.selectionEnd;t.setRangeText(txt,s,e,'end');t.dispatchEvent(new Event('input',{bubbles:true}));}
function ideKey(e){
 var t=e.target;
 if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();ideRun();return;}
 if(e.key==='Tab'){e.preventDefault();var s=t.selectionStart,en=t.selectionEnd,v=t.value;
  if(s!==en&&v.slice(s,en).indexOf('\n')>=0){var a=v.lastIndexOf('\n',s-1)+1,blk=v.slice(a,en),nb=e.shiftKey?blk.replace(/^( {1,4}|\t)/gm,''):blk.replace(/^/gm,'    ');t.setRangeText(nb,a,en,'select');t.selectionStart=a;t.selectionEnd=a+nb.length;}
  else if(e.shiftKey){var b=v.lastIndexOf('\n',s-1)+1,m=/^( {1,4}|\t)/.exec(v.slice(b));if(m){t.setRangeText('',b,b+m[0].length,'preserve');t.selectionStart=t.selectionEnd=Math.max(b,s-m[0].length);}}
  else ideIns('    ');
  t.dispatchEvent(new Event('input',{bubbles:true}));return;}
 if(e.key==='Enter'&&!e.ctrlKey&&!e.metaKey){
  e.preventDefault();var s2=t.selectionStart,v2=t.value,ls=v2.lastIndexOf('\n',s2-1)+1,line=v2.slice(ls,s2),ind=/^[ \t]*/.exec(line)[0];
  var open=IDE.lang==='python'?/:\s*(#.*)?$/.test(line):/[{(\[]\s*$/.test(line);
  var close=IDE.lang!=='python'&&/^[ \t]*[}\])]/.test(v2.slice(s2));
  if(open&&close){var ins='\n'+ind+'    \n'+ind;t.setRangeText(ins,s2,t.selectionEnd,'end');t.selectionStart=t.selectionEnd=s2+ind.length+5;}
  else ideIns('\n'+ind+(open?'    ':''));
  t.dispatchEvent(new Event('input',{bubbles:true}));return;}
}
function idePage(){nav('ide');
 ideLoad();
 app.innerHTML='<h1 style="font-size:2.2rem">Eve IDE</h1><p class="lead" style="font-size:1rem">Write and run Python, C and Java programs. Press the play button, or Ctrl+Enter.</p>'+
 '<div class="idebar"><div class="seg" id="idetabs">'+['python','c','java'].map(function(l){return '<a href="javascript:void 0" data-l="'+l+'"'+(l===IDE.lang?' class="on"':'')+'>'+IDEL[l]+'</a>';}).join('')+'</div>'+
 '<div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn" id="idestop" style="display:none">Stop</button><button class="btn pri" id="iderun" aria-label="Run" title="Run (Ctrl+Enter)">'+ico('play',20,2)+'</button></div></div>'+
 '<div class="card ideed"><div class="idehead"><span id="idefn">'+IDEN[IDE.lang]+'</span><span class="row" style="gap:6px"><button class="btn sm" id="ideopen">Open</button><button class="btn sm" id="idesave">Save</button><button class="btn sm" id="idereset">Example</button></span></div>'+
 '<div class="idebody"><pre class="idegut" id="idegut" aria-hidden="true"></pre><div class="idemain"><pre class="idehl" id="idehl" aria-hidden="true"><code></code></pre><textarea id="idecode" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Code editor"></textarea></div></div>'+
 '<div class="idekeys" id="idekeys">'+['Tab','{','}','(',')','[',']','"',';',':','#','<','>','='].map(function(k){return '<button type="button" tabindex="-1" data-k="'+k+'">'+(k==='Tab'?'Tab':esc(k))+'</button>';}).join('')+'</div></div>'+
 '<p class="hint idenote" id="idenote" style="margin:8px 2px 0;display:none">C and Java are compiled on a free online server, so your code is sent to it. Python runs on your device. In Java, name the main class <b>Main</b>.</p>'+
 '<div class="card" style="margin-top:12px;padding:14px"><label class="hint" for="idein" style="display:block;margin-bottom:6px">Input for your program, one value per line (optional)</label><textarea id="idein" class="idein" rows="2" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="Type what input() / scanf / Scanner should read"></textarea></div>'+
 '<div class="card ideoc"><div class="idehead"><span>Output <span class="hint" id="idest" style="margin-left:8px"></span></span><button class="btn sm" id="ideclr">Clear</button></div><pre class="ideout" id="ideout" aria-live="polite"></pre></div>';
 var t=$$('idecode');t.value=IDE.code[IDE.lang];$$('idein').value=IDE.stdin;$$('idenote').style.display=IDE.lang==='python'?'none':'';
 t.addEventListener('input',function(){IDE.code[IDE.lang]=t.value;ideSync();ideSave();});
 t.addEventListener('scroll',function(){$$('idehl').scrollTop=t.scrollTop;$$('idehl').scrollLeft=t.scrollLeft;$$('idegut').scrollTop=t.scrollTop;});
 t.addEventListener('keydown',ideKey);
 $$('idein').addEventListener('input',function(){IDE.stdin=this.value;ideSave();});
 $$('idetabs').querySelectorAll('a').forEach(function(a){a.onclick=function(){if(IDE.busy)ideStop();ideSetLang(a.dataset.l);};});
 $$('iderun').onclick=ideRun;$$('idestop').onclick=ideStop;$$('ideclr').onclick=function(){$$('ideout').textContent='';};
 $$('idereset').onclick=function(){t.value=IDET[IDE.lang];IDE.code[IDE.lang]=t.value;ideSync();ideSave();};
 $$('idesave').onclick=function(){fileSave(new Blob([t.value],{type:'text/plain'}),IDEN[IDE.lang]);};
 $$('ideopen').onclick=function(){var i=document.createElement('input');i.type='file';i.accept='.py,.c,.h,.java,.txt';i.onchange=function(){var f=i.files[0];if(!f)return;if(f.size>500000){toast('That file is too large');return;}
   f.text().then(function(tx){var x=(/\.(\w+)$/.exec(f.name)||[])[1];var l={py:'python',c:'c',h:'c',java:'java'}[(x||'').toLowerCase()];if(l&&l!==IDE.lang)ideSetLang(l);t.value=tx;IDE.code[IDE.lang]=tx;ideSync();ideSave();});};i.click();};
 $$('idekeys').querySelectorAll('button').forEach(function(b){b.onpointerdown=function(e){e.preventDefault();};b.onclick=function(){ideIns(b.dataset.k==='Tab'?'    ':b.dataset.k);};});
 ideSync();ideBusy(false);
}
window.addEventListener('hashchange',function(){if(curR()!=='eve')aiLeave();if(curR()!=='ide'&&IDE.w){ideWd(false);try{IDE.w.terminate();}catch(e){}IDE.w=null;IDE.wReady=false;IDE.busy=false;}});


function route(){var r=curR();menu(false);app.onclick=null;tsStop();ltStop();
 var known=r===''||r==='home'||r==='404'||ROUTES.indexOf(r)>=0;if(!known)r=PM?'404':'';
 setTitle(r===''?'home':r);
 app.classList.toggle('full',r===''||r==='home'||r==='404'||!!FULL[r]||!!LOCKED[r]||(['planner','image','pdf','virus','calc','deal','tts','qr','grab','convert','ide','eve','translate'].indexOf(r)<0));
 if(r==='404')notFound();else if(LOCKED[r])lockedPage(r);else if(r==='planner')planner();else if(r==='image')imagetool();else if(r==='pdf')pdftool();else if(r==='virus')vtool();else if(r==='calc')calcPage();else if(r==='deal')dealPage();else if(r==='tts')ttsPage();else if(r==='translate')translatePage();else if(r==='qr')qrPage();else if(r==='grab')grabPage();else if(r==='convert')convertPage();else if(r==='ide')idePage();else if(r==='eve')aiPage();else if(FULL[r])FULL[r]();else home();
 fixLinks(app);window.scrollTo(0,0);}

document.getElementById('yr').textContent=new Date().getFullYear();
if(PM){
 /* pages are real files; links move between them without reloading the whole site */
 document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;
  var h=a.getAttribute('href'),r=null,m=/^#\/([a-z-]*)$/.exec(h);
  if(m)r=m[1];
  else if(a.origin===location.origin){var p=a.pathname.replace(/index\.html$/,'');if(p.indexOf(BASEP)===0){r=p.slice(BASEP.length).replace(/^\/+|\/+$/g,'');}}
  if(r===null||(r!==''&&ROUTES.indexOf(r)<0))return;
  e.preventDefault();go(r);
 });
 window.addEventListener('popstate',function(){INIT404=false;fire();});
 /* old bookmarks such as /#/eve open the matching page */
 function oldHash(){var oh=/^#\/([a-z-]*)$/.exec(location.hash);
  if(oh&&(oh[1]===''||ROUTES.indexOf(oh[1])>=0)){try{history.replaceState(null,'',U(oh[1]));INIT404=false;}catch(e){}}}
 oldHash();window.addEventListener('hashchange',oldHash);
 window.addEventListener('pagehide',function(){try{aiLeave();}catch(e){}});
 /* the header and footer links are written relative to this file; make them fixed addresses so they stay right after the page changes */
 document.querySelectorAll('#hdr a[href], .foot a[href]').forEach(function(a){
  if(a.origin!==location.origin)return;
  var p=a.pathname.replace(/index\.html$/,'');if(p.indexOf(BASEP)!==0)return;
  var r=p.slice(BASEP.length).replace(/^\/+|\/+$/g,'');
  if(r===''||ROUTES.indexOf(r)>=0)a.setAttribute('href',U(r));});
 fixLinks(document);
}
window.addEventListener('hashchange',route);route();
})();
