import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, LayoutDashboard, LogOut, Search, UsersRound } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog.jsx"

export function CommandPalette({ open, onOpenChange, onNavigate, onLogout }) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const items = useMemo(() => [
    { label: "Dashboard", hint: "Open overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { label: "Employees", hint: "Browse employee directory", href: "/employees", icon: <UsersRound size={16} /> },
    { label: "Log out", hint: "End your session", action: onLogout, icon: <LogOut size={16} /> },
  ].filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase())), [query, onLogout])

  useEffect(() => { if (open) { setQuery(""); setActive(0); requestAnimationFrame(() => inputRef.current?.focus()) } }, [open])
  function run(item) {
    onOpenChange(false)
    if (item.href) onNavigate(item.href)
    else item.action?.()
  }
  function onKeyDown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((index) => (index + 1) % Math.max(items.length, 1)) }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((index) => (index - 1 + items.length) % Math.max(items.length, 1)) }
    if (event.key === "Enter" && items[active]) { event.preventDefault(); run(items[active]) }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="ui-command-dialog" onKeyDown={onKeyDown}>
    <DialogHeader><DialogTitle>Quick navigation</DialogTitle><DialogDescription>Search existing sections and actions.</DialogDescription></DialogHeader>
    <label className="ui-command-search"><Search size={16} /><input ref={inputRef} className="ui-command-input" value={query} onChange={(event) => { setQuery(event.target.value); setActive(0) }} placeholder="Type a command..." /></label>
    <div className="ui-command-list" role="listbox">{items.map((item, index) => <button key={item.label} type="button" role="option" aria-selected={index === active} className="ui-command-item" onMouseEnter={() => setActive(index)} onClick={() => run(item)}>{item.icon}<span className="ui-command-label">{item.label}<small>{item.hint}</small></span><ArrowRight className="ui-command-arrow" size={14} /></button>)}{items.length === 0 && <p className="ui-command-empty">No matching sections.</p>}</div>
    <div className="ui-command-hint"><kbd>↑</kbd><kbd>↓</kbd> to navigate <kbd>↵</kbd> to select <kbd>Esc</kbd> to close</div>
  </DialogContent></Dialog>
}
