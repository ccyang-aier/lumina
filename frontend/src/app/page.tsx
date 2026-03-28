import { Hero } from "@/components/home/Hero";
import dynamic from "next/dynamic";

const Showcase = dynamic(() => import("@/components/home/Showcase").then((mod) => mod.Showcase));
const KnowledgeSection = dynamic(() =>
  import("@/components/home/KnowledgeSection").then((mod) => mod.KnowledgeSection)
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <KnowledgeSection />
      <Showcase />
    </div>
  );
}
