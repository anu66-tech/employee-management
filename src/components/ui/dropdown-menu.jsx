import { cloneElement, createContext, useContext, useEffect, useRef, useState } from "react"
import { cn } from "./utils.js"

const MenuContext = createContext(null)
export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onOutside = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false) }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])
  return <MenuContext.Provider value={{ open, setOpen }}><div className="ui-dropdown" ref={rootRef}>{children}</div></MenuContext.Provider>
}
export function DropdownMenuTrigger({ children, asChild = false, ...props }) {
  const context = useContext(MenuContext)
  const onClick = (event) => { props.onClick?.(event); if (!event.defaultPrevented) context?.setOpen(!context.open) }
  if (asChild && children) return cloneElement(children, { "aria-haspopup": "menu", "aria-expanded": context?.open, ...props, onClick: (event) => { children.props.onClick?.(event); if (!event.defaultPrevented) context?.setOpen(!context.open) } })
  return <button type="button" aria-haspopup="menu" aria-expanded={context?.open} {...props} onClick={onClick}>{children}</button>
}
export function DropdownMenuContent({ className, children, ...props }) {
  const context = useContext(MenuContext)
  const menuRef = useRef(null)
  useEffect(() => { if (context?.open) menuRef.current?.querySelector("[role=menuitem]")?.focus() }, [context?.open])
  if (!context?.open) return null
  function onKeyDown(event) {
    const items = [...menuRef.current.querySelectorAll("[role=menuitem]")]
    const index = items.indexOf(document.activeElement)
    if (event.key === "Escape") { event.preventDefault(); context.setOpen(false) }
    if (event.key === "ArrowDown") { event.preventDefault(); items[(index + 1) % items.length]?.focus() }
    if (event.key === "ArrowUp") { event.preventDefault(); items[(index - 1 + items.length) % items.length]?.focus() }
  }
  return <div ref={menuRef} role="menu" tabIndex={-1} className={cn("ui-dropdown-content", className)} onKeyDown={onKeyDown} {...props}>{children}</div>
}
export function DropdownMenuItem({ className, as: Component = "button", onClick, ...props }) { const context = useContext(MenuContext); return <Component role="menuitem" className={cn("ui-dropdown-item", className)} {...props} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) context?.setOpen(false) }} /> }
export function DropdownMenuSeparator() { return <div role="separator" className="ui-dropdown-separator" /> }
