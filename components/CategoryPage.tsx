import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ProductCard } from './ui/ProductCard';
// import { MOCK_PRODUCTS } from '../lib/mockData';
import { Filter, ChevronDown, Check, SearchX, X, SlidersHorizontal, Loader2, AlertTriangle, ChevronRight } from 'lucide-react';

import { useProducts } from '../hooks/useProducts';

interface CategoryPageProps {
  onNavigate: (page: string, slug?: string, query?: string) => void;
  categorySlug?: string;
  initialSearchQuery?: string;
}

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating';

const CATEGORY_METADATA: Record<string, { title: string; subtitle: string }> = {
  'audio': { title: 'Studio & Son', subtitle: 'Tout l\'équipement audio pour une qualité professionnelle.' },
  'video': { title: 'Image & Lumière', subtitle: 'Caméras, objectifs et éclairage pour sublimer vos contenus.' },
  'streaming': { title: 'Streaming', subtitle: 'Captation, régie et logiciels pour le direct.' },
  'microphones': { title: 'Microphones', subtitle: 'Le choix crucial pour une qualité audio professionnelle.' },
  'static-mics': { title: 'Microphones à Condensateur', subtitle: 'Précision et détails pour le studio (XLR).' },
  'dynamic-mics': { title: 'Microphones Dynamiques', subtitle: 'Robustesse et fiabilité pour la scène et le studio.' },
  'usb-mics': { title: 'Microphones USB', subtitle: 'La simplicité plug-and-play sans compromis.' },
  'audio-interfaces': { title: 'Interfaces Audio', subtitle: 'Le pont essentiel entre votre voix et l\'ordinateur.' },
  'cameras': { title: 'Caméras & Webcams', subtitle: 'Une qualité d\'image irréprochable pour vos contenus.' },
  'lighting': { title: 'Éclairage', subtitle: 'Sculptez votre image et créez votre ambiance.' },
  'streaming-gear': { title: 'Matériel de Streaming', subtitle: 'Stream Decks, cartes de capture et accessoires.' },
  'casques-studio': { title: 'Casques Studio', subtitle: 'Entendez chaque détail de votre mixage.' },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ onNavigate, categorySlug, initialSearchQuery }) => {
  const { products, loading, error } = useProducts(categorySlug);

  // -- STATE DECLARATIONS --
  const [priceRange, setPriceRange] = useState(15000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // --- METADATA DYNAMIQUE ---
  const { title, subtitle } = useMemo(() => {
    if (categorySlug && CATEGORY_METADATA[categorySlug]) {
      return CATEGORY_METADATA[categorySlug];
    }
    // Fallback intelligent si le slug existe mais n'est pas dans le dictionnaire
    if (categorySlug) {
      const formatName = categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { title: formatName, subtitle: 'Découvrez notre sélection spécialisée.' };
    }
    return {
      title: 'Le Catalogue Complet',
      subtitle: 'Tous nos équipements studio sélectionnés pour leur fiabilité.'
    };
  }, [categorySlug]);

  // --- FACETTES DYNAMIQUES ---
  const brandFacets = useMemo(() => {
    if (loading) return [];
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products, loading]);

  // -- DYNAMIC PRICE LOGIC --
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    const max = Math.max(...products.map(p => p.price));
    return Math.ceil(max + 500); // Max + 500 margin
  }, [products]);

  // Reset filters when category changes
  useEffect(() => {
    setPriceRange(maxPrice);
    setSearchQuery(initialSearchQuery || "");
    setSelectedBrands([]);
    setSelectedAvailability([]);
  }, [categorySlug, maxPrice, initialSearchQuery]);

  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIQUE DE FILTRAGE ---
  const filteredProducts = useMemo(() => {
    if (loading) return [];
    let result = products.filter(product => {
      const matchesPrice = product.price <= priceRange;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesAvailability = true;
      if (selectedAvailability.includes('stock') && !product.inStock) matchesAvailability = false;
      if (selectedAvailability.includes('promo') && !product.isPromo) matchesAvailability = false;

      return matchesPrice && matchesBrand && matchesAvailability && matchesSearch;
    });

    return result.sort((a, b) => {
      // ... sort existing ...
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // Relevance default
    });
  }, [products, loading, priceRange, selectedBrands, selectedAvailability, sortBy, searchQuery]);

  // ... existing brandToggle ...
  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]);
  };

  const toggleAvailability = (val: string) => {
    setSelectedAvailability(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  // ... sortLabel ...
  const sortLabel = {
    'relevance': 'Pertinence',
    'price_asc': 'Prix croissant',
    'price_desc': 'Prix décroissant',
    'rating': 'Avis clients'
  };


  const FilterContent = () => (
    <div className="space-y-8">

      {/* SEARCH INPUT */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase mb-4 text-muted-foreground tracking-widest">Recherche</h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Micro, Sony, Elgato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase mb-4 text-muted-foreground tracking-widest">Budget Max</h4>
        <div className="flex justify-between text-sm font-bold text-primary mb-3">
          <span>0€</span>
          <span className="bg-primary/10 px-2 py-0.5 rounded">{priceRange}€</span>
        </div>
        <input
          type="range"
          min="0" max={maxPrice} step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-secondary rounded-lg appearance-none accent-primary cursor-pointer"
        />
        <div className="mt-2 text-[10px] text-muted-foreground text-right italic">
          Max calculé : {maxPrice}€
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase mb-4 text-muted-foreground tracking-widest">Disponibilité</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedAvailability.includes('stock') ? 'bg-primary border-primary' : 'border-border bg-white'}`}>
              {selectedAvailability.includes('stock') && <Check className="w-3 h-3 text-white" />}
            </div>
            <input type="checkbox" className="hidden" onChange={() => toggleAvailability('stock')} checked={selectedAvailability.includes('stock')} />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">En Stock uniquement</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedAvailability.includes('promo') ? 'bg-primary border-primary' : 'border-border bg-white'}`}>
              {selectedAvailability.includes('promo') && <Check className="w-3 h-3 text-white" />}
            </div>
            <input type="checkbox" className="hidden" onChange={() => toggleAvailability('promo')} checked={selectedAvailability.includes('promo')} />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Promotions</span>
          </label>
        </div>
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

      <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setPriceRange(maxPrice); setSelectedBrands([]); setSelectedAvailability([]); setSearchQuery(""); }}>
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

          {/* FIL D'ARIANE (BREADCRUMB) */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors">Accueil</button>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <button
              onClick={() => onNavigate('category')}
              className={`hover:text-primary transition-colors ${!categorySlug ? 'font-bold text-foreground pointer-events-none' : ''}`}
            >
              Catalogue
            </button>
            {categorySlug && (
              <>
                <ChevronRight className="w-4 h-4 opacity-50" />
                <span className="font-bold text-foreground line-clamp-1">{title}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.div
                key={categorySlug || 'all'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-serif capitalize">{title}</h1>
                  {!loading && <span className="text-muted-foreground font-medium text-lg">({filteredProducts.length} produits)</span>}
                </div>
                <p className="text-sm md:text-lg text-muted-foreground font-light">{subtitle}</p>
              </motion.div>

              {/* Quick Links for Root Catalogue */}
              {!categorySlug && (
                <div className="flex flex-wrap gap-2 mt-6">
                  <Button variant="outline" size="sm" onClick={() => onNavigate('category', 'audio')}>Studio & Son</Button>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('category', 'video')}>Image & Lumière</Button>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('category', 'streaming')}>Streaming</Button>
                </div>
              )}
            </div>

            <div className="relative w-full md:w-auto">
              {/* Sort Menu ... */}
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

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center flex-col gap-4 text-center px-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-destructive font-bold">Impossible de charger les produits.</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : (
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
                  <Button variant="outline" onClick={() => { setPriceRange(15000); setSelectedBrands([]); }}>Réinitialiser les filtres</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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