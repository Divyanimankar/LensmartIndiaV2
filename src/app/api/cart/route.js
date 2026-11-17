import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAccessToken,
  readCustomerMeta,
  writeCustomerMeta,
} from "@/lib/customer-api";

export const dynamic = "force-dynamic";

/* =========================================================
   LensMartIndia cart  ->  Shopify Cart (Storefront API)

   Cart ID browser me httpOnly cookie "lm_cart" me rehti hai.
   Browser ko cart "items" ki form me wapas milta hai (purane
   localStorage wale shape jaisa), taaki UI same rahe.

   POST /api/cart   body: { action, ... }
     get
     add     { item }
     update  { key, side, quantity }   side: "right" | "left" | "all"
     remove  { key }
========================================================= */

const COOKIE = "lm_cart";
const SYNCED = "lm_cart_synced"; /* kaunsa cart ID customer metafield me save ho chuka */
const API_VERSION = "2025-01";

const env = (name) => String(process.env[name] || "").trim();
const text = (v) => String(v ?? "").trim();

const STOREFRONT_URL = () =>
  `https://${env("SHOPIFY_STORE_DOMAIN")}/api/${API_VERSION}/graphql.json`;

/* ---------- Shopify call ---------- */

async function shopify(query, variables) {
  const res = await fetch(STOREFRONT_URL(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env("SHOPIFY_STOREFRONT_TOKEN"),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();

  if (json?.errors?.length) {
    const error = new Error(json.errors[0].message || "Shopify error");
    error.detail = JSON.stringify(json.errors).slice(0, 400);
    throw error;
  }

  return json.data;
}

/* ---------- GraphQL ---------- */

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 100) {
    nodes {
      id
      quantity
      attributes { key value }
      cost {
        amountPerQuantity { amount }
        compareAtAmountPerQuantity { amount }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          selectedOptions { name value }
          image { url }
          product {
            id
            title
            handle
            vendor
            featuredImage { url }
          }
        }
      }
    }
  }
`;

const Q_CART = `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;

const M_CREATE = `mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

const M_ADD = `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

const M_UPDATE = `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

const M_REMOVE = `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

/* userErrors ho to throw karo */
function unwrap(result) {
  const errors = result?.userErrors || [];
  if (errors.length) {
    const error = new Error(errors[0].message || "Could not update cart.");
    error.user = true;
    throw error;
  }
  return result?.cart || null;
}

/* ---------- attributes helpers ---------- */

const attrMap = (line) => {
  const map = {};
  (line.attributes || []).forEach(({ key, value }) => {
    map[key] = value;
  });
  return map;
};

/* visible attributes (checkout par dikhte hain); khali values skip */
const visible = (pairs) =>
  pairs
    .filter(([, value]) => text(value) !== "")
    .map(([key, value]) => ({ key, value: text(value) }));

const prescriberText = (p = {}) =>
  [p.doctorName, p.clinicName, p.city, p.phone]
    .map(text)
    .filter(Boolean)
    .join(", ");

