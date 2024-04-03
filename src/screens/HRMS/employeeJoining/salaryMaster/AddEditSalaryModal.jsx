import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Stack } from 'react-bootstrap';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
  CustomRadioButton,
  CustomReactSelect,
} from '../../../../components/custom/inputs/CustomInputs';
import { addEditSalaryValidation } from './validation/addEditSalary';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';
import { NumbersOnly } from '../../../../components/Utilities/Validation';

// // static data
const departmentType = [
  { label: 'IT', value: 'it' },
  { label: 'Networking', value: 'networking' },
  { label: 'HR', value: 'hr' },
];
const designationType = [
  { label: 'Software Developer', value: 'softwareDeveloper' },
  { label: 'Software Testing', value: 'softwareTesting' },
  { label: 'UI/UX Designer', value: 'uiUxDesigner' },
];
const location = [
  { label: 'Pune', value: 'pune' },
  { label: 'Hyderabad', value: 'hyderabad' },
];
const experienceLevel = [
  { label: '0-2 years', value: '0-2' },
  { label: '2-3 years', value: '2-3' },
  { label: '3-4 years', value: '3-4' },
];

function AddEditSalaryModal({ show, close, type }) {
  // // initial state
  const addEditSalaryInitialValue = {
    department: '',
    designation: '',
    location: '',
    experienceLevel: '',
    maxSalary: '',
    remark: '',
    status: 'active',
  };

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  return (
    <>
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Salary`} width="xl">
        <Formik
          initialValues={addEditSalaryInitialValue}
          validationSchema={addEditSalaryValidation}
          onSubmit={(values, errors) => {
            setOpenConfirmModal(true);
            console.log(values);
          }}
        >
          {() => (
            <Form>
              <Stack gap={3}>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      data={departmentType}
                      component={CustomDropdown}
                      name="department"
                      label="Department"
                      placeholder="Select"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      data={designationType}
                      component={CustomDropdown}
                      name="designation"
                      label="Designation"
                      placeholder="Select"
                    />
                  </Col>
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      options={location}
                      component={CustomReactSelect}
                      name="location"
                      label="Location"
                      placeholder="Select"
                      requiredField
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      data={experienceLevel}
                      component={CustomDropdown}
                      name="experienceLevel"
                      label="Experience Level"
                      placeholder="Select"
                      requiredField
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      component={CustomCurrencyInput}
                      onKeyDown={NumbersOnly}
                      name="maxSalary"
                      label="Max salary(In Hand)"
                      placeholder="Enter max salary"
                      type="number"
                      requiredField
                    />
                  </Col>
                  <Col>
                    <Field
                      component={CustomInput}
                      name="remarks"
                      label="Remarks"
                      placeholder="Enter Remarks"
                    />
                  </Col>
                </Row>
              </Stack>
              <RenderIf render={type === 'EDIT'}>
                <div className="d-flex align-items-center mt-3">
                  <p className="mb-2 pe-2">
                    Status<span className="mendatory_sign">*</span> :
                  </p>
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="status"
                    label="Active"
                    value="active"
                    inputClassName="me-1"
                  />
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="status"
                    label="Deactivate"
                    value="deActive"
                    inputClassName="me-1"
                  />
                </div>
              </RenderIf>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  {type === 'ADD' ? 'Save' : 'Update'}
                </button>
                <button onClick={close} className="btn btn-shadow-light px-3">
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomAlertModal
        show={openConfirmModal}
        type="success"
        message={`Do you want to ${type === 'ADD' ? 'save' : 'update'} this record?`}
        onSuccess={() => {
          setOpenConfirmModal(false);
          close();
        }}
        onClose={() => setOpenConfirmModal(false)}
      />
    </>
  );
}

export default AddEditSalaryModal;
