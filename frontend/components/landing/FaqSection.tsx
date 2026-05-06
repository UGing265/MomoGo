"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/landing-content";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section bg-white">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-[var(--color-on-surface)] mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-body text-[var(--color-outline)] max-w-2xl mx-auto">
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến về MomoGo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="accordion">
            {FAQ_ITEMS.map((item) => (
              <div key={item.id}>
                <button
                  className="accordion-trigger w-full text-left"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={openId === item.id}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      openId === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openId === item.id && (
                  <div className="accordion-content">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}