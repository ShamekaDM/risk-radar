import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Risk Radar</h1>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/add-threat">Add Threat</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
