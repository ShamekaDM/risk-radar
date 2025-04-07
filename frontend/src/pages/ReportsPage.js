import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [reportDates, setReportDates] = useState([]);
  const [error, setError] = useState(null);

  const fetchReportLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/threats/report_logs/');
      setReportDates(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching report logs:", err);
      setError("Failed to fetch report logs");
    }
  };

  useEffect(() => {
    fetchReportLogs();
  }, []);

  const handleExportPDF = async () => {
    try {
      const response = await axios.get('http://localhost:8000/threats/export/pdf', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.href = url;
      link.setAttribute('download', `threat_report_${timestamp}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      fetchReportLogs(); // Refresh logs after export
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Failed to export PDF");
    }
  };

  const handleClearLogs = async () => {
    try {
      await axios.delete('http://localhost:8000/threats/report_logs/');
      setReportDates([]);
      setError(null);
    } catch (err) {
      console.error("Error clearing logs:", err);
      setError("Failed to clear logs");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reports</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <button onClick={handleExportPDF}>Export PDF Report</button>
        <button onClick={handleClearLogs}>Clear Logs</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reportDates.length > 0 && (
        <div>
          <h4>Generated Reports:</h4>
          <ul>
            {reportDates.map((date, index) => (
              <li key={index}>{new Date(date).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;