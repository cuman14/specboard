import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 text-2xl font-bold leading-tight text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-5 text-xl font-semibold leading-tight text-foreground/90">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-semibold leading-tight text-foreground/80">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-text">{children}</p>
  ),
  li: ({ children }) => (
    <li className="mb-1 leading-relaxed text-text">{children}</li>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-high px-2 py-0.5 font-mono text-sm text-primary">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded bg-surface p-4">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  a: ({ children, href, ...props }) => (
    <a href={href} className="text-primary underline" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-primary pl-4 text-text-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-border" />,
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="font-sans text-text">
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
