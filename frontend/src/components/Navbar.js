import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #ccc',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    }}>
      <h1>Risk Radar</h1>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/add-threat">Add Threat</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/upload-csv">Upload CSV</Link></li>
        <li><Link to="/clusters">Threat Map</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
