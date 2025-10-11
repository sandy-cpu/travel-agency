// app/tours/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import tours from "@/lib/tours";

// ===== Types =====
type Tour = {
  id: string | number;
  slug: string;
  title: string;
  country: string;
  image: string;
  durationDays: number;
  priceFrom: number; // USD
  rating: number;
  reviewsCount: number;
  summary: string;
  tags: string[];
};

type SortOption =
  | "relevance"
  | "priceAsc"
  | "priceDesc"
  | "durationAsc"
  | "ratingDesc";

const USD_TO_IDR = 16000;
const formatIDRkFromUSD = (usd: number) => {
  const idr = Math.round(usd * USD_TO_IDR);
  const k = Math.round(idr / 1000);
  const s = k.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${s}K`;
};

// ===== Card =====
function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl">
      <div className="relative aspect-[4/3]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(min-width:1280px) 33vw, (min-width:1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs text-white shadow-lg ring-1 ring-white/30">
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
              d="M12 8v4l3 3M12 22a10 10 0 110-20 10 10 0 010 20z"
            />
          </svg>
          {tour.durationDays}D
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="text-sm text-neutral-500">{tour.country}</div>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-neutral-900">
          {tour.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
          {tour.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tour.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700"
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

        <div className="mt-4 mb-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-600">
              {formatIDRkFromUSD(tour.priceFrom)}
            </span>
            <span className="text-xs text-neutral-500">/ pax</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span aria-hidden>★</span>
            <span className="font-medium">{tour.rating.toFixed(1)}</span>
            <span className="text-neutral-500">({tour.reviewsCount})</span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-white shadow-[0_6px_20px_-8px_rgba(16,185,129,.6)] transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Komponen dalam Suspense -> aman pakai useSearchParams
 */
function ToursInner() {
  const data = tours as Tour[];
  const searchParams = useSearchParams();
  const router = useRouter();

  // ===== URL state (default dari query, supaya bisa share link) =====
  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [country, setCountry] = useState<string>(
    searchParams.get("country") || "All"
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    (searchParams.get("tags") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  );
  const [minDays, setMinDays] = useState<number>(
    Number(searchParams.get("minDays") || 0)
  );
  const [maxDays, setMaxDays] = useState<number>(
    Number(searchParams.get("maxDays") || 999)
  );
  const [minPrice, setMinPrice] = useState<number>(
    Number(searchParams.get("minPrice") || 0)
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("maxPrice") || 99_999_999)
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "relevance"
  );
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("pageSize") || 12)
  );
  const [page, setPage] = useState<number>(
    Math.max(1, Number(searchParams.get("page") || 1))
  );

  // toolbar elevation
  const [elev, setElev] = useState(false);
  useEffect(() => {
    const onScroll = () => setElev(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== Facets =====
  const allCountries = useMemo(
    () => ["All", ...Array.from(new Set(data.map((t) => t.country))).sort()],
    [data]
  );
  const allTags = useMemo(() => {
    const s = new Set<string>();
    data.forEach((t) => t.tags.forEach((x) => s.add(x)));
    return Array.from(s).sort();
  }, [data]);

  // ===== Sinkron ke URL =====
  function pushQuery(updatePage = true) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (country && country !== "All") sp.set("country", country);
    if (selectedTags.length) sp.set("tags", selectedTags.join(","));
    if (minDays) sp.set("minDays", String(minDays));
    if (maxDays !== 999) sp.set("maxDays", String(maxDays));
    if (minPrice) sp.set("minPrice", String(minPrice));
    if (maxPrice !== 99_999_999) sp.set("maxPrice", String(maxPrice));
    if (sort !== "relevance") sp.set("sort", sort);
    if (pageSize !== 12) sp.set("pageSize", String(pageSize));
    sp.set("page", String(updatePage ? 1 : page));
    router.replace(`/tours?${sp.toString()}`);
  }

  // filter berubah → update URL & reset page
  useEffect(() => {
    pushQuery(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    q,
    country,
    selectedTags.join(","),
    minDays,
    maxDays,
    minPrice,
    maxPrice,
    sort,
    pageSize,
  ]);
  // halaman berubah → update URL tanpa reset
  useEffect(() => {
    pushQuery(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ===== Filtering + Sorting (client) =====
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = data.filter((t) => {
      const txtOk =
        !term ||
        t.title.toLowerCase().includes(term) ||
        t.country.toLowerCase().includes(term) ||
        t.summary.toLowerCase().includes(term) ||
        t.tags.some((x) => x.toLowerCase().includes(term));
      const countryOk = country === "All" || t.country === country;
      const tagsOk =
        selectedTags.length === 0 ||
        selectedTags.every((tg) => t.tags.includes(tg));
      const daysOk = t.durationDays >= minDays && t.durationDays <= maxDays;

      const idr = t.priceFrom * USD_TO_IDR;
      const priceOk = idr >= minPrice && idr <= maxPrice;

      return txtOk && countryOk && tagsOk && daysOk && priceOk;
    });

    if (sort === "priceAsc") list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "priceDesc") list.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "durationAsc")
      list.sort((a, b) => a.durationDays - b.durationDays);
    if (sort === "ratingDesc") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [
    data,
    q,
    country,
    selectedTags,
    minDays,
    maxDays,
    minPrice,
    maxPrice,
    sort,
  ]);

  // ===== Pagination =====
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  // helpers UI
  function toggleTag(tag: string) {
    setPage(1);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
    );
  }
  function resetFilters() {
    setQ("");
    setCountry("All");
    setSelectedTags([]);
    setMinDays(0);
    setMaxDays(999);
    setMinPrice(0);
    setMaxPrice(99_999_999);
    setSort("relevance");
    setPage(1);
    setPageSize(12);
    pushQuery(); // sinkron URL
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Toolbar */}
      <div
        className={`sticky top-0 z-30 border-b bg-white ${
          elev ? "shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            {/* search */}
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="flex h-11 flex-1 items-center gap-2 rounded-md border border-neutral-300 bg-white pl-3 pr-2 md:w-[380px]">
                <svg
                  aria-hidden
                  className="h-5 w-5 text-neutral-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by country, tag, or keyword…"
                  className="h-10 w-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
                />
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="rounded p-1 text-neutral-600 hover:bg-neutral-100"
                    aria-label="Clear"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* sort + page size */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-900">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortOption);
                    setPage(1);
                  }}
                  className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-neutral-900"
                >
                  <option value="relevance">Relevance</option>
                  <option value="priceAsc">Price (Low → High)</option>
                  <option value="priceDesc">Price (High → Low)</option>
                  <option value="durationAsc">Duration</option>
                  <option value="ratingDesc">Rating</option>
                </select>
              </div>
              <div className="hidden items-center gap-2 text-sm md:flex">
                <span className="text-neutral-900">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-neutral-900"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-88px)] lg:overflow-auto">
          <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-4">
            {/* Country */}
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-900">
                Country
              </div>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900"
              >
                {allCountries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-900">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`h-9 rounded-full border px-3 text-sm transition ${
                        active
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-2 text-xs text-emerald-700 hover:underline"
                >
                  Clear tags
                </button>
              )}
            </div>

            {/* Duration */}
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-900">
                Duration (days)
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minDays}
                  onChange={(e) => {
                    setMinDays(Number(e.target.value || 0));
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm text-neutral-900"
                  placeholder="Min"
                />
                <span className="text-neutral-600">–</span>
                <input
                  type="number"
                  min={0}
                  value={maxDays === 999 ? "" : maxDays}
                  onChange={(e) => {
                    setMaxDays(e.target.value ? Number(e.target.value) : 999);
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm text-neutral-900"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="mb-2 text-sm font-medium text-neutral-900">
                Price (IDR)
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(Number(e.target.value || 0));
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm text-neutral-900"
                  placeholder="Min (Rp)"
                />
                <span className="text-neutral-600">–</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice === 99_999_999 ? "" : maxPrice}
                  onChange={(e) => {
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : 99_999_999
                    );
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm text-neutral-900"
                  placeholder="Max (Rp)"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Ditampilkan sebagai <strong>Rp x.K</strong> (ribuan rupiah).
              </p>
            </div>

            <button
              onClick={resetFilters}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50"
            >
              Reset all filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-neutral-700">
              {total === 0
                ? "No results"
                : `Showing ${start + 1}-${Math.min(
                    start + pageSize,
                    total
                  )} of ${total} tours`}
              {selectedTags.length > 0 && (
                <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                  {selectedTags.length} tag
                  {selectedTags.length > 1 ? "s" : ""} selected
                </span>
              )}
            </div>
            {/* page size (mobile) */}
            <div className="flex items-center gap-2 text-sm md:hidden">
              <span className="text-neutral-900">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-neutral-900"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>

          {/* Grid / empty */}
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
              <div className="text-lg font-medium text-neutral-900">
                No tours match your filters
              </div>
              <p className="mt-1 text-neutral-600">
                Try adjusting your filters or reset to see all tours.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: pageCount })
                .slice(0, 7)
                .map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-10 min-w-[40px] rounded-md border px-3 text-sm ${
                        p === currentPage
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              <button
                disabled={currentPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
            <h3 className="text-xl font-semibold text-neutral-900">
              Need help finding the right tour?
            </h3>
            <p className="mt-1 text-neutral-600">
              Tell us your dates and interests—our experts will tailor
              recommendations.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-6 text-white hover:bg-emerald-700"
            >
              Talk to an expert
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-600">Loading…</div>}>
      <ToursInner />
    </Suspense>
  );
}
