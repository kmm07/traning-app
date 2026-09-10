import React from "react";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  مجموعةُ الأيقونات — متّجهاتٌ بلون النصّ، بدل صورٍ نقطيةٍ مكرَّرة
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **أيقوناتُ الشريط الجانبيّ كانت مكرَّرةً ومضلِّلة** — مقيسٌ من الشريط
 *    نفسه: `img_mail11.png` لـ«الرسائل» **و**«رسائل التواصل» معاً ·
 *    و`img_group30copy9.svg` لـ«المستخدمين» **و**«الاشتراكات» ·
 *    و`img_weight3.png` لـ«التمرين» **و**«التحليلات» **و**«توصيات المدرب».
 *    ⇒ ثلاثةُ بنودٍ بأيقونةٍ واحدة: الأيقونةُ لا تدلّ على شيء، والعينُ
 *    تقرأ النصَّ في كل مرّة. ولا معنى لأيقونةٍ لا تختصر القراءة.
 *
 * 🔴 **وكانت صوراً نقطيةً بألوانٍ مخبوزة** (`.png`) ⇒ لا تتبع لونَ الحالة:
 *    البندُ النشطُ وغيرُ النشط بأيقونةٍ واحدة، وتظهر باهتةً على الشاشات
 *    عالية الكثافة. والمرسومةُ هنا `currentColor` فتتبع الحالةَ والهوية،
 *    ووزنُها في الحزمة أقلُّ من صورةٍ واحدة.
 */

export type IconName =
  | "messages"
  | "users"
  | "subscription"
  | "nutrition"
  | "training"
  | "bell"
  | "coupon"
  | "inbox"
  | "megaphone"
  | "insight"
  | "analytics"
  | "shield"
  | "logout"
  | "menu"
  | "close"
  | "chevron"
  | "back"
  | "search"
  | "collapse"
  /* ── طبقةُ الأفعال [١٠ سبتمبر] ─────────────────────────────────────
   * ⛔ **وكانت الأفعالُ في الصفحات صوراً نقطيةً أو محارفَ نصّية**: «+»
   *    حرفاً في زرِّ الإضافة · و«×» محرفاً · وسلّةُ الحذف صورةً بلونٍ
   *    مخبوز. ⇒ ثلاثةُ مصادرَ لشكلٍ واحد، وحرفُ «+» يتبع الخطَّ فيختلف
   *    وزنُه عن كل أيقونةٍ حوله. وهذه كلُّها بخطٍّ واحد (1.7) وتتبع لونَ
   *    حالتها لأنها `currentColor`.
   */
  | "plus"
  | "minus"
  | "edit"
  | "trash"
  | "check"
  | "checkCircle"
  | "filter"
  | "calendar"
  | "clock"
  | "trend"
  | "alert"
  | "info"
  | "settings"
  | "refresh"
  | "upload"
  | "download"
  | "dots"
  | "star"
  | "eye"
  | "sparkle"
  | "external"
  | "copy"
  | "weight"
  | "flame";

interface Props {
  name: IconName;
  className?: string;
  size?: number;
}

