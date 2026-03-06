"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react"

import { LuminaIcon } from "@/components/ui/lumina-icon"

export function Footer() {
  const pathname = usePathname()
  
  // Hide Footer on Alchemy module
  if (pathname?.startsWith("/guild")) {
    return null
  }

  return (
    <footer className="w-full border-t bg-background pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
             <div className="flex items-center justify-center rounded-lg text-primary-foreground font-bold text-xl">
                <LuminaIcon className="h-8 w-8" />
             </div>
             <span className="text-xl font-bold tracking-tight">Lumina</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
            <Link href="/knowledge" className="hover:text-foreground transition-colors">大世界</Link>
            <Link href="/guild" className="hover:text-foreground transition-colors">炼金</Link>
            <Link href="/world-boss" className="hover:text-foreground transition-colors">远征</Link>
            <Link href="/hall-of-fame" className="hover:text-foreground transition-colors">公会</Link>
            <Link href="/exchange" className="hover:text-foreground transition-colors">荣誉</Link>
          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-border/50 border-t border-dashed my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Lumina. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
