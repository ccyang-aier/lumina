import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore - Lumina",
  description: "Explore knowledge and insights",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="explore-theme">
      {children}
    </div>
  );
}
