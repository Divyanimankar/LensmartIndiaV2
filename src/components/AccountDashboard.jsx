"use client";

import { useEffect, useState, useCallback } from "react";
import "../styles/accountdashboard.css";

const SECTIONS = [
  { id: "orders", label: "My Orders" },
  { id: "prescription", label: "My Prescription" },
  { id: "account", label: "Account Information" },
  { id: "address", label: "Address Book" },
];

const STATES = [
  ["AN", "Andaman & Nicobar"], ["AP", "Andhra Pradesh"], ["AR", "Arunachal Pradesh"],
  ["AS", "Assam"], ["BR", "Bihar"], ["CH", "Chandigarh"], ["CG", "Chhattisgarh"],
  ["DN", "Dadra & Nagar Haveli and Daman & Diu"], ["DL", "Delhi"], ["GA", "Goa"],
  ["GJ", "Gujarat"], ["HR", "Haryana"], ["HP", "Himachal Pradesh"],
  ["JK", "Jammu & Kashmir"], ["JH", "Jharkhand"], ["KA", "Karnataka"],
  ["KL", "Kerala"], ["LA", "Ladakh"], ["LD", "Lakshadweep"], ["MP", "Madhya Pradesh"],
  ["MH", "Maharashtra"], ["MN", "Manipur"], ["ML", "Meghalaya"], ["MZ", "Mizoram"],
  ["NL", "Nagaland"], ["OR", "Odisha"], ["PY", "Puducherry"], ["PB", "Punjab"],
  ["RJ", "Rajasthan"], ["SK", "Sikkim"], ["TN", "Tamil Nadu"], ["TS", "Telangana"],
  ["TR", "Tripura"], ["UP", "Uttar Pradesh"], ["UT", "Uttarakhand"], ["WB", "West Bengal"],
];

