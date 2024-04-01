import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { CustomInput, CustomRadioButton } from '../../../../components/custom/inputs/CustomInputs';
import { addEditBranchValidation } from './validation/AddEditBranch';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';

function AddEditBranchModal({ show, close, type }) {
  // // initial state
  const branchInitialValue = {
    branch: '',
    remarks: '',
    status: 'active',
  };

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  return (
    <>
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Branch`} width="md">
        <Formik
          initialValues={branchInitialValue}
          validationSchema={addEditBranchValidation}
          onSubmit={(values, errors) => {
            setOpenConfirmModal(true);
          }}
        >
          {() => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="branch"
                    label="Branch"
                    placeholder="Enter Branch Name"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remarks"
                    label="Remarks"
                    placeholder="Enter Remarks"
                  />
                </Col>
              </Row>
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

export default AddEditBranchModal;
