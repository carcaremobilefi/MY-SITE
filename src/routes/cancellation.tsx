import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/cancellation")({
  head: () => ({
    meta: [
      { title: "Cancellation Policy — CarCare Mobile" },
      { name: "description", content: "Reschedule and cancellation rules for CarCare Mobile bookings." },
    ],
  }),
  component: CancellationPage,
});

function CancellationPage() {
  const { t } = useT();
  return (
    <LegalPage title={t("legal.cancel.title")} intro={t("legal.updated") + " 2026-05-19"}>
      <p>{t("legal.cancel.lead")}</p>

      <h2>1. {t("legal.cancel.h1")}</h2>
      <p>{t("legal.cancel.p1")}</p>

      <h2>2. {t("legal.cancel.h2")}</h2>
      <p>{t("legal.cancel.p2")}</p>

      <h2>3. {t("legal.cancel.h3")}</h2>
      <p>{t("legal.cancel.p3")}</p>

      <h2>4. {t("legal.cancel.h4")}</h2>
      <p>{t("legal.cancel.p4")}</p>

      <h2>5. {t("legal.cancel.h5")}</h2>
      <p>{t("legal.cancel.p5")}</p>
    </LegalPage>
  );
}
