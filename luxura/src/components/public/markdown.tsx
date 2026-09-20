import ReactMarkdown from "react-markdown";
import Link from "next/link";

/**
 * Renders CMS Markdown. react-markdown never emits raw HTML (it is escaped),
 * images are disallowed, and unsafe URL schemes such as javascript: are removed.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-lux">
      <ReactMarkdown
        disallowedElements={["img", "iframe", "script"]}
        unwrapDisallowed
        components={{
          a({ href, children }) {
            if (!href) return <>{children}</>;
            if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          h1: ({ children }) => <h2>{children}</h2>, // the page already has one h1
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
