import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

/**
 * Server Component — renders breadcrumb navigation with proper <a> links.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav
            aria-label="Fil d'Ariane"
            className="container mx-auto px-6 py-4 max-w-[1400px]"
        >
            <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
