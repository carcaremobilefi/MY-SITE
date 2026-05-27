import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/pay/success")({
  head: () => ({
    meta: [
      { title: "Payment confirmed — CarCare Mobile" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaySuccess,
});

function PaySuccess() {
  const sessionId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("session_id")
      : null;

  return (
    <div className="bg-background min-h-screen">
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8 text-center">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/15 text-primary mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
            Payment <span className="text-primary">confirmed</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Thank you — your appointment is locked in. You will receive a Stripe receipt by email,
            plus a Cal.com confirmation with the exact time and a calendar invite.
          </p>

          <div className="mt-10 rounded-2xl border border-border/70 bg-surface/50 p-6 text-left text-sm space-y-3">
            <p className="text-foreground font-medium">What happens next</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>· We will message you the day before to confirm the address and parking.</li>
              <li>· Light rain is fine — heavy rain or storm: we reschedule for free.</li>
              <li>· Free reschedule up to 24h before your slot via the Cal.com link in your email.</li>
            </ul>
          </div>

          {sessionId && (
            <p className="text-[10px] font-mono text-muted-foreground mt-6 break-all">
              ref: {sessionId}
            </p>
          )}

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-semibold hover:shadow-[0_0_30px_var(--color-primary)] transition"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
