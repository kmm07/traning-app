import { cva, VariantProps } from "class-variance-authority";
import React from "react";
const text = cva("text-[#fff] whitespace-nowrap", {
  variants: {
    primary: {
      true: "!text-[#A3AED0]",
    },
    white: {
      true: "!text-white",
    },
    dark: {
      true: "!text-dark-100",
    },
    danger: {
      true: "!text-error-200",
    },
    success: {
      true: "!text-success-200",
    },
    bold: {
      true: "!font-bold",
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
