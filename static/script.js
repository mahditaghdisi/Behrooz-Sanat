document.addEventListener('DOMContentLoaded', () => {

  /* ---------- سال جاری در فوتر ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- منوی موبایل ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- هایلایت لینک فعال هنگام اسکرول ---------- */
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------- نمایش پروژه‌های بیشتر ---------- */
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const hiddenCards = () => document.querySelectorAll('.project-card.hidden');

  function refreshLoadMoreVisibility() {
    loadMoreBtn.style.display = hiddenCards().length ? 'block' : 'none';
  }
  refreshLoadMoreVisibility();

  loadMoreBtn.addEventListener('click', () => {
    // هر بار ۳ کارت پنهان دیگه رو نشون میده. اگه خواستی همه رو یک‌جا نشون بده، این عدد رو زیاد کن
    const batch = Array.from(hiddenCards()).slice(0, 3);
    batch.forEach(card => card.classList.remove('hidden'));
    refreshLoadMoreVisibility();
  });

  /* ---------- لایت‌باکس گالری پروژه‌ها ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentMedia = [];
  let currentIndex = 0;

  function isVideo(src) {
    return /\.(mp4|webm|ogg)$/i.test(src);
  }

  function renderMedia() {
    const src = currentMedia[currentIndex];
    lightboxMedia.innerHTML = '';
    if (isVideo(src)) {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = false;
      lightboxMedia.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = lightboxTitle.textContent;
      lightboxMedia.appendChild(img);
    }
    lightboxPrev.style.visibility = currentMedia.length > 1 ? 'visible' : 'hidden';
    lightboxNext.style.visibility = currentMedia.length > 1 ? 'visible' : 'hidden';
  }

  function openLightbox(card) {
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';
    const media = (card.dataset.media || '').split(',').map(s => s.trim()).filter(Boolean);

    if (!media.length) return;

    currentMedia = media;
    currentIndex = 0;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    renderMedia();

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxMedia.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
    renderMedia();
  });
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentMedia.length;
    renderMedia();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxPrev.click();
    if (e.key === 'ArrowLeft') lightboxNext.click();
  });

  /* ---------- اعتبارسنجی فرم تماس ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(fieldId, message) {
    const errEl = form.querySelector(`.error-msg[data-for="${fieldId}"]`);
    if (errEl) errEl.textContent = message || '';
  }

  function validatePhone(value) {
    // یک اعتبارسنجی ساده: فقط رقم، حداقل ۱۰ رقم
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const employerName = form.employerName.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();

    setError('employerName', '');
    setError('phone', '');
    setError('email', '');

    if (!employerName) {
      setError('employerName', 'وارد کردن نام کارفرما الزامی است.');
      valid = false;
    }

    if (!phone) {
      setError('phone', 'وارد کردن شماره تلفن الزامی است.');
      valid = false;
    } else if (!validatePhone(phone)) {
      setError('phone', 'شماره تلفن معتبر نیست.');
      valid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'ایمیل معتبر نیست.');
      valid = false;
    }

    if (!valid) return;

    const companyName = form.companyName.value.trim();
    const projectDesc = form.projectDesc.value.trim();

    fetch('/api/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employerName, companyName, projectDesc, phone, email })
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 200 || !data.ok) {
          setError('phone', data.error || 'مشکلی پیش اومد، دوباره تلاش کن.');
          return;
        }
        form.reset();
        formSuccess.hidden = false;
        setTimeout(() => { formSuccess.hidden = true; }, 5000);
      })
      .catch(() => {
        setError('phone', 'ارتباط با سرور برقرار نشد.');
      });
  });

});
