import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "./dialog.jsx"

export const AlertDialog = Dialog
export const AlertDialogTrigger = DialogTrigger
export function AlertDialogContent(props) { return <DialogContent className={`ui-alert-dialog ${props.className || ""}`} {...props} /> }
export const AlertDialogHeader = DialogHeader
export const AlertDialogTitle = DialogTitle
export const AlertDialogDescription = DialogDescription
export const AlertDialogFooter = DialogFooter
export const AlertDialogCancel = DialogClose
export function AlertDialogAction({ onClick, ...props }) { return <DialogClose {...props} onClick={onClick} /> }
