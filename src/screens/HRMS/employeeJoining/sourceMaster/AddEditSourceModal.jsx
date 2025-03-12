import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

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

  // // redux state
  const { isLoading } = useSelector(state => state?.sourceMaster);

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
          onSubmit={values => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {({ dirty }) => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="source_name"
                    label="Source Name"
                    id="sourcemaster_sourcename"
                    placeholder="Enter Source Name"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark"
                    label="Remark"
                    id="sourcemaster_remark"
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
                    id="sourcemaster_active"
                    value="1"
                    inputClassName="me-1"
                  />
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="is_active"
                    label="Deactive"
                    id="sourcemaster_deactive"
                    value="0"
                    inputClassName="me-1"
                  />
                </div>
              </RenderIf>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-primary px-4" type="submit" disabled={!dirty}>
                  {type === 'ADD' ? 'Submit' : 'Update'}
                </button>
                <button onClick={close} className="btn btn-danger px-3" type="button">
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
        isLoading={isLoading?.addSourceMaster || isLoading?.editSourceMaster}
      />
    </>
  );
}

export default AddEditSourceModal;
