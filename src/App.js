import React, { useEffect, useState } from "react";
import './App.css';
const App = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const EMPLOYEES_PER_PAGE = 10;

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setEmployees(data))
      .catch((error) => {
        setError(error.message);
        alert("failed to fetch data");
      });
  }, []);

  const totalPages = Math.ceil(employees.length / EMPLOYEES_PER_PAGE);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const currentEmployees = employees.slice(
    startIndex,
    startIndex + EMPLOYEES_PER_PAGE
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee List</h2>

      {employees.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>Loading data...</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
