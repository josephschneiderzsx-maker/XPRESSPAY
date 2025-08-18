import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyInfoPage = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/company');
        setInfo(res.data);
      } catch (err) {
        setError('Failed to fetch company information.');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Company Information</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {info && (
        <div className="mt-4 p-6 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold">{info.company_name}</h2>
              <p className="text-gray-600">{info.Address1}</p>
              <p className="text-gray-600">{info.Address2}</p>
              <p className="text-gray-600">{info.City}, {info.State} {info.Zip}</p>
              <p className="text-gray-600">{info.Country}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>Email: {info.Email}</p>
              <p>Phone: {info.phone}</p>
              <p>Fax: {info.fax}</p>
            </div>
            <div>
              <h3 className="font-semibold">Timezone</h3>
              <p>{info.timezone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoPage;
