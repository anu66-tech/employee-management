import { useEffect, useState } from "react"
import { BrowserRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import { Command as CommandIcon, LayoutDashboard, LogOut, Menu, UsersRound } from "lucide-react"

import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import EmployeeList from "./pages/EmployeeList.jsx"
import AddEmployee from "./pages/AddEmployee.jsx"
import EditEmployee from "./pages/EditEmployee.jsx"
import EmployeeDetails from "./pages/EmployeeDetails.jsx"
import { normalizeEmployeeIds } from "./pages/employeeUtils.js"
import { Button } from "./components/ui/button.jsx"
import { CommandPalette } from "./components/ui/command.jsx"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet.jsx"
import { Toaster, toast } from "./components/ui/sonner.jsx"
import { Tooltip } from "./components/ui/tooltip.jsx"
import "./App.css"

const EMPLOYEE_KEY = "employees"
const AUTH_KEY = "isLoggedIn"

function loadEmployees() {
  try {
    const fromLocal = localStorage.getItem(EMPLOYEE_KEY)
    const legacyValue = sessionStorage.getItem(EMPLOYEE_KEY)
    const value = fromLocal ?? legacyValue
    if (!value) return []
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    const normalized = normalizeEmployeeIds(parsed)
    if (!fromLocal) localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(normalized))
    return normalized
  } catch {
    return []
  }
}

function isLoggedIn() {
  try {
    return localStorage.getItem(AUTH_KEY) === "true" || sessionStorage.getItem(AUTH_KEY) === "true"
  } catch {
    return false
  }
}

function NavigationItems({ count, onNavigate }) {
  return <nav className="side-nav" aria-label="Main navigation">
    <NavLink to="/dashboard" onClick={onNavigate} className={({ isActive }) => isActive ? "active" : ""}><LayoutDashboard size={16} /><span>Dashboard</span></NavLink>
    <NavLink to="/employees" onClick={onNavigate} className={({ isActive }) => isActive ? "active" : ""}><UsersRound size={16} /><span>Employees</span><span className="nav-count">{count}</span></NavLink>
  </nav>
}

function AppLayout({ employees, saveEmployee, deleteEmployee }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function onShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onShortcut)
    return () => window.removeEventListener("keydown", onShortcut)
  }, [])

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(AUTH_KEY)
    toast("Logged out successfully")
    navigate("/login")
  }

  return <div className="app-shell">
    <aside className="sidebar desktop-sidebar">
      <Link to="/dashboard" className="brand"><span className="brand-mark"><UsersRound size={17} /></span>Employee Hub</Link>
      <p className="nav-caption">WORKSPACE</p>
      <NavigationItems count={employees.length} />
      <div className="sidebar-footer"><button type="button" onClick={logout}><LogOut size={16} /><span>Sign out</span></button></div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <Tooltip content="Open navigation menu"><SheetTrigger asChild><Button variant="ghost" className="mobile-menu-toggle" aria-label="Open navigation menu"><Menu size={19} /></Button></SheetTrigger></Tooltip>
          <SheetContent className="mobile-nav-sheet">
            <SheetHeader><SheetTitle>Employee Hub</SheetTitle></SheetHeader>
            <SheetDescription className="sr-only">Navigate to an existing section of the employee management app.</SheetDescription>
            <p className="nav-caption">WORKSPACE</p>
            <NavigationItems count={employees.length} onNavigate={() => setMobileNavOpen(false)} />
            <div className="sidebar-footer"><button type="button" onClick={logout}><LogOut size={16} /><span>Sign out</span></button></div>
          </SheetContent>
        </Sheet>
        <span>Employee Management </span>
        <div className="topbar-actions" >
          <Tooltip content="Quick navigation (Ctrl+K / ⌘K)"><Button variant="outline" size="sm" className="command-trigger" onClick={() => setCommandOpen(true)}><CommandIcon size={14} /><span>Search</span><kbd>⌘ K</kbd></Button></Tooltip>
        </div>
      </header>

      <div className="page-content"><Outlet context={{ employees, saveEmployee, deleteEmployee }} /></div>
    </main>
    <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onNavigate={navigate} onLogout={logout} />
  </div>
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function LoginGuard() {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />
}

function NotFound() {
  return <section className="empty-page"><p className="eyebrow">404 · NOT FOUND</p><h1>We couldn&apos;t find that page.</h1><Link className="button primary" to="/dashboard">Go to dashboard</Link></section>
}

export default function App() {
  const [employees, setEmployees] = useState(loadEmployees)

  useEffect(() => {
    try { localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employees)) } catch { /* Browser storage can be disabled. */ }
  }, [employees])

  function saveEmployee(employee) {
    const isUpdate = employees.some((item) => item.id === employee.id)
    setEmployees((current) => current.some((item) => item.id === employee.id)
      ? current.map((item) => item.id === employee.id ? employee : item)
      : [employee, ...current])
    toast(isUpdate ? "Employee updated successfully" : "Employee added successfully")
  }

  function deleteEmployee(id) {
    setEmployees((current) => current.filter((employee) => employee.id !== id))
    toast("Employee deleted successfully")
  }

  return <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/login" element={<LoginGuard />} />
      <Route path="/" element={<PrivateRoute><AppLayout employees={employees} saveEmployee={saveEmployee} deleteEmployee={deleteEmployee} /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/add" element={<AddEmployee />} />
        <Route path="employees/edit/:id" element={<EditEmployee />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
}
