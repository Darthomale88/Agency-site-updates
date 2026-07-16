/* ============================================================
   YourWebBuild — Shared Script
   Reveal-on-scroll, nav shrink-on-scroll, and smooth scroll for
   anchor links that point at the current page. Page-specific
   behavior (FAQ accordion, budget slider, portfolio filter)
   stays inline in each page that needs it.
   ============================================================ */

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.gold-line').forEach(el => observer.observe(el));

const mainNav = document.getElementById('main-nav');
if(mainNav){
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Hamburger menu (mobile)
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
if(navToggle && navLinksEl){
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  });
  // Tapping any link closes the menu, whether it's a same-page
  // anchor or a link to another page.
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

function smoothScrollTo(target, duration){
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY - 75;
  const dist = end - start;
  let startTime = null;
  function ease(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t; }
  function step(ts){
    if(!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed/duration, 1);
    window.scrollTo(0, start + dist * ease(progress));
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Only intercept anchor clicks that point at THIS page, so cross-page
// nav links like "pricing.html#faq" still navigate normally.
const here = window.location.pathname.split('/').pop();
document.querySelectorAll('a[href*="#"]').forEach(link => {
  const [path, hash] = link.getAttribute('href').split('#');
  const samePage = path === '' || path === here;
  if(samePage && hash){
    link.addEventListener('click', function(e){
      const target = document.getElementById(hash);
      if(target){ e.preventDefault(); smoothScrollTo(target, 800); }
    });
  }
});

// Show call FAB after scrolling past hero
const callFab = document.querySelector('.call-fab');

if (callFab) {
  const showThreshold = window.innerHeight * 0.6; // adjust: 0.6 = 60% of viewport height

  window.addEventListener('scroll', () => {
    if (window.scrollY > showThreshold) {
      callFab.classList.add('show');
    } else {
      callFab.classList.remove('show');
    }
  }, { passive: true });
}