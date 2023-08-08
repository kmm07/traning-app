import { FieldProps, Field } from "formik";
import React, { FC } from "react";

const CheckBox: FC<CheckBoxProps & { isForm?: boolean }> = ({
  name,
  isForm = false,
  ...props
}: CheckBoxProps & { isForm?: boolean }) => {
  return isForm ? (
    <Field name={name}>
      {({ field, form: { errors, touched } }: FieldProps) => {
        return (
          <div>
            <CustomCheckBox {...props} {...field} name={name} />
            {Boolean(touched[name]) && Boolean(errors[name]) && (
              <div className="text-error-100 text-sm text-start">
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
  name,
  label,
  value,
  labelStyling = "",
  ...props
}: CheckBoxProps) {
  return (
    <div className="form-control">
      <label className={`label cursor-pointer justify-center ${labelStyling}`}>
        <input
          type="checkbox"
          className="checkbox rtl:rotate-y-180 checkbox-primary"
          {...props}
          name={name}
          checked={value}
        />
        {Boolean(label) && (
          <span className="label-text dark:text-white text-dark-200 px-3">
            {label}
          </span>
        )}
      </label>
    </div>
  );
}
