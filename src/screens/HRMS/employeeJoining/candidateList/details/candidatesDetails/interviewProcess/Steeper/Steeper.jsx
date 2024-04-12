import React from 'react';
import './style.scss';
function Steeper() {
  const stepData = {
    details: {
      id: 2,
    },
    step_details: [
      {
        id: 1,
        stepTitle: 'Application Submitted',
        status: 'completed',
      },
      { id: 2, stepTitle: 'Interview', status: '' },
      {
        id: 3,
        stepTitle: 'HOD Interview',
        status: '',
      },
      {
        id: 4,
        stepTitle: 'Directer Interview',
        status: '',
      },
      {
        id: 5,
        stepTitle: 'Job Offer',
        status: '',
      },
      {
        id: 6,
        stepTitle: 'Onboarding',
        status: '',
      },
    ],
  };
  return (
    <div className="stepper_wrapper">
      {stepData?.step_details?.map((step, index) => (
        <div
          className={`stepper_item ${
            step?.id === stepData?.details?.id && step?.status === 'completed'
              ? 'complete_active'
              : step?.status === 'completed'
              ? 'completed'
              : step?.status === 'rejected'
              ? 'rejected'
              : step?.id === stepData?.details?.id
              ? 'active'
              : ''
          }   `}
          // className="stepper_item completed"
        >
          <div className="step_counter">
            {step?.status === 'completed' ? (
              <i className="icofont-check" />
            ) : step?.status === 'rejected' ? (
              // <i className="icofont-error" />
              <span>&#10006;</span>
            ) : step?.id === stepData?.details?.id ? (
              <i className="icofont-sand-clock" />
            ) : (
              ''
            )}
          </div>
          <p className="text-center step_name">{step?.stepTitle}</p>
        </div>
      ))}
    </div>
  );
}

export default Steeper;
