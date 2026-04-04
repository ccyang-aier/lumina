import { ArrowRight, ArrowUpRight, ChevronRight, Zap, Database, Cpu } from 'lucide-react';

export default function MethodologiesPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse"></span>
            领域分析
          </div>
          <h1 className="text-5xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">推理加速生态系统</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            追踪为降低大语言模型延迟和内存占用而设计的技术演进路径。
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 relative">
            <div className="absolute left-[27px] top-4 bottom-0 w-px bg-border"></div>

            <div className="relative pl-16 mb-12 group">
              <div className="absolute left-[23px] top-6 w-2.5 h-2.5 rounded-full bg-muted-foreground/30 border-2 border-background group-hover:bg-primary transition-colors"></div>
              <div className="bg-card p-8 terminal-border shadow-sm group-hover:border-primary/50 transition-colors">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">2023.Q2</span>
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">FlashAttention-2</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">基础</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">IO感知革命</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  将瓶颈从FLOPs转移到内存带宽。通过融合注意力操作并最小化HBM读写，为所有后续Transformer实现树立了新标准。
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">2.8倍加速</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">O(N) 内存</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer">
                    查看谱系 <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative pl-16 mb-12 group">
              <div className="absolute left-[23px] top-6 w-2.5 h-2.5 rounded-full bg-muted-foreground/30 border-2 border-background group-hover:bg-primary transition-colors"></div>
              <div className="bg-card p-8 terminal-border shadow-sm group-hover:border-primary/50 transition-colors">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">2023.Q4</span>
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">PagedAttention</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">系统</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">内存大师 (vLLM)</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  受操作系统虚拟内存启发，将KV缓存分片为非连续块。这几乎消除了内存碎片，并在服务场景中实现了批量大小的大幅增加。
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">+40% 批量大小</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer">
                    查看谱系 <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative pl-16 mb-12 group">
              <div className="absolute left-[21px] top-6 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background"></div>
              <div className="bg-card p-8 terminal-border shadow-sm border-l-4 border-l-primary">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">2024.Q1</span>
                  <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">DeepSeek-V2 / V3</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">架构</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">稀疏智能与潜在注意力</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  结合多头潜在注意力（MLA）大幅压缩KV缓存，配合高效的MoE路由机制。代表了当前算法效率的前沿。
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">-90% KV缓存</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer">
                    分析论文 <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card p-8 terminal-border shadow-sm">
                <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">战略矩阵</h4>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-foreground">硬件利用率</span>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">高</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">焦点已从纯算法改进转向与GPU内存层次结构（SRAM vs HBM）的协同设计。</p>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-foreground">量化极限</span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-widest">趋缓</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">INT4/FP8正成为标准。4位以下量化在没有显著精度损失的情况下收益递减。</p>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-foreground">下一前沿</span>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">新兴</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">推测解码与连续批处理结合稀疏架构（MoE）。</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 terminal-border shadow-sm">
                <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">关键贡献者</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-3 rounded hover:bg-muted transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground">TD</div>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Tri Dao</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded hover:bg-muted transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground">WK</div>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Woosuk Kwon</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
