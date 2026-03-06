"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LetterGlitch from "@/components/reactbits/LetterGlitch";
import { cn } from "@/lib/utils";
import { Eye, Heart, BookOpen, ChevronRight, FileText, MessageCircleQuestion, Coffee, Terminal } from "lucide-react";
import Image from "next/image";

export interface KnowledgeCardProps {
  id: number | string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  domain?: string;
  type: "document" | "tutorial" | "faq" | "talk" | "script";
  author: {
    name: string;
    avatar?: string;
    guild?: string;
  };
  publishDate: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  location?: {
    series: string;
    chapter: string;
  };
  className?: string;
}

// 随机生成渐变色
const gradients = [
  "from-blue-500/20 via-violet-500/20 to-fuchsia-500/20",
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
  "from-rose-500/20 via-pink-500/20 to-purple-500/20",
];

const getGradient = (id: number | string) => {
  const index = typeof id === 'number' ? id : parseInt(id.toString(), 10) || 0;
  return gradients[index % gradients.length];
};

const typeMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  document: { label: "文档", color: "bg-blue-500/80", icon: FileText },
  tutorial: { label: "教程", color: "bg-emerald-500/80", icon: BookOpen },
  faq: { label: "FAQ", color: "bg-orange-500/80", icon: MessageCircleQuestion },
  talk: { label: "杂谈", color: "bg-violet-500/80", icon: Coffee },
  script: { label: "脚本", color: "bg-slate-500/80", icon: Terminal },
};

export function KnowledgeCard({
  id,
  title,
  description,
  image,
  tags,
  domain,
  type,
  author,
  publishDate,
  stats,
  location,
  className,
}: KnowledgeCardProps) {
  const gradient = getGradient(id);

  return (
    <Link href={`/knowledge/${id}`} className={cn("w-full h-[200px] group cursor-pointer block", className)}>
      <div className="relative flex flex-row h-full w-full overflow-hidden rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        
        {/* Left: Image Container */}
        <div className="relative w-[240px] h-full shrink-0 overflow-hidden bg-muted">
          {image ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
             <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
                <LetterGlitch
                  glitchSpeed={50}
                  centerVignette={false}
                  outerVignette={false}
                  smooth={true}
                  backgroundColor="transparent"
                  className=""
                />
                <div className={cn("absolute inset-0 w-full h-full z-20 pointer-events-none mix-blend-overlay opacity-20", gradient)} />
             </div>
          )}
          
          {/* Domain Badge - Top Left */}
          {domain && (
            <div className="absolute top-3 left-3 flex items-center justify-center px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white shadow-sm">
              {domain}
            </div>
          )}

           {/* Type Icon Overlay */}
           {type && typeMap[type] && (
             <div className={cn(
               "absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm text-white",
               typeMap[type].color
             )}>
                {React.createElement(typeMap[type].icon, { className: "w-3 h-3" })}
                <span className="text-[10px] font-medium">{typeMap[type].label}</span>
             </div>
           )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col p-5 min-w-0 relative">
          
          {/* ID Badge */}
          <span className="absolute top-5 right-5 font-mono text-[10px] text-muted-foreground/50">
            #{String(id).padStart(5, '0')}
          </span>

          {/* Header: Location */}
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate mb-2 pr-12">
              <span className="hover:text-foreground transition-colors cursor-pointer">{location.series}</span>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <span className="font-medium text-foreground/80">{location.chapter}</span>
            </div>
          )}

          {/* Title & Desc */}
          <div className="flex flex-col gap-1.5 mb-auto">
             <h3 className={cn("text-lg font-bold leading-tight text-foreground line-clamp-1 transition-colors", !location && "pr-12")}>
                {title}
             </h3>
             <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
             </p>
          </div>

          {/* Footer: Tags & Meta */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
             {/* Tags - Black/White Style */}
             <div className="flex items-center gap-2">
                {tags.slice(0, 3).map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary"
                    className="text-[10px] font-medium px-2 py-0.5 h-5 bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
             </div>

             {/* Meta */}
             <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                   <Avatar className="h-4 w-4">
                      <AvatarImage src={author.avatar} />
                      <AvatarFallback className="text-[8px]">{author.name.slice(0, 1)}</AvatarFallback>
                   </Avatar>
                   <span className="max-w-[180px] truncate">
                     {author.name}
                     {author.guild && (
                       <span className="opacity-60 ml-1">· {author.guild}</span>
                     )}
                   </span>
                </div>
                <div className="flex items-center gap-1">
                   <Eye className="w-3 h-3" />
                   <span>{formatNumber(stats.views)}</span>
                </div>
                <div className="flex items-center gap-1">
                   <Heart className="w-3 h-3" />
                   <span>{formatNumber(stats.likes)}</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}
