import React from 'react';
import { useSelector } from 'react-redux';

import './style.scss';
function Steeper() {
  // // redux state
  const { interviewProcessData, isLoading } = useSelector(state => state?.interViewProcess);

  return (
    <div className="stepper_wrapper">
      {interviewProcessData?.details?.map(stepData => (
        <div
          key={Math.random()}
          className={`stepper_item ${
            interviewProcessData?.application_status === 2
              ? stepData?.status === 1
                ? 'completed'
                : stepData?.status === 2
                ? 'rejected'
                : interviewProcessData?.step_details_id === stepData?.step_details_id
                ? 'active'
                : ''
              : interviewProcessData?.application_status === stepData?.application_status_id &&
                stepData?.status === 1
              ? 'complete_active'
              : stepData?.status === 1
              ? 'completed'
              : stepData?.status === 2
              ? 'rejected'
              : interviewProcessData?.application_status === stepData?.application_status_id
              ? 'active'
              : ''
          }   `}
        >
          <div className="step_counter">
            {stepData?.status === 1 ? (
              <i className="icofont-check" />
            ) : stepData?.status === 2 ? (
              <span>&#10006;</span>
            ) : interviewProcessData?.application_status === 2 ? (
              interviewProcessData?.step_details_id === stepData?.step_details_id ? (
                <i className="icofont-sand-clock" />
              ) : (
                ''
              )
            ) : interviewProcessData?.application_status === stepData?.application_status_id ? (
              <i className="icofont-sand-clock" />
            ) : (
              ''
            )}
          </div>
          <p className="text-center step_name">{stepData?.step_title}</p>
        </div>
      ))}
    </div>
  );
}

export default Steeper;
