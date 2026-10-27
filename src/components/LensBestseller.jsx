"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import "../styles/BestSeller.css";

// Use your existing product data
import { allProducts } from "../data/allProducts";

const AUTO_PLAY_DELAY = 3000;
const BEST_SELLER_LIMIT = 12;

/* ==========================================
   3D STAGE SETTINGS (world units)
========================================== */

const MIN_SLIDES = 6; // repeat products if the list is short
const CARD_W = 1;
const CARD_H = 1.15;
const FOV = 28;
const HALF_W = 1.25; // half of visible world width at front plane
const GROUP_X = 0; // 0 = front card exactly centered, stack goes to the right
const EXIT_DISTANCE = 1.2; // how far the front card flies out to the left

/*
  TABS
  key = replacementSchedule ke shuru ka shabd
  ("Daily Disposable" -> "daily")
*/
const TABS = [
  ["all", "Best Sellers"],
  ["daily", "Daily"],
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
];

const mod = (n, m) => ((n % m) + m) % m;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ==========================================
   FILTER HELPERS
   Daily / Weekly / Monthly asal me
   product.replacementSchedule me hai
========================================== */

// Sirf wahi products jinki selling price maujood hai
// const availableProducts = allProducts.filter(
//   (product) => product.price !== null && product.price !== undefined
// );



// const matchesTab = (product, tab) => {
//   if (tab === "all") return true;

//   const schedule = String(product.replacementSchedule || "")
//     .trim()
//     .toLowerCase();

//   return schedule.startsWith(tab);
// };






// Sirf wahi products jinki selling price maujood hai
const availableProducts = allProducts.filter(
  (product) => product.price !== null && product.price !== undefined
);

// "Best Sellers" tab me sirf itne products
// const BEST_SELLER_LIMIT = 12;

const BEST_SELLER_IDS = new Set(
  availableProducts.slice(0, BEST_SELLER_LIMIT).map((product) => product.id)
);

const matchesTab = (product, tab) => {
  if (tab === "all") return BEST_SELLER_IDS.has(product.id);

  const schedule = String(product.replacementSchedule || "")
    .trim()
    .toLowerCase();

  return schedule.startsWith(tab);
};





// Har tab me kitne products hain
const TAB_COUNTS = TABS.reduce((acc, [key]) => {
  acc[key] = availableProducts.filter((p) => matchesTab(p, key)).length;
  return acc;
}, {});

// 1059 -> "1,059"  (paise hata kar, Indian format)
const formatINR = (value) =>
  Math.round(Number(value) || 0).toLocaleString("en-IN");

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

