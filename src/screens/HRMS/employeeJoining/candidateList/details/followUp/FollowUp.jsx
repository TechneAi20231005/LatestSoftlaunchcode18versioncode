import React, { useRef } from 'react';
import { Field, Form, Formik } from 'formik';
import { Stack, Col, Row, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import {
  CustomInput,
  CustomTextArea,
} from '../../../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../../../utils';
import FollowUpHistory from './FollowUpHistory';
import { addFollowValidation } from './validation/addFollowValidation';
import {
  addFollowUpThunk,
  getFollowUpListThunk,
} from '../../../../../../redux/services/hrms/employeeJoining/followUp';

function FollowUp() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;
  const attachmentFileRef = useRef();

  const followUpInitialValue = {
    add_follow_up: '',
    next_follow_up_date: '',
    attachment_file: '',
  };
  // // // redux state
  const { isLoading } = useSelector(state => state?.candidatesFollowUp);

  // // function
  const handelAddFollowUp = ({ formData, resetFunc }) => {
    const followUpData = new FormData();
    followUpData.append('add_follow_up', formData.add_follow_up);
    followUpData.append('next_follow_up_date', formData.next_follow_up_date);
    followUpData.append('attachment_file', formData.attachment_file);
    followUpData.append('candidate_id', currentCandidateId);
    dispatch(
      addFollowUpThunk({
        formData: followUpData,
        currentId: currentCandidateId,
        onSuccessHandler: () => {
          dispatch(getFollowUpListThunk({ currentId: currentCandidateId }));
          resetFunc();
          attachmentFileRef.current.value = '';
        },
      }),
    );
  };
  return (
    <Container fluid className="employee_joining_details_container">
      <h5 className="mb-0 text-primary">Follow Up</h5>
      <hr className="primary_divider mt-1" />

      <Formik
        initialValues={followUpInitialValue}
        enableReinitialize
        validationSchema={addFollowValidation}
        onSubmit={(values, { resetForm }) => {
          handelAddFollowUp({ formData: values, resetFunc: resetForm });
        }}
      >
        {({ errors, touched, setFieldValue, resetForm, dirty }) => (
          <Form>
            <Stack gap={3}>
              <Row>
                <Col sm={12}>
                  <Field
                    component={CustomTextArea}
                    name="add_follow_up"
                    label="Add Follow-Up"
                    placeholder="Enter follow-up"
                    requiredField
                    // rows={4}
                  />
                </Col>
              </Row>
              <Row className="gap-3 gap-sm-0">
                <Col sm={12} md={6}>
                  <Field
                    component={CustomInput}
                    type="datetime-local"
                    name="next_follow_up_date"
                    label="Next Follow-Up Date & Time"
                    requiredField
                  />
                </Col>
                <Col sm={6} md={6}>
                  <label>Attachment</label>
                  <input
                    ref={attachmentFileRef}
                    type="file"
                    name="attachment_file"
                    className={`form-control ${
                      errors.attachment_file && touched.attachment_file ? 'is-invalid' : ''
                    }`}
                    onChange={event => {
                      setFieldValue('attachment_file', event.target.files[0]);
                    }}
                    accept=".jpg, .jpeg, .pdf, .docx, .csv"
                  />
                  <RenderIf render={errors.attachment_file && touched.attachment_file}>
                    <div className="invalid-feedback">{errors.attachment_file}</div>
                  </RenderIf>
                </Col>
              </Row>
            </Stack>

            <div className="d-flex justify-content-sm-end gap-2 my-3 btn_container">
              <button className="btn btn-dark px-4" type="submit" disabled={isLoading?.addFollowUp}>
                {isLoading?.addFollowUp ? <Spinner animation="border" size="sm" /> : 'Add'}
              </button>
              <button
                className="btn btn-shadow-light px-3"
                type="button"
                onClick={resetForm}
                disabled={!dirty}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <FollowUpHistory />
    </Container>
  );
}

export default FollowUp;
