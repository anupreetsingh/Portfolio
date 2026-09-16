import { socialLinks, type SocialLink } from "@/data/social";

/**
 * The nav's Social menu offers the *action* ("Email" → opens a compose
 * window), so the footer offers the *information* instead: the address itself,
 * readable and copyable without triggering a mail client. Derived from the
 * href so the two can't disagree.
 */
function footerLabel(link: SocialLink) {
  return link.href.startsWith("mailto:")
    ? link.href.slice("mailto:".length)
    : link.label;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="w-full mt-auto border-t border-foreground/10">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/70">
        <p>© {year} Anupreet Singh</p>
        {/* Wraps because the spelled-out address is long on narrow screens. */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {footerLabel(link)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
