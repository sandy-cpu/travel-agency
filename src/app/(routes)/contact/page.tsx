"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700/90 bg-emerald-50 px-3 py-1 rounded-full ring-1 ring-emerald-600/10"
          >
            ✦ Get in touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight"
          >
            Let&apos;s plan your next trip
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 text-lg text-neutral-600"
          >
            Ping us for custom itineraries, booking support, or partnerships.
          </motion.p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm"
          >
            <div className="absolute inset-px rounded-[15px] bg-gradient-to-b from-white/60 to-white/30 pointer-events-none" />
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative space-y-5"
            >
              <div className="relative">
                <User2 className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur"
                />
              </div>

              <div className="relative">
                <MessageSquareText className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur"
                />
              </div>

              <Button className="w-full md:w-auto">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </motion.form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Contact Information
              </h3>
              <div className="mt-4 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start"
                >
                  <Phone className="mr-3 h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a
                      href="tel:+1234567890"
                      className="text-sm text-neutral-600 hover:text-emerald-600"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start"
                >
                  <Mail className="mr-3 h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a
                      href="mailto:hello@example.com"
                      className="text-sm text-neutral-600 hover:text-emerald-600"
                    >
                      hello@example.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start"
                >
                  <MapPin className="mr-3 h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Office</div>
                    <address className="text-sm text-neutral-600 not-italic">
                      123 Travel Street
                      <br />
                      Wanderlust City, WC 12345
                    </address>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