/** مسارٌ لكل اسم — بخطٍّ موحَّدٍ (1.7) وزوايا مستديرة كي تتّسق العائلة. */
const paths: Record<IconName, React.ReactNode> = {
  messages: (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-3.6A8.4 8.4 0 1 1 21 11.5Z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </>
  ),
  users: (
    <>
      <path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="10" cy="8" r="3.5" />
      <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.7a3.5 3.5 0 0 1 0 6.6" />
    </>
  ),
  subscription: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 10h19" />
      <path d="M6.5 14.5h3" />
    </>
  ),
  nutrition: (
    <>
      <path d="M7 3v7a2.5 2.5 0 0 0 5 0V3" />
      <path d="M9.5 12.5V21" />
      <path d="M17.5 3c-1.4 1.6-2 3.4-2 5.5 0 1.6.7 2.6 2 3V21" />
    </>
  ),
  training: (
    <>
      <path d="M4 9v6M20 9v6" />
      <rect x="6.5" y="7" width="3" height="10" rx="1.2" />
      <rect x="14.5" y="7" width="3" height="10" rx="1.2" />
      <path d="M9.5 12h5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5Z" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </>
  ),
  coupon: (
    <>
      <path d="M3 9.5V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5Z" />
      <path d="M14 5v14" strokeDasharray="2 2.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 12.5h4l1.5 2.5h6l1.5-2.5h4" />
      <path d="M5.6 5.6h12.8a2 2 0 0 1 1.9 1.4l1.2 5.5v4a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-4l1.2-5.5a2 2 0 0 1 1.9-1.4Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 11v2a2 2 0 0 0 2 2h1.5L15 20V4L6.5 9H5a2 2 0 0 0-2 2Z" />
      <path d="M18.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M7 15v4.5" />
    </>
  ),
  insight: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.4 10.9c.6.4.9 1 .9 1.7v.4h5v-.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3Z" />
    </>
  ),
  analytics: (
    <>
      <path d="M3.5 20.5h17" />
      <rect x="5" y="12" width="3.5" height="6" rx="1" />
      <rect x="10.5" y="8" width="3.5" height="10" rx="1" />
      <rect x="16" y="4" width="3.5" height="14" rx="1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
      <path d="M9.5 12.2l1.8 1.8 3.4-3.6" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14" />
      <path d="M10 12h9.5" />
      <path d="M13 8.5 9.5 12l3.5 3.5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  chevron: (
    <>
      <path d="M6 9.5 12 15l6-5.5" />
    </>
  ),
  back: (
    <>
      <path d="M4.5 12h15" />
      <path d="M11 5.5 4.5 12 11 18.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  collapse: (
    <>
      <path d="M15 6l-6 6 6 6" />
      <path d="M4.5 5v14" />
    </>
  ),

  /* ── الأفعال ─────────────────────────────────────────────────────── */
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  minus: (
    <>
      <path d="M5 12h14" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M6.5 7l.8 11.2A2 2 0 0 0 9.3 20h5.4a2 2 0 0 0 2-1.8L17.5 7" />
      <path d="M10.5 11v5M13.5 11v5" />
    </>
  ),
  check: (
    <>
      <path d="M5 12.5 10 17.5 19 7" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3.5V6M16 3.5V6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  trend: (
    <>
      <path d="M3.5 15.5 9 10l3.5 3.5L20.5 5.5" />
      <path d="M15.5 5.5h5v5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.5 13H4.3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.4 1Z" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11.5a8 8 0 1 0-2.3 5.4" />
      <path d="M20 5.5v6h-6" />
    </>
  ),
  upload: (
    <>
      <path d="M4 16.5v1.8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.8" />
      <path d="M12 15.5V3.5" />
      <path d="M7.5 8 12 3.5 16.5 8" />
    </>
  ),
  download: (
    <>
      <path d="M4 16.5v1.8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.8" />
      <path d="M12 3.5v12" />
      <path d="M7.5 11 12 15.5 16.5 11" />
    </>
  ),
  dots: (
    <>
      <circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  star: (
    <>
      <path d="m12 3.8 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.8Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.5 16.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14v4.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
    </>
  ),
  weight: (
    <>
      <path d="M7 8h10l2.5 11.5a1.5 1.5 0 0 1-1.5 1.8H6a1.5 1.5 0 0 1-1.5-1.8L7 8Z" />
      <path d="M9.5 8a2.5 2.5 0 1 1 5 0" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3s5 4.2 5 8.6a5 5 0 0 1-10 0C7 9.8 8.6 8 8.6 8s.4 1.8 1.7 2.4C10.9 8.4 12 6.2 12 3Z" />
    </>
  ),
};

export function Icon({ name, className = "", size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  بلاطةُ الأيقونة — شكلُ القسم والتصنيف
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ **ولم يكن للأقسام شكلٌ إطلاقاً.** رأسُ كلِّ شاشةٍ كان نصّاً غليظاً
 *    فحسب، فتبدو الشاشاتُ كلُّها واحدةً وتُقرأ العناوينُ حرفاً حرفاً. والبلاطةُ
 *    الملوّنةُ **علامةٌ تُلتقط بطرف العين** — تعرف أنك في «التغذية» قبل أن
 *    تقرأ الكلمة، وهي نفسُها الأيقونةُ التي تراها في الشريط الجانبيّ فلا
 *    يُتعلَّم رمزان لشيءٍ واحد.
 *
 * ⚖️ **والنغماتُ دلاليةٌ لا زخرفية** — الأخضرُ لما تمّ والأحمرُ لما يحتاج
 *    تدخّلاً، فلا تُختار بالذوق في كل شاشة.
 */
export type IconTone =
  | "brand"
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info";

const toneClass: Record<IconTone, string> = {
  brand: "bg-brand-400/[0.14] text-brand-400 ring-brand-400/20",
  neutral: "bg-ink-800 text-content-muted ring-line",
  success: "bg-success-500/[0.14] text-success-400 ring-success-500/20",
  danger: "bg-danger-500/[0.14] text-danger-400 ring-danger-500/20",
  warning: "bg-warning-500/[0.14] text-warning-400 ring-warning-500/20",
  info: "bg-info-500/[0.14] text-info-400 ring-info-500/20",
};

const tileSize = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-2xl",
};

export function IconTile({
  name,
  tone = "brand",
  size = "md",
  className = "",
}: {
  name: IconName;
  tone?: IconTone;
  size?: keyof typeof tileSize;
  className?: string;
}) {
  return (
    <span
      className={[
        "grid place-items-center shrink-0 ring-1",
        tileSize[size],
        toneClass[tone],
        className,
      ].join(" ")}
    >
      <Icon name={name} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
    </span>
  );
}

export default Icon;
