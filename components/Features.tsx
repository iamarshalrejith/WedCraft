"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Sparkles,
  MapPin,
  Image,
  CheckCircle,
  CalendarDays,
  MessageCircle,
  Timer,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Shareable Website Link",
    description:
      "A real URL your guests can open on any device — not just a PDF or image.",
  },
  {
    icon: Sparkles,
    title: "Animations & Music",
    description:
      "Smooth entrance animations and optional background music for a premium feel.",
  },
  {
    icon: MapPin,
    title: "Google Maps for Venue",
    description:
      "Guests can get directions directly from the invite — no confusion about location.",
  },
  {
    icon: Image,
    title: "Couple Photo Gallery",
    description:
      "Showcase your pre-wedding photos right inside the invitation.",
  },
  {
    icon: CheckCircle,
    title: "RSVP System",
    description:
      "Guests confirm attendance with a tap. You see all responses in your dashboard.",
  },
  {
    icon: CalendarDays,
    title: "Event Schedule",
    description:
      "List all events — Mehendi, Sangeet, Wedding — in a beautiful timeline.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Ready",
    description:
      "One-tap share to WhatsApp. The link previews beautifully with your photo.",
  },
  {
    icon: Timer,
    title: "Countdown Timer",
    description: "A live countdown that builds excitement as the big day approaches.",
  },
];

export const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16" id="features">
      <div className="text-center mb-12">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
          Everything included
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          More than a printed card
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto">
          Every WedCraft invitation comes with features that a physical card could never offer.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 text-center md:text-left"
            >
              <div className="flex md:block justify-center md:justify-start mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 border">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {f.title}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};