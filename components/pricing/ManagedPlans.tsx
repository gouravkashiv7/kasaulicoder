"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, SectionIntro, secondaryButton } from "@/components/ui/marketing";
import {
  annualPrice,
  type Currency,
  formatPrice,
  managedPlans,
} from "@/lib/pricing";

const ManagedPlans = ({ currency }: { currency: Currency }) => {
  const [annual, setAnnual] = useState(false);

  return (
    <section aria-labelledby="managed-heading" className="mb-20 sm:mb-28">
      <SectionIntro
        id="managed-heading"
        title="We manage it for you"
        lead="Deployment, updates, SEO work and support, handled monthly. Managed plans are optional; Care is the entry plan."
      />
      <fieldset className="inline-flex rounded-xl border border-foreground/20 p-1 mb-8">
        <legend className="sr-only">Billing period</legend>
        {[false, true].map((a) => (
          <button
            key={String(a)}
            type="button"
            aria-pressed={annual === a}
            onClick={() => setAnnual(a)}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${
              annual === a
                ? "bg-primary text-primary-content"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {a ? "Annual · 2 months free" : "Monthly"}
          </button>
        ))}
      </fieldset>
      <ul className="grid md:grid-cols-3 gap-6">
        {managedPlans.map((plan) => {
          const monthly = plan.monthly[currency];
          return (
            <li
              key={plan.id}
              className="flex flex-col rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-md p-7"
            >
              <h3 className="font-display text-xl font-bold mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-foreground/70 mb-5">{plan.summary}</p>
              {annual ? (
                <>
                  <p className="font-display text-3xl font-black">
                    {formatPrice(annualPrice(monthly), currency)}
                    <span className="text-base font-normal text-foreground/60">
                      /year
                    </span>
                  </p>
                  <p className="text-sm text-foreground/50 line-through mb-5">
                    {formatPrice(monthly * 12, currency)}
                  </p>
                </>
              ) : (
                <p className="font-display text-3xl font-black mb-5">
                  {formatPrice(monthly, currency)}
                  <span className="text-base font-normal text-foreground/60">
                    /month
                  </span>
                </p>
              )}
              <ul className="space-y-2 text-sm mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Icon name="check" className="text-primary text-base" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?service=${plan.serviceId}&plan=${plan.id}`}
                className={secondaryButton}
              >
                Choose {plan.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ManagedPlans;
