import { cn } from "./utils.js"

export function Select({ className, children, ...props }) {
  return <select className={cn("ui-select", className)} {...props}>{children}</select>
}
