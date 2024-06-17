import React from 'react';
import './Skeleton.css';

const WeekRangeSkeleton = () => {
  return (
    <div className="col-8 px-4 text-center">
      <div className="m-0 px-5 week-range skeleton-task skeleton-text rounded-3 "></div>
    </div>
  );
};

export default WeekRangeSkeleton;
