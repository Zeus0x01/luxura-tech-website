import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    tone: {
      neutral: "bg-navy-900/8 text-navy-800",
      green: "bg-emerald-100 text-emerald-800",
      amber: "bg-amber-100 text-amber-900",
      blue: "bg-blue-100 text-blue-800",
      violet: "bg-violet-100 text-violet-800",
      red: "bg-red-100 text-red-800",
      lime: "bg-lime-400 text-navy-950",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
