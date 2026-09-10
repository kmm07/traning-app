import { FieldProps, Field, ErrorMessage } from "formik";
import React, { FC } from "react";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  حقلُ النصّ الطويل — كان أسوأ حقلٍ في اللوحة
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **كان بلا حدٍّ وبلا أرضية** (`bg-transparent` وحدها) ⇒ **حقلٌ لا يُرى**:
 *    المدرّب يقرأ لافتةً ثم فراغاً، ولا يعرف أين يضغط ليكتب. وهو الحقلُ
 *    الذي تُكتب فيه رسائلُ النظام ووصفُ الوصفات — أطولُ ما يُكتب في اللوحة.
 *
 * 🔴 **ونصُّه كان `text-lime-100`** — أي أن ما يكتبه المدرّب يظهر بلون
 *    الهوية المميّز، وهو لونُ الفعل لا لونُ المحتوى. صار بلون النصّ العاديّ.
 *
 * ⛔ **و`indent-4`** يُزيح **السطر الأول وحده** ⇒ النصُّ يلتصق بالحافّة من
 *    السطر الثاني فما بعد. صارت حشوةً حقيقية.
 *
 * ➕ **و`rows` صار معاملاً** — كان مكوَّداً بـ٣ لكل استعمال.
 */
export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  isForm?: boolean;
  placeholder?: string;
  label?: string;
  error?: boolean;
  rows?: number;
}

const TextArea: FC<TextAreaProps> = ({ name, isForm = true, ...props }) => {
  return isForm ? (
    <Field name={name}>
      {({ field, form: { errors, touched } }: FieldProps) => {
        return (
          <div className="w-full">
            <CustomInput
              {...props}
              {...field}
              name={name}
              error={Boolean(Boolean(touched[name]) && errors[name])}
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
export { TextArea };

const CustomInput: React.FC<TextAreaProps> = ({
  error = false,
  name,
  placeholder,
  label = null,
  rows = 3,
  ...props
}) => {
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
            <span className="text-danger-400 ms-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={name}
        placeholder={placeholder}
        aria-required={required === true || undefined}
        className={[
          "w-full rounded-field px-4 py-3 text-sm leading-relaxed resize-y",
          "bg-surface-sunken border text-content placeholder:text-content-faint",
          "transition-colors duration-200 hover:border-line-strong focus:border-brand-400",
          error ? "border-danger-500" : "border-line",
          otherProps.disabled === true
            ? "opacity-50 cursor-not-allowed"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onChange={props.onChange as any}
        rows={rows}
        value={props.value}
      />
    </div>
  );
};
