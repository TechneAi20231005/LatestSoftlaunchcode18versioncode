import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { CustomInput, CustomRadioButton } from '../../../../components/custom/inputs/CustomInputs';
import { addEditRemarkValidation } from './validation/addEditRemark';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';
import {
  addRemarkMasterThunk,
  editRemarkMasterThunk,
  getRemarkMasterListThunk,
} from '../../../../redux/services/hrms/employeeJoining/remarkMaster';

function AddEditRemarkModal({ show, close, type, currentRemarkData }) {
  // // initial state
  const dispatch = useDispatch();
  const addEditRemarkInitialValue = {
    remark_description: type === 'EDIT' ? currentRemarkData?.remark_description : '',
    supporting_remark: type === 'EDIT' ? currentRemarkData?.supporting_remark || '' : '',
    is_active: type === 'EDIT' ? currentRemarkData?.is_active?.toString() : 1,
  };

  // // redux state
  const { isLoading } = useSelector(state => state?.remarkMaster);

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });

  // // function
  const handelAddEditRemark = () => {
    if (type === 'ADD') {
      dispatch(
        addRemarkMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getRemarkMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    } else {
      dispatch(
        editRemarkMasterThunk({
          currentId: currentRemarkData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getRemarkMasterListThunk());
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
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Remark`} width="md">
        <Formik
          initialValues={addEditRemarkInitialValue}
          enableReinitialize
          validationSchema={addEditRemarkValidation}
          onSubmit={values => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {() => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark_description"
                    label="Remark Description"
                    placeholder="Enter Remark Description"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="supporting_remark"
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

      {/* Add edit remark master confirmation modal */}
      <CustomAlertModal
        show={openConfirmModal?.open}
        type="success"
        message={`Do you want to ${type === 'ADD' ? 'save' : 'update'} this record?`}
        onSuccess={handelAddEditRemark}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={isLoading?.addRemarkMaster || isLoading?.editRemarkMaster}
      />
    </>
  );
}

export default AddEditRemarkModal;
