import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EmployeeListPage from './pages/EmployeeListPage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import SettingsPage from './pages/SettingsPage';
import AuditLogPage from './pages/AuditLogPage';
import MealReportsPage from './pages/MealReportsPage';
import PayrollPage from './pages/PayrollPage';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's a user, render the Layout which contains the Outlet for nested routes
  // Otherwise, navigate to the login page
  return user ? <Layout /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        {/* All authenticated routes are children of this route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/company" element={<CompanyInfoPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/audit" element={<AuditLogPage />} />
        <Route path="/meals" element={<MealReportsPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        {/*
          Example for other routes:
        */}
      </Route>
    </Routes>
  );
}

export default App;
