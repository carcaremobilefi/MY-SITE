import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import refresh from "@/assets/service-refresh.jpg";
import deep from "@/assets/service-deep.jpg";
import full from "@/assets/service-full.jpg";
import { useT } from "@/lib/i18n";

export function Services() {
  const { t, tArr } = useT();

  // Same multipliers as /book → keeps pricing transparent and consistent.
  const SIZE_MULTIPLIERS = { hatch: 1, sedan: 1.1, suv: 1.25, van: 1.45 } as const;
  const fmt = (base: number, m: number) => `€${Math.round(base * m)}`;
  const sizeRow = (base: number) => [
    { k: "hatch", label: t("services.size.hatch") },
    { k: "sedan", label: t("services.size.sedan") },
    { k: "suv", label: t("services.size.suv") },
    { k: "van", label: t("services.size.van") },
  ].map((s) => ({ ...s, price: fmt(base, SIZE_MULTIPLIERS[s.k as keyof typeof SIZE_MULTIPLIERS]) }));

  const services = [
    {
      tag: "01",
      name: t("services.s1.name"),
      duration: "60 – 90 min",
      basePrice: 79,
      price: `${t("services.duration.from")} €79`,
      img: refresh,
      desc: t("services.s1.desc"),
      items: tArr("services.s1.items"),
    },
    {
      tag: "02",
      name: t("services.s2.name"),
      duration: "2.5 – 4 h",
      basePrice: 189,
      price: `${t("services.duration.from")} €189`,
      img: deep,
      desc: t("services.s2.desc"),
      items: tArr("services.s2.items"),
    },
    {
      tag: "03",
      name: t("services.s3.name"),
      duration: "5 – 7 h",
      basePrice: 329,
      price: `${t("services.duration.from")} €329`,
      img: full,
      desc: t("services.s3.desc"),
      items: tArr("services.s3.items"),
    },
  ];

  const addons = tArr("services.addons.items");

  return (
    <section id="services" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("services.kicker")}</p>
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight max-w-2xl">
              {t("services.title1")}<br />{t("services.title2")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">{t("services.lead")}</p>
        </div>

        <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">June</span>
          <span className="size-1 rounded-full bg-primary" />
          <span className="text-sm font-medium text-foreground">{t("services.promo")}</span>
        </div>


        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-border/70 bg-surface flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                <div className="absolute top-4 left-4 text-xs font-mono text-primary">{s.tag}</div>
                <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded-full">
                  {s.duration}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-display font-semibold">{s.name}</h3>
                  <span className="text-primary font-mono text-sm whitespace-nowrap">{s.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>

                <div className="mt-4 rounded-xl border border-border/60 bg-background/30 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    {t("services.size.note")}
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {sizeRow(s.basePrice).map((row) => (
                      <div key={row.k} className="flex items-baseline justify-between text-xs">
                        <span className="text-foreground/70">{row.label}</span>
                        <span className="font-mono text-primary">{row.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="mt-5 space-y-2 flex-1">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{it}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/book"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/40 px-5 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
                >
                  {t("services.cta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border/70 bg-surface/50 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{t("services.addons.kicker")}</p>
              <h3 className="text-2xl font-display">{t("services.addons.title")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {addons.map((a) => (
                <span key={a} className="text-sm rounded-full border border-border bg-background/40 px-4 py-2">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
