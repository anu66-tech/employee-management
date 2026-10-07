import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog.jsx"

export const Sheet = Dialog
export const SheetTrigger = DialogTrigger
export function SheetContent({ side = "left", className = "", ...props }) { return <DialogContent className={`ui-sheet-content ui-sheet-${side} ${className}`} {...props} /> }
export function SheetHeader(props) { return <DialogHeader {...props} /> }
export function SheetTitle(props) { return <DialogTitle {...props} /> }
export function SheetDescription(props) { return <DialogDescription {...props} /> }
