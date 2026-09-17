'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-serif text-[#D3B27B] mb-4">Une erreur est survenue lors de l'affichage</h2>
      <p className="font-mono text-sm bg-black/60 p-4 rounded-xl max-w-2xl text-red-400 mb-6 border border-red-500/20 text-left overflow-auto">
        {error.message || 'Erreur inconnue'}
      </p>
      {error.stack && (
        <pre className="font-mono text-xs bg-black/40 p-4 rounded-xl max-w-3xl text-white/50 mb-6 text-left overflow-auto max-h-64">
          {error.stack}
        </pre>
      )}
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-[#D3B27B] text-[#0A0A0A] font-bold rounded-xl hover:bg-[#E0C28D] transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
