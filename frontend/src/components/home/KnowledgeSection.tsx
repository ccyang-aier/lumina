"use client"

import { Sparkles, BrainCircuit, Share2, Database, Search, FileText, FileTextIcon, Bot, User } from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid"
import { IconCloud } from "@/components/magicui/icon-cloud"
import { AnimatedBeam } from "@/components/magicui/animated-beam"
import { SparklesCore } from "@/components/aceternityui/sparkles"
import React, { useRef } from "react"
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"

const files = [
  {
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
]

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
]

function IconCloudDemo() {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
  )
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  )
}

function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)
  const div8Ref = useRef<HTMLDivElement>(null)
  const div9Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-4"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-center gap-12 max-w-lg mx-auto">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <User className="h-6 w-6 text-black dark:text-white" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div5Ref} className="h-16 w-16">
            <Bot className="h-8 w-8 text-black dark:text-white" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div6Ref}>
            <FileText className="h-6 w-6 text-black dark:text-white" />
          </Circle>
          <Circle ref={div7Ref}>
            <Share2 className="h-6 w-6 text-black dark:text-white" />
          </Circle>
          <Circle ref={div8Ref}>
            <Search className="h-6 w-6 text-black dark:text-white" />
          </Circle>
          <Circle ref={div9Ref}>
            <Database className="h-6 w-6 text-black dark:text-white" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div5Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div7Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div8Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div9Ref}
      />
    </div>
  )
}

const Circle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-black",
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = "Circle"

const features = [
  {
    Icon: FileTextIcon,
    name: "知识共创、共享",
    description: "发现海量高价值学习资源，参与共创。",
    href: "#",
    cta: "浏览文件",
    className: "col-span-3 lg:col-span-1 lg:col-start-1 lg:row-start-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] [--duration:20s]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 h-[168px] flex flex-col justify-between cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white line-clamp-1">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs line-clamp-2">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Sparkles,
    name: "Icon Cloud",
    description: "丰富的技术栈和工具集成",
    href: "#",
    cta: "探索工具",
    className: "col-span-3 lg:col-span-1 lg:col-start-2 lg:row-start-1",
    background: (
      <div className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out group-hover:scale-90">
         <IconCloudDemo />
      </div>
    ),
  },
  {
    Icon: BrainCircuit,
    name: "Agent 集成",
    description: "强大的AI能力，连接各种知识与服务",
    href: "#",
    cta: "了解 Agent",
    className: "col-span-3 lg:col-span-1 lg:col-start-3 lg:row-start-1",
    background: (
      <div className="absolute top-4 right-2 h-[300px] w-full border-none transition-all duration-300 ease-out group-hover:scale-105">
          <AnimatedBeamDemo />
      </div>
    ),
  },
  {
    Icon: Database,
    name: "外部知识源",
    description: "对接海量外部数据与知识库",
    className: "col-span-3 lg:col-span-1 lg:col-start-4 lg:row-start-1",
    href: "#",
    cta: "查看知识源",
    background: (
      <div className="absolute inset-0 overflow-hidden rounded-md flex items-center justify-center -z-10 pointer-events-none">
         <div className="w-[150%] h-[150%] absolute flex items-center justify-center pointer-events-none z-0">
             {/* Gradients */}
            <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[1px] w-full blur-sm" />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-full" />
            <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/2 blur-sm" />
            <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/2" />
         </div>
         {/* Core component */}
         <div className="absolute inset-0 items-center justify-center z-10 flex dark:hidden">
           <SparklesCore
            id="tsparticlesfullpage-light"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#000000"
           />
         </div>
         <div className="absolute inset-0 items-center justify-center z-10 hidden dark:flex">
           <SparklesCore
            id="tsparticlesfullpage-dark"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
           />
         </div>
         {/* Radial Gradient to prevent sharp edges */}
         <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(150px_100px_at_center,transparent_20%,black_80%)] z-10"></div>
      </div>
    ),
  },
]

export function KnowledgeSection() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-10 lg:pb-12">
      {/* Top Title */}
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          特性说明
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          探索 Lumina 的核心功能与生态集成
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* Bento Grid (Full width) */}
        <div className="w-full">
           <BentoGrid className="lg:grid-cols-4">
            {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </div>
    </div>
  )
}
