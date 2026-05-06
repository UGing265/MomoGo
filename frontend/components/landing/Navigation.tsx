"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Trang chủ", href: "#" },
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#howitwork" },
  { label: "Hỗ trợ", href: "#contact" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border py-1">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-3xl font-bold font-semibold text-foreground">
              MomoGo
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-primary transition-all duration-300 -translate-x-1/2 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Side Actions - CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="lg" className="font-semibold px-6 py-5">
              Tải MomoGo
            </Button>
            <Button variant="outline" size="lg" className="font-semibold border-2 border-primary text-primary hover:bg-primary/10 px-6 py-5">
              Bắt đầu
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-foreground">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 px-4 py-3 border-t border-border mt-2 pt-4">
                <Button variant="secondary" className="w-full font-semibold">
                  Tải MomoGo
                </Button>
                <Button variant="outline" className="w-full font-semibold border-2 border-primary text-primary hover:bg-primary/10">
                  Bắt đầu
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}