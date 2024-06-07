import React from "react";

function CardLoadingSkeleton({ rowCount = 3 }) {
  return (
    <div className="container">
      {[...new Array(rowCount)].map((_, rowIndex) => (
        <div key={rowIndex} className="row mb-4">
          {[...new Array(3)].map((_, colIndex) => (
            <div key={colIndex} className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="skeleton skeleton-text mb-3 w-80"></div>
                  <div className="skeleton skeleton-text mb-3 w-60"></div>
                  <div className="skeleton skeleton-text mb-3 w-70"></div>
                  <div className="skeleton skeleton-text w-90"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CardLoadingSkeleton;
