"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateBySlug } from "@/data/templates";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import MangalUtsav from "@/components/templates/MangalUtsav";
import EternalBloom from "@/components/templates/EternalBloom";
import AzureShore from "@/components/templates/AzureShore";
import NikahNazm from "@/components/templates/NikahNazm";
import OnyxGold from "@/components/templates/OnyxGold";
import AnandKaraj from "@/components/templates/AnandKaraj";
import SacredVows from "@/components/templates/SacredVows";
import PaperPetals from "@/components/templates/PaperPetals";
import CelestialDream from "@/components/templates/CelestialDream";
import RusticBloom from "@/components/templates/RusticBloom";
import ZenGarden from "@/components/templates/ZenGarden";
import MidnightRose from "@/components/templates/MidnightRose";
import RoyalDurbar from "@/components/templates/RoyalDurbar";
import UrbanChic from "@/components/templates/UrbanChic";
import TropicalParadise from "@/components/templates/TropicalParadise";
import IndianClassic from "@/components/templates/IndianClassic";
import { CoupleDetails } from "@/types/invite";

interface PreviewPageProps { params: Promise<{ id: string }>; }

const LIGHT_BG = ["eternal-bloom","sacred-vows","paper-and-petals","rustic-bloom","zen-garden","urban-chic"];

const WatermarkOverlay = ({ lightBg=false }: { lightBg?:boolean }) => (
  <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden select-none" aria-hidden="true">
    {Array.from({length:14}).map((_,row) => Array.from({length:10}).map((_,col) => (
      <div key={`${row}-${col}`} className="absolute" style={{ top:`${row*140-40}px`, left:`${col*260-20}px`, transform:"rotate(-35deg)" }}>
        <span style={{ display:"block", fontSize:22, fontWeight:700, letterSpacing:"0.2em", whiteSpace:"nowrap", color:"#000", opacity:lightBg?0.12:0.05 }}>WEDCRAFT PREVIEW</span>
        <span style={{ display:"block", fontSize:22, fontWeight:700, letterSpacing:"0.2em", whiteSpace:"nowrap", color:"#fff", opacity:lightBg?0.04:0.12, marginTop:-26 }}>WEDCRAFT PREVIEW</span>
      </div>
    )))}
    <div className="fixed top-20 left-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm z-30">🔒 Preview Mode</div>
  </div>
);

