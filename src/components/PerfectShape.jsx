"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import "../styles/perfectShape.css";

/* ==========================================
   DATA  (dono categories ka alag data)
========================================== */

const SHAPES = {
  eyeglasses: [
    { id: 1, name: "RECTANGLE", image: "/images/shaperectangle.png", link: "/eyeglasses/rectangle" },
    { id: 2, name: "CAT EYE", image: "/images/shapecateye.png", link: "/eyeglasses/cat-eye" },
    { id: 3, name: "AVIATOR", image: "/images/shapeaviator.png", link: "/eyeglasses/aviator" },
    { id: 4, name: "GEOMETRIC", image: "/images/shapegeometric.png", link: "/eyeglasses/geometric" },
    { id: 5, name: "ROUND", image: "/images/shaperound.png", link: "/eyeglasses/round" },
    { id: 6, name: "CLUBMASTER", image: "/images/shapeclubmaster.png", link: "/eyeglasses/clubmaster" },
    { id: 7, name: "OVAL", image: "/images/shapeoval.png", link: "/eyeglasses/oval" },
    { id: 8, name: "SQUARE", image: "/images/shapesquare.png", link: "/eyeglasses/square" },
    { id: 9, name: "WAYFARER", image: "/images/shapewayfarer.png", link: "/eyeglasses/wayfarer" },
    { id: 10, name: "RIMLESS", image: "/images/shaperimless.png", link: "/eyeglasses/rimless" },
  ],
  sunglasses: [
    { id: 1, name: "RECTANGLE", image: "/images/sunRectangle.png", link: "/sunglasses/rectangle" },
    { id: 2, name: "CAT EYE", image: "/images/sunCatEye.png", link: "/sunglasses/cat-eye" },
    { id: 3, name: "AVIATOR", image: "/images/sunAviator.png", link: "/sunglasses/aviator" },
    { id: 4, name: "GEOMETRIC", image: "/images/sunGeometric.png", link: "/sunglasses/geometric" },
    { id: 5, name: "ROUND", image: "/images/sunRound.png", link: "/sunglasses/round" },
    { id: 6, name: "CLUBMASTER", image: "/images/sunClubmaster.png", link: "/sunglasses/clubmaster" },
    { id: 7, name: "OVAL", image: "/images/sunOval.png", link: "/sunglasses/oval" },
    { id: 8, name: "SQUARE", image: "/images/sunSquare.png", link: "/sunglasses/square" },
    { id: 9, name: "WAYFARER", image: "/images/sunWayfarer.png", link: "/sunglasses/wayfarer" },
    { id: 10, name: "RIMLESS", image: "/images/sunRimless.png", link: "/sunglasses/rimless" },
  ],
};

const TABS = [
  { key: "eyeglasses", label: "Eyeglasses" },
  { key: "sunglasses", label: "Sunglasses" },
];

const DOT_COUNT = 5;
const AUTO_PLAY_DELAY = 3000;

/* ==========================================
   WHEEL SETTINGS (world units, disc = 1)
========================================== */

const RADIUS = 3.6;
const ANGLE_STEP = 0.42;
const FOV = 12;
const SCREEN_STEP = 1.35;

const mod = (n, m) => ((n % m) + m) % m;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ==========================================
   SHADERS
========================================== */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const discFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uShade;
  uniform float uLoaded;
  uniform float uActive;
  uniform float uImgAspect;
  varying vec2 vUv;

  vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float edge = fwidth(r);

    float disc = 1.0 - smoothstep(1.0 - edge, 1.0, r);
    float rim = smoothstep(0.965 - edge, 0.965, r);

    vec3 face = srgb(vec3(0.961));
    face *= 1.0 - 0.05 * r * r;

    vec2 uv2 = (vUv - 0.5) / 0.78 + 0.5;

    if (uImgAspect > 1.0) {
      uv2.y = (uv2.y - 0.5) * uImgAspect + 0.5;
    } else {
      uv2.x = (uv2.x - 0.5) / uImgAspect + 0.5;
    }

    vec4 t = texture2D(uMap, uv2);

    float inside =
      step(0.0, uv2.x) * step(uv2.x, 1.0) *
      step(0.0, uv2.y) * step(uv2.y, 1.0) * uLoaded;

    vec3 tex = (t.rgb - 0.5) * 1.08 + 0.5;
    vec3 col = mix(face, tex, t.a * inside);

    vec3 rimColor = mix(
      srgb(vec3(1.0)),
      srgb(vec3(0.106, 0.42, 0.416)),
      uActive
    );

    col = mix(col, rimColor, rim);
    col *= 1.0 - uShade;

    gl_FragColor = vec4(col, disc * uOpacity);
    #include <colorspace_fragment>
  }
