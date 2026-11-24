// Public "starting from" prices. Both currencies are set by hand; nothing is
// converted at runtime. Shared by the pricing page and its tests.

export type Currency = "INR" | "USD";
export type Money = { INR: number; USD: number };

export interface BuildTier {
  id: string;
  name: string;
  summary: string;
  features: string[];
  price: Money;
  startingFrom: true;
  popular?: boolean;
  serviceId: string;
}

export interface ManagedPlan {
  id: string;
  name: string;
  summary: string;
  features: string[];
  monthly: Money;
  serviceId: string;
}

export interface Addon {
  id: string;
  name: string;
  summary: string;
  price: Money;
}

export const buildTiers: BuildTier[] = [
  {
    id: "launch",
    name: "Launch",
    summary: "A single, fast, search-friendly page for a business or campaign.",
    features: [
      "Single-page website",
      "Responsive design",
      "On-page SEO basics and metadata",
      "Contact or enquiry form",
      "Deployment to your domain",
    ],
    price: { INR: 14999, USD: 349 },
    startingFrom: true,
    serviceId: "product-engineering",
  },
  {
    id: "business",
    name: "Business",
    summary: "A complete multi-page website that represents your business.",
    features: [
      "Up to 8 pages",
      "Blog or content section",
      "On-page SEO and site structure",
      "Speed and Core Web Vitals tuning",
      "Deployment, domain and SSL setup",
    ],
    price: { INR: 39999, USD: 899 },
    startingFrom: true,
    popular: true,
    serviceId: "product-engineering",
  },
  {
    id: "growth",
    name: "Growth",
    summary: "A CRM-based website that captures and tracks your leads.",
    features: [
      "Everything in Business",
      "Lead capture and pipeline",
      "Admin dashboard",
      "Email notifications and automations",
      "Integrations with tools you already use",
    ],
    price: { INR: 89999, USD: 1999 },
    startingFrom: true,
    serviceId: "product-engineering",
  },
  {
    id: "saas",
    name: "SaaS / Custom",
    summary: "A product or custom application, scoped around your business.",
    features: [
      "Product design and architecture",
      "Web application and APIs",
      "Auth, billing and admin tooling as needed",
      "Production deployment",
      "Scoped and quoted per project",
    ],
    price: { INR: 250000, USD: 5500 },
    startingFrom: true,
    serviceId: "product-engineering",
  },
];

export const managedPlans: ManagedPlan[] = [
  {
    id: "care",
    name: "Care",
    summary: "The minimum: we keep it online, updated and fixed.",
    features: [
      "Hosting and deployment",
      "Domain and SSL management",
      "Updates and security patches",
      "Uptime monitoring",
      "Bug fixes",
    ],
    monthly: { INR: 2999, USD: 59 },
    serviceId: "cloud-support",
  },
  {
    id: "grow",
    name: "Grow",
    summary: "Care, plus ongoing SEO work and reporting.",
    features: [
      "Everything in Care",
      "Managed SEO work",
      "Monthly report",
      "Content tweaks",
    ],
    monthly: { INR: 9999, USD: 199 },
    serviceId: "seo-digital-growth",
  },
  {
    id: "scale",
    name: "Scale",
    summary: "Priority help for CRM and SaaS products in production.",
    features: [
      "Everything in Grow",
      "Priority support",
      "CRM and SaaS maintenance",
      "Monthly bank of development hours",
    ],
    monthly: { INR: 24999, USD: 499 },
    serviceId: "cloud-support",
  },
];

export const addons: Addon[] = [
  {
    id: "brand-identity",
    name: "Brand identity",
    summary: "Logo, colour palette, typography and brand guidelines.",
    price: { INR: 14999, USD: 349 },
  },
];

export const discounts = {
  annualMonthsPaid: 10,
  bundlePercent: 10,
  referralPercent: 5,
  // Set slotsLeft to a real number to show the launch offer; null hides it.
  launchOffer: { slotsLeft: null as number | null, label: "Launch offer" },
};

export const faqs = [
  {
    q: "Are these final prices?",
    a: "They are starting prices. Every project is scoped to your requirements, and you get a written quote before any work begins.",
  },
  {
    q: "What does the monthly plan cover?",
    a: "Care keeps your site hosted, updated, monitored and fixed. Grow adds managed SEO work and a monthly report. Scale adds priority support and development hours for CRM and SaaS products.",
  },
  {
    q: "Do you guarantee search rankings?",
    a: "No. Rankings depend on factors no one fully controls. We do the technical and on-page work that can be improved and report on it each month.",
  },
  {
    q: "How do the discounts work?",
    a: "Paying a managed plan annually gives you two months free. Taking a build together with a Care or Grow plan gives 10% off the build. Referrals earn a 5% credit on the referred client's first invoice.",
  },
  {
    q: "What about revisions, ownership and payment terms?",
    a: "These are set out in your proposal so they match the size of your project.",
  },
  {
    q: "Why are prices shown in rupees or dollars?",
    a: "Clients in India see rupees (plus 18% GST). Everyone else sees US dollars. You can switch currency at any time.",
  },
];

export function currencyForCountry(code: string | null | undefined): Currency {
  return code?.trim().toUpperCase() === "IN" ? "INR" : "USD";
}

export function formatPrice(
  amount: number,
  currency: Currency,
  plus = false,
): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const symbol = currency === "INR" ? "₹" : "$";
  return `${symbol}${new Intl.NumberFormat(locale).format(amount)}${plus ? "+" : ""}`;
}

export function annualPrice(monthly: number): number {
  return monthly * discounts.annualMonthsPaid;
}

export function bundleBuildPrice(price: number): number {
  return Math.round(price * (1 - discounts.bundlePercent / 100));
}
