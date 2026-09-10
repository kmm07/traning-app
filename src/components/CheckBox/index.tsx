import { FieldProps, Field } from "formik";
import React, { FC } from "react";

/*
 * صندوقُ الاختيار.
 *
 * 🔴 **كان `<input type="checkbox">` عارياً بلا صنفٍ واحد** ⇒ يرسمه المتصفّح
 *    بمربّعه الأبيض الافتراضيّ على أرضيةٍ سوداء: بقعةٌ بيضاء ناشزةٌ في كل
 *    نموذج، ولا يتبع لونَ الهوية عند الاختيار.
 *
 * 🔴 **ولافتتُه `text-dark-200`** — من عائلة الأصناف الصامتة نفسِها التي
 *    صارت أسودَ على أسود لمّا عُرِّفت. صارت `text-content`.
 */
const CheckBox: FC<CheckBoxProps & { isForm?: boolean }> = ({
  name,
  isForm = true,
  ...props
}: CheckBoxProps & { isForm?: boolean }) => {
  return isForm ? (
    <Field name={name}>
      {({ form: { errors, touched, setFieldValue, values } }: FieldProps) => {
        return (
          <div>
            <CustomCheckBox
              onClick={(e: any) => {
                setFieldValue(name, e.target.checked ? 1 : 0);
              }}
              value={Boolean(values[name])}
              label={props.label}
              name={name}
            />
            {Boolean(touched[name]) && Boolean(errors[name]) && (
              <div className="text-danger-400 text-xs text-start mt-1">
                <>{errors[name]}</>
              </div>
            )}
          </div>
        );
      }}
    </Field>
  ) : (
    <CustomCheckBox {...props} name={name} />
  );
};
export { CheckBox };

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value?: any;
  label?: string | React.ReactNode;
  error?: boolean;
  labelStyling?: string;
}

function CustomCheckBox({
  label,
  value,
  labelStyling = "",
  ...props
}: CheckBoxProps) {
  return (
    <div className="form-control">
      <label
        className={`flex items-center gap-3 cursor-pointer w-fit select-none group ${labelStyling}`}
      >
        <input
          type="checkbox"
          checked={value}
          className={[
            "h-[18px] w-[18px] shrink-0 rounded-[6px] appearance-none cursor-pointer",
            "border border-line-strong bg-surface-sunken",
            "transition-all duration-150",
            "hover:border-brand-400",
            "checked:bg-brand-400 checked:border-brand-400",
            /* علامةُ الصحّ مرسومةٌ بالخلفية — بلا أيقونةٍ خارجية. */
            "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23090909%22><path d=%22M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0z%22/></svg>')]",
            "checked:bg-center checked:bg-no-repeat checked:bg-[length:14px_14px]",
          ].join(" ")}
          {...props}
        />
        {Boolean(label) && (
          <span className="text-sm text-content group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    </div>
  );
}
