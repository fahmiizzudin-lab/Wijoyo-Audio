/**
 * WIJOYO AUDIO — Main Script
 * Navbar | Wave Canvas | Scroll Reveal | FAQ | Gallery | Booking Form
 */

/* =============================================
   NAVBAR — Sticky + Hamburger
   ============================================= */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Sticky on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], nav + section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
})();

/* =============================================
   WAVE CANVAS ANIMATION
   ============================================= */
(function () {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const waves = [
    { amp: 28, freq: 0.012, speed: 0.018, color: 'rgba(0,180,255,0.35)', phase: 0 },
    { amp: 18, freq: 0.020, speed: 0.025, color: 'rgba(130,80,255,0.25)', phase: 2 },
    { amp: 12, freq: 0.030, speed: 0.032, color: 'rgba(0,180,255,0.15)', phase: 4 },
  ];

  let animId;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waves.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = canvas.height / 2 + Math.sin(x * w.freq + w.phase) * w.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = w.color;
      ctx.fill();
      w.phase += w.speed;
    });
    animId = requestAnimationFrame(draw);
  }

  // Only animate when hero is visible
  const heroObs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animId) draw();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    },
    { threshold: 0.01 }
  );
  heroObs.observe(document.getElementById('home'));
})();

/* =============================================
   HERO PARTICLES
   ============================================= */
(function () {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = 28;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    dot.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > 0.5 ? 'rgba(0,180,255,' : 'rgba(130,80,255,'}${0.15 + Math.random() * 0.25});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${4 + Math.random() * 6}s ease-in-out infinite;
      animation-delay: -${Math.random() * 6}s;
    `;
    container.appendChild(dot);
  }
  // Inject keyframe
  if (!document.getElementById('particleStyle')) {
    const s = document.createElement('style');
    s.id = 'particleStyle';
    s.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
        50%       { transform: translateY(-20px) scale(1.3); opacity: 0.9; }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* =============================================
   SCROLL REVEAL
   ============================================= */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger within same parent
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          let delay = 0;
          siblings.forEach((el, i) => {
            if (el === entry.target) delay = i * 60;
          });
          setTimeout(() => entry.target.classList.add('visible'), delay);
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );
  revealEls.forEach(el => obs.observe(el));
})();

/* =============================================
   FAQ ACCORDION
   ============================================= */
(function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        open.querySelector('.faq-answer').hidden = true;
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();

/* =============================================
   GALLERY TABS + LIGHTBOX
   ============================================= */
(function () {
  const tabs  = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.gallery-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose   = document.getElementById('lightboxClose');

  function openLightbox(item) {
    const img = item.querySelector('img');
    const placeholder = item.querySelector('.gallery-placeholder');

    if (img) {
      lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    } else if (placeholder) {
      const label = item.getAttribute('aria-label') || 'Foto placeholder';
      lightboxContent.innerHTML = `
        <div style="padding:48px 60px;background:rgba(26,30,46,0.98);border:1px solid rgba(0,180,255,0.2);border-radius:16px;text-align:center;color:#8892a4;">
          <i class="fas fa-image" style="font-size:4rem;color:rgba(0,180,255,0.4);display:block;margin-bottom:16px;"></i>
          <p style="font-size:0.95rem;">${label}</p>
          <small style="font-size:0.75rem;opacity:0.6;">Foto belum ditambahkan</small>
        </div>`;
    }
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* =============================================
   BOOKING FORM → WHATSAPP
   ============================================= */
(function () {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama     = form.elements['nama'].value.trim();
    const wa       = form.elements['whatsapp'].value.trim();
    const acara    = form.elements['jenis_acara'].value.trim();
    const tanggal  = form.elements['tanggal'].value;
    const lokasi   = form.elements['lokasi_acara'].value.trim();
    const tamu     = form.elements['jumlah_tamu'].value.trim();
    const paket    = form.elements['paket'].value;
    const tambahan = form.elements['tambahan'].value.trim();
    const pesan    = form.elements['pesan'].value.trim();

    if (!nama || !wa || !acara || !tanggal) {
      alert('Mohon isi minimal: Nama, Nomor WhatsApp, Jenis Acara, dan Tanggal Acara.');
      return;
    }

    const tgl = tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : '-';

    const msg = [
      'Halo WIJOYO AUDIO, saya ingin menanyakan rental sound system.',
      '',
      `*Nama:* ${nama}`,
      `*Jenis Acara:* ${acara}`,
      `*Tanggal:* ${tgl}`,
      `*Lokasi:* ${lokasi || '-'}`,
      `*Jumlah Tamu:* ${tamu || '-'}`,
      `*Paket:* ${paket || '-'}`,
      `*Kebutuhan Tambahan:* ${tambahan || '-'}`,
      `*Pesan:* ${pesan || '-'}`,
      '',
      'Mohon informasi mengenai ketersediaan dan harga. Terima kasih.',
    ].join('\n');

    const url = `https://wa.me/6281244091456?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

/* =============================================
   SMOOTH SCROLL — handle anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
