"use client";

import { HOW_IT_WORKS } from "@/lib/landing-content";

export function HowItWorks() {
  return (
    <section id="howitwork" className="section bg-white">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            Bắt đầu trong 3 bước
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            Đăng ký và bắt đầu sử dụng MomoGo chỉ trong vài phút.
          </p>
        </div>

        <div className="relative">
          {/* Steps */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-4">
            {HOW_IT_WORKS.map((item, index) => (
              <div
                key={item.step}
                className="flex-1 relative flex flex-col items-center"
              >
                {/* Connector line (desktop only) */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] right-0 h-0.5 bg-[var(--color-muted)] -z-10" />
                )}

                {/* Step number */}
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>

                {/* Content */}
                <h3 className="text-title text-[var(--color-on-surface)] mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-body text-[var(--color-outline)] text-center max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}