/*
  Product tile: rounded card, light face,
  product image fitted inside (never stretched),
  thin border that turns teal on the front card.
*/
const tileFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uShade;
  uniform float uLoaded;
  uniform float uActive;
  uniform float uImgAspect;
  uniform float uTileAspect;
  varying vec2 vUv;

  vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

  void main() {
    vec2 size = vec2(uTileAspect, 1.0);
    vec2 p = (vUv - 0.5) * size;
    vec2 q = abs(p) - (size * 0.5 - 0.05);

    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.05;
    float edge = fwidth(d);

    float alpha = 1.0 - smoothstep(-edge, edge, d);
    float border = smoothstep(-0.012 - edge, -0.012, d);

    vec3 face = srgb(vec3(0.965, 0.965, 0.955));
    face += 0.02 * vUv.y;

    /* fit image inside the tile (object-fit: contain) */
    vec2 uv2 = (vUv - 0.5) / 0.78 + 0.5;
    float k = uImgAspect / uTileAspect;

    if (k > 1.0) {
      uv2.y = (uv2.y - 0.5) * k + 0.5;
    } else {
      uv2.x = (uv2.x - 0.5) / k + 0.5;
    }

    vec4 t = texture2D(uMap, uv2);

    float inside =
      step(0.0, uv2.x) * step(uv2.x, 1.0) *
      step(0.0, uv2.y) * step(uv2.y, 1.0) * uLoaded;

    vec3 col = mix(face, t.rgb, t.a * inside);

    vec3 borderCol = mix(
      srgb(vec3(0.878, 0.898, 0.894)),
      srgb(vec3(0.106, 0.42, 0.416)),
      uActive
    );

    col = mix(col, borderCol, border);
    col *= 1.0 - uShade;

    gl_FragColor = vec4(col, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const shadowFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float d = clamp(length(p), 0.0, 1.0);
    float a = pow(1.0 - d, 1.6) * 0.24 * uOpacity;

    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
    #include <colorspace_fragment>
  }
`;

export default function BestSellers() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("all");
  const [activeIdx, setActiveIdx] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [fallback, setFallback] = useState(false);

  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const hoverPausedRef = useRef(false);
  const engineRef = useRef({
    setSlides: () => {},
    next: () => {},
    prev: () => {},
  });

  /* =========================================
     LOAD WISHLIST FROM LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lensmartWishlist");

      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Wishlist load error:", error);
    }
  }, []);

  /* =========================================
     SYNC WISHLIST FROM OTHER COMPONENTS
  ========================================= */

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved =
          JSON.parse(localStorage.getItem("lensmartWishlist")) || [];

        setWishlist(saved);
      } catch (error) {
        console.error("Wishlist sync error:", error);
      }
    };

    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  /* =========================================
     FILTER + UI DATA
  ========================================= */

  const displayProducts = useMemo(() => {
    const filtered = availableProducts.filter((product) =>
      matchesTab(product, activeTab)
    );


  // "Best Sellers" tab par sirf pehle 12 products
  const visibleProducts =
    activeTab === "all" ? filtered.slice(0, BEST_SELLER_LIMIT) : filtered;


    return filtered.map((product) => {
      const hasDiscount =
        product.oldPrice && product.price && product.oldPrice > product.price;

      const discountPercent = hasDiscount
        ? Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100
          )
        : 0;

      const saveAmount = hasDiscount
        ? Math.round(product.oldPrice - product.price)
        : 0;

      return {
        ...product,

        // Convert imported Next.js image object to actual URL
        imageSrc: product.image?.src || product.image,

        // 42  (badge me "42%" + "OFF" alag-alag dikhte hain)
        discountPercent,

        // 766  ("Save ₹766")
        saveAmount,

        rating: product.rating ?? 4.8,
        reviews: product.reviewCount ?? product.reviews ?? 95,

        link: `/contact-lenses/${product.id}`,
      };
    });
  }, [activeTab]);

  const total = displayProducts.length;

  /* =========================================
     THREE.JS ENGINE (created once)
  ========================================= */

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!stage || !canvas) return;

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

    group.position.x = GROUP_X;
    scene.add(group);

    const tileGeometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const shadowGeometry = new THREE.PlaneGeometry(CARD_W * 0.95, 0.2);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    /* ---------- TEXTURE CACHE ---------- */

    const cache = new Map();

    const getTexture = (src, cb) => {
      let entry = cache.get(src);

      if (entry) {
        if (entry.tex) cb(entry);
        else entry.waiters.push(cb);
        return;
      }

      entry = { tex: null, aspect: 1, waiters: [cb] };
      cache.set(src, entry);

      loader.load(
        src,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }

          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = maxAniso;

          entry.tex = tex;

          const img = tex.image;

          if (img && img.width && img.height) {
            entry.aspect = img.width / img.height;
          }

          entry.waiters.forEach((w) => w(entry));
          entry.waiters = [];
        },
        undefined,
        () => {
          cache.delete(src);
        }
      );
    };

    /* ---------- STATE ---------- */

    let slides = [];

    let pos = 0;
    let target = 0;

    let width = 1;

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

    /* ---------- SLIDES ---------- */

    const createSlide = (item, productIndex) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: null },
          uOpacity: { value: 0 },
          uShade: { value: 0 },
          uLoaded: { value: 0 },
          uActive: { value: 0 },
          uImgAspect: { value: 1 },
          uTileAspect: { value: CARD_W / CARD_H },
        },
        vertexShader,
        fragmentShader: tileFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const disc = new THREE.Mesh(tileGeometry, material);

      const shadowMaterial = new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: 0 } },
        vertexShader,
        fragmentShader: shadowFragmentShader,
        transparent: true,
        depthWrite: false,
      });

      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);

      const slide = {
        disc,
        shadow,
        material,
        shadowMaterial,
        item,
        productIndex,
        loadStarted: false,
        loadedTarget: 0,
        removed: false,
      };

      disc.userData.slide = slide;
      disc.userData.index = slides.length;

      group.add(shadow);
      group.add(disc);

      slides.push(slide);
    };

    const loadSlide = (slide) => {
      slide.loadStarted = true;

      if (!slide.item.src) return;

      getTexture(slide.item.src, (entry) => {
        if (slide.removed || disposed) return;

        slide.material.uniforms.uMap.value = entry.tex;
        slide.material.uniforms.uImgAspect.value = entry.aspect;
        slide.loadedTarget = 1;
      });
    };

    const clearSlides = () => {
      slides.forEach((s) => {
        s.removed = true;
        group.remove(s.disc);
        group.remove(s.shadow);
        s.material.dispose();
        s.shadowMaterial.dispose();
      });

      slides = [];
    };

    const setSlides = (list) => {
      clearSlides();

      pos = 0;
      target = 0;
      autoTimer = 0;
      lastActive = -1;
      velocity = 0;

      if (!list.length) return;

      const repeat = Math.ceil(MIN_SLIDES / list.length);

      for (let r = 0; r < repeat; r++) {
        list.forEach((item, j) => createSlide(item, j));
      }
    };

    const realSlide = () =>
      slides.length ? mod(Math.round(target), slides.length) : 0;

    const goToSlide = (idx) => {
      const m = slides.length;

      if (!m) return;

      const base = Math.round(target);
      const delta = mod(idx - base + 1, m) - 1;

      target = base + delta;
      autoTimer = 0;
    };

    engineRef.current = {
      setSlides,
      next: () => {
        if (!slides.length) return;
        target = Math.round(target) + 1;
        autoTimer = 0;
      },
      prev: () => {
        if (!slides.length) return;
        target = Math.round(target) - 1;
        autoTimer = 0;
      },
    };

    /* ---------- RESIZE ---------- */

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;

      if (!w || !h) return;

      width = w;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);

      const visibleH = (HALF_W * 2 * h) / w;

      camera.aspect = w / h;
      camera.position.z =
        visibleH / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      camera.updateProjectionMatrix();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    /* ---------- POINTER ---------- */

    const pxPerItem = () => (width / (HALF_W * 2)) * 1.1;

    const pickTile = (e) => {
      const rect = canvas.getBoundingClientRect();

      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(ndc, camera);

      const hits = raycaster.intersectObjects(
        slides.filter((s) => s.disc.visible).map((s) => s.disc),
        false
      );

      return hits.length ? hits[0].object : null;
    };

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
          canvas.style.cursor = pickTile(e) ? "pointer" : "grab";
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
        const hit = pickTile(e);

        target = Math.round(target);

        if (hit) {
          const idx = hit.userData.index;

          if (idx === realSlide()) {
            router.push(hit.userData.slide.item.link);
          } else {
            goToSlide(idx);
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

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") engineRef.current.next();
      if (e.key === "ArrowLeft") engineRef.current.prev();
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

    /* ---------- LAYOUT PER FRAME ----------

       Cascade stack:
       o = 0   front card
       o > 0   cards stepping back to the right and up
       o < 0   card that just left, flying out to the left
    ---------------------------------------- */

    const layout = () => {
      const m = slides.length;

      for (let i = 0; i < m; i++) {
        const s = slides[i];
        const u = s.material.uniforms;

        /* asymmetric wrap: one card behind, rest ahead */
        const o = mod(i - pos + 1.5, m) - 1.5;
        const a = Math.abs(o);

        let x;
        let y;
        let z;
        let ry;
        let rz;
        let scale;
        let opacity;

        if (o >= 0) {
          x = 0.34 * o;
          y = 0.09 * o;
          z = -0.5 * o;
          ry = -0.22 * Math.min(o, 1);
          rz = 0;
          scale = 1 - 0.04 * o;
          opacity = clamp((4.2 - o) / 1.2, 0, 1);
        } else {
          const t = Math.min(-o, 1.5);

          x = -EXIT_DISTANCE * t;
          y = -0.05 * t;
          z = -0.15 * t;
          ry = 0.45 * t;
          rz = 0.1 * t;
          scale = 1;
          opacity = clamp(1 - t / 1.1, 0, 1);
        }

        /* load images only when the card is near the front */
        if (!s.loadStarted && o > -1.6 && o < 5) {
          loadSlide(s);
        }

        s.disc.position.set(x, y, z);
        s.disc.rotation.set(0, ry, rz);
        s.disc.scale.setScalar(scale);
        s.disc.renderOrder = Math.round(100 - o * 10);
        s.disc.visible = opacity > 0.01;

        u.uOpacity.value = opacity;
        u.uShade.value = clamp(o, 0, 3) * 0.03;
        u.uActive.value = clamp(1 - a * 1.5, 0, 1);
        u.uLoaded.value += (s.loadedTarget - u.uLoaded.value) * 0.12;

        s.shadow.visible = s.disc.visible;
        s.shadow.position.set(x, y - 0.62 * scale - 0.03, z - 0.01);
        s.shadow.scale.setScalar(scale);
        s.shadow.renderOrder = s.disc.renderOrder - 0.5;
        s.shadowMaterial.uniforms.uOpacity.value =
          opacity * clamp(1 - Math.max(o, 0) * 0.5, 0, 1);
      }
    };

    /* ---------- LOOP ---------- */

    const tick = (now) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!visible) return;

      const m = slides.length;

      if (m) {
        const ease = dragging ? 25 : 6;
        pos += (target - pos) * (1 - Math.exp(-dt * ease));

        if (!dragging && Math.abs(target - pos) < 0.0005) pos = target;

        /* keep numbers small */
        if (
          !dragging &&
          Math.abs(target - pos) < 0.01 &&
          Math.abs(pos) > m * 50
        ) {
          const shift = m * Math.floor(pos / m);
          pos -= shift;
          target -= shift;
        }

        /* autoplay */
        if (
          !reduceMotion &&
          !dragging &&
          !hoverPausedRef.current &&
          !document.hidden &&
          m > 1
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

          group.rotation.y = pointer.x * 0.07;
          group.rotation.x = pointer.y * 0.04;
        }

        layout();

        const active = slides[realSlide()].productIndex;

        if (active !== lastActive) {
          lastActive = active;
          setActiveIdx(active);
        }
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

      clearSlides();

      cache.forEach((entry) => {
        if (entry.tex) entry.tex.dispose();
      });

      cache.clear();

      tileGeometry.dispose();
      shadowGeometry.dispose();
      renderer.dispose();

      engineRef.current = {
        setSlides: () => {},
        next: () => {},
        prev: () => {},
      };
    };
  }, [router]);

  /* =========================================
     SEND PRODUCTS TO THE 3D STAGE
     (tab badalte hi naye filtered products)
  ========================================= */

  useEffect(() => {
    engineRef.current.setSlides(
      displayProducts.map((product) => ({
        src: product.imageSrc,
        link: product.link,
      }))
    );

    setActiveIdx(0);
  }, [displayProducts]);

  /* =========================================
     NEXT / PREVIOUS
  ========================================= */

  const goNext = useCallback(() => {
    if (fallback) {
      setActiveIdx((i) => (total ? (i + 1) % total : 0));
    } else {
      engineRef.current.next();
    }
  }, [fallback, total]);

  const goPrevious = useCallback(() => {
    if (fallback) {
      setActiveIdx((i) => (total ? (i - 1 + total) % total : 0));
    } else {
      engineRef.current.prev();
    }
  }, [fallback, total]);

  /* =========================================
     WISHLIST
  ========================================= */

  const isWishlisted = (id) =>
    wishlist.some(
      (item) =>
        Number(item.id) === Number(id) && item.productType === "contact-lens"
    );

  const toggleWishlist = (product) => {
    try {
      const productId = Number(product.id);

      const exists = wishlist.some(
        (item) =>
          Number(item.id) === productId && item.productType === "contact-lens"
      );

      const updated = exists
        ? wishlist.filter(
            (item) =>
              !(
                Number(item.id) === productId &&
                item.productType === "contact-lens"
              )
          )
        : [
            ...wishlist,
            {
              id: productId,
              productType: "contact-lens",
              name: product.name,
              category: "Contact Lens",
              brand: product.brand || "",
              manufacturer: product.manufacturer || "",
              type: product.type || "",
              pack: product.pack || "",
              image: product.image,
              price: product.price,
              oldPrice: product.oldPrice,
              link: `/contact-lenses/${productId}`,
            },
          ];

      setWishlist(updated);

      localStorage.setItem("lensmartWishlist", JSON.stringify(updated));

      // Notify other components
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist update error:", error);
    }
  };

  /* =========================================
     ACTIVE PRODUCT (shown in the panel)
  ========================================= */

  const product = total
    ? displayProducts[Math.min(activeIdx, total - 1)]
    : null;

  const price = Number(product?.price || 0);
  const oldPrice = Number(product?.oldPrice || 0);
  const hasOldPrice = oldPrice > price;
  const wishlisted = product ? isWishlisted(product.id) : false;

  const progress = total
    ? ((Math.min(activeIdx, total - 1) + 1) / total) * 100
    : 0;

  return (
    <section className="updatedbestseller-section">
      {/* BACKGROUND OVERLAY */}
      <div className="updatedbestseller-overlay" />

      <div className="updatedbestseller-container">
        {/* HEADING */}
        <h2 className="updatedbestseller-heading">MOST LOVED CONTACT LENSES</h2>

        {/* TABS */}
        <div
          className="updatedbestseller-tabs"
          role="tablist"
          aria-label="Filter contact lenses"
        >
          {TABS.map(([key, label]) => {
            const count = TAB_COUNTS[key];

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                disabled={count === 0}
                className={`updatedbestseller-tab ${
                  activeTab === key ? "active" : ""
                }`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* SHOWCASE: 3D stack + product panel */}
        <div
          className="updatedbestseller-showcase"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") {
              hoverPausedRef.current = true;
            }
          }}
          onPointerLeave={() => {
            hoverPausedRef.current = false;
          }}
        >
          {/* 3D STAGE */}
          {fallback ? (
            <div className="updatedbestseller-stage updatedbestseller-stage-fallback">
              {product && (
                <Link href={product.link}>
                  <img src={product.imageSrc} alt={product.name} />
                </Link>
              )}
            </div>
          ) : (
            <div
              ref={stageRef}
              className="updatedbestseller-stage"
              tabIndex={0}
              role="group"
              aria-roledescription="carousel"
              aria-label="Bestselling contact lenses"
            >
              <canvas
                ref={canvasRef}
                className="updatedbestseller-canvas"
                aria-hidden="true"
              />
            </div>
          )}

          {/* PRODUCT PANEL */}
          <div className="updatedbestseller-panel">
            {product ? (
              <div className="updatedbestseller-panel-body" key={product.id}>
                {/* TOP ROW: OFF ribbon + wishlist */}
                <div className="updatedbestseller-panel-top">
                  {product.discountPercent > 0 ? (
                    <span className="updatedbestseller-discount">
                      <span className="updatedbestseller-discount-num">
                        {product.discountPercent}
                        <small>%</small>
                      </span>
                      <span className="updatedbestseller-discount-off">
                        OFF
                      </span>
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    className={`updatedbestseller-wishlist ${
                      wishlisted ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
                    aria-label={
                      wishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    aria-pressed={wishlisted}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                    </svg>
                  </button>
                </div>

                {/* BRAND + 100% ORIGINAL */}
                <div className="updatedbestseller-brandrow">
                  <p className="updatedbestseller-brand">
                    {product.manufacturer}
                  </p>

                  <span className="updatedbestseller-original">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.5 4.5 5.5v5.6c0 4.5 3.1 8.6 7.5 10.4 4.4-1.8 7.5-5.9 7.5-10.4V5.5L12 2.5Z" />
                      <path d="m8.6 12.2 2.4 2.4 4.4-4.6" />
                    </svg>
                    100% original
                  </span>
                </div>

                {/* PRODUCT NAME */}
                <Link
                  href={product.link}
                  className="updatedbestseller-product-name"
                >
                  {product.name}
                </Link>

                {/* TAGS: Color · Monthly Disposable · Spherical */}
                <p className="updatedbestseller-tags">
                  {product.isColor && (
                    <>
                      <span className="updatedbestseller-tag-color">Color</span>
                      <i className="updatedbestseller-dot">·</i>
                    </>
                  )}

                  {product.replacementSchedule && (
                    <>
                      <span className="updatedbestseller-tag-schedule">
                        {product.replacementSchedule}
                      </span>
                      <i className="updatedbestseller-dot">·</i>
                    </>
                  )}

                  {product.type && (
                    <span className="updatedbestseller-tag-type">
                      {product.type}
                    </span>
                  )}
                </p>

                {/* RATING */}
                <div className="updatedbestseller-rating">
                  <span className="updatedbestseller-rating-star">★</span>

                  <strong>{product.rating}</strong>

                  {product.reviews > 0 && (
                    <span className="updatedbestseller-review-count">
                      ({product.reviews})
                    </span>
                  )}
                </div>

                {/* PRICE */}
                <div className="updatedbestseller-bottom">
                  <div className="updatedbestseller-price">
                    <span className="updatedbestseller-current-price">
                      ₹{formatINR(price)}
                    </span>

                    {hasOldPrice && (
                      <span className="updatedbestseller-old-price">
                        ₹{formatINR(oldPrice)}
                      </span>
                    )}
                  </div>

                  {product.pack && (
                    <span className="updatedbestseller-pack">
                      {product.pack}
                    </span>
                  )}
                </div>

                {/* SAVE */}
                {product.saveAmount > 0 && (
                  <p className="updatedbestseller-save">
                    Save ₹{formatINR(product.saveAmount)}
                  </p>
                )}

                {/* CTA */}
                <Link href={product.link} className="updatedbestseller-cta">
                  Choose your power
                </Link>
              </div>
            ) : (
              <p className="updatedbestseller-empty">
                No products available for this category.
              </p>
            )}

            {/* CONTROLS */}
            {total > 1 && (
              <div className="updatedbestseller-controls">
                <button
                  type="button"
                  className="updatedbestseller-arrow"
                  onClick={goPrevious}
                  aria-label="Previous product"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="updatedbestseller-arrow"
                  onClick={goNext}
                  aria-label="Next product"
                >
                  ›
                </button>

                <span className="updatedbestseller-count">
                  {Math.min(activeIdx, total - 1) + 1} / {total}
                </span>

                <span className="updatedbestseller-progress" aria-hidden="true">
                  <span
                    className="updatedbestseller-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}