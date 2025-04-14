import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddThreat from './pages/AddThreat';
import Settings from './pages/Settings';
import ReportsPage from './pages/ReportsPage';
import Navbar from './components/Navbar';
import UploadCSVPage from './pages/UploadCSVPage';
import ThreatClusters from './pages/ThreatClusters';
import ThreatMap from './components/ThreatMap';
//import ThreatMapPage from "./pages/ThreatMapPage";



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
        <Route path="/map" element={<ThreatMap />} />
       
      </Routes>
    </Router>
  );
}

export default App;


//<Route path="/" element={<ThreatMapPage />} />
// 