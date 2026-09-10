import { FieldProps, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Img } from "components";
import { VariantProps, cva } from "class-variance-authority";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  الحقل — لبنةُ كل نموذجٍ في اللوحة (٤٢ ملفاً)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **ولافتتُه كانت على وشك أن تختفي.** كانت مكتوبةً
 *    `text-dark-200 dark:text-white` و`dark-200` **غيرُ معرَّفةٍ** فلم تُخرج
 *    لوناً، فورثت اللافتةُ لونَ ما حولها وظهرت بالصدفة. ولمّا عُرِّفت في
 *    هذه الجلسة صارت **أسودَ على أسود** لمن نظامُه في الوضع الفاتح
 *    (`dark:` في Tailwind يتبع تفضيلَ النظام لا سمةَ اللوحة). ⇒ اللافتاتُ
 *    كلُّها صارت `text-content-muted` **بلا شرطِ سمة**: اللوحةُ داكنةٌ
 *    دائماً، فشرطُ الوضع فيها مصدرُ عطلٍ لا ميزة.
 *
 * 🔴 **وعلامةُ الحقل الإلزاميّ كانت بنفسجية** — لونُ القالب القديم. صارت
 *    حمراءَ كما يتوقّعها القارئ، ومعها `aria-required` للقارئ الصوتيّ.
 *
 * ⛔ **وحالةُ الخطأ كانت `!text-red-500`** أي **نصُّ المستخدم نفسُه أحمر**
 *    وهو يكتب — يُقرأ عطلاً في القيمة لا في الحقل. صار الحدُّ وحده أحمر
 *    والنصُّ يبقى مقروءاً.
 */
const input = cva(
  [
    "w-full rounded-field text-sm px-4",
    "bg-surface-sunken border border-line text-content",
    "placeholder:text-content-faint",
    "transition-colors duration-200",
    "hover:border-line-strong",
    "focus:border-brand-400",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      primary: {
        true: "!bg-surface-sunken !border-line !text-content",
      },
      disabled: {
        true: "!bg-ink-900 !text-content-faint cursor-not-allowed",
      },
      fullWidth: {
        true: "w-full flex-1",
      },
      error: {
        true: "!border-danger-500 focus:!border-danger-500",
      },
      type: {
        password: "pe-11",
      },
      rounded: {
        full: "!rounded-pill",
      },
      isSearch: {
        true: "!ps-11",
      },
      inputSize: {
        small: "!text-sm !px-3 !py-2 !h-9",
        medium: "text-sm px-4 h-11",
        large: "text-sm px-4 h-12",
      },
    },
    defaultVariants: {
      inputSize: "medium",
    },
  }
);

/*
 * ⛔ **و`type` كان محصوراً في `"password"` بحكم الأنواع.** الصنفُ متغيّرٌ في
 *    cva (يضيف حشوةً لزرِّ العين)، وتقاطعُه مع `InputHTMLAttributes` كان
 *    يضيّق النوعَ إلى قيمةٍ واحدة ⇒ `type="email"` **لا يُصرَّف**. ولم
 *    يظهر العطلُ لأن كلَّ حقلٍ يحتاج نوعاً آخر في اللوحة مكتوبٌ
 *    `<input>` خاماً — وهو بذاته سببُ تفرّق أشكال الحقول. يُفصل النوعُ
 *    عن المتغيّر فيُقبل أيُّ نوعٍ ويبقى أثرُ `password` قائماً.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  isForm?: boolean;
  label?: any;
};

type InputVariants = Omit<VariantProps<typeof input>, "type">;

const Input = ({
  name,
  isForm = true,
  ...props
}: InputProps & InputVariants) => {
  return isForm ? (
    <Field name={name}>
      {({ field, form: { errors, touched } }: FieldProps) => {
        return (
          <div className="w-full">
            <CustomInput
              {...props}
              {...field}
              name={name}
              error={touched[name] && errors[name]}
            />
            <div className="text-danger-400 text-xs text-start mt-1.5">
              <ErrorMessage name={name} />
            </div>
          </div>
        );
      }}
    </Field>
  ) : (
    <CustomInput {...props} name={name} />
  );
};
export { Input };

const CustomInput = ({
  name,
  type = "text",
  placeholder,
  label = null,
  ...props
}: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /*
   * ⛔ **زرُّ إظهار كلمة السرّ كان `<span>` بموضعٍ مطلقٍ مكوَّد**
   *    (`bottom-[8px]` و`-top-2`) — يُحسب على حقلٍ بارتفاعٍ واحد، فيخرج عن
   *    مكانه في كل مقاسٍ آخر، ولا يبلغه أحدٌ بلوحة المفاتيح. صار زرّاً
   *    حقيقياً متمركزاً رأسياً بـ`inset-y-0`.
   */
  const PasswordEye = () => (
    <button
      type="button"
      onClick={handleShowPassword}
      tabIndex={-1}
      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
      className="absolute inset-y-0 left-2 my-auto h-8 w-8 grid place-items-center rounded-lg text-content-faint hover:text-content hover:bg-ink-800 transition-colors"
    >
      <Img
        src={showPassword ? "/images/cross-eye.svg" : "/images/eye.svg"}
        className="h-4 w-4 opacity-70"
        alt=""
      />
    </button>
  );

  const { className = "", required, ...otherProps } = props;

  return (
    <div className="relative w-full justify-between">
      {Boolean(label) && (
        <label
          htmlFor={name}
          className="text-start block mb-2 text-sm w-full text-content-muted font-medium"
        >
          {label}
          {required === true && (
            <span className="text-danger-400 ms-1 font-medium" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          onKeyDown={(evt) =>
            type === "number" &&
            ["e", "E", "+", "-"].includes(evt.key) &&
            evt.preventDefault()
          }
          min="0"
          id={name}
          aria-required={required === true || undefined}
          placeholder={placeholder ?? ""}
          type={type === "password" && showPassword ? "text" : type}
          className={input({ className, ...props })}
          {...otherProps}
        />

        {type === "password" && <PasswordEye />}

        {props.isSearch && (
          <Img
            src="/images/img_search.svg"
            className="absolute inset-y-0 start-4 my-auto h-4 w-4 opacity-60 pointer-events-none"
            alt=""
          />
        )}
      </div>
    </div>
  );
};
