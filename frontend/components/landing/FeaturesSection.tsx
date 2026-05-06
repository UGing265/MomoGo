"use client";

const FEATURES = [
  {
    id: "qr",
    title: "Thanh toán QR",
    description: "Quét mã QR để thanh toán tại hàng triệu điểm chấp nhận trên toàn quốc. Không cần tiền mặt, không cần thẻ.",
    icon: "qr_code_scanner",
    color: "#0052CC",
  },
  {
    id: "p2p",
    title: "P2P tức thì",
    description: "Chuyển tiền cho bạn bè và người thân ngay lập tức, 24/7. Không giới hạn thời gian, không phí.",
    icon: "group",
    color: "#FFD200",
  },
  {
    id: "secure",
    title: "Bảo mật cao cấp",
    description: "Mã hóa AES-256, xác thực đa lớp và theo dõi giao dịch real-time. Tiêu chuẩn PCI DSS Level 1.",
    icon: "security",
    color: "#00B8D9",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section bg-[var(--color-surface)]">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="badge mb-4">
            <span className="material-symbols-outlined text-sm">star</span>
            <span>Tính năng nổi bật</span>
          </div>
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            Mọi thứ bạn cần trong một ứng dụng
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            MomoGo mang đến trải nghiệm thanh toán hiện đại, an toàn và tiện lợi cho người dùng Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="card flex flex-col items-center text-center gap-5 p-8 hover:shadow-2 transition-shadow duration-300"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ color: feature.color }}
                >
                  {feature.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-title text-[var(--color-on-surface)] font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-body text-[var(--color-outline)] leading-relaxed">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <a
                href="#"
                className="flex items-center gap-1 text-[var(--color-primary)] font-medium hover:gap-2 transition-all"
              >
                <span>Tìm hiểu thêm</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}