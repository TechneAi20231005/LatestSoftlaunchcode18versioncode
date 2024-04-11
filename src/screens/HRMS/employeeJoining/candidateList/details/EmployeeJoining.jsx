import React, { memo, useState } from 'react';
import { Container } from 'react-bootstrap';

// // static import
import PageHeader from '../../../../../components/Common/PageHeader';
import CustomTab from '../../../../../components/custom/tabs/CustomTab';
import { RenderIf } from '../../../../../utils';
import CandidatesDetails from './candidatesDetails/CandidatesDetails';
import RemarkHistory from './remarkHistory/RemarkHistory';
import InterviewScheduleHistory from './interviewScheduleHistory/InterviewScheduleHistory';
import FollowUp from './followUp/FollowUp';
import './style.scss';

function EmployeeJoining() {
  const [currentTab, setCurrentTab] = useState('candidates_details');
  const tabsLabel = [
    {
      label: 'Candidates Details',
      value: 'candidates_details',
    },
    { label: 'Interview Process', value: 'interviews_process' },
    { label: 'Follow-up', value: 'follow_up' },
    { label: 'Remark History', value: 'remark_history' },
    { label: 'Interview Schedule History', value: 'interviews_schedule_history' },
  ];
  return (
    <Container>
      <PageHeader
        headerTitle={
          <>
            Employee Joining
            <span className="fs-6 text-black opacity-50 ml-1">&nbsp; #{Math.random()}</span>
          </>
        }
      />
      <div className="mt-3">
        <CustomTab tabsData={tabsLabel} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>
      <RenderIf render={currentTab === 'candidates_details'}>
        <CandidatesDetails />
      </RenderIf>
      <RenderIf render={currentTab === 'follow_up'}>
        <FollowUp />
      </RenderIf>
      <RenderIf render={currentTab === 'remark_history'}>
        <RemarkHistory />
      </RenderIf>
      <RenderIf render={currentTab === 'interviews_schedule_history'}>
        <InterviewScheduleHistory />
      </RenderIf>
    </Container>
  );
}

export default memo(EmployeeJoining);