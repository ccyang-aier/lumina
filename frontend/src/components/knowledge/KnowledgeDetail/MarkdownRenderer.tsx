"use client";

import parse, { domToReact, Element, DOMNode } from "html-react-parser";
import { CodeBlock } from "./CodeBlock";
import styles from "./KnowledgeDetail.module.css";
import { useEffect } from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.name === "figure" && domNode.attribs["data-rehype-pretty-code-figure"] !== undefined) {
        // This is the figure wrapper from rehype-pretty-code
        // We need to find the <pre> inside it to get the raw code
        const preElement = domNode.children.find(
          (child): child is Element => child instanceof Element && child.name === "pre"
        );

        // Check for raw code on the figure itself (rehype-pretty-code often lifts it here)
        // OR check the pre element inside
        const rawCode = domNode.attribs["data-raw-code"] || (preElement && preElement.attribs["data-raw-code"]);

        if (rawCode) {
           return (
             <CodeBlock rawCode={decodeURIComponent(rawCode)} className="my-6">
               {domToReact(domNode.children as DOMNode[], options)}
             </CodeBlock>
           );
        }
      }
      
      // Fallback for pre elements if not wrapped in figure (though pretty-code usually wraps)
      if (domNode instanceof Element && domNode.name === "pre" && domNode.attribs["data-raw-code"]) {
          const rawCode = decodeURIComponent(domNode.attribs["data-raw-code"]);
          return (
             <CodeBlock rawCode={rawCode} className="my-6">
               {domToReact(domNode.children as DOMNode[], options)}
             </CodeBlock>
           );
      }
    },
  };

  return (
    <div id="markdown-content" className={`prose dark:prose-invert max-w-none ${styles.prose}`}>
      {parse(content, options)}
    </div>
  );
}
