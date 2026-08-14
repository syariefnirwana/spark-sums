import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Props = HTMLMotionProps<"button"> & {
  variant?: "primary" | "ghost" | "soft";
  size?: "md" | "lg";
};

const spring = { type: "spring" as const, stiffness: 420, damping: 16, mass: 0.7 };

export function GlassButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={spring}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-bold tracking-tight select-none",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-50",
        size === "lg" ? "px-8 py-5 text-lg" : "px-5 py-3 text-base",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]",
        variant === "soft" && "glass text-foreground",
        variant === "ghost" && "glass-soft text-foreground",
        className,
      )}
      {...props}
    />
  );
}
