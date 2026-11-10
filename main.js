// ===== SUBTLE PARTICLE BACKGROUND =====
(function () {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  // Floating particles — subtle, not a galaxy
  const COUNT = 1800;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);

  const palette = [
    new THREE.Color('#6366f1'), // indigo
    new THREE.Color('#a855f7'), // purple
    new THREE.Color('#3b82f6'), // blue
    new THREE.Color('#8b5cf6'), // violet
  ];

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    pos[i3]     = (Math.random() - 0.5) * 14;
    pos[i3 + 1] = (Math.random() - 0.5) * 8;
    pos[i3 + 2] = (Math.random() - 0.5) * 6;
    const c = palette[Math.floor(Math.random() * palette.length)].clone();
    c.multiplyScalar(0.6 + Math.random() * 0.4);
    col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.018, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
    vertexColors: true, transparent: true, opacity: 0.85,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Slow drift
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.15;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.1;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  (function tick() {
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.012;
    particles.rotation.x = Math.sin(t * 0.008) * 0.04;
    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  })();
})();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'))
);

// ===== REVEAL ON SCROLL =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.about-layout, .skill-group, .project-card, .contact-layout, .chip-row, .about-stats'
).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
  io.observe(el);
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Sent ✓';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = 'Send message →';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});
