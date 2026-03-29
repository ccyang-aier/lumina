"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock } from "lucide-react"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, isLoading, error, clearError } = useAuthStore()

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")
  const [loginErrors, setLoginErrors] = React.useState<Record<string, string>>({})

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      clearError()
      setLoginEmail("")
      setLoginPassword("")
      setLoginErrors({})
    }
  }, [open, clearError])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!loginEmail) {
      errors.email = "请输入邮箱"
    } else if (!validateEmail(loginEmail)) {
      errors.email = "请输入有效的邮箱地址"
    }

    if (!loginPassword) {
      errors.password = "请输入密码"
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      return
    }

    try {
      await login({ email: loginEmail, password: loginPassword })
      onOpenChange(false)
    } catch {
      // Error is handled by the store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 border-0 bg-transparent shadow-none max-w-fit overflow-visible",
          // 关闭按钮样式覆盖：hover时小手不变色，点击时无高亮边框
          "[&>button]:opacity-70 [&>button]:cursor-pointer [&>button]:text-muted-foreground",
          "[&>button]:hover:opacity-70 [&>button]:hover:text-muted-foreground",
          "[&>button]:focus:outline-none [&>button]:focus:ring-0 [&>button]:focus:ring-offset-0",
          "[&>button]:focus-visible:outline-none [&>button]:focus-visible:ring-0 [&>button]:focus-visible:ring-offset-0",
          "[&>button]:data-[state=open]:bg-transparent [&>button]:data-[state=open]:text-muted-foreground"
        )}
      >
        {/* Form Container - 精确参考 login-example.md */}
        <form
          onSubmit={handleLogin}
          className={cn(
            "flex flex-col items-center justify-center gap-[15px]",
            "pt-[50px] px-[50px] pb-5",
            "w-[420px]",
            "bg-background",
            "rounded-[11px]",
            // 多层阴影效果
            "shadow-[0px_106px_42px_rgba(0,0,0,0.01),0px_59px_36px_rgba(0,0,0,0.05),0px_26px_26px_rgba(0,0,0,0.09),0px_7px_15px_rgba(0,0,0,0.1)]"
          )}
        >
          {/* Logo Container */}
          <div
            className={cn(
              "box-border w-20 h-20",
              "bg-gradient-to-b from-transparent to-[#F8F8F8]/50 dark:to-[#F8F8F8]/10",
              "border border-[#F7F7F8] dark:border-[#F7F7F8]/20",
              "rounded-[11px]",
              "drop-shadow-[0px_0.5px_0.5px_#EFEFEF] dark:drop-shadow-[0px_0.5px_0.5px_rgba(239,239,239,0.2)]"
            )}
          />

          {/* Title Container */}
          <div className="flex flex-col items-center justify-center">
            <p className="m-0 text-[1.25rem] font-bold text-foreground">
              登录您的账户
            </p>
          </div>

          {/* Email Input Container */}
          <div className="w-full h-fit relative flex flex-col gap-[5px]">
            <label className="text-[0.75rem] text-muted-foreground font-semibold">
              邮箱
            </label>
            <div className="relative">
              {/* Icon - 精确位置: left-12px bottom-9px */}
              <Mail className="absolute left-3 bottom-[9px] w-5 h-5 text-[#141B34] dark:text-muted-foreground z-[99]" />
              <input
                type="email"
                placeholder="name@mail.com"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value)
                  if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: "" }))
                }}
                disabled={isLoading}
                className={cn(
                  "w-full h-10 rounded-[7px] outline-none",
                  "pl-10",
                  "border border-[#e5e5e5] dark:border-border",
                  "bg-background",
                  "drop-shadow-[0px_1px_0px_#efefef] dark:drop-shadow-none",
                  "transition-all duration-300 [cubic-bezier(0.15,0.83,0.66,1)]",
                  "focus:border-transparent focus:shadow-[0px_0px_0px_2px_#242424] dark:focus:shadow-[0px_0px_0px_2px_hsl(var(--foreground))]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  loginErrors.email && "border-destructive"
                )}
              />
            </div>
            {loginErrors.email && (
              <p className="text-xs text-destructive mt-1">{loginErrors.email}</p>
            )}
          </div>

          {/* Password Input Container */}
          <div className="w-full h-fit relative flex flex-col gap-[5px]">
            <label className="text-[0.75rem] text-muted-foreground font-semibold">
              密码
            </label>
            <div className="relative">
              {/* Icon - 精确位置: left-12px bottom-9px */}
              <Lock className="absolute left-3 bottom-[9px] w-5 h-5 text-[#141B34] dark:text-muted-foreground z-[99]" />
              <input
                type="password"
                placeholder="密码"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value)
                  if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: "" }))
                }}
                disabled={isLoading}
                className={cn(
                  "w-full h-10 rounded-[7px] outline-none",
                  "pl-10",
                  "border border-[#e5e5e5] dark:border-border",
                  "bg-background",
                  "drop-shadow-[0px_1px_0px_#efefef] dark:drop-shadow-none",
                  "transition-all duration-300 [cubic-bezier(0.15,0.83,0.66,1)]",
                  "focus:border-transparent focus:shadow-[0px_0px_0px_2px_#242424] dark:focus:shadow-[0px_0px_0px_2px_hsl(var(--foreground))]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  loginErrors.password && "border-destructive"
                )}
              />
            </div>
            {loginErrors.password && (
              <p className="text-xs text-destructive mt-1">{loginErrors.password}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive text-center bg-destructive/10 rounded-[7px] p-2 w-full"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button - 纯黑白底色 + shine effect */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "relative w-full h-10 rounded-[7px] outline-none",
              "border-0",
              "bg-black dark:bg-white",
              "text-white dark:text-black",
              "cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "overflow-hidden",
              "group",
              "mt-4"
            )}
          >
            {/* Shine effect - hover时从左到右一闪而过 */}
            <span
              className={cn(
                "absolute inset-0",
                "-translate-x-full",
                "group-hover:translate-x-full",
                "bg-gradient-to-r from-transparent via-white/30 to-transparent",
                "transition-transform duration-700 ease-out",
                "pointer-events-none"
              )}
            />
            {/* Button text */}
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  登录中...
                </span>
              ) : (
                "登录"
              )}
            </span>
          </button>

          {/* Note - 注册提示 */}
          <p className="text-[0.75rem] text-muted-foreground text-center">
            如果需要注册，请联系 <span className="text-foreground/80">admin@lumina.com</span>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
