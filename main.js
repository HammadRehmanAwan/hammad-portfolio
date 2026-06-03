// ===== MULTI-COLOR GALAXY (Three.js) =====
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const COUNT = 14000;
  const BRANCHES = 6;
  const RADIUS = 6;
  const SPIN = 1.5;
  const RAND_POWER = 3;

  // Multi-color palette: cyan → purple → pink → blue → green → orange
  const palette = [
    new THREE.Color('#00f5ff'),
    new THREE.Color('#bf00ff'),
    new THREE.Color('#ff0080'),
    new THREE.Color('#0080ff'),
    new THREE.Color('#00ff88'),
    new THREE.Color('#ff6a00'),
  ];

  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const r = Math.random() * RADIUS;
    const spin = r * SPIN;
    const branch = i % BRANCHES;
    const angle = (branch / BRANCHES) * Math.PI * 2;

    const rx = Math.pow(Math.random(), RAND_POWER) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
    const ry = Math.pow(Math.random(), RAND_POWER) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
    const rz = Math.pow(Math.random(), RAND_POWER) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;

    positions[i3]     = Math.cos(angle + spin) * r + rx;
    positions[i3 + 1] = ry;
    positions[i3 + 2] = Math.sin(angle + spin) * r + rz;

    // Each branch gets its own color, fading to dark toward edges
    const branchColor = palette[branch].clone();
    const fadeColor = new THREE.Color('#020408');
    const mixed = branchColor.clone().lerp(fadeColor, r / RADIUS * 0.8);
    colors[i3]     = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  // Add bright core cluster
  const coreCount = 800;
  const corePos = new Float32Array(coreCount * 3);
  const coreCol = new Float32Array(coreCount * 3);
  for (let i = 0; i < coreCount; i++) {
    const i3 = i * 3;
    const r = Math.random() * 0.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    corePos[i3]     = r * Math.sin(phi) * Math.cos(theta);
    corePos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    corePos[i3 + 2] = r * Math.cos(phi);
    const c = new THREE.Color().setHSL(Math.random(), 0.5, 0.9);
    coreCol[i3] = c.r; coreCol[i3+1] = c.g; coreCol[i3+2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.007, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
  const galaxy = new THREE.Points(geo, mat);
  scene.add(galaxy);

  const coreGeo = new THREE.BufferGeometry();
  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
  coreGeo.setAttribute('color',    new THREE.BufferAttribute(coreCol, 3));
  const coreMat = new THREE.PointsMaterial({ size: 0.015, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
  scene.add(new THREE.Points(coreGeo, coreMat));

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  (function animate() {
    const t = clock.getElapsedTime();
    galaxy.rotation.y = t * 0.04;
    galaxy.rotation.x = Math.sin(t * 0.02) * 0.05;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();
})();

// ===== TYPEWRITER =====
(function() {
  const el = document.getElementById('typewriter');
  const phrases = ['AI Engineer', 'LLM Specialist', 'RAG Architect', 'FinTech AI Builder', 'HuggingFace Creator', 'Open Source Dev'];
  let pi = 0, ci = 0, del = false;
  function type() {
    const cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, del ? 55 : 85);
  }
  type();
})();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'))
);

// ===== INTERSECTION OBSERVER =====
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    entry.target.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    entry.target.querySelectorAll('.stat-number').forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const iv = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(iv);
      }, 35);
    });
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-category, .project-card, .contact-card, .about-grid, .tech-badges').forEach(el => {
  el.classList.add('fade-in');
  io.observe(el);
});
document.querySelectorAll('#about, #skills').forEach(el => io.observe(el));

// ===== 3D TILT ON CARDS =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = '✓ Message Sent!';
  btn.style.cssText = 'background: transparent; color: var(--neon-green); border: 1px solid var(--neon-green); box-shadow: 0 0 20px rgba(0,255,136,0.3);';
  setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; e.target.reset(); }, 3000);
});

// ===== AURORA CURSOR TRAIL =====
(function() {
  const colors = ['#00f5ff','#bf00ff','#ff0080','#00ff88','#ff6a00','#ffe600'];
  let ci = 0;
  document.addEventListener('mousemove', e => {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:6px; height:6px; border-radius:50%; pointer-events:none;
      background:${colors[ci % colors.length]}; z-index:9998;
      transform:translate(-50%,-50%);
      box-shadow:0 0 8px ${colors[ci % colors.length]};
      transition: opacity 0.6s, transform 0.6s;
    `;
    document.body.appendChild(dot);
    ci++;
    requestAnimationFrame(() => { dot.style.opacity = '0'; dot.style.transform = 'translate(-50%,-50%) scale(2)'; });
    setTimeout(() => dot.remove(), 650);
  });
})();
