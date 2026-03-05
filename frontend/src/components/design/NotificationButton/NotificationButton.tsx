"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatedDropdownContent, dropdownItemVariants } from "@/components/design/AnimatedDropdownContent"
import { 
  Bell, 
  Sparkles, 
  MessageSquareQuote, 
  MessageCircle, 
  Heart, 
  Swords, 
  Clock, 
  CheckCheck,
  ChevronRight,
  Inbox
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import styles from "./NotificationButton.module.css"

// Create a MotionTabs component to handle stagger animation context
const MotionTabs = motion(Tabs)

// Types
type NotificationType = 'system' | 'cited' | 'commented' | 'liked' | 'expedition'

interface Notification {
  id: string
  type: NotificationType
  title: string
  content?: string
  time: string
  isRead: boolean
  action?: {
    label: string
    onClick: () => void
  }
  meta?: {
    reward?: string
  }
}

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: '系统通知',
    content: '欢迎来到 Lumina！这是一个示例通知消息，用于展示通知中心的样式效果。',
    time: '刚刚',
    isRead: false,
  },
  {
    id: '2',
    type: 'cited',
    title: '你的「K8s 部署指南」被李明引用了',
    time: '2分钟前',
    isRead: false,
    action: {
      label: '查看引用位置',
      onClick: () => console.log('View citation'),
    },
  },
  {
    id: '3',
    type: 'expedition',
    title: '新远征发布：「完善安全规范文档」',
    time: '1小时前',
    isRead: false,
    meta: {
      reward: '300 积分',
    },
    action: {
      label: '去接取',
      onClick: () => console.log('Accept expedition'),
    },
  },
  {
    id: '4',
    type: 'liked',
    title: '你的「API 设计规范」被 [张三] 点了个赞',
    time: '今天',
    isRead: true,
    action: {
      label: '查看',
      onClick: () => console.log('View like'),
    },
  },
  // Add more mock data for other tabs to work
  {
    id: '5',
    type: 'commented',
    title: '王五 评论了你的文章',
    content: '这篇文章写得非常详细，对我很有帮助！',
    time: '昨天',
    isRead: true,
  },
]

const NOTIFICATION_TABS = [
  { value: 'all', label: '全部' },
  { value: 'cited', label: '被引用' },
  { value: 'commented', label: '被评论' },
  { value: 'liked', label: '点赞' },
  { value: 'expedition', label: '远征' },
  { value: 'system', label: '系统' },
]

interface NotificationButtonProps {
  initialCount?: number
}

export function NotificationButton({ initialCount = 4 }: NotificationButtonProps) {
  const [count, setCount] = React.useState(initialCount)
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('all')

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // Optional: clear count or mark as read logic
    }
  }

  const handleMarkAllRead = () => {
    setCount(0)
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'system': return <Sparkles className="h-4 w-4 text-yellow-500" />
      case 'cited': return <MessageSquareQuote className="h-4 w-4 text-blue-500" />
      case 'commented': return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'liked': return <Heart className="h-4 w-4 text-red-500" />
      case 'expedition': return <Swords className="h-4 w-4 text-orange-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === 'all') return MOCK_NOTIFICATIONS
    return MOCK_NOTIFICATIONS.filter(n => n.type === activeTab)
  }, [activeTab])

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative flex items-center justify-center cursor-pointer outline-none"
        >
          <button className={styles.button}>
            <Bell className={styles.bell} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={styles.badge}
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <AnimatedDropdownContent 
        align="end" 
        className="w-[90vw] sm:w-[560px] p-0 overflow-hidden" // Widened width with responsive fallback
        animationDuration={0.4}
        staggerDelay={0.08}
        disableChildrenAnimation
      >
        <MotionTabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full flex flex-col h-full"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {/* Header */}
          <motion.div 
            variants={dropdownItemVariants}
            className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 shrink-0"
          >
            <span className="font-semibold text-sm">通知中心</span>
            <div className="flex items-center gap-3">
              {count > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  全部已读
                </button>
              )}
              <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                设置
              </button>
            </div>
          </motion.div>

          {/* Tabs List */}
          <motion.div variants={dropdownItemVariants} className="px-2 pt-2 pb-0 shrink-0">
             <TabsList className={cn("w-full justify-start h-9 bg-transparent p-0 gap-1 overflow-x-auto", styles.noScrollbar)}>
              {NOTIFICATION_TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground bg-transparent hover:bg-muted/50 transition-all rounded-md px-3 py-1.5 text-xs"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>
          
          <motion.div variants={dropdownItemVariants} className="shrink-0">
            <DropdownMenuSeparator className="my-0" />
          </motion.div>

          {/* Content Area */}
          <motion.div 
            variants={dropdownItemVariants}
            className={cn("h-[400px] overflow-y-auto bg-background/50", styles.customScrollbar)}
          >
            <TabsContent value={activeTab} className="m-0 p-0 focus-visible:ring-0 focus-visible:outline-none h-full">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <Inbox className="h-10 w-10 opacity-20" />
                  <p className="text-sm">暂无此类通知</p>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: { 
                      opacity: 1, 
                      transition: { 
                        staggerChildren: 0.05
                      }
                    },
                    hidden: { opacity: 0 },
                    exit: { opacity: 0 }
                  }}
                  className="flex flex-col p-2 gap-1"
                >
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      variants={dropdownItemVariants}
                      onClick={() => {
                        console.log('Clicked notification', notification.id)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "group relative flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50",
                        !notification.isRead && "bg-muted/20"
                      )}
                    >
                      {/* Icon Section */}
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background border shadow-sm mt-0.5",
                        !notification.isRead && "ring-1 ring-primary/20"
                      )}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-none truncate pr-4">
                            {notification.type === 'system' && (
                              <span className="text-yellow-600 dark:text-yellow-400 mr-2">✨ 系统通知</span>
                            )}
                            {notification.type === 'expedition' && (
                              <span className="text-orange-600 dark:text-orange-400 mr-2">⚔️ 新远征发布</span>
                            )}
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                            {notification.time}
                          </span>
                        </div>
                        
                        {notification.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {notification.content}
                          </p>
                        )}

                        {/* Special Meta Info (e.g. Rewards) */}
                        {notification.meta && (
                          <div className="flex items-center gap-2 mt-1.5">
                            {notification.meta.reward && (
                              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                奖励：{notification.meta.reward}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Link */}
                        {notification.action && (
                          <div 
                            className="flex items-center gap-1 mt-1.5 text-xs font-medium text-primary hover:underline cursor-pointer w-fit group/link"
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.action?.onClick()
                              setIsOpen(false)
                            }}
                          >
                            {notification.action.label}
                            <ChevronRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                          </div>
                        )}
                      </div>
                      
                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </motion.div>
          
          <motion.div variants={dropdownItemVariants} className="shrink-0">
            <DropdownMenuSeparator className="my-0" />
            <div className="p-2 bg-muted/30">
              <button className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors py-1">
                查看全部通知
              </button>
            </div>
          </motion.div>
        </MotionTabs>
      </AnimatedDropdownContent>
    </DropdownMenu>
  )
}
