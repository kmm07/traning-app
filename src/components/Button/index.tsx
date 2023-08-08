import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const button = cva(
  "p-3 text-white px-7 text-center flex justify-center gap-3 duration-300 items-center disabled:opacity-25 rounded-[16px] whitespace-nowrap",
  {
    variants: {
      primary: {
        true: "!bg-deep_purple-A200 !text-white  disabled:!opacity-25",
      },
      primaryBorder: {
        true: "!border-primary-100 border !bg-transparent !text-primary-100",
      },
      secondary: {
        true: "dark:!bg-secondary-100 !bg-secondary-100 border-2  dark:!border-secondary-100 !border-secondary-100 !text-white",
        light:
          "bg-secondary-100 border-2  dark:!border-secondary-100 !border-secondary-100 !text-white",
      },
      secondaryBorder: {
        true: "!border-secondary-100 border-2 text-black hover:!bg-secondary-100  !bg-transparent",
      },
      fullWidth: {
        true: "w-full flex-1",
      },

      rounded: {
        full: "!rounded-full",
      },
      size: {
        xSmall: ["text-sm", "!px-2", "py-1", "h-fit"],
        small: ["!text-sm", "!px-2", "!py-2", "!h-fit"],
        medium: ["text-md", "h-10", "px-3"],
        large: "py-4 px-10 font-bold",
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
}

function Button({
  onClick,
  primary,
  primaryBorder,
  className,
  children,
  secondary,
  fullWidth,
  size,
  rounded,
  type = "button",
  isLoading,
  secondaryBorder,
  disabled = false,
}: Props & ButtonProps) {
  return (
    <button
      className={button({
        className,
        primary,
        primaryBorder,
        rounded,
        secondary,
        fullWidth,
        secondaryBorder,
        size,
      })}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export { Button };
