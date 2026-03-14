import Hero from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { FeaturedTemplates } from "@/components/FeaturedTemplates";
import { Pricing } from "@/components/Pricing";

const page = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <FeaturedTemplates />
      <Pricing />
    </div>
  )
}

export default page