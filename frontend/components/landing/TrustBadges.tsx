"use client";

import { Lock, Shield, Building2, BadgeCheck, ShieldCheck } from "lucide-react";
import { TRUST_BADGES } from "@/lib/landing-content";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock,
  Shield,
  Building2,
  BadgeCheck,
  ShieldCheck,
};

export function TrustBadges() {
  return (
    <section className="py-8 bg-white border-y border-[var(--color-muted)]">
      <div className="container-main">
        <div className="trust-badges-scroll">
          {TRUST_BADGES.map((badge) => {
            const Icon = iconMap[badge.icon] || Shield;
            return (
              <div
                key={badge.id}
                className="badge flex-shrink-0"
              >
                <Icon className="w-4 h-4" />
                <span>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}