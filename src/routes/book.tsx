import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Calendar,
  MapPin,
  Car,
  Sparkles,
  CreditCard,
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Dog,
  Cigarette,
  Droplets,
  Biohazard,
  Stamp,
  Loader2,
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { CalScheduler, type CalBookingDetails } from "@/components/site/CalScheduler";
import { createCheckoutSession } from "@/lib/stripe.functions";
import { zoneFromPostal } from "@/lib/zones";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — CarCare Mobile" },
      {
        name: "description",
        content:
          "Book your mobile interior detailing appointment in Helsinki. Pick a service, choose a slot, pay a 20€ deposit.",
      },
    ],
  }),
  component: BookPage,
});

const SERVICES = [
  { id: "refresh", name: "Interior Refresh", price: 79, duration: "60–90 min" },
  { id: "deep", name: "Deep Interior Cleaning", price: 189, duration: "2.5–4 h" },
  { id: "full", name: "Full Interior Detailing", price: 329, duration: "5–7 h" },
];

const VEHICLE_SIZES = [
  { id: "hatchback", name: "Hatchback", multiplier: 1 },
  { id: "sedan", name: "Sedan", multiplier: 1.1 },
  { id: "suv", name: "SUV", multiplier: 1.25 },
  { id: "van", name: "Van", multiplier: 1.45 },
];

const ADDONS = [
  { id: "stain-single", name: "Single stain removal", price: 19 },
  { id: "mats", name: "Floor mat shampoo", price: 25 },
  { id: "vents", name: "Air vent disinfection", price: 29 },
  { id: "child", name: "Child seat deep clean", price: 35 },
  { id: "trunk", name: "Trunk full reset", price: 39 },
  { id: "pet", name: "Pet hair removal", price: 45 },
  { id: "headliner", name: "Interior roof cleaning", price: 59 },
  { id: "seats-rear", name: "Seat extraction — rear bench only", price: 59 },
  { id: "seats-front", name: "Seat extraction — front seats only", price: 69 },
  { id: "leather", name: "Leather conditioning", price: 69 },
];

// Time slots are now managed by Cal.com — see src/lib/cal.ts

const CONDITIONS = [
  { id: "pet", name: "Pet hair", icon: Dog, surcharge: 35, timeAdd: 0.4, desc: "Embedded fur in seats, carpets, trunk." },
  { id: "smoker", name: "Smoker car", icon: Cigarette, surcharge: 45, timeAdd: 0.6, desc: "Tar, ash, persistent smoke odor." },
  { id: "mold", name: "Mold / mildew", icon: Droplets, surcharge: 65, timeAdd: 0.8, desc: "Visible mold, water damage, musty smell." },
  { id: "biohazard", name: "Biohazard", icon: Biohazard, surcharge: 95, timeAdd: 1.0, desc: "Vomit, blood, urine — requires PPE & sanitizer." },
  { id: "stains", name: "Heavy stains", icon: Stamp, surcharge: 40, timeAdd: 0.5, desc: "Coffee, food, ink, oil — set into fabric." },
] as const;

type FormState = {
  service: string;
  vehicleSize: string;
  make: string;
  model: string;
  conditions: string[];
  conditionsConfirmed: boolean;
  notes: string;
  parking: string;
  address: string;
  city: string;
  postal: string;
  date: string;
  time: string;
  addons: string[];
  name: string;
  email: string;
  phone: string;
  photos: File[];
  dryingAcknowledged: boolean;
};

const STEPS = ["Service", "Vehicle", "Intake", "Location", "Schedule", "Extras", "Pay"];

function BookPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    service: "deep",
    vehicleSize: "",
    make: "",
    model: "",
    conditions: [],
    conditionsConfirmed: false,
    notes: "",
    parking: "",
    address: "",
    city: "Helsinki",
    postal: "",
    date: "",
    time: "",
    addons: [],
    name: "",
    email: "",
    phone: "",
    photos: [],
    dryingAcknowledged: false,
  });
  const [calBooking, setCalBooking] = useState<CalBookingDetails | null>(null);
  const [payLoading, setPayLoading] = useState<"deposit" | "full" | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const checkout = useServerFn(createCheckoutSession);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleAddon = (id: string) =>
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(id) ? f.addons.filter((a) => a !== id) : [...f.addons, id],
    }));

  const toggleCondition = (id: string) =>
    setForm((f) => ({
      ...f,
      conditions: f.conditions.includes(id)
        ? f.conditions.filter((c) => c !== id)
        : [...f.conditions, id],
      conditionsConfirmed: true,
    }));

  const conditionSurcharge = useMemo(
    () =>
      form.conditions.reduce(
        (sum, id) => sum + (CONDITIONS.find((c) => c.id === id)?.surcharge ?? 0),
        0,
      ),
    [form.conditions],
  );

  const timeMultiplier = useMemo(
    () =>
      1 +
      form.conditions.reduce(
        (sum, id) => sum + (CONDITIONS.find((c) => c.id === id)?.timeAdd ?? 0),
        0,
      ),
    [form.conditions],
  );

  const zone = useMemo(() => zoneFromPostal(form.postal), [form.postal]);

  // June 2026 promo — 15% off the base service price (size-adjusted). Add-ons,
  // condition surcharges and zone fees stay at full price. Discount flows
  // straight into Stripe Checkout because we send `total` as `totalEur`.
  const PROMO_RATE = 0.15;
  const { base, discount, total } = useMemo(() => {
    const svc = SERVICES.find((s) => s.id === form.service);
    const size = VEHICLE_SIZES.find((v) => v.id === form.vehicleSize);
    const rawBase = (svc?.price ?? 0) * (size?.multiplier ?? 1);
    const disc = Math.round(rawBase * PROMO_RATE);
    const extras = form.addons.reduce(
      (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0),
      0,
    );
    return {
      base: Math.round(rawBase),
      discount: disc,
      total: Math.round(rawBase - disc + extras + conditionSurcharge + zone.fee),
    };
  }, [form, conditionSurcharge, zone]);

  const canProceed = () => {
    switch (step) {
      case 0: return !!form.service;
      case 1: return !!form.vehicleSize && form.make.trim() !== "" && form.model.trim() !== "";
      case 2: return form.conditionsConfirmed;
      case 3: return form.address.trim() !== "" && form.postal.trim() !== "" && form.parking !== "";
      case 4: return !!calBooking?.startTime;
      case 5: return true;
      case 6: {
        const wet = form.service === "deep" || form.service === "full";
        const dryOk = !wet || form.dryingAcknowledged;
        return form.name.trim() !== "" && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim() !== "" && dryOk;
      }
      default: return false;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 6 - form.photos.length);
    update("photos", [...form.photos, ...arr]);
  };

  const removePhoto = (idx: number) =>
    update("photos", form.photos.filter((_, i) => i !== idx));

  const startPayment = async (mode: "deposit" | "full") => {
    setPayError(null);
    setPayLoading(mode);
    try {
      const svc = SERVICES.find((s) => s.id === form.service);
      const bookingDate =
        calBooking?.startTime ?? (form.date && form.time ? `${form.date} ${form.time}` : undefined);
      const res = await checkout({
        data: {
          mode,
          totalEur: total,
          serviceName: svc?.name ?? "Detailing",
          customerEmail: form.email,
          customerName: form.name,
          bookingDate,
          bookingNotes: form.notes || undefined,
          origin: window.location.origin,
        },
      });
      // Stripe Checkout blocks iframe embedding — break out of preview iframe if needed
      const inIframe = window.self !== window.top;
      if (inIframe) {
        const opened = window.open(res.url, "_blank", "noopener,noreferrer");
        if (!opened) {
          // popup blocked — force top-level nav
          (window.top ?? window).location.href = res.url;
        }
        setPayLoading(null);
      } else {
        window.location.href = res.url;
      }
    } catch (e: any) {
      setPayError(e?.message ?? "Payment failed to start");
      setPayLoading(null);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Nav />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6">
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Book your <span className="text-primary">interior reset</span>
            </h1>
            <p className="text-muted-foreground mt-3">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>

            <div className="mt-6 flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i <= step ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-2">Booking & cancellation policy</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>· 20€ deposit secures your slot — deducted from final invoice.</li>
                  <li>· Free reschedule up to 24h before your appointment.</li>
                  <li>· Inside 24h or no-show: deposit is <span className="text-foreground font-medium">non-refundable</span>.</li>
                  <li>· Light rain? We work under a mobile canopy. Heavy rain or storm? We reschedule for free. Garage or covered spot? Weather is never an issue.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="rounded-3xl border border-border/70 bg-surface/50 p-6 md:p-10 min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 0 && <StepService form={form} update={update} />}
                  {step === 1 && <StepVehicle form={form} update={update} />}
                  {step === 2 && <StepIntake form={form} update={update} toggleCondition={toggleCondition} timeMultiplier={timeMultiplier} conditionSurcharge={conditionSurcharge} onPhotos={onPhotos} removePhoto={removePhoto} />}
                  {step === 3 && <StepLocation form={form} update={update} />}
                  {step === 4 && <StepSchedule form={form} update={update} onBooking={setCalBooking} />}
                  {step === 5 && <StepExtras form={form} toggleAddon={toggleAddon} />}
                  {step === 6 && <StepPay form={form} update={update} total={total} payError={payError} payLoading={payLoading} onPay={startPayment} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-between pt-6 border-t border-border/60">
                <button
                  onClick={back}
                  disabled={step === 0 || !!payLoading}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
                {step < STEPS.length - 1 && (
                  <button
                    onClick={next}
                    disabled={!canProceed()}
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-medium hover:shadow-[0_0_30px_var(--color-primary)] disabled:opacity-40 disabled:pointer-events-none transition"
                  >
                    Continue
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <Summary form={form} total={total} discount={discount} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Steps ---------- */

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
        <Icon className="size-3.5" /> {title}
      </div>
      {subtitle && <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">{subtitle}</h2>}
    </div>
  );
}

function StepService({ form, update }: any) {
  return (
    <div>
      <SectionTitle icon={Sparkles} title="Service" subtitle="What does your cabin need?" />
      <div className="space-y-3">
        {SERVICES.map((s) => {
          const active = form.service === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => update("service", s.id)}
              className={`w-full text-left rounded-2xl p-5 border transition flex items-center justify-between gap-4 ${
                active ? "border-primary bg-primary/5" : "border-border/70 bg-background/30 hover:border-foreground/30"
              }`}
            >
              <div>
                <p className="font-display text-lg">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.duration}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-primary">from €{s.price}</span>
                <span className={`size-5 rounded-full border flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                  {active && <Check className="size-3 text-primary-foreground" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepVehicle({ form, update }: any) {
  const svc = SERVICES.find((s) => s.id === form.service);
  return (
    <div>
      <SectionTitle icon={Car} title="Vehicle" subtitle="Tell us about your car." />
      <p className="text-sm text-muted-foreground mb-3">
        Vehicle size {svc && <span className="text-foreground/60">· base from €{svc.price}</span>}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {VEHICLE_SIZES.map((v) => {
          const active = form.vehicleSize === v.id;
          const price = svc ? Math.round(svc.price * v.multiplier) : null;
          const delta = v.multiplier === 1 ? null : `+${Math.round((v.multiplier - 1) * 100)}%`;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => update("vehicleSize", v.id)}
              className={`rounded-xl p-4 border transition text-left ${
                active ? "border-primary bg-primary/5 text-primary" : "border-border/70 bg-background/30 hover:border-foreground/30"
              }`}
            >
              <p className="text-sm font-medium">{v.name}</p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                {price !== null && <span className="font-mono text-xs text-primary">€{price}</span>}
                {delta && <span className="font-mono text-[10px] text-muted-foreground">{delta}</span>}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mb-8">
        Larger vehicles take longer and use more product — same multiplier shown across the site.
      </p>

      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <Input label="Make" placeholder="BMW" value={form.make} onChange={(v) => update("make", v)} />
        <Input label="Model" placeholder="M340i" value={form.model} onChange={(v) => update("model", v)} />
      </div>

    </div>
  );
}


function StepIntake({ form, update, toggleCondition, timeMultiplier, conditionSurcharge, onPhotos, removePhoto }: any) {
  const svc = SERVICES.find((s) => s.id === form.service);
  const baseHours = svc?.id === "refresh" ? 1.25 : svc?.id === "deep" ? 3.25 : 6;
  const estHours = baseHours * timeMultiplier;
  const fmtHours = (h: number) => {
    const lo = Math.max(0.5, h - 0.5);
    const hi = h + 0.5;
    return `${lo.toFixed(1)}–${hi.toFixed(1)} h`;
  };
  const none = form.conditionsConfirmed && form.conditions.length === 0;

  return (
    <div>
      <SectionTitle icon={AlertTriangle} title="Intake" subtitle="Honest condition = honest quote." />
      <p className="text-sm text-muted-foreground mb-6 -mt-4">
        Tick anything that applies. Heavy cases can take up to <span className="text-foreground font-medium">3× longer</span> — we'd rather know now than discover it on-site.
      </p>

      <div className="space-y-2">
        {CONDITIONS.map((c) => {
          const active = form.conditions.includes(c.id);
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCondition(c.id)}
              className={`w-full text-left rounded-2xl p-4 md:p-5 border transition flex items-start gap-4 ${
                active ? "border-primary bg-primary/5" : "border-border/70 bg-background/30 hover:border-foreground/30"
              }`}
            >
              <span className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-primary/15 text-primary" : "bg-background/60 text-muted-foreground"}`}>
                <Icon className="size-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">+€{c.surcharge} · +{Math.round(c.timeAdd * 100)}% time</span>
                </span>
                <span className="block text-xs text-muted-foreground mt-1">{c.desc}</span>
              </span>
              <span className={`size-5 rounded-md border flex items-center justify-center shrink-0 mt-1 ${active ? "bg-primary border-primary" : "border-border"}`}>
                {active && <Check className="size-3 text-primary-foreground" />}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          form.conditions.forEach((id: string) => toggleCondition(id));
          update("conditionsConfirmed", true);
        }}
        className={`mt-3 w-full rounded-2xl p-4 border text-sm transition ${
          none ? "border-primary bg-primary/5 text-primary" : "border-dashed border-border/70 text-muted-foreground hover:border-foreground/30"
        }`}
      >
        None of the above — interior is in normal shape.
      </button>

      {form.conditionsConfirmed && (
        <div className={`mt-6 rounded-2xl border p-4 md:p-5 flex items-start gap-3 ${form.conditions.length ? "border-primary/40 bg-primary/5" : "border-border/70 bg-background/30"}`}>
          <Clock className={`size-5 mt-0.5 shrink-0 ${form.conditions.length ? "text-primary" : "text-muted-foreground"}`} />
          <div className="text-sm">
            <p className="font-medium">Revised estimate: {fmtHours(estHours)} on-site</p>
            <p className="text-muted-foreground mt-1">
              {form.conditions.length
                ? `+€${conditionSurcharge} condition surcharge added to your quote. We'll confirm final scope on arrival.`
                : "Standard timing applies. If we find anything unexpected on arrival, we'll quote before starting."}
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-8 mb-3">Anything else we should know? (optional)</p>
      <textarea
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        rows={3}
        placeholder="e.g. baby seat installed, allergy to strong fragrance, dog drool on rear door panel..."
        className="w-full rounded-xl bg-background/40 border border-border/70 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-background transition resize-none"
      />

      <p className="text-sm text-muted-foreground mt-8 mb-3">Photos of the interior (recommended · up to 6)</p>
      <p className="text-xs text-muted-foreground mb-3">Photos help us bring the right products and quote accurately.</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {form.photos.map((file: File, i: number) => (
          <div key={i} className="relative aspect-square rounded-xl border border-border/70 overflow-hidden bg-background/40">
            <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 size-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive transition"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        {form.photos.length < 6 && (
          <label className="aspect-square rounded-xl border border-dashed border-border/70 bg-background/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition text-muted-foreground">
            <Upload className="size-5 mb-1" />
            <span className="text-[10px]">Upload</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onPhotos(e.target.files)} />
          </label>
        )}
      </div>
    </div>
  );
}

function StepLocation({ form, update }: any) {
  const { t, lang } = useT();
  const zone = zoneFromPostal(form.postal);
  return (
    <div>
      <SectionTitle icon={MapPin} title="Location" subtitle="Where should we park?" />
      <div className="space-y-3">
        <Input label="Street address" placeholder="Mannerheimintie 12 A" value={form.address} onChange={(v) => update("address", v)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="City" value={form.city} onChange={(v) => update("city", v)} />
          <Input label="Postal code" placeholder="00100" value={form.postal} onChange={(v) => update("postal", v)} />
        </div>
      </div>

      {form.postal.replace(/\D/g, "").length >= 2 && (
        <div className={`mt-4 rounded-2xl border p-4 flex items-start gap-3 ${zone.fee === 0 ? "border-primary/30 bg-primary/5" : "border-amber-500/40 bg-amber-500/5"}`}>
          <MapPin className={`size-5 mt-0.5 shrink-0 ${zone.fee === 0 ? "text-primary" : "text-amber-500"}`} />
          <div className="text-sm flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">{zone.label[lang]}</p>
              <span className={`font-mono text-xs ${zone.fee === 0 ? "text-primary" : "text-amber-500"}`}>
                {zone.fee === 0 ? t("zone.fee.free") : `+€${zone.fee}`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{zone.desc[lang]}</p>
            {zone.id === "outside" && (
              <p className="text-xs text-amber-500/90 mt-2">{t("zone.outside.note")}</p>
            )}
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-3 mt-8">Parking availability</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "driveway", l: "Driveway" },
          { id: "street", l: "Street" },
          { id: "garage", l: "Garage" },
        ].map((p) => {
          const active = form.parking === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => update("parking", p.id)}
              className={`rounded-xl p-3 border text-sm transition ${
                active ? "border-primary bg-primary/5 text-primary" : "border-border/70 bg-background/30 hover:border-foreground/30"
              }`}
            >
              {p.l}
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border/70 bg-background/30 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">What we need on site</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><Check className="size-4 text-primary mt-0.5 shrink-0" /> One car-length of free space next to your vehicle.</li>
          <li className="flex gap-2"><Check className="size-4 text-primary mt-0.5 shrink-0" /> All doors and trunk able to open fully. Indoor garage: min. 2.2 m ceiling.</li>
          <li className="flex gap-2"><Check className="size-4 text-primary mt-0.5 shrink-0" /> No water or power needed — we bring our own. 230 V outlet within 15 m is a nice-to-have.</li>
        </ul>
      </div>
    </div>
  );
}


function StepSchedule({ form, update, onBooking }: any) {
  const handleBooking = useCallback(
    (d: CalBookingDetails) => {
      if (d.startTime) {
        const dt = new Date(d.startTime);
        if (!isNaN(dt.getTime())) {
          update("date", dt.toISOString().slice(0, 10));
          update("time", dt.toTimeString().slice(0, 5));
        }
      }
      if (d.attendeeName && !form.name) update("name", d.attendeeName);
      if (d.attendeeEmail && !form.email) update("email", d.attendeeEmail);
      onBooking(d);
    },
    [update, onBooking, form.name, form.email],
  );

  const svc = SERVICES.find((s) => s.id === form.service);
  const size = VEHICLE_SIZES.find((v) => v.id === form.vehicleSize);
  const conditionsLabel = form.conditions
    .map((id: string) => CONDITIONS.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const notes = [
    svc && `Service: ${svc.name}`,
    size && `Vehicle: ${size.name}${form.make ? ` · ${form.make} ${form.model}` : ""}`,
    form.address && `Address: ${form.address}, ${form.postal} ${form.city}`,
    form.parking && `Parking: ${form.parking}`,
    conditionsLabel && `Condition: ${conditionsLabel}`,
    form.notes && `Notes: ${form.notes}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div>
      <SectionTitle icon={Calendar} title="Schedule" subtitle="Pick a slot that works." />
      <p className="text-sm text-muted-foreground mb-6 -mt-4">
        Real-time availability — no double-bookings. Confirmation lands in your inbox automatically.
      </p>
      <CalScheduler
        serviceId={form.service}
        prefill={{ name: form.name, email: form.email, notes }}
        onBooking={handleBooking}
      />
    </div>
  );
}

function StepExtras({ form, toggleAddon }: any) {
  return (
    <div>
      <SectionTitle icon={Sparkles} title="Extras" subtitle="Add the finishing touches." />
      <div className="space-y-2">
        {ADDONS.map((a) => {
          const active = form.addons.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleAddon(a.id)}
              className={`w-full text-left rounded-2xl p-5 border transition flex items-center justify-between gap-4 ${
                active ? "border-primary bg-primary/5" : "border-border/70 bg-background/30 hover:border-foreground/30"
              }`}
            >
              <span className="font-medium">{a.name}</span>
              <span className="flex items-center gap-4">
                <span className="font-mono text-sm text-muted-foreground">+€{a.price}</span>
                <span className={`size-5 rounded-md border flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                  {active && <Check className="size-3 text-primary-foreground" />}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPay({ form, update, total, payError, payLoading, onPay }: any) {
  const isWet = form.service === "deep" || form.service === "full";
  const formReady =
    form.name.trim() !== "" &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim() !== "" &&
    (!isWet || form.dryingAcknowledged);
  const disabled = !formReady || !!payLoading;

  return (
    <div>
      <SectionTitle icon={CreditCard} title="Confirm & pay" subtitle="Last step before we hit the road." />
      <div className="space-y-3 mb-8">
        <Input label="Full name" placeholder="Jane Korhonen" value={form.name} onChange={(v) => update("name", v)} />
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="Email" type="email" placeholder="jane@example.com" value={form.email} onChange={(v) => update("email", v)} />
          <Input label="Phone" placeholder="+358 40 123 4567" value={form.phone} onChange={(v) => update("phone", v)} />
        </div>
        <p className="text-xs text-muted-foreground">
          We pre-filled this from your Cal.com booking — adjust if needed.
        </p>
      </div>

      {isWet && (
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <Droplets className="size-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-2">Aftercare: drying time required</p>
              <p className="text-muted-foreground">
                Deep wet cleaning leaves the cabin damp for <span className="text-foreground font-medium">6–24 hours</span>. We extract as much moisture as possible, but a mobile service can't fully dry the interior on-site — even with the heater on.
              </p>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                <li>· Keep windows cracked open for at least a day.</li>
                <li>· Park in sun, a heated garage, or a ventilated spot.</li>
                <li>· Avoid sealing the car shut overnight on day one.</li>
              </ul>

              <label className={`mt-4 flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${form.dryingAcknowledged ? "border-amber-500/60 bg-amber-500/10" : "border-amber-500/40 bg-background/40 hover:border-amber-500/60"}`}>
                <span className={`mt-0.5 size-5 rounded-md border flex items-center justify-center shrink-0 ${form.dryingAcknowledged ? "bg-amber-500 border-amber-500" : "border-amber-500/60 bg-background"}`}>
                  {form.dryingAcknowledged && <Check className="size-3 text-background" />}
                </span>
                <span className="text-sm text-foreground">
                  I understand the cabin will stay damp for 6–24 hours and I will follow the drying instructions above. <span className="text-amber-500">(required)</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.dryingAcknowledged}
                    onChange={(e) => update("dryingAcknowledged", e.target.checked)}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estimated total</span>
          <span className="font-display text-2xl">€{total}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          VAT 25.5% included. Final invoice may adjust ±10% based on on-site condition assessment.
        </p>
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Choose how to pay</p>
      <div className="grid md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onPay("deposit")}
          disabled={disabled}
          className="group rounded-2xl border border-border/70 bg-background/40 hover:border-primary hover:bg-primary/5 p-5 text-left transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Pay €20 deposit</span>
            {payLoading === "deposit" && <Loader2 className="size-4 animate-spin text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Secure your slot. Remainder (€{total - 20}) paid on site by cash or card.
          </p>
        </button>
        <button
          type="button"
          onClick={() => onPay("full")}
          disabled={disabled}
          className="group rounded-2xl border border-primary bg-primary/10 hover:bg-primary/15 p-5 text-left transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-primary">Pay €{total} in full</span>
            {payLoading === "full" && <Loader2 className="size-4 animate-spin text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground">
            One-and-done. Receipt by email. Nothing to handle on the day.
          </p>
        </button>
      </div>

      {payError && (
        <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {payError}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground mt-4 text-center">
        Secure payment via Stripe · Non-refundable inside 24h · Free reschedule before
      </p>
    </div>
  );
}


/* ---------- Sidebar summary ---------- */

function Summary({ form, total, discount }: { form: FormState; total: number; discount: number }) {
  const svc = SERVICES.find((s) => s.id === form.service);
  const size = VEHICLE_SIZES.find((v) => v.id === form.vehicleSize);
  const { lang } = useT();
  const zone = zoneFromPostal(form.postal);
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start rounded-3xl border border-border/70 bg-surface/50 p-6 h-fit">
      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Your booking</p>
      <dl className="space-y-3 text-sm">
        <Row label="Service" value={svc?.name ?? "—"} />
        <Row label="Vehicle" value={size ? `${size.name}${form.make ? ` · ${form.make} ${form.model}` : ""}` : "—"} />
        <Row label="Address" value={form.address || "—"} />
        <Row label="Zone" value={form.postal ? `${zone.label[lang]} · ${zone.fee === 0 ? "incl." : `+€${zone.fee}`}` : "—"} />
        <Row label="Slot" value={form.date && form.time ? `${form.date} · ${form.time}` : "—"} />
        <Row label="Condition" value={form.conditions.length ? form.conditions.map((id) => CONDITIONS.find((c) => c.id === id)?.name).join(", ") : (form.conditionsConfirmed ? "Normal" : "—")} />
        <Row label="Add-ons" value={form.addons.length ? form.addons.map((a) => ADDONS.find((x) => x.id === a)?.name).join(", ") : "None"} />
      </dl>
      {discount > 0 && (
        <div className="mt-4 flex items-baseline justify-between text-sm">
          <span className="text-primary font-medium">June promo · −15%</span>
          <span className="font-mono text-primary">−€{discount}</span>
        </div>
      )}
      <div className="mt-6 pt-6 border-t border-border/60 flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Estimated total</span>
        <span className="font-display text-2xl">€{total || "—"}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-right">VAT 25.5% included</p>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-right text-foreground/90 truncate max-w-[55%]">{value}</dd>
    </div>
  );
}

/* ---------- Inputs ---------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-background/40 border border-border/70 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-background transition"
      />
    </label>
  );
}

function BoolField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { v: true, l: "Yes" },
          { v: false, l: "No" },
        ].map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.l}
              type="button"
              onClick={() => onChange(o.v)}
              className={`rounded-xl py-3 border text-sm transition ${
                active ? "border-primary bg-primary/5 text-primary" : "border-border/70 bg-background/30 hover:border-foreground/30"
              }`}
            >
              {o.l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Success ---------- */

function Success({ form, total }: { form: FormState; total: number }) {
  return (
    <div className="bg-background min-h-screen">
      <Nav />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto size-20 rounded-full bg-primary/20 border border-primary flex items-center justify-center mb-8"
          >
            <Check className="size-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
            Booking confirmed
          </h1>
          <p className="text-muted-foreground mt-4">
            Thanks {form.name.split(" ")[0] || "—"}. We've reserved your slot and emailed the details to {form.email}.
            A detailer will confirm the exact ETA within the hour.
          </p>
          <div className="mt-10 rounded-3xl border border-border/70 bg-surface/50 p-6 text-left">
            <div className="flex justify-between py-2 border-b border-border/60">
              <span className="text-muted-foreground">Slot</span>
              <span className="font-medium">{form.date} · {form.time}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/60">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium">{form.address}, {form.city}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/60">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="font-medium">€{total}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Deposit paid</span>
              <span className="font-medium text-primary">€20</span>
            </div>
          </div>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-medium hover:shadow-[0_0_30px_var(--color-primary)] transition"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
