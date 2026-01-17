import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { 
  ShieldCheck, Target, Zap, 
  Cpu, HeartHandshake, PenTool 
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const VALUES = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Indépendance Radicale",
    desc: "Nous ne sommes sponsorisés par aucune marque. Si un micro à 50€ sonne mieux qu'un micro à 500€, nous le disons haut et fort."
  },
  {
    icon: <Cpu className="w-6 h-6 text-primary" />,
    title: "Intelligence Hybride",
    desc: "Nos recommandations combinent l'expérience réelle de créateurs et l'analyse de milliers de datas techniques par IA."
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-primary" />,
    title: "Pédagogie d'abord",
    desc: "Nous ne voulons pas juste que vous achetiez. Nous voulons que vous compreniez pourquoi ce setup est fait pour vous."
  }
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onNavigate={onNavigate} />

      {/* HERO SECTION - MANIFESTE */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-secondary/20">
        <div className="container mx-auto px-6 max-w-[1000px] text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              Notre Philosophie
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-10 text-foreground tracking-tight leading-tight font-serif">
              "La créativité ne devrait jamais être bloquée par un câble manquant ou un driver incompatible."
            </h1>
            <div className="h-1 w-24 bg-primary mx-auto mb-10 rounded-full" />
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Stackera est né d'un constat simple : le marché du matériel créatif est une jungle. 
              Trop de références, trop de marketing, pas assez de cohérence. 
              Nous avons construit l'outil que nous aurions rêvé d'avoir à nos débuts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            
            {/* Image Artistique */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-[4/5]"
            >
              <div className="absolute inset-0 bg-secondary rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1593697972496-85e784534888?auto=format&fit=crop&q=80&w=800" 
                  alt="Détail technique micro" 
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-xl border border-border shadow-2xl max-w-xs hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-primary" />
                  <span className="font-bold text-lg font-serif">Notre But</span>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Simplifier la tech pour libérer l'art.
                </p>
              </div>
            </motion.div>
            
            {/* Texte Editorial */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold mb-6 font-serif">L'Approche Stackera</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                <p>
                  Nous ne sommes pas un simple catalogue. Stackera est une <strong>intelligence de configuration</strong>. 
                </p>
                <p>
                  Chaque produit référencé sur notre plateforme a été analysé selon des critères stricts : rapport qualité/prix, durabilité, et surtout, <strong>compatibilité</strong>.
                </p>
                <p>
                  Nous croyons en la durabilité. Un bon micro s'achète pour 10 ans. Une bonne optique se garde toute une vie. Nous luttons contre l'obsolescence programmée en recommandant du matériel fiable et réparable.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="py-24 bg-[#F9F9F9] border-t border-border/50">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {VALUES.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-white rounded-2xl border border-border flex items-center justify-center mb-6 shadow-sm">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};