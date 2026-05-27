import mobile from "@/assets/mobile-service.jpg";
import { useT } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useT();
  const steps = [
    { n: "01", t: t("how.s1.t"), d: t("how.s1.d") },
    { n: "02", t: t("how.s2.t"), d: t("how.s2.d") },
    { n: "03", t: t("how.s3.t"), d: t("how.s3.d") },
    { n: "04", t: t("how.s4.t"), d: t("how.s4.d") },
  ];

  return (
    <section id="how" className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden border border-border/70 order-2 lg:order-1">
          <img src={mobile} alt="Mobile detailing van arriving at a Helsinki home" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs text-primary font-mono">{t("how.region")}</p>
            <p className="mt-1 text-2xl font-display">{t("how.caption")}</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("how.kicker")}</p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-10">
            {t("how.title1")} <span className="text-muted-foreground">{t("how.title2")}</span>
          </h2>
          <ol className="space-y-1">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className="grid grid-cols-[auto_1fr] gap-5 py-5 border-t border-border/60"
                style={{ borderBottom: i === steps.length - 1 ? "1px solid var(--color-border)" : undefined }}
              >
                <span className="font-mono text-primary text-sm pt-1">{s.n}</span>
                <div>
                  <h3 className="font-display text-xl">{s.t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
