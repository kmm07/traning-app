import React from "react";
import { cva, VariantProps } from "class-variance-authority";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  الزرّ — مساحةُ نقرٍ حقيقية ولونُ هويةٍ واحد
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **ثلاثةُ أعطالٍ كانت فيه، وكلُّها تُرى في كل شاشة:**
 *
 * ١. **بلا حشوةٍ أفقيةٍ إطلاقاً.** الطبقةُ العامّة تجرّد `.btn` من `p-0`،
 *    وهذا المكوّن لم يكن يعيدها ⇒ مساحةُ النقر مساحةُ النصّ حرفياً، فزرُّ
 *    «حذف» عرضُه أربعةُ محارف. ولذلك كُتب `!px-10` يدوياً في عشرات المواضع.
 *    صارت الحشوةُ من **مقاس الزرّ** فيتّفق الجميع بلا تعويضٍ يدويّ.
 *
 * ٢. **`isLoading` كان يُعطّل ولا يُظهر شيئاً.** المدرّب يضغط «حفظ» فيخفت
 *    الزرُّ بلا إشارةٍ إلى أن شيئاً يجري ⇒ يضغط ثانيةً. صار يرسم دوّارةً
 *    **مع إبقاء النصّ** كي لا يتغيّر عرضُ الزرّ فتقفز الصفحة.
 *
 * ٣. **`secondary` كان يشير إلى `secondary-100` غيرِ المعرَّفة** ⇒ صنفٌ
 *    صامت: يُكتب ولا يُخرج لوناً، فيظهر الزرُّ شفّافاً بلا أن يُخطئ أحد.
 *
 * ⚖️ **والواجهةُ لم تتغيّر بحرف** — الأسماءُ والمقاييسُ نفسُها، فأربعةٌ
 *    وستّون ملفاً تنتفع بلا تعديلِ سطرٍ فيها.
 */
/*
 * ➕ **طبقةُ صقلٍ ثانية [١٠ سبتمبر]** — الزرُّ كان صحيحاً وصار **محسوساً**:
 *
 * ١. **حركةٌ عند المرور والضغط.** كان يبدّل لونَه وحده — وتبديلُ اللون
 *    وحده يُقرأ «تغيّر شيء» لا «هذا زرٌّ يُضغط». صار يرتفع بكسلاً واحداً
 *    عند المرور وينخفض عند الضغط، وهي أرخصُ إشارةٍ تقول إن العنصر ماديّ.
 * ٢. **والمميّزُ بعمق.** الليمونيُّ المسطّح على أسودَ يبدو مُلصقاً؛ تدرّجٌ
 *    خفيفٌ من أعلى (`brand-btn`) وظلٌّ لَونيٌّ تحته يجعله **جسماً على سطح**.
 * ٣. **وحلقةُ تركيزٍ صريحة** — من يتنقّل بالـTab يرى أين هو على كل زرّ.
 *
 * ➕ **وثلاثةُ مقاييسَ للأيقونة لا واحد** (`iconSmall` · `icon` · `iconLarge`):
 *    زرُّ الأيقونة في الرأس وفي داخل صفٍّ في جدولٍ ليسا بحجمٍ واحد، وكان
 *    كلُّ موضعٍ يبنيه بيده بمقاسٍ يخصّه.
 *
 * ⚖️ **ولا اسمَ تبدّل ولا مقاسٌ نُزع** — أربعةٌ وستّون ملفاً تنتفع بلا تعديل.
 */
