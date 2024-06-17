import React from 'react';
import './Skeleton.css';

const TaskSkeleton = () => {
  return (
    <div
      className="px-3 py-4 mt-2 d-flex align-items-center justify-content-between rounded daily_task_data"
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <div className="col-6 d-flex align-items-center gap-3">
        <h5 className="col-3 mb-0 fw-bold skeleton-task skeleton-text rounded-pill"></h5>
        <h5 className="col-3 mb-0 fw-bold skeleton-task skeleton-text rounded-pill"></h5>
        <div className="col-6">
          <p className="mb-0 fw-bold skeleton-task skeleton-text rounded-pill"></p>
          {/* <span className="me-3 w-25 skeleton-task skeleton-text"></span>
          <span className="skeleton-task w-25 skeleton-text"></span> */}
        </div>
      </div>
      <div className="col-6 d-flex align-items-center justify-content-end text-end">
        <div className="col-9 d-flex gap-2 me-4 justify-content-end">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-task skeleton-circle"></div>
          ))}
        </div>
        <h5 className="col-3 mb-0 skeleton-task skeleton-text rounded-pill"></h5>
      </div>
    </div>
  );
};

export default TaskSkeleton;
