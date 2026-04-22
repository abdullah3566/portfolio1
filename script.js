/* ================================
   PORTFOLIO SCRIPT v3
   Pure vanilla JS. No dependencies.
================================ */

/* ── Cursor ─────────────────────────────────── */
(function() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });
  (function loop() {
    rx += (mx - rx - 18) * 0.1;
    ry += (my - ry - 18) * 0.1;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.width = '12px'; dot.style.height = '12px'; ring.style.width = '50px'; ring.style.height = '50px'; });
    el.addEventListener('mouseleave', () => { dot.style.width = '8px'; dot.style.height = '8px'; ring.style.width = '36px'; ring.style.height = '36px'; });
  });
})();

/* ── Page switching ──────────────────────────── */
function showPage(id) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  // Update nav tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('tab-' + id);
  if (tab) tab.classList.add('active');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Re-init reveal for new page
  setTimeout(initReveal, 60);
}

/* ── Scroll reveal ───────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.page.active .reveal, .page.active .reveal-left');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.classList.remove('visible');
    obs.observe(el);
  });
}
initReveal();

/* ── Mobile menu ─────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobile() {
  mobileMenu.classList.remove('open');
}
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

/* ── Nav scroll effect ───────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.style.background = window.scrollY > 50
    ? 'rgba(8,10,18,0.97)'
    : 'rgba(8,10,18,0.88)';
}, { passive: true });

/* ── Contact form ────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-message').value.trim();
  const btn   = document.getElementById('submit-btn');

  if (!name || !email || !msg) {
    showToast('Please fill in name, email, and message.', 'error');
    return;
  }

  const subject = encodeURIComponent(document.getElementById('f-subject').value || 'Portfolio Inquiry');
  const budget  = document.getElementById('f-budget').value || 'Not specified';
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${msg}`);

  btn.textContent = 'Opening email client...';
  btn.disabled    = true;

  // Update this email address
  window.location.href = `mailto:alex@example.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    btn.textContent      = '✓ Email client opened';
    btn.style.background = '#059669';
    showToast('Your email client should have opened!', 'success');
  }, 900);
}

function showToast(message, type = 'success') {
  const old = document.getElementById('toast-msg');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'toast-msg';
  t.textContent = message;
  Object.assign(t.style, {
    position: 'fixed', bottom: '2rem', right: '2rem',
    background: type === 'success' ? '#059669' : '#DC2626',
    color: '#fff', padding: '.85rem 1.5rem', borderRadius: '10px',
    fontSize: '.84rem', fontWeight: '500', zIndex: '9999',
    fontFamily: 'Geist, sans-serif', animation: 'toastIn .3s ease',
    letterSpacing: '.02em',
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// Inject toast keyframe
const s = document.createElement('style');
s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(s);
