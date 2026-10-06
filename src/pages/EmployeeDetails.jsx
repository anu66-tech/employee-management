import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, Mail, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Avatar, formatDate } from './employeeUtils.js'

export default function EmployeeDetails() {
	const { id } = useParams()
	const { employees, deleteEmployee } = useOutletContext()
	const navigate = useNavigate()
	const employee = employees.find((item) => item.id === id)
	if (!employee) return <section className="empty-page"><p className="eyebrow">EMPLOYEE RECORD</p><h1>Employee not found</h1><Link to="/employees" className="button secondary">Back to employees</Link></section>

	function remove() {
		if (window.confirm(`Delete ${employee.name} from the employee directory?`)) {
			deleteEmployee(employee.id)
			navigate('/employees')
		}
	}

	return <>
		<Link to="/employees" className="back-link"><ArrowLeft size={16} />Back to employees</Link>
		<section className="panel detail-panel">
			<div className="employee-profile-heading"><div className="profile-person"><Avatar name={employee.name} />
            <div><p className="eyebrow">EMPLOYEE PROFILE</p><h1>{employee.name}</h1><p className="page-subtitle">{employee.role} · {employee.department}</p>
            </div></div><div className="profile-actions"><Link to={`/employees/edit/${employee.id}`} className="button secondary"><Pencil size={15} />Edit</Link><button className="button danger" type="button" onClick={remove}><Trash2 size={15} />Delete</button></div></div>
			<div className="detail-grid"><Detail icon={<Mail />} label="Email" value={employee.email} href={`mailto:${employee.email}`} /><Detail icon={<BriefcaseBusiness />} label="Designation" value={employee.role} /><Detail icon={<Building2 />} label="Department" value={employee.department} /><Detail icon={<MapPin />} label="Location" value={employee.location || 'Not provided'} /><Detail icon={<CalendarDays />} label="Joining date" value={formatDate(employee.startDate)} /><div className="detail-item"><span className="detail-label">STATUS</span><span className={`status ${employee.status.toLowerCase().replace(' ', '-')}`}>{employee.status}</span></div></div>
		</section>
	</>
}

function Detail({ icon, label, value, href }) {
	return <div className="detail-item"><span className="detail-icon">{icon}</span><span className="detail-label">{label}</span>{href ? <a className="detail-value" href={href}>{value}</a> : <b className="detail-value">{value}</b>}</div>
}
