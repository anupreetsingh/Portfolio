const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#game", label: "Game" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur bg-background/70 border-b border-black/10 dark:border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-semibold tracking-tight">
          Anupreet Singh
        </a>
        <ul className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-foreground/70 hover:text-foreground transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}