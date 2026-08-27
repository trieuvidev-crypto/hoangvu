/* ================================================
   HOANG VU — Link Bio Profile
   script.js
   ================================================ */

/* ============================================================
   1. LOADER — fade out after 1.7s
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger reveal animations after loader gone
      setTimeout(triggerReveals, 200);
    }, 1700);
  });
})();

/* ============================================================
   2. THEME TOGGLE — persist via localStorage
   ============================================================ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Load saved preference
  const saved = localStorage.getItem('hv-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('hv-theme', next);
  });
})();

/* ============================================================
   3. INTERSECTION OBSERVER — reveal animations
   ============================================================ */
function triggerReveals() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => obs.observe(el));
}

/* ============================================================
   4. RIPPLE EFFECT on visit buttons
   ============================================================ */
(function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.visit-btn');
    if (!btn) return;

    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}px; top:${y}px;
    `;
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();

/* ============================================================
   5. visitLink — open URL + track fake click count
   ============================================================ */
function visitLink(e, url) {
  e.stopPropagation();
  // Increment analytics
  incrementClick();
  // Open link
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ============================================================
   6. ANALYTICS COUNTERS — fake live data
   ============================================================ */
let clickCount = parseInt(localStorage.getItem('hv-clicks') || '2847', 10);
let viewCount  = parseInt(localStorage.getItem('hv-views')  || '134892', 10);

function incrementClick() {
  clickCount++;
  localStorage.setItem('hv-clicks', clickCount);
  const el = document.getElementById('clickCount');
  if (el) {
    animateNumber(el, clickCount - 1, clickCount, 300);
  }
}

/* Animate number from start → end */
function animateNumber(el, from, to, duration) {
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(from + (to - from) * ease);
    el.textContent = formatNum(current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1)    + 'K';
  return n.toLocaleString();
}

/* Increment view count every 8s to fake "live" analytics */
(function liveViewCount() {
  const el = document.getElementById('viewCount');
  setInterval(() => {
    viewCount += Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('hv-views', viewCount);
    if (el) el.textContent = viewCount.toLocaleString();
  }, 8000);
})();

/* ============================================================
   7. ONLINE COUNT — random fluctuation
   ============================================================ */
(function initOnlineCount() {
  let base = 247;
  const el = document.getElementById('onlineCount');

  setInterval(() => {
    const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
    base = Math.max(200, Math.min(350, base + delta));
    if (el) {
      animateNumber(el, base - delta, base, 500);
    }
  }, 4000);
})();

/* ============================================================
   8. PARALLAX — background orbs follow scroll
   ============================================================ */
(function initParallax() {
  const orbs = document.querySelectorAll('.bg-orb');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        orbs[0] && (orbs[0].style.transform = `translateY(${sy * .12}px)`);
        orbs[1] && (orbs[1].style.transform = `translateY(${sy * -.08}px)`);
        orbs[2] && (orbs[2].style.transform = `translateY(${sy * .06}px)`);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ============================================================
   9. CARD TILT — subtle 3D on hover (desktop only)
   ============================================================ */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 5;
      const rotY   =  dx * 5;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   10. SMOOTH SCROLL for internal anchors
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
