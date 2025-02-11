import React from "react";

function Filter({ onFilter }) {
  return (
    <select onChange={(e) => onFilter(e.target.value)}>
      <option value="All">All</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  );
}

export default Filter;
