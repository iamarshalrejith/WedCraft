"use client";

import Image from "next/image";
import SplitText from "@/components/SplitText";
import { motion } from "framer-motion";
import { useState } from "react";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <section
      id="hero"
      className="relative w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 md:py-16  overflow-hidden "
    >
      {/* subtle background decoration */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-40"></div>

      {/* Content */}
      <div className="relative w-full md:w-1/2 max-w-xl order-2 md:order-1 mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left mx-auto">
        <SplitText
          text={"Your Wedding Invite, But Make It a Website."}
          tag="h1"
          splitType="chars"
          useScrollTrigger={false}
          delay={20}
          duration={0.8}
          className="text-4xl md:text-3xl lg:text-6xl font-bold leading-tight text-black tracking-tight"
          to={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        />

        <button className="hidden md:block lg:hidden mt-10 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl">
          Explore Templates
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
        {/* Mobile Image */}

        <motion.div
          initial={false} 
          animate={
            loaded
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 40, scale: 0.98 }
          }
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden"
        >
          <Image
            src="/images/mobhero2.png"
            alt="Wedding invitation website preview"
            width={800}
            height={800}
            className="w-full max-w-lg object-contain"
            priority
          onLoad={() => {
  if (!loaded) setLoaded(true);
}}
          />
        </motion.div>

        {/* Desktop Image */}
        <div className="relative hidden md:block w-full h-[70vh]">
          <motion.div
            initial={false}
            animate={
              loaded
                ? { opacity: 1, x: 0, scale: 1 }
                : { opacity: 0, x: 60, scale: 0.98 }
            }
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full"
          >
            <Image
              src="/images/hero4.png"
              alt="Wedding invitation website preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
              onLoad={() => {
  if (!loaded) setLoaded(true);
}}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
