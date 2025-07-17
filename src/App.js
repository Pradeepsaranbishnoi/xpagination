import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const EMPLOYEES_PER_PAGE = 10;

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        alert("failed to fetch data");
      });
  }, []);

  const totalPages = Math.ceil(employees.length / EMPLOYEES_PER_PAGE);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const currentEmployees = employees.slice(
    startIndex,
    startIndex + EMPLOYEES_PER_PAGE
  );

  // Don't render anything if still loading
  if (loading) {
    return <div className="container"><p>Loading data...</p></div>;
  }

  return (
    <div className="container">
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
          <tbody data-testid="employee-table-body">
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
        !error && <p>No data available</p>
      )}

      {/* Only show pagination when we have data */}
      {employees.length > 0 && (
        <div className="pagination">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            data-testid="previous-btn"
          >
            Previous
          </button>
          <span>
            {currentPage}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            data-testid="next-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
