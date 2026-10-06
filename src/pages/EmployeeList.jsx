import { useState } from "react";
import { ArrowUpRight, Download, Search } from "lucide-react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { downloadEmployeesCsv } from "./employeeUtils.js";

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
  const { employees = [], isLoading } = useOutletContext();
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

  if (isLoading) {
    return (
      <div className="employee-list-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PEOPLE OPERATIONS</p>
            <h1>Employees</h1>
          </div>
        </div>
        <section className="panel loading-state" role="status">
          Loading employees...
        </section>
      </div>
    );
  }

  return (
    <div className="employee-list-page">

      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">PEOPLE OPERATIONS</p>
          <h1>Employees</h1>
        </div>

        <div className="employee-actions">
          <button
            type="button"
            className="button secondary"
            onClick={() => downloadEmployeesCsv(employees)}
          >
            <Download size={10} />Export CSV
          </button>
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

            <input
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
            <select
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
            </select>
          </label>

          {/* DEPARTMENT FILTER */}
          <label className="department-select">
            <span className="sr-only">
              Filter department
            </span>

            <select
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
            </select>
          </label>

        </div>

        {/* EMPLOYEE TABLE */}
        <div className="table-scroll">

          <table className="employee-table">

            <thead>
              <tr>
                {renderSortableHeader("ID", "id")}
                {renderSortableHeader("Name", "name")}
                {renderSortableHeader("Email", "email")}
                {renderSortableHeader("Department", "department")}
                {renderSortableHeader("Status", "status")}
                <th>View</th>
              </tr>
            </thead>

            <tbody>

              {pageEmployees.map((employee) => (

                <tr key={employee.id}>

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

                  {/* DEPARTMENT */}
                  <td>
                    {employee.department || "—"}
                  </td>


                  {/* STATUS */}
                  <td>
                    {employee.status ? (
                      <span
                        className={`status ${employee.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {employee.status}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                

                  {/* VIEW */}
                  <td>
                    <Link
                      className="open-link"
                      to={`/employees/${employee.id}`}
                      aria-label={`View ${employee.name}`}
                      title={`View ${employee.name}`}
                    >
                      <ArrowUpRight size={17} />
                    </Link>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

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
          <button
            type="button"
            className="pagination-button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className="pagination-button"
                onClick={() => setPage(pageNumber)}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            type="button"
            className="pagination-button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </button>
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