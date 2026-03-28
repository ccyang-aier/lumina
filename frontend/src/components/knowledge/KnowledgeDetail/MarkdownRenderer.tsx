"use client";

import parse, { domToReact, Element, DOMNode } from "html-react-parser";
import { CodeBlock } from "./CodeBlock";
import { ClickableImage } from "./CommentSection";
import styles from "./KnowledgeDetail.module.css";
import { useEffect } from "react";
import { Info, Lightbulb, AlertTriangle, OctagonX, CheckCircle, Flame } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

const ALERT_CONFIG: Record<string, { icon: any, title: string, classNameKey: string }> = {
  NOTE: { icon: Info, title: "Note", classNameKey: "alert-note" },
  TIP: { icon: Lightbulb, title: "Tip", classNameKey: "alert-tip" },
  IMPORTANT: { icon: Flame, title: "Important", classNameKey: "alert-important" },
  WARNING: { icon: AlertTriangle, title: "Warning", classNameKey: "alert-warning" },
  CAUTION: { icon: OctagonX, title: "Caution", classNameKey: "alert-caution" },
  INFO: { icon: Info, title: "Info", classNameKey: "alert-info" },
  ERROR: { icon: OctagonX, title: "Error", classNameKey: "alert-error" },
  SUCCESS: { icon: CheckCircle, title: "Success", classNameKey: "alert-success" },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const options = {
    replace: (domNode: DOMNode) => {
      // 1. Handle Blockquotes / Alerts
      if (domNode instanceof Element && domNode.name === "blockquote") {
        // Find the first paragraph element, skipping whitespace text nodes
        const firstP = domNode.children.find(
          (child): child is Element => child instanceof Element && child.name === "p"
        );

        // Determine alert type: check for [!TYPE] tag, default to INFO
        let resolvedType = "INFO";
        if (firstP && firstP.children.length > 0) {
          const firstChild = firstP.children[0] as any;
          if (firstChild.type === "text" && firstChild.data) {
            const match = firstChild.data.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|ERROR|SUCCESS)\]/i);
            if (match) {
              resolvedType = match[1].toUpperCase();
              // Remove the [!TYPE] tag from the text
              firstChild.data = firstChild.data.replace(match[0], "").trim();
            }
          }
        }

        const config = ALERT_CONFIG[resolvedType] || ALERT_CONFIG.INFO;
        const Icon = config.icon;

        // Get styles from CSS modules
        const alertClass = styles.alert || "alert";
        const variantClass = styles[config.classNameKey] || config.classNameKey;
        const iconClass = styles["alert-icon"] || "alert-icon";
        const contentClass = styles["alert-content"] || "alert-content";

        return (
          <div className={`${alertClass} ${variantClass}`}>
            <Icon className={iconClass} />
            <div className={contentClass}>
              {domToReact(domNode.children as DOMNode[], options)}
            </div>
          </div>
        );
      }

      // 2. Handle Code Blocks
      if (domNode instanceof Element && domNode.name === "figure" && domNode.attribs["data-rehype-pretty-code-figure"] !== undefined) {
        const preElement = domNode.children.find(
          (child): child is Element => child instanceof Element && child.name === "pre"
        );
        const rawCode = domNode.attribs["data-raw-code"] || (preElement && preElement.attribs["data-raw-code"]);
        const language = preElement?.attribs["data-language"] || "plaintext";

        if (rawCode) {
           return (
             <CodeBlock rawCode={decodeURIComponent(rawCode)} language={language} className="my-6">
               {domToReact(domNode.children as DOMNode[], options)}
             </CodeBlock>
           );
        }
      }
      
      // Fallback for pre elements if not wrapped in figure
      if (domNode instanceof Element && domNode.name === "pre" && domNode.attribs["data-raw-code"]) {
          const rawCode = decodeURIComponent(domNode.attribs["data-raw-code"]);
          const language = domNode.attribs["data-language"] || "plaintext";
          return (
             <CodeBlock rawCode={rawCode} language={language} className="my-6">
               {domToReact(domNode.children as DOMNode[], options)}
             </CodeBlock>
           );
      }
      
      // 3. Handle Images - Make them clickable to zoom
      if (domNode instanceof Element && domNode.name === "img") {
        const src = domNode.attribs["src"];
        const alt = domNode.attribs["alt"] || "";
        if (src) {
          return (
            <ClickableImage 
              src={src} 
              alt={alt} 
              className="rounded-lg border border-border max-w-full h-auto"
            />
          );
        }
      }
    },
  };

  return (
    <div id="markdown-content" className={`prose dark:prose-invert max-w-none ${styles.prose}`}>
      {parse(content, options)}
    </div>
  );
}
