import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { CustomInput, CustomRadioButton } from '../../../../components/custom/inputs/CustomInputs';
import { addEditBranchValidation } from './validation/AddEditBranch';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';
import {
  addBranchMasterThunk,
  editBranchMasterThunk,
  getBranchMasterListThunk,
} from '../../../../redux/services/hrms/employeeJoining/branchMaster';

function AddEditBranchModal({ show, close, type, currentBranchData }) {
  // // initial state
  const dispatch = useDispatch();
  const branchInitialValue = {
    location_name: type === 'EDIT' ? currentBranchData?.location_name : '',
    remark: type === 'EDIT' ? currentBranchData?.remark || '' : '',
    is_active: type === 'EDIT' ? currentBranchData?.is_active?.toString() : 1,
  };
  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });

  // // function

  const handelAddEditBranch = () => {
    if (type === 'ADD') {
      dispatch(
        addBranchMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getBranchMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    } else {
      dispatch(
        editBranchMasterThunk({
          currentId: currentBranchData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getBranchMasterListThunk());
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
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Branch`} width="md">
        <Formik
          initialValues={branchInitialValue}
          enableReinitialize
          validationSchema={addEditBranchValidation}
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
                    name="location_name"
                    label="Branch"
                    placeholder="Enter Branch Name"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark"
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
        onSuccess={handelAddEditBranch}
        onClose={() => setOpenConfirmModal({ open: false })}
      />
    </>
  );
}

export default AddEditBranchModal;
