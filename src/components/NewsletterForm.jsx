"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "success" : "error");
    if (res.ok) setEmail("");
  };

  return (
    <form onSubmit={submit} className="newsletter-form">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="newsletter-input"
      />
      <button disabled={status === "loading"} className="newsletter-btn">
        {status === "loading" ? "Please wait..." : "Subscribe"}
      </button>
      {status === "success" && <p>Thanks for subscribing!</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
    </form>
  );
}