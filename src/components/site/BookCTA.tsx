import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

const PHONE = "+358452599159";
const WHATSAPP = "358452599159";

/**
 * Mobile-only sticky action bar: WhatsApp · Call · Book.
 * Appears after the user scrolls past the hero. Hidden on /book.
 */
export function StickyBookCTA() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);
  const [onBookPage, setOnBookPage] = useState(false);

  useEffect(() => {
    setOnBookPage(window.location.pathname.startsWith("/book"));
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (onBookPage) return null;

  return (
    <div
      className={`md:hidden fixed bottom-4 inset-x-4 z-40 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-stretch gap-2 rounded-full border border-border bg-surface/95 backdrop-blur p-1.5 shadow-2xl">
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("cta.whatsapp")}
          className="flex items-center justify-center size-12 rounded-full bg-[#25D366]/15 text-[#25D366] active:scale-95 transition"
        >
          <MessageCircle className="size-5" />
        </a>
        <a
          href={`tel:${PHONE}`}
          aria-label={t("cta.call")}
          className="flex items-center justify-center size-12 rounded-full bg-primary/15 text-primary active:scale-95 transition"
        >
          <Phone className="size-5" />
        </a>
        <Link
          to="/book"
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 text-sm font-semibold active:scale-[0.98] transition"
        >
          <Calendar className="size-4" />
          {t("nav.book")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/** Inline mid-page CTA banner. Use between major sections. */
export function InlineBookCTA({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { t } = useT();
  if (variant === "compact") {
    return (
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-surface/40 to-surface/40 p-6 md:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display text-xl md:text-2xl font-semibold tracking-tight text-center sm:text-left">
            {t("contact.title1")} {t("contact.title2")}
          </p>
          <Link
            to="/book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:shadow-[0_0_30px_var(--color-primary)] transition whitespace-nowrap"
          >
            {t("nav.book")} <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }
  return null;
}
