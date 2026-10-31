"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionIntro } from "@/components/ui/marketing";

interface TeamMember {
  _id?: string;
  name: string;
  designation?: string;
  roleDescription?: string;
  image?: string;
}

const HomeTeamWorkTestimonials = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/public/team");
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch {
        console.error("Failed to fetch team members");
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeam();
  }, []);

  // Shown only when real team members exist; no placeholder state.
  if (loadingTeam || teamMembers.length === 0) return null;

  return (
    <section
      aria-labelledby="team-heading"
      className="px-4 sm:px-6 py-20 sm:py-28"
    >
      <div className="max-w-7xl mx-auto">
        <SectionIntro
          id="team-heading"
          title="The people behind KasauliCoder"
        />

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <li
              key={member._id || member.name}
              className="flex flex-col rounded-3xl border border-foreground/10 bg-background/70 backdrop-blur-md p-3"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-foreground/5 flex items-center justify-center">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="font-display text-5xl font-black text-primary/40 uppercase select-none">
                    {member.name?.charAt(0) || "K"}
                  </span>
                )}
              </div>
              <div className="px-3 pt-5 pb-4">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {member.name}
                </h3>
                {member.designation && (
                  <p className="text-sm font-semibold text-primary mt-1">
                    {member.designation}
                  </p>
                )}
                {member.roleDescription && (
                  <p className="text-sm text-foreground/70 leading-relaxed mt-3">
                    {member.roleDescription}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeTeamWorkTestimonials;
