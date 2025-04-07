import React, { useState } from 'react';
import axios from 'axios';

const UploadCSVPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/threats/upload_csv/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message + ` (${response.data.filename})`);
      setError('');
    } catch (err) {
      console.error(err);
      setMessage('');
      setError(err.response?.data?.detail || 'Upload failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload CSV</h2>

      <p><strong>Instructions:</strong></p>
      <ul>
        <li>The file must be in <code>.csv</code> format.</li>
        <li>The following columns are required: <code>title</code>, <code>description</code>, <code>severity</code>, <code>type</code>, <code>location</code>, <code>date</code>.</li>
        <li>The <code>date</code> must be in ISO format (e.g., <code>2025-04-06T15:30:00</code>).</li>
        <li>Ensure there are no empty rows or missing column headers.</li>
      </ul>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>Upload</button>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default UploadCSVPage;