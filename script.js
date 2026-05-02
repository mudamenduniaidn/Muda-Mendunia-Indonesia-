/* ============================================================
   MUDA MENDUNIA INDONESIA — Official Script
   Author: MMI Developer Team
   Description: Interactivity, Counters, Filters, and Reveal Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. NAVBAR — Scroll Effect & Mobile Toggle
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const spans = navToggle.querySelectorAll('span');

    // Handle Scroll Styling & Active Links
    window.addEventListener('scroll', () => {
        // Toggle background shadow on scroll
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, { passive: true });

    // Mobile Menu Toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        
        // Animate Hamburger to X
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans.forEach(s => {
                s.style.transform = '';
                s.style.opacity = '1';
            });
        }
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            spans.forEach(s => {
                s.style.transform = '';
                s.style.opacity = '1';
            });
        });
    });

    // Update Active Link based on Scroll Position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
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

    // 2. COUNTER ANIMATION — Hero Stats
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const count = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);

            el.textContent = currentCount.toLocaleString('id-ID');

            if (frame === totalFrames) {
                el.textContent = target.toLocaleString('id-ID');
                clearInterval(count);
            }
        }, frameRate);
    };

    // Trigger counters when hero section is visible
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(animateCounter);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const hero = document.querySelector('.hero');
    if (hero) heroObserver.observe(hero);

    // 3. SCROLL REVEAL — Element Fade-In
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const revealEls = document.querySelectorAll(
        '.program-card, .kegiatan-card, .cabang-card, .kolab-type, .artikel-card, .extra-card'
    );

    revealEls.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 3) * 0.1}s`; // Stagger effect
        revealObserver.observe(el);
    });

    // 4. CABANG FILTER — Category Tabbing
    const pulauBtns = document.querySelectorAll('.pulau-btn');
    const cabangCards = document.querySelectorAll('.cabang-card');

    pulauBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pulauBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selected = btn.getAttribute('data-pulau');

            cabangCards.forEach(card => {
                const isMatch = selected === 'semua' || card.getAttribute('data-pulau') === selected;
                card.style.display = isMatch ? 'flex' : 'none';
                if (isMatch) card.classList.add('revealed');
            });
        });
    });

    // 5. CONTACT FORM — Demo Submission
    const kontakForm = document.getElementById('kontakForm');
    if (kontakForm) {
        kontakForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = kontakForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = '✅ Pesan Terkirim!';
                submitBtn.style.background = '#16a34a';
                kontakForm.reset();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 6. PROGRAM CARDS — Interactive Tilt Effect
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const tiltX = (y / rect.height) * -10;
            const tiltY = (x / rect.width) * 10;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Console Branding
    console.log(
        '%c🇮🇩 Muda Mendunia Indonesia %c\nPengabdi Muda Untuk Indonesia',
        'color: #F97316; font-size: 20px; font-weight: bold;',
        'color: #666; font-size: 14px;'
    );
});
