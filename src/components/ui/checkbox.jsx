import { cn } from "./utils.js"

export function Checkbox({ className, checked, onCheckedChange, ...props }) {
  return <input type="checkbox" className={cn("ui-checkbox", className)} checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} {...props} />
}
