import { FieldProps, Field, ErrorMessage } from "formik";
import React, { FC } from "react";

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  isForm?: boolean;
  placeholder?: string;
  label?: string;
  error?: boolean;
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
            <div className="text-error-100 text-sm text-start">
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
  ...props
}) => {
  const { className = "", required, ...otherProps } = props;
  return (
    <div className="relative w-full justify-between">
      {Boolean(label) && (
        <label
          htmlFor={name}
          className={
            "text-start block mb-2 text-sm  w-full text-dark-200 font-normal"
          }
        >
          {label}
          {required === true && <span className="text-red-500"> *</span>}
        </label>
      )}

      <textarea
        id={name}
        placeholder={placeholder}
        className={`w-full rounded-md text-lime-100
         ${error ? "border-red-500" : ""} bg-transparent indent-4  ${
          otherProps.disabled === true ? "opacity-60 cursor-not-allowed" : ""
        } ${className}`}
        onChange={props.onChange as any}
        rows={3}
        value={props.value}
      />
    </div>
  );
};
