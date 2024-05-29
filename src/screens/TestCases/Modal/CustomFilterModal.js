import React, { useEffect, useState, useRef } from "react";

const CustomFilterModal = ({
  show,
  handleClose,
  handleApply,
  position,
  filterColumn,
  handleCheckboxChange,
  selectedFilters = [],
  handleSelectAll,
  uniqueValues,
  searchTerm,
  setSearchTerm,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (show && searchRef.current && !inputFocused) {
      searchRef.current.focus();
      setInputFocused(true);
    }
  }, [show, inputFocused]);

  const allSelected = uniqueValues.every((value) =>
    selectedFilters.includes(value)
  );
  const topClass = position.top ? `top-${position.top}` : "";
  const leftClass = position.left ? `left-${position.left}` : "";
  return (
    <div
      // className={`z-index-1050  ${topClass} ${leftClass} `}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 1050,
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        // width: "300px",
      }}
    >
      <div>
        <div className="w-100">
          <input
            type="text"
            // id="search"
            ref={searchRef}
            placeholder="Search Here"
            // name="search"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="filterAll"
            name="filterAll"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e, uniqueValues)}
          />
          <label
            style={{ marginLeft: "5px" }}
            className="mt-2"
            htmlFor="filterAll"
          >
            Select All
          </label>
        </div>
        {uniqueValues.map((value, index) => (
          <div key={index} className="mx-3">
            <input
              type="checkbox"
              id={`filter${index}`}
              name={`filter${index}`}
              checked={selectedFilters.includes(value)}
              onChange={(e) => handleCheckboxChange(e, value)}
            />
            <label style={{ marginLeft: "5px" }} htmlFor={`filter${index}`}>
              {value}
            </label>
          </div>
        ))}
        <button className="btn btn-primary mt-3" onClick={handleApply}>
          Apply
        </button>
        <button className="btn btn-warning mt-3" onClick={handleClose}>
          Cancel
        </button>
        <button
          className="btn btn-shadow-light px-3 mt-3"
          onClick={handleClose}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CustomFilterModal;
