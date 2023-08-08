import { FieldProps, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Img } from "components";
import { VariantProps, cva } from "class-variance-authority";

const input = cva(
  "w-full rounded-2xl text-sm h-10 border bg-transparent border-[#A3AED0] placeholder:text-[#A3AED0] text-white px-3",
  {
    variants: {
      primary: {
        true: "bg-[#151423] border-[#26243F] shadow-bs !text-white  disabled:!opacity-25",
      },

      disabled: {
        true: "bg-[#151423] text-[#26243F] cursor-not-allowed",
      },

      fullWidth: {
        true: "w-full flex-1",
      },
      error: {
        true: "!border-error-100 !text-error-100",
      },
      type: {
        password: "pe-10",
      },
      rounded: {
        full: "!rounded-full",
      },
      isSearch: {
        true: "!pl-[50px]",
      },
      inputSize: {
        small: ["!text-sm", "!px-2", "!py-2", "!h-fit"],
        medium: ["text-md", "!h-15", "px-3"],
        large: "h-[50px]",
      },
    },
    defaultVariants: {
      inputSize: "medium",
    },
  }
);
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  isForm?: boolean;
  label?: any;
};

const Input = ({
  name,
  isForm = true,
  ...props
}: InputProps & VariantProps<typeof input>) => {
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

  const PasswordEye = () => (
    <button
      onClick={handleShowPassword}
      className="px-[4px] focus:outline-none absolute items-center justify-end ltr:right-1 rtl:right-1 block z-10 bottom-[8px]"
    >
      {!showPassword ? (
        <Img src="images/eye.svg" className=" relative -top-2 sm:top-0" />
      ) : (
        <Img src="images/cross-eye.svg" className="relative -top-2 sm:top-0" />
      )}
    </button>
  );

  const { className = "", required, ...otherProps } = props;
  return (
    <div className="relative w-full justify-between">
      {Boolean(label) && (
        <label
          htmlFor={name}
          className={
            "text-start block mb-2 text-sm capitalize w-full text-dark-200 dark:text-white font-normal"
          }
        >
          {label}
          {required === true && (
            <span className="text-deep_purple-A200 ms-1 text-left font-medium">
              *
            </span>
          )}
        </label>
      )}

      <input
        onKeyDown={(evt) =>
          type === "number" &&
          ["e", "E", "+", "-"].includes(evt.key) &&
          evt.preventDefault()
        }
        min="0"
        id={name}
        placeholder={placeholder ?? ""}
        type={type === "password" && showPassword ? "text" : type}
        className={input({ className, ...props })}
        {...otherProps}
      />

      {type === "password" && <PasswordEye />}
      {props.isSearch && (
        <Img
          src="images/img_search.svg"
          className="absolute left-5 top-[18px] cursor-pointer"
        />
      )}
    </div>
  );
};
