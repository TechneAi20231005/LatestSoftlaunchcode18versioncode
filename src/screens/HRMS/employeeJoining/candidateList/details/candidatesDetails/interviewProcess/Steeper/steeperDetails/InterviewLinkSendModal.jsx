import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';

// // static import
import { CustomInput } from '../../../../../../../../../components/custom/inputs/CustomInputs';
import CustomModal from '../../../../../../../../../components/custom/modal/CustomModal';

function InterviewLinkSendModal({ open, close }) {
  return (
    <CustomModal show={open} title="Interview Meting Link" width="sm" close={close}>
      <Formik
        initialValues={{ interview_link: '' }}
        enableReinitialize
        // validationSchema={selectInterViewSlotValidation}
        onSubmit={values => {}}
      >
        {() => (
          <Form>
            <Row className="gap-3">
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="interview_link"
                  label="Interview link"
                  requiredField
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-3 gap-2">
              <button className="btn btn-dark px-4" type="submit">
                Send
              </button>
              <button
                onClick={close}
                className="btn btn-shadow-light text-primary px-3"
                type="button"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}

export default InterviewLinkSendModal;
