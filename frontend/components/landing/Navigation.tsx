"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "Trang chủ", href: "#" },
  { label: "Giao dịch", href: "#transactions" },
  { label: "Thống kê", href: "#statistics" },
  { label: "Hỗ trợ", href: "#contact" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-muted)]">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-3xl font-bold font-semibold text-[var(--color-on-surface)]">
              MomoGo
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-body text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions - CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="btn-secondary px-5 py-2.5 text-body rounded-lg">
              Tải MomoGo
            </button>
            <button className="btn-outline px-5 py-2.5 text-body rounded-lg border-2 border-[var(--color-primary)]">
              Bắt đầu
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-lg hover:bg-[var(--color-surface)] flex items-center justify-center transition-colors touch-target"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[var(--color-on-surface)]">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--color-muted)]">
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-body text-[var(--color-on-surface)] hover:bg-[var(--color-surface)] rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 px-4 py-3 border-t border-[var(--color-muted)] mt-2 pt-4">
                <button className="btn-secondary w-full py-3 rounded-lg">
                  Tải MomoGo
                </button>
                <button className="btn-outline w-full py-3 rounded-lg border-2 border-[var(--color-primary)]">
                  Bắt đầu
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}