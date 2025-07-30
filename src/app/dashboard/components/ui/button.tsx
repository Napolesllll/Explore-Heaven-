'use client';

import { cn } from "../../../../lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "danger";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2",
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
          variant === "outline" && "border border-gray-300 text-gray-900 hover:bg-gray-100",
          variant === "ghost" && "text-gray-600 hover:bg-gray-100",
          variant === "danger" && "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
