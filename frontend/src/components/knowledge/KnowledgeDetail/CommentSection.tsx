"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { 
  MessageSquare, 
  Heart, 
  Reply, 
  MoreHorizontal, 
  Send
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types
export interface CommentAuthor {
  name: string
  avatar?: string
  role?: "admin" | "author" | "user"
}

export interface Comment {
  id: string
  content: string
  author: CommentAuthor
  createdAt: Date
  likes: number
  isLiked: boolean
  replies: Comment[]
  parentId?: string
}

// Mock Data
const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    content: "这篇文章写得非常详细，对我帮助很大！特别是关于架构设计的部分，解决了我一直以来的困惑。",
    author: {
      name: "张三",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      role: "user"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        content: "同感，架构图画得很清晰。",
        author: {
          name: "李四",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
          role: "user"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        likes: 3,
        isLiked: true,
        replies: [],
        parentId: "1"
      }
    ]
  },
  {
    id: "2",
    content: "建议补充一下具体落地的案例，理论部分已经很完美了。",
    author: {
      name: "王五",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jude",
      role: "user"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 5,
    isLiked: false,
    replies: []
  }
]

// Components
interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string, content: string) => void
  onLike: (commentId: string) => void
  depth?: number
}

function CommentItem({ comment, onReply, onLike, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = React.useState(false)
  const [replyContent, setReplyContent] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return
    onReply(comment.id, replyContent)
    setIsReplying(false)
    setReplyContent("")
  }

  React.useEffect(() => {
    if (isReplying && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isReplying])

  return (
    <div className={cn("group animate-in fade-in slide-in-from-top-2 duration-300", depth > 0 && "mt-4")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border cursor-pointer">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground cursor-pointer hover:underline">
                {comment.author.name}
              </span>
              {comment.author.role === "author" && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium cursor-default">
                  作者
                </span>
              )}
              <span className="text-xs text-muted-foreground cursor-default">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: zhCN })}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <MoreHorizontal className="h-3 w-3" />
                  <span className="sr-only">更多操作</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">举报</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed break-words">
            {comment.content}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onLike(comment.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer",
                comment.isLiked 
                  ? "text-rose-500 hover:text-rose-600" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                 <Heart 
                    className={cn(
                      "w-3.5 h-3.5 transition-all", 
                      comment.isLiked && "fill-current scale-110"
                    )} 
                 />
                 {comment.isLiked && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-full bg-rose-500/20"
                    />
                 )}
              </div>
              <span>{comment.likes || "点赞"}</span>
            </motion.button>
            
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="w-3.5 h-3.5" />
              <span>回复</span>
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex gap-3">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      placeholder={`回复 @${comment.author.name}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] text-sm resize-none bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-foreground/10 focus-visible:border-foreground/20 transition-colors"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setIsReplying(false)
                          setReplyContent("")
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        size="sm"
                        className="cursor-pointer bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-100 disabled:bg-black disabled:text-white dark:disabled:bg-white dark:disabled:text-black"
                        onClick={handleSubmitReply}
                        disabled={!replyContent.trim()}
                      >
                        回复
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div className="pl-3 sm:pl-4 mt-3 ml-4 sm:ml-5 border-l-2 border-border/40">
           {comment.replies.map((reply) => (
             <CommentItem
               key={reply.id}
               comment={reply}
               onReply={onReply}
               onLike={onLike}
               depth={depth + 1}
             />
           ))}
        </div>
      )}
    </div>
  )
}

export function CommentSection() {
  const [comments, setComments] = React.useState<Comment[]>(MOCK_COMMENTS)
  const [newComment, setNewComment] = React.useState("")
  
  // Helper to update nested comments
  const updateComment = (
    list: Comment[], 
    id: string, 
    updater: (c: Comment) => Comment
  ): Comment[] => {
    return list.map((c) => {
      if (c.id === id) return updater(c)
      if (c.replies.length > 0) {
        return { ...c, replies: updateComment(c.replies, id, updater) }
      }
      return c
    })
  }
  
  // Helper to add reply
  const addReply = (list: Comment[], parentId: string, reply: Comment): Comment[] => {
    return list.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...c.replies, reply] }
      }
      if (c.replies.length > 0) {
        return { ...c, replies: addReply(c.replies, parentId, reply) }
      }
      return c
    })
  }

  const handleLike = (commentId: string) => {
    setComments((prev) => 
      updateComment(prev, commentId, (c) => ({
        ...c,
        likes: c.isLiked ? c.likes - 1 : c.likes + 1,
        isLiked: !c.isLiked
      }))
    )
  }

  const handleReply = (parentId: string, content: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        name: "我", // Mock current user
        avatar: "https://github.com/shadcn.png",
        role: "user"
      },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
      parentId
    }
    
    setComments((prev) => addReply(prev, parentId, newReply))
  }

  const handlePostComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: "我",
        avatar: "https://github.com/shadcn.png",
        role: "user"
      },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    }

    setComments((prev) => [comment, ...prev])
    setNewComment("")
  }

  const totalComments = React.useMemo(() => {
    const count = (list: Comment[]): number => {
      return list.reduce((acc, curr) => acc + 1 + count(curr.replies), 0)
    }
    return count(comments)
  }, [comments])

  return (
    <div className="mt-12 pt-8 border-t border-border/60" id="comments">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          评论 
          <span className="text-sm font-normal text-muted-foreground">
            ({totalComments})
          </span>
        </h2>
      </div>

      {/* Main Comment Input */}
      <div className="flex gap-4 mb-10">
        <Avatar className="h-10 w-10 border border-border hidden sm:block cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea 
            placeholder="写下你的想法..." 
            className="min-h-[100px] bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-foreground/10 focus-visible:border-foreground/20 transition-colors resize-y mb-3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handlePostComment} 
              disabled={!newComment.trim()}
              className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 cursor-pointer disabled:opacity-100 disabled:bg-black disabled:text-white dark:disabled:bg-white dark:disabled:text-black"
            >
              <Send className="w-4 h-4 mr-2" />
              发布评论
            </Button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
          />
        ))}
      </div>
      
      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-border/40 border-dashed">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>暂无评论，快来抢沙发吧！</p>
        </div>
      )}
    </div>
  )
}
