import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ProductCard } from './ui/ProductCard';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { Filter, ChevronDown, Check, SearchX, X, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  onNavigate: (page: string, slug?: string) => void;
  categorySlug?: string;
}

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating';

export const CategoryPage: React.FC<CategoryPageProps> = ({ onNavigate, categorySlug }) => {
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // --- FACETTES DYNAMIQUES ---
  const brandFacets = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_PRODUCTS.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(product => {
      const matchesPrice = product.price <= priceRange;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      
      let matchesAvailability = true;
      if (selectedAvailability.includes('stock') && !product.inStock) matchesAvailability = false;
      if (selectedAvailability.includes('promo') && !product.isPromo) matchesAvailability = false;

      return matchesPrice && matchesBrand && matchesAvailability;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [priceRange, selectedBrands, selectedAvailability, sortBy]);

  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]);
  };

  const sortLabel = {
    'relevance': 'Pertinence',
    'price_asc': 'Prix croissant',
    'price_desc': 'Prix décroissant',
    'rating': 'Avis clients'
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase mb-4 text-muted-foreground tracking-widest">Budget Max</h4>
        <div className="flex justify-between text-sm font-bold text-primary mb-3">
          <span>0€</span>
          <span className="bg-primary/10 px-2 py-0.5 rounded">{priceRange}€</span>
        </div>
        <input 
          type="range" 
          min="0" max="3000" step="50" 
          value={priceRange} 
          onChange={(e) => setPriceRange(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-secondary rounded-lg appearance-none accent-primary cursor-pointer" 
        />
      </div>

      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase mb-4 text-muted-foreground tracking-widest">Marques</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {brandFacets.map((brand) => (
            <div key={brand.name} onClick={() => toggleBrand(brand.name)} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedBrands.includes(brand.name) ? 'bg-primary border-primary shadow-sm' : 'border-border group-hover:border-primary/50 bg-white'}`}>
                  {selectedBrands.includes(brand.name) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm transition-colors ${selectedBrands.includes(brand.name) ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{brand.name}</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground/50">{brand.count}</span>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setPriceRange(3000); setSelectedBrands([]); }}>
        Réinitialiser
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onNavigate={onNavigate} />
      
      {/* HEADER PAGE */}
      <div className="pt-32 pb-8 md:pb-12 border-b border-border bg-background">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight font-serif">Le Catalogue</h1>
              <p className="text-sm md:text-lg text-muted-foreground font-light">Matériel sélectionné pour sa fiabilité et sa performance.</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <button 
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-border hover:border-primary/50 transition-all w-full md:w-56 justify-between shadow-sm"
              >
                <span className="text-sm">Trier : <strong>{sortLabel[sortBy]}</strong></span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 top-full mt-2 w-full md:w-48 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    {(Object.keys(sortLabel) as SortOption[]).map((option) => (
                      <button key={option} onClick={() => { setSortBy(option); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors flex items-center justify-between ${sortBy === option ? 'font-bold text-primary' : ''}`}>
                        {sortLabel[option]} {sortBy === option && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-[1600px] py-8 md:py-12">
        
        {/* MOBILE FILTER TRIGGER */}
        <div className="md:hidden flex items-center justify-between mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-border sticky top-24 z-30 shadow-sm">
           <button 
             onClick={() => setIsFilterDrawerOpen(true)}
             className="flex items-center gap-2 font-bold text-sm text-foreground"
           >
             <SlidersHorizontal className="w-4 h-4 text-primary" /> Filtres
             {selectedBrands.length > 0 && <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">{selectedBrands.length}</span>}
           </button>
           <span className="text-xs font-bold text-muted-foreground">{filteredProducts.length} produits</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR FILTERS (DESKTOP) */}
          <aside className="hidden md:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-border sticky top-28 shadow-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-border pb-4">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Affiner</h3>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={(slug) => onNavigate('product', slug)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-secondary/20 rounded-3xl border border-dashed border-border px-6">
                <SearchX className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2 font-serif">Aucun produit trouvé</h3>
                <p className="text-muted-foreground mb-8 max-w-sm font-light">Désolé, nous n'avons pas trouvé de matériel correspondant à vos critères de recherche.</p>
                <Button variant="outline" onClick={() => { setPriceRange(3000); setSelectedBrands([]); }}>Réinitialiser les filtres</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsFilterDrawerOpen(false)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="absolute top-0 left-0 h-full w-[85%] bg-background p-6 shadow-2xl flex flex-col"
            >
               <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                  <h3 className="font-bold text-lg font-serif">Filtres</h3>
                  <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 bg-secondary rounded-full">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto">
                  <FilterContent />
               </div>

               <div className="pt-6 border-t border-border mt-auto">
                  <Button variant="primary" className="w-full" onClick={() => setIsFilterDrawerOpen(false)}>
                    Voir les {filteredProducts.length} résultats
                  </Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};