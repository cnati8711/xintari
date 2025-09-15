"use client";

import { useState, useEffect } from "react";
import { initPostHog, posthogCapture } from "../lib/posthog.client";

export default function HomePage() {
  const [problem, setProblem] = useState("");
  const [reply, setReply] = useState("");
  const [email, setEmail] = useState("");
  const [book, setBook] = useState(false);

  useEffect(() => { initPostHog(); }, []);

  async function askConcierge(e: React.FormEvent) {
    e.preventDefault();
    if (!problem.trim()) return;
    posthogCapture("ask_concierge", { problem });
    setReply("Thinking…");
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, url: window.location.href })
      });
      const data = await res.json();
      setReply(data.message || "<div>Sorry—something went wrong.</div>");
    } catch {
      setReply("<div>Sorry—something went wrong.</div>");
    }
  }

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { alert("Please enter a valid email."); return; }
    posthogCapture("lead_submitted", { email_present: !!email });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, problem, source_url: window.location.href })
      });
      if (res.ok) setBook(true);
    } catch {}
  }

  return (
    <section style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#0b0b0b"
    }}>
      <div style={{ maxWidth: 760, width: "100%" }}>
        <h1 style={{ color: "#e5ffe9", textAlign: "center", marginBottom: 12, fontSize: 36, lineHeight: 1.2 }}>
          What do you want your AI agent to solve?
        </h1>

        <form onSubmit={askConcierge} style={{ display: "flex", gap: 8 }}>
          <input
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe your task or workflow…"
            style={{ flex: 1, padding: "14px 16px", borderRadius: 10, border: "1px solid #1f2937", background: "#0f172a", color: "#e5e7eb" }}
            required
          />
          <button type="submit" style={{ padding: "14px 18px", borderRadius: 10, border: 0, background: "#00ff6a", color: "#0b0b0b", fontWeight: 700, cursor: "pointer" }}>
            Get Solution
          </button>
        </form>

        <div style={{ marginTop: 16, color: "#e5e7eb", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: reply }} />

        {reply && (
          <form onSubmit={saveLead} style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email to get a free scoping call…"
              style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid #1f2937", background: "#0f172a", color: "#e5e7eb" }}
              required
            />
            <button type="submit" style={{ padding: "12px 14px", borderRadius: 10, border: 0, background: "#61dafb", color: "#0b0b0b", fontWeight: 700, cursor: "pointer" }}>
              Notify & Book
            </button>
          </form>
        )}

        {book && (
          <div style={{ marginTop: 24, height: 700 }}>
            <iframe
              title="Book with Xintari"
              src={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com"}
              style={{ width: "100%", height: "100%", border: 0, borderRadius: 12, overflow: "hidden", background: "#0b0b0b" }}
            />
          </div>
        )}

        <p style={{ marginTop: 12, color: "#94a3b8", fontSize: 12, textAlign: "center" }}>
          We use your message to propose a solution and your email to follow up. No spam.
        </p>
      </div>
    </section>
  );
}
