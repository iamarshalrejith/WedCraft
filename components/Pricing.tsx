"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    tier: "Basic",
    price: 499,
    badge: null,
    description: "Everything you need for a beautiful invite.",
    features: [
      "1 template of your choice",
      "Shareable unique URL",
      "RSVP form",
      "Google Maps integration",
      "WhatsApp share button",
      "Active for 6 months",
    ],
    cta: "Get Started",
    ctaStyle: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
  },
  {
    tier: "Premium",
    price: 999,
    badge: "Most Popular",
    description: "Animations, gallery, and more for your special day.",
    features: [
      "Everything in Basic",
      "Animated entrance & transitions",
      "Couple photo gallery",
      "Countdown timer",
      "Background music",
      "Event schedule timeline",
      "Active for 12 months",
    ],
    cta: "Choose Premium",
    ctaStyle: "bg-black text-white hover:bg-gray-800",
  },
  {
    tier: "Luxury",
    price: 1999,
    badge: "Best Experience",
    description: "Cinematic, bespoke design for a black-tie affair.",
    features: [
      "Everything in Premium",
      "Exclusive luxury templates",
      "Live RSVP dashboard",
      "Custom domain option",
      "Priority support",
      "30-day free edits",
      "Active for 24 months",
    ],
    cta: "Go Luxury",
    ctaStyle: "bg-zinc-900 text-yellow-400 hover:bg-black border border-yellow-400/30",
  },
];

export const Pricing = () => {
  return (
    <section className="bg-white py-16 md:py-24" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Transparent Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Pay once. Share forever.
          </h2>
          <p className="text-gray-500">
            No subscriptions. No hidden fees. Just your beautiful invite, live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-3xl p-7 border ${
                plan.badge === "Most Popular"
                  ? "border-black shadow-xl scale-105"
                  : plan.tier === "Luxury"
                    ? "border-yellow-400/40 bg-zinc-900"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      plan.tier === "Luxury"
                        ? "bg-yellow-400 text-zinc-900"
                        : "bg-black text-white"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p
                  className={`text-sm font-medium mb-1 ${plan.tier === "Luxury" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {plan.tier}
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-bold ${plan.tier === "Luxury" ? "text-white" : "text-gray-900"}`}
                  >
                    ₹{plan.price.toLocaleString("en-IN")}
                  </span>
                  <span
                    className={`text-sm mb-1 ${plan.tier === "Luxury" ? "text-gray-400" : "text-gray-400"}`}
                  >
                    one-time
                  </span>
                </div>
                <p
                  className={`text-sm mt-1 ${plan.tier === "Luxury" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      size={14}
                      className={`mt-0.5 shrink-0 ${
                        plan.tier === "Luxury" ? "text-yellow-400" : "text-emerald-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${plan.tier === "Luxury" ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/catalog"
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};