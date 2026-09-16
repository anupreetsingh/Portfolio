import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <Experience />
      <Education />
      <Skills />
      <Projects />
    </main>
  );
}