const newSetId = () =>
  `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const clampQty = (value) =>
  Math.min(99, Math.max(1, parseInt(value, 10) || 1));

/* =========================================================
   BROWSER ITEM  ->  Shopify cart lines
========================================================= */

function linesFor(item) {
  const name = item?.name || "This product";

  if (item?.selectedLens) {
    return {
      error: `${name}: lens options are not available at checkout yet. Please add the frame without a lens option.`,
    };
  }

  const variantId = text(item?.variantId);
  if (!variantId) {
    return {
      error: `${name} cannot be added right now (variant missing). Please refresh the page and try again.`,
    };
  }

  const set = newSetId();
  const type = text(item.productType) || "item";

  /* hidden data: cart page ko dobara banane ke kaam aata hai */
  const meta = JSON.stringify({
    id: item.id,
    link: item.link || "",
    brand: item.brand || "",
    manufacturer: item.manufacturer || "",
    type: item.type || "",
    pack: item.pack || "",
    lensKind: item.lensKind || "",
    category: item.category || "",
    color: item.selectedColor || "",
    size: item.selectedSize || "",
    mode: item.prescriptionMode || "",
    file: item.prescriptionFileName || "",
    prescriber: item.prescriber || null,
  });

  const hidden = [
    { key: "_set", value: set },
    { key: "_type", value: type },
    { key: "_meta", value: meta },
  ];

  /* contact lens: har aankh ki alag line */
  if (item.rightEye || item.leftEye) {
    const manual = item.prescriptionMode !== "upload";
    const prescriber = prescriberText(item.prescriber);
    const lines = [];

    [
      ["Right (OD)", item.rightEye],
      ["Left (OS)", item.leftEye],
    ].forEach(([label, eye]) => {
      if (!eye?.selected) return;

      lines.push({
        merchandiseId: variantId,
        quantity: clampQty(eye.quantity),
        attributes: [
          ...visible([
            ["Eye", label],
            ["Power", manual ? eye.power : ""],
            ["CYL", manual ? eye.cyl : ""],
            ["Axis", manual ? eye.axis : ""],
            ["Add", manual ? eye.addPower : ""],
            ["BC", manual ? eye.bc : ""],
            ["DIA", manual ? eye.dia : ""],
            ["Prescription", manual ? "" : "Will be verified by LensMartIndia"],
            ["Prescriber", prescriber],
          ]),
          ...hidden,
        ],
      });
    });

    if (!lines.length) return { error: "Please select at least one eye." };

    return { set, type, lines, replaceKey: { type, id: item.id } };
  }

  /* frames: ek line, colour / size ke saath */
  return {
    set,
    type,
    lines: [
      {
        merchandiseId: variantId,
        quantity: clampQty(item.quantity),
        attributes: [
          ...visible([
            ["Colour", item.selectedColor],
            ["Size", item.selectedSize],
          ]),
          ...hidden,
        ],
      },
    ],
  };
}

/* =========================================================
   SHOPIFY cart  ->  browser items (purane shape jaise)
========================================================= */

const numericId = (gid) => {
  const match = String(gid || "").match(/(\d+)$/);
  return match ? Number(match[1]) : gid;
};

const readMeta = (attrs) => {
  try {
    return JSON.parse(attrs._meta || "{}") || {};
  } catch {
    return {};
  }
};

function mapCart(cart) {
  if (!cart) return { items: [], checkoutUrl: "", totalQuantity: 0 };

  const groups = new Map();

  (cart.lines?.nodes || []).forEach((line) => {
    const attrs = attrMap(line);
    const key = attrs._set || line.id;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ line, attrs });
  });

  const items = [];

  groups.forEach((rows, key) => {
    const { line, attrs } = rows[0];
    const merch = line.merchandise || {};
    const product = merch.product || {};
    const meta = readMeta(attrs);

    const price = Number(line.cost?.amountPerQuantity?.amount || 0);
    const compare = Number(line.cost?.compareAtAmountPerQuantity?.amount || 0);

    const base = {
      key,
      id: meta.id ?? numericId(product.id),
      variantId: merch.id,
      productType: attrs._type || "item",
      name: product.title || "",
      brand: meta.brand || product.vendor || "",
      manufacturer: meta.manufacturer || "",
      category: meta.category || "",
      type: meta.type || "",
      pack: meta.pack || "",
      lensKind: meta.lensKind || "",
      image: merch.image?.url || product.featuredImage?.url || "",
      price,
      oldPrice: compare > price ? compare : null,
      link: meta.link || (product.handle ? `/${product.handle}` : ""),
      lineIds: rows.map((row) => row.line.id),
    };

    const isContact = rows.some(({ attrs: a }) => a.Eye);

    if (isContact) {
      const eyeOf = (prefix) => {
        const row = rows.find(({ attrs: a }) =>
          String(a.Eye || "").startsWith(prefix),
        );
        if (!row) {
          return {
            selected: false,
            quantity: 0,
            power: "",
            bc: "",
            dia: "",
            cyl: "",
            axis: "",
            addPower: "",
          };
        }

        const a = row.attrs;
        return {
          selected: true,
          quantity: row.line.quantity,
          power: a.Power || "",
          bc: a.BC || "",
          dia: a.DIA || "",
          cyl: a.CYL || "",
          axis: a.Axis || "",
          addPower: a.Add || "",
        };
      };

      const rightEye = eyeOf("Right");
      const leftEye = eyeOf("Left");

      items.push({
        ...base,
        rightEye,
        leftEye,
        prescriber: meta.prescriber || {},
        prescriptionMode: meta.mode || "manual",
        prescriptionFileName: meta.file || "",
        quantity:
          (rightEye.selected ? rightEye.quantity : 0) +
          (leftEye.selected ? leftEye.quantity : 0),
      });
      return;
    }

    items.push({
      ...base,
      selectedColor: meta.color || attrs.Colour || "",
      selectedSize: meta.size || attrs.Size || "",
      selectedLens: null,
      quantity: line.quantity,
    });
  });

  return {
    items,
    checkoutUrl: cart.checkoutUrl || "",
    totalQuantity: cart.totalQuantity || 0,
  };
}

/* =========================================================
   COOKIE
========================================================= */

async function readCartId() {
  const store = await cookies();
  return store.get(COOKIE)?.value || "";
}

async function saveCartId(id) {
  const store = await cookies();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function clearCartId() {
  const store = await cookies();
  store.delete(COOKIE);
}

/* cart load; expire/invalid ho to cookie saaf */
async function loadCart(id, clearOnMissing = true) {
  if (!id) return null;

  const data = await shopify(Q_CART, { id });
  if (!data?.cart) {
    if (clearOnMissing) await clearCartId();
    return null;
  }
  return data.cart;
}

/* =========================================================
   LOGIN SYNC — cart ID customer metafield (custom.cart_id) me
========================================================= */

async function markSynced(id) {
  const store = await cookies();
  store.set(SYNCED, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

const saveSavedCartId = (ownerId, id) =>
  writeCustomerMeta(ownerId, "cart_id", "single_line_text_field", id);

/* get par: login hai to saved cart + guest cart ko jodo */
async function reconcile(guestId) {
  const meta = await readCustomerMeta();

  /* customer API na chale to cart ko normal chalne do */
  if (meta.error) return loadCart(guestId);

  const savedId = meta.cartId;

  if (!guestId && !savedId) return null;

  if (savedId && savedId === guestId) {
    await markSynced(guestId);
    return loadCart(guestId);
  }

  /* sirf guest cart hai -> customer ke naam save */
  if (!savedId) {
    const cart = await loadCart(guestId);
    if (cart) {
      await saveSavedCartId(meta.id, cart.id);
      await markSynced(cart.id);
    }
    return cart;
  }

  const saved = await loadCart(savedId, false);

  /* purana saved cart expire ho gaya */
  if (!saved) {
    const guest = guestId ? await loadCart(guestId) : null;
    if (guest) {
      await saveSavedCartId(meta.id, guest.id);
      await markSynced(guest.id);
    }
    return guest;
  }

  /* dono hain -> guest ke products saved cart me daalo */
  let merged = null;

  if (guestId && guestId !== savedId) {
    const guest = await loadCart(guestId, false);

    const lines = (guest?.lines?.nodes || [])
      .map((line) => ({
        merchandiseId: line.merchandise?.id,
        quantity: line.quantity,
        attributes: (line.attributes || []).map(({ key, value }) => ({ key, value })),
      }))
      .filter((line) => line.merchandiseId);

    if (lines.length) {
      const data = await shopify(M_ADD, { cartId: saved.id, lines });
      merged = unwrap(data.cartLinesAdd);
    }
  }

  await saveCartId(saved.id);
  await markSynced(saved.id);

  return merged || saved;
}

/* mutation ke baad: naya cart ID customer ke naam save karo */
async function syncSavedCart(id) {
  const store = await cookies();
  if (!id || store.get(SYNCED)?.value === id) return;

  const meta = await readCustomerMeta();
  if (meta.error) return;

  if (meta.cartId !== id) await saveSavedCartId(meta.id, id);
  await markSynced(id);
}

const linesOfSet = (cart, key) =>
  (cart?.lines?.nodes || []).filter((line) => attrMap(line)._set === key);

/* =========================================================
   ACTIONS
========================================================= */

async function actionAdd(cartId, item) {
  const built = linesFor(item);
  if (built.error) {
    const error = new Error(built.error);
    error.user = true;
    throw error;
  }

  let cart = await loadCart(cartId);

  /* cart hai hi nahi -> naya banao */
  if (!cart) {
    const data = await shopify(M_CREATE, { input: { lines: built.lines } });
    cart = unwrap(data.cartCreate);
    if (cart?.id) await saveCartId(cart.id);
    return { cart, addedKey: built.set };
  }

  /* contact lens: wahi product dobara add ho to purani entry hata do */
  if (built.replaceKey) {
    const oldLineIds = cart.lines.nodes
      .filter((line) => {
        const attrs = attrMap(line);
        if (attrs._type !== built.replaceKey.type) return false;
        return String(readMeta(attrs).id) === String(built.replaceKey.id);
      })
      .map((line) => line.id);

    if (oldLineIds.length) {
      const data = await shopify(M_REMOVE, { cartId: cart.id, lineIds: oldLineIds });
      cart = unwrap(data.cartLinesRemove) || cart;
    }
  } else {
    /* frames: same variant pehle se cart me ho to quantity badhao */
    const same = cart.lines.nodes.find(
      (line) =>
        line.merchandise?.id === built.lines[0].merchandiseId &&
        attrMap(line)._type === built.type &&
        !attrMap(line).Eye,
    );

    if (same) {
      const data = await shopify(M_UPDATE, {
        cartId: cart.id,
        lines: [
          {
            id: same.id,
            quantity: Math.min(99, same.quantity + built.lines[0].quantity),
          },
        ],
      });

      return {
        cart: unwrap(data.cartLinesUpdate),
        addedKey: attrMap(same)._set || same.id,
      };
    }
  }

  const data = await shopify(M_ADD, { cartId: cart.id, lines: built.lines });
  return { cart: unwrap(data.cartLinesAdd), addedKey: built.set };
}

async function actionUpdate(cartId, { key, side, quantity }) {
  const cart = await loadCart(cartId);
  if (!cart) return { cart: null };

  const lines = linesOfSet(cart, key);
  let target = null;

  if (side === "right" || side === "left") {
    const prefix = side === "right" ? "Right" : "Left";
    target = lines.find((line) => String(attrMap(line).Eye || "").startsWith(prefix));
  } else {
    target = lines[0];
  }

  if (!target) return { cart };

  const qty = parseInt(quantity, 10) || 0;

  if (qty < 1) {
    const data = await shopify(M_REMOVE, { cartId: cart.id, lineIds: [target.id] });
    return { cart: unwrap(data.cartLinesRemove) };
  }

  const data = await shopify(M_UPDATE, {
    cartId: cart.id,
    lines: [{ id: target.id, quantity: clampQty(qty) }],
  });

  return { cart: unwrap(data.cartLinesUpdate) };
}

async function actionRemove(cartId, { key }) {
  const cart = await loadCart(cartId);
  if (!cart) return { cart: null };

  const lineIds = linesOfSet(cart, key).map((line) => line.id);
  if (!lineIds.length) return { cart };

  const data = await shopify(M_REMOVE, { cartId: cart.id, lineIds });
  return { cart: unwrap(data.cartLinesRemove) };
}

/* =========================================================
   HANDLER
========================================================= */

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const action = text(body?.action);

  try {
    const cartId = await readCartId();
    const loggedIn = Boolean(await getAccessToken());
    let result;

    if (action === "clear") {
      /* logout ke baad is browser se cart hatao (Shopify cart delete nahi hota) */
      const store = await cookies();
      store.delete(COOKIE);
      store.delete(SYNCED);
      result = { cart: null };
    } else if (action === "get") {
      let cart;
      try {
        cart = loggedIn ? await reconcile(cartId) : await loadCart(cartId);
      } catch (error) {
        if (loggedIn && !error.user) {
          console.error("Cart login sync error:", error);
          cart = await loadCart(cartId);
        } else {
          throw error;
        }
      }
      result = { cart };
    } else if (action === "add") {
      result = await actionAdd(cartId, body.item);
    } else if (action === "update") {
      result = await actionUpdate(cartId, body);
    } else if (action === "remove") {
      result = await actionRemove(cartId, body);
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    /* add/update/remove ke baad cart ID customer ke naam save */
    if (loggedIn && action !== "get" && action !== "clear" && result.cart?.id) {
      try {
        await syncSavedCart(result.cart.id);
      } catch (error) {
        console.error("Cart save-to-customer error:", error);
      }
    }

    return NextResponse.json({
      ...mapCart(result.cart),
      addedKey: result.addedKey || "",
      loggedIn,
    });
  } catch (error) {
    const friendly = error.user
      ? error.message
      : "Cart is not working right now. Please try again.";

    /* local testing me asli wajah dikhao */
    const message =
      process.env.NODE_ENV === "production" || error.user
        ? friendly
        : `${friendly} [${error.detail || String(error).slice(0, 300)}]`;

    return NextResponse.json({ error: message }, { status: error.user ? 400 : 502 });
  }
}