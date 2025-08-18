import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MealReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/meals', {
          params: { page: pagination.page, pageSize: pagination.pageSize },
        });
        setReports(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        setError('Failed to fetch meal reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [pagination.page, pagination.pageSize]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Meal Reports</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4 overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Meals</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={`${report.userid}-${report.period_start}`}>
                <td className="px-6 py-4 whitespace-nowrap">{report.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.total_meals}</td>
                <td className="px-6 py-4 whitespace-nowrap">${parseFloat(report.total_meal_cost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* Pagination controls can be added here */}
    </div>
  );
};

export default MealReportsPage;
