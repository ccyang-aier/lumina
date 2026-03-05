import { Hero } from "@/components/home/Hero";
import { Showcase } from "@/components/home/Showcase";
import { KnowledgeSection } from "@/components/home/KnowledgeSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <KnowledgeSection />
      <Showcase />
    </div>
  );
}
