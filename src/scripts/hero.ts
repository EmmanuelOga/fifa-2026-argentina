/**
 * Hero runtime: papelitos burst + lazy three.js scene.
 *
 * three.js is dynamically imported (its own lazy chunk) and only after the hero
 * scrolls into view, so it never blocks first paint. Under prefers-reduced-motion
 * we skip everything animated and leave the static SVG rendition in place.
 */

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHero(): void {
  if (typeof window === 'undefined') return;
  if (reduced()) return; // static SVG stays; no motion

  papelitos();

  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!canvas) return;

  // lazy-init three only when the hero is on screen
  const start = () => initThree(canvas);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries.some((e) => e.isIntersecting)) {
          obs.disconnect();
          start();
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);
  } else {
    start();
  }
}

/** One-shot ticker-tape burst from the top of the hero. */
function papelitos(): void {
  const host = document.querySelector<HTMLElement>('.papelitos');
  if (!host) return;
  const colors = ['#1f8ad0', '#f2a51c', '#e5496b', '#ffffff', '#d6ecfa'];
  const n = Math.min(70, Math.round(window.innerWidth / 14));
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'papelito';
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[(Math.random() * colors.length) | 0]!;
    p.style.setProperty('--fall', `${90 + Math.random() * 60}vh`);
    p.style.setProperty('--spin', `${(Math.random() - 0.5) * 1400}deg`);
    p.style.animationDuration = `${2.6 + Math.random() * 2.8}s`;
    p.style.animationDelay = `${Math.random() * 0.8}s`;
    p.style.opacity = `${0.6 + Math.random() * 0.4}`;
    host.appendChild(p);
    // clean up after it finishes
    p.addEventListener('animationend', () => p.remove());
  }
}

async function initThree(canvas: HTMLCanvasElement): Promise<void> {
  let THREE: typeof import('three');
  try {
    THREE = await import('three');
  } catch {
    return; // three failed to load — static SVG remains
  }

  let renderer: import('three').WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // no WebGL — static SVG remains
  }

  const parent = canvas.parentElement!;
  const size = () => Math.max(1, Math.min(parent.clientWidth, parent.clientHeight));
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(size(), size(), false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Original geometry: a faceted "spark" — an icosahedron core in albiceleste,
  // wrapped by a golden wireframe cage. Evokes a ball/trophy without any crest.
  const group = new THREE.Group();

  const coreGeo = new THREE.IcosahedronGeometry(1.25, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x2a97dd,
    metalness: 0.15,
    roughness: 0.45,
    flatShading: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const cageGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const cage = new THREE.LineSegments(
    new THREE.WireframeGeometry(cageGeo),
    new THREE.LineBasicMaterial({ color: 0xf2a51c, transparent: true, opacity: 0.55 }),
  );
  group.add(cage);

  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xfff2d6, 1.5);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fd0f2, 0.9);
  rim.position.set(-4, -2, 2);
  scene.add(rim);

  // pointer + scroll reactivity
  const target = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    const r = parent.getBoundingClientRect();
    target.x = ((e.clientX - (r.left + r.width / 2)) / r.width) * 0.6;
    target.y = ((e.clientY - (r.top + r.height / 2)) / r.height) * 0.6;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let scrollTilt = 0;
  const onScroll = () => {
    scrollTilt = (window.scrollY || 0) * 0.0012;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const onResize = () => renderer.setSize(size(), size(), false);
  window.addEventListener('resize', onResize, { passive: true });

  canvas.classList.add('live');

  let raf = 0;
  let running = true;
  const clock = new THREE.Clock();
  const loop = () => {
    if (!running) return;
    const dt = clock.getDelta();
    group.rotation.y += dt * 0.35 + target.x * 0.02;
    group.rotation.x += (target.y * 0.6 + scrollTilt - group.rotation.x) * 0.05;
    cage.rotation.y -= dt * 0.15;
    cage.rotation.z += dt * 0.05;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  loop();

  // pause when off-screen to save battery
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        running = e.isIntersecting;
        if (running && !raf) loop();
        else if (!running) cancelAnimationFrame(raf), (raf = 0);
      }
    });
    io.observe(canvas);
  }
}
