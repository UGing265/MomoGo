// Vietnamese content constants for landing page

export const HERO_CONTENT = {
  title: "MomoGo - Thanh toán nhanh, Sống thông minh",
  subtitle: "Trải nghiệm thế hệ ví điện tử tiếp theo. Quản lý tài chính nhanh chóng, an toàn và dễ dàng, được thiết kế riêng cho phong cách sống hiện đại của người Việt.",
  primaryCta: "Bắt đầu ngay",
  secondaryCta: "Tìm hiểu thêm",
};

export const TRUST_BADGES = [
  { id: "ssl", label: "SSL Bảo mật", icon: "Lock" },
  { id: "pci", label: "PCI DSS", icon: "Shield" },
  { id: "banks", label: "Ngân hàng liên kết", icon: "Building2" },
  { id: "license", label: "Giấy phép NHNN", icon: "BadgeCheck" },
  { id: "guarantee", label: "Bảo đảm 100%", icon: "ShieldCheck" },
];

export const FEATURES = [
  {
    id: "qr",
    title: "Thanh toán QR",
    description: "Quét mã QR để thanh toán tại hàng triệu điểm chấp nhận trên toàn quốc.",
    icon: "QrCode",
  },
  {
    id: "p2p",
    title: "P2P tức thì",
    description: "Chuyển tiền cho bạn bè và người thân ngay lập tức, 24/7.",
    icon: "Send",
  },
  {
    id: "security",
    title: "Bảo mật cao cấp",
    description: "Mã hóa AES-256, xác thực đa lớp và theo dõi giao dịch real-time.",
    icon: "Fingerprint",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Đăng ký",
    description: "Nhập số điện thoại và xác minh danh tính trong 2 phút.",
  },
  {
    step: 2,
    title: "Liên kết ngân hàng",
    description: "Kết nối tài khoản Vietcombank hoặc Techcombank của bạn.",
  },
  {
    step: 3,
    title: "Bắt đầu sử dụng",
    description: "Nạp tiền, chuyển tiền và thanh toán ngay lập tức.",
  },
];

export const STATS = [
  { value: "1M+", label: "Người dùng" },
  { value: "10M+", label: "Giao dịch" },
  { value: "99.9%", label: "Uptime" },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    role: "Nhân viên văn phòng",
    content: "MomoGo giúp tôi chuyển tiền cho mẹ mỗi ngày chỉ trong vài giây. Tiện lợi và miễn phí!",
    avatar: "NTL",
  },
  {
    id: 2,
    name: "Trần Minh Tuấn",
    role: "Chủ quán cà phê",
    content: "Khách hàng thanh toán qua QR rất nhanh. Không còn phải đếm tiền mặt hay lo thiếu tiền.",
    avatar: "TMT",
  },
  {
    id: 3,
    name: "Lê Hoàng Phúc",
    role: "Sinh viên",
    content: "App nhẹ, dễ dùng, nạp tiền qua ngân hàng cực nhanh. Rất phù hợp cho sinh viên.",
    avatar: "LHP",
  },
];

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "MomoGo có miễn phí không?",
    answer:
      "Đăng ký và sử dụng MomoGo hoàn toàn miễn phí. Chuyển tiền P2P và thanh toán QR cũng miễn phí cho người dùng.",
  },
  {
    id: "faq-2",
    question: "Làm sao để nạp tiền vào ví?",
    answer:
      "Bạn có thể nạp tiền từ tài khoản Vietcombank hoặc Techcombank liên kết. Tiền sẽ vào ví trong vài giây.",
  },
  {
    id: "faq-3",
    question: "MomoGo bảo mật như thế nào?",
    answer:
      "MomoGo sử dụng mã hóa AES-256, xác thực hai yếu tố (2FA), và giám sát giao dịch 24/7 để đảm bảo an toàn cho người dùng.",
  },
  {
    id: "faq-4",
    question: "Tôi có thể liên kết bao nhiêu tài khoản ngân hàng?",
    answer:
      "Mỗi người dùng có thể liên kết tối đa 2 tài khoản ngân hàng với MomoGo.",
  },
  {
    id: "faq-5",
    question: "Giới hạn giao dịch là bao nhiêu?",
    answer:
      "Nạp tiền: 10.000đ - 100.000.000đ. Rút tiền: 20.000đ - 50.000.000đ. Chuyển P2P: 1.000đ - 50.000.000đ mỗi giao dịch.",
  },
];

export const FOOTER_LINKS = {
  product: {
    title: "Sản phẩm",
    links: [
      { label: "Tính năng", href: "#features" },
      { label: "Bảo mật", href: "#security" },
      { label: "Phí dịch vụ", href: "#pricing" },
      { label: "Liên kết ngân hàng", href: "#banks" },
    ],
  },
  company: {
    title: "Công ty",
    links: [
      { label: "Giới thiệu", href: "#about" },
      { label: "Tuyển dụng", href: "#careers" },
      { label: "Tin tức", href: "#news" },
      { label: "Liên hệ", href: "#contact" },
    ],
  },
  legal: {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Giấy phép", href: "/license" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Câu hỏi thường gặp", href: "#faq" },
      { label: "Báo lỗi", href: "/report" },
    ],
  },
};

export const FOOTER_COPYRIGHT = "© 2026 MomoGo. Tất cả quyền được bảo lưu.";