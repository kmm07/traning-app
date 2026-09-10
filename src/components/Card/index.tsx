import React from "react";

/*
 * البطاقة — سطحُ المحتوى الأساسيّ في اللوحة (٢٩ موضعاً).
 *
 * ⚖️ **الأصنافُ نفسُها وقيمُها تبدّلت في الإعداد**: `gray-900_01` صارت أرضيةَ
 *    الهوية، و`blue_gray-900_01` صارت لونَ الحدّ، و`shadow-bs` صار ظلاً
 *    واحداً ناعماً بدل الظلِّ النيومورفيّ المزدوج. فالبطاقةُ تتبدّل في كل
 *    الصفحات بلا تعديلِ سطرٍ فيها.
 *
 * ➕ **وأُضيف `padded` و`hover`** لأن كل مستدعٍ كان يكتب حشوته بيده
 *    (`p-4`/`p-5`/`p-8`) فلا تتّفق بطاقتان على قياس. والافتراضيُّ **بلا
 *    حشوة** كما كان، فلا يتبدّل موضعٌ قائم.
 */
/*
 * ➕ **طبقةُ صقلٍ ثانية [١٠ سبتمبر]:**
 *
 * ١. **حافّةٌ داخليةٌ فاتحةٌ في الأعلى** (`hairline`) — على أسودَ شبهِ خالص
 *    يرسم الحدُّ وحده **مستطيلاً مسطّحاً**؛ وخطُّ ضوءٍ بشفافية ٥٪ في الحافّة
 *    العليا يكفي لأن تُقرأ البطاقةُ **جسماً على سطح**، بلا ظلٍّ ثقيل.
 * ٢. **والقابلةُ للنقر ترتفع** بدل أن تبدّل لونَها وحده — تبديلُ اللون
 *    يقول «تغيّر شيء» والارتفاعُ يقول «هذه تُنقر».
 * ٣. **وحشوةٌ بثلاثة مقاييس** — كان `padded` منطقياً واحداً، فتُكتب حشوةُ
 *    البطاقة الصغيرة بيدها في كل موضع.
 *
 * ⚖️ **والافتراضيُّ لم يتبدّل بحرف** — بلا حشوةٍ وبلا رفع، فالمواضعُ
 *    التسعةُ والعشرون تبقى كما هي.
 */
const padding = {
  sm: "p-3.5",
  md: "p-5",
  lg: "p-6 sm:p-5",
};

function Card({
  children,
  className = "",
  onClick,
  padded = false,
  hover = false,
  as,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** حشوةٌ موحَّدة — تُطلب صراحةً كي لا يتبدّل ما هو قائم. */
  padded?: boolean | keyof typeof padding;
  /** إبرازٌ عند المرور — للبطاقات القابلة للنقر وحدها. */
  hover?: boolean;
  as?: React.ElementType;
}) {
  const Component = as ?? "div";
  const interactive = Boolean(onClick);
  const pad =
    padded === true ? padding.md : padded === false ? "" : padding[padded];

  return (
    <Component
      className={[
        "bg-surface border border-line rounded-card shadow-card hairline w-full",
        "transition-all duration-200 ease-smooth",
        pad,
        hover || interactive
          ? "hover:border-line-strong hover:bg-surface-raised hover:shadow-lift hover:-translate-y-0.5"
          : "",
        interactive
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      {...(interactive
        ? { role: "button", tabIndex: 0 }
        : {})}
    >
      {children}
    </Component>
  );
}

export { Card };
