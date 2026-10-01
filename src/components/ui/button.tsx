import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Material Design 3 buttons on light surfaces: filled (pink), tonal
 * (secondary container), outlined, and text, with state-layer hovers. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[0.01em] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[1.1rem] [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[#8f0040]",
        tonal:
          "bg-secondary-container text-secondary-container-foreground hover:bg-[#ffccdb]",
        outline:
          "border border-input text-primary bg-transparent hover:bg-accent",
        ghost:
          "text-primary bg-transparent hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#e8e0ec]",
        destructive:
          "bg-destructive text-white hover:bg-[#8f1f19]",
        link:
          "text-primary underline-offset-4 hover:underline bg-transparent",
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
