import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const linkProps: LinkProps = { to: "/" };
  return (
    <div className="bg-background min-h-screen">
      <Nav />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link
            {...linkProps}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
          >
            <ArrowLeft className="size-4" /> Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">{title}</h1>
          {intro && <p className="text-muted-foreground mt-4 max-w-2xl">{intro}</p>}
          <div className="legal-body mt-10 space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:tracking-tight [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
