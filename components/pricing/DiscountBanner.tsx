import { Icon } from "@/components/ui/marketing";
import {
  buildTiers,
  bundleBuildPrice,
  type Currency,
  discounts,
  formatPrice,
} from "@/lib/pricing";

const DiscountBanner = ({ currency }: { currency: Currency }) => {
  const business = buildTiers.find((t) => t.id === "business");
  const slots = discounts.launchOffer.slotsLeft;
  const items = [
    {
      icon: "calendar_month",
      title: "Pay annually, get 2 months free",
      desc: "On any managed plan.",
    },
    {
      icon: "inventory_2",
      title: `Bundle a build with Care or Grow: ${discounts.bundlePercent}% off the build`,
      desc: business
        ? `Business drops from ${formatPrice(business.price[currency], currency)} to ${formatPrice(bundleBuildPrice(business.price[currency]), currency)}.`
        : "",
    },
    {
      icon: "group_add",
      title: `Refer a client, earn ${discounts.referralPercent}% credit`,
      desc: "On the referred client's first invoice.",
    },
  ];

  return (
    <section
      aria-labelledby="discounts-heading"
      className="mb-20 sm:mb-28 rounded-3xl border border-primary/30 bg-primary/5 p-8 sm:p-10"
    >
      <h2
        id="discounts-heading"
        className="font-display text-2xl sm:text-3xl font-black mb-6"
      >
        Discounts
      </h2>
      {slots !== null && slots > 0 && (
        <p className="mb-6 font-bold text-primary">
          {discounts.launchOffer.label}: {slots} slots left
        </p>
      )}
      <ul className="grid md:grid-cols-3 gap-6">
        {items.map((i) => (
          <li key={i.title}>
            <Icon name={i.icon} className="text-primary text-3xl mb-3 block" />
            <p className="font-display font-bold mb-1">{i.title}</p>
            <p className="text-sm text-foreground/70">{i.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DiscountBanner;
