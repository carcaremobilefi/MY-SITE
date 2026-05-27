import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Phone, MessageCircle, Mail, Instagram, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

const PHONE = "+358452599159";
const PHONE_DISPLAY = "+358 45 259 9159";
const WHATSAPP = "358452599159";
const EMAIL = "info@carcaremobilefi.com";
const IG = "carcaremobilefi";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "CarCare Mobile — Book mobile car detailing in Helsinki" },
      {
        name: "description",
        content:
          "Premium mobile interior detailing in Helsinki, Espoo and Vantaa. Book online, call, or message us on WhatsApp.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "CarCare Mobile — Mobile detailing at your door" },
      {
        property: "og:description",
        content: "Tap to book, call, or WhatsApp. Helsinki capital region.",
      },
    ],
  }),
  component: QrLanding,
});

function QrLanding() {
  const { t } = useT();

  const actions = [
    {
      href: "/book",
      icon: Calendar,
      label: t("nav.book") ?? "Book now",
      sub: "60 sec online booking",
      primary: true,
      isInternal: true,
    },
    {
      href: `tel:${PHONE}`,
      icon: Phone,
      label: "Call us",
      sub: PHONE_DISPLAY,
    },
    {
      href: `https://wa.me/${WHATSAPP}`,
      icon: MessageCircle,
      label: "WhatsApp",
      sub: "Fast reply 9:00 – 21:00",
    },
    {
      href: `mailto:${EMAIL}`,
      icon: Mail,
      label: "Email",
      sub: EMAIL,
    },
    {
      href: `https://instagram.com/${IG}`,
      icon: Instagram,
      label: "Instagram",
      sub: `@${IG}`,
    },
  ];

  return (
    <div className="min-h-[100svh] bg-background grain relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-md px-5 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="size-2.5 rounded-full bg-primary shadow-[0_0_18px_var(--color-primary)]" />
          <span className="font-display font-semibold text-lg tracking-tight">
            CARCARE<span className="text-primary">/</span>MOBILE
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/40 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground mb-5">
            <Sparkles className="size-3 text-primary" />
            June special — 10% off
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight leading-tight">
            Mobile detailing
            <span className="block text-primary text-glow">at your door.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Studio-grade interior cleaning. We come to you in Helsinki, Espoo & Vantaa.
          </p>
        </motion.div>

        <div className="space-y-3">
          {actions.map((a, i) => {
            const Inner = (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                className={`group flex items-center gap-4 rounded-2xl border p-4 transition active:scale-[0.98] ${
                  a.primary
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_30px_var(--color-primary)]"
                    : "border-border/70 bg-surface/60 hover:border-primary hover:bg-surface"
                }`}
              >
                <span
                  className={`size-11 rounded-full flex items-center justify-center shrink-0 ${
                    a.primary
                      ? "bg-primary-foreground/15"
                      : "bg-primary/10 border border-primary/30 text-primary"
                  }`}
                >
                  <a.icon className="size-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold leading-tight">{a.label}</span>
                  <span
                    className={`block text-xs mt-0.5 truncate ${
                      a.primary ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {a.sub}
                  </span>
                </span>
                <ArrowUpRight
                  className={`size-4 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    a.primary ? "" : "text-muted-foreground group-hover:text-primary"
                  }`}
                />
              </motion.div>
            );

            return a.isInternal ? (
              <Link key={a.label} to={a.href} className="block">
                {Inner}
              </Link>
            ) : (
              <a
                key={a.label}
                href={a.href}
                target={a.href.startsWith("http") ? "_blank" : undefined}
                rel={a.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block"
              >
                {Inner}
              </a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <MapPin className="size-3.5 text-primary" />
          Helsinki · Espoo · Vantaa · Mon–Sun 9:00–21:00
        </motion.div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition">
            ← Visit full website
          </Link>
        </div>
      </div>
    </div>
  );
}
