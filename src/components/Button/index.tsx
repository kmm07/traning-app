import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const button = cva(
  "text-white btn  text-center flex justify-center gap-1 duration-300 items-center disabled:opacity-25 rounded-[16px] whitespace-nowrap",
  {
    variants: {
      primary: {
        true: "!bg-deep_purple-A200 !text-white  disabled:!opacity-25",
      },
      primaryBorder: {
        true: "!border-deep_purple-A200 border !bg-transparent !text-deep_purple-A200",
      },
      danger: {
        true: "!bg-red-500 !text-white  disabled:!opacity-25",
      },
      secondary: {
        true: "!bg-secondary-100 border-2 !border-secondary-100 !text-white",
      },
      secondaryBorder: {
        true: "!border-[#CFFF0F] !border-solid !border-2 text-white ",
      },
      tertiary: {
        true: "bg-gradient-to-tr from-sky-500 to-blue-600 text-white",
      },
      fullWidth: {
        true: " !flex-1",
      },

      rounded: {
        full: "!rounded-full",
      },
      size: {
        xSmall: ["text-sm", "py-1"],
        small: ["!text-sm", "!btn-sm"],
        medium: ["text-md", "!btn-md"],
        large: "btn-md !px-10 font-bold",
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
}

function Button({
  htmlFor,
  onClick,
  type = "button",
  ...props
}: Props & ButtonProps) {
  return (
    <button
      className={button({
        ...props,
      })}
      disabled={props.disabled || props.isLoading}
      type={type}
      onClick={() => {
        onClick && onClick();
        htmlFor && document.getElementById(htmlFor)?.click();
      }}
    >
      {props.children}
    </button>
  );
}

export { Button };
