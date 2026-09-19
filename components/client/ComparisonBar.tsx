'use client';

import React from 'react';
import Image from 'next/image';
import { useComparison } from '@/context/ComparisonContext';
import { Swords, X, AlertCircle } from 'lucide-react';
import { getComparableFamily, getFamilyDisplayName } from '@/lib/duelEngine';

export const ComparisonBar: React.FC = () => {
  const {
    selectedProducts,
    clearSelection,
    toggleProduct,
    openModal,
    incompatibleNotice,
    replaceSelectionWith,
    clearIncompatibleNotice
  } = useComparison();

  if (selectedProducts.length === 0 && !incompatibleNotice) return null;

  const activeFamily = selectedProducts.length > 0 ? getComparableFamily(selectedProducts[0]) : null;
  const activeFamilyLabel = activeFamily ? getFamilyDisplayName(activeFamily).toLowerCase() : 'produit';

  return (
    <aside
      aria-label="Barre de comparaison de produits"
      className="fixed bottom-5 left-0 right-0 z-40 flex flex-col items-center gap-2 pointer-events-none px-4"
    >
      {/* INCOMPATIBLE WARNING TOAST */}
      {incompatibleNotice && (
        <div className="pointer-events-auto bg-amber-500/95 text-black px-4 py-2 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2.5 text-xs font-sans font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-lg text-balance">
          <AlertCircle size={15} className="shrink-0 text-black" />
          <span className="flex-1">{incompatibleNotice.message}</span>
          <button
            type="button"
            onClick={() => replaceSelectionWith(incompatibleNotice.blockedProduct)}
            className="underline font-bold hover:text-white transition-colors shrink-0 ml-1"
          >
            Changer
          </button>
          <button
            type="button"
            onClick={clearIncompatibleNotice}
            className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center shrink-0"
            aria-label="Fermer la notification"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="bg-foreground text-background rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.35)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-6 pointer-events-auto border border-border/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* THUMBNAILS */}
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2.5 items-center">
              {selectedProducts.map((p) => (
                <div key={p.id} className="relative group/thumb">
                  <div className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-white relative shadow-sm">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-foreground/40 font-mono">
                        ?
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProduct(p)}
                    aria-label={`Retirer ${p.name} du comparateur`}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-[10px]"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {selectedProducts.length === 1 && (
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-background/30 bg-white/10 flex items-center justify-center text-xs font-mono text-background/60">
                  +1
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm font-sans font-medium">
              <span className="font-bold text-primary font-mono">{selectedProducts.length}</span>
              <span className="text-background/60 font-mono">/2</span>
              <span className="hidden md:inline ml-1 text-background/80">
                {selectedProducts.length === 1
                  ? `(sélectionnez un 2e ${activeFamilyLabel})`
                  : 'sélectionnés pour le duel'}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-background/20" />

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs font-sans text-background/70 hover:text-white transition-colors px-2.5 py-1.5 rounded-full hover:bg-white/10"
            >
              Effacer
            </button>

            <button
              type="button"
              onClick={openModal}
              disabled={selectedProducts.length < 2}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-medium px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-md ${
                selectedProducts.length === 2
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] cursor-pointer'
                  : 'bg-white/15 text-background/40 cursor-not-allowed'
              }`}
            >
              <Swords size={15} />
              <span>Lancer le Duel</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
