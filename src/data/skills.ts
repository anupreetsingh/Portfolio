// Canonical list of skills — the single source of truth for the skill filter
// chips on the Projects section. Projects reference a skill by its `id`; the
// chip renders `label`; `category` is used only to group the chips visually.
export const skills = [
  // Languages
  { id: "python", label: "Python", category: "Languages" },
  { id: "typescript", label: "TypeScript", category: "Languages" },
  { id: "java", label: "Java", category: "Languages" },
  { id: "cpp", label: "C/C++", category: "Languages" },
  { id: "sql", label: "SQL", category: "Languages" },

  // AI / ML
  { id: "pytorch", label: "PyTorch", category: "AI / ML" },
  { id: "langchain", label: "LangChain", category: "AI / ML" },
  { id: "crewai", label: "CrewAI", category: "AI / ML" },
  { id: "qdrant", label: "Qdrant", category: "AI / ML" },

  // Web & Backend
  { id: "react", label: "React", category: "Web & Backend" },
  { id: "nodejs", label: "Node.js", category: "Web & Backend" },
  { id: "fastapi", label: "FastAPI", category: "Web & Backend" },
  { id: "spring-boot", label: "Spring Boot", category: "Web & Backend" },
  { id: "mongodb", label: "MongoDB", category: "Web & Backend" },
  { id: "postgresql", label: "PostgreSQL", category: "Web & Backend" },

  // Cloud & DevOps
  { id: "aws", label: "AWS", category: "Cloud & DevOps" },
  { id: "dynamodb", label: "DynamoDB", category: "Cloud & DevOps" },
  { id: "kubernetes", label: "Kubernetes", category: "Cloud & DevOps" },
  { id: "github-actions", label: "GitHub Actions", category: "Cloud & DevOps" },

  // Testing
  { id: "junit", label: "JUnit", category: "Testing" },
  { id: "pytest", label: "pytest", category: "Testing" },
  { id: "jest", label: "Jest", category: "Testing" },
  { id: "selenium", label: "Selenium", category: "Testing" }
] as const;

// A skill's stable id. Projects tag themselves with these IDs, and referencing a non-existent if project references a non-existent skill (exclusive of type SkillId) it returns  a compile-time error.
export type SkillId = (typeof skills)[number]["id"];

// Category names, derived from the data so the list and the type never drift.
export type SkillCategoryName = (typeof skills)[number]["category"];