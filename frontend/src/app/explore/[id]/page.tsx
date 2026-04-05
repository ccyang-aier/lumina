import Image from 'next/image';
import { CloudDownload } from 'lucide-react';

export default function PaperDetails() {
  return (
    <div className="bg-background font-sans selection:bg-primary/10 selection:text-primary min-h-screen">
      <div className="reading-progress-bar"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <header className="mb-10">
              <div className="flex flex-wrap gap-2 mb-5 items-center">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-sm border border-primary/20">推理加速</span>
                <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-[10px] rounded-sm">arXiv:2403.1524</span>
                <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-[10px] rounded-sm">技术论文</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight mb-6">
                优化量化混合专家模型以实现超低延迟推理
              </h1>
              <div className="pl-6 border-l-[3px] border-primary py-2">
                <p className="text-lg text-primary leading-relaxed">
                  一个新颖的框架，在不影响边缘设备感知质量的情况下，实现了MoE路由效率4.2倍的提升。
                </p>
              </div>
            </header>

            <article className="main-content">
              <section className="mb-14" id="core-problems">
                <h2 className="text-xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">01.</span>
                  核心问题
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p>当前的混合专家（MoE）架构在推理过程中面临一个重要的瓶颈：动态路由机制引入了非确定性的内存访问模式。具体来说，当部署在SRAM有限的硬件上时，专用专家之间的频繁切换会导致严重的缓存抖动。</p>
                  <p>此外，MoE模型中的权重量化通常会导致不同专家之间精度需求的差异，而传统的统一量化方法无法解决这个问题。</p>
                </div>
              </section>

              <section className="mb-14" id="methodology">
                <h2 className="text-xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">02.</span>
                  方法 / 技术路径
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p>研究人员提出了<strong className="text-foreground">&quot;Insight-MoE&quot;</strong>，一种分层专家分配策略。技术路径包括三个主要阶段：</p>
                  <ul className="list-none space-y-4 pl-4">
                    <li className="flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                      <span><strong className="text-foreground">非对称路由：</strong>实现基于优先级的调度器，在完整token计算之前以94%的准确率预测专家激活。</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                      <span><strong className="text-foreground">专家感知量化：</strong>使用动态敏感度映射，对稀疏专家应用4位量化，对&quot;锚点&quot;专家应用8位量化。</span>
                    </li>
                  </ul>
                  <div className="bg-muted p-6 rounded-xl overflow-x-auto my-8 border border-border">
                    <code className="font-mono text-sm text-primary block leading-relaxed whitespace-pre">
{`# 技术片段：路由优化
def insight_router(token, experts, threshold=0.85):
    probs = softmax(linear_projection(token))
    if max(probs) > threshold:
        return load_expert(argmax(probs))
    return top_k_experts(probs, k=2)`}
                    </code>
                  </div>
                </div>
              </section>

              <section className="mb-14 p-6 bg-primary/[0.04] dark:bg-primary/[0.08] rounded-2xl border-l-4 border-primary" id="perspective">
                <div className="flex items-center gap-4 mb-5">
                  <Image alt="博主头像" width={44} height={44} className="w-11 h-11 rounded-full object-cover grayscale border border-border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-vXCXNbgxbdW2cy5glxuPiCXujcTXdJbDIOVgxuD2_d6hze1RTZU98WaxVeNiWU5PPVyhyCcvz8mcTe_erw_Exwew6fF1DK_EQEBCyPQV2-6FoUxj69usHa0SYMaSt-pI8DQLB0ZCloDjto0NibTKDdJU2I8k3ZjZz_CRX9oYY8uB-x6_h00YyDdpIFcmIJ9Gqm8qDaKLCeKRuRZb8lOsgB4bkI7PvbGij1-lpU-ot6aQdeHVWIJaZ27b77_Ju6A91_RR1i_BF37O" />
                  <div>
                    <h4 className="text-foreground">博主视角</h4>
                    <p className="text-xs text-muted-foreground">首席研究分析师</p>
                  </div>
                </div>
                <div className="italic text-muted-foreground leading-relaxed">
                  &quot;这篇论文是对标准MoE研究的重要突破。当所有人都在关注扩展规模时，这个团队却在向&apos;内&apos;扩展。非对称路由逻辑让我想起CPU设计中早期的缓存预测算法——证明了旧的硬件技巧在LLM时代仍然具有巨大价值。&quot;
                </div>
              </section>

              <section className="mb-14" id="results">
                <h2 className="text-xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">03.</span>
                  关键结果
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-card border border-border rounded-xl">
                    <p className="text-[10px] text-muted-foreground mb-2">吞吐量</p>
                    <p className="text-3xl font-semibold text-primary">+4.2x</p>
                    <p className="text-xs text-muted-foreground mt-2">相比基线FP16 MoE</p>
                  </div>
                  <div className="p-5 bg-card border border-border rounded-xl">
                    <p className="text-[10px] text-muted-foreground mb-2">困惑度</p>
                    <p className="text-3xl font-semibold text-primary">&lt; 0.1%</p>
                    <p className="text-xs text-muted-foreground mt-2">量化后的质量损失</p>
                  </div>
                </div>
              </section>

              <section className="mb-20" id="limitations">
                <h2 className="text-xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">04.</span>
                  局限性 / 未来方向
                </h2>
                <p className="text-muted-foreground mb-10">
                  尽管令人印象深刻，但该方法需要在目标硬件上进行预分析步骤，这限制了其在异构云环境中&quot;开箱即用&quot;的通用性。
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all cursor-pointer">
                    阅读原始论文 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </button>
                  <button className="px-5 py-3.5 rounded-xl border border-border hover:bg-muted/50 transition-all cursor-pointer">
                    <CloudDownload className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </section>
            </article>

            <div className="mt-10 pt-10 border-t border-border">
              <h3 className="text-xs text-muted-foreground mb-8">相关智能</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="group cursor-pointer">
                  <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-muted relative">
                    <Image fill alt="相关内容" className="w-full h-full object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZOXSe3NvuMdh2ancXTCUPxYV5VKAKhVRdEIlZgd7-FqeL-HYiyYtJ-eG273R1Z5Vx4_DiqlmlxAAFtVXTiv-uAu9V-fO6HssuW1SgNHdHrtMuqQDE-6NE2xwcFbgzdQf8ma95h_RJzKaZcuXdzv4m9RykVpNDLUhF9B2pdCieS64tOUB72e3ibRuACoRgtgw6GH2BJEq0r54JPOZ8Iypht1AASgAvBFnc7ndkBIk2U1bUEISq2VCLRDs5yCGbpIO3JlBJXmnfmS5M" />
                  </div>
                  <h4 className="text-sm leading-tight group-hover:text-primary text-foreground transition-colors">视觉Transformer中的交叉注意力效率</h4>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-muted relative">
                    <Image fill alt="相关内容" className="w-full h-full object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQXwIIjFM_wvf0y-pyf1IyN9ayY894DZdBH0NLd3gRr5iDqTzCg3L5eFY3P8xbsvFa7TY2Fw1aoQwp4RjqsnBWmd_Z00v-mVX0Zt0HJ1XpYS6EMgn73MU6fAOcZYVc0mXbBv2qWnogqGrmyFKCVrVcL6mhmH_cHag8GU_1Ftr5hX5Cx15xUhYeMGW72TB-70v3YEiK8_C9wjTu-F6H3NA5r36R0nZ274P5lS50SGMABZAAjSmoedqp4rXwXApSh4bu-qHXIIzRbhJp" />
                  </div>
                  <h4 className="text-sm leading-tight group-hover:text-primary text-foreground transition-colors">稀疏矩阵的硬件加速</h4>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-muted relative">
                    <Image fill alt="相关内容" className="w-full h-full object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdmzcYU0boZHhMdJVb7kmfBdhh__ehRHIWxMSG2dsaBl6cpjZDItkJ1p5-VedC3ak97i-N0pCqlVgQSW3YB1QyCA9n6JE-cRleKbEORVZXMpDk6uzejqvkpcY_bW2qX1hhHVAb8LniNP4uA1FkWNY2OKxdWPvFj6wDMLElIG8XsZrPXmqiHTPcK3ygwOxuDEuP_r4Bd5dVco12WEdRYSJNMKrBuqvuESvdAJzWea2wZy3xnGn1R8GAgtSKbzFwetZjZjIaZdIIIsvc" />
                  </div>
                  <h4 className="text-sm leading-tight group-hover:text-primary text-foreground transition-colors">解码潜在表示</h4>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sidebar-sticky space-y-5 sticky">
              <div className="bg-card p-5 rounded-2xl border border-border">
                <h3 className="text-xs text-muted-foreground mb-4">执行摘要</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">即时影响</p>
                      <p className="text-xs text-muted-foreground">将MoE部署的基础设施成本降低60%。</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">目标市场</p>
                      <p className="text-xs text-muted-foreground">边缘AI、实时翻译、设备端LLM。</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">成熟度</p>
                      <p className="text-xs text-muted-foreground">研究阶段；需要针对硬件进行调优。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <h3 className="text-xs text-muted-foreground mb-4 px-3">页面导航</h3>
                <nav className="space-y-3">
                  <a className="nav-item-active block text-sm" href="#core-problems">01. 核心问题</a>
                  <a className="nav-item-inactive block text-sm" href="#methodology">02. 方法 / 路径</a>
                  <a className="nav-item-inactive block text-sm" href="#perspective">博主视角</a>
                  <a className="nav-item-inactive block text-sm" href="#results">03. 关键结果</a>
                  <a className="nav-item-inactive block text-sm" href="#limitations">04. 局限性</a>
                </nav>
              </div>

              <div className="bg-muted/30 p-5 rounded-2xl border border-border">
                <h3 className="text-xs text-muted-foreground mb-4">核心要点</h3>
                <ul className="space-y-3">
                  <li className="text-xs leading-relaxed flex gap-2">
                    <span className="text-primary">●</span>
                    <span className="text-muted-foreground">非对称路由可提前预测94%的专家激活。</span>
                  </li>
                  <li className="text-xs leading-relaxed flex gap-2">
                    <span className="text-primary">●</span>
                    <span className="text-muted-foreground">动态4位/8位量化保持困惑度损失&lt;0.1%。</span>
                  </li>
                  <li className="text-xs leading-relaxed flex gap-2">
                    <span className="text-primary">●</span>
                    <span className="text-muted-foreground">框架使700亿参数模型能在移动端NPU上运行。</span>
                  </li>
                </ul>
                <button className="w-full mt-5 py-2.5 bg-card border border-border text-xs rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-foreground">
                  添加到战略报告
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
