"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Please fill in all required fields.");
      setLoading(false);
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
      <div className="rounded-xl border border-light-300 bg-light-100 p-8 text-center">
        <h2 className="text-heading-3 text-dark-900">Message sent</h2>
        <p className="mt-2 text-body text-dark-700">
          Thanks for reaching out. Our team will get back to you within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-body-medium text-dark-900 underline hover:text-dark-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-caption text-dark-900">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-caption text-dark-900">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className="text-caption text-dark-900">Subject</label>
        <select
          id="subject"
          name="subject"
          className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
          defaultValue="general"
        >
          <option value="general">General inquiry</option>
          <option value="order">Order &amp; shipping</option>
          <option value="returns">Returns &amp; refunds</option>
          <option value="product">Product question</option>
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-caption text-dark-900">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full resize-y rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/10"
        />
      </div>

      {error && <p className="text-caption text-[--color-red]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:bg-dark-700 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
