import React from "react";

function SearchFilter({ placeholder = "Search..." }) {
  return (
    <div className="filter-box">
      <input type="text" placeholder={placeholder} />
      <button>Search</button>
    </div>
  );
}

export default SearchFilter;