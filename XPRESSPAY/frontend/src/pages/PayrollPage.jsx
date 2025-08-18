import React, { useState, useEffect } from 'react';
import axios from 'axios';

// In a real app, these would be separate component files
const PayrollPeriodList = ({ onSelectPeriod }) => {
  const [periods, setPeriods] = useState([]);
  useEffect(() => {
    axios.get('/api/payroll/periods').then(res => setPeriods(res.data));
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Payroll Periods</h2>
      <ul>
        {periods.map(p => (
          <li key={p.id} onClick={() => onSelectPeriod(p.id)} className="cursor-pointer hover:bg-gray-100 p-2 rounded">
            {p.period_name} ({new Date(p.date_start).toLocaleDateString()} - {new Date(p.date_end).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

const PayrollRunList = ({ periodId }) => {
  const [runs, setRuns] = useState([]);
  useEffect(() => {
    if (periodId) {
      axios.get(`/api/payroll/periods/${periodId}/runs`).then(res => setRuns(res.data));
    }
  }, [periodId]);

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Payroll Runs</h2>
      {runs.length === 0 && <p>No runs for this period.</p>}
      <ul>
        {runs.map(r => (
          <li key={r.id}>Run on {new Date(r.created_at).toLocaleString()} - Status: {r.status}</li>
        ))}
      </ul>
    </div>
  );
};


const PayrollPage = () => {
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="md:col-span-1">
          <PayrollPeriodList onSelectPeriod={setSelectedPeriodId} />
        </div>
        <div className="md:col-span-2">
          {selectedPeriodId ? (
            <PayrollRunList periodId={selectedPeriodId} />
          ) : (
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <p>Select a period to see the payroll runs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
