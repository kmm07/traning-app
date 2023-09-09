import { FieldProps, Field } from "formik";
import React, { FC } from "react";

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
              <div className="text-red-500 text-sm text-start">
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
        className={`label cursor-pointer justify-center w-fit ${labelStyling}`}
      >
        <input type="checkbox" checked={value} {...props} />
        {Boolean(label) && (
          <span className="label-text dark:text-white text-dark-200 px-3">
            {label}
          </span>
        )}
      </label>
    </div>
  );
}
