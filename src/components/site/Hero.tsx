import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import hero from "@/assets/hero-interior.jpg";
import { useT } from "@/lib/i18n";

export function Hero() {
  const { t } = useT();
  return (
    <section className="relative min-h-[100svh] overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src={hero}
          alt="Premium detailed car interior with acid green ambient lighting"
          className="h-full w-full object-cover object-center opacity-70"
          width={1536}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 gradient-radial opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 pt-36 md:pt-44 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/40 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {t("hero.badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="mt-6 text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.95] font-display font-semibold tracking-tight max-w-5xl"
        >
          {t("hero.title1")}
          <span className="block text-primary text-glow">{t("hero.title2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/book"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-sm font-medium hover:shadow-[0_0_40px_var(--color-primary)] transition"
          >
            {t("hero.cta.book")}
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-surface/40 backdrop-blur px-7 py-4 text-sm font-medium hover:bg-surface transition"
          >
            {t("hero.cta.services")}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-3xl"
        >
          {[
            { k: "1500+", v: t("hero.stats.interiors") },
            { k: "4.9★", v: t("hero.stats.rating") },
            { k: "60 min", v: t("hero.stats.arrival") },
            { k: "100%", v: t("hero.stats.mobile") },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-display text-2xl md:text-3xl font-semibold">{s.k}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.v}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="size-3.5 text-primary" />
        {t("hero.serving")}
      </div>
    </section>
  );
}
