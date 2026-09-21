import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? item.url : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="crumb">
        <ol className="crumb-list">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="crumb-item">
                {idx > 0 && <span className="crumb-separator" aria-hidden="true">/</span>}
                {isLast || !item.url ? (
                  <span className="crumb-current" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.url} className="crumb-link">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
