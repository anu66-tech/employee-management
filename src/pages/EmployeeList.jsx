import { useState } from "react";
import { ArrowUpRight, Download, Ellipsis, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { downloadEmployeesCsv } from "./employeeUtils.js";
import { Badge } from "../components/ui/badge.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Select } from "../components/ui/select.jsx";
import { Table, TableBody, TableHeader, TableRow } from "../components/ui/table.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu.jsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog.jsx";
import { Tooltip } from "../components/ui/tooltip.jsx";
import { formatDate } from "./employeeUtils.js";

const PAGE_SIZE = 10;
const SORT_OPTIONS = {
  idAsc: { field: "id", direction: 1 },
  idDesc: { field: "id", direction: -1 },
  nameAsc: { field: "name", direction: 1 },
  nameDesc: { field: "name", direction: -1 },
  emailAsc: { field: "email", direction: 1 },
  emailDesc: { field: "email", direction: -1 },
  departmentAsc: { field: "department", direction: 1 },
  departmentDesc: { field: "department", direction: -1 },
  statusAsc: { field: "status", direction: 1 },
  statusDesc: { field: "status", direction: -1 },
  salaryAsc: { field: "salary", direction: 1 },
  salaryDesc: { field: "salary", direction: -1 },
  dateAsc: { field: "startDate", direction: 1 },
  dateDesc: { field: "startDate", direction: -1 },
};

export default function EmployeeList() {
  const { employees = [], deleteEmployee } = useOutletContext();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [sortOrder, setSortOrder] = useState("default");
  const [page, setPage] = useState(1);
  const statusFilter = searchParams.get("status")?.toLowerCase();

  // Get unique departments
  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ].sort();

  // Search + department filtering
  const filtered = employees.filter((employee) => {
    const searchText = `
      ${employee.name || ""}
      ${employee.email || ""}
      ${employee.role || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(query.toLowerCase());

    const matchesDepartment =
      department === "All departments" ||
      employee.department === department;
    const matchesStatus =
      !statusFilter || employee.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const selectedSort = SORT_OPTIONS[sortOrder];
  if (selectedSort) {
    filtered.sort((first, second) => {
      const firstValue = getSortValue(first, selectedSort.field);
      const secondValue = getSortValue(second, selectedSort.field);

      if (firstValue === null) return secondValue === null ? 0 : 1;
      if (secondValue === null) return -1;

      const comparison =
        typeof firstValue === "string"
          ? firstValue.localeCompare(secondValue, undefined, {
              sensitivity: "base",
              numeric: true,
            })
          : firstValue - secondValue;

      return comparison * selectedSort.direction;
    });
  }

  function sortByColumn(field) {
    const activeSort = SORT_OPTIONS[sortOrder];
    const direction =
      activeSort?.field === field && activeSort.direction === 1 ? -1 : 1;
    const option = Object.entries(SORT_OPTIONS).find(
      ([, sort]) => sort.field === field && sort.direction === direction
    );

    if (option) {
      setSortOrder(option[0]);
      setPage(1);
    }
  }

  function renderSortableHeader(label, field) {
    const activeSort = SORT_OPTIONS[sortOrder];
    const isActive = activeSort?.field === field;

    return (
      <th aria-sort={isActive ? (activeSort.direction === 1 ? "ascending" : "descending") : "none"}>
        <button
          type="button"
          className="sortable-header"
          onClick={() => sortByColumn(field)}
          aria-label={`Sort by ${label}${isActive ? (activeSort.direction === 1 ? ", ascending" : ", descending") : ""}`}
        >
          {label}
          {isActive && <span aria-hidden="true">{activeSort.direction === 1 ? " ↑" : " ↓"}</span>}
        </button>
      </th>
    );
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageEmployees = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const firstEmployee = filtered.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const lastEmployee = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <div className="employee-list-page">

      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">PEOPLE OPERATIONS</p>
          <h1>Employees</h1>
        </div>

        <div className="employee-actions">
          <Button
            variant="outline"
            onClick={() => downloadEmployeesCsv(employees)}
          >
            <Download size={10} />Export CSV
          </Button>
          <Link
            to="/employees/add"
            className="button primary"
          >
            + Add employee
          </Link>
        </div>
      </div>

      {/* MAIN PANEL */}
      <section className="panel directory-panel">

        {/* SEARCH + FILTER */}
        <div className="directory-tools">

          {/* SEARCH */}
          <label className="search-box">
            <Search size={17} />

            <Input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or role"
              aria-label="Search employees"
            />
          </label>

          {/* SORT ORDER */}
          <label className="department-select">
            <span className="sr-only">Sort employees</span>
            <Select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value);
                setPage(1);
              }}
              aria-label="Sort employees"
            >
              <option value="default">Order</option>
              <option value="nameAsc">Name A → Z</option>
              <option value="nameDesc">Name Z → A</option>
              <option value="emailAsc">Email A → Z</option>
              <option value="emailDesc">Email Z → A</option>
              <option value="departmentAsc">Department A → Z</option>
              <option value="departmentDesc">Department Z → A</option>
              <option value="statusAsc">Status A → Z</option>
              <option value="statusDesc">Status Z → A</option>
              <option value="idAsc">Employee ID Low → High</option>
              <option value="idDesc">Employee ID High → Low</option>
              <option value="salaryAsc">Salary Low → High</option>
              <option value="salaryDesc">Salary High → Low</option>
              <option value="dateAsc">Joining Date Old → New</option>
              <option value="dateDesc">Joining Date New → Old</option>
            </Select>
          </label>

          {/* DEPARTMENT FILTER */}
          <label className="department-select">
            <span className="sr-only">
              Filter department
            </span>

            <Select
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value)
                setPage(1);
              }}
            >
              <option value="All departments">
                All departments
              </option>

              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </label>

        </div>

        {/* EMPLOYEE TABLE */}
        <div className="table-scroll">

          <Table className="employee-table">

            <TableHeader>
              <TableRow>
                {renderSortableHeader("ID", "id")}
                {renderSortableHeader("Name", "name")}
                {renderSortableHeader("Email", "email")}
                <th>Phone</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Location</th>
                {renderSortableHeader("Joining date", "startDate")}
                <th>Salary</th>
                {renderSortableHeader("Status", "status")}
                <th>Actions</th>
              </TableRow>
            </TableHeader>

            <TableBody>

              {pageEmployees.map((employee) => (

                <TableRow key={employee.id}>

                  {/* ID */}
                  <td>
                    {employee.id}
                  </td>

                  {/* NAME */}
                  <td>
                    <Link
                      className="table-person"
                      to={`/employees/${employee.id}`}
                    >
                      <b>
                        {employee.name || "No name"}
                      </b>
                    </Link>
                  </td>

                  {/* EMAIL */}
                  <td>
                    {employee.email || "—"}
                  </td>

                  <td>{employee.phone || "—"}</td>
                  <td><Badge variant="outline">{employee.role || "—"}</Badge></td>

                  {/* DEPARTMENT */}
                  <td><Badge variant="secondary">{employee.department || "—"}</Badge></td>

                  <td>{employee.location || "—"}</td>
                  <td>{formatDate(employee.startDate)}</td>
                  <td>{employee.salary || "—"}</td>


                  {/* STATUS */}
                  <td>
                    {employee.status ? (
                      <Badge
                        variant={employee.status.toLowerCase() === "active" ? "success" : employee.status.toLowerCase().includes("leave") ? "warning" : "secondary"}
                        className={`status ${employee.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {employee.status}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>

                

                  <td className="employee-row-actions"><EmployeeActions employee={employee} onDelete={deleteEmployee} /><EmployeeDetailsDialog employee={employee} /></td>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>

        {/* NO RESULTS */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <b>No employees found</b>

            <span>
              Try changing the search or department filter.
            </span>
          </div>
        )}

        {/* TABLE FOOTER */}
        <div className="table-caption">
          Showing {firstEmployee}–{lastEmployee} of {filtered.length} employees
        </div>

        <nav className="pagination" aria-label="Employee list pages">
          <Button
            variant="outline"
            className="pagination-button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Button
                key={pageNumber}
                variant="outline"
                className="pagination-button"
                onClick={() => setPage(pageNumber)}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            )
          )}

          <Button
            variant="outline"
            className="pagination-button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </nav>

      </section>

    </div>
  );
}

