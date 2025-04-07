import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddThreat from './pages/AddThreat';
import Settings from './pages/Settings';
import ReportsPage from './pages/ReportsPage';
import Navbar from './components/Navbar';
import UploadCSVPage from './pages/UploadCSVPage';
import ThreatClusters from './pages/ThreatClusters';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/add-threat" element={<AddThreat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/upload-csv" element={<UploadCSVPage />} />
        <Route path="/clusters" element={<ThreatClusters />} />
      </Routes>
    </Router>
  );
}

export default App;
