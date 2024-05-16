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
                  <div
                    className="skeleton skeleton-text mb-3"
                    style={{ width: "80%", height: "20px" }}
                  />
                  <div
                    className="skeleton skeleton-text mb-3"
                    style={{ width: "60%", height: "20px" }}
                  />
                  <div
                    className="skeleton skeleton-text mb-3"
                    style={{ width: "70%", height: "20px" }}
                  />
                  <div
                    className="skeleton skeleton-text"
                    style={{ width: "90%", height: "20px" }}
                  />
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
