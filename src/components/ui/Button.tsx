"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        outline:
          "bg-transparent border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
        ghost: "bg-transparent hover:bg-gray-50 focus:ring-primary-500",
        link: "bg-transparent underline-offset-4 hover:underline focus:ring-primary-500 p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      color: {
        primary: "",
        secondary: "",
        accent: "",
        success: "",
        warning: "",
        error: "",
        info: "",
        gray: "",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "primary",
        class: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      },
      {
        variant: "default",
        color: "secondary",
        class:
          "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
      },
      {
        variant: "default",
        color: "accent",
        class:
          "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
      },
      {
        variant: "default",
        color: "success",
        class:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      },
      {
        variant: "default",
        color: "warning",
        class:
          "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500",
      },
      {
        variant: "default",
        color: "error",
        class: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      {
        variant: "default",
        color: "info",
        class: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
      },
      {
        variant: "default",
        color: "gray",
        class: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      color: "primary",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      color,
      fullWidth,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({
          variant,
          size,
          color,
          fullWidth,
          className,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
