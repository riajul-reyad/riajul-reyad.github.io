const hero = document.querySelector('.hero');
if (hero) {
  const startHero = () => hero.classList.add('animate-in');
  if (document.readyState === 'complete') startHero();
  else window.addEventListener('load', startHero, {once:true});
}

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');
if (menu && links) {
  menu.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, {threshold:.12});

window.observeReveals = function(){
  document.querySelectorAll('.reveal:not([data-reveal-observed])').forEach(el => {
    el.dataset.revealObserved = 'true';
    revealObserver.observe(el);
  });
};
window.observeReveals();

function renderProjects(){
  const grid = document.getElementById('project-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;
  grid.innerHTML = PROJECTS.map((p, i) => {
    const layout = i % 4 === 0 || i % 4 === 3 ? 'project-large' : 'project-tall';
    return `<a class="project-card ${layout} reveal" href="work/project.html?id=${p.id}">
      <img src="assets/images/${p.cover}" alt="${p.title}" loading="lazy">
      <div class="card-shade"></div>
      <div class="card-info"><span class="card-number">${p.number}</span><h3>${p.title}</h3><span>${p.category}</span></div>
      <b class="card-arrow">↗</b>
    </a>`;
  }).join('');
  window.observeReveals();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderProjects);
else renderProjects();


/* Premium cinematic motion: hero mouse light + depth parallax */
(() => {
  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let ticking = false;

  heroEl.addEventListener('pointermove', (e) => {
    const r = heroEl.getBoundingClientRect();
    targetX = (e.clientX - r.left) / r.width - .5;
    targetY = (e.clientY - r.top) / r.height - .5;
  }, {passive:true});
  heroEl.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; }, {passive:true});

  function animateHeroDepth(){
    currentX += (targetX-currentX)*.055;
    currentY += (targetY-currentY)*.055;
    heroEl.style.setProperty('--light-x', `${currentX*28}px`);
    heroEl.style.setProperty('--light-y', `${currentY*20}px`);
    const img = heroEl.querySelector('.hero-image img');
    if (img) img.style.transform = `translate3d(${currentX*-8}px,${currentY*-5}px,0) scale(1.02)`;
    requestAnimationFrame(animateHeroDepth);
  }
  animateHeroDepth();

  const parallaxItems = [...document.querySelectorAll('.project-card img, .about-image img, .contact-image img, .gallery>div img')];
  function updateParallax(){
    const vh = window.innerHeight;
    parallaxItems.forEach(img => {
      const wrap = img.closest('.project-card, .about-image, .contact-image, .gallery>div');
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh+100) return;
      const center = r.top + r.height/2;
      const offset = Math.max(-18, Math.min(18, (vh/2-center)*.055));
      wrap.style.setProperty('--parallax-y', `${offset}px`);
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
  }, {passive:true});
  window.addEventListener('resize', updateParallax, {passive:true});
  updateParallax();
/* =========================================
   PREMIUM PROJECT IMAGE LIGHTBOX
========================================= */

(() => {

  const galleryImages = Array.from(
    document.querySelectorAll('.gallery>div img')
  );

  const lightbox = document.getElementById('lightbox');

  if (!lightbox || !galleryImages.length) return;

  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentIndex = 0;


  /* OPEN LIGHTBOX */

  function openLightbox(index) {

    currentIndex = index;

    lightboxImage.src = galleryImages[currentIndex].src;
    lightboxImage.alt = galleryImages[currentIndex].alt || '';

    updateCounter();

    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden';
  }


  /* CLOSE LIGHTBOX */

  function closeLightbox() {

    lightbox.classList.remove('active');

    document.body.style.overflow = '';

    setTimeout(() => {
      lightboxImage.src = '';
    }, 300);
  }


  /* SHOW IMAGE */

  function showImage(index) {

    if (index < 0) {
      index = galleryImages.length - 1;
    }

    if (index >= galleryImages.length) {
      index = 0;
    }

    currentIndex = index;

    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(.96)';

    setTimeout(() => {

      lightboxImage.src = galleryImages[currentIndex].src;
      lightboxImage.alt = galleryImages[currentIndex].alt || '';

      updateCounter();

      lightboxImage.onload = () => {
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
      };

    }, 120);
  }


  /* COUNTER */

  function updateCounter() {

    lightboxCounter.textContent =
      `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;

  }


  /* IMAGE CLICK */

  galleryImages.forEach((img, index) => {

    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {

      openLightbox(index);

    });

  });


  /* CLOSE */

  lightboxClose.addEventListener('click', closeLightbox);


  /* PREVIOUS */

  lightboxPrev.addEventListener('click', () => {

    showImage(currentIndex - 1);

  });


  /* NEXT */

  lightboxNext.addEventListener('click', () => {

    showImage(currentIndex + 1);

  });


  /* CLICK OUTSIDE IMAGE */

  lightbox.addEventListener('click', (e) => {

    if (e.target === lightbox) {

      closeLightbox();

    }

  });


  /* KEYBOARD */

  document.addEventListener('keydown', (e) => {

    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {

      closeLightbox();

    }

    if (e.key === 'ArrowLeft') {

      showImage(currentIndex - 1);

    }

    if (e.key === 'ArrowRight') {

      showImage(currentIndex + 1);

    }

  });

})();
