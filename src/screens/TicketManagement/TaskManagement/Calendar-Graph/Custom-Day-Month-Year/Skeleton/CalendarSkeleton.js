import React from 'react';
import './Skeleton.css';

const CalendarSkeleton = () => {
  return (
    <div className="d-flex mt-3 w-100">
      {[...Array(7)].map((_, index) => (
        <div className="custom-col d-flex flex-column" key={index}>
          <div className="border d-flex pb-2 pt-1 mb-1 justify-content-between">
            <div className="px-1">
              <h4
                className="mb-4 px-4 skeleton-task skeleton-text rounded-3"
                style={{ width: '50px' }}
              >
                {' '}
              </h4>
              <p
                className="mb-0 skeleton-task skeleton-text rounded-3"
                style={{ width: '30px' }}
              ></p>
            </div>
            <div className="px-1">
              <p
                className="mb-0 skeleton-task skeleton-text rounded-3"
                style={{ width: '40px' }}
              ></p>
            </div>
          </div>
          {[...Array(6)].map((_, idx) => (
            <div className="calendar-card border px-2 py-2" key={idx}>
              <p className="mb-3 fw-bold skeleton-task skeleton-text rounded-pill"></p>
              <p className="mb-0 skeleton-task skeleton-text rounded-pill"></p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarSkeleton;
