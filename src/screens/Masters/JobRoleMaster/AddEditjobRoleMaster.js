import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
  CustomInput,
  CustomRadioButton
} from '../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../utils';

import CustomModal from '../../../components/custom/modal/CustomModal';

// import addJobRoleMasterValidation from './validation/AddJobRoleMaster';
import { addJobRoleMasterValidation } from './validation/AddJobRoleMaster';
import {
  addJobRoleMasterThunk,
  editJobRoleMasterThunk,
  getJobRoleMasterListThunk
} from '../../../redux/services/jobRoleMaster';

function AddEditJobRoleMaster({ show, close, type, currentJobRoleData }) {
  console.log(currentJobRoleData, 'data');
  const dispatch = useDispatch();
  const addEditJobRoleInitialValue = {
    job_role: type === 'EDIT' ? currentJobRoleData?.job_role : '',
    remark: type === 'EDIT' ? currentJobRoleData?.remark : '',
    is_active: type === 'EDIT' ? currentJobRoleData?.is_active?.toString() : 1
  };

  const handleAddEditJobRole = ({ formData }) => {
    if (type === 'ADD') {
      dispatch(
        addJobRoleMasterThunk({
          formData: formData,
          onSuccessHandler: () => {
            close();
            dispatch(getJobRoleMasterListThunk());
          },
          onErrorHandler: () => {}
        })
      );
    } else {
      dispatch(
        editJobRoleMasterThunk({
          currentId: currentJobRoleData?.id,
          formData: formData,
          onSuccessHandler: () => {
            close();
            dispatch(getJobRoleMasterListThunk());
          },
          onErrorHandler: () => {}
        })
      );
    }
  };

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === 'ADD' ? 'Add' : 'Edit'} Job Role Master`}
        width="md"
      >
        <Formik
          initialValues={addEditJobRoleInitialValue}
          validationSchema={addJobRoleMasterValidation}
          onSubmit={(values) => {
            handleAddEditJobRole({ formData: values });
          }}
        >
          {({ dirty }) => (
            <Form>
              <Row className="gap-3 mt-2">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="job_role"
                    label="Job Role Title"
                    placeholder="Enter Job Role Title"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark"
                    label="Remark"
                    placeholder="Enter Remark"
                  />
                </Col>
                <RenderIf render={type === 'EDIT'}>
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
                    />
                    <Field
                      component={CustomRadioButton}
                      type="radio"
                      name="is_active"
                      label="Deactive"
                      value="0"
                      inputClassName="me-1"
                    />
                  </div>
                </RenderIf>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-primary px-3"
                  type="submit"
                  disabled={!dirty}
                >
                  {type === 'ADD' ? 'Submit' : 'Update'}
                </button>
                <button
                  onClick={() => close()}
                  className="btn px-3 btn-danger"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default AddEditJobRoleMaster;
