import React from 'react';

// Assuming you have the CSS for the skeleton

function DropdownLoadingSkeleton({ optionCount = 5 }) {
  return (
    <div className="dropdown-skeleton">
      <div className="skeleton skeleton-dropdown" />
      <ul className="skeleton-options">
        {[...new Array(optionCount)].map((_, index) => (
          <li key={index} className="skeleton skeleton-option" />
        ))}
      </ul>
    </div>
  );
}

export default DropdownLoadingSkeleton;
