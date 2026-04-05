import Link from 'next/link';
import { Database, Sparkles, Settings2, Cpu, Layers, Network as NetworkIcon, FileText, Code, ChevronUp, ChevronDown, Link as LinkIcon, TrendingUp, ArrowUpRight, BarChart2, Network, ChevronRight } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-10">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <section>
              <h3 className="text-xs text-muted-foreground mb-4">发现筛选器</h3>
              <div className="space-y-0.5">
                <Link href="/explore" className="flex items-center justify-between px-3 py-2 bg-primary/5 text-primary rounded-lg text-sm">
                  <span className="flex items-center gap-2"><Database className="w-4 h-4" />全部</span>
                </Link>
                <a className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg text-sm transition-all cursor-pointer">
                  <span className="flex items-center gap-2"><Database className="w-4 h-4" />KVCache</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg text-sm transition-all cursor-pointer">
                  <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" />稀疏注意力</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg text-sm transition-all cursor-pointer">
                  <span className="flex items-center gap-2"><Settings2 className="w-4 h-4" />调度优化</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg text-sm transition-all cursor-pointer">
                  <span className="flex items-center gap-2"><Cpu className="w-4 h-4" />推理引擎</span>
                </a>
                <a className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg text-sm transition-all cursor-pointer">
                  <span className="flex items-center gap-2"><Layers className="w-4 h-4" />系统架构</span>
                </a>
              </div>
            </section>
            
            <section>
              <h3 className="text-xs text-muted-foreground mb-4">发布时间</h3>
              <div className="space-y-0.5">
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input defaultChecked className="w-3.5 h-3.5 text-primary focus:ring-primary/50 border-border rounded" name="date" type="radio" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">最近24小时</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-3.5 h-3.5 text-primary focus:ring-primary/50 border-border rounded" name="date" type="radio" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">最近7天</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-3.5 h-3.5 text-primary focus:ring-primary/50 border-border rounded" name="date" type="radio" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">最近一个月</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-3.5 h-3.5 text-primary focus:ring-primary/50 border-border rounded" name="date" type="radio" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">最近一年</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-3.5 h-3.5 text-primary focus:ring-primary/50 border-border rounded" name="date" type="radio" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">最近两年</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer group">
                  <input className="w-3.5 h-3.5 text-primary focus:ring-primary/50 border-border rounded" name="date" type="radio" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">最近三年</span>
                </label>
              </div>
            </section>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <article className="bg-card p-10 terminal-border border-l-4 border-l-primary mb-12 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary px-3 py-1 text-[10px] text-primary-foreground font-mono font-bold tracking-widest uppercase">深度研究聚焦</span>
              <span className="text-xs font-mono text-muted-foreground">ARXIV:2405.12345 · 2024.05.23</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-6 leading-[1.1] text-foreground">DeepSeek-V3：多头潜在注意力与混合专家架构的6710亿参数模型</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-4xl">
              DeepSeek-V3代表了高效扩展范式的转变。该工作引入了多头潜在注意力（MLA）和革命性的稀疏混合专家（MoE）结构，在保持6710亿参数规模下最先进推理能力的同时，优化了推理吞吐量。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 border-y border-border py-8">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-primary uppercase">创新点 01</span>
                <p className="text-sm font-semibold text-foreground">MLA架构将KV缓存减少90%，同时吞吐量提升3.5倍。</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-primary uppercase">创新点 02</span>
                <p className="text-sm font-semibold text-foreground">无辅助损失的负载均衡解决了2T token训练中的MoE专家崩溃问题。</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-primary uppercase">创新点 03</span>
                <p className="text-sm font-semibold text-foreground">在竞技编程和数学任务上达到与专有模型（GPT-4o）相当的水平。</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/explore/deepseek-v3" className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80">
                <FileText className="w-5 h-5" /> 分析完整论文
              </Link>
              <a className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80 cursor-pointer">
                <Code className="w-5 h-5" /> 查看实现代码
              </a>
            </div>
          </article>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm text-muted-foreground">最新聚合</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>排序: <button className="text-foreground cursor-pointer hover:text-primary transition-colors">最新</button></span>
                <span>显示: <button className="text-foreground cursor-pointer hover:text-primary transition-colors">紧凑</button></span>
              </div>
            </div>

            {[
              {
                votes: 412,
                tag: '推理',
                time: '3小时前',
                title: 'FlashAttention-3：基于异步的快速精确注意力机制',
                desc: '利用Hopper GPU硬件特性，通过WGMMA和TMA实现计算与内存加载的异步重叠。',
                arxiv: '2405.0982'
              },
              {
                votes: 285,
                tag: '架构',
                time: '5小时前',
                title: 'Mamba-2：压缩序列建模的未来',
                desc: '状态空间模型的演进，采用改进的门控机制，相比传统注意力机制具有更优的长上下文记忆检索能力。',
                arxiv: '2405.0211'
              },
              {
                votes: 156,
                tag: '系统',
                time: '8小时前',
                title: '精度高效训练的扩展定律',
                desc: '关于FP8和INT8量化如何在预训练阶段影响万亿参数模型扩展定律的实证研究。',
                arxiv: '2405.0110'
              }
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 terminal-border card-hover flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0 flex flex-col items-center gap-1 w-12 text-muted-foreground/40">
                  <ChevronUp className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                  <span className="text-xs font-mono text-muted-foreground">{item.votes}</span>
                  <ChevronDown className="w-5 h-5 cursor-pointer hover:text-muted-foreground transition-colors" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-muted/50 px-2 py-0.5 rounded text-muted-foreground uppercase">{item.tag}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{item.time}</span>
                  </div>
                  <h3 className="text-lg font-medium leading-tight text-foreground hover:text-primary transition-colors cursor-pointer">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.desc}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <a className="flex items-center gap-1.5 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors cursor-pointer" href={`https://arxiv.org/abs/${item.arxiv}`} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="w-3.5 h-3.5" /> ARXIV:{item.arxiv}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground font-mono text-sm hover:border-primary hover:text-primary transition-all cursor-pointer">
            加载前一天的聚合内容
          </button>
        </div>

        <aside className="w-full lg:w-80 space-y-5">
          <Link href="/explore/methodologies" className="block bg-card p-5 terminal-border card-hover group">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="text-primary w-4 h-4 transition-transform group-hover:scale-110" />
                本周趋势
              </h4>
              <ArrowUpRight className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all w-4 h-4" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">推理加速</span>
                <span className="font-mono text-[10px] text-primary">+12k 分</span>
              </div>
              <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
                <div className="bg-primary w-[85%] h-full rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">稀疏自编码器</span>
                <span className="font-mono text-[10px] text-primary">+8.9k 分</span>
              </div>
              <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
                <div className="bg-primary w-[62%] h-full rounded-full"></div>
              </div>
            </div>
          </Link>

          <Link href="/explore/data-tracking" className="block bg-card p-5 terminal-border card-hover group">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm flex items-center gap-2 text-muted-foreground">
                <BarChart2 className="text-primary w-4 h-4 transition-transform group-hover:scale-110" />
                数据追踪
              </h4>
              <ArrowUpRight className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all w-4 h-4" />
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-foreground">arXiv论文/日</span>
                  <span className="text-[10px] font-mono text-primary">+24.2%</span>
                </div>
                <div className="h-10 flex items-end gap-1">
                  <div className="bg-primary/15 w-full h-[40%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[60%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[45%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[75%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[65%] rounded-sm"></div>
                  <div className="bg-primary w-full h-[95%] rounded-sm"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-foreground">Top 10 仓库星标</span>
                  <span className="text-[10px] font-mono text-primary">+3.2k</span>
                </div>
                <div className="h-10 flex items-end gap-1">
                  <div className="bg-primary/15 w-full h-[20%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[35%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[50%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[40%] rounded-sm"></div>
                  <div className="bg-primary/15 w-full h-[70%] rounded-sm"></div>
                  <div className="bg-primary w-full h-[85%] rounded-sm"></div>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-card p-5 terminal-border">
            <h4 className="text-sm mb-5 flex items-center gap-2 text-muted-foreground">
              <Network className="w-4 h-4" />
              技术演进
            </h4>
            <div className="space-y-3">
              <Link className="flex items-center justify-between group py-1.5" href="/explore/methodologies">
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">推理加速全景</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link className="flex items-center justify-between group py-1.5" href="/explore/methodologies">
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">MoE架构发展史</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link className="flex items-center justify-between group py-1.5" href="/explore/methodologies">
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">量化理论路线图</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-foreground p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h5 className="text-background text-base mb-2">智能终端</h5>
              <p className="text-background/50 text-xs mb-5 leading-relaxed">每日深度分析和市场情报报告，为AI研究者自动策划。</p>
              <button className="w-full py-2.5 bg-primary text-primary-foreground font-mono text-xs rounded hover:brightness-110 transition-all shadow-[0_10px_20px_-10px_rgba(0,82,255,0.4)] cursor-pointer">
                订阅摘要
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
