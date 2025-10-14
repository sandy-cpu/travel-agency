"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl"
    >
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
    </motion.div>
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
  // Extracted complex expression to memoized value
  const searchTagsParam = useMemo(() => selectedTags.join(","), [selectedTags]);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (country !== "All") sp.set("country", country);
    if (selectedTags.length > 0) sp.set("tags", searchTagsParam);
    if (minDays > 0) sp.set("minDays", String(minDays));
    if (maxDays < 999) sp.set("maxDays", String(maxDays));
    if (minPrice > 0) sp.set("minPrice", String(minPrice));
    if (maxPrice < 99_999_999) sp.set("maxPrice", String(maxPrice));
    if (sort !== "relevance") sp.set("sort", sort);
    if (pageSize !== 12) sp.set("pageSize", String(pageSize));
    if (page !== 1) sp.set("page", String(page));
    router.replace(`?${sp.toString()}`);
  }, [
    q,
    country,
    searchTagsParam,
    minDays,
    maxDays,
    minPrice,
    maxPrice,
    sort,
    pageSize,
    page,
    router,
  ]);

  // ===== Filter & sort =====
  const items = useMemo(() => {
    let filtered = [...data];

    // Full text search
    if (q) {
      const qLower = q.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(qLower) ||
          t.country.toLowerCase().includes(qLower) ||
          t.summary.toLowerCase().includes(qLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(qLower))
      );
    }

    // Filter by country
    if (country !== "All") {
      filtered = filtered.filter((t) => t.country === country);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((t) =>
        selectedTags.every((tag) => t.tags.includes(tag))
      );
    }

    // Filter by duration
    filtered = filtered.filter(
      (t) => t.durationDays >= minDays && t.durationDays <= maxDays
    );

    // Filter by price
    filtered = filtered.filter(
      (t) => t.priceFrom >= minPrice && t.priceFrom <= maxPrice
    );

    // Sort
    switch (sort) {
      case "priceAsc":
        filtered.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "durationAsc":
        filtered.sort((a, b) => a.durationDays - b.durationDays);
        break;
      case "ratingDesc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [q, country, selectedTags, minDays, maxDays, minPrice, maxPrice, sort]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="sticky inset-x-0 top-0 z-20 flex flex-col bg-white/95 backdrop-blur transition-shadow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-b border-neutral-200 py-3"
        >
          <div className="container mx-auto flex items-center gap-6 px-4">
            <h1 className="text-lg font-medium text-neutral-900">
              Available Tours
            </h1>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        <section className="py-8">
          {/* Search + sort */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search tours, destinations, etc."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-md border border-neutral-300 bg-white px-3 text-neutral-900 placeholder:text-neutral-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-neutral-900"
              >
                <option value="relevance">Relevance</option>
                <option value="priceAsc">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
                <option value="durationAsc">Duration</option>
                <option value="ratingDesc">Rating</option>
              </select>

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
              {paginatedItems.map((t) => (
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
