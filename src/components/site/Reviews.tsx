import { Star } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Reviews() {
  const { t } = useT();
  const reviews = [
    { name: "Aleksi V.", car: "BMW M340i", text: t("reviews.r1") },
    { name: "Sofia L.", car: "Volvo XC60", text: t("reviews.r2") },
    { name: "Mikko R.", car: "Tesla Model Y", text: t("reviews.r3") },
    { name: "Hanna K.", car: "Audi A4", text: t("reviews.r4") },
  ];
  return (
    <section className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("reviews.kicker")}</p>
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight">
              {t("reviews.title1")}<br />{t("reviews.title2")}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-primary">
            {[...Array(5)].map((_, i) => <Star key={i} className="size-5 fill-primary" />)}
            <span className="ml-2 text-sm text-muted-foreground">{t("reviews.count")}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-border/70 bg-surface/50 p-6 flex flex-col">
              <div className="flex gap-0.5 text-primary mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-primary" />)}
              </div>
              <blockquote className="text-sm text-foreground/90 leading-relaxed flex-1">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-5 pt-5 border-t border-border/60">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.car}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
