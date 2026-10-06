import { ArrowRight, BriefcaseBusiness, UserRoundCheck, UsersRound } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import { Avatar, formatDate } from './employeeUtils.js'

export default function Dashboard() {
	const { employees } = useOutletContext()
	const active = employees.filter((employee) => employee.status === 'Active').length
    const inactive = employees.filter((employee) => employee.status === 'Inactive').length
	const teams = new Set(employees.map((employee) => employee.department)).size
	const recent = [...employees].sort((a, b) => b.startDate.localeCompare(a.startDate)).slice(0, 4)

	return <>
		<div className="page-heading"><div><p className="eyebrow">PEOPLE OPERATIONS</p><h1>Dashboard</h1></div></div>
		<section className="stat-grid" aria-label="Employee metrics">
			<Metric to="/employees" icon={<UsersRound />} label="Total employees" value={employees.length} detail="People in your workspace" />
			<Metric to="/employees?status=Active" icon={<UserRoundCheck />} label="Active employees" value={active} detail="Currently active" />
			<Metric icon={<BriefcaseBusiness />} label="Departments" value={teams} detail="Teams across the company" />
			<Metric to="/employees?status=Inactive" icon={<UserRoundCheck />} label="Inactive employees" value={inactive} detail="Currently inactive"/>
		</section>

	
	</>
}

function Metric({ to, icon, label, value, detail }) {
	const content = <><span className="stat-icon">{icon}</span><p>{label}</p><strong>{value}</strong><small>{detail}</small></>
	return to
		? <Link to={to} className="stat-card">{content}</Link>
		: <article className="stat-card">{content}</article>
}
