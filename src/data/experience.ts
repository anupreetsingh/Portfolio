/**
 * Work history, newest first. Array order *is* display order — there's no
 * sorting step, because two roles can be concurrent ("Present") and the
 * intended ordering isn't derivable from the dates alone.
 *
 * Content is the union of both resume drafts. The drafts comment bullets in
 * and out to keep the PDF to one page; the site has no page limit, so every
 * bullet is kept and the stronger of two overlapping claims wins.
 */

export type ExperienceKind = "research" | "industry" | "academic";

export type Experience = {
  /** Stable key for React. */
  id: string;
  role: string;
  org: string;
  /** Linked from the org name when present. */
  orgUrl?: string;
  location: string;
  /** Display string, e.g. "Sep 2026 — Present". Not parsed. */
  period: string;
  kind: ExperienceKind;
  highlights: string[];
};

export const experienceKindLabels: Record<ExperienceKind, string> = {
  research: "Research",
  industry: "Industry",
  academic: "Academic",
};

export const experience: Experience[] = [
  {
    id: "lara-lab",
    role: "Lab Member (External Contributor)",
    org: "LARA Lab, UMBC",
    orgUrl: "https://laramartin.net/lab/",
    location: "Baltimore, MD",
    period: "Sep 2026 — Present",
    kind: "research",
    highlights: [
      "Working on emotional analysis in text-to-speech models with Dr. Lara J. Martin's group, which builds language tools for human-centered AI.",
    ],
  },
  {
    id: "platinum",
    role: "Data AI Intern",
    org: "Platinum Business Services (R&D Team)",
    location: "Catonsville, MD",
    period: "Dec 2025 — Present",
    kind: "industry",
    highlights: [
      "Developed backend services for an AI-native GRC platform that audits an SSP draft for compliance with NIST 800-53, chunking ~1,200 controls into a per-model vector index with linkage metadata tying each chunk to its parent control and sibling clauses — cutting a control-by-control review from days of manual work to under 10 minutes.",
      "Implemented the RAG chat agent with its React interface, marking each control fully, partially, or not satisfied and answering follow-up questions on the unmet ones, with every answer grounded in citations retrieved from the vector index, so no compliance verdict rests on fabricated control text.",
      "Built a priority-ordered fallback across 5 embedding models, re-embedding and re-running low-citation queries against each successive model's vector index to exploit differences in embedding representation and surface SSP evidence missed by higher-priority indexes, raising evidence-backed control assessment accuracy from 64% to 92%.",
      "Diagnosed an out-of-memory failure in that fallback path, tracing it to freshly pulled 4–5 GB model weights lingering in the OS page cache, and fixed it with targeted posix_fadvise eviction, eliminating model-load failures.",
    ],
  },
  {
    id: "pma",
    role: "Software Engineer (AI) Intern",
    org: "PMA",
    location: "Tallahassee, FL",
    period: "Sep 2025 — Dec 2025",
    kind: "industry",
    highlights: [
      "Built an AI-powered PRD review platform in React and Django that compares each uploaded draft PDF against a reference PRD and emits schema-validated gap flags for a human-in-the-loop reviewer to confirm or dismiss, giving a cohort-wide matrix that replaces a read of every draft and cutting feedback-session prep from 8 hours to 2.",
      "Architected a fully serverless review pipeline on AWS — S3 + CloudFront-hosted React SPA, Django on Lambda, DynamoDB, and an SQS-triggered Lambda AI worker — that retries failed analyses off a dead-letter queue and logs per-report model API spend, sustaining 200+ submissions across 5 cohorts at ~$3/month idle cost.",
    ],
  },
  {
    id: "umbc-ga2",
    role: "Graduate Assistant",
    org: "UMBC — Computer Architecture",
    location: "Baltimore, MD",
    period: "Jan 2025 — Jun 2026",
    kind: "academic",
    highlights: [
      "Designed a C++ assignment on virtual memory (testing knowledge of MMU address translation, multi-level page tables, and kernel page-fault handling) and graded coursework in computer architecture for 40+ students.",
      "Graded homework related to pipelining, branch prediction, and cache memory, providing feedback to students on their understanding of these concepts.",
    ],
  },
  {
    id: "umbc-ga1",
    role: "Graduate Assistant",
    org: "UMBC — Software Engineering",
    location: "Baltimore, MD",
    period: "Jan 2025 — Jun 2026",
    kind: "academic",
    highlights: [
      "Mentored 10 student Scrum teams through sprint planning, reviews, and backlog refinement for their projects.",
      "Coordinated between 40 students and stakeholders, keeping all 10 projects on schedule amid evolving requirements.",
    ],
  },
    {
    id: "umbc-ta",
    role: "Teaching Assistant",
    org: "UMBC — Data Structures",
    location: "Baltimore, MD",
    period: "Jan 2025 — Jun 2026",
    kind: "academic",
    highlights: [
      "Developed 200+ unit tests for the DSA projects on linked lists, self-balancing trees, heaps, and hash tables, automating logic checking and reducing grading time by 80%.",
      "Helped 50+ students design and debug C++ projects implementing core data structures, and graded their homework..",
      "Held office hours to clarify technical concepts and translate assignment and project requirements into actionable implementation steps."
    ],
  },
  {
    id: "turfco",
    role: "Full Stack Developer",
    org: "Turfco Landscape Co.",
    location: "Surrey, BC",
    period: "Jan 2023 — Jun 2024",
    kind: "industry",
    highlights: [
      "Architected a self-serve quoting platform that priced jobs with deterministic multi-stage evaluation, JSONB-encoded conditions, per-quote audit trails of every rule applied, and a write-invalidated Redis cache — all driven by rules editable from an admin console instead of a developer deploy, cutting quote turnaround from ~2 days to under a minute.",
      "Built the online ordering and booking platform, taking self-serve orders through Stripe Checkout deposits, confirming them with signature-verified idempotent webhooks, and relaying a transactional outbox to Kafka workers for order confirmation, customer notification, and crew allocation — taking $600K+ in online bookings across ~1,100 orders.",
      "Delivered the React SPA that carried a customer from property details to instant estimate to paid deposit in one client-routed flow, with role-gated admin routes and JWT access tokens backed by httpOnly refresh cookies, enabling ~40% of bookings to happen outside office hours without phone support.",
      "Designed and deployed the AWS architecture that took the business off a WordPress brochure site — SPA on CloudFront, autoscaling Express tier behind an ALB across two AZs, Multi-AZ RDS — sized for ~10× seasonal peaks and load-tested to ~50 quote requests/sec at <120 ms p99 with zero-downtime rolling deploys.",
    ],
  },
];