const Chevron = () => (
  <svg viewBox="0 0 24 24" className="ad-chevron" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const fmtMoney = (m) =>
  m ? new Intl.NumberFormat("en-IN", { style: "currency", currency: m.currencyCode || "INR" }).format(m.amount) : "";

const pretty = (s) => (s || "").toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/* ============================== ORDERS ============================== */
function Orders({ orders }) {
  if (!orders.length) {
    return <p className="ad-empty">You haven&apos;t placed any orders yet.</p>;
  }
  return (
    <div className="ad-list">
      {orders.map((o) => (
        <article key={o.id} className="ad-card">
          <header className="ad-card-head">
            <div>
              <h3>Order {o.name}</h3>
              <p>{fmtDate(o.date)}</p>
            </div>
            <strong>{fmtMoney(o.total)}</strong>
          </header>
          <div className="ad-badges">
            <span className="ad-badge">{pretty(o.fulfillment)}</span>
            <span className="ad-badge ad-badge-soft">Payment: {pretty(o.payment)}</span>
          </div>
          <ul className="ad-items">
            {o.items.map((it, i) => (
              <li key={i}>
                {it.image?.url && <img src={it.image.url} alt="" />}
                <span>{it.title}</span>
                <em>× {it.quantity}</em>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

/* ============================ PRESCRIPTION ========================== */
const EMPTY_RX = {
  name: "", rSph: "", rCyl: "", rAxis: "", lSph: "", lCyl: "", lAxis: "", add: "", pd: "",
};

function validateRx(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Enter a name for this prescription";
  const num = (v) => v !== "" && !isNaN(Number(v));
  const range = (k, min, max, label, req) => {
    if (f[k] === "") { if (req) e[k] = `${label} required`; return; }
    if (!num(f[k]) || Number(f[k]) < min || Number(f[k]) > max) e[k] = `${min} to ${max}`;
  };
  range("rSph", -20, 20, "SPH", true);
  range("lSph", -20, 20, "SPH", true);
  range("rCyl", -8, 8);
  range("lCyl", -8, 8);
  range("add", 0, 4);
  range("pd", 50, 80);
  ["rAxis", "lAxis"].forEach((k) => {
    const cyl = k === "rAxis" ? f.rCyl : f.lCyl;
    if (cyl !== "" && Number(cyl) !== 0 && f[k] === "") e[k] = "Axis required with CYL";
    else if (f[k] !== "" && (!/^\d+$/.test(f[k]) || Number(f[k]) > 180)) e[k] = "0 to 180";
  });
  return e;
}

function Prescription({ email }) {
  const key = `lm_rx_${email}`;
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try { setList(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setList([]); }
  }, [key]);

  const persist = (next) => {
    setList(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    const errs = validateRx(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const entry = { ...form, id: form.id || String(Date.now()), date: form.date || new Date().toISOString() };
    persist(form.id ? list.map((x) => (x.id === form.id ? entry : x)) : [entry, ...list]);
    setForm(null);
  };

  const remove = (id) => {
    if (confirm("Delete this prescription?")) persist(list.filter((x) => x.id !== id));
  };

  const field = (k, label, ph) => (
    <label className={`ad-field ${errors[k] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input inputMode="decimal" placeholder={ph} value={form[k]} onChange={set(k)} />
      {errors[k] && <small>{errors[k]}</small>}
    </label>
  );

  if (form) {
    return (
      <form className="ad-form" onSubmit={save} noValidate>
        <label className={`ad-field ${errors.name ? "has-error" : ""}`}>
          <span>Prescription name</span>
          <input placeholder="e.g. My daily glasses" value={form.name} onChange={set("name")} maxLength={40} />
          {errors.name && <small>{errors.name}</small>}
        </label>

        <h4>Right Eye (OD)</h4>
        <div className="ad-grid-3">
          {field("rSph", "SPH", "-2.00")}
          {field("rCyl", "CYL", "-0.50")}
          {field("rAxis", "AXIS", "90")}
        </div>

        <h4>Left Eye (OS)</h4>
        <div className="ad-grid-3">
          {field("lSph", "SPH", "-2.00")}
          {field("lCyl", "CYL", "-0.50")}
          {field("lAxis", "AXIS", "90")}
        </div>

        <div className="ad-grid-2">
          {field("add", "ADD (optional)", "1.50")}
          {field("pd", "PD mm (optional)", "63")}
        </div>

        <div className="ad-actions">
          <button type="submit" className="ad-btn">Save prescription</button>
          <button type="button" className="ad-btn ad-btn-ghost" onClick={() => { setForm(null); setErrors({}); }}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="ad-toolbar">
        <button className="ad-btn" onClick={() => { setErrors({}); setForm({ ...EMPTY_RX }); }}>
          + Add prescription
        </button>
      </div>
      {!list.length ? (
        <p className="ad-empty">No prescriptions saved yet.</p>
      ) : (
        <div className="ad-list">
          {list.map((p) => (
            <article key={p.id} className="ad-card">
              <header className="ad-card-head">
                <div>
                  <h3>{p.name}</h3>
                  <p>Saved {fmtDate(p.date)}</p>
                </div>
              </header>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th></th><th>SPH</th><th>CYL</th><th>AXIS</th></tr>
                  </thead>
                  <tbody>
                    <tr><th>Right (OD)</th><td>{p.rSph}</td><td>{p.rCyl || "-"}</td><td>{p.rAxis || "-"}</td></tr>
                    <tr><th>Left (OS)</th><td>{p.lSph}</td><td>{p.lCyl || "-"}</td><td>{p.lAxis || "-"}</td></tr>
                  </tbody>
                </table>
              </div>
              {(p.add || p.pd) && (
                <p className="ad-meta">
                  {p.add && <>ADD: {p.add} </>}
                  {p.pd && <>· PD: {p.pd} mm</>}
                </p>
              )}
              <div className="ad-actions">
                <button className="ad-link" onClick={() => { setErrors({}); setForm({ ...p }); }}>Edit</button>
                <button className="ad-link ad-danger" onClick={() => remove(p.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* ============================ ACCOUNT INFO ========================== */
function AccountInfo({ data, call, onSaved }) {
  const [first, setFirst] = useState(data.firstName);
  const [last, setLast] = useState(data.lastName);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!/^[A-Za-z .'-]{2,}$/.test(first.trim())) er.first = "Enter a valid first name";
    if (last.trim() && !/^[A-Za-z .'-]+$/.test(last.trim())) er.last = "Enter a valid last name";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const ok = await call({ action: "updateProfile", firstName: first, lastName: last });
    setBusy(false);
    if (ok) onSaved();
  };

  return (
    <form className="ad-form" onSubmit={submit} noValidate>
      <label className="ad-field">
        <span>Email</span>
        {/* Logged-in email, filled by default and not editable */}
        <input type="email" value={data.email} readOnly className="ad-readonly" />
        <small className="ad-hint">Your login email cannot be changed here.</small>
      </label>
      <div className="ad-grid-2">
        <label className={`ad-field ${errors.first ? "has-error" : ""}`}>
          <span>First name</span>
          <input value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" />
          {errors.first && <small>{errors.first}</small>}
        </label>
        <label className={`ad-field ${errors.last ? "has-error" : ""}`}>
          <span>Last name</span>
          <input value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" />
          {errors.last && <small>{errors.last}</small>}
        </label>
      </div>
      {data.phone && (
        <label className="ad-field">
          <span>Phone</span>
          <input value={data.phone} readOnly className="ad-readonly" />
        </label>
      )}
      <div className="ad-actions">
        <button className="ad-btn" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
      </div>
    </form>
  );
}

/* ============================ ADDRESS BOOK ========================== */
const EMPTY_ADDR = { firstName: "", lastName: "", phoneNumber: "", address1: "", address2: "", city: "", zoneCode: "", zip: "" };

function Addresses({ data, call, onSaved }) {
  const [form, setForm] = useState(null);
  const [makeDefault, setMakeDefault] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const open = (a) => {
    setErrors({});
    if (a) {
      setForm({ ...a, phoneNumber: (a.phoneNumber || "").replace(/^\+91/, "") });
      setMakeDefault(a.id === data.defaultAddressId);
    } else {
      setForm({ ...EMPTY_ADDR, firstName: data.firstName, lastName: data.lastName });
      setMakeDefault(!data.addresses.length);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!/^[A-Za-z .'-]{2,}$/.test(form.firstName.trim())) er.firstName = "Enter a valid first name";
    if (!/^[6-9]\d{9}$/.test(form.phoneNumber.trim())) er.phoneNumber = "Enter a valid 10-digit mobile number";
    if (form.address1.trim().length < 5) er.address1 = "Enter your full address";
    if (form.city.trim().length < 2) er.city = "Enter a city";
    if (!form.zoneCode) er.zoneCode = "Select a state";
    if (!/^\d{6}$/.test(form.zip.trim())) er.zip = "Enter a valid 6-digit PIN code";
    setErrors(er);
    if (Object.keys(er).length) return;

    setBusy(true);
    const ok = await call({
      action: form.id ? "updateAddress" : "addAddress",
      addressId: form.id,
      address: form,
      makeDefault,
    });
    setBusy(false);
    if (ok) { setForm(null); onSaved(); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this address?")) return;
    if (await call({ action: "deleteAddress", addressId: id })) onSaved();
  };

  const input = (k, label, extra = {}) => (
    <label className={`ad-field ${errors[k] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input value={form[k] || ""} onChange={set(k)} {...extra} />
      {errors[k] && <small>{errors[k]}</small>}
    </label>
  );

  if (form) {
    return (
      <form className="ad-form" onSubmit={submit} noValidate>
        <div className="ad-grid-2">
          {input("firstName", "First name")}
          {input("lastName", "Last name")}
        </div>
        {input("phoneNumber", "Mobile number", { inputMode: "numeric", maxLength: 10, placeholder: "10-digit number" })}
        {input("address1", "Address line 1")}
        {input("address2", "Address line 2 (optional)")}
        <div className="ad-grid-2">
          {input("city", "City")}
          {input("zip", "PIN code", { inputMode: "numeric", maxLength: 6 })}
        </div>
        <label className={`ad-field ${errors.zoneCode ? "has-error" : ""}`}>
          <span>State</span>
          <select value={form.zoneCode || ""} onChange={set("zoneCode")}>
            <option value="">Select state</option>
            {STATES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
          {errors.zoneCode && <small>{errors.zoneCode}</small>}
        </label>
        <label className="ad-check">
          <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />
          Set as default address
        </label>
        <div className="ad-actions">
          <button className="ad-btn" disabled={busy}>{busy ? "Saving..." : "Save address"}</button>
          <button type="button" className="ad-btn ad-btn-ghost" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="ad-toolbar">
        <button className="ad-btn" onClick={() => open(null)}>+ Add new address</button>
      </div>
      {!data.addresses.length ? (
        <p className="ad-empty">No saved addresses yet.</p>
      ) : (
        <div className="ad-list">
          {data.addresses.map((a) => (
            <article key={a.id} className="ad-card">
              {a.id === data.defaultAddressId && <span className="ad-badge">Default</span>}
              <h3>{a.firstName} {a.lastName}</h3>
              <p className="ad-addr">
                {a.address1}{a.address2 ? `, ${a.address2}` : ""}<br />
                {a.city}, {STATES.find(([c]) => c === a.zoneCode)?.[1] || a.zoneCode} - {a.zip}<br />
                {a.phoneNumber}
              </p>
              <div className="ad-actions">
                <button className="ad-link" onClick={() => open(a)}>Edit</button>
                <button className="ad-link ad-danger" onClick={() => remove(a.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* ============================== MAIN ================================ */
export default function AccountDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [section, setSection] = useState("orders");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/account", { cache: "no-store" });
      if (r.status === 401) { window.location.href = "/account/login"; return; }
      if (!r.ok) throw new Error();
      setData(await r.json());
    } catch {
      setError("Could not load your account. Please refresh the page.");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Shared POST helper used by profile and address forms
  const call = async (payload) => {
    try {
      const r = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.status === 401) { window.location.href = "/account/login"; return false; }
      const j = await r.json();
      if (!r.ok) { setToast({ type: "error", text: j.error || "Something went wrong" }); return false; }
      setToast({ type: "ok", text: "Saved successfully" });
      return true;
    } catch {
      setToast({ type: "error", text: "Network error. Try again." });
      return false;
    }
  };

  if (error) return <p className="ad-empty">{error}</p>;
  if (!data) return <p className="ad-empty">Loading your account...</p>;

  const current = SECTIONS.find((s) => s.id === section);
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ");

  return (
    <div className="ad-wrap">
      <aside className={`ad-menu ${mobileOpen ? "ad-hide-mobile" : ""}`}>
        <div className="ad-user">
          <h2>{name ? `Hello, ${data.firstName}` : "My Account"}</h2>
          <p>{data.email}</p>
        </div>
        <nav>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`ad-menu-item ${section === s.id ? "active" : ""}`}
              onClick={() => { setSection(s.id); setMobileOpen(true); window.scrollTo({ top: 0 }); }}
            >
              {s.label}
              <Chevron />
            </button>
          ))}
        </nav>
        <a href="/account/logout" className="ad-logout">Logout</a>
      </aside>

      <section className={`ad-panel ${mobileOpen ? "" : "ad-hide-mobile"}`}>
        <button className="ad-back" onClick={() => setMobileOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          Back
        </button>
        <h2 className="ad-title">{current.label}</h2>

        {section === "orders" && <Orders orders={data.orders} />}
        {section === "prescription" && <Prescription email={data.email} />}
        {section === "account" && <AccountInfo key={data.email + data.firstName} data={data} call={call} onSaved={load} />}
        {section === "address" && <Addresses data={data} call={call} onSaved={load} />}
      </section>

      {toast && <div className={`ad-toast ${toast.type}`}>{toast.text}</div>}
    </div>
  );
}