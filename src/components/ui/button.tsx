import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Brand lime with navy text: primary call to action
        primary: "bg-lime-400 text-navy-950 hover:bg-lime-300 shadow-[0_1px_0_rgb(255_255_255/0.4)_inset] hover:-translate-y-px",
        dark: "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-px",
        outline: "border border-navy-900/20 bg-transparent text-navy-900 hover:border-navy-900 hover:bg-navy-900/[0.03]",
        outlineLight: "border border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10",
        ghost: "text-navy-800 hover:bg-navy-900/5",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "h-auto p-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
