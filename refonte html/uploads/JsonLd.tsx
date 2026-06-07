/**
 * JsonLd Server Component — injects structured data into HTML head.
 * Visible to crawlers without JavaScript execution.
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
