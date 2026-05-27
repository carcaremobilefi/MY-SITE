import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Sofa, Layers, Truck, Sailboat, Caravan, Plus, ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";

const ICONS = [Sofa, Layers, Truck, Sailboat, Caravan, Plus];

export function BeyondCars() {
  const { t } = useT();
  const items = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    Icon: ICONS[i],
    name: t(`beyond.i${n}.name`),
    desc: t(`beyond.i${n}.desc`),
  }));

  return (
    <section id="beyond" className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("beyond.kicker")}</p>
          <h2 className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-[1.05]">
            {t("beyond.title1")} <span className="text-muted-foreground">{t("beyond.title2")}</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-base md:text-lg max-w-2xl">{t("beyond.lead")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-2xl border border-border/70 bg-surface/50 p-6 md:p-7 hover:border-primary/40 hover:bg-surface transition"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <it.Icon className="size-5" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <p className="font-display text-xl mb-2">{it.name}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 flex justify-center">
          <Link
            to="/quote"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary px-7 py-4 text-sm font-medium transition"
          >
            {t("beyond.cta")}
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
