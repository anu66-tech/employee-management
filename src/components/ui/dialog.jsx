import { cloneElement, createContext, useContext, useEffect, useId, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "./utils.js"

const DialogContext = createContext(null)

export function Dialog({ open: controlledOpen, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const id = useId()
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  return <DialogContext.Provider value={{ open, setOpen, id }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ children, asChild = false, ...props }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used inside Dialog")
  
  const triggerProps = { 
    ...props, 
    type: "button", 
    onClick: (event) => { 
      props.onClick?.(event); 
      if (!event.defaultPrevented) context.setOpen(true) 
    } 
  }
  
  if (asChild && children) return cloneElement(children, { ...triggerProps, ...children.props, onClick: (event) => { children.props.onClick?.(event); if (!event.defaultPrevented) context.setOpen(true) } })
  return <button {...triggerProps}>{children}</button>
}

export function DialogContent({ className, children, ...props }) {
  const context = useContext(DialogContext)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  useEffect(() => {
    if (!context?.open) return undefined
    const closeOnEscape = (event) => { if (event.key === "Escape") context.setOpen(false) }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [context])
  
  if (!context) throw new Error("DialogContent must be used inside Dialog")
  if (!mounted || !context.open) return null
  
  return createPortal(
    // Backdrop blur & fade-in overlay style matching shadcn
    <div 
      className="ui-dialog-overlay" 
      onMouseDown={(event) => { if (event.target === event.currentTarget) context.setOpen(false) }}
    >
      {/* Modern Dialog Surface Container */}
      <section 
        role="dialog" 
        aria-modal="true" 
        className={cn(
          "ui-dialog-content", 
          className
        )} 
        aria-labelledby={`${context.id}-title`}
        aria-describedby={`${context.id}-description`}
        {...props}
      >
        {children}
        
        {/* Semantic Top-Right Absolute Close Button */}
        <button
          type="button"
          onClick={() => context.setOpen(false)}
          className="ui-dialog-close"
        >
          <X className="h-4 w-4 text-slate-500" />
          <span className="sr-only">Close</span>
        </button>
      </section>
    </div>,
    document.body,
  )
}

export function DialogHeader({ className, ...props }) { 
  return <div className={cn("ui-dialog-header", className)} {...props} /> 
}

export function DialogTitle({ className, ...props }) { 
  const context = useContext(DialogContext)
  return <h2 id={`${context?.id}-title`} className={cn("ui-dialog-title", className)} {...props} /> 
}

export function DialogDescription({ className, ...props }) { 
  const context = useContext(DialogContext)
  return <p id={`${context?.id}-description`} className={cn("ui-dialog-description", className)} {...props} /> 
}

export function DialogFooter({ className, ...props }) { 
  return <div className={cn("ui-dialog-footer", className)} {...props} /> 
}

export function DialogClose({ children, ...props }) {
  const context = useContext(DialogContext)
  return (
    <button 
      type="button" 
      {...props} 
      onClick={(event) => { 
        props.onClick?.(event); 
        if (!event.defaultPrevented) context?.setOpen(false) 
      }}
    >
      {children}
    </button>
  )
}