`;

const shadowFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float d = clamp(length(p), 0.0, 1.0);
    float a = pow(1.0 - d, 1.6) * 0.26 * uOpacity;

    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    #include <colorspace_fragment>
  }
`;

export default function PerfectShape() {
  const router = useRouter();

  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const hoverPausedRef = useRef(false);
  const apiRef = useRef({
    next: () => {},
    prev: () => {},
    goToReal: () => {},
  });

  const [category, setCategory] = useState("eyeglasses");
  const [activeIndex, setActiveIndex] = useState(0);
  const [fallback, setFallback] = useState(false);

  const shapes = SHAPES[category];
  const categoryLabel = category;

  const changeCategory = (key) => {
    if (key === category) return;
    setActiveIndex(0);
    setCategory(key);
  };

  /* Category change hone par effect dobara chalta hai.
     Stage ka key={category} hai, isliye fresh canvas + fresh scene banta hai. */
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!stage || !canvas) return;

    const list = SHAPES[category];
    const n = list.length;
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

    const discGeometry = new THREE.PlaneGeometry(1, 1);
    const shadowGeometry = new THREE.PlaneGeometry(0.95, 0.2);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = [];

    /* ---------- DISCS + SHADOWS ---------- */

    const items = list.map((shape, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: null },
          uOpacity: { value: 1 },
          uShade: { value: 0 },
          uLoaded: { value: 0 },
          uActive: { value: 0 },
          uImgAspect: { value: 1 },
        },
        vertexShader,
        fragmentShader: discFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const disc = new THREE.Mesh(discGeometry, material);
      disc.userData.index = i;
      disc.userData.loadedTarget = 0;

      const shadowMaterial = new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: 1 } },
        vertexShader,
        fragmentShader: shadowFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);

      group.add(shadow);
      group.add(disc);

      loader.load(shape.image, (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }

        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        textures.push(tex);

        const img = tex.image;

        if (img && img.width && img.height) {
          material.uniforms.uImgAspect.value = img.width / img.height;
        }

        material.uniforms.uMap.value = tex;
        disc.userData.loadedTarget = 1;
      });

      return { disc, shadow, material, shadowMaterial };
    });

    const discs = items.map((it) => it.disc);

    /* ---------- STATE ---------- */

    let pos = 0;
    let target = 0;

    let width = 1;
    let halfW = 3;

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

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);

      halfW = w < 640 ? 1.7 : w < 1024 ? 2.6 : 3.0;

      const visibleH = (halfW * 2 * h) / w;

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

    const pickDisc = (e) => {
      const rect = canvas.getBoundingClientRect();

      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(ndc, camera);

      const hits = raycaster.intersectObjects(
        discs.filter((d) => d.visible),
        false
      );

      const hit = hits.find(
        (h) => h.uv && Math.hypot(h.uv.x - 0.5, h.uv.y - 0.5) <= 0.5
      );

      return hit ? hit.object : null;
    };

    const pxPerItem = () => (width / (halfW * 2)) * SCREEN_STEP;

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
          const hit = pickDisc(e);
          canvas.style.cursor = hit ? "pointer" : "grab";
        }
        return;
      }

      const dx = e.clientX - startX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));

      target = startTarget - dx / pxPerItem();

      const now = performance.now();
      const dt = (now - lastT) / 1000;

      if (dt > 0) {
        const v = (e.clientX - lastX) / dt / pxPerItem();
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

      /* TAP */
      if (dragMoved < 6) {
        const hit = pickDisc(e);

        target = Math.round(target);

        if (hit) {
          const idx = hit.userData.index;

          if (idx === realIndex()) {
            router.push(list[idx].link);
          } else {
            goToReal(idx);
          }
        }

        return;
      }

      /* SWIPE → SNAP */
      const snapped = Math.round(target - velocity * 0.25);

      target = clamp(snapped, startTarget - 4, startTarget + 4);
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
        const { disc, shadow, material, shadowMaterial } = items[i];
        const u = material.uniforms;

        const o = mod(i - pos + n / 2, n) - n / 2;
        const a = Math.abs(o);
        const th = o * ANGLE_STEP;

        const x = RADIUS * Math.sin(th);
        const z = RADIUS * (Math.cos(th) - 1);
        const scale = 1 + 0.22 * Math.max(0, 1 - a);

        disc.position.set(x, 0, z);
        disc.rotation.y = th * 0.55;
        disc.scale.setScalar(scale);
        disc.renderOrder = Math.round(100 - a * 10);
        disc.visible = a < 2.6;

        const opacity = clamp(1 - (a - 1.6) / 0.9, 0, 1);

        u.uOpacity.value = opacity;
        u.uShade.value = Math.min(a, 2.5) * 0.035;
        u.uActive.value = clamp(1 - a * 1.4, 0, 1);
        u.uLoaded.value +=
          (disc.userData.loadedTarget - u.uLoaded.value) * 0.12;

        shadow.visible = disc.visible;
        shadow.position.set(x, -0.64 * scale, z - 0.01);
        shadow.scale.setScalar(scale);
        shadow.renderOrder = disc.renderOrder - 0.5;
        shadowMaterial.uniforms.uOpacity.value = opacity;
      }
    };

    /* ---------- LOOP ---------- */

    const tick = (now) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!visible) return;

      const ease = dragging ? 25 : 6;
      pos += (target - pos) * (1 - Math.exp(-dt * ease));

      if (!dragging && Math.abs(target - pos) < 0.0005) pos = target;

      if (
        !dragging &&
        Math.abs(target - pos) < 0.01 &&
        Math.abs(pos) > n * 50
      ) {
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

        group.rotation.y = pointer.x * 0.08;
        group.rotation.x = pointer.y * 0.05;
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

      items.forEach((it) => {
        it.material.dispose();
        it.shadowMaterial.dispose();
      });

      textures.forEach((t) => t.dispose());
      discGeometry.dispose();
      shadowGeometry.dispose();
      renderer.dispose();
    };
  }, [router, category]);

  const activeShape = shapes[activeIndex] || shapes[0];
  const activeDot = Math.min(DOT_COUNT - 1, Math.floor(activeIndex / 2));

  return (
    <section className="perfect-shape-section">
      <div className="perfect-shape-container">

        {/* HEADING */}
        <h2 className="perfect-shape-heading">
          PERFECT SHAPE - <span>{categoryLabel.toUpperCase()}</span>
        </h2>

        {/* TABS */}
        <div className="ps-tabs" role="tablist" aria-label="Choose glasses type">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`ps-tab-${tab.key}`}
              aria-selected={category === tab.key}
              aria-controls="ps-panel"
              className={`ps-tab ${category === tab.key ? "active" : ""}`}
              onClick={() => changeCategory(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PANEL (fade-in on tab change) */}
        <div
          key={category}
          id="ps-panel"
          role="tabpanel"
          aria-labelledby={`ps-tab-${category}`}
          className="ps-panel"
        >
        {/* SLIDER */}
        <div
          className="perfect-shape-slider-wrapper"
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
            <div className="ps-fallback">
              {shapes.map((shape) => (
                <Link
                  key={`${category}-${shape.id}`}
                  href={shape.link}
                  className="ps-fallback-item"
                >
                  <span className="ps-fallback-circle">
                    <img
                      src={shape.image}
                      alt={`${shape.name} ${categoryLabel}`}
                      loading="lazy"
                    />
                  </span>
                  <span className="ps-fallback-name">{shape.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div
                key={category}
                ref={stageRef}
                className="ps-stage"
                tabIndex={0}
                role="group"
                aria-roledescription="carousel"
                aria-label={`${categoryLabel} shapes`}
              >
                <canvas
                  ref={canvasRef}
                  className="ps-canvas"
                  aria-hidden="true"
                />
              </div>

              <button
                type="button"
                className="shape-arrow shape-prev"
                onClick={() => apiRef.current.prev()}
                aria-label={`Previous ${categoryLabel} shape`}
              >
                ‹
              </button>

              <button
                type="button"
                className="shape-arrow shape-next"
                onClick={() => apiRef.current.next()}
                aria-label={`Next ${categoryLabel} shape`}
              >
                ›
              </button>

              {/* Real links for keyboard / screen readers / SEO */}
              <ul className="ps-sr-only">
                {shapes.map((shape) => (
                  <li key={`${category}-${shape.id}`}>
                    <Link href={shape.link}>
                      Shop {shape.name} {categoryLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        </div>

        {/* ACTIVE SHAPE */}
        {!fallback && (
          <div className="ps-active">
            <Link
              key={`${category}-${activeShape.id}`}
              // href={activeShape.link}
               href={`/${category}`}
              className="ps-active-link"
            >
              <span className="ps-active-name">{activeShape.name}</span>
              <span className="ps-active-text">Shop {categoryLabel}</span>
            </Link>
          </div>
        )}

        {/* EXACTLY 5 DOTS */}
        {!fallback && (
          <div className="perfect-shape-dots">
            {Array.from({ length: DOT_COUNT }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`perfect-shape-dot ${
                  activeDot === index ? "active" : ""
                }`}
                onClick={() => apiRef.current.goToReal(index * 2)}
                aria-label={`Go to ${categoryLabel} shape group ${index + 1}`}
                aria-current={activeDot === index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
