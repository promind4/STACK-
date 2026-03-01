export default function GuidesLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground animate-pulse">
            {/* HERO */}
            <section className="pt-32 pb-20 bg-secondary/20">
                <div className="container mx-auto px-6 max-w-[1200px] text-center space-y-4">
                    <div className="h-4 w-32 bg-muted rounded mx-auto" />
                    <div className="h-12 w-96 bg-muted rounded-lg mx-auto" />
                    <div className="h-5 w-80 bg-muted/60 rounded mx-auto" />
                </div>
            </section>

            {/* FILTERS + GRID */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-12">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-8 w-20 bg-muted rounded-full" />
                        ))}
                    </div>
                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="aspect-[16/10] rounded-2xl bg-muted mb-6" />
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-3 w-16 bg-muted rounded" />
                                    <div className="h-3 w-16 bg-muted rounded" />
                                </div>
                                <div className="h-6 w-full bg-muted rounded mb-3" />
                                <div className="h-4 w-full bg-muted/60 rounded mb-1" />
                                <div className="h-4 w-3/4 bg-muted/60 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
