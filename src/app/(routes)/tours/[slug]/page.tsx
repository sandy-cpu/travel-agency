// app/tours/[slug]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import tours from "@/lib/tours";

// ===== Types =====
type ItineraryDay = {
  day: number;
  title: string;
  subtitle?: string;
  details: string[];
};

type Tour = {
  id: string | number;
  slug: string;
  title: string;
  country: string;
  image: string;
  durationDays: number;
  priceFrom: number;
  rating: number;
  reviewsCount: number;
  summary: string;
  tags: string[];
  itinerary?: ItineraryDay[];
  included?: string[];
  excluded?: string[];
  gallery?: string[];
};

// ===== Utils =====
const USD_TO_IDR = 16000;
const formatIDRkFromUSD = (usd: number) => {
  const idr = Math.round(usd * USD_TO_IDR);
  const k = Math.round(idr / 1000);
  const s = k.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${s}K`;
};

// SVG placeholder
const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 90'>
      <rect width='120' height='90' fill='#f3f4f6'/>
      <g fill='none' stroke='#cbd5e1' stroke-width='3'>
        <rect x='10' y='10' width='100' height='70' rx='6'/>
        <circle cx='46' cy='44' r='10' fill='#e5e7eb'/>
        <path d='M22 76l26-28 14 14 16-18 20 32z' fill='#e5e7eb'/>
      </g>
    </svg>`
  );

type NextImageProps = ComponentProps<typeof Image>;
type SafeImageProps = Omit<NextImageProps, "src"> & {
  src?: NextImageProps["src"]; // string | StaticImport | undefined
};

function SafeImage({ src, alt, ...rest }: SafeImageProps) {
  const [err, setErr] = useState(false);
  const finalSrc = !src || err ? PLACEHOLDER : src;

  return (
    <Image
      {...rest}
      src={finalSrc}
      alt={alt}
      onError={() => setErr(true)}
      placeholder="empty"
    />
  );
}

