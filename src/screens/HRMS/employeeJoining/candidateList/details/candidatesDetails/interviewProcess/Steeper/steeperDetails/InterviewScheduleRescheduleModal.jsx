import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

// // static import
import { CustomInput } from '../../../../../../../../../components/custom/inputs/CustomInputs';
import CustomModal from '../../../../../../../../../components/custom/modal/CustomModal';
import { selectInterViewSlotValidation } from './validation/interviewProcessValidation';
import { RenderIf } from '../../../../../../../../../utils';

function InterviewScheduleRescheduleModal({ open, onClose }) {
  // // redux state
  const { candidateDetailsData, isLoading } = useSelector(state => state?.candidatesMaster);
  const { details } = candidateDetailsData;

  return (
    <CustomModal show={open} title="Select Interview Slot" width="sm" onClose={onClose}>
      <Formik
        initialValues={{ interview_date: '', interview_time: '' }}
        enableReinitialize
        validationSchema={selectInterViewSlotValidation}
        onSubmit={values => {}}
      >
        {({ values, dirty }) => (
          <Form>
            <Row className="gap-3">
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="interview_date"
                  type="date"
                  label="Interview date"
                  requiredField
                />
              </Col>
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="interview_time"
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
                    Interview for {details?.full_name} candidates has been schedule on{' '}
                    <b>{values?.interview_date}</b> at <b> {values?.interview_time}</b>
                  </p>

                  <p className="fw-bold text-center">Do you want to send an invitation?</p>

                  <div className="d-flex justify-content-center mt-3 gap-2">
                    <button className="btn btn-dark px-4" type="submit">
                      Yes
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
