"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, LogOut, Settings, Menu, Users } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatedDropdownContent } from "@/components/design/AnimatedDropdownContent"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { Logo } from "@/components/ui/logo"
import { SearchModal } from "./SearchModal"
import { ThemeToggle } from "./ThemeToggle"
import { NotificationButton } from "@/components/design/NotificationButton"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/knowledge", label: "图鉴" },
  { href: "/guild", label: "炼金" },
  { href: "/expedition", label: "远征" },
  { href: "/guilds", label: "公会" },
  { href: "/exchange", label: "荣誉" },
  { href: "/market", label: "集市" },
]



export function Navbar() {
  const pathname = usePathname() ?? ""
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  
  // Mock online users count
  const onlineUsers = 1234

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])



  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-black/10 dark:border-white/10"
          : "bg-background/60 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo & Online Users */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center group h-16">
              <Logo iconSize={26} />
            </Link>
            
            {/* Online Users Badge */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="hidden sm:flex relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-[140px] text-xs px-4 gap-2 rounded-full border border-transparent bg-secondary hover:bg-secondary-foreground/10 transition-all overflow-visible cursor-pointer"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 animate-pulse"></span>
                    </span>
                    <AnimatedShinyText className="inline-flex items-center justify-center transition ease-out hover:duration-300">
                      <span>Online: {onlineUsers.toLocaleString()}</span>
                    </AnimatedShinyText>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <AnimatedDropdownContent align="start" className="w-56">
                <DropdownMenuLabel>Server Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Total Users: {onlineUsers.toLocaleString()}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2" />
                  <span>System Operational</span>
                </DropdownMenuItem>
              </AnimatedDropdownContent>
            </DropdownMenu>
          </div>
          
          {/* Center: Nav Links (Guarahooks Style - No Motion Pill) */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md whitespace-nowrap",
                      isActive 
                        ? "text-black dark:text-white bg-accent/50" 
                        : "text-black/60 dark:text-white/60 hover:text-black hover:dark:text-white hover:bg-accent/50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            {/* Search Trigger */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground shrink min-w-[120px] w-[220px] max-w-[256px] justify-between h-9 px-3 rounded-lg bg-muted/20 border-muted-foreground/10 hover:bg-muted/40 hover:border-muted-foreground/20 transition-all shadow-none overflow-hidden"
              onClick={() => setSearchOpen(true)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="h-4 w-4 opacity-50 shrink-0" />
                <span className="font-normal text-xs truncate">搜索知识库...</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>
            
            {/* Mobile Search Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Theme Toggle */}
            <ThemeToggle className="text-muted-foreground hover:text-foreground rounded-full cursor-pointer" />

            {/* Notification Button */}
            <NotificationButton />

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }} // Slower, smoother animation
                  className="cursor-pointer outline-none"
                >
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-all cursor-pointer p-0 ml-1 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-9 w-9 border border-border/50">
                      <AvatarImage src="/avatars/01.png" alt="@user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <AnimatedDropdownContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </AnimatedDropdownContent>
            </DropdownMenu>

            {/* Mobile Menu Trigger (Placeholder) */}
            <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
