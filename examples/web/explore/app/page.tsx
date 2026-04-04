import Link from 'next/link';
import { Search, UserCircle, LayoutDashboard, Brain, Component, Cpu, PenTool, FileText, Code, ChevronUp, ChevronDown, Link as LinkIcon, MessageSquare, TrendingUp, ArrowUpRight, BarChart2, Network, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 fixed top-0 w-full z-50">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-8">
            <div className="text-xl font-black tracking-tighter flex items-center gap-2">
              <span className="bg-primary w-2 h-6"></span>
              洞察 / INSIGHT
            </div>
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-black/5 rounded-full group focus-within:bg-white focus-within:ring-1 focus-within:ring-primary transition-all">
              <Search className="text-black/40 w-5 h-5 group-focus-within:text-primary" />
              <input className="bg-transparent border-none focus:ring-0 outline-none text-sm font-label w-64 p-0 placeholder:text-black/30" placeholder="Search across all technical papers..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">Global Intelligence Sync</span>
              <span className="text-xs font-mono font-medium">MAY 24, 2024 · 14:32 UTC</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-black/5">
              <UserCircle className="text-black/60 w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-8 max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-10">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-10">
            <section>
              <h3 className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-[0.2em] mb-6">Discovery Filters</h3>
              <div className="space-y-1">
                <a className="flex items-center justify-between px-3 py-2 bg-primary/5 text-primary rounded-lg font-medium text-sm" href="#">
                  <span className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5" />All Research</span>
                  <span className="text-[10px] font-mono bg-primary/10 px-1.5 rounded">1.2k</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-black/60 hover:bg-black/5 rounded-lg text-sm transition-colors" href="#">
                  <span className="flex items-center gap-2"><Brain className="w-5 h-5" />Large Language Models</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-black/60 hover:bg-black/5 rounded-lg text-sm transition-colors" href="#">
                  <span className="flex items-center gap-2"><Component className="w-5 h-5" />MoE & Sparsity</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-black/60 hover:bg-black/5 rounded-lg text-sm transition-colors" href="#">
                  <span className="flex items-center gap-2"><Cpu className="w-5 h-5" />Inference Systems</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-black/60 hover:bg-black/5 rounded-lg text-sm transition-colors" href="#">
                  <span className="flex items-center gap-2"><PenTool className="w-5 h-5" />Computer Vision</span>
                </a>
              </div>
            </section>
            
            <section>
              <h3 className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-[0.2em] mb-6">Publication Date</h3>
              <div className="space-y-1">
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input defaultChecked className="w-4 h-4 text-primary focus:ring-primary border-black/10 rounded-sm" name="date" type="radio" />
                  <span className="text-sm text-black/60 group-hover:text-black">Past 24 Hours</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-4 h-4 text-primary focus:ring-primary border-black/10 rounded-sm" name="date" type="radio" />
                  <span className="text-sm text-black/60 group-hover:text-black">Past 7 Days</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-4 h-4 text-primary focus:ring-primary border-black/10 rounded-sm" name="date" type="radio" />
                  <span className="text-sm text-black/60 group-hover:text-black">Last 30 Days</span>
                </label>
              </div>
            </section>
            
            <section>
              <h3 className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-[0.2em] mb-6">Elite Authors</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-2 py-1 text-[11px] bg-white border border-black/5 rounded hover:border-primary transition-colors">K. He</button>
                <button className="px-2 py-1 text-[11px] bg-white border border-black/5 rounded hover:border-primary transition-colors">A. Karpathy</button>
                <button className="px-2 py-1 text-[11px] bg-white border border-black/5 rounded hover:border-primary transition-colors">Y. LeCun</button>
                <button className="px-2 py-1 text-[11px] bg-white border border-black/5 rounded hover:border-primary transition-colors">I. Sutskever</button>
              </div>
            </section>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <article className="bg-white p-10 terminal-border border-l-4 border-l-primary mb-12 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary px-3 py-1 text-[10px] text-white font-mono font-bold tracking-widest uppercase">Deep Research Focus</span>
              <span className="text-xs font-mono text-black/40">ARXIV:2405.12345 · 2024.05.23</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-6 leading-[1.1] text-black">DeepSeek-V3: Multi-Head Latent Attention and Mixture-of-Experts with 671B Parameters</h1>
            <p className="text-lg text-black/70 leading-relaxed mb-10 max-w-4xl">
              DeepSeek-V3 represents a paradigm shift in efficient scaling. This work introduces Multi-Head Latent Attention (MLA) and a revolutionary sparse Mixture-of-Experts (MoE) structure that optimizes inference throughput while maintaining state-of-the-art reasoning capabilities across 671B parameters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 border-y border-black/5 py-8">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-primary uppercase">Innovation 01</span>
                <p className="text-sm font-semibold">MLA Architecture reduces KV cache by 90% while increasing throughput by 3.5x.</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-primary uppercase">Innovation 02</span>
                <p className="text-sm font-semibold">Auxiliary-loss-free load balancing solves MoE expert collapse during 2T token training.</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-primary uppercase">Innovation 03</span>
                <p className="text-sm font-semibold">Achieved parity with proprietary models (GPT-4o) in competitive coding and math.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/paper/deepseek-v3" className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80">
                <FileText className="w-5 h-5" /> ANALYZE FULL PAPER
              </Link>
              <a className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80" href="#">
                <Code className="w-5 h-5" /> VIEW IMPLEMENTATION
              </a>
            </div>
          </article>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-mono font-bold text-black/40 uppercase tracking-[0.2em]">Latest Aggregation</h2>
              <div className="flex items-center gap-4 text-xs text-black/40">
                <span>Sort by: <button className="text-black font-bold">Recency</button></span>
                <span>Display: <button className="text-black font-bold">Dense</button></span>
              </div>
            </div>

            {[
              {
                votes: 412,
                tag: 'Inference',
                time: '3H AGO',
                title: 'FlashAttention-3: Fast and Accurate Attention with Asynchrony',
                desc: 'Exploiting Hopper GPU hardware features via WGMMA and TMA to achieve asynchronous overlap of computation and memory loads.',
                arxiv: '2405.0982',
                comments: 12
              },
              {
                votes: 285,
                tag: 'Architecture',
                time: '5H AGO',
                title: 'Mamba-2: Compressing the Future of Sequence Modeling',
                desc: 'The evolution of state-space models with refined gate mechanisms and superior long-context memory retrieval compared to traditional attention mechanisms.',
                arxiv: '2405.0211',
                comments: 8
              },
              {
                votes: 156,
                tag: 'Systems',
                time: '8H AGO',
                title: 'Scaling Laws for Precision-Efficient Training',
                desc: 'An empirical study on how FP8 and INT8 quantization impact the scaling laws of multi-trillion parameter models during pre-training phases.',
                arxiv: '2405.0110',
                comments: 5
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 terminal-border card-hover flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0 flex flex-col items-center gap-1 w-12 text-black/30">
                  <ChevronUp className="w-5 h-5 cursor-pointer hover:text-primary" />
                  <span className="text-xs font-mono font-bold text-black">{item.votes}</span>
                  <ChevronDown className="w-5 h-5 cursor-pointer hover:text-black" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-black/5 px-2 py-0.5 rounded text-black/60 uppercase">{item.tag}</span>
                    <span className="text-[10px] font-mono text-black/30">{item.time}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                  <p className="text-sm text-black/60 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-primary">
                      <LinkIcon className="w-3.5 h-3.5" /> ARXIV:{item.arxiv}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-black/40">
                      <MessageSquare className="w-3.5 h-3.5" /> {item.comments} COMMENTS
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-4 border-2 border-dashed border-black/10 rounded-xl text-black/40 font-mono text-sm hover:border-primary hover:text-primary transition-all">
            LOAD PREVIOUS DAY AGGREGATION
          </button>
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          <Link href="/methodologies" className="block bg-white p-6 terminal-border card-hover group">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <TrendingUp className="text-primary w-5 h-5" />
                Weekly Trends
              </h4>
              <ArrowUpRight className="text-black/20 group-hover:text-primary transition-colors w-5 h-5" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-black/60">Inference Accel.</span>
                <span className="font-mono text-[10px] text-primary">+12k pts</span>
              </div>
              <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <div className="bg-primary w-[85%] h-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-black/60">Sparse Autoenc.</span>
                <span className="font-mono text-[10px] text-primary">+8.9k pts</span>
              </div>
              <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <div className="bg-primary w-[62%] h-full"></div>
              </div>
            </div>
          </Link>

          <Link href="/data-tracking" className="block bg-white p-6 terminal-border card-hover group">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <BarChart2 className="text-primary w-5 h-5" />
                Data Tracking
              </h4>
              <ArrowUpRight className="text-black/20 group-hover:text-primary transition-colors w-5 h-5" />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono text-black/40 uppercase">arXiv Papers/Day</span>
                  <span className="text-[10px] font-mono text-primary font-bold">+24.2%</span>
                </div>
                <div className="h-10 flex items-end gap-1">
                  <div className="bg-primary/20 w-full h-[40%]"></div>
                  <div className="bg-primary/20 w-full h-[60%]"></div>
                  <div className="bg-primary/20 w-full h-[45%]"></div>
                  <div className="bg-primary/20 w-full h-[75%]"></div>
                  <div className="bg-primary/20 w-full h-[65%]"></div>
                  <div className="bg-primary w-full h-[95%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono text-black/40 uppercase">Top 10 Repo Stars</span>
                  <span className="text-[10px] font-mono text-primary font-bold">+3.2k</span>
                </div>
                <div className="h-10 flex items-end gap-1">
                  <div className="bg-primary/20 w-full h-[20%]"></div>
                  <div className="bg-primary/20 w-full h-[35%]"></div>
                  <div className="bg-primary/20 w-full h-[50%]"></div>
                  <div className="bg-primary/20 w-full h-[40%]"></div>
                  <div className="bg-primary/20 w-full h-[70%]"></div>
                  <div className="bg-primary w-full h-[85%]"></div>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 terminal-border shadow-sm">
            <h4 className="font-bold text-sm mb-6 flex items-center gap-2 text-black/40">
              <Network className="w-5 h-5" />
              TECHNICAL EVOLUTION
            </h4>
            <div className="space-y-4">
              <a className="flex items-center justify-between group" href="#">
                <span className="text-xs font-medium group-hover:text-primary transition-colors">Inference Acceleration Panorama</span>
                <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-primary" />
              </a>
              <a className="flex items-center justify-between group" href="#">
                <span className="text-xs font-medium group-hover:text-primary transition-colors">MoE Architecture History</span>
                <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-primary" />
              </a>
              <a className="flex items-center justify-between group" href="#">
                <span className="text-xs font-medium group-hover:text-primary transition-colors">Quantization Theory Roadmap</span>
                <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-primary" />
              </a>
            </div>
          </div>

          <div className="bg-black p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h5 className="text-white font-bold text-lg mb-3">Intelligence Terminal</h5>
              <p className="text-white/50 text-[11px] mb-6 leading-relaxed">Daily deep-dives and market intelligence reports automatically curated for the AI researcher.</p>
              <button className="w-full py-3 bg-primary text-white font-mono font-bold text-xs rounded hover:brightness-110 transition-all shadow-[0_10px_20px_-10px_rgba(0,82,255,0.4)]">
                SUBSCRIBE TO DIGEST
              </button>
            </div>
          </div>
        </aside>
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
