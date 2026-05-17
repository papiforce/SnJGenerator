import { useEffect, useRef, useState } from "react";

interface PreviewFrameProps {
  /** HTML rendu de la fiche (placeholders déjà résolus). */
  html: string;
}

const BASE = import.meta.env.BASE_URL;

const LINK_RE = /<link\b[^>]*\/?>/gi;
const STYLE_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;

interface HeadContent {
  links: string;
  styles: string;
  body: string;
}

function extractHeadTags(html: string): HeadContent {
  const links: string[] = [];
  const styles: string[] = [];

  let body = html.replace(LINK_RE, (match) => { links.push(match); return ""; });
  body = body.replace(STYLE_RE, (_match, content: string) => { styles.push(content); return ""; });

  return { links: links.join("\n"), styles: styles.join("\n"), body };
}

function buildDoc(html: string): string {
  const { links, styles, body } = extractHeadTags(html);
  return `<!doctype html>
<html lang="fr" data-theme="dark">
<head>
<meta charset="utf-8" />
<base href="${BASE}" />
${links}
<style id="snjg-dynamic-style">${styles}</style>
<link rel="stylesheet" href="${BASE}forum/design-system.css" />
<link rel="stylesheet" href="${BASE}forum/main.css" />
<style>body { margin: 0; padding: 24px; }</style>
</head>
<body>
${body}
</body>
</html>`;
}

function updatePreview(doc: Document, html: string) {
  const { styles, body: bodyHtml } = extractHeadTags(html);

  const styleEl = doc.getElementById("snjg-dynamic-style");
  if (styleEl && styleEl.textContent !== styles) {
    styleEl.textContent = styles;
  }

  const body = doc.body;
  body.style.visibility = "hidden";
  body.innerHTML = bodyHtml;
  body.getBoundingClientRect(); // force synchronous style recalc before reveal
  body.style.visibility = "";
}

export function PreviewFrame({ html }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [initialDoc] = useState(() => buildDoc(html));
  const htmlRef = useRef(html);
  const initialHtmlRef = useRef(html);
  const loadedRef = useRef(false);

  htmlRef.current = html;

  useEffect(() => {
    if (!loadedRef.current) return;
    const doc = iframeRef.current?.contentDocument;
    if (doc) updatePreview(doc, html);
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      className="app-preview-frame"
      title="Prévisualisation de la fiche"
      srcDoc={initialDoc}
      sandbox="allow-same-origin"
      onLoad={() => {
        loadedRef.current = true;
        if (htmlRef.current !== initialHtmlRef.current) {
          const doc = iframeRef.current?.contentDocument;
          if (doc) updatePreview(doc, htmlRef.current);
        }
      }}
    />
  );
}
