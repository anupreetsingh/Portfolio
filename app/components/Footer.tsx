const socialLinks = [
  { href: "https://github.com/anupreetsingh", label: "GitHub" },
  { href: "https://www.linkedin.com/in/anupreet-singh-71b1861b8/", label: "LinkedIn" },
  { href: "mailto:anupreet2226579@gmail.com", label: "Email" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full mt-auto border-t border-black/10 dark:border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/70">
        <p>© {year} Anupreet Singh</p>
        <ul className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
