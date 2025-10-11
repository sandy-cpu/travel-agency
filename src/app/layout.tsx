// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Agency - Your Ultimate Travel Partner",
  description:
    "Discover amazing destinations and unforgettable experiences with our travel agency.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={[
          inter.className,
          // ⬇️ kunci background & warna dasar terang di seluruh site
          "min-h-dvh bg-neutral-50 text-neutral-900 antialiased",
        ].join(" ")}
      >
        <Navbar />
        {/* biar tidak menimpa bg body */}
        <main className="min-h-screen pt-16 bg-transparent">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
