import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/audit', {
          params: { page: pagination.page, pageSize: pagination.pageSize },
        });
        setLogs(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        setError('Failed to fetch audit logs. You may not have permission to view this page.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [pagination.page, pagination.pageSize]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Audit Log</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4 overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.actor_userid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* Pagination controls can be added here */}
    </div>
  );
};

export default AuditLogPage;
