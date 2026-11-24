import { SectionIntro } from "@/components/ui/marketing";
import { faqs } from "@/lib/pricing";

const PricingFaq = () => (
  <section aria-labelledby="faq-heading" className="mb-20 sm:mb-28">
    <SectionIntro id="faq-heading" title="Pricing questions" />
    <div className="max-w-3xl space-y-3">
      {faqs.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-md px-6 py-4"
        >
          <summary className="cursor-pointer font-display font-bold list-none flex justify-between gap-4">
            {f.q}
            <span
              aria-hidden="true"
              className="text-primary group-open:rotate-45 transition-transform"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-foreground/70 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  </section>
);

export default PricingFaq;
