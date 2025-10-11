// app/about/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// --- Small helper for on-scroll reveal (no external deps) ---
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // delay per element for staggered looks
            const t = setTimeout(() => setShow(true), delay);
            return () => clearTimeout(t);
          }
        });
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

const BLUR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><filter id='b'><feGaussianBlur stdDeviation='1.2'/></filter><rect width='10' height='6' fill='#e5e7eb' filter='url(#b)'/></svg>`
  );

export default function AboutPage() {
  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[56vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg"
            alt="Travelers overlooking mountains at sunrise"
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="container mx-auto px-4 pb-10 sm:px-6 lg:px-8">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white ring-1 ring-white/30 backdrop-blur">
                  ✈️ Crafting journeys since 2015
                </span>
              </Reveal>
              <Reveal delay={120}>
                <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white drop-shadow-sm md:text-5xl">
                  We design trips you&apos;ll brag about forever.
                </h1>
              </Reveal>
              <Reveal delay={240}>
                <p className="mt-3 max-w-2xl text-white/90">
                  From first click to final postcard, our team blends human
                  expertise with local know-how to build travel that feels
                  effortless—and unforgettable.
                </p>
              </Reveal>
              <Reveal delay={360}>
                <Link
                  href="/tours"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-6 font-medium text-white shadow-[0_6px_20px_-8px_rgba(16,185,129,.6)] transition-colors hover:bg-emerald-700"
                >
                  Explore our tours
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto -mt-10 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: "95,000+", v: "Happy travelers" },
              { k: "65+", v: "Countries covered" },
              { k: "4.8★", v: "Average rating" },
              { k: "24/7", v: "Real human support" },
            ].map((s, i) => (
              <div
                key={s.k}
                className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="text-2xl font-bold text-emerald-600">{s.k}</div>
                <div className="text-sm text-neutral-600">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Our Story
              </h2>
              <p className="mt-3 text-neutral-700">
                We started as backpackers obsessed with finding the
                <em>good stuff</em>—the tiny bakeries, the sunrise lookouts, the
                local guides who tell the stories that stick. Today, our expert
                planners and on-the-ground partners craft seamless, small-group
                and private trips across the globe.
              </p>
              <p className="mt-3 text-neutral-700">
                You pick the vibe. We handle the rest: smart routes, trusted
                stays, skip-the-line access, and flexible help when plans
                change. All you do is show up.
              </p>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.pexels.com/photos/386007/pexels-photo-386007.jpeg"
                alt="Guided city walk with travelers"
                fill
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What We Value */}
      <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-neutral-900">
            What We Value
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Human-first planning",
              desc: "Real experts who listen. Custom touches without the stress.",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6a4 4 0 110 8 4 4 0 010-8zM6 20a6 6 0 1112 0H6z"
                  />
                </svg>
              ),
            },
            {
              title: "Local partnerships",
              desc: "Guides & hosts we know by name. Fair pay, authentic access.",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ),
            },
            {
              title: "Transparent pricing",
              desc: "No hidden fees. Clear inclusions. Flexible extras.",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-2.21 0-4 1.12-4 2.5S9.79 13 12 13s4 1.12 4 2.5S14.21 18 12 18m0-10V6m0 12v-2"
                  />
                </svg>
              ),
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">
                    {item.desc}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-neutral-900">
            How We Build Your Trip
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              step: "1",
              title: "Tell us the vibe",
              text: "Dates, interests, must-sees, budget. We listen.",
            },
            {
              step: "2",
              title: "Design & refine",
              text: "A tailored plan with lodging, experiences & logistics.",
            },
            {
              step: "3",
              title: "Book with clarity",
              text: "Transparent pricing, secured spots, flexible add-ons.",
            },
            {
              step: "4",
              title: "Go—with support",
              text: "Real humans 24/7. We adjust if life happens.",
            },
          ].map((t, i) => (
            <Reveal key={t.step} delay={i * 120}>
              <div className="relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="absolute -top-3 left-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white shadow ring-1 ring-white/30">
                  Step {t.step}
                </div>
                <div className="mt-1 font-semibold text-neutral-900">
                  {t.title}
                </div>
                <div className="mt-1 text-sm text-neutral-600">{t.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team preview */}
      <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-neutral-900">
            Meet a Few of Us
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Aisha Pramesti",
              role: "Lead Trip Designer • Asia",
              img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
            },
            {
              name: "Mateo Rossi",
              role: "On-ground Ops • Europe",
              img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
            },
            {
              name: "Tara Johnson",
              role: "Guest Experience • Americas",
              img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            },
          ].map((m, i) => (
            <Reveal key={m.name} delay={i * 120}>
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR}
                    className="object-cover"
                    sizes="(min-width:1024px) 33vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <div className="font-semibold text-neutral-900">{m.name}</div>
                  <div className="text-sm text-neutral-600">{m.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-neutral-900">
              Ready to plan something unforgettable?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-neutral-700">
              Tell us your dates & interests. We’ll design a tailored itinerary
              with transparent pricing—no pressure, just ideas.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                href="/tours"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-6 font-medium text-white hover:bg-emerald-700"
              >
                Browse Tours
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-600 px-6 font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Talk to an expert
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
