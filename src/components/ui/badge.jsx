import { cn } from "./utils.js"

const variants = { default: "badge-default", secondary: "badge-secondary", destructive: "badge-destructive", outline: "badge-outline", success: "badge-success", warning: "badge-warning" }

export function Badge({ variant = "default", className, ...props }) {
  return <span className={cn("badge", variants[variant] || variants.default, className)} {...props} />
}
