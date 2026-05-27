import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Check, X, Download } from "lucide-react";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Brand Kit — CarCare Mobile" },
      {
        name: "description",
        content:
          "CarCare Mobile brand kit: colors, typography, logo system and usage rules for consistent styling.",
      },
    ],
  }),
  component: BrandPage,
});

const colors = [
  { name: "Acid Green", token: "--primary", hex: "#C4F542", role: "Primary accent · CTAs · highlights" },
  { name: "Graphite", token: "--background", hex: "#1A1B1E", role: "Base background" },
  { name: "Surface", token: "--surface", hex: "#222428", role: "Cards · sections" },
  { name: "Surface 2", token: "--surface-2", hex: "#2A2C30", role: "Elevated surfaces" },
  { name: "Foreground", token: "--foreground", hex: "#F5F6F7", role: "Primary text" },
  { name: "Muted", token: "--muted-foreground", hex: "#9DA1A6", role: "Secondary text" },
];

function Swatch({ name, token, hex, role }: typeof colors[number]) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 overflow-hidden">
      <div className="h-32" style={{ background: hex }} />
      <div className="p-4 space-y-1.5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display font-bold text-lg">{name}</h3>
          <span className="font-mono text-xs text-muted-foreground">{hex}</span>
        </div>
        <p className="text-sm text-muted-foreground">{role}</p>
        <p className="font-mono text-[11px] text-muted-foreground/70">var({token})</p>
      </div>
    </div>
  );
}

function BrandPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" /> Brand Kit / v1.0
          </div>
          <h1 className="mt-5 text-5xl md:text-7xl font-display font-extrabold tracking-tight">
            CarCare<span className="text-primary">.</span> Mobile
            <br />
            <span className="text-muted-foreground">Brand System</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A minimal, dark, automotive identity. Use this page as the single source of truth for
            colors, typography and logo usage across every surface — web, print and social.
          </p>
        </section>

        <div className="acid-divider mx-auto max-w-7xl my-16" />

        {/* Logo */}
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader index="01" title="Logo" subtitle="Wordmark with monospace tag" />

          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            {/* Dark version */}
            <div className="rounded-2xl border border-border/60 bg-background p-12 flex items-center justify-center min-h-[260px] relative">
              <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                On dark · Primary
              </span>
              <BrandMark />
            </div>
            {/* Light version */}
            <div className="rounded-2xl border border-border/60 bg-foreground p-12 flex items-center justify-center min-h-[260px] relative">
              <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-background/60">
                On light · Inverted
              </span>
              <BrandMark inverted />
            </div>
          </div>

          {/* Logo rules */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <RuleCard ok title="Do">
              <li>Keep the acid green accent dot visible</li>
              <li>Maintain clear space equal to the badge height around the mark</li>
              <li>Use the inverted version only on solid light backgrounds</li>
              <li>Minimum width: 96px on screen, 24mm in print</li>
            </RuleCard>
            <RuleCard title="Don't">
              <li>Don't recolor the wordmark or change the dot</li>
              <li>Don't stretch, skew or rotate the logo</li>
              <li>Don't place on busy photography without a scrim</li>
              <li>Don't substitute the typeface or rebuild the badge</li>
            </RuleCard>
          </div>
        </section>

        <div className="acid-divider mx-auto max-w-7xl my-16" />

        {/* Colors */}
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader index="02" title="Color" subtitle="Dark graphite with acid green" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {colors.map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground max-w-2xl">
            Acid Green is reserved for primary actions, key accents and the brand dot. Never use it
            for long-form text or large surfaces — it loses meaning when overused.
          </p>
        </section>

        <div className="acid-divider mx-auto max-w-7xl my-16" />

        {/* Typography */}
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader index="03" title="Typography" subtitle="Syne · Plus Jakarta Sans · JetBrains Mono" />

          <div className="mt-10 space-y-6">
            <TypeRow
              label="Display / Syne"
              meta="Headings · 600–800 · tracking -0.035em"
              sample={<span className="font-display font-extrabold text-5xl md:text-7xl tracking-tight">Deep Clean.</span>}
            />
            <TypeRow
              label="Body / Plus Jakarta Sans"
              meta="UI & paragraphs · 300–600"
              sample={
                <p className="text-lg md:text-xl max-w-2xl">
                  Professional mobile interior detailing at your address. We bring water, power
                  and professional equipment for fabric, velour and leather deep cleaning.
                </p>
              }
            />
            <TypeRow
              label="Mono / JetBrains Mono"
              meta="Tags · labels · technical accents"
              sample={
                <span className="font-mono text-sm uppercase tracking-[0.3em] text-primary">
                  Helsinki / 00100 — Booking 60s
                </span>
              }
            />
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <ScaleItem name="H1" size="64 / 96px" weight="800" />
            <ScaleItem name="H2" size="40 / 56px" weight="700" />
            <ScaleItem name="Body" size="16 / 18px" weight="400" />
          </div>
        </section>

        <div className="acid-divider mx-auto max-w-7xl my-16" />

        {/* Voice */}
        <section className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader index="04" title="Voice" subtitle="Confident · technical · calm" />
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <VoicePill word="Direct" example='"We come to you."' />
            <VoicePill word="Precise" example='"Velour extraction at 80°C."' />
            <VoicePill word="Premium" example='"Only Koch Chemie."' />
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 md:px-8 mt-20">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                Stay consistent.
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Bookmark this page and reference it before every campaign, post or print job.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-surface transition"
              >
                Back to site
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:shadow-[0_0_30px_var(--color-primary)] transition">
                <Download className="size-4" /> Download assets
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SectionHeader({ index, title, subtitle }: { index: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{index}</div>
        <h2 className="mt-2 font-display font-extrabold text-4xl md:text-5xl tracking-tight">{title}</h2>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function BrandMark({ inverted = false }: { inverted?: boolean }) {
  const textColor = inverted ? "text-background" : "text-foreground";
  const subColor = inverted ? "text-background/50" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-4">
      <span className="relative inline-flex items-center justify-center size-16 rounded-xl border border-primary/40 bg-primary/10">
        <span className="absolute inset-2 rounded-lg bg-primary shadow-[0_0_30px_var(--color-primary)]" />
        <span className="relative font-display font-extrabold text-2xl text-primary-foreground leading-none">C</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-extrabold tracking-tight text-4xl ${textColor}`}>
          CarCare<span className="text-primary">.</span>
        </span>
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] mt-2 ${subColor}`}>
          Mobile / HEL
        </span>
      </span>
    </div>
  );
}

function RuleCard({ title, children, ok = false }: { title: string; children: React.ReactNode; ok?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-6">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center justify-center size-6 rounded-full ${
            ok ? "bg-primary text-primary-foreground" : "bg-destructive/20 text-destructive"
          }`}
        >
          {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
        </span>
        <h3 className="font-display font-bold text-lg">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5 marker:text-primary/50">
        {children}
      </ul>
    </div>
  );
}

function TypeRow({ label, meta, sample }: { label: string; meta: string; sample: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{label}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{meta}</span>
      </div>
      {sample}
    </div>
  );
}

function ScaleItem({ name, size, weight }: { name: string; size: string; weight: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{name}</div>
      <div className="mt-2 font-display font-extrabold text-2xl">{size}</div>
      <div className="font-mono text-xs text-muted-foreground mt-1">weight {weight}</div>
    </div>
  );
}

function VoicePill({ word, example }: { word: string; example: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-6">
      <div className="font-display font-extrabold text-2xl">{word}</div>
      <div className="mt-2 text-muted-foreground italic">{example}</div>
    </div>
  );
}
