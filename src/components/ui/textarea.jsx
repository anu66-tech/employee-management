import { cn } from "./utils.js"

export function Textarea({ className, ...props }) { return <textarea className={cn("ui-textarea", className)} {...props} /> }
