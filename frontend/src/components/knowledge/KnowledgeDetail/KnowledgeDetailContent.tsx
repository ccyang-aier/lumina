"use client"

import * as React from "react"
import { KnowledgeContent } from "./KnowledgeContent"
import { CommentSection, CommentSectionRef } from "./CommentSection"
import { ActionButtons } from "./ActionButtons"

interface KnowledgeDetailContentProps {
  htmlContent: string
  articleId: string | number
}

export function KnowledgeDetailContent({ htmlContent, articleId }: KnowledgeDetailContentProps) {
  const commentSectionRef = React.useRef<CommentSectionRef>(null)

  return (
    <>
      {/* Markdown Content with Selection Features */}
      {htmlContent ? (
        <KnowledgeContent 
          content={htmlContent} 
          commentSectionRef={commentSectionRef}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">内容暂未收录，敬请期待。</p>
        </div>
      )}

      {/* Action Buttons */}
      <ActionButtons />

      {/* Comment Section */}
      <CommentSection ref={commentSectionRef} articleId={articleId} />
    </>
  )
}
