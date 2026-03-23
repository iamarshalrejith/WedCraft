export type Religion = "Hindu" | "Muslim" | "Christian" | "Sikh" | "Universal";
export type Theme = "Traditional" | "Modern" | "Minimal" | "Beach" | "Royal" | "Floral";
export type Tier = "Basic" | "Premium" | "Luxury";

export interface Template {
  id: string;
  name: string;
  slug: string;
  price: number;
  tier: Tier;
  religion: Religion;
  themes: Theme[];
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  thumbnail: string; // path under /public/templates/
  previewBg: string; // tailwind gradient for placeholder
  colors: string[]; // palette hex for display
}

export const templates: Template[] = [
  {
    id: "t001",
    name: "Mangal Utsav",
    slug: "mangal-utsav",
    price: 999,
    tier: "Premium",
    religion: "Hindu",
    themes: ["Traditional", "Floral"],
    description:
      "A vibrant, marigold-inspired design with intricate mandala motifs and warm gold typography. Perfect for traditional Hindu ceremonies.",
    features: [
      "Animated floral entrance",
      "Couple photo gallery",
      "Google Maps integration",
      "RSVP system",
      "Countdown timer",
      "Background music",
    ],
    rating: 4.9,
    reviewCount: 87,
    isFeatured: true,
    isNew: false,
    thumbnail: "/templates/mangal-utsav.jpg",
    previewBg: "from-orange-100 via-yellow-50 to-red-100",
    colors: ["#F97316", "#EAB308", "#DC2626"],
  },
  {
    id: "t002",
    name: "Eternal Bloom",
    slug: "eternal-bloom",
    price: 799,
    tier: "Premium",
    religion: "Universal",
    themes: ["Modern", "Floral"],
    description:
      "Clean white canvas with delicate botanical illustrations. A modern take on romance, works for all ceremonies.",
    features: [
      "Parallax scroll effects",
      "Couple story timeline",
      "Photo gallery",
      "RSVP form",
      "WhatsApp share button",
    ],
    rating: 4.8,
    reviewCount: 63,
    isFeatured: true,
    isNew: false,
    thumbnail: "/templates/eternal-bloom.jpg",
    previewBg: "from-pink-50 via-white to-rose-100",
    colors: ["#F9A8D4", "#FBCFE8", "#10B981"],
  },
  {
    id: "t003",
    name: "Azure Shore",
    slug: "azure-shore",
    price: 999,
    tier: "Premium",
    religion: "Universal",
    themes: ["Beach", "Modern"],
    description:
      "Sun-kissed waves and soft sand tones. Designed for destination beach weddings with a breezy, vacation feel.",
    features: [
      "Wave animation header",
      "Venue map with custom pin",
      "Photo gallery",
      "RSVP system",
      "Countdown timer",
      "Mobile optimized",
    ],
    rating: 4.7,
    reviewCount: 41,
    isFeatured: true,
    isNew: true,
    thumbnail: "/templates/azure-shore.jpg",
    previewBg: "from-sky-100 via-blue-50 to-cyan-100",
    colors: ["#0EA5E9", "#06B6D4", "#F0FDF4"],
  },
  {
    id: "t004",
    name: "Nikah Nazm",
    slug: "nikah-nazm",
    price: 999,
    tier: "Premium",
    religion: "Muslim",
    themes: ["Traditional", "Royal"],
    description:
      "Elegant geometric Islamic patterns with a deep teal and gold palette. Celebrates the beauty of a Nikah ceremony.",
    features: [
      "Geometric animated motifs",
      "Arabic calligraphy accents",
      "Couple gallery",
      "RSVP system",
      "Venue details",
    ],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: false,
    isNew: true,
    thumbnail: "/templates/nikah-nazm.jpg",
    previewBg: "from-teal-900 via-teal-800 to-yellow-900",
    colors: ["#0F766E", "#EAB308", "#F8FAFC"],
  },
  {
    id: "t005",
    name: "Sacred Vows",
    slug: "sacred-vows",
    price: 799,
    tier: "Premium",
    religion: "Christian",
    themes: ["Traditional", "Floral"],
    description:
      "Ivory and sage, adorned with gentle floral borders. A timeless design for church and chapel ceremonies.",
    features: [
      "Church venue details",
      "Photo gallery",
      "RSVP with meal options",
      "Countdown timer",
      "WhatsApp share",
    ],
    rating: 4.6,
    reviewCount: 35,
    isFeatured: false,
    isNew: false,
    thumbnail: "/templates/sacred-vows.jpg",
    previewBg: "from-stone-100 via-green-50 to-emerald-100",
    colors: ["#D6D3D1", "#6EE7B7", "#1C1917"],
  },
  {
    id: "t006",
    name: "Onyx & Gold",
    slug: "onyx-and-gold",
    price: 1999,
    tier: "Luxury",
    religion: "Universal",
    themes: ["Royal", "Modern"],
    description:
      "A black-tie affair in digital form. Deep charcoal backgrounds, gold foil typography, and cinematic animations for the most discerning couples.",
    features: [
      "Cinematic scroll animations",
      "Premium photo gallery",
      "Live RSVP dashboard",
      "Custom domain option",
      "Priority support",
      "Unlimited edits for 30 days",
    ],
    rating: 5.0,
    reviewCount: 18,
    isFeatured: true,
    isNew: false,
    thumbnail: "/templates/onyx-gold.jpg",
    previewBg: "from-zinc-900 via-stone-900 to-yellow-950",
    colors: ["#18181B", "#EAB308", "#FAFAFA"],
  },
  {
    id: "t007",
    name: "Anand Karaj",
    slug: "anand-karaj",
    price: 499,
    tier: "Basic",
    religion: "Sikh",
    themes: ["Traditional"],
    description:
      "Inspired by the colours of a Punjabi wedding — vibrant pinks, greens, and the golden light of the Gurudwara.",
    features: [
      "Animated entrance",
      "Venue map",
      "Event schedule",
      "RSVP form",
    ],
    rating: 4.5,
    reviewCount: 22,
    isFeatured: false,
    isNew: false,
    thumbnail: "/templates/anand-karaj.jpg",
    previewBg: "from-fuchsia-100 via-pink-50 to-green-100",
    colors: ["#D946EF", "#22C55E", "#FCD34D"],
  },
  {
    id: "t008",
    name: "Paper & Petals",
    slug: "paper-and-petals",
    price: 499,
    tier: "Basic",
    religion: "Universal",
    themes: ["Minimal"],
    description:
      "A clean, typographic design with minimal decoration. Lets the couple's words speak loudest.",
    features: ["Fast loading", "RSVP form", "Venue map", "WhatsApp share"],
    rating: 4.4,
    reviewCount: 51,
    isFeatured: false,
    isNew: false,
    thumbnail: "/templates/paper-petals.jpg",
    previewBg: "from-gray-50 via-white to-gray-100",
    colors: ["#1F2937", "#F3F4F6", "#6B7280"],
  },
  {
    id: "t009",
    name: "Celestial Dream",
    slug: "celestial-dream",
    price: 1199,
    tier: "Premium",
    religion: "Universal",
    themes: ["Modern", "Destination"],
    description: "A stunning dark navy invitation with twinkling stars, shooting star animations, and constellation art. For couples who are written in the stars.",
    features: ["Shooting star animations", "Live star field", "Countdown timer", "RSVP form", "WhatsApp share"],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNew: true,
    thumbnail: "/templates/celestial-dream.jpg",
    previewBg: "from-indigo-950 via-purple-950 to-slate-950",
    colors: ["#9370DB", "#C9A0FF", "#060818"],
  },
  {
    id: "t010",
    name: "Rustic Bloom",
    slug: "rustic-bloom",
    price: 799,
    tier: "Standard",
    religion: "Universal",
    themes: ["Traditional", "Destination"],
    description: "Warm terracotta tones, watercolor flowers, and Sacramento script give this template a charming outdoor barn wedding feel.",
    features: ["Watercolor florals", "Falling petal animation", "Countdown timer", "RSVP form", "WhatsApp share"],
    rating: 4.7,
    reviewCount: 62,
    isFeatured: true,
    isNew: true,
    thumbnail: "/templates/rustic-bloom.jpg",
    previewBg: "from-amber-50 via-orange-50 to-yellow-100",
    colors: ["#C4855A", "#8B4513", "#FDF5E8"],
  },
  {
    id: "t011",
    name: "Zen Garden",
    slug: "zen-garden",
    price: 999,
    tier: "Premium",
    religion: "Universal",
    themes: ["Modern", "Minimal"],
    description: "Japanese-inspired minimalism with cherry blossoms, ink brush strokes, red seal stamps, and Noto Serif typography. Elegant and deeply serene.",
    features: ["Ink brush strokes", "Cherry blossom accents", "Red seal stamp", "RSVP form", "WhatsApp share"],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: false,
    isNew: true,
    thumbnail: "/templates/zen-garden.jpg",
    previewBg: "from-stone-50 via-white to-red-50",
    colors: ["#CC2936", "#1A1A1A", "#FAFAF8"],
  },
  {
    id: "t012",
    name: "Midnight Rose",
    slug: "midnight-rose",
    price: 1299,
    tier: "Luxury",
    religion: "Universal",
    themes: ["Traditional", "Modern"],
    description: "Deep forest green with hand-painted gold roses and ornate corner flourishes. Dark, romantic, and unforgettable — perfect for evening celebrations.",
    features: ["Gold rose artwork", "Ornate corner frames", "Countdown timer", "RSVP form", "WhatsApp share"],
    rating: 4.9,
    reviewCount: 24,
    isFeatured: true,
    isNew: true,
    thumbnail: "/templates/midnight-rose.jpg",
    previewBg: "from-green-950 via-emerald-950 to-stone-950",
    colors: ["#B8860B", "#E8C97A", "#0A1A0A"],
  },
];

export const allReligions: Religion[] = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Universal",
];
export const allThemes: Theme[] = [
  "Traditional",
  "Modern",
  "Minimal",
  "Beach",
  "Royal",
  "Floral",
];
export const allTiers: Tier[] = ["Basic", "Premium", "Luxury"];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getFeaturedTemplates(): Template[] {
  return templates.filter((t) => t.isFeatured);
}