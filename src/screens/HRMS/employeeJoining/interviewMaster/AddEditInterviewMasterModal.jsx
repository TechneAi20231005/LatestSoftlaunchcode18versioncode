import React, { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import {
  CustomDropdown,
  CustomInput,
  CustomRadioButton,
} from '../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../utils';
import addEditInterviewMaster from './validation/addEditInterviewMaster';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';

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

const experienceLevel = [
  { label: 'Fresher', value: 'fresher' },
  { label: '0-1 years of experience', value: '0-1' },
  { label: '1-3 years of experience', value: '1-3' },
  { label: '3-5 years of experience', value: '3-5' },
  { label: '5+ years of experience', value: '5+' },
];

const employeeName = [
  { label: 'Test1', value: 'test1' },
  { label: 'Test2', value: 'test2' },
  { label: 'Test3', value: 'test3' },
];

function AddEditInterviewMasterModal({ show, close, type, currentInterviewData }) {
  // // initial state
  const addInterviewInitialValue = {
    department: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.department : '',
    designation: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.designation : '',
    experience_level:
      type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.experience_level : '',
    interview_step: [
      {
        step_title: '',
        designation_id: '',
        name: '',
        email: '',
      },
    ],
    remark: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.remark || '' : '',
    is_active: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.is_active?.toString() : 1,
  };

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === 'ADD' ? 'Add' : type === 'VIEW' ? 'View' : 'Edit'} Interview Steps`}
        width="xl"
      >
        <h6 className="text_primary fs-6 mb-0">Opening Details:</h6>
        <hr className="primary_divider" />
        <Formik
          initialValues={addInterviewInitialValue}
          validationSchema={addEditInterviewMaster}
          onSubmit={(values, errors) => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {({ values }) => (
            <Form>
              <Row className="">
                <Col md={4} lg={4}>
                  <Field
                    data={departmentType}
                    component={CustomDropdown}
                    name="department"
                    label="Department"
                    placeholder="Select"
                    requiredField
                    disabled={type === 'VIEW'}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={designationType}
                    component={CustomDropdown}
                    name="designation"
                    label="Designation"
                    placeholder="Select"
                    requiredField
                    disabled={type === 'VIEW'}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={experienceLevel}
                    component={CustomDropdown}
                    name="experience_level"
                    label="Experience Level"
                    placeholder="Select"
                    requiredField
                    disabled={type === 'VIEW'}
                  />
                </Col>
              </Row>
              <h6 className="text_primary fs-6 mb-0 mt-2">Step Details:</h6>
              <hr className="dark_divider" />
              <FieldArray name="interview_step">
                {({ push, remove }) =>
                  values?.interview_step?.map((interviewer, index) => (
                    <>
                      <Row key={index}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <p className="text_primary mb-0">Step {index + 1}. Interviewer Details</p>
                          <RenderIf render={type !== 'VIEW'}>
                            <RenderIf render={values.interview_step.length === 1 && index === 0}>
                              <div className="d-flex justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-dark"
                                  onClick={() =>
                                    push({
                                      step_title: '',
                                      designation_id: '',
                                      name: '',
                                      email: '',
                                    })
                                  }
                                >
                                  <i class="icofont-plus" />
                                </button>
                              </div>
                            </RenderIf>
                            <RenderIf render={values.interview_step.length > 1}>
                              <div className="d-flex justify-content-between">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => remove(index)}
                                >
                                  <i class="icofont-ui-remove" />
                                </button>
                                <RenderIf render={index === values.interview_step.length - 1}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-dark"
                                    onClick={() =>
                                      push({
                                        step_title: '',
                                        designation_id: '',
                                        name: '',
                                        email: '',
                                      })
                                    }
                                  >
                                    <i class="icofont-plus" />
                                  </button>
                                </RenderIf>
                              </div>
                            </RenderIf>
                          </RenderIf>
                        </div>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            component={CustomInput}
                            name={`interview_step[${index}].step_title`}
                            label="Step Title"
                            requiredField
                            disabled={type === 'VIEW'}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            data={designationType}
                            component={CustomDropdown}
                            name={`interview_step[${index}].designation_id`}
                            label="Designation"
                            placeholder="Select"
                            requiredField
                            disabled={type === 'VIEW'}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            data={employeeName}
                            component={CustomDropdown}
                            name={`interview_step[${index}].name`}
                            label="Name"
                            placeholder="Select"
                            requiredField
                            disabled={type === 'VIEW'}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            component={CustomInput}
                            type="email"
                            name={`interview_step[${index}].email`}
                            label="Email"
                            requiredField
                            disabled={type === 'VIEW'}
                          />
                        </Col>
                      </Row>
                      <hr />
                    </>
                  ))
                }
              </FieldArray>
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="remark"
                  label="Remark"
                  placeholder="Enter Remark"
                  disabled={type === 'VIEW'}
                />
              </Col>
              <RenderIf render={type !== 'ADD'}>
                <div className="d-flex align-items-center mt-3">
                  <p className="mb-2 pe-2">
                    Status<span className="mendatory_sign">*</span> :
                  </p>
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="is_active"
                    label="Active"
                    value="1"
                    inputClassName="me-1"
                    disabled={type === 'VIEW'}
                  />
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="is_active"
                    label="Deactive"
                    value="0"
                    inputClassName="me-1"
                    disabled={type === 'VIEW'}
                  />
                </div>
              </RenderIf>
              <div className="d-flex justify-content-end mt-3 gap-2">
                {type === 'VIEW' ? (
                  <button onClick={close} className="btn btn-dark px-4" type="button">
                    Ok
                  </button>
                ) : (
                  <>
                    <button className="btn btn-dark px-4" type="submit">
                      {type === 'ADD' ? 'Save' : 'Update'}
                    </button>
                    <button onClick={close} className="btn btn-shadow-light px-3" type="button">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomAlertModal
        show={openConfirmModal.open}
        message={`Do you want to ${
          type === 'ADD' ? 'Add' : 'update'
        } Assignment for It department to software Developer?`}
        type="success"
        onSuccess={() => setOpenConfirmModal({ open: false })}
        onClose={() => setOpenConfirmModal({ open: false })}
      />
    </>
  );
}

export default AddEditInterviewMasterModal;
