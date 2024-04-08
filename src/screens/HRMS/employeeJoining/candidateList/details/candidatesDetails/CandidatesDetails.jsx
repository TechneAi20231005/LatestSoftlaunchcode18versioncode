import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Stack, Col, Row, Container } from 'react-bootstrap';

// // static import
import {
  CustomCurrencyInput,
  CustomInput,
  CustomReactSelect,
} from '../../../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../../../utils';
import CandidateEditHistory from './CandidateEditHistory';
import { editCandidatesValidation } from './validation/editCandidatesDetails';
import CustomAlertModal from '../../../../../../components/custom/modal/CustomAlertModal';

function CandidatesDetails() {
  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });
  const [currentMode, setCurrentMode] = useState('VIEW');

  const editCandidateInitialValue = {
    fullName: '',
    dob: '',
    preferredLocation: '',
    preferredRole: '',
    phoneNumber: '',
    currentMonthlySalary: '',
    expectedMonthlySalary: '',
    noticePeriod: '',
  };
  const preferredRole = [
    { label: 'Software Developer', value: 'softwareDeveloper' },
    { label: 'Software Testing', value: 'softwareTesting' },
    { label: 'UI/UX Designer', value: 'uiUxDesigner' },
  ];

  const preferredLocation = [
    { label: 'Pune', value: 'pune' },
    { label: 'Hyderabad', value: 'hyderabad' },
  ];
  return (
    <Container className="employee_joining_details_container">
      <div className="d-flex justify-content-between align-items-center text-primary">
        <h5 className="mb-0">Candidates Details</h5>
        <i className="icofont-edit me-1 cp" onClick={() => setCurrentMode('EDIT')} />
      </div>
      <hr className="primary_divider mt-1" />
      <Formik
        initialValues={editCandidateInitialValue}
        enableReinitialize
        validationSchema={editCandidatesValidation}
        onSubmit={values => {
          setOpenConfirmModal({ open: true, formData: values });
        }}
      >
        {({ resetForm }) => (
          <Form>
            <Stack gap={3}>
              <Row className="gap-3 gap-sm-0">
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    component={CustomInput}
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter Full Name"
                    requiredField
                  />
                </Col>
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    component={CustomInput}
                    name="dob"
                    label="DOB"
                    type="date"
                    requiredField
                  />
                </Col>
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
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
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    options={preferredLocation}
                    component={CustomReactSelect}
                    name="preferredLocation"
                    label="Preferred Location"
                    placeholder="Select"
                    requiredField
                    isMulti
                  />
                </Col>
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    component={CustomInput}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter contact number"
                    requiredField
                    type="number"
                  />
                </Col>
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    component={CustomCurrencyInput}
                    name="currentMonthlySalary"
                    label="Current monthly salary"
                    placeholder="Enter current monthly salary"
                    type="number"
                  />
                </Col>
              </Row>
              <Row className="gap-3 gap-sm-0">
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    component={CustomCurrencyInput}
                    name="expectedMonthlySalary"
                    label="Expected monthly salary (Net)"
                    placeholder="Enter expected monthly salary"
                    type="number"
                  />
                </Col>
                <Col md={4}>
                  <Field
                    disabled={currentMode === 'VIEW'}
                    component={CustomInput}
                    name="noticePeriod"
                    label="Notice Period (In days)"
                    placeholder="Enter notice period in days"
                    type="number"
                  />
                </Col>
                <Col md={4}>
                  <p className="mb-1">Candidate CV</p>
                  <a>Resume.pdf</a>
                </Col>
              </Row>
            </Stack>
            <RenderIf render={currentMode === 'EDIT'}>
              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Update
                </button>
                <button
                  className="btn btn-shadow-light px-3"
                  type="button"
                  onClick={() => {
                    setCurrentMode('VIEW');
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </RenderIf>
          </Form>
        )}
      </Formik>

      {/* Add edit branch master confirmation modal */}
      <CustomAlertModal
        show={openConfirmModal.open}
        type="success"
        message={`Do you want to edit candidates details?`}
        onSuccess={() => setOpenConfirmModal({ open: false })}
        onClose={() => setOpenConfirmModal({ open: false })}
      />

      {/* candidates edit history */}
      <CandidateEditHistory />
    </Container>
  );
}

export default CandidatesDetails;
