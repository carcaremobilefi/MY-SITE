import { motion } from "framer-motion";
import { Wind, Droplets, Sparkles, Brush, FlaskConical, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Process() {
  const { t } = useT();

  const steps = [
    { icon: Wind, t: t("process.s1.t"), d: t("process.s1.d") },
    { icon: Sparkles, t: t("process.s2.t"), d: t("process.s2.d") },
    { icon: Droplets, t: t("process.s3.t"), d: t("process.s3.d") },
    { icon: Brush, t: t("process.s4.t"), d: t("process.s4.d") },
    { icon: FlaskConical, t: t("process.s5.t"), d: t("process.s5.d") },
    { icon: ShieldCheck, t: t("process.s6.t"), d: t("process.s6.d") },
  ];

  return (
    <section id="process" className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("process.kicker")}</p>
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight max-w-3xl">
              {t("process.title1")} <span className="text-muted-foreground">{t("process.title2")}</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">{t("process.lead")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative rounded-2xl border border-border/70 bg-surface p-6 md:p-7 overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition" />
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0 rounded-xl border border-border/70 bg-background/40 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">0{i + 1}</p>
                    <h3 className="font-display text-lg md:text-xl font-semibold">{s.t}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
