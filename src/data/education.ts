/**
 * Degrees, newest first. Kept out of the experience timeline on purpose —
 * interleaving degrees with roles clutters both, and the two sections sit
 * next to each other anyway.
 */

export type Education = {
  /** Stable key for React. */
  id: string;
  degree: string;
  institution: string;
  location: string;
  /** Display string. Not parsed. */
  period: string;
  /** Rendered verbatim, so the scale travels with the number. */
  gpa: string;
  /** Union of both resume drafts — the later one trims for page length. */
  coursework?: string[];
};

export const education: Education[] = [
  {
    id: "umbc-ms",
    degree: "Master of Science in Computer Science",
    institution: "University of Maryland, Baltimore County",
    location: "Baltimore, MD",
    period: "Aug 2024 — May 2026",
    gpa: "3.8 / 4.0",
    coursework: [
      "AI & LLMs",
      "Distributed System Design",
      "Data Structures & Algorithms",
      "Software Engineering (SDLC)",
      "Object Oriented Design",
      "Computer Architecture",
    ],
  },
  {
    id: "iiit-btech",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Indian Institute of Information Technology, Sonepat",
    location: "Haryana, India",
    period: "Aug 2019 — May 2023",
    gpa: "8.45 / 10",
  },
];
