export default function GuideLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground animate-pulse">
            {/* HEADER */}
            <header className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-[1000px]">
                    <div className="mb-8 space-y-4">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-3 w-20 bg-muted rounded" />
                            <div className="w-1 h-1 bg-muted rounded-full" />
                            <div className="h-3 w-16 bg-muted rounded" />
                        </div>
                        <div className="h-12 w-full bg-muted rounded-lg" />
                        <div className="h-12 w-3/4 bg-muted rounded-lg" />
                        <div className="flex items-center gap-6 border-y border-border py-4">
                            <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                    </div>
                </div>
                {/* Cover image */}
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="aspect-[21/9] rounded-3xl bg-muted" />
                </div>
            </header>

            {/* CONTENT */}
            <div className="container mx-auto px-6 max-w-[1200px] pb-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    <main className="lg:w-2/3 space-y-4">
                        <div className="h-4 w-full bg-muted/60 rounded" />
                        <div className="h-4 w-full bg-muted/60 rounded" />
                        <div className="h-4 w-5/6 bg-muted/60 rounded" />
                        <div className="h-4 w-full bg-muted/60 rounded" />
                        <div className="h-4 w-4/5 bg-muted/60 rounded" />
                        <div className="h-8 w-64 bg-muted rounded-lg mt-8" />
                        <div className="h-4 w-full bg-muted/60 rounded" />
                        <div className="h-4 w-full bg-muted/60 rounded" />
                        <div className="h-4 w-3/4 bg-muted/60 rounded" />
                    </main>
                    <aside className="lg:w-1/3">
                        <div className="bg-secondary/30 border border-border rounded-2xl p-6 space-y-4">
                            <div className="h-5 w-40 bg-muted rounded" />
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-14 bg-white rounded-xl border border-border" />
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
