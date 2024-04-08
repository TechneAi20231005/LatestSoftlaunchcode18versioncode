import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Stack, Col, Row, Container } from 'react-bootstrap';

// // static import
import {
  CustomInput,
  CustomTextArea,
} from '../../../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../../../utils';
import FollowUpHistory from './FollowUpHistory';
import { addFollowValidation } from './validation/addFollowValidation';

function FollowUp() {
  // // initial state
  const followUpInitialValue = {
    follow_up: '',
    next_follow_date_time: '',
    attachment: '',
  };

  return (
    <Container className="employee_joining_details_container">
      <h5 className="mb-0 text-primary">Follow Up</h5>
      <hr className="primary_divider mt-1" />

      <Formik
        initialValues={followUpInitialValue}
        enableReinitialize
        validationSchema={addFollowValidation}
        // onSubmit={values => {
        //   setOpenConfirmModal({ open: true, formData: values });
        // }}
      >
        {({ errors, touched, setFieldValue, resetForm }) => (
          <Form>
            <Stack gap={3}>
              <Row>
                <Col sm={12}>
                  <Field
                    component={CustomTextArea}
                    name="follow_up"
                    label="Add Follow-up"
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
                    name="next_follow_date_time"
                    label="Next Follow-up Date & Time"
                    requiredField
                  />
                </Col>
                <Col sm={6} md={6}>
                  <label>Attachment</label>
                  <input
                    type="file"
                    name="attachment"
                    className={`form-control ${
                      errors.attachment && touched.attachment ? 'is-invalid' : ''
                    }`}
                    onChange={event => {
                      setFieldValue('attachment', event.currentTarget.files[0]);
                    }}
                  />
                  <RenderIf render={errors.attachment && touched.attachment}>
                    <div className="invalid-feedback">{errors.attachment}</div>
                  </RenderIf>
                </Col>
              </Row>
            </Stack>

            <div className="d-flex justify-content-end mt-3 gap-2">
              <button className="btn btn-dark px-4" type="submit">
                Add
              </button>
              <button className="btn btn-shadow-light px-3" type="button" onClick={resetForm}>
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
