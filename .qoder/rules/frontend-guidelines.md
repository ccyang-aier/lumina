---
trigger: always_on
---

# Lumina前端设计指导

## 技术栈与设计规范

- 核心框架: React + Next.js
- UI库与设计哲学:
  - 核心库: 一切为我所用，shadcn/ui、radix-ui、magicui、aceternityui等任何开源的UI库或开源的高级特效样式代码等均可以直接引入和使用。
  - 设计风格: 现代化、高级优雅、特效丰富，鼓励通过通过motion、GASP等前端动效库或者利用新颖的、现代化的CSS特效库等实现高级、美观、动态的UI组件和用户界面。
  - 任何ui设计要兼容白天、黑夜两套主题，确保内容清晰、ui精美、视觉效果好，拒绝ai味太重，设计风格优雅大气，配色方案崇尚黑/白经典简约色系，可在关键ui元素等设计处选择用彩色点缀以增加视觉效果。

## 前端组织结构与详细说明

见`frontend/README.md`以了解更多细节。

## 前端开发注意事项

1. 除非特殊说明，所有前端开发均需要考虑响应式设计，确保在不同屏幕尺寸和设备上的正常显示和用户体验。
2. 应合理安排组件目录存放位置，大部分组件应放在`components`目录下，其中：
  - `ui`目录：默认存放引入/适配自shadcn/ui等的基础组件；
  - `layout`目录：存放布局相关的组件，如导航栏、侧边栏、页脚等；
  - `magicui`目录：存放引入/适配自magicui的组件；
  - `aceternityui`目录：存放引入/适配自aceternityui的组件；
  - `design`目录：存放非引入的、自定义组件，注意，对于未使用Tailwind CSS的组件，应按照如下组织结构存放，以保证组件的可维护性和可扩展性，保持最佳实践：
    ```txt
    design/
    ├── XXComponent/
    │   ├── index.tsx          # 组件逻辑（导出入口）
    │   ├── XXComponent.tsx         # 组件主体
    │   └── XXComponent.module.css  # 组件私有样式
    ```
