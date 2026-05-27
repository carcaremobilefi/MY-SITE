import { Instagram } from "lucide-react";
import refresh from "@/assets/service-refresh.jpg";
import deep from "@/assets/service-deep.jpg";
import full from "@/assets/service-full.jpg";
import ba from "@/assets/before-after-1.jpg";
import mobile from "@/assets/mobile-service.jpg";
import hero from "@/assets/hero-interior.jpg";
import { useT } from "@/lib/i18n";

const tiles = [hero, deep, full, refresh, ba, mobile];

export function InstagramSection() {
  const { t } = useT();
  return (
    <section className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("ig.kicker")}</p>
            <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
              @carcaremobilefi
            </h2>
          </div>
          <a
            href="https://instagram.com/carcaremobilefi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition"
          >
            <Instagram className="size-4" /> {t("ig.follow")}
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {tiles.map((tile, i) => (
            <a
              key={i}
              href="https://instagram.com/carcaremobilefi"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg border border-border/70"
            >
              <img src={tile} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition flex items-center justify-center">
                <Instagram className="size-6 text-primary opacity-0 group-hover:opacity-100 transition" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
