"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    name: string;
    brand: string | null;
    mainImageUrl: string;
    galleryImages: string[];
}

export function ProductGallery({
    name,
    brand,
    mainImageUrl,
    galleryImages,
}: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(mainImageUrl);

    // Combine main and gallery images, removing duplicates
    const allImages = [
        mainImageUrl,
        ...galleryImages.filter((img) => img !== mainImageUrl),
    ];

    return (
        <div className="flex flex-col gap-4">
            <div
                className="rounded-2xl border border-border/40 shadow-sm p-8 md:p-12 flex items-center justify-center aspect-[4/3] relative overflow-hidden group transition-colors"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                {brand && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-secondary text-foreground text-xs font-mono rounded-full border border-border uppercase">
                            {brand}
                        </span>
                    </div>
                )}
                <Image
                    src={activeImage}
                    alt={`${name} – ${brand || "Test"} avis et meilleur prix | Fluxlab`}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-contain transition-all duration-300 ease-out group-hover:scale-105"
                    priority
                />
            </div>

            {/* Galerie Thumbnails */}
            {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`relative w-24 h-24 shrink-0 rounded-xl bg-white border p-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-primary ${activeImage === img
                                    ? "border-primary shadow-sm"
                                    : "border-border/50 hover:border-primary/50"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${name} – Vue ${idx + 1} | Fluxlab`}
                                fill
                                sizes="96px"
                                className={`object-contain transition-opacity ${activeImage === img ? "opacity-100" : "opacity-70 hover:opacity-100"
                                    }`}
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
