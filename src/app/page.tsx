import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <Section id="about" title="About">
        <div className="flex max-w-2xl flex-col gap-4 leading-8 text-foreground/80">
          <p>
            I&apos;m a Computer Science master&apos;s student at UMBC and a Data
            AI Intern, focused on AI &amp; LLMs &mdash; building RAG pipelines,
            agentic tools, and the backends that serve them.
          </p>
          <p>
            I&apos;m just as at home across the full stack, with React, Node,
            Java, and Python. Most of what&apos;s below started as a research
            question and turned into something you can run.
          </p>
        </div>
      </Section>

      <Skills />
      <Projects />
    </main>
  );
}
