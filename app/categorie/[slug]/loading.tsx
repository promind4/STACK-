export default function CategoryLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground animate-pulse">
            {/* HEADER */}
            <div className="pt-32 pb-8 md:pb-12 border-b border-border bg-background">
                <div className="container mx-auto px-6 max-w-[1600px]">
                    {/* Breadcrumb skeleton */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-4 w-12 bg-muted rounded" />
                        <div className="h-4 w-4 bg-muted rounded" />
                        <div className="h-4 w-24 bg-muted rounded" />
                    </div>
                    {/* Title */}
                    <div className="h-10 w-64 bg-muted rounded-lg mb-3" />
                    <div className="h-5 w-96 bg-muted/60 rounded" />
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="container mx-auto px-6 max-w-[1600px] py-8 md:py-12">
                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <div className="h-10 w-48 bg-muted rounded-lg" />
                    <div className="h-10 w-40 bg-muted rounded-lg" />
                    <div className="ml-auto h-4 w-20 bg-muted rounded" />
                </div>
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col">
                            <div className="aspect-square bg-muted" />
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-3 w-16 bg-muted rounded" />
                                    <div className="h-4 w-10 bg-muted rounded" />
                                </div>
                                <div className="h-5 w-full bg-muted rounded" />
                                <div className="h-5 w-3/4 bg-muted rounded" />
                                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                                    <div className="h-6 w-16 bg-muted rounded" />
                                    <div className="h-4 w-12 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
