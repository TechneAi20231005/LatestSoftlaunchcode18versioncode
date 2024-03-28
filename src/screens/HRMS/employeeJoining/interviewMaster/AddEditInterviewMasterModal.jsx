import React, { useState } from 'react';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { Col, Row } from 'react-bootstrap';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { CustomDropdown, CustomInput } from '../../../../components/custom/inputs/CustomInputs';
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
  { label: '0-2 years', value: '0-2' },
  { label: '2-3 years', value: '2-3' },
  { label: '3-4 years', value: '3-4' },
];
const stepCount = [
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
];
const employeeName = [
  { label: 'Test1', value: 'test1' },
  { label: 'Test2', value: 'test2' },
  { label: 'Test3', value: 'test3' },
];

function AddEditInterviewMasterModal({ show, close }) {
  // // initial state
  const valuessss = useFormikContext();
  console.log(valuessss);

  const addInterviewInitialValue = {
    department: '',
    designation: '',
    experienceLevel: '',
    stepCount: '',
  };

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  return (
    <>
      <CustomModal show={show} title="Add Interview Steps" width="xl">
        <h6 className="text_primary fs-6 mb-0">Opening Details:</h6>
        <hr className="primary_divider" />
        <Formik
          initialValues={addInterviewInitialValue}
          validationSchema={addEditInterviewMaster}
          onSubmit={(values, errors) => {
            console.log(values);
            setOpenConfirmModal(true);
          }}
        >
          {({ values }) => (
            <Form>
              {/* {console.log(values?.stepCount)} */}
              <Row className="">
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
                    requiredField
                    disabled={!values?.department}
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
                    disabled={!values?.designation}
                  />
                </Col>
                <Col sm={6} md={6} lg={3}>
                  <Field
                    data={stepCount}
                    component={CustomDropdown}
                    name="stepCount"
                    label="Steps Count"
                    placeholder="Select"
                    requiredField
                    disabled={!values?.experienceLevel}
                  />
                </Col>
              </Row>
              <RenderIf render={values?.stepCount}>
                <h6 className="text_primary fs-6 mb-0 mt-2">Step Details:</h6>
                <hr className="dark_divider" />
                {Array.from({ length: parseInt(values?.stepCount) || 0 })?.map((item, index) => (
                  <>
                    <Row>
                      <p className="text_primary">Step {index + 1}. Interviewer Details</p>
                      <Col sm={6} md={6} lg={3}>
                        <Field
                          component={CustomInput}
                          name={`stepTitle_${index + 1}`}
                          label="Step Title"
                          requiredField
                        />
                      </Col>
                      <Col sm={6} md={6} lg={3}>
                        <Field
                          data={designationType}
                          component={CustomDropdown}
                          name={`designation_${index + 1}`}
                          label="Designation"
                          placeholder="Select"
                          requiredField
                        />
                      </Col>
                      <Col sm={6} md={6} lg={3}>
                        <Field
                          data={employeeName}
                          component={CustomDropdown}
                          name={`name_${index + 1}`}
                          label="Name"
                          placeholder="Select"
                          requiredField
                        />
                      </Col>
                      <Col sm={6} md={6} lg={3}>
                        <Field
                          component={CustomInput}
                          type="email"
                          name={`email_${index + 1}`}
                          label="Email"
                          requiredField
                        />
                      </Col>
                    </Row>
                    <hr />
                  </>
                ))}
              </RenderIf>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit" disabled={!values?.stepCount}>
                  Save
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
        message="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, ea?"
        onSuccess={() => setOpenConfirmModal(false)}
        onClose={() => setOpenConfirmModal(false)}
      />
    </>
  );
}

export default AddEditInterviewMasterModal;
