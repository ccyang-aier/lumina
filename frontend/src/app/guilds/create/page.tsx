"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Upload, CheckCircle2,
  AlertCircle, Palette, Sparkles, Layout, Type
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── 预设颜色 ───
const PRESET_COLORS = [
  { label: '科技蓝', value: '#3b82f6' },
  { label: '活力橙', value: '#f97316' },
  { label: '翡翠绿', value: '#10b981' },
  { label: '紫罗兰', value: '#8b5cf6' },
  { label: '玫瑰红', value: '#ef4444' },
  { label: '琥珀金', value: '#f59e0b' },
  { label: '天空蓝', value: '#0ea5e9' },
  { label: '樱花粉', value: '#ec4899' },
]

export default function CreateGuildPage() {
  const [form, setForm] = useState({
    name: '',
    slogan: '',
    description: '',
    primaryColor: PRESET_COLORS[0].value,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-xl border border-slate-200 dark:border-slate-800"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">公会创建成功！</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            恭喜！<span className="font-bold text-slate-900 dark:text-white">{form.name}</span> 已正式成立。
            快去邀请伙伴们加入吧！
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/guilds"
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
            >
              返回公会广场
            </Link>
            <Link 
              href="#" // 实际应跳转到新公会详情页
              className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              进入我的公会
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/guilds"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回公会广场
          </Link>
          <span className="text-sm font-semibold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">创建新公会</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 左侧：表单区域 */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                开启新的传奇
              </h1>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                填写下方信息，创建一个属于你们团队的知识据点。在这里，每一个想法都值得被记录，每一次交流都能碰撞出智慧的火花。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 基本信息 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 mr-1">1</span>
                  基本信息
                </div>
                
                <div className="grid grid-cols-1 gap-6 pl-9">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      公会名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例如：前端架构师公会"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors duration-200"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Slogan (口号) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="一句话描述公会的精神内核"
                        maxLength={40}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors duration-200 pr-16"
                        value={form.slogan}
                        onChange={e => setForm({ ...form, slogan: e.target.value })}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                        {form.slogan.length}/40
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      详细描述
                    </label>
                    <textarea
                      rows={5}
                      placeholder="介绍一下公会的主要方向、目标人群以及愿景..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors duration-200 resize-none leading-relaxed"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* 视觉风格 */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 mr-1">2</span>
                  视觉风格
                </div>

                <div className="pl-9">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    选择主题色
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setForm({ ...form, primaryColor: color.value })}
                        className={cn(
                          "w-12 h-12 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center relative group",
                          form.primaryColor === color.value ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110 shadow-lg" : "hover:scale-110 hover:shadow-md"
                        )}
                        style={{ background: color.value }}
                        title={color.label}
                      >
                        {form.primaryColor === color.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                          </motion.div>
                        )}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 提交区域 */}
              <div className="flex items-center gap-4 pt-8 pl-9">
                <button
                  type="submit"
                  disabled={isSubmitting || !form.name || !form.slogan}
                  className={cn(
                    "px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-xl transition-all duration-300",
                    isSubmitting || !form.name || !form.slogan 
                      ? "bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none" 
                      : "bg-slate-900 dark:bg-white dark:text-slate-900 hover:translate-y-[-2px] hover:shadow-2xl shadow-slate-900/20"
                  )}
                >
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                       <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       创建中...
                     </span>
                  ) : '立即创建公会'}
                </button>
                <Link
                  href="/guilds"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  取消
                </Link>
              </div>
            </form>
          </div>

          {/* 右侧：实时预览 */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                <Sparkles className="w-4 h-4" />
                实时预览效果
              </div>
              
              {/* 预览卡片 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden relative">
                
                {/* 装饰背景 */}
                <div 
                  className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-current to-transparent opacity-[0.05] rounded-bl-full -mr-12 -mt-12 pointer-events-none transition-colors duration-500"
                  style={{ color: form.primaryColor }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
                        {form.name || '未命名公会'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          Lv.1
                        </span>
                        <span className="text-xs text-slate-400">
                          1 成员
                        </span>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors duration-500"
                      style={{
                        background: `${form.primaryColor}08`,
                        borderColor: `${form.primaryColor}20`,
                        color: form.primaryColor,
                      }}>
                      新公会
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3 min-h-[4.5em]">
                    {form.slogan || '这里是你的公会口号...'}
                  </p>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>0 知识卡片</span>
                      <span>+0 本周新增</span>
                    </div>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-500"
                      style={{ background: form.primaryColor }}
                    >
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 text-xs text-blue-600 dark:text-blue-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                  公会创建后，您将自动成为首任会长。初始等级为 Lv.1，可以通过贡献知识卡片和活跃交流来提升公会等级。
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
