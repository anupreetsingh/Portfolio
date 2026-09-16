/**
 * Ways to reach Anupreet. Single source of truth: the nav's Social menu and
 * the footer both render this list, so adding a platform here surfaces in
 * both places at once.
 *
 * Every entry leaves the site, so all of them open in a new tab — including
 * mailto:, which Chrome resolves to webmail when Gmail is the registered
 * handler and would otherwise navigate the page away.
 */

export type SocialLink = {
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  { label: "Email", href: "mailto:anupreet2226579@gmail.com" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anupreet-singh-71b1861b8/",
  },
  { label: "GitHub", href: "https://github.com/anupreetsingh" },
];

/**
 * Public resume, kept in its own repo so this one carries nothing personal.
 *
 * Deliberately the GitHub blob URL rather than raw.githubusercontent: raw
 * serves PDFs as application/octet-stream, which makes browsers download the
 * file instead of showing it. The blob page renders it inline and offers its
 * own download button, so one link covers both view and download.
 */
export const resumeUrl =
  "https://github.com/anupreetsingh/Public-Resume/blob/main/Anupreet%20Resume.pdf";
