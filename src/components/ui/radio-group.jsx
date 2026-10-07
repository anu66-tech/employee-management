import { createContext, useContext } from "react"
import { cn } from "./utils.js"

const RadioContext = createContext(null)
export function RadioGroup({ value, onValueChange, name, className, children, ...props }) { return <RadioContext.Provider value={{ value, onValueChange, name }}><div role="radiogroup" className={cn("ui-radio-group", className)} {...props}>{children}</div></RadioContext.Provider> }
export function RadioGroupItem({ value, ...props }) { const context = useContext(RadioContext); return <input type="radio" name={context?.name} value={value} checked={context?.value === value} onChange={() => context?.onValueChange?.(value)} {...props} /> }
