import Link from 'next/link';
import { Search, UserCircle, ArrowRight, ArrowUpRight, ChevronRight, Zap, Database, Cpu, Bell } from 'lucide-react';

export default function Methodologies() {
  return (
    <div className="relative min-h-screen">
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 fixed top-0 w-full z-50">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 text-black">
              <span className="bg-primary w-2 h-6"></span>
              洞察 / INSIGHT
            </Link>
            <nav className="hidden md:flex items-center gap-6 ml-8">
              <Link href="/" className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest hover:text-black transition-colors">Research Analysis</Link>
              <Link href="/methodologies" className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest border-b-2 border-primary pb-1">Methodologies</Link>
              <Link href="/data-tracking" className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest hover:text-black transition-colors">Data Tracking</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-black/5 rounded-full group focus-within:bg-white focus-within:ring-1 focus-within:ring-primary transition-all">
              <Search className="text-black/40 w-5 h-5 group-focus-within:text-primary" />
              <input className="bg-transparent border-none focus:ring-0 outline-none text-sm font-label w-64 p-0 placeholder:text-black/30" placeholder="Search lineage..." type="text" />
            </div>
            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-black/5 relative">
              <Bell className="text-black/60 w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-black/5">
              <UserCircle className="text-black/60 w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-8 max-w-[1800px] mx-auto">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Domain Analysis
          </div>
          <h1 className="text-5xl font-black tracking-tight text-black mb-6 leading-[1.1]">Inference Acceleration Ecosystem</h1>
          <p className="text-lg text-black/60 max-w-3xl leading-relaxed">
            Tracing the evolutionary path of techniques designed to reduce latency and memory footprint in Large Language Models.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 relative">
            <div className="absolute left-[27px] top-4 bottom-0 w-px bg-black/10"></div>

            <div className="relative pl-16 mb-12 group">
              <div className="absolute left-[23px] top-6 w-2.5 h-2.5 rounded-full bg-black/20 border-2 border-white group-hover:bg-primary transition-colors"></div>
              <div className="bg-white p-8 terminal-border shadow-sm group-hover:border-primary/50 transition-colors">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest">2023.Q2</span>
                  <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest">FlashAttention-2</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Foundation</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-black mb-4">The IO-Aware Revolution</h3>
                <p className="text-black/60 mb-8 leading-relaxed">
                  Shifted the bottleneck from FLOPs to memory bandwidth. By fusing attention operations and minimizing HBM reads/writes, it set the new standard for all subsequent transformer implementations.
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-black/40" />
                    <span className="text-xs font-bold text-black">2.8x Speedup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-black/40" />
                    <span className="text-xs font-bold text-black">O(N) Memory</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                    View Lineage <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative pl-16 mb-12 group">
              <div className="absolute left-[23px] top-6 w-2.5 h-2.5 rounded-full bg-black/20 border-2 border-white group-hover:bg-primary transition-colors"></div>
              <div className="bg-white p-8 terminal-border shadow-sm group-hover:border-primary/50 transition-colors">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest">2023.Q4</span>
                  <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest">PagedAttention</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Systems</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-black mb-4">The Memory Virtuoso (vLLM)</h3>
                <p className="text-black/60 mb-8 leading-relaxed">
                  Inspired by OS virtual memory, it fragments the KV cache into non-contiguous blocks. This nearly eliminated memory fragmentation and allowed for massive batch size increases in serving scenarios.
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-black/40" />
                    <span className="text-xs font-bold text-black">+40% Batch Size</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                    View Lineage <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative pl-16 mb-12 group">
              <div className="absolute left-[21px] top-6 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white"></div>
              <div className="bg-white p-8 terminal-border shadow-sm border-l-4 border-l-primary">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest">2024.Q1</span>
                  <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black/60 uppercase tracking-widest">DeepSeek-V2 / V3</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Architecture</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-black mb-4">Sparse Intelligence & Latent Attention</h3>
                <p className="text-black/60 mb-8 leading-relaxed">
                  Combines Multi-Head Latent Attention (MLA) to drastically compress the KV cache with a highly efficient MoE routing mechanism. Represents the current frontier of algorithmic efficiency.
                </p>
                <div className="flex items-center gap-8 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-black/40" />
                    <span className="text-xs font-bold text-black">-90% KV Cache</span>
                  </div>
                  <a href="#" className="ml-auto text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                    Analyze Paper <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-8 terminal-border shadow-sm">
                <h4 className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-[0.2em] mb-8">Strategic Matrix</h4>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-black">Hardware Utilization</span>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">High</span>
                    </div>
                    <p className="text-xs text-black/60 leading-relaxed">Focus has shifted from purely algorithmic improvements to co-designing with GPU memory hierarchies (SRAM vs HBM).</p>
                  </div>
                  
                  <div className="pt-6 border-t border-black/5">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-black">Quantization Limits</span>
                      <span className="text-[10px] font-mono font-bold text-black/60 bg-black/5 px-2 py-0.5 rounded uppercase tracking-widest">Plateauing</span>
                    </div>
                    <p className="text-xs text-black/60 leading-relaxed">INT4/FP8 are becoming standard. Sub-4-bit quantization shows diminishing returns without significant accuracy degradation.</p>
                  </div>

                  <div className="pt-6 border-t border-black/5">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-black">Next Frontier</span>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">Emerging</span>
                    </div>
                    <p className="text-xs text-black/60 leading-relaxed">Speculative decoding and continuous batching combined with sparse architectures (MoE).</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 terminal-border shadow-sm">
                <h4 className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-[0.2em] mb-6">Key Contributors</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-3 rounded hover:bg-black/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-black/5 flex items-center justify-center text-[10px] font-mono font-bold text-black/60">TD</div>
                      <span className="text-sm font-bold text-black group-hover:text-primary transition-colors">Tri Dao</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-primary transition-colors" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded hover:bg-black/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-black/5 flex items-center justify-center text-[10px] font-mono font-bold text-black/60">WK</div>
                      <span className="text-sm font-bold text-black group-hover:text-primary transition-colors">Woosuk Kwon</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-white border-t border-black/5 py-12 px-8 mt-20">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/40">
            © 2024 Insight Technical Intelligence · Research Node #772
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-primary transition-colors" href="#">API Documentation</a>
            <a className="font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-primary transition-colors" href="#">System Status</a>
            <a className="font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-primary transition-colors" href="#">Privacy Protocol</a>
            <a className="font-mono text-[10px] uppercase tracking-widest text-black/40 hover:text-primary transition-colors" href="#">RSS Feed</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
