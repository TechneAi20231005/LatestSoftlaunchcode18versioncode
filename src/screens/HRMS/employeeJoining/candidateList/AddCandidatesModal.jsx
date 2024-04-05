import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Container, Row, Stack } from 'react-bootstrap';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
  CustomReactSelect,
} from '../../../../components/custom/inputs/CustomInputs';
import { addCandidatesValidation } from './validation/addCandidates';
import OtpVerificationModal from './OtpVerificationModal';
import { RenderIf } from '../../../../utils';

// // static data
const sourceType = [
  { label: 'Pune Shop 1', value: 'puneShop1' },
  { label: 'Kothrud Shop', value: 'kothrudShop' },
];

const preferredRole = [
  { label: 'Software Developer', value: 'softwareDeveloper' },
  { label: 'Software Testing', value: 'softwareTesting' },
  { label: 'UI/UX Designer', value: 'uiUxDesigner' },
];

const preferredLocation = [
  { label: 'Pune', value: 'pune' },
  { label: 'Hyderabad', value: 'hyderabad' },
];

function AddCandidatesModal({ show, close }) {
  // // initial state
  const candidatesInitialValue = {
    source: '',
    fullName: '',
    dob: '',
    preferredRole: '',
    preferredLocation: '',
    phoneNumber: '',
    email: '',
    expectedMonthlySalary: '',
    currentMonthlySalary: '',
    noticePeriod: '',
    resume: null,
  };

  // // local state
  const [otpModal, setOtpModal] = useState(false);

  return (
    <>
      <CustomModal show={show} title="Add Data" width="lg">
        <Formik
          initialValues={candidatesInitialValue}
          validationSchema={addCandidatesValidation}
          onSubmit={(values, errors) => {
            console.log(values, errors);
            setOtpModal(true);
          }}
        >
          {({ touched, errors, setFieldValue }) => (
            <Form>
              <Stack gap={3}>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      data={sourceType}
                      component={CustomDropdown}
                      name="source"
                      label="Source"
                      placeholder="Select"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="fullName"
                      label="Full Name"
                      placeholder="Enter Full Name"
                      requiredField
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="dob"
                      type="date"
                      label="Date of Birth"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredRole}
                      component={CustomReactSelect}
                      name="preferredRole"
                      label="Preferred Role"
                      placeholder="Select"
                      requiredField
                      isMulti
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredLocation}
                      component={CustomReactSelect}
                      name="preferredLocation"
                      label="Preferred Location"
                      placeholder="Select"
                      requiredField
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="phoneNumber"
                      label="Phone Number"
                      placeholder="Enter contact number"
                      requiredField
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="email"
                      label="Email"
                      placeholder="Enter email address"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      name="expectedMonthlySalary"
                      label="Expected monthly salary (Net)"
                      placeholder="Enter expected monthly salary"
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      name="currentMonthlySalary"
                      label="Current monthly salary"
                      placeholder="Enter current monthly salary"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="noticePeriod"
                      label="Notice Period (In days)"
                      placeholder="Enter notice period in days"
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <input
                      type="file"
                      name="resume"
                      className={`form-control ${
                        errors.resume && touched.resume ? 'is-invalid' : ''
                      }`}
                      onChange={event => {
                        setFieldValue('resume', event.currentTarget.files[0]);
                      }}
                    />
                    <RenderIf render={errors.resume && touched.resume}>
                      <div className="invalid-feedback">{errors.resume}</div>
                    </RenderIf>
                  </Col>
                </Row>
              </Stack>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Add
                </button>
                <button onClick={close} className="btn btn-shadow-light px-3">
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
      <OtpVerificationModal
        show={otpModal}
        close={() => setOtpModal(false)}
        addCandidateClose={close}
      />
    </>
  );
}

export default AddCandidatesModal;
