"use client";

const SECURITY_FEATURES = [
  {
    icon: "security",
    title: "Chứng nhận PCI DSS",
    description: "MomoGo đạt chuẩn PCI DSS Level 1 - tiêu chuẩn bảo mật cao nhất cho ngành thanh toán",
  },
  {
    icon: "lock",
    title: "Mã hóa AES-256",
    description: "Dữ liệu được mã hóa đầu cuối với thuật toán AES-256 bit - cùng tiêu chuẩn với ngân hàng",
  },
  {
    icon: "visibility",
    title: "Giám sát 24/7",
    description: "Hệ thống giám sát giao dịch real-time phát hiện và ngăn chặn gian lận tức thì",
  },
];

export function SecuritySection() {
  return (
    <section className="section bg-gradient-to-br from-[#e9edff] to-[#fdd000]/10">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="badge mb-4 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20">
            <span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">shield</span>
            <span className="text-[var(--color-secondary)]">Bảo mật cấp ngân hàng</span>
          </div>
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            An toàn như ngân hàng
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            MomoGo áp dụng các tiêu chuẩn bảo mật nghiêm ngặt nhất để bảo vệ tài sản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {SECURITY_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-6"
            >
              {/* Icon Circle with gradient */}
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[#0055cc] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <span className="material-symbols-outlined text-white text-3xl">{feature.icon}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-title text-[var(--color-on-surface)] font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-body text-[var(--color-outline)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* PCI DSS Badge */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-2xl shadow-lg border border-[var(--color-muted)]">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[#0055cc] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">verified</span>
            </div>
            <div>
              <p className="text-title font-semibold text-[var(--color-on-surface)]">
                Đạt chuẩn PCI DSS Level 1
              </p>
              <p className="text-caption text-[var(--color-outline)]">
                Tiêu chuẩn bảo mật cao nhất cho thanh toán quốc tế
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}