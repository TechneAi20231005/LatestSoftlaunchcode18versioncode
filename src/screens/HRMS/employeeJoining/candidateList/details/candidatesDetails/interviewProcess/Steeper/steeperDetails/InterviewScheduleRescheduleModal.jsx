import React from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import { CustomInput } from '../../../../../../../../../components/custom/inputs/CustomInputs';
import CustomModal from '../../../../../../../../../components/custom/modal/CustomModal';
import { interviewScheduleRescheduleValidation } from './validation/interviewProcessValidation';
import { RenderIf } from '../../../../../../../../../utils';
import {
  getInterviewProcessDataThunk,
  scheduleRescheduleInterviewThunk,
} from '../../../../../../../../../redux/services/hrms/employeeJoining/interviewProcess';
import { useCurrentInterviewStep } from '../../../../../../../../../hooks/hrms/employeeJoining';

function InterviewScheduleRescheduleModal({ open, onClose }) {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;

  // // custom hooks call
  const currentInterviewStepData = useCurrentInterviewStep();

  // // redux state
  const { candidateDetailsData } = useSelector(state => state?.candidatesMaster);
  const { details } = candidateDetailsData;
  const { isLoading } = useSelector(state => state?.interViewProcess);

  // // function
  const handelScheduleReschedule = interviewData => {
    const apiData = {
      ...interviewData,
      interview_id: currentCandidateId,
      step_details_id: currentInterviewStepData?.step_details_id,
    };
    dispatch(
      scheduleRescheduleInterviewThunk({
        formData: apiData,
        onSuccessHandler: () => {
          dispatch(getInterviewProcessDataThunk({ currentId: currentCandidateId }));
          onClose();
        },
      }),
    );
  };

  return (
    <CustomModal show={open} title="Select Interview Slot" width="sm" onClose={onClose}>
      <Formik
        initialValues={{ date: '', time: '' }}
        enableReinitialize
        validationSchema={interviewScheduleRescheduleValidation}
        onSubmit={values => {
          handelScheduleReschedule(values);
        }}
      >
        {({ values, dirty }) => (
          <Form>
            <Row className="gap-3">
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="date"
                  type="date"
                  label="Interview date"
                  requiredField
                />
              </Col>
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="time"
                  type="time"
                  label="Interview time"
                  requiredField
                />
              </Col>
            </Row>
            <RenderIf render={dirty}>
              <Row className="mt-4">
                <Col sm={12}>
                  <p>
                    {console.log(values)}
                    Interview for {details?.full_name} candidates has been schedule on{' '}
                    <b>{values?.date}</b> at <b> {values?.time}</b>
                  </p>

                  <p className="fw-bold text-center">Do you want to send an invitation?</p>

                  <div className="d-flex justify-content-center mt-3 gap-2">
                    <button
                      className="btn btn-dark px-4"
                      type="submit"
                      disabled={isLoading?.scheduleRescheduleInterview}
                    >
                      {isLoading?.scheduleRescheduleInterview ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'Yes'
                      )}
                    </button>
                    <button onClick={onClose} className="btn btn-shadow-light px-3" type="button">
                      Cancel
                    </button>
                  </div>
                </Col>
              </Row>
            </RenderIf>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}

export default InterviewScheduleRescheduleModal;