function getSortValue(employee, field) {
  const value = employee[field];

  if (["name", "id", "email", "department", "status"].includes(field)) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }

  if (field === "salary") {
    if (value === null || value === undefined || value === "") return null;
    const normalizedSalary = String(value).replace(/[^0-9.-]/g, "");
    if (!normalizedSalary) return null;
    const salary = Number(normalizedSalary);
    return Number.isFinite(salary) ? salary : null;
  }

  if (field === "startDate") {
    if (!value) return null;
    const date = Date.parse(value);
    return Number.isFinite(date) ? date : null;
  }

  return null;
}

function EmployeeDetailsDialog({ employee }) {
  const personal = [
    ["Full name", employee.name], ["Email", employee.email], ["Phone", employee.phone], ["Location", employee.location],
  ];
  const employment = [
    ["Employee ID", employee.id], ["Designation", employee.role], ["Department", employee.department],
    ["Employment status", employee.status], ["Joining date", formatDate(employee.startDate)], ["Salary", employee.salary],
  ];
  return <Dialog>
    <Tooltip content={`View details for ${employee.name}`}>
      <DialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`View details for ${employee.name}`}><Eye size={16} /></Button></DialogTrigger>
    </Tooltip>
    <DialogContent className="employee-details-dialog">
      <DialogHeader><DialogTitle>{employee.name}</DialogTitle><DialogDescription>Complete employee record · {employee.id}</DialogDescription></DialogHeader>
      <Tabs defaultValue="personal" className="employee-detail-tabs">
        <TabsList><TabsTrigger value="personal">Personal information</TabsTrigger><TabsTrigger value="employment">Employment information</TabsTrigger></TabsList>
        <TabsContent value="personal"><div className="employee-detail-fields">{personal.map(([label, value]) => <DetailField key={label} label={label} value={value} />)}</div></TabsContent>
        <TabsContent value="employment"><div className="employee-detail-fields">{employment.map(([label, value]) => <DetailField key={label} label={label} value={value} />)}</div></TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
}

function DetailField({ label, value }) {
  return <div className="employee-detail-field"><span>{label}</span><strong>{value || "Not provided"}</strong></div>
}

function EmployeeActions({ employee, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  return <>
    <DropdownMenu>
      <Tooltip content={`More actions for ${employee.name}`}>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`More actions for ${employee.name}`}><Ellipsis size={17} /></Button></DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent>
        <DropdownMenuItem as={Link} to={`/employees/${employee.id}`}><ArrowUpRight size={14} />Open profile</DropdownMenuItem>
        <DropdownMenuItem as={Link} to={`/employees/edit/${employee.id}`}><Pencil size={14} />Edit employee</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="ui-dropdown-destructive" onClick={() => setConfirmOpen(true)}><Trash2 size={14} />Delete employee</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Delete {employee.name}?</AlertDialogTitle><AlertDialogDescription>This will remove this employee from your directory. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="button secondary">Cancel</AlertDialogCancel>
          <AlertDialogAction className="button danger" onClick={() => onDelete(employee.id)}>Delete employee</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
}