const button = cva(
  [
    "btn relative select-none isolate",
    "inline-flex items-center justify-center gap-2 text-center whitespace-nowrap",
    "rounded-field font-semibold",
    "transition-all duration-200 ease-smooth",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    "disabled:!shadow-none disabled:!translate-y-0",
  ].join(" "),
  {
    variants: {
      /** الفعلُ الرئيسيّ — لونُ الشعار، ونصٌّ أسودُ فوقه للتباين. */
      primary: {
        true: [
          "!bg-brand-btn !text-ink-950 shadow-btn",
          "hover:brightness-[1.06] hover:shadow-glow hover:-translate-y-px",
          "active:brightness-95",
        ].join(" "),
      },
      /** فعلٌ ثانويٌّ بحدٍّ من لون الهوية. */
      primaryBorder: {
        true: "!border !border-brand-400/70 !bg-transparent !text-brand-400 hover:!bg-brand-400/10 hover:!border-brand-400 hover:-translate-y-px",
      },
      /*
       * ➕ **`soft`** — الفعلُ الثانويُّ الأكثرُ حضوراً في اللوحة (تصفية ·
       *    تصدير · تبديلُ عرض). كان يُكتب `primaryBorder` فيتنازع حدُّه مع
       *    حدِّ البطاقة التي فوقه؛ وهذا **أرضيةٌ مصبوغةٌ بلا حدّ** فيُقرأ
       *    ثانوياً بوضوحٍ ولا يزاحم الفعلَ الرئيسيّ.
       */
      soft: {
        true: "!bg-brand-400/[0.12] !text-brand-400 hover:!bg-brand-400/[0.20] hover:-translate-y-px",
      },
      danger: {
        true: "!bg-danger-500 !text-white shadow-btn hover:!bg-danger-600 hover:-translate-y-px focus-visible:!ring-danger-400",
      },
      /** فعلٌ مدمّرٌ صامت — أحمرُ بلا أرضيةٍ حتى يُقصَد. */
      dangerSoft: {
        true: "!bg-danger-500/10 !text-danger-400 hover:!bg-danger-500/20 focus-visible:!ring-danger-400",
      },
      success: {
        true: "!bg-success-500/[0.14] !text-success-400 hover:!bg-success-500/[0.22] hover:-translate-y-px",
      },
      /** سطحٌ محايدٌ مرتفع — لـ«إلغاء» وما شابهه. */
      secondary: {
        true: "!bg-ink-800 !border !border-line !text-content hover:!bg-ink-700 hover:!border-line-strong hover:-translate-y-px",
      },
      secondaryBorder: {
        true: "!border !border-line-strong !bg-transparent !text-content hover:!border-brand-400 hover:!text-brand-400 hover:!bg-brand-400/[0.06]",
      },
      /** فعلٌ صامت — بلا أرضيةٍ حتى يُمرّ عليه. */
      ghost: {
        true: "!bg-transparent !text-content-muted hover:!bg-ink-800 hover:!text-content",
      },
      tertiary: {
        true: "!bg-gradient !text-ink-950 shadow-btn hover:brightness-110 hover:-translate-y-px",
      },
      fullWidth: {
        true: "!flex-1",
      },
      rounded: {
        full: "!rounded-pill",
      },
      /*
       * المقاييسُ تحمل الحشوةَ والارتفاع معاً — ولا تُترك لـ`btn-sm` من
       * daisyUI (وهي تفرض ارتفاعاً ثابتاً يقصّ النصّ العربيّ ذا النقاط).
       */
      size: {
        xSmall: "text-xs px-3 py-1.5 min-h-[30px] gap-1.5",
        small: "text-sm px-4 py-2 min-h-[36px]",
        medium: "text-sm px-5 py-2.5 min-h-[42px]",
        large: "text-base px-8 py-3 min-h-[50px] font-bold",
        /** زرُّ أيقونةٍ مربّع — كان يُبنى يدوياً بمقاساتٍ مختلفة كل مرّة. */
        iconSmall: "p-0 w-8 h-8 shrink-0",
        icon: "p-0 w-10 h-10 shrink-0",
        iconLarge: "p-0 w-12 h-12 shrink-0",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export type ButtonProps = VariantProps<typeof button>;

interface Props {
  onClick?: () => void;
  form?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: CSSStyleSheet | any;
  children?: React.ReactNode | any;
  disabled?: boolean;
  id?: string;
  htmlFor?: string;
  title?: string;
  /** وصفٌ للقارئ الصوتيّ حين يكون الزرُّ أيقونةً بلا نصّ. */
  "aria-label"?: string;
}

function Button({
  htmlFor,
  onClick,
  type = "button",
  id,
  title,
  ...props
}: Props & ButtonProps) {
  const { isLoading, children, ...variants } = props;

  return (
    <button
      id={id}
      title={title}
      aria-label={props["aria-label"]}
      aria-busy={isLoading || undefined}
      className={button({ ...variants })}
      disabled={props.disabled || isLoading}
      type={type}
      onClick={() => {
        onClick && onClick();
        htmlFor && document.getElementById(htmlFor)?.click();
      }}
    >
      {isLoading && (
        <span
          className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

export { Button };
