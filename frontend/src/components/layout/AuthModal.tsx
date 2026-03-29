"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, User, AtSign } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const { login, register, isLoading, error, clearError } = useAuthStore()
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")
  const [loginErrors, setLoginErrors] = React.useState<Record<string, string>>({})

  // Register form state
  const [registerEmail, setRegisterEmail] = React.useState("")
  const [registerUsername, setRegisterUsername] = React.useState("")
  const [registerPassword, setRegisterPassword] = React.useState("")
  const [registerFullName, setRegisterFullName] = React.useState("")
  const [registerErrors, setRegisterErrors] = React.useState<Record<string, string>>({})

  // Reset form when modal closes or tab changes
  React.useEffect(() => {
    if (!open) {
      clearError()
      setLoginEmail("")
      setLoginPassword("")
      setRegisterEmail("")
      setRegisterUsername("")
      setRegisterPassword("")
      setRegisterFullName("")
      setLoginErrors({})
      setRegisterErrors({})
    }
  }, [open, clearError])

  React.useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!registerEmail) {
      errors.email = "请输入邮箱"
    } else if (!validateEmail(registerEmail)) {
      errors.email = "请输入有效的邮箱地址"
    }

    if (!registerUsername) {
      errors.username = "请输入用户名"
    } else if (registerUsername.length < 3) {
      errors.username = "用户名至少需要3个字符"
    }

    if (!registerPassword) {
      errors.password = "请输入密码"
    } else if (!validatePassword(registerPassword)) {
      errors.password = "密码至少需要6个字符"
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors)
      return
    }

    try {
      await register({
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
        full_name: registerFullName || undefined,
      })
      onOpenChange(false)
    } catch {
      // Error is handled by the store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            欢迎来到 Lumina
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            登录或注册以探索更多精彩内容
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-background">
              登录
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-background">
              注册
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="login" className="mt-4" asChild>
              <motion.form
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="邮箱"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value)
                        if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: "" }))
                      }}
                      className={cn("pl-10", loginErrors.email && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-xs text-destructive">{loginErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="密码"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value)
                        if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: "" }))
                      }}
                      className={cn("pl-10", loginErrors.password && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs text-destructive">{loginErrors.password}</p>
                  )}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive text-center bg-destructive/10 rounded-md p-2"
                  >
                    {error}
                  </motion.p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
              </motion.form>
            </TabsContent>

            <TabsContent value="register" className="mt-4" asChild>
              <motion.form
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="邮箱"
                      value={registerEmail}
                      onChange={(e) => {
                        setRegisterEmail(e.target.value)
                        if (registerErrors.email) setRegisterErrors((prev) => ({ ...prev, email: "" }))
                      }}
                      className={cn("pl-10", registerErrors.email && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-xs text-destructive">{registerErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="用户名"
                      value={registerUsername}
                      onChange={(e) => {
                        setRegisterUsername(e.target.value)
                        if (registerErrors.username) setRegisterErrors((prev) => ({ ...prev, username: "" }))
                      }}
                      className={cn("pl-10", registerErrors.username && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {registerErrors.username && (
                    <p className="text-xs text-destructive">{registerErrors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="昵称（可选）"
                      value={registerFullName}
                      onChange={(e) => setRegisterFullName(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="密码（至少6位）"
                      value={registerPassword}
                      onChange={(e) => {
                        setRegisterPassword(e.target.value)
                        if (registerErrors.password) setRegisterErrors((prev) => ({ ...prev, password: "" }))
                      }}
                      className={cn("pl-10", registerErrors.password && "border-destructive")}
                      disabled={isLoading}
                    />
                  </div>
                  {registerErrors.password && (
                    <p className="text-xs text-destructive">{registerErrors.password}</p>
                  )}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive text-center bg-destructive/10 rounded-md p-2"
                  >
                    {error}
                  </motion.p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      注册中...
                    </>
                  ) : (
                    "注册"
                  )}
                </Button>
              </motion.form>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          登录即表示您同意我们的服务条款和隐私政策
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
