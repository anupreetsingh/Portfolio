import { Section } from "@/components/Section";
import { education } from "@/data/education";

export function Education() {
  return (
    <Section id="education" title="Education">
      {/* Same timeline treatment as Experience so the two adjacent sections
          read as a pair. No collapse here — there's nothing to hide. */}
      <ol className="relative border-l border-foreground/15 pl-6 sm:pl-8">
        {education.map((entry) => (
          <li key={entry.id} className="pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[5px] mt-2.5 h-[9px] w-[9px] rounded-full bg-foreground/30 ring-4 ring-background"
            />

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {entry.degree}
              </h3>
              <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60 ring-1 ring-foreground/10">
                GPA {entry.gpa}
              </span>
            </div>

            <p className="mt-1 text-foreground/80">{entry.institution}</p>

            <p className="mt-1 font-mono text-xs text-foreground/50">
              {entry.period} · {entry.location}
            </p>

            {entry.coursework && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Coursework
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {entry.coursework.map((course) => (
                    <li
                      key={course}
                      className="rounded-md bg-surface px-2.5 py-1 text-sm text-foreground/80 ring-1 ring-foreground/10"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
