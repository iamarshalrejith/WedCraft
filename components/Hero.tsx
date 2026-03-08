"use client"

import Image from "next/image";
import SplitText from "@/components/SplitText";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 md:py-16  overflow-hidden bg-gray-200">
      {/* subtle background decoration */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-40"></div>

      {/* Content */}
      <div className="relative w-full md:w-1/2 max-w-xl order-2 md:order-1 mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left mx-auto">
        <SplitText
          text={"Your Wedding Invite, But Make It a Website."}
          tag="h1"
          splitType="chars"
          delay={40}
          duration={1}
          className="text-4xl md:text-3xl lg:text-6xl font-bold leading-tight text-black tracking-tight"
        />

        <button className="hidden md:block lg:hidden mt-10 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl">
          Explore Templates
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
        {/* Mobile Image */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:hidden"
        >
          <Image
            src="/images/mobhero2.png"
            alt="Wedding invitation website preview"
            width={800}
            height={800}
            className="w-full max-w-lg object-contain"
            priority
          />
        </motion.div>

        {/* Desktop Image */}
        <div className="relative hidden md:block w-full h-[70vh]">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative hidden md:block w-full h-[70vh]"
          >
            <Image
              src="/images/hero4.png"
              alt="Wedding invitation website preview"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
