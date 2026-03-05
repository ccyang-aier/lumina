"use client";

import { Meteors } from "@/components/magicui/meteors";
import { TrendingUp } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedList } from "@/components/magicui/animated-list";
import { cn } from "@/lib/utils";

export function WidgetsSection() {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          实时数据
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[28rem]">
        {/* Trending Topics Component (1/3) */}
        <div className="rounded-2xl border bg-white dark:bg-black text-card-foreground shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col overflow-hidden relative dark:border-zinc-800/80 ring-1 ring-black/5 dark:ring-white/5 group/trending h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10">
          {/* Re-add Meteors */}
          <Meteors number={20} />
          
          <div className="p-6 pb-4 relative z-10 flex items-center justify-between border-b border-border/30 bg-transparent">
            <div className="flex items-center gap-3">
              <h3 className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                热门趋势
              </h3>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </div>
               <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">Live</span>
            </div>
          </div>
          <div className="p-4 flex-1 relative z-10 overflow-hidden bg-transparent">
            <div className="flex flex-col gap-3">
              {[
                { topic: "React 19 Server Components", heat: 98, trend: "up" },
                { topic: "Next.js App Router 最佳实践", heat: 92, trend: "up" },
                { topic: "Tailwind CSS v4 新特性", heat: 88, trend: "neutral" },
                { topic: "Lumina UI 源码解析", heat: 85, trend: "up" },
                { topic: "Rust 在前端构建中的应用", heat: 79, trend: "down" },
                { topic: "AI 辅助编程实战技巧", heat: 75, trend: "up" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl transition-all duration-300 overflow-hidden relative">
                  <div className="flex items-center gap-4 relative z-10 min-w-0 flex-1">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-xl text-[13px] font-bold shrink-0 transition-all duration-300",
                        i === 0 ? "bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md shadow-red-500/20" :
                        i === 1 ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md shadow-orange-500/20" :
                        i === 2 ? "bg-gradient-to-br from-amber-300 to-yellow-500 text-white shadow-md shadow-amber-500/20" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {i + 1}
                      </div>
                      <span className="text-[14px] font-medium text-foreground/80 truncate">{item.topic}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 shrink-0 relative z-10 w-16">
                    <span className="text-[11px] font-bold text-muted-foreground tabular-nums tracking-wide">{item.heat}k</span>
                    <div className="flex items-center justify-center w-4">
                      {item.trend === "up" ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      ) : item.trend === "down" ? (
                        <TrendingUp className="w-3.5 h-3.5 text-red-500 rotate-180" />
                      ) : (
                        <div className="w-2 h-0.5 bg-zinc-400 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hover Mask & Button */}
          <div className="absolute inset-0 z-20 bg-background/20 backdrop-blur-[2px] opacity-0 group-hover/trending:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover/trending:pointer-events-auto">
              <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-foreground text-background font-medium shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                  查询完整趋势
                  <TrendingUp className="w-3.5 h-3.5" />
              </button>
          </div>
        </div>

        {/* Global Bounty Questions Component (2/3) */}
        <div className="rounded-2xl border bg-white dark:bg-black text-card-foreground shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col overflow-hidden relative lg:col-span-2 dark:border-zinc-800/80 ring-1 ring-black/5 dark:ring-white/5 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10">
          
          <div className="p-6 pb-4 relative z-10 flex items-center justify-between border-b border-border/30 bg-white dark:bg-black">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-sky-500/10 rounded-lg ring-1 ring-sky-500/20">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></span>
                </div>
              </div>
              <h3 className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                全站悬赏
              </h3>
            </div>
            <Badge variant="outline" className="font-medium px-3 py-1 bg-sky-500/5 text-sky-600 dark:text-sky-400 border-sky-500/20 shadow-sm">
               实时更新
            </Badge>
          </div>
          <div className="relative flex-1 overflow-hidden p-4 bg-white dark:bg-black">
            <div className="absolute inset-x-0 top-4 bottom-0 z-0">
                <AnimatedList delay={4500} className="gap-2">
                {[
                  { id: "1", title: "如何优化大型 React 应用的首屏加载时间？", desc: "目前项目打包体积过大，首次加载需要十几秒，寻求性能优化和分包策略...", reward: "500", tags: ["React", "Performance"], user: "Alex", time: "2m ago", answers: 3 },
                  { id: "2", title: "求一个优雅的 Next.js 权限路由方案", desc: "需要在 App Router 下实现细粒度的按钮级和页面级权限控制...", reward: "300", tags: ["Next.js", "Auth"], user: "Bob", time: "5m ago", answers: 1 },
                  { id: "3", title: "Shadcn UI 自定义主题配置疑难解答", desc: "按照官方文档配置了多套主题色，但是在某些组件上不生效...", reward: "200", tags: ["UI", "Tailwind"], user: "Charlie", time: "12m ago", answers: 5 },
                  { id: "4", title: "Rust 编写 WASM 模块遇到的内存泄漏问题", desc: "在与 JavaScript 频繁交互传递复杂对象时，发现内存一直增长...", reward: "800", tags: ["Rust", "WASM"], user: "David", time: "15m ago", answers: 0 },
                  { id: "5", title: "寻找一位精通 Three.js 的前端大佬协助解决渲染问题", desc: "加载大型模型时帧率掉得很厉害，需要优化渲染管线和材质...", reward: "1000", tags: ["Three.js", "3D"], user: "Eve", time: "22m ago", answers: 2 }
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-3 py-2 mx-4 mb-2.5 rounded-xl border border-border/40 bg-card transition-all duration-300 shadow-sm overflow-hidden relative group/bounty hover:border-border cursor-pointer hover:-translate-y-1 hover:shadow-md hover:bg-muted/30">
                      
                      {/* Left: User Info */}
                      <div className="flex flex-col items-center justify-center gap-1 w-12 shrink-0">
                        <Avatar className="w-8 h-8 shadow-sm group-hover/bounty:scale-110 transition-transform duration-300">
                            <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">{item.user[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center group-hover/bounty:text-foreground transition-colors">{item.user}</span>
                      </div>
                      
                      {/* Middle: Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-1">
                        <div className="text-sm font-semibold tracking-tight leading-tight truncate transition-colors relative pb-1">
                          <span className="relative">
                            {item.title}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] rounded-full bg-black dark:bg-white transition-all duration-500 ease-out group-hover/bounty:w-full"></span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/90 truncate">{item.desc}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium bg-secondary/60 border-transparent">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right: Meta */}
                      <div className="flex flex-col items-end justify-center gap-1.5 w-20 shrink-0 border-l border-border/40 pl-3 py-1">
                          <div className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400 font-bold text-sm">
                              <span className="text-[10px] font-medium opacity-70">$</span>
                              {item.reward}
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 opacity-70" />
                              {item.answers}
                            </span>
                            <span className="text-[9px] text-muted-foreground/60">{item.time}</span>
                          </div>
                      </div>
                  </div>
                ))}
            </AnimatedList>
            </div>
            {/* Fade out masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white dark:from-black to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-black to-transparent z-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Highlighter } from "@/components/magicui/highlighter";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

const showcases = [
  {
    title: "深入浅出 React 源码解析",
    description: "从零开始构建 React 核心功能，掌握 Fiber 架构与 Diff 算法。",
    author: {
      name: "技术狂人",
      avatar: "https://github.com/shadcn.png",
      initials: "TK",
    },
    metrics: {
      views: "12.5k",
      likes: "1.2k",
      comments: "340",
    },
    image: null,
    tags: ["React", "Source Code"],
  },
  {
    title: "Next.js App Router 最佳实践",
    description: "构建高性能全栈应用，掌握 Server Components 与 Streaming。",
    author: {
      name: "前端架构师",
      avatar: "https://github.com/vercel.png",
      initials: "FA",
    },
    metrics: {
      views: "8.9k",
      likes: "980",
      comments: "210",
    },
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop",
    tags: ["Next.js", "App Router"],
  },
   {
    title: "Vue 3 Composition API 实战",
    description: "用更优雅的方式组织代码，提升逻辑复用性与可维护性。",
    author: {
      name: "Vue大师",
      avatar: "https://github.com/vuejs.png",
      initials: "VM",
    },
    metrics: {
      views: "15k",
      likes: "2.3k",
      comments: "560",
    },
    image: null,
    tags: ["Vue 3", "Composition API"],
  },
  {
    title: "现代化 CSS 布局技巧",
    description: "掌握 Grid 与 Flexbox，打造响应式且美观的网页布局。",
    author: {
      name: "CSS魔法师",
      avatar: "",
      initials: "CM",
    },
    metrics: {
      views: "5.6k",
      likes: "450",
      comments: "120",
    },
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop",
    tags: ["CSS", "Layout"],
  },
   {
    title: "Rust for JavaScript Developers",
    description: "Why and how to learn Rust as a JS developer.",
    author: {
      name: "Rustacean",
      avatar: "",
      initials: "RS",
    },
    metrics: {
      views: "22k",
      likes: "3.1k",
      comments: "890",
    },
    image: null,
    tags: ["Rust", "JavaScript"],
  },
];

const ShowcaseCard = ({
  title,
  description,
  author,
  metrics,
  image,
  tags,
  idx,
  hoveredIndex,
  setHoveredIndex,
}: (typeof showcases)[0] & { idx: number; hoveredIndex: number | null; setHoveredIndex: (idx: number | null) => void; }) => {
  return (
    <div 
      className="group/card cursor-pointer relative flex h-[400px] w-[400px] flex-col overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900/50 dark:border-zinc-700"
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      
      {/* Header Section: Image or Abstract Grid */}
      <div className="relative h-48 w-full overflow-hidden bg-muted/20 cursor-pointer">
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
          </>
        ) : (
          <div className="relative size-full bg-zinc-900">
             <FlickeringGrid
              squareSize={4}
              gridGap={6}
              color="#60A5FA"
              maxOpacity={0.4}
              flickerChance={0.2}
              height={200}
              width={400}
              className="absolute inset-0 size-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
            </div>
             {/* Border Beam effect simulation using CSS/Tailwind */}
             <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          </div>
        )}
        
        {/* Top Right Badge */}
        <div className="absolute top-3 right-3">
             <Badge variant="secondary" className="backdrop-blur-md bg-black/30 text-white border-white/10 hover:bg-black/40">
                Featured
             </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 relative">
         {/* Subtle pattern background for content area */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="z-10">
            <div className="flex items-center gap-3 mb-3">
                <Avatar className="size-8 border border-border/50 ring-2 ring-background">
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                     <span className="text-xs font-medium leading-none">{author.name}</span>
                     <span className="text-[10px] text-muted-foreground mt-0.5">2 hours ago</span>
                </div>
            </div>

          <div className="w-full relative">
            <h3 className={cn("mb-2 text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-2 transition-colors duration-300 relative z-10 py-1")}>
              {hoveredIndex === idx ? (
                <Highlighter action="highlight" color="rgba(14, 165, 233, 0.25)" animationDuration={400} isView={true}>
                  {title}
                </Highlighter>
              ) : (
                <span className="bg-transparent">{title}</span>
              )}
            </h3>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground/80 mt-1">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="z-10 mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
            <div className="flex gap-2">
               {tags && tags.slice(0, 2).map(tag => (
                   <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal border-primary/20 bg-primary/5 text-primary/80">
                       {tag}
                   </Badge>
               ))}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 transition-colors">
                    <Eye className="size-3.5" />
                    <span>{metrics.views}</span>
                </div>
                 <div className="flex items-center gap-1 transition-colors">
                    <Heart className="size-3.5" />
                    <span>{metrics.likes}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

export function Showcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="showcase" className="w-full pt-10 lg:pt-12 pb-20 lg:pb-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          今日推荐
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          基于评论数、采用率、点赞数、浏览量等多维影响力综合评定
        </p>
      </div>
        
        <div className="relative mx-auto flex w-full flex-col overflow-hidden">
          <Marquee pauseOnHover className="w-full [--duration:40s] py-4">
            {showcases.map((showcase, idx) => (
              <ShowcaseCard 
                key={idx} 
                {...showcase} 
                idx={idx} 
                hoveredIndex={hoveredIndex} 
                setHoveredIndex={setHoveredIndex} 
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>

        {/* Widgets section: Trending and Bounties */}
        <div className="mt-20 lg:mt-24 w-full">
           <WidgetsSection />
        </div>
      </div>
    </section>
  );
}
