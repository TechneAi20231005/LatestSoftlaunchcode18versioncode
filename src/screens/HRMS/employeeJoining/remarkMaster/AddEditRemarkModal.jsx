import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { CustomInput, CustomRadioButton } from '../../../../components/custom/inputs/CustomInputs';
import { addEditRemarkValidation } from './validation/addEditRemark';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';

function AddEditRemarkModal({ show, close, type }) {
  // // initial state
  const addEditRemarkInitialValue = {
    remarkDescription: '',
    supportingRemark: '',
    status: 'active',
  };

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  return (
    <>
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Remark`} width="md">
        <Formik
          initialValues={addEditRemarkInitialValue}
          validationSchema={addEditRemarkValidation}
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
                    name="remarkDescription"
                    label="Remark Description"
                    placeholder="Enter Remark Description"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="supportingRemark"
                    label="Supporting Remark"
                    placeholder="Enter Supporting Remark"
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

export default AddEditRemarkModal;
