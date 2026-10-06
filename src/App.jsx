import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import AddEmployee from "./pages/AddEmployee.jsx";
import EditEmployee from "./pages/EditEmployee.jsx";
import EmployeeDetails from "./pages/EmployeeDetails.jsx";
import { normalizeEmployeeIds } from "./pages/employeeUtils.js";

import "./App.css";

const STORAGE_KEY = "employees";
// Start with no employees
const initialEmployees = [];

function loadEmployees() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      const employees = JSON.parse(stored);

      if (Array.isArray(employees)) {
        return normalizeEmployeeIds(employees);
      }
    }
  } catch {
    return initialEmployees;
  }

  return initialEmployees;
}

function AppLayout({
  employees,
  saveEmployee,
  deleteEmployee,
  isLoading,
  notification,
  setNotification,
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!notification) return undefined;
    const timeoutId = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notification, setNotification]);

  return (
    <div className={`app-shell${isMobileNavOpen ? " mobile-nav-open" : ""}`}>

      <aside className="sidebar">


        <p className="nav-caption">
          WORKSPACE
        </p>

        <nav
          id="main-navigation"
          className="side-nav"
          aria-label="Main navigation"
        >
          <Link to="/dashboard" onClick={() => setIsMobileNavOpen(false)}>
            Dashboard
          </Link>

          <Link to="/employees" onClick={() => setIsMobileNavOpen(false)}>
            Employees
            <span>{employees.length}</span>
            
          
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/login"
            onClick={() => {
              sessionStorage.removeItem("isLoggedIn");
              setIsMobileNavOpen(false);
            }}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </Link>
        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileNavOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
          >
            {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span>
            Employee Management Dashboard
          </span>
        </header>

        <div className="page-content">
          {notification && (
            <div className="success-notification" role="status">
              ✓ {notification}
            </div>
          )}
          <Outlet
            context={{
              employees,
              saveEmployee,
              deleteEmployee,
              isLoading,
            }}
          />
        </div>

      </main>

    </div>
  );
}

function NotFound() {
  return (
    <section className="empty-page">

      <p className="eyebrow">
        404 · NOT FOUND
      </p>

      <h1>
        We couldn't find that page.
      </h1>

      <Link
        className="button primary"
        to="/dashboard"
      >
        Go to dashboard
      </Link>

    </section>
  );
}

function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {

  const [employees, setEmployees] = useState(loadEmployees);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsLoading(false));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(employees)
    );
  }, [employees, isLoading]);

  function saveEmployee(employee) {
    const isUpdate = employees.some((item) => item.id === employee.id);
    setEmployees((current) =>
      current.some(
        (item) => item.id === employee.id
      )
        ? current.map((item) =>
            item.id === employee.id
              ? employee
              : item
          )
        : [employee, ...current]
    );
    setNotification(isUpdate ? "Employee updated successfully" : "Employee added successfully");
  }

  function deleteEmployee(id) {
    setEmployees((current) =>
      current.filter(
        (employee) => employee.id !== id
      )
    );
    setNotification("Employee deleted successfully");
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout
                employees={employees}
                saveEmployee={saveEmployee}
                deleteEmployee={deleteEmployee}
                isLoading={isLoading}
                notification={notification}
                setNotification={setNotification}
              />
            </PrivateRoute>
          }
        >

          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="employees"
            element={<EmployeeList />}
          />

          <Route
            path="employees/add"
            element={<AddEmployee />}
          />

          <Route
            path="employees/edit/:id"
            element={<EditEmployee />}
          />

          <Route
            path="employees/:id"
            element={<EmployeeDetails />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}