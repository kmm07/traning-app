import { cva, VariantProps } from "class-variance-authority";
import React from "react";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  النصّ — سلّمٌ دلاليٌّ واحد بدل ألوانٍ صامتة
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **أربعُ حالاتٍ منها كانت لا تُخرج لوناً إطلاقاً**: `dark` و`danger`
 *    و`success` كانت تشير إلى `dark-100` و`error-200` و`success-200` —
 *    وثلاثتُها **غيرُ معرَّفةٍ في إعداد Tailwind**. وTailwind لا يُخطئ على
 *    صنفٍ مجهول بل **لا يُخرج شيئاً**، فكان النصُّ الخطأ يُعرض بلون النصّ
 *    العاديّ: **شاشةٌ لا تفرّق بين نجاحٍ وفشل**، ولا سطرَ خطإٍ يقول ذلك.
 *    الأسماءُ معرَّفةٌ الآن في الإعداد فتعمل الحالاتُ الأربع كما قُصدت.
 *
 * ⚖️ **و`whitespace-nowrap` يبقى الافتراضيّ.** هو مصدرُ فيضِ النصوص الطويلة
 *    (وله التفافٌ يدويّ في `Users/subscriptions/SideBar` وغيره)، **لكن
 *    قلبَه يمسّ ٢٤١ موضعاً لا سبيل إلى معاينة أيٍّ منها** — لا متصفّح على
 *    هذا الخادم ولا حسابَ لوحةٍ أستطيع الدخول به. فالعلاجُ يقع على
 *    **الضرر** لا على القاعدة: حاويةُ الجدول صارت تمرّر أفقياً بدل أن
 *    تقصّ (`Table/index.tsx`)، وأُضيفت حالتا `wrap` و`clamp` لمن يحتاجهما
 *    صراحةً. وقلبُ الافتراضيّ بندٌ يُقاس بعد معاينةٍ بصرية.
 */
const text = cva("text-content whitespace-nowrap w-fit", {
  variants: {
    primary: {
      true: "!text-content-muted",
    },
    white: {
      true: "!text-white",
    },
    /** لونُ الهوية — للأرقام البارزة وروابط الفعل. */
    lime: {
      true: "!text-brand-400",
    },
    brand: {
      true: "!text-brand-400",
    },
    muted: {
      true: "!text-content-muted",
    },
    faint: {
      true: "!text-content-faint",
    },
    dark: {
      true: "!text-ink-950",
    },
    danger: {
      true: "!text-danger-400",
    },
    success: {
      true: "!text-success-400",
    },
    warning: {
      true: "!text-warning-400",
    },
    bold: {
      true: "!font-bold",
    },
    /** يسمح للنصّ بالالتفاف — عكسُ الافتراضيّ، ويُطلب صراحةً. */
    wrap: {
      true: "!whitespace-normal break-words",
    },
    /** سطرٌ واحدٌ بثلاث نقاط — أنظفُ من القصّ الصامت. */
    clamp: {
      true: "!whitespace-normal line-clamp-1 break-all",
    },
    border: {
      primary:
        "border-brand-400 text-brand-400 border rounded-pill px-3 py-0.5 inline-flex items-center",
      white:
        "border-line-strong border rounded-pill px-3 py-0.5 inline-flex items-center text-content",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
  },
  compoundVariants: [
    /* عنوانٌ كبيرٌ يأخذ تباعداً أضيق — العربيةُ تحتاجه عند الأحجام الكبيرة. */
    { size: "3xl", class: "leading-tight" },
    { size: "4xl", class: "leading-tight" },
  ],
  defaultVariants: {
    size: "base",
  },
});

interface Props
  extends VariantProps<typeof text>,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    > {
  children: string | React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

function Text({ className, children, as, style, ...props }: Props) {
  const Component = as ?? "span";
  return (
    <Component style={style} className={text({ className, ...props })}>
      {children}
    </Component>
  );
}

export { Text };
