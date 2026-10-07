import { cn } from "./utils.js"

const variants = {
  default: "primary",
  primary: "primary",
  outline: "secondary",
  secondary: "secondary",
  destructive: "danger",
  ghost: "ghost",
  link: "link",
}

export function Button({ variant = "default", size = "default", className, type = "button", ...props }) {
  return <button type={type} className={cn("button", variants[variant] || variants.default, size !== "default" && `button-${size}`, className)} {...props} />
}
