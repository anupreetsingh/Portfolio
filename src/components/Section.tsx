import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="w-full max-w-4xl mx-auto px-6 py-20">
      {title && (
        <h2 className="text-3xl font-semibold tracking-tight mb-8">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}