"use client";

import { useState } from "react";

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="section bg-white">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="badge mb-4 animate-bounce">
            <span className="material-symbols-outlined text-sm">mail</span>
            <span>Liên hệ</span>
          </div>
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            Bạn có câu hỏi hoặc cần hỗ trợ? Điền form bên dưới, chúng tôi sẽ liên hệ lại sớm nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="card p-8 shadow-lg rounded-2xl">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-20 h-20 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[var(--color-success)] text-4xl">check_circle</span>
                </div>
                <h3 className="text-title text-[var(--color-on-surface)] mb-2">
                  Gửi tin nhắn thành công!
                </h3>
                <p className="text-body text-[var(--color-outline)]">
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong 24 giờ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-body font-medium text-[var(--color-on-surface)]"
                  >
                    Họ tên
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)]">
                      person
                    </span>
                    <input
                      id="name"
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Nhập họ tên của bạn"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-body transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-body font-medium text-[var(--color-on-surface)]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)]">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-body transition-all"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-body font-medium text-[var(--color-on-surface)]"
                  >
                    Nội dung
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 material-symbols-outlined text-[var(--color-outline)]">
                      chat
                    </span>
                    <textarea
                      id="message"
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Viết tin nhắn của bạn..."
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-body resize-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Đang gửi...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined">send</span>
                      Gửi tin nhắn
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center gap-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">location_on</span>
              </div>
              <div>
                <h3 className="text-title text-[var(--color-on-surface)] mb-2 font-semibold">
                  Địa chỉ
                </h3>
                <p className="text-body text-[var(--color-outline)] leading-relaxed">
                  123 Đường Tài Chính, Quận 1<br />
                  Thành phố Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">mail</span>
              </div>
              <div>
                <h3 className="text-title text-[var(--color-on-surface)] mb-2 font-semibold">
                  Email
                </h3>
                <p className="text-body text-[var(--color-outline)]">
                  support@momogo.vn
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">phone</span>
              </div>
              <div>
                <h3 className="text-title text-[var(--color-on-surface)] mb-2 font-semibold">
                  Điện thoại
                </h3>
                <p className="text-body text-[var(--color-outline)]">
                  1900 1234 (9:00 - 18:00, Thứ 2 - Thứ 6)
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <p className="text-caption text-[var(--color-outline)] mb-4">Kết nối với chúng tôi</p>
              <div className="flex gap-4">
                {[
                  { icon: "tag", label: "Facebook" },
                  { icon: "chat", label: "Zalo" },
                  { icon: "link", label: "LinkedIn" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <span className="material-symbols-outlined text-[var(--color-outline)] group-hover:text-[var(--color-primary)]">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}