import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/employees', {
          params: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            search: search,
          },
        });
        setEmployees(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        setError('Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [pagination.page, pagination.pageSize, search]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
      {/* Search and filter controls will go here */}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.userid}>
                <td className="px-6 py-4 whitespace-nowrap">{emp.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.designation}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.pay_rate} ({emp.pay_type})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls will go here */}
    </div>
  );
};

export default EmployeeListPage;