const hinduDemo: CoupleDetails = { groomName:"Aravind", brideName:"Aarathi", weddingDate:"2026-12-12", weddingTime:"7:00 PM", venue:"Grand Palace Banquet Hall", venueAddress:"NH-16, Bayyavaram, Anakapalli", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Two souls, one heartbeat.", events:[{name:"Mehendi & Haldi",date:"2026-12-10",time:"4:00 PM",venue:"Bride's Residence"},{name:"Sangeet Night",date:"2026-12-11",time:"7:00 PM",venue:"Grand Palace Hall B"},{name:"Wedding Ceremony",date:"2026-12-12",time:"7:00 PM",venue:"Grand Palace Main Hall"}] };
const modernDemo: CoupleDetails = { groomName:"Arjun", brideName:"Meera", weddingDate:"2026-11-20", weddingTime:"5:30 PM", venue:"The Ivy Gardens", venueAddress:"12 Blossom Lane, Bangalore", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Two hearts, one love.", events:[{name:"Bridal Shower",date:"2026-11-18",time:"3:00 PM",venue:"Bride's Home"},{name:"Cocktail Evening",date:"2026-11-19",time:"6:00 PM",venue:"The Ivy Terrace"},{name:"Wedding Ceremony",date:"2026-11-20",time:"5:30 PM",venue:"The Ivy Gardens"}] };
const beachDemo: CoupleDetails = { groomName:"Kiran", brideName:"Nadia", weddingDate:"2027-01-15", weddingTime:"4:00 PM", venue:"Tide & Palms Beach Resort", venueAddress:"Beachfront Road, Goa", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"With the ocean as our witness.", events:[{name:"Welcome Sundowner",date:"2027-01-14",time:"6:00 PM",venue:"Pool Deck"},{name:"Beach Ceremony",date:"2027-01-15",time:"4:00 PM",venue:"Beachfront Gazebo"},{name:"Reception Dinner",date:"2027-01-15",time:"8:00 PM",venue:"Palm Garden"}] };
const nikahDemo: CoupleDetails = { groomName:"Zaid", brideName:"Ayesha", weddingDate:"2026-10-10", weddingTime:"11:00 AM", venue:"Al Noor Convention Hall", venueAddress:"Banjara Hills, Hyderabad", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"And of His signs is that He created for you mates.", events:[{name:"Nikah Ceremony",date:"2026-10-10",time:"11:00 AM",venue:"Al Noor Convention Hall"},{name:"Walima Reception",date:"2026-10-11",time:"7:00 PM",venue:"Al Noor Banquet"}] };
const luxuryDemo: CoupleDetails = { groomName:"Rohan", brideName:"Ananya", weddingDate:"2027-02-14", weddingTime:"7:30 PM", venue:"The Leela Palace", venueAddress:"MG Road, Bengaluru", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"To love and be loved is everything.", events:[{name:"Cocktail Reception",date:"2027-02-14",time:"6:00 PM",venue:"The Leela Terrace"},{name:"Wedding Ceremony",date:"2027-02-14",time:"7:30 PM",venue:"The Grand Ballroom"}] };
const sikhDemo: CoupleDetails = { groomName:"Harpreet", brideName:"Simran", weddingDate:"2026-11-05", weddingTime:"10:00 AM", venue:"Guru Nanak Darbar Gurdwara", venueAddress:"Sector 17, Chandigarh", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"With Waheguru's blessings.", events:[{name:"Vatna Ceremony",date:"2026-11-04",time:"5:00 PM",venue:"Groom's Residence"},{name:"Anand Karaj",date:"2026-11-05",time:"10:00 AM",venue:"Guru Nanak Darbar Gurdwara"},{name:"Reception",date:"2026-11-05",time:"7:00 PM",venue:"Celebration Banquet"}] };
const christianDemo: CoupleDetails = { groomName:"Thomas", brideName:"Grace", weddingDate:"2027-03-20", weddingTime:"3:00 PM", venue:"St. Mary's Church", venueAddress:"Church Road, Kochi", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"In God's grace, two hearts become one.", events:[{name:"Holy Matrimony",date:"2027-03-20",time:"3:00 PM",venue:"St. Mary's Church"},{name:"Reception Dinner",date:"2027-03-20",time:"7:00 PM",venue:"Royal Garden Convention"}] };
const minimalDemo: CoupleDetails = { groomName:"Vikram", brideName:"Priya", weddingDate:"2026-09-15", weddingTime:"6:00 PM", venue:"The Studio, Bangalore", venueAddress:"Indiranagar, Bangalore", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Simple. Beautiful. Ours.", events:[{name:"Wedding Ceremony",date:"2026-09-15",time:"6:00 PM",venue:"The Studio"},{name:"Dinner Reception",date:"2026-09-15",time:"8:00 PM",venue:"The Rooftop"}] };
const celestialDemo: CoupleDetails = { groomName:"Aryan", brideName:"Luna", weddingDate:"2027-01-20", weddingTime:"8:00 PM", venue:"Skyview Terrace, Coorg", venueAddress:"Hilltop, Coorg, Karnataka", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Two souls, aligned by the universe.", events:[{name:"Stargazing Cocktails",date:"2027-01-20",time:"7:00 PM",venue:"Observatory Deck"},{name:"Celestial Ceremony",date:"2027-01-20",time:"8:00 PM",venue:"Skyview Terrace"}] };
const rusticDemo: CoupleDetails = { groomName:"Aarav", brideName:"Kavya", weddingDate:"2026-10-25", weddingTime:"5:00 PM", venue:"The Farmhouse at Sunset", venueAddress:"Old Bangalore Road, Mysore", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Beneath the open sky, two hearts become one.", events:[{name:"Phoolon Ki Holi",date:"2026-10-24",time:"4:00 PM",venue:"The Garden"},{name:"Wedding Ceremony",date:"2026-10-25",time:"5:00 PM",venue:"The Farmhouse Lawn"}] };
const zenDemo: CoupleDetails = { groomName:"Kenji", brideName:"Sakura", weddingDate:"2026-08-08", weddingTime:"3:00 PM", venue:"The Japanese Garden, Lalbagh", venueAddress:"Lalbagh Botanical Garden, Bangalore", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"In the stillness of this moment, two paths become one.", events:[{name:"Tea Ceremony",date:"2026-08-08",time:"2:00 PM",venue:"The Pavilion"},{name:"Wedding Ceremony",date:"2026-08-08",time:"3:00 PM",venue:"The Japanese Garden"}] };
const midnightDemo: CoupleDetails = { groomName:"Sebastian", brideName:"Rosalind", weddingDate:"2027-02-07", weddingTime:"7:00 PM", venue:"The Rose Manor, Coonoor", venueAddress:"Coonoor, Nilgiris, Tamil Nadu", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Like a rose that blooms in the darkest night.", events:[{name:"Cocktail Evening",date:"2027-02-07",time:"6:00 PM",venue:"The Rose Garden"},{name:"Wedding Ceremony",date:"2027-02-07",time:"7:00 PM",venue:"The Grand Manor"}] };
const royalDemo: CoupleDetails = { groomName:"Nawab", brideName:"Begum", weddingDate:"2026-12-20", weddingTime:"7:30 PM", venue:"Falaknuma Palace", venueAddress:"Engine Bowli, Hyderabad", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Two families, one royal celebration.", events:[{name:"Mehndi Raat",date:"2026-12-18",time:"6:00 PM",venue:"Palace Garden"},{name:"Nikah / Shaadi",date:"2026-12-20",time:"7:30 PM",venue:"Falaknuma Palace"},{name:"Walima / Reception",date:"2026-12-21",time:"8:00 PM",venue:"The Durbar Hall"}] };
const urbanDemo: CoupleDetails = { groomName:"Kabir", brideName:"Aisha", weddingDate:"2027-03-15", weddingTime:"6:00 PM", venue:"The Oberoi", venueAddress:"Dr. Zakir Hussain Marg, New Delhi", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Not a fairy tale. The real thing — and it's better.", events:[{name:"Cocktail Hour",date:"2027-03-15",time:"5:00 PM",venue:"The Lobby Lounge"},{name:"Wedding Ceremony",date:"2027-03-15",time:"6:00 PM",venue:"The Grand Ballroom"},{name:"After Party",date:"2027-03-15",time:"10:00 PM",venue:"The Oberoi Rooftop"}] };
const tropicalDemo: CoupleDetails = { groomName:"Surya", brideName:"Marina", weddingDate:"2027-02-22", weddingTime:"4:30 PM", venue:"Emerald Isle Beach Resort", venueAddress:"Cherai Beach, Kochi", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"Love found us where the ocean meets the sky.", events:[{name:"Welcome Sundowner",date:"2027-02-21",time:"6:00 PM",venue:"Pool Deck"},{name:"Beach Ceremony",date:"2027-02-22",time:"4:30 PM",venue:"Beachfront"},{name:"Tropical Reception",date:"2027-02-22",time:"8:00 PM",venue:"The Palm Pavilion"}] };
const classicDemo: CoupleDetails = { groomName:"Murugan", brideName:"Meenakshi", weddingDate:"2026-11-14", weddingTime:"9:00 AM", venue:"Kapaleeshwarar Temple Hall", venueAddress:"Mylapore, Chennai", mapLink:"https://maps.google.com", phone:"+919876543210", personalMessage:"மங்கள நிகழ்வில் கலந்து கொள்ளுமாறு அன்புடன் அழைக்கிறோம்.", events:[{name:"Naandi & Puja",date:"2026-11-13",time:"6:00 AM",venue:"Family Home"},{name:"Thirumanam",date:"2026-11-14",time:"9:00 AM",venue:"Kapaleeshwarar Temple Hall"},{name:"Reception",date:"2026-11-14",time:"7:00 PM",venue:"Devathatchan Kalyana Mahal"}] };

function getPreview(slug: string) {
  switch(slug) {
    case "mangal-utsav":      return <MangalUtsav couple={hinduDemo}/>;
    case "eternal-bloom":     return <EternalBloom couple={modernDemo}/>;
    case "azure-shore":       return <AzureShore couple={beachDemo}/>;
    case "nikah-nazm":        return <NikahNazm couple={nikahDemo}/>;
    case "onyx-and-gold":     return <OnyxGold couple={luxuryDemo}/>;
    case "anand-karaj":       return <AnandKaraj couple={sikhDemo}/>;
    case "sacred-vows":       return <SacredVows couple={christianDemo}/>;
    case "paper-and-petals":  return <PaperPetals couple={minimalDemo}/>;
    case "celestial-dream":   return <CelestialDream couple={celestialDemo}/>;
    case "rustic-bloom":      return <RusticBloom couple={rusticDemo}/>;
    case "zen-garden":        return <ZenGarden couple={zenDemo}/>;
    case "midnight-rose":     return <MidnightRose couple={midnightDemo}/>;
    case "royal-durbar":      return <RoyalDurbar couple={royalDemo}/>;
    case "urban-chic":        return <UrbanChic couple={urbanDemo}/>;
    case "tropical-paradise": return <TropicalParadise couple={tropicalDemo}/>;
    case "indian-classic":    return <IndianClassic couple={classicDemo}/>;
    default:                  return <MangalUtsav couple={hinduDemo}/>;
  }
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  const template = getTemplateBySlug(id);
  if (!template) notFound();
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-4 h-[72px]">
        <Link href="/catalog" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors shrink-0"><ArrowLeft size={16}/> Back</Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{template.name}</p>
          <div className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400"/><span className="text-xs text-gray-500">{template.rating} · {template.reviewCount} reviews</span></div>
        </div>
        <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full shrink-0">🔒 Watermarked preview</span>
      </div>
      <WatermarkOverlay lightBg={LIGHT_BG.includes(id)}/>
      <div onContextMenu={e=>e.preventDefault()}>{getPreview(id)}</div>
      <motion.div initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.6,type:"spring",stiffness:200}} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500">{template.name} · {template.tier}</p>
            <p className="text-xl font-bold text-gray-900">₹{template.price.toLocaleString("en-IN")}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {["No watermark","Live URL","WhatsApp share"].map(f=><span key={f} className="text-xs text-emerald-700 flex items-center gap-0.5"><Check size={10}/> {f}</span>)}
            </div>
          </div>
          <Link href={`/checkout/${template.slug}`} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all shrink-0"><ShoppingCart size={16}/> Buy Now</Link>
        </div>
      </motion.div>
      <div className="h-32"/>
    </div>
  );
}