import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';

// // static import
import {
  CustomDropdown,
  CustomInput,
} from '../../../../../../../../../components/custom/inputs/CustomInputs';
import { getRemarkMasterListThunk } from '../../../../../../../../../redux/services/hrms/employeeJoining/remarkMaster';
import { interViewProcessValidation } from './validation/interviewProcessValidation';
import { RenderIf } from '../../../../../../../../../utils';
import InterviewScheduleRescheduleModal from './InterviewScheduleRescheduleModal';
import InterviewLinkSendModal from './InterviewLinkSendModal';
import { useCurrentInterviewStep } from '../../../../../../../../../hooks/hrms/employeeJoining';
import {
  getInterviewProcessDataThunk,
  updateInterviewProcessThunk,
} from '../../../../../../../../../redux/services/hrms/employeeJoining/interviewProcess';

function InterviewProcessDetails() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;
  const currentInterviewStepData = useCurrentInterviewStep();

  // // redux state
  const { remarkMasterList, isLoading: remarkMasterListLoading } = useSelector(
    state => state?.remarkMaster,
  );
  const { isLoading } = useSelector(state => state?.interViewProcess);

  // // local state
  const [showScheduleBtn, setShowScheduleBtn] = useState(false);
  const [openInterviewScheduleModal, setOpenInterviewScheduleModal] = useState(false);
  const [openInterviewLinkModal, setOpenInterviewLinkModal] = useState(false);
  const [clickFor, setClickFor] = useState('');

  // // dropdown data
  const remarkType = [
    ...remarkMasterList?.map(item => ({ label: item?.remark, value: item?.id })),
    { label: 'Other', value: 0 },
  ];

  // // function
  const handelProceedReject = formData => {
    const apiData = {
      ...formData,
      interview_id: currentCandidateId,
      application_status_id: currentInterviewStepData?.application_status_id,
      is_reject: clickFor === 'PROCEED' ? 'N' : 'Y',
    };

    if (currentInterviewStepData?.application_status_id === 2) {
      apiData.step_details_id = currentInterviewStepData?.step_details_id;
    }

    dispatch(
      updateInterviewProcessThunk({
        formData: apiData,
        onSuccessHandler: () => {
          dispatch(getInterviewProcessDataThunk({ currentId: currentCandidateId }));
        },
      }),
    );
  };

  useEffect(() => {
    if (!remarkMasterList?.length) {
      dispatch(getRemarkMasterListThunk());
    }
  }, [remarkMasterList]);

  useEffect(() => {
    if (
      currentInterviewStepData?.application_status_id !== 1 ||
      currentInterviewStepData?.application_status_id !== 2 ||
      currentInterviewStepData?.application_status_id !== 3
    ) {
      setShowScheduleBtn(false);
    }
  }, [currentInterviewStepData]);

  return (
    <>
      <Container fluid>
        <RenderIf render={showScheduleBtn}>
          <button
            type="button"
            className="btn btn-dark mb-4"
            onClick={() => setOpenInterviewScheduleModal(true)}
          >
            Schedule Interview
          </button>
        </RenderIf>
        <Formik
          initialValues={{ remark_id: '', other_remark: '' }}
          enableReinitialize
          validationSchema={interViewProcessValidation}
          onSubmit={values => {
            handelProceedReject(values);
          }}
        >
          {({ values }) => (
            <Form className="employee_joining_details_container px-3">
              <h5 className="mb-0 text-primary">Add Remark</h5>
              <hr className="primary_divider mt-1" />
              <Row>
                <Col sm={12}>
                  <Field
                    component={CustomDropdown}
                    data={remarkType}
                    name="remark_id"
                    label="Remark Title"
                    placeholder={
                      remarkMasterListLoading?.getRemarkMasterList ? 'Loading...' : 'Select'
                    }
                    requiredField
                  />
                </Col>
                <RenderIf render={parseInt(values?.remark_id) === 0}>
                  <Col sm={12}>
                    <Field
                      component={CustomInput}
                      name="other_remark"
                      label="Specify Other"
                      placeholder="Enter remark"
                      styleData="mt-3"
                      requiredField
                    />
                  </Col>
                </RenderIf>
              </Row>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={isLoading?.updateInterviewProcess}
                  onClick={() => setClickFor('PROCEED')}
                >
                  {isLoading?.updateInterviewProcess ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Proceed'
                  )}
                </button>
                <button
                  className="btn btn-danger text-light px-3"
                  type="submit"
                  onClick={() => setClickFor('REJECT')}
                >
                  Reject
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Container>

      <InterviewScheduleRescheduleModal
        open={openInterviewScheduleModal}
        onClose={() => setOpenInterviewScheduleModal(false)}
      />
      <InterviewLinkSendModal
        open={openInterviewLinkModal}
        close={() => setOpenInterviewLinkModal(false)}
      />
    </>
  );
}

export default InterviewProcessDetails;
