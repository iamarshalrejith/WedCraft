"use client";

import { motion } from "framer-motion";
import { Palette, Eye, CreditCard, Share2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Palette,
    title: "Browse & Pick",
    description:
      "Filter through our designs by religion, theme, or budget. Every template is mobile-first and fully animated.",
  },
  {
    number: "02",
    icon: Eye,
    title: "Live Preview",
    description:
      "See your selected template in action — click around, explore animations, and imagine your names in it.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pay & Personalise",
    description:
      "Pay once via Razorpay. Fill in your names, date, venue, and photos. Done in under 10 minutes.",
  },
  {
    number: "04",
    icon: Share2,
    title: "Share Instantly",
    description:
      "Get a unique link like wedcraft.in/rahul-weds-priya. Share on WhatsApp, Instagram, or email.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="bg-white py-16 md:py-24" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Simple Process
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            From browsing to sending in minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gray-200 z-0 -translate-x-1/2" />
                )}

                <div className="relative z-10 bg-gray-50 rounded-2xl p-6 h-full border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                  
                  {/* Icon + Step Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>

                    <span className="text-xs font-bold text-gray-400 tracking-wider">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};