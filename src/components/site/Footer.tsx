import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary shadow-[0_0_18px_var(--color-primary)]" />
            <span className="font-display font-semibold text-lg">
              CARCARE<span className="text-primary">/</span>MOBILE
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">{t("footer.about")}</p>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="text-foreground font-medium">{t("footer.contact")}</p>
          <a href="mailto:info@carcaremobilefi.com" className="block hover:text-primary transition">info@carcaremobilefi.com</a>
          <a href="tel:+358452599159" className="block hover:text-primary transition">+358 45 259 9159</a>
          <p>{t("footer.location")}</p>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="text-foreground font-medium">{t("footer.hours")}</p>
          <p>{t("footer.hours1")}</p>
          <p>{t("footer.hours2")}</p>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="text-foreground font-medium">{t("footer.legal")}</p>
          <Link to="/terms" className="block hover:text-primary transition">{t("footer.terms")}</Link>
          <Link to="/privacy" className="block hover:text-primary transition">{t("footer.privacy")}</Link>
          <Link to="/cancellation" className="block hover:text-primary transition">{t("footer.cancel")}</Link>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-4 text-center text-xs text-muted-foreground">
          {t("footer.policy")} · {t("footer.vat")}
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CarCare Mobile · Y-tunnus 3625541-9</p>
          <p>{t("footer.copy")}</p>
        </div>
      </div>
    </footer>
  );
}
