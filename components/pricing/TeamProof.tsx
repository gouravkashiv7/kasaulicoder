import Link from "next/link";
import { Icon, SectionIntro, textLink } from "@/components/ui/marketing";

const TeamProof = () => (
  <section aria-labelledby="team-proof-heading" className="mb-20 sm:mb-28">
    <SectionIntro
      id="team-proof-heading"
      title="Built by engineers who have shipped before"
      lead="Our team of engineers brings an average of 3+ years of experience, and we have delivered multiple projects for clients across websites, CRMs and SaaS."
    />
    <ul className="grid sm:grid-cols-2 gap-6 mb-8">
      <li className="rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-md p-7">
        <Icon name="engineering" className="text-primary text-3xl mb-4 block" />
        <p className="font-display text-2xl font-black mb-1">3+ years</p>
        <p className="text-sm text-foreground/70">
          Average experience across our engineers.
        </p>
      </li>
      <li className="rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-md p-7">
        <Icon
          name="rocket_launch"
          className="text-primary text-3xl mb-4 block"
        />
        <p className="font-display text-2xl font-black mb-1">
          Multiple projects delivered
        </p>
        <p className="text-sm text-foreground/70">
          Built, deployed and managed for real clients.
        </p>
      </li>
    </ul>
    <div className="flex flex-wrap gap-6">
      <Link href="/projects" className={textLink}>
        See our projects
      </Link>
      <Link href="/about" className={textLink}>
        Meet the team
      </Link>
    </div>
  </section>
);

export default TeamProof;
