import React from 'react';

function StepSkeleton({ stepsLength = 5 }) {
  return (
    <div className="step_skeleton_container">
      {[...new Array(stepsLength)].map((step, index) => (
        <div className="stepper_item" key={index}>
          <div className="step_counter">
            <div className="skeleton" />
          </div>
          <div className="step_name">
            <div className="skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StepSkeleton;
