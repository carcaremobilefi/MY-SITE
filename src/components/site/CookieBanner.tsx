import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";
import { useT } from "@/lib/i18n";

const KEY = "cc-cookie-consent";

export function CookieBanner() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        // small delay so it doesn't fight LCP
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("cookies.title")}
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md z-50"
    >
      <div className="rounded-2xl border border-border bg-surface/95 backdrop-blur p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Cookie className="size-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base font-semibold">{t("cookies.title")}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t("cookies.body")}{" "}
              <Link to="/privacy" className="text-primary underline-offset-2 hover:underline">
                {t("cookies.learn")}
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => persist("accepted")}
                className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:shadow-[0_0_24px_var(--color-primary)] transition"
              >
                {t("cookies.accept")}
              </button>
              <button
                onClick={() => persist("rejected")}
                className="rounded-full border border-border bg-background/40 px-4 py-2 text-xs font-medium hover:border-foreground/40 transition"
              >
                {t("cookies.reject")}
              </button>
            </div>
          </div>
          <button
            aria-label="Close"
            onClick={() => persist("rejected")}
            className="text-muted-foreground hover:text-foreground transition shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
