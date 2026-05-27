import { motion } from "framer-motion";
import { ParkingCircle, Zap, Droplet, Ruler, Snowflake, Check } from "lucide-react";
import { useT } from "@/lib/i18n";

export function OnSite() {
  const { t } = useT();

  const items = [
    { icon: ParkingCircle, t: t("onsite.i1.t"), d: t("onsite.i1.d") },
    { icon: Ruler, t: t("onsite.i2.t"), d: t("onsite.i2.d") },
    { icon: Zap, t: t("onsite.i3.t"), d: t("onsite.i3.d") },
    { icon: Droplet, t: t("onsite.i4.t"), d: t("onsite.i4.d") },
    { icon: Snowflake, t: t("onsite.i5.t"), d: t("onsite.i5.d") },
  ];

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("onsite.kicker")}</p>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight max-w-2xl">
              {t("onsite.title1")}<br />{t("onsite.title2")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">{t("onsite.lead")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border border-border/70 bg-surface/50 p-5 flex flex-col gap-3"
              >
                <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-base">{it.t}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{it.d}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-3">
          <Check className="size-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{t("onsite.note.title")}</span> {t("onsite.note.body")}
          </p>
        </div>
      </div>
    </section>
  );
}
