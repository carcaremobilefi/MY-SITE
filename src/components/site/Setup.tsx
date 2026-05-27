import { motion } from "framer-motion";
import { Zap, Droplet, Wind, Thermometer, Beaker, GaugeCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Setup() {
  const { t } = useT();

  const kit = [
    { icon: Zap, t: t("setup.i1.t"), d: t("setup.i1.d") },
    { icon: Droplet, t: t("setup.i2.t"), d: t("setup.i2.d") },
    { icon: Wind, t: t("setup.i3.t"), d: t("setup.i3.d") },
    { icon: Thermometer, t: t("setup.i4.t"), d: t("setup.i4.d") },
    { icon: Beaker, t: t("setup.i5.t"), d: t("setup.i5.d") },
    { icon: GaugeCircle, t: t("setup.i6.t"), d: t("setup.i6.d") },
  ];

  return (
    <section id="setup" className="py-24 md:py-36 border-t border-border/40 bg-surface/30">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("setup.kicker")}</p>
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight max-w-3xl">
              {t("setup.title1")}<br />{t("setup.title2")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">{t("setup.lead")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {kit.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-border/70 bg-background/40 p-6 md:p-7 hover:border-primary/40 transition"
              >
                <Icon className="size-7 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
