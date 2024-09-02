import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center whitespace-nowrap
   rounded-md text-sm font-medium ring-offset-background transition-colors 
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
   focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        answer_choice:
          "bg-gray-100 text-black hover:bg-gray-100/90 border-white-500 border-2 border-b-[3px]",
        answer_selected:
          "bg-gray-200 text-black border-white-500 border-2 border-b-[3px]",
        correct:
          "bg-green-200 text-black hover:bg-green-200/90 border-green-500 border-2 border-b-[3px]",
        incorrect:
          "bg-red-200 text-black hover:bg-red-200/90 border-red-500 border-2 border-b-[3px]",

        default:
          "bg-gray-100 text-black hover:bg-gray-100/90 border-black border-2 border-b-[3px]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input border-2 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        open: "bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm hover:bg-[#3498db] hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xs: "h-6 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
