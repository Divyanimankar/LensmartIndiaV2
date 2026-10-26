"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import "../styles/exclusiveDeals.css";

const deals = [
  {
    id: 1,
    image: "/images/deal1.png",
    alt: "LensMartIndia exclusive eyewear deal",
    link: "/",
  },
  {
    id: 2,
    image: "/images/deal2.png",
    alt: "LensMartIndia premium eyewear offer",
    link: "/",
  },
  {
    id: 3,
    image: "/images/deal3.png",
    alt: "LensMartIndia sunglasses deal",
    link: "/",
  },
  {
    id: 4,
    image: "/images/deal4.png",
    alt: "LensMartIndia eyeglasses offer",
    link: "/",
  },
  {
    id: 5,
    image: "/images/deal5.png",
    alt: "LensMartIndia special eyewear deal",
    link: "/",
  },
];

const AUTO_PLAY_DELAY = 3000;

/* Card size in world units (16:9 banner) */
const CARD_W = 16 / 9;
const CARD_H = 1;
const FOV = 30;

const mod = (n, m) => ((n % m) + m) % m;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ==========================================
   SHADERS
   Rounded corners + soft side shading
========================================== */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uShade;
  uniform float uLoaded;
  uniform float uAspect;
  uniform float uRadius;
  varying vec2 vUv;

  void main() {
    vec2 size = vec2(uAspect, 1.0);
    vec2 p = (vUv - 0.5) * size;
    vec2 q = abs(p) - (size * 0.5 - uRadius);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float edge = fwidth(d);
    float alpha = 1.0 - smoothstep(-edge, edge, d);

    vec3 tex = texture2D(uMap, vUv).rgb;
    vec3 color = mix(vec3(0.90), tex, uLoaded);
    color *= (1.0 - uShade);

    gl_FragColor = vec4(color, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

export default function ExclusiveDeals() {
  const router = useRouter();

  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const hoverPausedRef = useRef(false);
  const apiRef = useRef({
    next: () => {},
    prev: () => {},
    goToReal: () => {},
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!stage || !canvas) return;

    const n = deals.length;
    let disposed = false;

    /* ---------- RENDERER ---------- */

    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      setFallback(true);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = [];

    /* ---------- CARDS ---------- */

    const cards = deals.map((deal, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: null },
          uOpacity: { value: 1 },
          uShade: { value: 0 },
          uLoaded: { value: 0 },
          uAspect: { value: CARD_W },
          uRadius: { value: 0.05 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.index = i;
      mesh.userData.loadedTarget = 0;
      group.add(mesh);

      loader.load(deal.image, (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }

        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        textures.push(tex);

        material.uniforms.uMap.value = tex;
        mesh.userData.loadedTarget = 1;
      });

      return mesh;
    });

    /* ---------- STATE ---------- */

    let pos = 0; // current (animated) position
    let target = 0; // where we want to be

    let width = 1;
    let height = 1;
    let cardFrac = 0.52;
    let spacing = 1;

    let dragging = false;
    let dragMoved = 0;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let startTarget = 0;
    let velocity = 0;

    let autoTimer = 0;
    let lastTime = performance.now();
    let raf = 0;
    let visible = true;
    let lastActive = -1;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    /* ---------- RESIZE ---------- */

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;

      if (!w || !h) return;

      width = w;
      height = h;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);

      cardFrac = w < 640 ? 0.84 : w < 1024 ? 0.64 : 0.52;
      spacing = w < 640 ? 0.93 : w < 1024 ? 0.97 : 1.0;

      const visibleW = CARD_W / cardFrac;
      const visibleH = (visibleW * h) / w;

      camera.aspect = w / h;
      camera.position.z =
        visibleH / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      camera.updateProjectionMatrix();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    /* ---------- HELPERS ---------- */

    const realIndex = () => mod(Math.round(target), n);

    const goToReal = (idx) => {
      const base = Math.round(target);
      const delta = mod(idx - base + n / 2, n) - n / 2;
      target = base + delta;
      autoTimer = 0;
    };

    apiRef.current = {
      next: () => {
        target = Math.round(target) + 1;
        autoTimer = 0;
      },
      prev: () => {
        target = Math.round(target) - 1;
        autoTimer = 0;
      },
      goToReal,
    };

    const pick = (e) => {
      const rect = canvas.getBoundingClientRect();

      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(ndc, camera);

      const hits = raycaster.intersectObjects(
        cards.filter((c) => c.visible),
        false
      );

      return hits.length ? hits[0].object : null;
    };

    const pxPerCard = () => cardFrac * spacing * width;

    /* ---------- POINTER EVENTS ---------- */

    const onPointerDown = (e) => {
      dragging = true;
      dragMoved = 0;
      startX = lastX = e.clientX;
      startTarget = target;
      velocity = 0;
      lastT = performance.now();
      canvas.style.cursor = "grabbing";

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (!dragging) {
        if (e.pointerType === "mouse") {
          const hit = pick(e);
          canvas.style.cursor =
            hit && hit.userData.index === realIndex() ? "pointer" : "grab";
        }
        return;
      }

      const dx = e.clientX - startX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));

      target = startTarget - dx / pxPerCard();

      const now = performance.now();
      const dt = (now - lastT) / 1000;

      if (dt > 0) {
        const v = (e.clientX - lastX) / dt / pxPerCard();
        velocity = velocity * 0.8 + v * 0.2;
      }

      lastX = e.clientX;
      lastT = now;
    };

    const onPointerUp = (e) => {
      if (!dragging) return;

      dragging = false;
      canvas.style.cursor = "grab";

      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}

      autoTimer = 0;

      /* TAP / CLICK */
      if (dragMoved < 6) {
        const hit = pick(e);

        target = Math.round(target);

        if (hit) {
          const idx = hit.userData.index;

          if (idx === realIndex()) {
            router.push(deals[idx].link);
          } else {
            goToReal(idx);
          }
        }

        return;
      }

      /* SWIPE → SNAP */
      const snapped = Math.round(target - velocity * 0.25);

      target = clamp(snapped, startTarget - 3, startTarget + 3);
    };

    const onPointerLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    canvas.style.cursor = "grab";

    /* ---------- KEYBOARD ---------- */

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") apiRef.current.next();
      if (e.key === "ArrowLeft") apiRef.current.prev();
    };

    stage.addEventListener("keydown", onKeyDown);

    /* ---------- VISIBILITY ---------- */

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        lastTime = performance.now();
      },
      { threshold: 0.05 }
    );

    io.observe(stage);

    /* ---------- LAYOUT PER FRAME ---------- */

    const layout = () => {
      for (let i = 0; i < n; i++) {
        const mesh = cards[i];
        const u = mesh.material.uniforms;

        const o = mod(i - pos + n / 2, n) - n / 2;
        const a = Math.abs(o);
        const s = Math.sign(o);
        const c = Math.min(a, 1);
        const extra = Math.max(a - 1, 0);

        mesh.position.set(
          s * (c + extra * 0.8) * CARD_W * spacing,
          0,
          -c * 0.9 - extra * 0.4
        );

        mesh.rotation.y = -clamp(o, -1, 1) * 0.5;
        mesh.scale.setScalar(1 - c * 0.1);
        mesh.renderOrder = Math.round(100 - a * 10);
        mesh.visible = a < 2.6;

        u.uOpacity.value = (1 - 0.2 * c) * clamp(2.2 - a, 0, 1);
        u.uShade.value = c * 0.1;
        u.uLoaded.value +=
          (mesh.userData.loadedTarget - u.uLoaded.value) * 0.12;
      }
    };

    /* ---------- LOOP ---------- */

    const tick = (now) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!visible) return;

      /* smooth follow */
      const ease = dragging ? 25 : 6;
      pos += (target - pos) * (1 - Math.exp(-dt * ease));

      if (!dragging && Math.abs(target - pos) < 0.0005) pos = target;

      /* keep numbers small */
      if (!dragging && Math.abs(target - pos) < 0.01 && Math.abs(pos) > n * 50) {
        const shift = n * Math.floor(pos / n);
        pos -= shift;
        target -= shift;
      }

      /* autoplay */
      if (
        !reduceMotion &&
        !dragging &&
        !hoverPausedRef.current &&
        !document.hidden
      ) {
        autoTimer += dt * 1000;

        if (autoTimer >= AUTO_PLAY_DELAY) {
          autoTimer = 0;
          target = Math.round(target) + 1;
        }
      }

      /* gentle pointer tilt */
      if (!reduceMotion) {
        pointer.x += (pointer.tx - pointer.x) * 0.08;
        pointer.y += (pointer.ty - pointer.y) * 0.08;

        group.rotation.y = pointer.x * 0.06;
        group.rotation.x = pointer.y * 0.04;
      }

      layout();

      const active = realIndex();

      if (active !== lastActive) {
        lastActive = active;
        setActiveIndex(active);
      }

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(tick);

    /* ---------- CLEANUP ---------- */

    return () => {
      disposed = true;

      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("keydown", onKeyDown);

      cards.forEach((c) => c.material.dispose());
      textures.forEach((t) => t.dispose());
      geometry.dispose();
      renderer.dispose();
    };
  }, [router]);

  return (
    <section className="exclusive-deals-section">
      <div className="exclusive-deals-container">

        {/* HEADER */}
        <div className="exclusive-deals-header">
          <h2 className="exclusive-deals-heading">
            EXCLUSIVE DEALS
          </h2>

          <Link
            href="/offers"
            className="exclusive-view-all"
          >
            View All
            <span>›</span>
          </Link>
        </div>

        {/* SLIDER */}
        <div
          className="exclusive-slider-wrapper"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") {
              hoverPausedRef.current = true;
            }
          }}
          onPointerLeave={() => {
            hoverPausedRef.current = false;
          }}
        >
          {fallback ? (
            /* No WebGL → simple scrolling row */
            <div className="exclusive-fallback">
              {deals.map((deal) => (
                <Link
                  key={deal.id}
                  href={deal.link}
                  className="exclusive-fallback-card"
                >
                  <img src={deal.image} alt={deal.alt} loading="lazy" />
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div
                ref={stageRef}
                className="exclusive-stage"
                tabIndex={0}
                role="group"
                aria-roledescription="carousel"
                aria-label="Exclusive deals"
              >
                <canvas
                  ref={canvasRef}
                  className="exclusive-canvas"
                  aria-hidden="true"
                />
              </div>

              <button
                type="button"
                className="exclusive-arrow exclusive-prev"
                onClick={() => apiRef.current.prev()}
                aria-label="Previous deal"
              >
                ‹
              </button>

              <button
                type="button"
                className="exclusive-arrow exclusive-next"
                onClick={() => apiRef.current.next()}
                aria-label="Next deal"
              >
                ›
              </button>

              {/* Real links for keyboard / screen readers / SEO */}
              <ul className="exclusive-sr-only">
                {deals.map((deal) => (
                  <li key={deal.id}>
                    <Link href={deal.link}>{deal.alt}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* DOTS */}
        {!fallback && (
          <div className="exclusive-deals-dots">
            {deals.map((deal, index) => (
              <button
                key={deal.id}
                type="button"
                className={`exclusive-deal-dot ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => apiRef.current.goToReal(index)}
                aria-label={`Go to deal ${index + 1}`}
                aria-current={activeIndex === index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}