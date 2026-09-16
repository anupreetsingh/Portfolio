import { Section } from "@/components/Section";
import { Badge, Chip, Timeline, TimelineItem, TimelineMeta } from "@/components/ui";
import { education } from "@/data/education";

export function Education() {
  return (
    <Section id="education" title="Education">
      {/* Shares Timeline with Experience so the two adjacent sections read as
          a pair. No collapse here — there's nothing to hide. */}
      <Timeline>
        {education.map((entry) => (
          <TimelineItem key={entry.id}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {entry.degree}
              </h3>
              <Badge>GPA {entry.gpa}</Badge>
            </div>

            <p className="mt-1 text-foreground/80">{entry.institution}</p>

            <TimelineMeta period={entry.period} location={entry.location} />

            {entry.coursework && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Coursework
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {entry.coursework.map((course) => (
                    <Chip as="li" key={course}>
                      {course}
                    </Chip>
                  ))}
                </ul>
              </div>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </Section>
  );
}
