import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { AlertTriangle } from "lucide-react";
import { CAL_CONFIGURED, calLinkFor } from "@/lib/cal";

export type CalBookingDetails = {
  startTime?: string;
  endTime?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  bookingUid?: string;
};

type Props = {
  serviceId: string;
  prefill?: { name?: string; email?: string; notes?: string };
  onBooking: (details: CalBookingDetails) => void;
};

/**
 * Inline Cal.com calendar.
 * Cal.com is the source of truth for availability — double-bookings are
 * prevented automatically when Google Calendar is connected in Cal settings.
 */
export function CalScheduler({ serviceId, prefill, onBooking }: Props) {
  const namespace = useRef(`carcare-${serviceId}`).current;
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace });
      if (cancelled) return;

      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          light: { "cal-brand": "#ff6a00" },
          dark: { "cal-brand": "#ff6a00" },
        },
      });

      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          const d = e?.detail?.data ?? {};
          const b = d.booking ?? {};
          setBooked(true);
          onBooking({
            startTime: b.startTime ?? d.date,
            endTime: b.endTime,
            attendeeName: b?.attendees?.[0]?.name ?? prefill?.name,
            attendeeEmail: b?.attendees?.[0]?.email ?? prefill?.email,
            bookingUid: b.uid,
          });
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [namespace, onBooking, prefill?.name, prefill?.email]);

  if (!CAL_CONFIGURED) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5 flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-foreground mb-1">Cal.com not configured yet</p>
          <p className="text-muted-foreground">
            Set <code className="font-mono text-foreground">CAL_USERNAME</code> in{" "}
            <code className="font-mono text-foreground">src/lib/cal.ts</code> after signing up at{" "}
            <a href="https://cal.com/signup" target="_blank" rel="noreferrer" className="text-primary underline">cal.com/signup</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-background/30 overflow-hidden">
      {booked && (
        <div className="px-5 py-3 bg-primary/10 border-b border-primary/30 text-sm text-primary">
          ✓ Slot reserved. Continue to payment below.
        </div>
      )}
      <Cal
        namespace={namespace}
        calLink={calLinkFor(serviceId)}
        style={{ width: "100%", minHeight: 620, overflow: "scroll" }}
        config={{
          layout: "month_view",
          theme: "dark",
          ...(prefill?.name ? { name: prefill.name } : {}),
          ...(prefill?.email ? { email: prefill.email } : {}),
          ...(prefill?.notes ? { notes: prefill.notes } : {}),
        }}
      />
    </div>
  );
}
