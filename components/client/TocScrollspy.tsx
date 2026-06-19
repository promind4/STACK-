'use client';

import { useEffect, useRef, useState } from 'react';

interface TocItem {
    id: string;
    label: string;
}

export default function TocScrollspy({ items }: { items: TocItem[] }) {
    const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (items.length === 0) return;

        const headingEls = items
            .map(item => document.getElementById(item.id))
            .filter(Boolean) as HTMLElement[];

        if (headingEls.length === 0) return;

        // Track which headings are visible; pick topmost one as active
        const visible = new Set<string>();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        visible.add(entry.target.id);
                    } else {
                        visible.delete(entry.target.id);
                    }
                });

                // Pick the first TOC item that's currently visible
                const next = items.find(item => visible.has(item.id));
                if (next) {
                    setActiveId(next.id);
                }
            },
            {
                // Heading enters "active zone" when between 15% and 80% from top
                rootMargin: '-15% 0px -75% 0px',
                threshold: 0,
            }
        );

        headingEls.forEach(el => observerRef.current!.observe(el));

        return () => observerRef.current?.disconnect();
    }, [items]);

    if (items.length === 0) {
        return <a href="#content" className="toc-link active">Introduction</a>;
    }

    return (
        <nav className="space-y-1" aria-label="Table des matières">
            {items.map(item => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`toc-link${activeId === item.id ? ' active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            setActiveId(item.id);
                        }
                    }}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
