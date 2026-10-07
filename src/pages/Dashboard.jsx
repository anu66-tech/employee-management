import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  UserRoundCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { Avatar, formatDate } from "./employeeUtils.js";
import { Card } from "../components/ui/card.jsx";

export default function Dashboard() {
  const { employees } = useOutletContext();
  const active = employees.filter((employee) => employee.status === "Active").length;
  const inactive = employees.filter((employee) => employee.status === "Inactive").length;
  const departmentCounts = employees.reduce((counts, employee) => {
    const department = employee.department?.trim();
    if (department) counts[department] = (counts[department] || 0) + 1;
    return counts;
  }, {});
  const departments = Object.entries(departmentCounts)
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .slice(0, 5);
  const recentEmployees = [...employees]
    .sort((first, second) => (second.startDate || "").localeCompare(first.startDate || ""))
    .slice(0, 5);
  const activeRate = employees.length ? Math.round((active / employees.length) * 100) : 0;
  const greeting = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <div className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">PEOPLE OPERATIONS</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">A clear view of your people and organization.</p>
        </div>
        <div className="dashboard-heading-actions">
          <span className="dashboard-date"><CalendarDays size={15} />{greeting}</span>
          <Link to="/employees/add" className="button primary"><UserPlus size={16} />Add employee</Link>
        </div>
      </div>

      <section className="stat-grid" aria-label="Employee metrics">
        <Metric to="/employees" icon={<UsersRound />} label="Total employees" value={employees.length} detail="Across your organization" tone="blue" />
        <Metric to="/employees?status=Active" icon={<UserRoundCheck />} label="Active employees" value={active} detail={`${activeRate}% of your workforce`} tone="green" />
        <Metric icon={<BriefcaseBusiness />} label="Departments" value={Object.keys(departmentCounts).length} detail="Teams represented" tone="violet" />
        <Metric to="/employees?status=Inactive" icon={<Building2 />} label="Inactive employees" value={inactive} detail="Not currently active" tone="amber" />
      </section>

      <div className="dashboard-grid">
        <Card className="dashboard-panel department-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h2>Department overview</h2>
              <p>Employee distribution across teams</p>
            </div>
            <span className="panel-heading-icon"><Building2 size={17} /></span>
          </div>
          {departments.length ? (
            <div className="department-list">
              {departments.map(([department, count], index) => (
                <div className="department-row" key={department}>
                  <div className="department-row-label">
                    <span className={`department-dot department-dot-${index + 1}`} />
                    <span>{department}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="department-track" aria-label={`${department}: ${count} employees`}>
                    <span style={{ width: `${Math.max((count / employees.length) * 100, 4)}%` }} />
                  </div>
                </div>
              ))}
              {Object.keys(departmentCounts).length > departments.length && (
                <Link to="/employees" className="dashboard-panel-link">
                  View all departments <ArrowRight size={15} />
                </Link>
              )}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <span className="empty-state-icon"><Building2 size={21} /></span>
              <strong>No departments yet</strong>
              <span>Add employee records to see your team distribution.</span>
              <Link to="/employees/add" className="dashboard-panel-link">Add your first employee <ArrowRight size={15} /></Link>
            </div>
          )}
        </Card>

        <Card className="dashboard-panel recent-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h2>Recently added</h2>
              <p>Your latest employee records</p>
            </div>
            <Link to="/employees" className="dashboard-panel-link">View directory <ArrowRight size={15} /></Link>
          </div>
          {recentEmployees.length ? (
            <div className="recent-list">
              {recentEmployees.map((employee) => (
                <Link className="recent-person" to={`/employees/${employee.id}`} key={employee.id}>
                  <Avatar name={employee.name || "Employee"} />
                  <span className="recent-person-info">
                    <b>{employee.name || "Unnamed employee"}</b>
                    <small>{employee.role || "Role not provided"}{employee.department ? ` · ${employee.department}` : ""}</small>
                  </span>
                  <time dateTime={employee.startDate || undefined}>{formatDate(employee.startDate)}</time>
                </Link>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state recent-empty-state">
              <span className="empty-state-icon"><UsersRound size={21} /></span>
              <strong>Your team starts here</strong>
              <span>Keep employee details organized in one place.</span>
              <Link to="/employees/add" className="button secondary">Add your first employee</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Metric({ to, icon, label, value, detail, tone }) {
  const content = (
    <>
      <span className={`stat-icon stat-icon-${tone}`}>{icon}</span>
      <span className="stat-card-copy">
        <span className="stat-card-label">{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </span>
    </>
  );

  return to
    ? <Card as={Link} to={to} className="stat-card">{content}</Card>
    : <Card className="stat-card">{content}</Card>;
}
