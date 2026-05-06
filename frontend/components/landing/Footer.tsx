"use client";

import { FOOTER_COPYRIGHT } from "@/lib/landing-content";

const FOOTER_COLUMNS = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Tính năng", href: "#features" },
      { label: "Bảo mật", href: "#security" },
      { label: "Phí dịch vụ", href: "#pricing" },
      { label: "Liên kết ngân hàng", href: "#banks" },
    ],
  },
  {
    title: "Công ty",
    links: [
      { label: "Giới thiệu", href: "#about" },
      { label: "Tuyển dụng", href: "#careers" },
      { label: "Tin tức", href: "#news" },
      { label: "Liên hệ", href: "#contact" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Giấy phép", href: "/license" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Câu hỏi thường gặp", href: "#faq" },
      { label: "Báo lỗi", href: "/report" },
      { label: "API Docs", href: "/api-docs" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#051a3e] text-white">
      <div className="container-main py-16">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col">
              <h4 className="text-title font-semibold mb-4 text-white">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-body text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-[var(--color-primary)] font-bold text-lg">M</span>
              </div>
              <span className="text-title font-semibold">MomoGo</span>
            </div>
            <p className="text-caption text-gray-400">{FOOTER_COPYRIGHT}</p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="/privacy" className="text-caption text-gray-400 hover:text-white transition-colors">
              Chính sách bảo mật
            </a>
            <span className="text-gray-600">|</span>
            <a href="/terms" className="text-caption text-gray-400 hover:text-white transition-colors">
              Điều khoản sử dụng
            </a>
            <span className="text-gray-600">|</span>
            <a href="/help" className="text-caption text-gray-400 hover:text-white transition-colors">
              Trung tâm trợ giúp
            </a>
            <span className="text-gray-600">|</span>
            <a href="/api-docs" className="text-caption text-gray-400 hover:text-white transition-colors">
              API Docs
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {[
            { icon: "verified", text: "PCI DSS Level 1" },
            { icon: "lock", text: "SSL Bảo mật" },
            { icon: "account_balance", text: "Liên kết ngân hàng" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full"
            >
              <span className="material-symbols-outlined text-sm text-gray-400">{badge.icon}</span>
              <span className="text-caption text-gray-400">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}