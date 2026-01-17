import React from 'react';
import { motion } from 'framer-motion';
import { VerticalType } from '../types';
import { VERTICAL_CONFIG } from '../constants';
import { ArrowUpRight } from 'lucide-react';

interface VerticalSelectorProps {
  onNavigate: (page: string, slug?: string) => void;
}

export const VerticalSelector: React.FC<VerticalSelectorProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-background relative" id="universes">
      <div className="container mx-auto px-6 max-w-[1600px]">
        
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ou naviguez par Univers</h2>
          <p className="text-muted-foreground">Une expérience sur mesure pour chaque type de créateur.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {Object.entries(VERTICAL_CONFIG).map(([key, config], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate('category', config.slug)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl border ${config.border} bg-secondary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full`}
            >
              {/* IMAGE HEADER */}
              <div className="h-48 md:h-56 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img 
                  src={config.image} 
                  alt={config.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Icon Badge overlapping image */}
                <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-border">
                  {config.icon}
                </div>
              </div>

              {/* CONTENT BODY */}
              <div className="p-8 flex flex-col flex-1 relative">
                {/* Decorative Gradient Background for Body */}
                <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-20`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    {config.subtitle}
                  </h4>
                  <h3 className={`text-2xl font-bold mb-4 ${config.accent}`}>
                    {config.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                    {config.description}
                  </p>

                  <div className="pt-6 border-t border-border/50 flex items-center justify-between group/btn">
                    <span className="text-sm font-bold text-foreground group-hover/btn:underline decoration-primary underline-offset-4 decoration-2">
                      Explorer le catalogue
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:border-primary transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};