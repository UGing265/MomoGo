"use client";

const OLD_WAY = [
  "Chuyển tiền chậm (2-3 ngày)",
  "Phí ẩn, không rõ ràng",
  "Liên kết ngân hàng phức tạp",
  "Phải đến ngân hàng giao dịch",
];

const MOMO_WAY = [
  "P2P tức thì trong vài giây",
  "Phí 0đ - không có chi phí ẩn",
  "Kết nối một chạm với ngân hàng",
  "Thanh toán QR tại hàng triệu điểm",
];

export function ComparisonSection() {
  return (
    <section className="section bg-white">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            Tại sao chọn MomoGo?
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            So sánh giải pháp thanh toán truyền thống với MomoGo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Old Way Card */}
          <div className="card border-2 border-[var(--color-error)]/30 bg-red-50/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--color-error)]">close</span>
              </div>
              <div>
                <h3 className="text-title text-[var(--color-error)] font-semibold">
                  Cách cũ
                </h3>
                <p className="text-caption text-[var(--color-error)]/70">
                  Phương thức truyền thống
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-4">
              {OLD_WAY.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-body text-[var(--color-outline)]"
                >
                  <span className="material-symbols-outlined text-[var(--color-error)] mt-0.5 flex-shrink-0">cancel</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MomoGo Way Card */}
          <div className="card border-2 border-[var(--color-success)]/30 bg-green-50/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--color-primary)]">bolt</span>
              </div>
              <div>
                <h3 className="text-title text-[var(--color-primary)] font-semibold">
                  Cách của MomoGo
                </h3>
                <p className="text-caption text-[var(--color-primary)]/70">
                  Giải pháp hiện đại
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-4">
              {MOMO_WAY.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-body text-[var(--color-on-surface)]"
                >
                  <span className="material-symbols-outlined text-[var(--color-success)] mt-0.5 flex-shrink-0">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}