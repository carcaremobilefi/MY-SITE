import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Nav() {
  const { t, lang, setLang } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#services", label: t("nav.services") },
    { href: "/#gallery", label: t("nav.gallery") },
    { href: "/#how", label: t("nav.how") },
    { href: "/#faq", label: t("nav.faq") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <div
      className={`inline-flex items-center rounded-full border border-border/70 bg-surface/40 backdrop-blur p-0.5 text-xs font-mono ${className}`}
    >
      {(["en", "fi", "sv"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition ${
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative inline-flex">
            <span className="size-3 rounded-full bg-primary shadow-[0_0_24px_var(--color-primary)] group-hover:scale-125 transition" />
            <span className="absolute inset-0 size-3 rounded-full bg-primary blur-md opacity-70" />
          </span>
          <span className="font-display font-black tracking-tight text-[22px] md:text-[24px] leading-none">
            CARCARE<span className="text-primary">/</span>MOBILE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LangSwitch />
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:shadow-[0_0_30px_var(--color-primary)] transition"
          >
            {t("nav.book")}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center size-10 rounded-full border border-border/70"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="px-5 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-foreground/80 hover:text-primary transition"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center justify-between mt-2">
              <LangSwitch />
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="inline-flex justify-center items-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium"
              >
                {t("nav.book")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
