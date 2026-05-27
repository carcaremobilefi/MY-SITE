import { Droplets, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Why() {
  const { t } = useT();
  const points = [
    { icon: Droplets, title: t("why.p1.title"), text: t("why.p1.text") },
    { icon: Sparkles, title: t("why.p2.title"), text: t("why.p2.text") },
    { icon: Clock, title: t("why.p3.title"), text: t("why.p3.text") },
    { icon: ShieldCheck, title: t("why.p4.title"), text: t("why.p4.text") },
  ];
  return (
    <section className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("why.kicker")}</p>
        <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight max-w-3xl mb-14">
          {t("why.title1")}<br />{t("why.title2")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border/70 bg-surface/50 p-6 hover:border-primary/60 transition group"
            >
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <p.icon className="size-5 text-primary group-hover:text-primary-foreground transition" />
              </div>
              <h3 className="font-display text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
