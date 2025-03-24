import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Filter({ onSeverityFilter, onTypeFilter, onLocationFilter, onDateRange }) {
  // Define start and end dates
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRange(start, end); // Pass the selected range to the parent component
    };


  return (
    <div className="filter-container">
      <select onChange={(e) => onSeverityFilter(e.target.value)}>
        <option value="All">All Severities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select onChange={(e) => onTypeFilter(e.target.value)}>
        <option value="All">All Types</option>
        <option value="Data Leak">Data Leak</option>
        <option value="Denial of Service">Denial of Service</option>
        <option value="Exploit">Exploit</option>
        <option value="Injection">Injection</option>
        <option value="Malware">Malware</option>
        <option value="Network Anomaly">Network Anomaly</option>
        <option value="Phishing">Phishing</option>
        <option value="Ransomware">Ransomware</option>
        <option value="Unauthorized Access">Unauthorized Access</option>
        {/* Add more threat types as needed */}
      </select>

      <select onChange={(e) => onLocationFilter(e.target.value)}>
  <option value="All">All Locations</option>
  <option value="Alabama">Alabama</option>
  <option value="Alaska">Alaska</option>
  <option value="Arizona">Arizona</option>
  <option value="Arkansas">Arkansas</option>
  <option value="California">California</option>
  <option value="Colorado">Colorado</option>
  <option value="Connecticut">Connecticut</option>
  <option value="Delaware">Delaware</option>
  <option value="Florida">Florida</option>
  <option value="Georgia">Georgia</option>
  <option value="Hawaii">Hawaii</option>
  <option value="Idaho">Idaho</option>
  <option value="Illinois">Illinois</option>
  <option value="Indiana">Indiana</option>
  <option value="Iowa">Iowa</option>
  <option value="Kansas">Kansas</option>
  <option value="Kentucky">Kentucky</option>
  <option value="Louisiana">Louisiana</option>
  <option value="Maine">Maine</option>
  <option value="Maryland">Maryland</option>
  <option value="Massachusetts">Massachusetts</option>
  <option value="Michigan">Michigan</option>
  <option value="Minnesota">Minnesota</option>
  <option value="Mississippi">Mississippi</option>
  <option value="Missouri">Missouri</option>
  <option value="Montana">Montana</option>
  <option value="Nebraska">Nebraska</option>
  <option value="Nevada">Nevada</option>
  <option value="New Hampshire">New Hampshire</option>
  <option value="New Jersey">New Jersey</option>
  <option value="New Mexico">New Mexico</option>
  <option value="New York">New York</option>
  <option value="North Carolina">North Carolina</option>
  <option value="North Dakota">North Dakota</option>
  <option value="Ohio">Ohio</option>
  <option value="Oklahoma">Oklahoma</option>
  <option value="Oregon">Oregon</option>
  <option value="Pennsylvania">Pennsylvania</option>
  <option value="Rhode Island">Rhode Island</option>
  <option value="South Carolina">South Carolina</option>
  <option value="South Dakota">South Dakota</option>
  <option value="Tennessee">Tennessee</option>
  <option value="Texas">Texas</option>
  <option value="Utah">Utah</option>
  <option value="Vermont">Vermont</option>
  <option value="Virginia">Virginia</option>
  <option value="Washington">Washington</option>
  <option value="West Virginia">West Virginia</option>
  <option value="Wisconsin">Wisconsin</option>
  <option value="Wyoming">Wyoming</option>
</select>

    </div>
  );
}

export default Filter;