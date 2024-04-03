import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { CustomInput, CustomRadioButton } from '../../../../components/custom/inputs/CustomInputs';
import { addEditSourceValidation } from './validation/addEditSource';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';
import {
  addSourceMasterThunk,
  editSourceMasterThunk,
  getSourceMasterListThunk,
} from '../../../../redux/services/hrms/employeeJoining/sourceMaster';

function AddEditSourceModal({ show, close, type, currentSourceData }) {
  // // initial state
  const dispatch = useDispatch();
  const sourceInitialValue = {
    source_name: type === 'EDIT' ? currentSourceData?.source_name : '',
    remark: type === 'EDIT' ? currentSourceData?.remark || '' : '',
    is_active: type === 'EDIT' ? currentSourceData?.is_active?.toString() : 1,
  };

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });

  // // function
  const handelAddEditSource = () => {
    if (type === 'ADD') {
      dispatch(
        addSourceMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getSourceMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    } else {
      dispatch(
        editSourceMasterThunk({
          currentId: currentSourceData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getSourceMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    }
  };
  return (
    <>
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Source`} width="md">
        <Formik
          initialValues={sourceInitialValue}
          enableReinitialize
          validationSchema={addEditSourceValidation}
          onSubmit={(values, errors) => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {() => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="source_name"
                    label="Source"
                    placeholder="Enter Source Name"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark"
                    label="Remark"
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
                    name="is_active"
                    label="Active"
                    value="1"
                    inputClassName="me-1"
                  />
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="is_active"
                    label="Deactivate"
                    value="0"
                    inputClassName="me-1"
                  />
                </div>
              </RenderIf>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  {type === 'ADD' ? 'Save' : 'Update'}
                </button>
                <button onClick={close} className="btn btn-shadow-light px-3" type="button">
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>

      {/* Add edit branch master confirmation modal */}
      <CustomAlertModal
        show={openConfirmModal.open}
        type="success"
        message={`Do you want to ${type === 'ADD' ? 'save' : 'update'} this record?`}
        onSuccess={handelAddEditSource}
        onClose={() => setOpenConfirmModal({ open: false })}
      />
    </>
  );
}

export default AddEditSourceModal;
