// app/contact/page.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import {
  Mail,
  User2,
  MessageSquareText,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
  website: string; // honeypot
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    topic: "General",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange =
    (key: keyof FormState) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      setErrors((s) => ({ ...s, [key]: undefined }));
    };

  function validate(v: FormState) {
    const err: Partial<FormState> = {};
    if (!v.name.trim()) err.name = "Please enter your name.";
    if (!v.email.trim()) err.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
      err.email = "Invalid email address.";
    if (!v.message.trim() || v.message.trim().length < 10)
      err.message = "Tell us a bit more (min 10 characters).";
    if (v.website) err.website = "Spam detected.";
    return err;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(form);
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 900)); // demo only
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  // util class
  const baseField =
    "w-full h-12 rounded-xl border bg-white/70 backdrop-blur px-11 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none ring-0 transition shadow-[0_1px_0_0_rgba(0,0,0,0.04)] focus:border-emerald-500";
  const baseArea =
    "w-full rounded-xl border bg-white/70 backdrop-blur px-11 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none ring-0 transition shadow-[0_1px_0_0_rgba(0,0,0,0.04)] focus:border-emerald-500";
  const labelCls =
    "pointer-events-none absolute left-11 top-1.5 text-[11px] font-medium tracking-wide text-neutral-500";

  return (
    <div className="relative">
      {/* decorative bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2280%22 height=%2280%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')",
          }}
        />
      </div>

      {/* mini hero */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700/90 bg-emerald-50 px-3 py-1 rounded-full ring-1 ring-emerald-600/10">
            ✦ Get in touch
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Let’s plan your next trip
          </h1>
          <p className="mt-3 text-lg text-neutral-600">
            Ping us for custom itineraries, booking support, or partnerships.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-8">
          {/* FORM CARD */}
          <div className="relative rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
            <div className="absolute inset-px rounded-[15px] bg-gradient-to-b from-white/60 to-white/30 pointer-events-none" />
            {sent ? (
              <div className="relative">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                  <div className="text-emerald-800 font-semibold">
                    Thanks! Your message has been sent.
                  </div>
                  <p className="text-sm text-emerald-900/80 mt-1">
                    We’ll reply to your email shortly. For urgent matters, call
                    or WhatsApp us.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="relative space-y-5"
                onSubmit={onSubmit}
                noValidate
              >
                {/* honeypot */}
                <div className="hidden">
                  <label htmlFor="website">Leave this empty</label>
                  <input
                    id="website"
                    type="text"
                    value={form.website}
                    onChange={onChange("website")}
                  />
                </div>

                {/* Name */}
                <div className="relative">
                  <span className={labelCls}>Name</span>
                  <User2 className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                  <input
                    className={`${baseField} ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-200"
                    }`}
                    placeholder="Your name"
                    value={form.name}
                    onChange={onChange("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <span className={labelCls}>Email</span>
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                  <input
                    className={`${baseField} ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-200"
                    }`}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={onChange("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Topic */}
                <div className="relative">
                  <span className={labelCls}>Topic</span>
                  <MessageSquareText className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                  <select
                    className={`${baseField} border-neutral-200 pr-8`}
                    value={form.topic}
                    onChange={onChange("topic")}
                  >
                    <option>General</option>
                    <option>Custom Tour Request</option>
                    <option>Booking Support</option>
                    <option>Partnership</option>
                  </select>
                </div>

                {/* Message */}
                <div className="relative">
                  <span className={labelCls}>Message</span>
                  <MessageSquareText className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                  <textarea
                    rows={6}
                    className={`${baseArea} ${
                      errors.message
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-200"
                    }`}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={onChange("message")}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700 shadow-[0_12px_30px_-12px_rgba(16,185,129,0.6)]"
                  disabled={submitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Sending…" : "Send Message"}
                </Button>
                <p className="text-xs text-neutral-500 text-center">
                  By sending this form, you agree to our Terms & Privacy Policy.
                </p>
              </form>
            )}
          </div>

          {/* INFO CARD */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur p-6 md:p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900">
                Contact Info
              </h3>
              <ul className="mt-4 space-y-3 text-neutral-700">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  +1 234 567 890
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  info@travelagency.com
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <span>
                    123 Travel Street
                    <br />
                    City, Country 12345
                  </span>
                </li>
              </ul>

              <a
                href="https://wa.me/1234567890"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-emerald-600 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
              >
                Chat via WhatsApp
              </a>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900">
                Office Hours
              </h3>
              <p className="mt-2 text-neutral-700 text-sm">
                Mon–Fri: 09:00–18:00
                <br />
                Sat: 10:00–16:00 (GMT+7)
              </p>
              <p className="mt-4 text-neutral-600 text-sm">
                We usually respond within a few hours. For urgent changes near
                your departure date, call us directly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
