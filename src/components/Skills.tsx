import { Section } from "@/components/Section";
import { skills, type SkillCategoryName } from "@/data/skills";

// Fixed display order; anything in skills.ts under a new category would be
// dropped, so keep this in sync when adding one.
const CATEGORY_ORDER: SkillCategoryName[] = [
  "Languages",
  "AI / ML",
  "Web & Backend",
  "Cloud & DevOps",
  "Testing",
];

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="grid gap-8 sm:grid-cols-2">
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <dt className="font-mono text-xs uppercase tracking-widest text-accent">
              {category}
            </dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-md bg-surface px-2.5 py-1 text-sm text-foreground/80 ring-1 ring-foreground/10"
                  >
                    {skill.label}
                  </span>
                ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
