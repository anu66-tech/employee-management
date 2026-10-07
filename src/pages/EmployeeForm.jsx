import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { nextEmployeeId } from './employeeUtils.js'
import { Input } from '../components/ui/input.jsx'
import { Select } from '../components/ui/select.jsx'
import { Label } from '../components/ui/label.jsx'
import { Card } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group.jsx'
import { toast } from '../components/ui/sonner.jsx'

const emptyEmployee = { name: '', email: '', role: '', department: '', status: 'Active', location: '', startDate: '', phone: '', salary: '' }
const departments = ['IT', 'HR', 'Marketing',  'Finance', 'Sales']
export function EmployeeForm({ mode }) {
  const { id } = useParams()
  const { employees, saveEmployee } = useOutletContext()
  const existing = employees.find((employee) => employee.id === id)
  const navigate = useNavigate()
  const [form, setForm] = useState(() => existing ? { ...existing } : { ...emptyEmployee, id: nextEmployeeId(employees) })
  const [error, setError] = useState('')

  if (mode === 'edit' && !existing) return <section className="empty-page"><h1>Employee not found</h1><Link to="/employees" className="button secondary">Back to employees</Link></section>

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    const normalizedEmail = form.email.trim().toLowerCase()
    if (employees.some((employee) => employee.email.toLowerCase() === normalizedEmail && employee.id !== existing?.id)) {
      setError('An employee with that email address already exists.')
      toast('An employee with that email address already exists.', 'error')
      return
    }
    saveEmployee({ ...form, id: existing?.id ?? nextEmployeeId(employees), name: form.name.trim(), email: form.email.trim() })
    navigate('/employees')
  }

  return <>
    <Link to={mode === 'edit' ? `/employees/${id}` : '/employees'} className="back-link"><ArrowLeft size={16} />Back to {mode === 'edit' ? 'profile' : 'employees'}</Link>
    <div className="page-heading form-page-heading"><div><p className="eyebrow">EMPLOYEE RECORD</p><h1>{mode === 'edit' ? 'Edit employee' : 'Add employee'}</h1></div></div>
    <Card as="form" className="employee-form" onSubmit={submit}>
      <div className="form-section-title"><b>Personal information</b></div>
      <div className="form-grid">
        <Field label="Employee ID"><Input name="id" value={form.id} readOnly aria-readonly="true" /></Field>
        <Field label="Full name" required><Input name="name" value={form.name} onChange={update} placeholder="e.g. Alex Morgan" required /></Field>
        <Field label ="Phone number"><Input name="phone" value={form.phone} onChange={update} placeholder="e.g. +1 555-555-5555" /></Field>
        <Field label="Email" required><Input type="email" name="email" value={form.email} onChange={update} placeholder="alex@company.com" required /></Field>
        <Field label="Designation" required><Input name="role" value={form.role} onChange={update} placeholder="e.g. Product Designer" required /></Field>
        <Field label="Department" required><Select name="department" value={form.department} onChange={update} required><option value="" disabled>Select department</option>{departments.map((department) => <option key={department}>{department}</option>)}</Select></Field>
        <Field label="Joining Date" required><Input type="date" name="startDate" value={form.startDate} onChange={update} required /></Field>
        <Field label ="Salary"><Input name="salary" value={form.salary} onChange={update} placeholder="e.g. $50,000" /></Field>
        <Field label="Location"><Input name="location" value={form.location} onChange={update} placeholder="e.g. India, Tamilnadu" /></Field>
        <Field label="Employment status"><RadioGroup name="status" value={form.status} onValueChange={(status) => setForm((current) => ({ ...current, status }))}><label className="status-radio"><RadioGroupItem value="Active" />Active</label><label className="status-radio"><RadioGroupItem value="Inactive" />Inactive</label></RadioGroup></Field>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><Link to={mode === 'edit' ? `/employees/${id}` : '/employees'} className="button secondary">Cancel</Link><Button className="button primary" type="submit">{mode === 'edit' ? 'Save changes' : 'Add employee'}</Button></div>
    </Card>
  </>
}

function Field({ label, required, children }) {
  return <Label className="form-field"><span>{label}{required && <i> *</i>}</span>{children}</Label>
}
