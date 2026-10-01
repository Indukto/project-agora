import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* M3 assist chips & status badges. */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] uppercase w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/25 bg-primary/12 text-primary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        success:
          "border-success/30 bg-success/12 text-success",
        outline:
          "border-border text-muted-foreground [a&]:hover:border-primary/40 [a&]:hover:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
