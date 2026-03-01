export default function ConfigurateurLoading() {
    return (
        <div className="min-h-screen bg-[#050505] text-white animate-pulse">
            <div className="pt-32 pb-40 min-h-screen container mx-auto px-6 max-w-5xl">
                {/* Progress dots */}
                <div className="mb-16 flex justify-center">
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/80 border border-white/5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-white/10" />
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-12 space-y-3">
                    <div className="h-10 w-72 bg-zinc-800 rounded-lg mx-auto" />
                    <div className="h-5 w-56 bg-zinc-800/60 rounded mx-auto" />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5" />
                            <div className="h-5 w-24 bg-zinc-800 rounded" />
                            <div className="h-3 w-full bg-zinc-800/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
