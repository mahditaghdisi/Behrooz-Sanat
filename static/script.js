/* ---------- Fast cursor boot: runs as soon as deferred script executes ---------- */
(() => {
  if(!window.matchMedia('(pointer:fine)').matches) return;
  const cursor=document.getElementById('smoothCursor');
  const dot=cursor?.querySelector('.smooth-cursor-dot');
  if(!cursor) return;
  let mouseX=innerWidth/2,mouseY=innerHeight/2,x=mouseX,y=mouseY;
  window.addEventListener('pointermove',e=>{mouseX=e.clientX;mouseY=e.clientY;},{passive:true});
  const render=()=>{
    x+=(mouseX-x)*.22;y+=(mouseY-y)*.22;
    cursor.style.transform=`translate3d(${x-19}px,${y-19}px,0)`;
    const dx=Math.max(-11,Math.min(11,(mouseX-x)*.38));
    const dy=Math.max(-11,Math.min(11,(mouseY-y)*.38));
    if(dot) dot.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
  document.documentElement.classList.add('cursor-ready');
  document.querySelectorAll('a,button,.project-card,input,textarea,select').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('is-hover'));
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Animated Theme Toggler-inspired theme switch ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle-icon');
  const savedTheme = localStorage.getItem('behrooz-theme');
  document.body.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
  if (themeIcon) themeIcon.textContent = document.body.dataset.theme === 'dark' ? '☾' : '☀';

  function applyTheme(nextTheme) {
    if (themeToggle) {
      const r = themeToggle.getBoundingClientRect();
      document.documentElement.style.setProperty('--theme-x', `${r.left + r.width / 2}px`);
      document.documentElement.style.setProperty('--theme-y', `${r.top + r.height / 2}px`);
    }
    const update = () => {
      document.body.dataset.theme = nextTheme;
      localStorage.setItem('behrooz-theme', nextTheme);
      if (themeIcon) themeIcon.textContent = nextTheme === 'dark' ? '☾' : '☀';
    };
    if (document.startViewTransition) document.startViewTransition(update); else update();
  }
  themeToggle?.addEventListener('click', () => applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- Active nav link ---------- */
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');
  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, {rootMargin:'-45% 0px -45% 0px'});
    sections.forEach(sec => spyObserver.observe(sec));
  }

  /* ---------- Morphing Text-inspired hero text ---------- */
  const morphTarget = document.getElementById('heroMorphText');
  const morphTexts = ['از فولاد', 'تا قالب', 'از قالب', 'تا قطعه‌ی بتنی'];
  let morphIndex = 0;
  if (morphTarget) {
    setInterval(() => {
      morphTarget.classList.add('is-morphing');
      setTimeout(() => {
        morphIndex = (morphIndex + 1) % morphTexts.length;
        morphTarget.textContent = morphTexts[morphIndex];
        morphTarget.classList.remove('is-morphing');
      }, 430);
    }, 3200);
  }

  /* ---------- Number Ticker-inspired experience counter ---------- */
  const numberTicker = document.getElementById('experienceNumber');
  if (numberTicker && 'IntersectionObserver' in window) {
    const target = Number(numberTicker.dataset.value || 25);
    let started = false;
    const animateNumber = () => {
      if (started) return;
      started = true;
      const duration = 1300, start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        numberTicker.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { animateNumber(); observer.disconnect(); }
    }, {threshold:.4});
    observer.observe(numberTicker);
  }

  /* ---------- Pixel Image-inspired scroll reveal ---------- */
  const pixelImage = document.getElementById('cornerPixelImage');
  if (pixelImage) {
    const canvas = pixelImage.querySelector('canvas');
    const img = pixelImage.querySelector('img');
    const ctx = canvas.getContext('2d', {alpha:false});
    let imageReady = false, revealed = false;
    const rows = 8, cols = 8;
    const cells = Array.from({length:rows * cols}, (_,i) => i);
    const shuffle = arr => {
      const copy = arr.slice();
      for (let i=copy.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
      return copy;
    };
    function sizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    }
    function drawPixelated() {
      if (!imageReady) return;
      sizeCanvas();
      const small = document.createElement('canvas'); small.width=cols; small.height=rows;
      const smallCtx=small.getContext('2d'); smallCtx.filter='grayscale(1)'; smallCtx.drawImage(img,0,0,cols,rows);
      ctx.imageSmoothingEnabled=false; ctx.drawImage(small,0,0,canvas.width,canvas.height);
    }
    function drawReveal(progresses) {
      if (!imageReady) return;
      sizeCanvas();
      const small = document.createElement('canvas'); small.width=cols; small.height=rows;
      const smallCtx=small.getContext('2d'); smallCtx.filter='grayscale(1)'; smallCtx.drawImage(img,0,0,cols,rows);
      ctx.imageSmoothingEnabled=false; ctx.drawImage(small,0,0,canvas.width,canvas.height);
      const cellW=canvas.width/cols, cellH=canvas.height/rows;
      ctx.imageSmoothingEnabled=true;
      progresses.forEach((p,i)=>{
        if(p<=0)return;
        const row=Math.floor(i/cols), col=i%cols;
        ctx.save(); ctx.beginPath(); ctx.rect(col*cellW,row*cellH,cellW,cellH); ctx.clip(); ctx.globalAlpha=p;
        ctx.drawImage(img,0,0,canvas.width,canvas.height); ctx.restore();
      });
    }
    img.onload=()=>{imageReady=true;drawPixelated();};
    if(img.complete){imageReady=true;drawPixelated();}
    if(window.ResizeObserver) new ResizeObserver(()=>{if(!revealed)drawPixelated();}).observe(pixelImage);
    const reveal=()=>{
      if(revealed||!imageReady)return; revealed=true;
      const order=shuffle(cells), progresses=new Array(cells.length).fill(0), start=performance.now(), total=1500;
      const frame=now=>{
        const elapsed=now-start;
        order.forEach((cell,idx)=>{progresses[cell]=Math.max(0,Math.min(1,(elapsed-idx*35)/650));});
        drawReveal(progresses);
        if(elapsed<total+order.length*35) requestAnimationFrame(frame);
        else {pixelImage.classList.add('is-revealed');ctx.drawImage(img,0,0,canvas.width,canvas.height);}
      };
      requestAnimationFrame(frame);
    };
    const pixelObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){reveal();pixelObserver.disconnect();}},{threshold:.35});
    pixelObserver.observe(pixelImage);
  }

  /* ---------- Projects: original Load More behavior ---------- */
  const loadMoreBtn=document.getElementById('loadMoreBtn');
  const hiddenCards=()=>document.querySelectorAll('.project-card.hidden');
  function revealProjectBatch(count=6){
    const batch=Array.from(hiddenCards()).slice(0,count);
    batch.forEach((card,index)=>{
      card.classList.remove('hidden');
      card.classList.add('auto-reveal');
      card.style.animationDelay=`${index*70}ms`;
      setTimeout(()=>card.style.animationDelay='',1000+index*70);
    });
    if(loadMoreBtn&&!hiddenCards().length) loadMoreBtn.style.display='none';
    return batch.length;
  }
  loadMoreBtn?.addEventListener('click',()=>revealProjectBatch(6));

  /* ---------- Lightbox gallery ---------- */
  const lightbox=document.getElementById('lightbox');
  const lightboxMedia=document.getElementById('lightboxMedia');
  const lightboxTitle=document.getElementById('lightboxTitle');
  const lightboxDesc=document.getElementById('lightboxDesc');
  const lightboxClose=document.getElementById('lightboxClose');
  const lightboxPrev=document.getElementById('lightboxPrev');
  const lightboxNext=document.getElementById('lightboxNext');
  let currentMedia=[],currentIndex=0;
  const isVideo=src=>/\.(mp4|webm|ogg)$/i.test(src);
  function renderMedia(){
    const src=currentMedia[currentIndex]; lightboxMedia.innerHTML='';
    if(isVideo(src)){const video=document.createElement('video');video.src=src;video.controls=true;lightboxMedia.appendChild(video)}
    else{const img=document.createElement('img');img.src=src;img.alt=lightboxTitle.textContent;lightboxMedia.appendChild(img)}
    lightboxPrev.style.visibility=currentMedia.length>1?'visible':'hidden';lightboxNext.style.visibility=currentMedia.length>1?'visible':'hidden';
  }
  function openLightbox(card){
    const title=card.dataset.title||'',desc=card.dataset.desc||'',media=(card.dataset.media||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(!media.length)return; currentMedia=media;currentIndex=0;lightboxTitle.textContent=title;lightboxDesc.textContent=desc;renderMedia();lightbox.hidden=false;document.body.style.overflow='hidden';
  }
  function closeLightbox(){lightbox.hidden=true;lightboxMedia.innerHTML='';document.body.style.overflow='';}
  document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('click',()=>openLightbox(card)));
  lightboxClose?.addEventListener('click',closeLightbox); lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
  lightboxPrev?.addEventListener('click',()=>{currentIndex=(currentIndex-1+currentMedia.length)%currentMedia.length;renderMedia()});
  lightboxNext?.addEventListener('click',()=>{currentIndex=(currentIndex+1)%currentMedia.length;renderMedia()});

  /* ---------- Confetti Emoji-inspired submit effect ---------- */
  function fireThumbsUpConfetti(){
    if(typeof confetti!=='function')return;
    const scalar=2,thumbs=confetti.shapeFromText?confetti.shapeFromText({text:'👍',scalar}):null;
    const defaults={spread:360,ticks:60,gravity:.95,decay:.96,startVelocity:24,scalar,zIndex:12000,...(thumbs?{shapes:[thumbs]}:{})};
    confetti({...defaults,particleCount:24,origin:{x:.5,y:.72}});confetti({...defaults,particleCount:8,scalar:1.1,origin:{x:.5,y:.68}});
    setTimeout(()=>confetti({...defaults,particleCount:16,scalar:1.35,origin:{x:.5,y:.72}}),110);setTimeout(()=>confetti({...defaults,particleCount:10,scalar:1,origin:{x:.5,y:.70}}),220);
  }

  /* ---------- Success modal + contact form ---------- */
  const form=document.getElementById('contactForm'),submitOrderBtn=document.getElementById('submitOrderBtn');
  function setError(fieldId,message){const el=form?.querySelector(`.error-msg[data-for="${fieldId}"]`);if(el)el.textContent=message||''}
  function validatePhone(value){const normalized=value.replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/\D/g,'');return normalized.length>=10}
  const successModal=document.getElementById('successModal');
  function showSuccessModal(){if(!successModal)return;successModal.hidden=false;document.body.style.overflow='hidden';document.getElementById('successModalOk')?.focus()}
  function closeSuccessModal(){if(!successModal)return;successModal.hidden=true;document.body.style.overflow=''}
  document.getElementById('successModalOk')?.addEventListener('click',closeSuccessModal);
  document.querySelector('[data-success-close]')?.addEventListener('click',closeSuccessModal);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(lightbox&&!lightbox.hidden)closeLightbox();if(successModal&&!successModal.hidden)closeSuccessModal()}
    if(lightbox&&!lightbox.hidden){if(e.key==='ArrowRight')lightboxPrev?.click();if(e.key==='ArrowLeft')lightboxNext?.click()}
  });

  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();let valid=true;
      const employerName=form.employerName.value.trim(),phone=form.phone.value.trim(),email=form.email.value.trim();
      setError('employerName','');setError('phone','');setError('email','');
      if(!employerName){setError('employerName','وارد کردن نام کارفرما الزامی است.');valid=false}
      if(!phone){setError('phone','وارد کردن شماره تلفن الزامی است.');valid=false}else if(!validatePhone(phone)){setError('phone','شماره تلفن معتبر نیست.');valid=false}
      if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError('email','ایمیل معتبر نیست.');valid=false}
      if(!valid)return;
      const companyName=form.companyName.value.trim(),projectDesc=form.projectDesc.value.trim();
      if(submitOrderBtn)submitOrderBtn.disabled=true;
      fetch('/api/contact/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({employerName,companyName,projectDesc,phone,email})})
      .then(res=>res.json().then(data=>({status:res.status,data})))
      .then(({status,data})=>{
        if(status!==200||!data.ok){setError('phone',data.error||'مشکلی پیش آمد، دوباره تلاش کنید.');if(submitOrderBtn)submitOrderBtn.disabled=false;return}
        form.reset();fireThumbsUpConfetti();
        if(submitOrderBtn){submitOrderBtn.classList.add('is-firing');setTimeout(()=>submitOrderBtn.classList.remove('is-firing'),650)}
        showSuccessModal();if(submitOrderBtn)submitOrderBtn.disabled=false;
      })
      .catch(()=>{setError('phone','ارتباط با سرور برقرار نشد.');if(submitOrderBtn)submitOrderBtn.disabled=false});
    });
  }
});
