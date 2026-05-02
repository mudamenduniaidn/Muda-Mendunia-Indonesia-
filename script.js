/* =============================================
   MUDA MENDUNIA INDONESIA — JAVASCRIPT
   Interactivity & Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ====================================================
  // 1. NAVBAR — scroll effect + mobile toggle
  // ====================================================
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? spans.forEach((s, i) => s.style.transform = i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 1 ? 'opacity:0' : 'rotate(-45deg) translate(5px, -5px)')
      : spans.forEach(s => s.style.transform = '');
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // ====================================================
  // 2. COUNTER ANIMATION for Hero Stats
  // ====================================================
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Format with thousands separator for 4-digit+ numbers
      el.textContent = Math.floor(current).toLocaleString('id-ID');
    }, 16);
  }

  // Use IntersectionObserver to trigger counters when hero is in view
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersTriggered = false;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersTriggered) {
        countersTriggered = true;
        statNumbers.forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.3 });

  const hero = document.querySelector('.hero');
  if (hero) heroObserver.observe(hero);

  // ====================================================
  // 3. SCROLL REVEAL ANIMATIONS
  // ====================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Add reveal class to elements
  const revealEls = document.querySelectorAll(
    '.program-card, .kegiatan-card, .cabang-card, .kolab-type, .artikel-card, .extra-card, .highlight-item, .visual-card'
  );
  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    revealObserver.observe(el);
  });

  // Inject revealed state CSS (since we can't add via stylesheet dynamically)
  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // ====================================================
  // 4. CABANG FILTER TABS
  // ====================================================
  const pulauBtns  = document.querySelectorAll('.pulau-btn');
  const cabangCards = document.querySelectorAll('.cabang-card');

  pulauBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active btn
      pulauBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selected = btn.getAttribute('data-pulau');

      cabangCards.forEach(card => {
        if (selected === 'semua' || card.getAttribute('data-pulau') === selected) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard 0.4s ease';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Add fadeInCard animation
  const filterStyle = document.createElement('style');
  filterStyle.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .cabang-card.hidden { display: none; }
  `;
  document.head.appendChild(filterStyle);

  // ====================================================
  // 5. FORM SUBMISSION (demo)
  // ====================================================
  const kontakForm = document.getElementById('kontakForm');
  if (kontakForm) {
    kontakForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = kontakForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '✅ Pesan Terkirim!';
      btn.style.background = '#16a34a';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        kontakForm.reset();
      }, 3500);
    });
  }

  // ====================================================
  // 6. SMOOTH PARALLAX for HERO shapes
  // ====================================================
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.15;
      shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
    });
  });

  // ====================================================
  // 7. PROGRAM CARD — hover tilt effect
  // ====================================================
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = (y / rect.height * 2) * -4;
      const tiltY  = (x / rect.width * 2)  *  4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ====================================================
  // 8. ARTIKEL — Read More Expand (demo)
  // ====================================================
  document.querySelectorAll('.artikel-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card  = link.closest('.artikel-card');
      const para  = card.querySelector('p');
      const expanded = card.getAttribute('data-expanded') === 'true';

      if (!expanded) {
        para.style.webkitLineClamp = 'unset';
        para.style.overflow = 'visible';
        link.textContent = '← Tutup';
        card.setAttribute('data-expanded', 'true');
      } else {
        para.style.webkitLineClamp = '';
        para.style.overflow = '';
        link.textContent = 'Baca Selengkapnya →';
        card.setAttribute('data-expanded', 'false');
      }
    });
  });

  // ====================================================
  // 9. PARTNER CHIP — ripple click effect
  // ====================================================
  document.querySelectorAll('.partner-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.style.transform = 'scale(0.95)';
      setTimeout(() => { chip.style.transform = ''; }, 200);
    });
  });

  // ====================================================
  // 10. SCROLL TO TOP indicator (hero scroll)
  // ====================================================
  console.log('%c🇮🇩 Muda Mendunia Indonesia', 'font-size:20px; font-weight:bold; color:#F97316;');
  console.log('%cPengabdi Muda Untuk Indonesia — mudamendunia.idn', 'font-size:12px; color:#666;');
});
