import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 
          'bg-primary text-primary-foreground border border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_15px_rgba(245,158,11,0.3)] hover:bg-primary/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_25px_rgba(245,158,11,0.6)] hover:border-primary/80',
        destructive:
          'bg-destructive/90 text-white border border-destructive/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_15px_rgba(220,38,38,0.3)] hover:bg-destructive hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_25px_rgba(220,38,38,0.6)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-white/10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-foreground hover:bg-accent/10 hover:border-accent/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] hover:text-black',
        secondary:
          'bg-white/10 border border-white/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]',
        ghost:
          'border border-transparent text-foreground hover:bg-white/5 hover:border-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
        link: 
          'text-primary underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }