import Link from "next/link";
import {
  Icon,
  primaryButton,
  SectionIntro,
  secondaryButton,
} from "@/components/ui/marketing";
import { addons, buildTiers, type Currency, formatPrice } from "@/lib/pricing";

const BuildTiers = ({ currency }: { currency: Currency }) => (
  <section aria-labelledby="builds-heading" className="mb-20 sm:mb-28">
    <SectionIntro
      id="builds-heading"
      title="Build your website or product"
      lead="One-time project prices. Final cost depends on scope."
    />
    <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {buildTiers.map((tier) => (
        <li
          key={tier.id}
          className={`relative flex flex-col rounded-3xl border bg-background/80 backdrop-blur-md p-7 ${
            tier.popular
              ? "border-primary shadow-lg shadow-primary/15"
              : "border-foreground/10"
          }`}
        >
          {tier.popular && (
            <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-content">
              Recommended
            </span>
          )}
          <h3 className="font-display text-xl font-bold mb-2">{tier.name}</h3>
          <p className="text-sm text-foreground/70 mb-5">{tier.summary}</p>
          <p className="text-xs uppercase tracking-wide text-foreground/50">
            Starting from
          </p>
          <p className="font-display text-3xl font-black mb-5">
            {formatPrice(tier.price[currency], currency)}
          </p>
          <ul className="space-y-2 text-sm mb-7 flex-1">
            {tier.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Icon name="check" className="text-primary text-base" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/contact?service=${tier.serviceId}&plan=${tier.id}`}
            className={tier.popular ? primaryButton : secondaryButton}
          >
            Get a quote
          </Link>
        </li>
      ))}
    </ul>

    <ul className="mt-6">
      {addons.map((a) => (
        <li
          key={a.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-md px-6 py-5"
        >
          <div>
            <p className="font-display font-bold">Add-on: {a.name}</p>
            <p className="text-sm text-foreground/70">{a.summary}</p>
          </div>
          <p className="font-display text-xl font-black">
            {formatPrice(a.price[currency], currency)}
          </p>
        </li>
      ))}
    </ul>
  </section>
);

export default BuildTiers;
