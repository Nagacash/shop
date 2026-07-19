"use client";

import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill in all required fields, then try again.");
      setLoading(false);
      if (!name) nameRef.current?.focus();
      else if (!email) emailRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    // Demo flow — no email backend wired yet
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
    setLoading(false);
    form.reset();
  };

  if (submitted) {
    return (
      <div className="naga-bezel-light text-center" role="status" aria-live="polite">
        <div className="naga-bezel-light-inner p-8">
          <h2 className="naga-display text-heading-3 text-dark-900">Message sent</h2>
          <p className="mt-2 text-body text-dark-700">
            Thanks for reaching out. Our team will get back to you within 1–2 business days.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 text-body-medium text-dark-900 underline decoration-[--color-naga-gold]/40 underline-offset-4 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:text-[--color-naga-gold]"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-caption uppercase tracking-[0.12em] text-dark-700">
          Name
        </label>
        <input
          ref={nameRef}
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name…"
          className="naga-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-caption uppercase tracking-[0.12em] text-dark-700">
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          spellCheck={false}
          inputMode="email"
          placeholder="you@example.com…"
          className="naga-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-caption uppercase tracking-[0.12em] text-dark-700">
          Subject
        </label>
        <select id="subject" name="subject" className="naga-input" defaultValue="general" autoComplete="off">
          <option value="general">General inquiry</option>
          <option value="order">Order &amp; shipping</option>
          <option value="returns">Returns &amp; refunds</option>
          <option value="product">Product question</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-caption uppercase tracking-[0.12em] text-dark-700">
          Message
        </label>
        <textarea
          ref={messageRef}
          id="message"
          name="message"
          required
          rows={5}
          autoComplete="off"
          placeholder="How can we help?…"
          className="naga-input resize-y"
        />
      </div>

      {error && (
        <p className="text-caption text-[--color-red]" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="naga-btn naga-btn-dark w-full focus-ring focus-visible:outline-none"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <Send className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
