import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";

const Input = z.object({
  mode: z.enum(["deposit", "full"]),
  totalEur: z.number().int().min(20).max(2000),
  serviceName: z.string().min(1).max(120),
  customerEmail: z.string().email().max(200),
  customerName: z.string().min(1).max(120),
  bookingDate: z.string().max(40).optional(),
  bookingNotes: z.string().max(1000).optional(),
  origin: z.string().url(),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");

    const stripe = new Stripe(key);

    const amountCents = (data.mode === "deposit" ? 20 : data.totalEur) * 100;
    const label =
      data.mode === "deposit"
        ? `Booking deposit — ${data.serviceName}`
        : `${data.serviceName} (full prepayment)`;

    const description = [
      data.bookingDate && `Slot: ${data.bookingDate}`,
      data.mode === "deposit" && `Deposit €20 of estimated €${data.totalEur}. Remainder paid on site.`,
      data.bookingNotes && `Notes: ${data.bookingNotes}`,
    ]
      .filter(Boolean)
      .join(" · ");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: data.customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: {
              name: label,
              description: description || undefined,
            },
          },
        },
      ],
      metadata: {
        mode: data.mode,
        service: data.serviceName,
        customer_name: data.customerName,
        booking_date: data.bookingDate ?? "",
        total_eur: String(data.totalEur),
      },
      success_url: `${data.origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/book?canceled=1`,
      locale: "auto",
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { url: session.url };
  });
