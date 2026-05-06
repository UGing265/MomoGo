"use client";

import { STATS, TESTIMONIALS } from "@/lib/landing-content";

export function SocialProof() {
  return (
    <section className="section bg-[var(--color-surface)]">
      <div className="container-main">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4"
            >
              <div className="text-h1 text-[var(--color-primary)] mb-1">
                {stat.value}
              </div>
              <div className="text-body text-[var(--color-outline)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card p-6 flex flex-col gap-4"
            >
              <p className="text-body text-[var(--color-on-surface)] italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-muted)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-title text-sm text-[var(--color-on-surface)]">
                    {testimonial.name}
                  </div>
                  <div className="text-caption text-[var(--color-outline)]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}