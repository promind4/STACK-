export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-background text-foreground animate-pulse">
            {/* HERO */}
            <div className="pt-28 pb-16 bg-background">
                <div className="container mx-auto px-6 max-w-[1400px]">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-4 w-12 bg-muted rounded" />
                        <div className="h-4 w-4 bg-muted rounded" />
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-4 w-4 bg-muted rounded" />
                        <div className="h-4 w-32 bg-muted rounded" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Image gallery */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-muted rounded-2xl" />
                            <div className="flex gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="w-20 h-20 bg-muted rounded-xl" />
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-6">
                            <div className="h-3 w-20 bg-muted rounded" />
                            <div className="h-8 w-full bg-muted rounded-lg" />
                            <div className="h-5 w-3/4 bg-muted/60 rounded" />
                            <div className="h-5 w-1/2 bg-muted/60 rounded" />
                            <div className="h-10 w-24 bg-muted rounded-lg" />
                            {/* Offers */}
                            <div className="space-y-3 pt-6 border-t border-border">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-16 bg-muted rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
