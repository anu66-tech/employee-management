import { useEffect, useState } from "react"

let toastId = 0
export function toast(message, variant = "success") {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("app-toast", { detail: { id: ++toastId, message, variant } }))
}
export function Toaster() {
  const [items, setItems] = useState([])
  useEffect(() => {
    const receive = (event) => {
      const item = event.detail
      setItems((current) => [...current, item])
      window.setTimeout(() => setItems((current) => current.filter((entry) => entry.id !== item.id)), 3600)
    }
    window.addEventListener("app-toast", receive)
    return () => window.removeEventListener("app-toast", receive)
  }, [])
  return <div className="ui-toaster" aria-live="polite" aria-relevant="additions">{items.map((item) => <div key={item.id} className={`ui-toast ui-toast-${item.variant}`} role={item.variant === "error" ? "alert" : "status"}>{item.message}</div>)}</div>
}
