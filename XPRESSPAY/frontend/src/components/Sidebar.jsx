import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Employees', path: '/employees' },
  { name: 'Payroll', path: '/payroll' },
  { name: 'Meal Reports', path: '/meals' },
  { name: 'Company Info', path: '/company' },
  { name: 'Audit Log', path: '/audit' },
  { name: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-xl font-bold">
        XpressPay
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md ` +
              (isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white')
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
