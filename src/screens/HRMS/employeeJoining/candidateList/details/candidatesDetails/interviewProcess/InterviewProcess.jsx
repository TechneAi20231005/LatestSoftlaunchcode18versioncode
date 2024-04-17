import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import Steeper from './Steeper/Steeper';
import InterviewProcessDetails from './Steeper/steeperDetails/InterviewProcessDetails';
import JobOffer from './Steeper/steeperDetails/JobOffer';
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
      <RenderIf
        render={
          currentInterviewStep?.application_status !== 2 ||
          currentInterviewStep?.application_status !== 3
        }
      >
        <InterviewProcessDetails />
      </RenderIf>
      <RenderIf
        render={
          currentInterviewStep?.application_status === 2 ||
          currentInterviewStep?.application_status === 3
        }
      >
        <JobOffer />
      </RenderIf>
    </>
  );
}

export default InterviewProcess;
