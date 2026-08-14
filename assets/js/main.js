/* =========================================
   HERO LOAD ANIMATION
========================================= */

const hero = document.querySelector('.hero');

if (hero) {

  const startHero = () => {
    hero.classList.add('animate-in');
  };

  if (document.readyState === 'complete') {

    startHero();

  } else {

    window.addEventListener(
      'load',
      startHero,
      { once: true }
    );

  }

}


/* =========================================
   NAVIGATION SCROLL
========================================= */

const nav =
  document.querySelector('.nav');

window.addEventListener(
  'scroll',
  () => {

    if (nav) {

      nav.classList.toggle(
        'scrolled',
        window.scrollY > 30
      );

    }

  },
  { passive: true }
);


/* =========================================
   MOBILE MENU
========================================= */

const menu =
  document.querySelector('.menu');

const links =
  document.querySelector('.nav-links');


if (menu && links) {

  menu.addEventListener(
    'click',
    () => {

      links.classList.toggle(
        'open'
      );

    }
  );


  links
    .querySelectorAll('a')
    .forEach(a => {

      a.addEventListener(
        'click',
        () => {

          links.classList.remove(
            'open'
          );

        }
      );

    });

}


/* =========================================
   REVEAL OBSERVER
========================================= */

const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting
        ) {

          entry.target.classList.add(
            'visible'
          );

        }

      });

    },
    {
      threshold: 0.12
    }
  );


window.observeReveals =
  function () {

    document
      .querySelectorAll(
        '.reveal:not([data-reveal-observed])'
      )
      .forEach(el => {

        el.dataset.revealObserved =
          'true';

        revealObserver.observe(el);

      });

  };


window.observeReveals();


/* =========================================
   HOMEPAGE PROJECT GRID
========================================= */

function renderProjects() {

  const grid =
    document.getElementById(
      'project-grid'
    );


  if (
    !grid ||
    typeof PROJECTS === 'undefined'
  ) {
    return;
  }


  grid.innerHTML =
    PROJECTS
      .map((p, i) => {

        const layout =
          i % 4 === 0 ||
          i % 4 === 3
            ? 'project-large'
            : 'project-tall';


        return `
          <a
            class="project-card ${layout} reveal"
            href="work/project.html?id=${p.id}"
          >

            <img
              src="assets/images/${p.cover}"
              alt="${p.title}"
              loading="lazy"
            >

            <div class="card-shade"></div>

            <div class="card-info">

              <span class="card-number">
                ${p.number}
              </span>

              <h3>
                ${p.title}
              </h3>

              <span>
                ${p.category}
              </span>

            </div>

            <b class="card-arrow">
              ↗
            </b>

          </a>
        `;

      })
      .join('');


  window.observeReveals();

}


if (
  document.readyState === 'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    renderProjects
  );

} else {

  renderProjects();

}


/* =========================================
   PREMIUM CINEMATIC HERO MOTION
   + LIGHT MOVEMENT
   + IMAGE DEPTH
   + PROJECT PARALLAX
========================================= */

(() => {

  const heroEl =
    document.querySelector('.hero');


  if (!heroEl) return;


  const reduceMotion =
    window
      .matchMedia(
        '(prefers-reduced-motion: reduce)'
      )
      .matches;


  if (reduceMotion) return;


  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;


  let ticking = false;


  /* -----------------------------------------
     HERO MOUSE LIGHT
  ----------------------------------------- */

  heroEl.addEventListener(
    'pointermove',
    event => {

      const rect =
        heroEl.getBoundingClientRect();


      targetX =
        (
          event.clientX -
          rect.left
        ) /
        rect.width -
        0.5;


      targetY =
        (
          event.clientY -
          rect.top
        ) /
        rect.height -
        0.5;

    },
    {
      passive: true
    }
  );


  heroEl.addEventListener(
    'pointerleave',
    () => {

      targetX = 0;
      targetY = 0;

    },
    {
      passive: true
    }
  );


  /* -----------------------------------------
     HERO DEPTH ANIMATION
  ----------------------------------------- */

  function animateHeroDepth() {

    currentX +=
      (
        targetX -
        currentX
      ) *
      0.055;


    currentY +=
      (
        targetY -
        currentY
      ) *
      0.055;


    heroEl.style.setProperty(
      '--light-x',
      `${currentX * 28}px`
    );


    heroEl.style.setProperty(
      '--light-y',
      `${currentY * 20}px`
    );


    const img =
      heroEl.querySelector(
        '.hero-image img'
      );


    if (img) {

      img.style.transform =
        `
        translate3d(
          ${currentX * -8}px,
          ${currentY * -5}px,
          0
        )
        scale(1.02)
        `;

    }


    requestAnimationFrame(
      animateHeroDepth
    );

  }


  animateHeroDepth();


  /* -----------------------------------------
     PROJECT PARALLAX
  ----------------------------------------- */

  const parallaxItems =
    [
      ...document.querySelectorAll(
        '.project-card img, ' +
        '.about-image img, ' +
        '.contact-image img, ' +
        '.gallery>div img'
      )
    ];


  function updateParallax() {

    const vh =
      window.innerHeight;


    parallaxItems.forEach(img => {

      const wrap =
        img.closest(
          '.project-card, ' +
          '.about-image, ' +
          '.contact-image, ' +
          '.gallery>div'
        );


      if (!wrap) return;


      const rect =
        wrap.getBoundingClientRect();


      if (
        rect.bottom < -100 ||
        rect.top > vh + 100
      ) {
        return;
      }


      const center =
        rect.top +
        rect.height / 2;


      const offset =
        Math.max(
          -18,
          Math.min(
            18,
            (
              vh / 2 -
              center
            ) * 0.055
          )
        );


      wrap.style.setProperty(
        '--parallax-y',
        `${offset}px`
      );

    });


    ticking = false;

  }


  window.addEventListener(
    'scroll',
    () => {

      if (!ticking) {

        ticking = true;

        requestAnimationFrame(
          updateParallax
        );

      }

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    updateParallax,
    {
      passive: true
    }
  );


  updateParallax();

})();
