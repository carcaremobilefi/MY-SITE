import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CarCare Mobile" },
      { name: "description", content: "How CarCare Mobile collects and processes personal data — GDPR compliant." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useT();
  return (
    <LegalPage title={t("legal.privacy.title")} intro={t("legal.updated") + " 2026-05-19"}>
      <p>{t("legal.privacy.lead")}</p>

      <h2>1. {t("legal.privacy.h1")}</h2>
      <p>{t("legal.privacy.p1")}</p>

      <h2>2. {t("legal.privacy.h2")}</h2>
      <ul>
        <li>{t("legal.privacy.li1")}</li>
        <li>{t("legal.privacy.li2")}</li>
        <li>{t("legal.privacy.li3")}</li>
        <li>{t("legal.privacy.li4")}</li>
      </ul>

      <h2>3. {t("legal.privacy.h3")}</h2>
      <p>{t("legal.privacy.p3")}</p>

      <h2>4. {t("legal.privacy.h4")}</h2>
      <p>{t("legal.privacy.p4")}</p>

      <h2>5. {t("legal.privacy.h5")}</h2>
      <p>{t("legal.privacy.p5")}</p>

      <h2>6. {t("legal.privacy.h6")}</h2>
      <p>{t("legal.privacy.p6")}</p>

      <h2>7. {t("legal.privacy.h7")}</h2>
      <p>{t("legal.privacy.p7")}</p>
    </LegalPage>
  );
}
