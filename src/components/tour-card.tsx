// components/tour-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

type Tour = {
  id: string;
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
};
export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md flex flex-col">
      {/* IMAGE */}
      <div className="relative aspect-[4/3]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
          <span aria-hidden>⏱</span>
          {tour.durationDays}D
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-1 text-sm text-neutral-500">{tour.country}</div>
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-neutral-900">
          {tour.title}
        </h3>

        {/* summary + tags -> beri min-h agar area ini konsisten */}
        <div className="mb-4">
          <p className="mb-3 line-clamp-2 text-sm text-neutral-600">
            {tour.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            {tour.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* price + rating */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-600">
              ${tour.priceFrom}
            </span>
            <span className="text-sm text-neutral-500">/ person</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-neutral-700">
            <span aria-hidden>★</span>
            <span className="font-medium">{tour.rating}</span>
            <span className="text-neutral-500">({tour.reviewsCount})</span>
          </div>
        </div>

        {/* CTA di-dorong ke bawah */}
        <div className="mt-auto">
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
