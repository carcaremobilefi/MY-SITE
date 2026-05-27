import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Contact() {
  const { t } = useT();
  return (
    <section id="contact" className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-surface to-background p-8 md:p-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("contact.kicker")}</p>
              <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight">
                {t("contact.title1")}<br />{t("contact.title2")}
              </h2>
              <p className="mt-6 text-muted-foreground max-w-md">{t("contact.lead")}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-sm font-medium hover:shadow-[0_0_40px_var(--color-primary)] transition"
                >
                  {t("contact.book")} <ArrowUpRight className="size-4" />
                </Link>
                <a
                  href="tel:+358452599159"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-medium hover:border-primary transition"
                >
                  <Phone className="size-4" /> {t("contact.call")}
                </a>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                { icon: Mail, l: "info@carcaremobilefi.com", h: "mailto:info@carcaremobilefi.com" },
                { icon: Phone, l: "+358 45 259 9159", h: "tel:+358452599159" },
                { icon: MapPin, l: t("contact.location"), h: "#" },
                { icon: Instagram, l: "@carcaremobilefi", h: "https://instagram.com/carcaremobilefi" },
              ].map((item) => (
                <li key={item.l}>
                  <a
                    href={item.h}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-border/70 bg-background/40 hover:border-primary hover:bg-surface transition group"
                  >
                    <span className="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                      <item.icon className="size-4 text-primary group-hover:text-primary-foreground transition" />
                    </span>
                    <span className="font-medium">{item.l}</span>
                    <ArrowUpRight className="size-4 ml-auto text-muted-foreground group-hover:text-primary transition" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
