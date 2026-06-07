"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductDescriptionProps {
    htmlContent: string;
}

export function ProductDescription({ htmlContent }: ProductDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Height limit in pixels before we truncate
    const MAX_HEIGHT = 280;

    useEffect(() => {
        if (contentRef.current) {
            // Check if the content is taller than our limit
            if (contentRef.current.scrollHeight > MAX_HEIGHT) {
                setIsTruncated(true);
            }
        }
    }, [htmlContent]);

    return (
        <div className="relative mb-6">
            <div
                ref={contentRef}
                className={`text-base text-muted-foreground leading-relaxed font-light overflow-hidden transition-all duration-500 ease-in-out [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:mt-5 [&_h2]:mb-1.5 [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-foreground [&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-2 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:text-foreground [&_strong]:font-medium ${!isExpanded && isTruncated ? "max-h-[280px]" : "max-h-[5000px]"
                    }`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Fade Out Effect when truncated */}
            {!isExpanded && isTruncated && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            )}

            {/* Toggle Button */}
            {isTruncated && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex justify-center w-full mt-2 group focus:outline-none"
                    aria-expanded={isExpanded}
                >
                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/5 rounded-full hover:bg-primary/10 transition-colors">
                        {isExpanded ? (
                            <>
                                Réduire la description
                                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                            </>
                        ) : (
                            <>
                                Lire la suite
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                            </>
                        )}
                    </div>
                </button>
            )}
        </div>
    );
}
