import Link from "next/link";
import { Icon, SectionIntro, textLink } from "@/components/ui/marketing";

const TeamProof = () => (
  <section aria-labelledby="team-proof-heading" className="mb-20 sm:mb-28">
    <SectionIntro
      id="team-proof-heading"
      title="Built by engineers who have shipped before"
      lead="Our engineers have designed, built and deployed the projects in our portfolio, from business websites and booking systems to an ERP and SaaS platforms."
    />
    <ul className="grid sm:grid-cols-2 gap-6 mb-8">
      <li className="rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-md p-7">
        <Icon name="public" className="text-primary text-3xl mb-4 block" />
        <p className="font-display text-2xl font-black mb-1">
          Live in production
        </p>
        <p className="text-sm text-foreground/70">
          Our portfolio links to the running applications, so you can try them
          yourself.
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
          Designed, built and deployed by our own team.
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
