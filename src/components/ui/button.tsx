import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Material Design 3 button system: pill-shaped, 40px min height, label-large
 * type, state-layer hovers, tonal elevation instead of hard shadows. */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[0.01em] transition-[background-color,box-shadow,transform,color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[1.1rem] [&_svg]:shrink-0 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_3px_oklch(0_0_0/0.3),0_4px_12px_-4px_var(--glow)] hover:shadow-[0_2px_6px_oklch(0_0_0/0.3),0_6px_18px_-4px_var(--glow)] hover:brightness-110",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tonal:
          "bg-primary/15 text-primary hover:bg-primary/25",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/40",
        ghost:
          "text-foreground/80 hover:bg-primary/10 hover:text-foreground",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/25",
        link:
          "text-primary underline-offset-4 hover:underline rounded-sm active:scale-100",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 px-4 text-[13px]",
        lg: "h-12 px-8 text-[15px]",
        icon: "size-10",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
