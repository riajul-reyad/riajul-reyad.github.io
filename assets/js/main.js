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
})();
