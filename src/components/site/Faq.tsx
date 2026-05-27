import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Faq() {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
  ];
  return (
    <section id="faq" className="py-24 md:py-36 border-t border-border/40">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("faq.kicker")}</p>
        <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight mb-14">
          {t("faq.title")}
        </h2>
        <div className="divide-y divide-border/60 border-y border-border/60">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 text-left py-6 group"
                >
                  <span className="font-display text-lg md:text-xl group-hover:text-primary transition">
                    {f.q}
                  </span>
                  <span className="mt-1 shrink-0 size-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition">
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-muted-foreground leading-relaxed max-w-2xl">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
