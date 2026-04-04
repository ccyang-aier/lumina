import { ArrowRight, ArrowUpRight, ChevronRight, Zap, Database, Cpu } from 'lucide-react';

export default function MethodologiesPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse"></span>
            Domain Analysis
          </div>
          <h1 className="text-5xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">Inference Acceleration Ecosystem</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Tracing the evolutionary path of techniques designed to reduce latency and memory footprint in Large Language Models.
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
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Foundation</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">The IO-Aware Revolution</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Shifted the bottleneck from FLOPs to memory bandwidth. By fusing attention operations and minimizing HBM reads/writes, it set the new standard for all subsequent transformer implementations.
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">2.8x Speedup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">O(N) Memory</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer">
                    View Lineage <ArrowRight className="w-3 h-3" />
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
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Systems</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">The Memory Virtuoso (vLLM)</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Inspired by OS virtual memory, it fragments the KV cache into non-contiguous blocks. This nearly eliminated memory fragmentation and allowed for massive batch size increases in serving scenarios.
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">+40% Batch Size</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer">
                    View Lineage <ArrowRight className="w-3 h-3" />
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
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Architecture</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">Sparse Intelligence & Latent Attention</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Combines Multi-Head Latent Attention (MLA) to drastically compress the KV cache with a highly efficient MoE routing mechanism. Represents the current frontier of algorithmic efficiency.
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">-90% KV Cache</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer">
                    Analyze Paper <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card p-8 terminal-border shadow-sm">
                <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Strategic Matrix</h4>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-foreground">Hardware Utilization</span>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">High</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Focus has shifted from purely algorithmic improvements to co-designing with GPU memory hierarchies (SRAM vs HBM).</p>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-foreground">Quantization Limits</span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-widest">Plateauing</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">INT4/FP8 are becoming standard. Sub-4-bit quantization shows diminishing returns without significant accuracy degradation.</p>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-foreground">Next Frontier</span>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">Emerging</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Speculative decoding and continuous batching combined with sparse architectures (MoE).</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 terminal-border shadow-sm">
                <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Key Contributors</h4>
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
