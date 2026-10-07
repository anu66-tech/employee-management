import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { Avatar, formatDate } from "./employeeUtils.js"
import { Badge } from "../components/ui/badge.jsx"
import { Button } from "../components/ui/button.jsx"
import { Card } from "../components/ui/card.jsx"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"

export default function EmployeeDetails() {
  const { id } = useParams()
  const { employees, deleteEmployee } = useOutletContext()
  const navigate = useNavigate()
  const employee = employees.find((item) => item.id === id)
  if (!employee) return <section className="empty-page"><p className="eyebrow">EMPLOYEE RECORD</p><h1>Employee not found</h1><Link to="/employees" className="button secondary">Back to employees</Link></section>

  return <>
    <Link to="/employees" className="back-link"><ArrowLeft size={16} />Back to employees</Link>
    <Card className="detail-panel detail-card">
      <div className="employee-profile-heading">
        <div className="profile-person"><Avatar name={employee.name || "Employee"} /><div><p className="eyebrow">EMPLOYEE PROFILE</p><h1>{employee.name || "Unnamed employee"}</h1><p className="page-subtitle">{employee.role || "Role not provided"} · {employee.department || "Department not provided"}</p></div></div>
        <div className="profile-actions"><Link to={`/employees/edit/${employee.id}`} className="button secondary"><Pencil size={15} />Edit</Link><DeleteEmployeeDialog employee={employee} onDelete={() => { deleteEmployee(employee.id); navigate("/employees") }} /></div>
      </div>
      <Tabs defaultValue="personal" className="profile-tabs">
        <TabsList><TabsTrigger value="personal">Personal information</TabsTrigger><TabsTrigger value="employment">Employment information</TabsTrigger></TabsList>
        <TabsContent value="personal"><div className="detail-grid"><Detail icon={<Mail />} label="Email" value={employee.email} href={employee.email ? `mailto:${employee.email}` : undefined} /><Detail icon={<Phone />} label="Phone" value={employee.phone} href={employee.phone ? `tel:${employee.phone}` : undefined} /><Detail icon={<MapPin />} label="Location" value={employee.location} /></div></TabsContent>
        <TabsContent value="employment"><div className="detail-grid"><Detail icon={<BriefcaseBusiness />} label="Employee ID" value={employee.id} /><Detail icon={<BriefcaseBusiness />} label="Designation" value={employee.role} /><Detail icon={<Building2 />} label="Department" value={employee.department} /><Detail icon={<CalendarDays />} label="Joining date" value={formatDate(employee.startDate)} /><Detail icon={<BriefcaseBusiness />} label="Salary" value={employee.salary} /><div className="detail-item"><span className="detail-label">STATUS</span><Badge variant={employee.status?.toLowerCase() === "active" ? "success" : employee.status?.toLowerCase().includes("leave") ? "warning" : "secondary"}>{employee.status || "Not provided"}</Badge></div></div></TabsContent>
      </Tabs>
    </Card>
  </>
}

function DeleteEmployeeDialog({ employee, onDelete }) {
  const [open, setOpen] = useState(false)
  return <AlertDialog open={open} onOpenChange={setOpen}>
    <Button variant="destructive" className="button danger" type="button" onClick={() => setOpen(true)}><Trash2 size={15} />Delete</Button>
    <AlertDialogContent>
      <AlertDialogHeader><AlertDialogTitle>Delete {employee.name}?</AlertDialogTitle><AlertDialogDescription>This will remove this employee from your directory. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel className="button secondary">Cancel</AlertDialogCancel><AlertDialogAction className="button danger" onClick={onDelete}>Delete employee</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}

function Detail({ icon, label, value, href }) {
  return <div className="detail-item"><span className="detail-icon">{icon}</span><span className="detail-label">{label}</span>{href ? <a className="detail-value" href={href}>{value || "Not provided"}</a> : <b className="detail-value">{value || "Not provided"}</b>}</div>
}
