import { createContext, useContext, useState } from "react"
import { cn } from "./utils.js"

const TabsContext = createContext(null)
export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [current, setCurrent] = useState(defaultValue)
  const active = value ?? current
  return <TabsContext.Provider value={{ active, setActive: onValueChange ?? setCurrent }}><div className={cn("ui-tabs", className)} {...props}>{children}</div></TabsContext.Provider>
}
export function TabsList({ className, ...props }) { return <div role="tablist" className={cn("ui-tabs-list", className)} {...props} /> }
export function TabsTrigger({ value, className, ...props }) {
  const context = useContext(TabsContext)
  return <button type="button" role="tab" aria-selected={context?.active === value} className={cn("ui-tabs-trigger", context?.active === value && "is-active", className)} onClick={() => context?.setActive(value)} {...props} />
}
export function TabsContent({ value, className, ...props }) {
  const context = useContext(TabsContext)
  return context?.active === value ? <div role="tabpanel" className={cn("ui-tabs-content", className)} {...props} /> : null
}
