"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import destinations from "@/lib/destinations";
import tours from "@/lib/tours";

// ===== lazy carousel (sudah ada di project kamu) =====
const FeaturedDestinationsCarousel = dynamic(
  () => import("@/components/featured-destinations-carousel"),
  { ssr: false }
);

// ====== Types ======
type Destination = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  country: string;
  countryCode: string;
};

type Tour = {
  id: number | string;
  slug: string;
  title: string;
  country: string;
  image: string;
  durationDays: number;
  priceFrom: number;
  rating: number; // 0..5
  reviewsCount: number;
  summary: string;
  tags: string[];
};

type SortOption = "popular" | "priceAsc" | "priceDesc" | "duration";

// ===== util mini =====
function formatMoney(n: number, locale = "en-US", currency = "USD") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(n);
  } catch {
    return `$${n}`;
  }
}

const USD_TO_IDR = 16000;
const formatIDRkFromUSD = (usd: number) => {
  const idr = Math.round(usd * USD_TO_IDR);
  const k = Math.round(idr / 1000);
  const s = k.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${s}K`;
};

// ===== stars a11y =====
function Stars({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(5, Number.isFinite(value) ? value : 0));
  return (
    <div
      aria-label={`Rating ${safe.toFixed(1)} out of 5`}
      className="text-sm text-neutral-700"
    >
      <span aria-hidden>★</span>
      <span className="font-medium ml-1">{safe.toFixed(1)}</span>
    </div>
  );
}

// ===== skeleton =====
function TourSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse" />
        <div className="h-3 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-28 bg-neutral-200 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}

// ===== JSON-LD list (SEO ringan) =====
function ToursJsonLD({ items }: { items: Tour[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/tours/${t.slug}`,
      name: t.title,
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function TourCardEnhanced({ tour }: { tour: Tour }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white/90 backdrop-blur border border-neutral-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 hover:border-emerald-200 flex flex-col">
      <div className="absolute inset-px rounded-[15px] pointer-events-none bg-gradient-to-b from-white/60 to-white/10" />
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* BADGE durasi: lebih kontras */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs px-2.5 py-1 shadow-lg ring-1 ring-white/30">
          <svg
            aria-hidden
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3M12 22a10 10 0 110-20 10 10 0 010 20z"
            />
          </svg>
          {tour.durationDays}D
        </div>
      </div>

      {/* Body */}
      <div className="relative p-5 flex-1 flex flex-col">
        <div className="text-sm text-neutral-500">{tour.country}</div>
        <h3 className="mt-1 text-lg font-semibold text-neutral-900 line-clamp-2">
          {tour.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
          {tour.summary}
        </p>

        {/* TAG CHIP: kontras + icon kecil */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tour.tags.slice(0, 3).map((t, i) => (
            <span
              key={t}
              className={
                i === 0
                  ? "inline-flex items-center gap-1 text-xs rounded-full border px-2.5 py-1 bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "inline-flex items-center gap-1 text-xs rounded-full border px-2.5 py-1 bg-white text-neutral-700 border-neutral-200"
              }
            >
              <svg
                aria-hidden
                className="w-3.5 h-3.5"
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

        <div className="mt-4 mb-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-600">
              {formatIDRkFromUSD(tour.priceFrom)}
            </span>
            <span className="text-xs text-neutral-500">/ person</span>
          </div>
          <div className="flex items-center gap-2">
            <Stars value={tour.rating} />
            <span className="text-sm text-neutral-500">
              ({tour.reviewsCount})
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 shadow-[0_6px_20px_-8px_rgba(16,185,129,.6)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // Kalau library kamu belum punya type export, kita cast aman ke tipe lokal:
  const featuredDestinations = destinations as Destination[];
  const toursData = tours as Tour[];

  // === Search / Sort / Filter sederhana ===
  const [q, setQ] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("popular");

  const allCats: string[] = useMemo(() => {
    const catSet = new Set<string>();
    toursData.forEach((t) => t.tags.forEach((x) => catSet.add(x)));
    return ["All", ...Array.from(catSet).slice(0, 6)];
  }, [toursData]);

  const [cat, setCat] = useState<string>("All");

  const filtered: Tour[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = toursData.filter((t) => {
      const inText =
        term.length === 0 ||
        t.title.toLowerCase().includes(term) ||
        t.country.toLowerCase().includes(term) ||
        t.summary.toLowerCase().includes(term) ||
        t.tags.some((x) => x.toLowerCase().includes(term));
      const inCat = cat === "All" || t.tags.includes(cat);
      return inText && inCat;
    });

    if (sort === "priceAsc")
      list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "priceDesc")
      list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "duration")
      list = [...list].sort((a, b) => a.durationDays - b.durationDays);

    return list;
  }, [q, cat, sort, toursData]);

  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMdUp(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);
  const MAX_TOURS = isMdUp ? 8 : 4;
  const visibleTours = useMemo(
    () => filtered.slice(0, MAX_TOURS),
    [filtered, MAX_TOURS]
  );

  return (
    <main>
      {/* ===== HERO dengan lapisan gradient + grain ===== */}
      <section className="relative min-h-[720px] flex items-center bg-neutral-950">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg"
            alt="Hero background - Beautiful mountain landscape with tourists"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-50"
          />
          {/* radial glow */}
          <div className="absolute inset-0 [background:radial-gradient(60%_40%_at_20%_20%,rgba(16,185,129,0.28),transparent_60%)]" />
          {/* grain (CSS only) */}
          <div
            className="absolute inset-0 opacity-[0.09] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2280%22 height=%2280%22 filter=%22url(%23n)%22 opacity=%220.25%22/></svg>')",
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Discover Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-500">
                Next Adventure
              </span>
            </h1>
            <p className="mt-4 text-lg text-neutral-200 leading-relaxed max-w-xl">
              Hand-picked tours with real local experts. Flexible dates, fair
              pricing, zero hidden fees.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 h-12 px-6 shadow-lg shadow-emerald-500/20"
              >
                View Tours
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white bg-white/10 text-white hover:bg-white/20 h-12 px-6 backdrop-blur border border-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Popular Destinations (dengan subtle grid bg) ===== */}
      <section className="relative py-16 md:py-24 bg-neutral-50">
        <div className="pointer-events-none absolute inset-0 [background:linear-gradient(to_right,rgba(0,0,0,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-emerald-700/90 bg-emerald-50 px-3 py-1 rounded-full">
              ✦ Popular Destinations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-4">
              Find your dream getaway
            </h2>
            <p className="text-lg text-neutral-600 mt-3">
              Explore our most popular destinations and start planning.
            </p>
          </div>
          <FeaturedDestinationsCarousel destinations={featuredDestinations} />
        </div>
      </section>

      {/* ===== Why Travel ===== */}
      <section className="py-16 md:py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg"
            alt="Travel background"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Travel with Us?
            </h2>
            <p className="text-lg text-neutral-300">
              Passionate team. Authentic experiences. Unforgettable journeys.
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-300">
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>✅</span>No hidden fees
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>🛡️</span>Secure payment
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>📞</span>24/7 support
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>↺</span>Free reschedule
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Guides",
                desc: "Local experts who know and love their destinations.",
              },
              {
                title: "24/7 Support",
                desc: "Round-the-clock assistance for peace of mind.",
              },
              {
                title: "Best Value",
                desc: "Competitive prices with zero hidden costs.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4"
                  aria-hidden
                >
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
                <p className="text-neutral-300">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Travel Stories: carousel snap ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Travel Stories
            </h2>
            <p className="text-lg text-neutral-600">
              Real experiences from our happy travelers.
            </p>
          </div>

          <div className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 min-w-max">
              {[
                {
                  quote:
                    "An incredible journey through Japan! The guides made every moment special.",
                  name: "Sarah Mitchell",
                  sub: "Japan Cultural Tour",
                  img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
                },
                {
                  quote:
                    "From beaches to temples, everything was perfectly organized.",
                  name: "Mark Johnson",
                  sub: "Bali Adventure Package",
                  img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
                },
                {
                  quote:
                    "Our Mediterranean cruise was beyond expectations. Unforgettable!",
                  name: "Lisa Anderson",
                  sub: "Mediterranean Cruise",
                  img: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
                },
              ].map((t) => (
                <figure
                  key={t.name}
                  className="snap-center w-[320px] shrink-0 bg-neutral-50 p-6 rounded-2xl border"
                >
                  <blockquote className="mb-6">
                    <p className="text-neutral-700 italic">“{t.quote}”</p>
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden relative">
                      <Image
                        src={t.img}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">
                        {t.name}
                      </div>
                      <div className="text-neutral-500 text-sm">{t.sub}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Tours List (Light + Blurred Panel Header) ===== */}
      <section className="relative py-16 md:py-24 bg-neutral-50">
        {/* subtle ambient glow + grid */}
        <div
          className="pointer-events-none absolute inset-0
    [background:radial-gradient(60%_40%_at_80%_0%,rgba(16,185,129,.08),transparent_55%)]
    [background-size:100%_100%]"
        />
        <div
          className="pointer-events-none absolute inset-0
    [background:linear-gradient(to_right,rgba(0,0,0,.04)_1px,transparent_1px),
                 linear-gradient(to_bottom,rgba(0,0,0,.04)_1px,transparent_1px)]
    [background-size:32px_32px]"
        />

        <div className="container mx-auto px-4 relative">
          {/* Header panel blur */}
          <div className="mx-auto mb-12 max-w-3xl text-center rounded-2xl border border-black/5 bg-white/60 backdrop-blur px-6 py-8 shadow-sm">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-emerald-700/90 bg-emerald-50 px-3 py-1 rounded-full ring-1 ring-emerald-600/10">
              ✦ Popular Tours
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-neutral-900">
              Plan your perfect escape
            </h2>
            <p className="mt-3 text-neutral-600 text-lg">
              Curated itineraries, flexible dates, real local guides.
            </p>
            {/* trust row */}
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-600">
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>✅</span>No hidden fees
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>🛡️</span>Secure payment
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>📞</span>24/7 support
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden>↺</span>Free reschedule
              </li>
            </ul>
          </div>

          {/* Search / Sort */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tours (e.g. Japan, beach, 7D)"
              className="h-11 w-full md:w-[380px] rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-600">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popular">Most Popular</option>
                <option value="priceAsc">Price (Low → High)</option>
                <option value="priceDesc">Price (High → Low)</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {/* Filter pills */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {allCats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`h-10 px-4 rounded-full border transition ${
                  cat === c
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <TourSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* JSON-LD tetap pakai list lengkap untuk SEO */}
              <ToursJsonLD items={filtered} />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleTours.map((tour) => (
                  <TourCardEnhanced key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Hint kecil kalau ada lebih banyak hasil */}
              {filtered.length > visibleTours.length && (
                <p className="mt-6 text-center text-sm text-neutral-500">
                  Showing {visibleTours.length} of {filtered.length} results
                </p>
              )}
            </>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/tours"
              className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-900 px-6 text-base font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Browse All Tours
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="py-16 md:py-24 bg-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">
                Get Travel Inspiration
              </h2>
              <p className="text-emerald-50 text-lg">
                Subscribe and receive exclusive offers, tips, and destination
                updates.
              </p>
            </div>
            <NewsletterInline />
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-16 md:py-24 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Talk to our travel experts and let us plan your perfect vacation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 h-12 px-8 shadow-lg"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Floating CTA (mobile) ===== */}
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div className="rounded-xl bg-neutral-900 text-white px-4 py-3 shadow-2xl flex items-center justify-between">
          <div className="text-sm">
            <div className="font-semibold">Need help planning?</div>
            <div className="text-white/80">Talk to our trip expert</div>
          </div>
          <Link
            href="/contact"
            className="h-10 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center"
          >
            Chat Now
          </Link>
        </div>
      </div>
    </main>
  );
}

// ===== newsletter inline (validasi mini) =====
function NewsletterInline() {
  const [email, setEmail] = useState<string>("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  function onSubscribe() {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMsg({ type: "err", text: "Please enter a valid email." });
      return;
    }
    // TODO: POST to /api/subscribe
    setMsg({ type: "ok", text: "Thanks! Check your inbox to confirm." });
  }

  return (
    <div className="w-full md:w-auto">
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 h-12 px-4 rounded-md border border-white border-2 bg-transparent text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          onClick={onSubscribe}
          className="bg-white text-emerald-600 px-6 h-12 rounded-md font-medium hover:bg-emerald-50 transition-colors"
        >
          Subscribe
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-2 text-sm ${
          msg?.type === "err" ? "text-red-200" : "text-white/80"
        }`}
      >
        {msg?.text}
      </p>
    </div>
  );
}
