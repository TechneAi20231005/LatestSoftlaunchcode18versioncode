import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import Steeper from './Steeper/Steeper';
import InterviewProcessDetails from './Steeper/steeperDetails/InterviewProcessDetails';
import JobOfferOnBoarding from './Steeper/steeperDetails/JobOfferOnBoarding';
import { getInterviewProcessDataThunk } from '../../../../../../../redux/services/hrms/employeeJoining/interviewProcess';
import { useCurrentInterviewStep } from '../../../../../../../hooks/hrms/employeeJoining';
import { RenderIf } from '../../../../../../../utils';

function InterviewProcess() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;
  const currentInterviewStep = useCurrentInterviewStep();

  // // life cycle
  useEffect(() => {
    dispatch(getInterviewProcessDataThunk({ currentId: currentCandidateId }));
  }, [currentCandidateId]);

  return (
    <>
      <Steeper />
      <RenderIf render={currentInterviewStep?.status !== 2}>
        <RenderIf
          render={
            currentInterviewStep?.application_status_id === 1 ||
            currentInterviewStep?.application_status_id === 2
          }
        >
          <InterviewProcessDetails />
        </RenderIf>
      </RenderIf>

      <RenderIf
        render={
          currentInterviewStep?.application_status_id !== 1 &&
          currentInterviewStep?.application_status_id !== 2
        }
      >
        <JobOfferOnBoarding />
      </RenderIf>
    </>
  );
}

export default InterviewProcess;
