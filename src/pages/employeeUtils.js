import { createElement } from 'react'

export function nextEmployeeId(employees) {
  const highestId = employees.reduce((highest, employee) => {
    const match = /^EMP(\d+)$/i.exec(employee.id ?? '')
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 0)

  return `EMP${String(highestId + 1).padStart(3, '0')}`
}

export function normalizeEmployeeIds(employees) {
  const usedIds = new Set()
  const prepared = employees.map((employee) => {
    const id = employee.id?.toUpperCase()
    if (id && /^EMP\d+$/.test(id) && !usedIds.has(id)) {
      usedIds.add(id)
      return { ...employee, id }
    }
    return { ...employee, id: '' }
  })

  let highestId = [...usedIds].reduce((highest, id) => {
    return Math.max(highest, Number(id.slice(3)))
  }, 0)

  return prepared.map((employee) => {
    if (employee.id) return employee

    let id
    do {
      highestId += 1
      id = `EMP${String(highestId).padStart(3, '0')}`
    } while (usedIds.has(id))

    usedIds.add(id)
    return { ...employee, id }
  })
}

export function Avatar({ name }) {
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  return createElement('span', { className: 'person-avatar', 'aria-hidden': 'true' }, initials)
}

export function formatDate(value) {
  return value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : '—'
}

export function downloadEmployeesCsv(employees) {
  const columns = [
    ['Employee ID', 'id'],
    ['Name', 'name'],
    ['Email', 'email'],
    ['Phone', 'phone'],
    ['Designation', 'role'],
    ['Department', 'department'],
    ['Joining Date', 'startDate'],
    ['Salary', 'salary'],
    ['Status', 'status'],
  ]
  const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [
    columns.map(([heading]) => escapeCsv(heading)).join(','),
    ...employees.map((employee) => columns.map(([, key]) => escapeCsv(employee[key])).join(',')),
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = 'employees.csv'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  downloadLink.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}