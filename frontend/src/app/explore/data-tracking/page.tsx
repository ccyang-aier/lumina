import { TrendingUp, Network } from 'lucide-react';

export default function DataTrackingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-primary px-3 py-1 text-[10px] text-primary-foreground font-mono font-bold tracking-widest uppercase">Live Metrics</span>
              <span className="text-xs font-mono text-muted-foreground">NODE #772 · ACTIVE</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-[1.1] text-foreground">Academic Data Tracking</h1>
            <p className="text-sm font-mono text-muted-foreground mt-4">Real-time metrics across 14,203 indexed papers and 892 repositories.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-card border border-border rounded text-[10px] font-mono font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-all cursor-pointer">Export CSV</button>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded text-[10px] font-mono font-bold tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_10px_20px_-10px_rgba(0,195,255,0.4)] cursor-pointer">Generate Report</button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-card p-8 terminal-border shadow-sm xl:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Submission Volume Trends
              </h3>
              <select className="bg-muted border-none text-[10px] font-mono font-bold uppercase tracking-widest rounded px-3 py-2 outline-none text-muted-foreground focus:ring-1 focus:ring-primary cursor-pointer">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <path d="M0,150 Q100,120 200,140 T400,100 T600,80 T800,40 L800,200 L0,200 Z" fill="url(#gradient)" opacity="0.1" />
                <path d="M0,150 Q100,120 200,140 T400,100 T600,80 T800,40" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
                <circle cx="200" cy="140" r="4" className="fill-background stroke-primary stroke-2" />
                <circle cx="400" cy="100" r="4" className="fill-background stroke-primary stroke-2" />
                <circle cx="600" cy="80" r="4" className="fill-background stroke-primary stroke-2" />
                <circle cx="800" cy="40" r="4" className="fill-background stroke-primary stroke-2" />
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-mono text-muted-foreground pt-4 border-t border-border uppercase tracking-widest">
                <span>May 01</span>
                <span>May 08</span>
                <span>May 15</span>
                <span>May 22</span>
                <span>May 29</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 terminal-border shadow-sm flex flex-col">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              Keyword Evolution
            </h3>
            <div className="flex-1 flex flex-col justify-center gap-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">Mixture of Experts</span>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">+142%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary w-[85%] h-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">KV Cache Compression</span>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">+89%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary w-[65%] h-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">State Space Models</span>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">+215%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary w-[95%] h-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-card terminal-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-border flex justify-between items-center">
              <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">Key Publication Digest</h3>
              <button className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-8 py-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Paper ID</th>
                    <th className="px-8 py-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Domain</th>
                    <th className="px-8 py-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Impact Score</th>
                    <th className="px-8 py-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-5 text-xs font-mono font-bold text-primary">ARXIV:2405.123</td>
                    <td className="px-8 py-5 text-sm font-medium text-foreground">LLM Architecture</td>
                    <td className="px-8 py-5 text-xs font-mono text-foreground">98.4</td>
                    <td className="px-8 py-5"><TrendingUp className="w-4 h-4 text-primary" /></td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-5 text-xs font-mono font-bold text-primary">ARXIV:2405.098</td>
                    <td className="px-8 py-5 text-sm font-medium text-foreground">Vision-Language</td>
                    <td className="px-8 py-5 text-xs font-mono text-foreground">92.1</td>
                    <td className="px-8 py-5"><TrendingUp className="w-4 h-4 text-primary" /></td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-5 text-xs font-mono font-bold text-primary">ARXIV:2405.045</td>
                    <td className="px-8 py-5 text-sm font-medium text-foreground">Alignment</td>
                    <td className="px-8 py-5 text-xs font-mono text-foreground">88.7</td>
                    <td className="px-8 py-5"><TrendingUp className="w-4 h-4 text-muted-foreground/30" /></td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-5 text-xs font-mono font-bold text-primary">ARXIV:2404.882</td>
                    <td className="px-8 py-5 text-sm font-medium text-foreground">Agent Systems</td>
                    <td className="px-8 py-5 text-xs font-mono text-foreground">85.2</td>
                    <td className="px-8 py-5"><TrendingUp className="w-4 h-4 text-primary" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card p-8 terminal-border shadow-sm">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Research Domain Mapping</h3>
            <div className="relative h-72 w-full bg-muted/30 rounded border border-border overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="absolute top-[20%] left-[30%] w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                <span className="text-xs font-bold text-primary text-center leading-tight">Foundation<br/>Models</span>
              </div>
              
              <div className="absolute top-[50%] left-[60%] w-20 h-20 bg-muted rounded-full flex items-center justify-center border border-border backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight uppercase tracking-widest">Agent<br/>Sim</span>
              </div>
              
              <div className="absolute top-[60%] left-[20%] w-24 h-24 bg-muted rounded-full flex items-center justify-center border border-border backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight uppercase tracking-widest">Efficient<br/>Inference</span>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="38%" y1="38%" x2="62%" y2="52%" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="32%" y1="42%" x2="28%" y2="62%" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
            <div className="mt-6 flex justify-center gap-6">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">High Activity</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground/30"></span><span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Emerging</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground/20"></span><span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Steady Growth</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
