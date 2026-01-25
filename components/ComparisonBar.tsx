import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { Button } from './ui/Button';
import { X, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComparisonBarProps {
    onNavigate: (page: string, slug?: string) => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({ onNavigate }) => {
    const { selectedProducts, clearSelection, toggleProduct } = useComparison();

    if (selectedProducts.length === 0) return null;

    const handleLaunchVersus = () => {
        if (selectedProducts.length === 2) {
            const slug = `${selectedProducts[0].slug}-vs-${selectedProducts[1].slug}`;
            onNavigate('versus', slug);
            // Optional: don't clear selection so they can go back?
            // Or clear? Let's keep it.
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none"
            >
                <div className="bg-foreground text-background rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 pointer-events-auto border border-border/20">

                    {/* PRODUCT THUMBS / COUNT */}
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {selectedProducts.map(p => (
                                <img key={p.id} src={p.image_url} alt={p.name} className="w-10 h-10 rounded-full border-2 border-background object-cover bg-white" />
                            ))}
                            {selectedProducts.length < 2 && (
                                <div className="w-10 h-10 rounded-full border-2 border-dashed border-background/30 bg-white/10 flex items-center justify-center text-xs">
                                    ?
                                </div>
                            )}
                        </div>
                        <div className="text-sm font-medium">
                            <span className="font-bold text-primary">{selectedProducts.length}</span>/2
                            <span className="hidden sm:inline ml-1">sélectionnés</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-background/20" />

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className="text-background/70 hover:text-white hover:bg-white/10 rounded-full px-3"
                        >
                            Effacer
                        </Button>
                        <Button
                            variant={selectedProducts.length === 2 ? 'primary' : 'secondary'}
                            size="sm"
                            className="rounded-full shadow-lg"
                            disabled={selectedProducts.length < 2}
                            onClick={handleLaunchVersus}
                        >
                            <Swords className="w-4 h-4 mr-2" />
                            Lancer le Duel
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
