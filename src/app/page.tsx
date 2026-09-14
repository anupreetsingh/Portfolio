import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <Section id="about" title="About">
        <div className="flex max-w-2xl flex-col gap-4 leading-8 text-foreground/80">
          <p>
            I&apos;m an AI engineer with a master&apos;s in Computer Science from
            UMBC. I build LLM systems &mdash; RAG pipelines, agentic tools, and
            the backends that serve them &mdash; alongside research on emotional
            analysis in text-to-speech.
          </p>
          <p>
            I&apos;m just as at home across the full stack, with React, Node,
            Java, and Python. Most of what&apos;s below started as a research
            question and turned into something you can run.
          </p>
        </div>
      </Section>

      <Experience />
      <Education />
      <Skills />
      <Projects />
    </main>
  );
}
