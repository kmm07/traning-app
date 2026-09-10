import React from "react";
import { Icon, IconName, IconTile, IconTone } from "components/Icon";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  أشكالُ الأقسام والتصنيفات
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **ولم يكن في اللوحة شكلٌ للقسم إطلاقاً.** كلُّ شاشةٍ تبني رأسَها بيدها:
 *    `<Text size="2xl" bold>` هنا · و`<p className="text-xl font-bold">`
 *    هناك · وثالثٌ يضع الزرَّ فوق العنوان ورابعٌ تحته. ⇒ **ستُّ شاشاتٍ
 *    بستّة رؤوس**، والعينُ تُعيد تعلّم مكان كل شيء في كل انتقال.
 *
 * ⚖️ **والرأسُ الموحَّد ليس تجميلاً — هو ما يجعل التصفّح أسرع**: البلاطةُ
 *    الملوّنةُ في اليمين تقول أيُّ قسمٍ هذا قبل قراءة الكلمة، والعنوانُ
 *    وتحته سطرُ شرحٍ اختياريّ، والأفعالُ **في الطرف المقابل دائماً** فلا
 *    يُبحَث عن زرِّ الإضافة في مكانٍ جديدٍ كل مرّة.
 */

interface SectionHeaderProps {
  title: string;
  /** سطرُ شرحٍ تحت العنوان — يقول ما هذه الشاشة أو كم فيها من صفّ. */
  hint?: string;
  icon?: IconName;
  tone?: IconTone;
  /** الأفعالُ — تُرسَم في الطرف المقابل للعنوان دائماً. */
  actions?: React.ReactNode;
  /** خطٌّ فاصلٌ تحت الرأس — لأقسامٍ داخل بطاقةٍ واحدة. */
  divider?: boolean;
  className?: string;
  /** حجمُ الرأس: رأسُ شاشةٍ أم رأسُ قسمٍ داخلها. */
  level?: "page" | "section";
}

function SectionHeader({
  title,
  hint,
  icon,
  tone = "brand",
  actions,
  divider = false,
  className = "",
  level = "page",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 flex-wrap">
        {icon && (
          <IconTile
            name={icon}
            tone={tone}
            size={level === "page" ? "md" : "sm"}
          />
        )}

        <div className="min-w-0 flex-1">
          <h2
            className={[
              "font-bold text-content leading-tight truncate",
              level === "page" ? "text-xl" : "text-base",
            ].join(" ")}
          >
            {title}
          </h2>
          {hint && (
            <p className="text-[13px] text-content-muted leading-snug truncate">
              {hint}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>

      {divider && <div className="divider-soft mt-4" />}
    </div>
  );
}

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  الشارة — تصنيفٌ يُقرأ بلونه
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ **وكانت الحالاتُ في الجداول نصوصاً عارية**: «مفعّل» و«منتهي» بلون
 *    النصّ نفسِه ⇒ لا سبيل إلى مسح عمودٍ بالعين، تُقرأ الكلماتُ واحدةً
 *    واحدة. والشارةُ الملوّنة تجعل عمودَ الحالة **يُمسح في نظرة**.
 *
 * ⚖️ **وبنغمةٍ دلاليةٍ لا بلونٍ يُختار** — والحدُّ الخفيف يفصلها عن الأرضية
 *    الداكنة، فلا تُقرأ لطخةً.
 */
const chipTone: Record<IconTone, string> = {
  brand: "bg-brand-400/[0.12] text-brand-400 border-brand-400/25",
  neutral: "bg-ink-800 text-content-muted border-line",
  success: "bg-success-500/[0.12] text-success-400 border-success-500/25",
  danger: "bg-danger-500/[0.12] text-danger-400 border-danger-500/25",
  warning: "bg-warning-500/[0.12] text-warning-400 border-warning-500/25",
  info: "bg-info-500/[0.12] text-info-400 border-info-500/25",
};

function Chip({
  children,
  tone = "neutral",
  icon,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  tone?: IconTone;
  icon?: IconName;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-pill border font-semibold whitespace-nowrap",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        chipTone[tone],
        className,
      ].join(" ")}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 12 : 14} />}
      {children}
    </span>
  );
}

/*
 * شريطُ أدواتٍ فوق المحتوى — بحثٌ وتصفيةٌ وأفعال.
 *
 * ⚖️ **يلتفّ ولا يُقصّ**: كل شاشةٍ كانت تصفّ أدواتها في `flex` بلا `wrap`،
 *    فعلى شاشةٍ ضيّقة **يخرج زرُّ الإضافة من الشاشة** — وهو الفعلُ الوحيد
 *    الذي جاء المدرّب من أجله.
 */
function Toolbar({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 flex-wrap justify-between w-full",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export { SectionHeader, Chip, Toolbar };
