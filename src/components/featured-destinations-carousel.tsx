"use client";

import Image from "next/image";
import { Destination } from "@/types/destination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  destinations: Destination[];
}

export default function FeaturedDestinationsCarousel({ destinations }: Props) {
  return (
    <div className="relative px-4 sm:px-12 overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop={true}
        className="py-4"
      >
        {destinations.map((destination) => (
          <SwiperSlide key={destination.id}>
            <div className="group relative rounded-2xl overflow-hidden">
              {/* Image with updated aspect ratio and hover effect */}
              <div className="aspect-[4/5] relative">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60" />
              </div>

              {/* Text section */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {destination.name}
                </h3>
                <p className="text-neutral-200 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <Link
                  href={`/destinations?country=${destination.country.toLowerCase()}`}
                  className="text-white font-medium flex items-center gap-2 group-hover:text-emerald-400 transition-colors"
                >
                  Explore
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors z-10 hidden sm:flex">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors z-10 hidden sm:flex">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
