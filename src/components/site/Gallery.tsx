import { motion } from "framer-motion";
import ba1 from "@/assets/before-after-1.jpg";
import full from "@/assets/service-full.jpg";
import deep from "@/assets/service-deep.jpg";
import refresh from "@/assets/service-refresh.jpg";
import { useT } from "@/lib/i18n";

export function Gallery() {
  const { t, tArr } = useT();
  const labels = tArr("gallery.items.label");
  const tags = tArr("gallery.items.tag");
  const imgs = [ba1, full, deep, refresh];
  const items = imgs.map((img, i) => ({ img, label: labels[i] ?? "", tag: tags[i] ?? "" }));

  const stats = [
    { n: t("gallery.stat1.n"), l: t("gallery.stat1.l") },
    { n: t("gallery.stat2.n"), l: t("gallery.stat2.l") },
    { n: t("gallery.stat3.n"), l: t("gallery.stat3.l") },
  ];

  return (
    <section id="gallery" className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("gallery.kicker")}</p>
          <h2 className="text-5xl md:text-7xl font-display font-semibold tracking-tight max-w-4xl leading-[1.05]">
            {t("gallery.title1")} <span className="text-muted-foreground">{t("gallery.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mt-6 text-base md:text-lg">{t("gallery.lead")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-xl border border-border/70 ${
                i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-square"
              }`}
            >
              <img
                src={it.img}
                alt={it.label}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs text-primary font-mono mb-1">{it.tag}</p>
                <p className="text-sm md:text-base font-display font-medium">{it.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-3 gap-3 md:gap-6 rounded-2xl border border-border/70 bg-surface/50 p-5 md:p-8">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-2xl md:text-4xl font-display font-semibold text-primary">{s.n}</p>
              <p className="text-[11px] md:text-sm text-muted-foreground mt-1 md:mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
