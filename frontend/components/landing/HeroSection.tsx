"use client";

import { HERO_CONTENT } from "@/lib/landing-content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10 py-16 md:py-24 lg:py-28">
      <div className="container-main">
        {/* Two Column Layout - Content LEFT, Phone RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT: Text Content */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 rounded-full w-fit animate-bounce">
              <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">verified</span>
              <span className="text-body text-[var(--color-primary)] font-medium">
                Được tin tưởng bởi 1M+ người dùng
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-h1 text-[var(--color-on-surface)] leading-tight">
              {HERO_CONTENT.title}
            </h1>

            {/* Subtitle */}
            <p className="text-body text-[var(--color-outline)] max-w-lg">
              {HERO_CONTENT.subtitle}
            </p>

            {/* CTA Buttons - Horizontal */}
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined">bolt</span>
                {HERO_CONTENT.primaryCta}
              </button>
              <button className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined">play_arrow</span>
                {HERO_CONTENT.secondaryCta}
              </button>
            </div>
          </div>

          {/* RIGHT: Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-64 md:w-72 aspect-[9/16] bg-gradient-to-br from-[var(--color-primary)] to-[#0055cc] rounded-[2.5rem] shadow-2xl p-2">
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative flex flex-col">
                {/* Phone Status Bar */}
                <div className="h-7 bg-[var(--color-primary)] flex items-end justify-center pb-1 flex-shrink-0">
                  <div className="w-14 h-3 bg-black/20 rounded-full" />
                </div>

                {/* App Content */}
                <div className="p-4 flex flex-col items-center flex-1">
                  {/* MomoGo Logo in App */}
                  <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mt-4 mb-4">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>

                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">MomoGo</p>
                  <p className="text-xs text-[var(--color-outline)] mb-4">Digital Wallet</p>

                  {/* Balance Card */}
                  <div className="w-full bg-gradient-to-r from-[var(--color-primary)] to-blue-400 rounded-xl p-3 text-white mb-3">
                    <p className="text-[10px] opacity-80">Số dư ví</p>
                    <p className="text-xl font-bold">12,500,000đ</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {[
                      { icon: "qr_code_scanner", label: "QR" },
                      { icon: "send", label: "Chuyển" },
                      { icon: "account_balance", label: "Nạp" },
                      { icon: "history", label: "Lịch sử" },
                    ].map((action) => (
                      <div key={action.label} className="flex flex-col items-center p-2">
                        <div className="w-9 h-9 bg-[var(--color-surface)] rounded-lg flex items-center justify-center mb-1">
                          <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">{action.icon}</span>
                        </div>
                        <span className="text-[9px] text-[var(--color-outline)]">{action.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Nav Bar */}
                <div className="h-12 bg-white border-t border-[var(--color-muted)] flex items-center justify-around px-2 flex-shrink-0">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">home</span>
                  <span className="material-symbols-outlined text-[var(--color-outline)] text-sm">qr_code</span>
                  <span className="material-symbols-outlined text-[var(--color-outline)] text-sm">send</span>
                  <span className="material-symbols-outlined text-[var(--color-outline)] text-sm">wallet</span>
                  <span className="material-symbols-outlined text-[var(--color-outline)] text-sm">person</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}