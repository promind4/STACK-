import React from 'react';
import { motion } from 'framer-motion';

// Composants de Logos stylisés pour imiter les officiels sans assets externes

const AmazonLogo = () => (
  <div className="flex flex-col items-start leading-none group select-none">
    <span className="font-sans font-bold text-3xl tracking-tight text-foreground/80 group-hover:text-black transition-colors">
      amazon
    </span>
    {/* La flèche sourire Amazon en SVG pur */}
    <svg viewBox="0 0 100 20" className="w-[80px] h-[15px] -mt-1 text-foreground/40 group-hover:text-[#FF9900] transition-colors fill-current">
      <path d="M98.6 8.7c-2.4-.7-5.5 1.5-5.5 1.5.1-.6-.8-1-1.3-.4-.5.6-.4 1.5.2 2.1 0 0 4.1 3.5 10.4 1.7.5-.2 1.1-.5 1-1.4-.2-1.2-2.4-2.8-4.8-3.5zM6.4 1.7C2.9 4.1 0 9.2 0 9.2s1-1.3 2.9-1.9c1.9-.6 3.6 1.4 3.6 1.4S6 3.9 6.4 1.7z" opacity="0.5"/>
      <path d="M10.3 12.8C22.6 17.5 45.4 18.6 66.8 15c4.8-.8 11-2.4 16.5-5.3.6-.3 1.2-1.2.3-1.8-.7-.4-1.6-.2-2.3.1-6.7 3.2-18.7 6.6-35.6 6.6-13 0-24.1-3.6-28.5-5.6-.7-.3-1.6-.4-2-.1-.5.3-.8.9-.4 1.5.8 1.1 2.8 2.1 5.5 2.4z"/>
    </svg>
  </div>
);

const ThomannLogo = () => (
  <div className="font-sans font-black text-2xl uppercase tracking-tighter text-foreground/70 group-hover:text-[#555] transition-colors transform -skew-x-6 select-none">
    Thomann
  </div>
);

const LdlcLogo = () => (
  <div className="font-mono font-bold text-2xl tracking-widest text-foreground/70 group-hover:text-[#333] transition-colors select-none">
    LDLC
  </div>
);

const WoodbrassLogo = () => (
  <div className="font-sans font-extrabold text-2xl tracking-tight text-foreground/70 group-hover:text-[#E30613] transition-colors select-none">
    woodbrass
  </div>
);

const MissNumeriqueLogo = () => (
  <div className="flex flex-col leading-none select-none text-foreground/70 group-hover:text-[#E84E8F] transition-colors">
    <span className="font-light text-xs uppercase tracking-[0.2em]">Miss</span>
    <span className="font-bold text-xl uppercase tracking-wider">Numerique</span>
  </div>
);

const MpbLogo = () => (
  <div className="flex items-center gap-1 font-sans font-black text-2xl text-foreground/70 group-hover:text-[#0070E0] transition-colors select-none">
    <div className="w-8 h-8 rounded-full border-4 border-current flex items-center justify-center text-xs">M</div>
    <span>MPB</span>
  </div>
);

const BRANDS = [
  { component: <ThomannLogo />, name: "Thomann" },
  { component: <LdlcLogo />, name: "LDLC" },
  { component: <MissNumeriqueLogo />, name: "Miss Numérique" },
  { component: <WoodbrassLogo />, name: "Woodbrass" },
  { component: <AmazonLogo />, name: "Amazon" },
  { component: <MpbLogo />, name: "MPB" },
];

export const LogoTicker: React.FC = () => {
  return (
    <section className="py-12 bg-secondary/30 border-y border-border/40 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-[1600px] relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            Prix analysés en temps réel sur les plus grandes boutiques
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="flex overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex gap-20 items-center flex-none pr-20"
            animate={{
              x: "-50%"
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* We double the array to create a seamless loop */}
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`} 
                className="group flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer scale-95 hover:scale-105"
              >
                {brand.component}
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};