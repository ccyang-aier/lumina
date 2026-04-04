import Image from 'next/image';
import { CloudDownload } from 'lucide-react';

export default function PaperDetails() {
  return (
    <div className="bg-background font-sans selection:bg-primary/10 selection:text-primary min-h-screen">
      <div className="reading-progress-bar"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-6 items-center">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase tracking-widest rounded-sm border border-primary/20">Inference Acceleration</span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase tracking-widest rounded-sm">arXiv:2403.1524</span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase tracking-widest rounded-sm">Technical Paper</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-8">
                Optimizing Quantized Mixture-of-Experts for Ultra-Low Latency Inference
              </h1>
              <div className="pl-6 border-l-[3px] border-primary py-2">
                <p className="text-xl text-primary font-medium leading-relaxed">
                  A novel framework achieving 4.2x speedup in MoE routing efficiency without compromising perceptual quality on edge devices.
                </p>
              </div>
            </header>

            <article className="main-content">
              <section className="mb-16" id="core-problems">
                <h2 className="text-2xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">01.</span>
                  核心问题 (Core Problems)
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p>Current Mixture-of-Experts (MoE) architectures face a significant bottleneck during inference: the dynamic routing mechanism introduces non-deterministic memory access patterns. Specifically, when deploying on hardware with limited SRAM, the constant switching between specialized experts leads to severe cache thrashing.</p>
                  <p>Additionally, weight quantization in MoE models often results in heterogeneous precision requirements across different experts, which traditional uniform quantization fails to address.</p>
                </div>
              </section>

              <section className="mb-16" id="methodology">
                <h2 className="text-2xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">02.</span>
                  方法 / 技术路径 (Method/Technical Path)
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p>The researchers propose <strong className="text-foreground">&quot;Insight-MoE&quot;</strong>, a tiered-expert allocation strategy. The technical path involves three primary stages:</p>
                  <ul className="list-none space-y-4 pl-4">
                    <li className="flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                      <span><strong className="text-foreground">Asymmetric Routing:</strong> Implementing a priority-based dispatcher that predicts expert activation with 94% accuracy before full token computation.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span>
                      <span><strong className="text-foreground">Expert-Aware Quantization:</strong> Using a dynamic sensitivity map to apply 4-bit quantization to sparse experts and 8-bit to &quot;anchor&quot; experts.</span>
                    </li>
                  </ul>
                  <div className="bg-muted p-6 rounded-xl overflow-x-auto my-8 border border-border">
                    <code className="font-mono text-sm text-primary block leading-relaxed whitespace-pre">
{`# Technical Snippet: Routing Optimization
def insight_router(token, experts, threshold=0.85):
    probs = softmax(linear_projection(token))
    if max(probs) > threshold:
        return load_expert(argmax(probs))
    return top_k_experts(probs, k=2)`}
                    </code>
                  </div>
                </div>
              </section>

              <section className="mb-16 p-8 bg-primary/[0.04] dark:bg-primary/[0.08] rounded-2xl border-l-4 border-primary" id="perspective">
                <div className="flex items-center gap-4 mb-6">
                  <Image alt="Blogger Avatar" width={48} height={48} className="w-12 h-12 rounded-full object-cover grayscale border border-border" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-vXCXNbgxbdW2cy5glxuPiCXujcTXdJbDIOVgxuD2_d6hze1RTZU98WaxVeNiWU5PPVyhyCcvz8mcTe_erw_Exwew6fF1DK_EQEBCyPQV2-6FoUxj69usHa0SYMaSt-pI8DQLB0ZCloDjto0NibTKDdJU2I8k3ZjZz_CRX9oYY8uB-x6_h00YyDdpIFcmIJ9Gqm8qDaKLCeKRuRZb8lOsgB4bkI7PvbGij1-lpU-ot6aQdeHVWIJaZ27b77_Ju6A91_RR1i_BF37O" />
                  <div>
                    <h4 className="font-bold text-foreground">博主视角 (Blogger&apos;s Perspective)</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Lead Research Analyst</p>
                  </div>
                </div>
                <div className="italic text-muted-foreground leading-relaxed">
                  &quot;This paper is a significant departure from standard MoE research. While everyone is focused on scaling up, this team is scaling &apos;in&apos;. The asymmetric routing logic reminds me of early cache-prediction algorithms in CPU design—proving that old hardware tricks still hold immense value in the age of LLMs.&quot;
                </div>
              </section>

              <section className="mb-16" id="results">
                <h2 className="text-2xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">03.</span>
                  关键结果 (Key Results)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Throughput</p>
                    <p className="text-4xl font-bold text-primary">+4.2x</p>
                    <p className="text-xs text-muted-foreground mt-2">Versus baseline FP16 MoE</p>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Perplexity</p>
                    <p className="text-4xl font-bold text-primary">&lt; 0.1%</p>
                    <p className="text-xs text-muted-foreground mt-2">Quality degradation after quantization</p>
                  </div>
                </div>
              </section>

              <section className="mb-24" id="limitations">
                <h2 className="text-2xl section-title text-foreground flex items-center gap-3">
                  <span className="font-mono text-primary text-sm">04.</span>
                  局限性 / 未来方向 (Limitations)
                </h2>
                <p className="text-muted-foreground mb-12">
                  While impressive, the approach requires a pre-profiling step on target hardware, which limits its &quot;out-of-the-box&quot; generalizability for heterogeneous cloud environments.
                </p>
                <div className="flex gap-4">
                  <button className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all cursor-pointer">
                    Read Original Paper <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </button>
                  <button className="px-6 py-4 rounded-xl border border-border hover:bg-muted transition-all cursor-pointer">
                    <CloudDownload className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </section>
            </article>

            <div className="mt-12 pt-12 border-t border-border">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-10">Related Intelligence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group cursor-pointer">
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-muted relative">
                    <Image fill alt="Related" className="w-full h-full object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZOXSe3NvuMdh2ancXTCUPxYV5VKAKhVRdEIlZgd7-FqeL-HYiyYtJ-eG273R1Z5Vx4_DiqlmlxAAFtVXTiv-uAu9V-fO6HssuW1SgNHdHrtMuqQDE-6NE2xwcFbgzdQf8ma95h_RJzKaZcuXdzv4m9RykVpNDLUhF9B2pdCieS64tOUB72e3ibRuACoRgtgw6GH2BJEq0r54JPOZ8Iypht1AASgAvBFnc7ndkBIk2U1bUEISq2VCLRDs5yCGbpIO3JlBJXmnfmS5M" />
                  </div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary text-foreground">Cross-Attention Efficiency in Vision Transformers</h4>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-muted relative">
                    <Image fill alt="Related" className="w-full h-full object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQXwIIjFM_wvf0y-pyf1IyN9ayY894DZdBH0NLd3gRr5iDqTzCg3L5eFY3P8xbsvFa7TY2Fw1aoQwp4RjqsnBWmd_Z00v-mVX0Zt0HJ1XpYS6EMgn73MU6fAOcZYVc0mXbBv2qWnogqGrmyFKCVrVcL6mhmH_cHag8GU_1Ftr5hX5Cx15xUhYeMGW72TB-70v3YEiK8_C9wjTu-F6H3NA5r36R0nZ274P5lS50SGMABZAAjSmoedqp4rXwXApSh4bu-qHXIIzRbhJp" />
                  </div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary text-foreground">Hardware Acceleration for Sparse Matrices</h4>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-muted relative">
                    <Image fill alt="Related" className="w-full h-full object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdmzcYU0boZHhMdJVb7kmfBdhh__ehRHIWxMSG2dsaBl6cpjZDItkJ1p5-VedC3ak97i-N0pCqlVgQSW3YB1QyCA9n6JE-cRleKbEORVZXMpDk6uzejqvkpcY_bW2qX1hhHVAb8LniNP4uA1FkWNY2OKxdWPvFj6wDMLElIG8XsZrPXmqiHTPcK3ygwOxuDEuP_r4Bd5dVco12WEdRYSJNMKrBuqvuESvdAJzWea2wZy3xnGn1R8GAgtSKbzFwetZjZjIaZdIIIsvc" />
                  </div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary text-foreground">Decoding Latent Representations</h4>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sidebar-sticky space-y-8 sticky">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">Executive Brief</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Immediate Impact</p>
                      <p className="text-xs text-muted-foreground">Reduces infrastructure costs by 60% for MoE deployment.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Target Market</p>
                      <p className="text-xs text-muted-foreground">Edge AI, Real-time translation, On-device LLMs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Maturity Level</p>
                      <p className="text-xs text-muted-foreground">Research phase; requires hardware-specific tuning.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6 px-4">Dashboard Navigation</h3>
                <nav className="space-y-4">
                  <a className="nav-item-active block text-sm" href="#core-problems">01. Core Problems</a>
                  <a className="nav-item-inactive block text-sm" href="#methodology">02. Method / Path</a>
                  <a className="nav-item-inactive block text-sm" href="#perspective">Perspective</a>
                  <a className="nav-item-inactive block text-sm" href="#results">03. Key Results</a>
                  <a className="nav-item-inactive block text-sm" href="#limitations">04. Limitations</a>
                </nav>
              </div>

              <div className="bg-muted p-6 rounded-2xl border border-border">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">Core Intel</h3>
                <ul className="space-y-4">
                  <li className="text-xs leading-relaxed flex gap-3">
                    <span className="text-primary font-bold">●</span>
                    <span className="text-muted-foreground">Asymmetric routing predicts 94% of expert activations ahead of time.</span>
                  </li>
                  <li className="text-xs leading-relaxed flex gap-3">
                    <span className="text-primary font-bold">●</span>
                    <span className="text-muted-foreground">Dynamic 4-bit/8-bit quantization maintains &lt;0.1% perplexity loss.</span>
                  </li>
                  <li className="text-xs leading-relaxed flex gap-3">
                    <span className="text-primary font-bold">●</span>
                    <span className="text-muted-foreground">Framework enables 70B parameter models to run on mobile NPUs.</span>
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-card border border-border text-xs font-bold rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-foreground">
                  Add to Strategy Report
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