// ===== JSON-LD =====
function JsonLD({ tour }: { tour: Tour }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.title,
    description: tour.summary,
    image: [tour.image || PLACEHOLDER],
    brand: { "@type": "Brand", name: "Your Travel Brand" },
    offers: {
      "@type": "Offer",
      url: `https://yourdomain.com/tours/${tour.slug}`,
      priceCurrency: "IDR",
      price: Math.round(tour.priceFrom * USD_TO_IDR),
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewsCount,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function TourDetailPage() {
  // ===== Hooks SELALU duluan =====
  const params = useParams<{ slug: string }>();
  const [activeDay, setActiveDay] = useState(1);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ===== Data lookup (bukan hook) =====
  const data = tours as Tour[];
  const tour = data.find((t) => String(t.slug) === String(params.slug));

  // Buat gallery & turunan2-nya TERLEBIH DULU (supaya handler/hook di bawah bisa pakai meski tour null)
  const gallery: string[] = (() => {
    if (!tour) return [PLACEHOLDER];
    const g = tour.gallery?.length
      ? tour.gallery
      : [tour.image].filter(Boolean);
    return g.length ? g.map((x) => x || PLACEHOLDER) : [PLACEHOLDER];
  })();

  // Lightbox handlers (hook di atas early return)
  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevImg = useCallback(
    () => setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length),
    [gallery.length]
  );
  const nextImg = useCallback(
    () => setLightboxIndex((i) => (i + 1) % gallery.length),
    [gallery.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen, closeLightbox, prevImg, nextImg]);

  // Baru boleh early return SETELAH semua hook di atas
  if (!tour) {
    notFound();
    return null;
  }

  // Itinerary (default jika kosong)
  const itinerary: ItineraryDay[] = tour.itinerary?.length
    ? tour.itinerary
    : Array.from({ length: Math.max(1, tour.durationDays) }).map((_, i) => ({
        day: i + 1,
        title:
          i === 0
            ? "Arrival & City Orientation"
            : i === tour.durationDays - 1
            ? "Free Time & Departure"
            : `Day ${i + 1} Highlights`,
        details:
          i === 0
            ? [
                "Airport pickup & hotel check-in.",
                "Short orientation walk nearby.",
                "Evening at leisure / welcome dinner suggestions.",
              ]
            : i === tour.durationDays - 1
            ? ["Free time", "Hotel check-out", "Airport drop-off"]
            : ["Guided activity", "Local food stop", "Scenic photo spots"],
      }));

  const includes = tour.included?.length
    ? tour.included
    : [
        "Accommodation (3★ or similar)",
        "Daily breakfast",
        "Selected guided tours & entrance fees",
        "Airport transfers (arrival & departure)",
        "Local support 24/7",
      ];

  const excludes = tour.excluded?.length
    ? tour.excluded
    : [
        "International flights",
        "Travel insurance",
        "Lunch & dinner unless stated",
        "Personal expenses & tips",
      ];

  const related = (() => {
    const sameCountry = data.filter(
      (t) => t.country === tour.country && t.id !== tour.id
    );
    const byTag =
      sameCountry.length >= 3
        ? sameCountry
        : data.filter(
            (t) =>
              t.id !== tour.id && t.tags.some((tg) => tour.tags.includes(tg))
          );
    return byTag.slice(0, 3);
  })();

  return (
    <div className="min-h-screen bg-neutral-50">
      <JsonLD tour={tour} />

      {/* HERO (klik buka gallery) */}
      <section className="relative">
        <div className="relative h-[44vh] min-h-[360px] w-full">
          <button
            className="absolute inset-0"
            aria-label="Open gallery"
            onClick={() => openLightbox(0)}
          />
          <SafeImage
            src={gallery[0]}
            alt={tour.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs text-white ring-1 ring-white/30 backdrop-blur">
                  {tour.country} • {tour.durationDays}D
                </span>
                <h1 className="mt-3 text-3xl md:text-4xl font-bold text-white drop-shadow-sm">
                  {tour.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-white/90">
                  <div className="inline-flex items-center gap-1 text-sm">
                    <span aria-hidden>★</span>
                    <span className="font-semibold">
                      {tour.rating.toFixed(1)}
                    </span>
                    <span className="text-white/80">({tour.reviewsCount})</span>
                  </div>
                  <div className="h-3 w-px bg-white/40" />
                  <div className="text-sm">
                    {tour.tags.slice(0, 3).join(" • ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* thumbs di hero */}
          <div className="absolute right-4 bottom-4 hidden gap-2 md:flex">
            {gallery.slice(0, 4).map((g, i) => (
              <button
                key={g + i}
                onClick={() => openLightbox(i)}
                className="relative h-16 w-24 overflow-hidden rounded-md ring-1 ring-white/30"
              >
                <SafeImage
                  src={g}
                  alt={`${tour.title} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        {/* Aside — Booking */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
          <div
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            id="book"
          >
            <div className="text-neutral-500 text-sm">From</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-3xl font-bold text-emerald-600">
                {formatIDRkFromUSD(tour.priceFrom)}
              </div>
              <div className="text-neutral-500 text-sm mb-1">/ pax</div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-sm text-neutral-700">
                  Guests
                </label>
                <select className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} pax
                    </option>
                  ))}
                </select>
              </div>
              <button className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-md bg-emerald-600 px-4 font-medium text-white transition-colors hover:bg-emerald-700">
                Book Now
              </button>
              <p className="text-xs text-neutral-500">
                No hidden fees • Free reschedule • 24/7 support
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
            <div className="font-medium text-neutral-900">Need help?</div>
            Our experts can tailor this trip to your preferences.
            <Link
              href="/contact"
              className="mt-2 inline-block text-emerald-700 hover:underline"
            >
              Talk to an expert →
            </Link>
          </div>
        </aside>

        {/* Content */}
        <section className="order-2 space-y-8 lg:order-1">
          {/* Overview */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-900">Overview</h2>
            <p className="mt-2 text-neutral-700">{tour.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tour.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-800"
                >
                  <svg
                    aria-hidden
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h10M7 12h8M7 17h6"
                    />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Itinerary (seperti referensi) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Itinerary
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
              {/* day tabs */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="flex max-w-full gap-2 overflow-x-auto md:flex-col md:overflow-visible">
                  {itinerary.map((d) => {
                    const active = activeDay === d.day;
                    return (
                      <button
                        key={d.day}
                        onClick={() => setActiveDay(d.day)}
                        className={`shrink-0 rounded-md border px-3 py-2 text-left text-sm transition
                ${
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                }`}
                      >
                        Day {d.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* content */}
              <div className="md:col-span-3 lg:col-span-4">
                {itinerary.map((d) =>
                  d.day === activeDay ? (
                    <div key={d.day}>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {d.title}
                      </h3>
                      {d.subtitle && (
                        <div className="mt-1 text-sm text-neutral-600">
                          {d.subtitle}
                        </div>
                      )}
                      <ul className="mt-3 list-disc pl-5 text-neutral-700 text-base leading-7">
                        {d.details.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>

          {/* Includes / Excludes */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                What’s Included
              </h2>
              <ul className="mt-3 space-y-2 text-neutral-700">
                {includes.map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                What’s Not Included
              </h2>
              <ul className="mt-3 space-y-2 text-neutral-700">
                {excludes.map((x) => (
                  <li key={x}>✗ {x}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                You might also like
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <div
                    key={r.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3]">
                      <SafeImage
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs text-white shadow-lg ring-1 ring-white/30">
                        ⏱ {r.durationDays}D
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="text-sm text-neutral-500">
                        {r.country}
                      </div>
                      <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-neutral-900">
                        {r.title}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-emerald-600 font-semibold">
                          {formatIDRkFromUSD(r.priceFrom)}
                        </span>
                        <div className="text-sm text-neutral-700">
                          ★ {r.rating.toFixed(1)}{" "}
                          <span className="text-neutral-500">
                            ({r.reviewsCount})
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/tours/${r.slug}`}
                        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-white hover:bg-emerald-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Mobile sticky price bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.12)] md:hidden">
        <div className="mx-auto flex max-w-screen-sm items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500">From</div>
            <div className="text-lg font-semibold text-emerald-600">
              {formatIDRkFromUSD(tour.priceFrom)}{" "}
              <span className="text-xs text-neutral-500">/ pax</span>
            </div>
          </div>
          <a
            href="#book"
            className="h-11 rounded-md bg-emerald-600 px-5 leading-[44px] text-white"
          >
            Book Now
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            ✕
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            ‹
          </button>

          <div
            className="relative h-[70vh] w-[92vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={gallery[lightboxIndex]}
              alt={`${tour.title} large ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="rounded-xl object-contain"
              priority
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            ›
          </button>

          <div
            className="absolute bottom-4 left-1/2 flex max-w-[92vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/30 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery.map((src, i) => {
              const active = i === lightboxIndex;
              return (
                <button
                  key={src + i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative h-14 w-20 overflow-hidden rounded-md ring-2 ${
                    active ? "ring-emerald-400" : "ring-transparent"
                  }`}
                >
                  <SafeImage
                    src={src}
                    alt={`thumb ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
