import { cn } from "./utils.js"

export function Input({ className, type = "text", ...props }) {
  return <input type={type} className={cn("ui-input", className)} {...props} />
}
