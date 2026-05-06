"use client";

import { Star } from "lucide-react";

const SECURITY_FEATURES = [
  {
    icon: "https://www.grandviewresearch.com/static/img/pci-dss-certified_1.png",
    title: "Chứng nhận PCI DSS",
    description: "MomoGo đạt chuẩn PCI DSS Level 1 - tiêu chuẩn bảo mật cao nhất cho ngành thanh toán",
  },
  {
    icon: "https://www.watchregister.com/img/aes256.png",
    title: "Mã hóa AES-256",
    description: "Dữ liệu được mã hóa đầu cuối với thuật toán AES-256 bit - cùng tiêu chuẩn với ngân hàng",
  },
  {
    icon: "https://tse1.mm.bing.net/th/id/OIP.gVSFOYrCp6CFtJp0xmHwmgHaC0?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "GlobalSign Certificate",
    description: "Chứng chỉ số GlobalSign xác thực và mã hóa giao dịch an toàn",
  },
];

export function SecuritySection() {
  return (
    <section className="section bg-gradient-to-br from-[#e9edff] to-[#fdd000]/10">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="badge mb-4 bg-primary/10 border border-primary/20 animate-bounce">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-primary">Bảo mật và An toàn</span>
          </div>
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            An toàn như ngân hàng
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            MomoGo áp dụng các tiêu chuẩn bảo mật nghiêm ngặt nhất để bảo vệ tài sản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SECURITY_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-6"
            >
              {/* Image with white background */}
              <div className="relative">
                <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex items-center justify-center p-6">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-title text-foreground font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}