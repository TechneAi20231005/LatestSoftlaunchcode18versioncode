import React, { useEffect, useState } from 'react';
import { Col, Collapse, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';

// // static import
import {
  CustomReactSelect,
  CustomInput
} from '../../../../../../../../../components/custom/inputs/CustomInputs';
import { interViewProcessValidation } from './validation/interviewProcessValidation';
import { RenderIf } from '../../../../../../../../../utils';
import InterviewScheduleRescheduleModal from './InterviewScheduleRescheduleModal';
import InterviewLinkSendModal from './InterviewLinkSendModal';
import { useCurrentInterviewStep } from '../../../../../../../../../hooks/hrms/employeeJoining';
import {
  getInterviewProcessDataThunk,
  updateInterviewProcessThunk
} from '../../../../../../../../../redux/services/hrms/employeeJoining/interviewProcess';
import useDropdownData from '../../../../../../../../../hooks/useDropdownData';
import './style.scss';

function InterviewProcessDetails() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;
  const currentInterviewStepData = useCurrentInterviewStep();

  // // redux state
  const { isLoading } = useSelector((state) => state?.interViewProcess);

  // // local state
  const [showScheduleBtn, setShowScheduleBtn] = useState(false);
  const [openInterviewScheduleModal, setOpenInterviewScheduleModal] =
    useState(false);
  const [openInterviewLinkModal, setOpenInterviewLinkModal] = useState(false);
  const [clickFor, setClickFor] = useState('');

  // // dropdown data
  const { remarkDropdown, remarkDropdownLoading } = useDropdownData({
    render: true
  });

  // // function
  const handelProceedReject = ({ formData, resetFunc }) => {
    const apiData = {
      ...formData,
      interview_id: currentCandidateId,
      application_status_id: currentInterviewStepData?.application_status_id,
      is_reject: clickFor === 'PROCEED' ? 'N' : 'Y'
    };

    if (currentInterviewStepData?.application_status_id === 2) {
      apiData.step_details_id = currentInterviewStepData?.step_details_id;
    }

    dispatch(
      updateInterviewProcessThunk({
        formData: apiData,
        currentId: currentCandidateId,
        onSuccessHandler: () => {
          dispatch(
            getInterviewProcessDataThunk({ currentId: currentCandidateId })
          );
          resetFunc();
        }
      })
    );
  };

  useEffect(() => {
    if (currentInterviewStepData?.application_status_id === 2) {
      setShowScheduleBtn(true);
    } else {
      setShowScheduleBtn(false);
    }
  }, [currentInterviewStepData]);

  return (
    <>
      <>
        <RenderIf render={showScheduleBtn}>
          <RenderIf render={currentInterviewStepData?.scheduled_datetime}>
            <p className="mb-0">Interview schedule at</p>
          </RenderIf>
          <div className="d-flex align-items-center gap-2 mb-4">
            <RenderIf render={currentInterviewStepData?.scheduled_datetime}>
              <p className="mb-0 interview_schedule_rescheduled">
                {new Date(
                  currentInterviewStepData?.scheduled_datetime
                )?.toLocaleString()}
              </p>
            </RenderIf>

            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setOpenInterviewScheduleModal(true)}
            >
              {currentInterviewStepData?.scheduled_datetime
                ? 'Reschedule Interview'
                : 'Schedule Interview'}
            </button>
          </div>
        </RenderIf>
        <Formik
          initialValues={{ remark_id: '', other_remark: '' }}
          enableReinitialize
          validationSchema={interViewProcessValidation}
          onSubmit={(values, { resetForm }) => {
            handelProceedReject({ formData: values, resetFunc: resetForm });
          }}
        >
          {({ values }) => (
            <Form className="employee_joining_details_container px-3">
              <h5 className="mb-0 text-primary">Add Remark</h5>
              <hr className="primary_divider mt-1" />
              <Row>
                <Col sm={12}>
                  <Field
                    component={CustomReactSelect}
                    options={remarkDropdown}
                    name="remark_id"
                    label="Remark Title"
                    placeholder={
                      remarkDropdownLoading ? 'Loading...' : 'Select'
                    }
                    requiredField
                  />
                </Col>
                <Collapse in={parseInt(values?.remark_id) === 0}>
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
                </Collapse>
              </Row>

              <div className="d-flex justify-content-sm-end gap-2 mt-3 btn_container">
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
      </>

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
