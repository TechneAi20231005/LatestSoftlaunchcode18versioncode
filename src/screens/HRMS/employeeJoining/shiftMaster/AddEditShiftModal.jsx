import React, { useEffect, useState } from 'react';
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { Field, Form, Formik } from 'formik';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { RenderIf } from '../../../../utils';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import {
  CustomDropdown,
  CustomInput,
  CustomRadioButton
} from '../../../../components/custom/inputs/CustomInputs';
import {
  addShiftMasterThunk,
  getShiftMasterListThunk
} from '../../../../redux/services/hrms/employeeJoining/shiftMaster';
import { useDispatch, useSelector } from 'react-redux';
import { shiftMasterValidation } from './validation/AddEditShift';

function AddEditShiftModal({ show, close, type, currentShiftData }) {
  const dispatch = useDispatch();
  const ShiftTypes = ['Flexi'];
  const shiftOptions = ShiftTypes.map((item) => ({
    value: item,
    label: item
  }));

  const initialValue = {
    shift_name: type === 'EDIT' ? currentShiftData?.shift_name : '',
    shift_type: type === 'EDIT' ? currentShiftData?.shift_type : '',
    grace_period_in_min:
      type === 'EDIT' ? currentShiftData?.grace_period_in_min : '',
    late_mark_period_in_min_after_grace_period:
      type === 'EDIT'
        ? currentShiftData?.late_mark_period_in_min_after_grace_period
        : '',
    early_out_allowed_in_month:
      type === 'EDIT' ? currentShiftData?.early_out_allowed_in_month : '',
    early_out_allowed_min:
      type === 'EDIT' ? currentShiftData?.early_out_allowed_min : '',
    no_of_late_mark_for_half_day:
      type === 'EDIT' ? currentShiftData?.no_of_late_mark_for_half_day : '',
    min_to_consider_half_day:
      type === 'EDIT' ? currentShiftData?.min_to_consider_half_day : '',
    min_to_consider_one_and_half_day:
      type === 'EDIT' ? currentShiftData?.min_to_consider_one_and_half_day : '',
    min_to_consider_double_day:
      type === 'EDIT' ? currentShiftData?.min_to_consider_double_day : '',
    remark: type === 'EDIT' ? currentShiftData?.remark || '' : '',
    is_active: type === 'EDIT' ? currentShiftData?.is_active?.toString() : '1'
  };

  const { isLoading } = useSelector((state) => state?.shiftMaster);

  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    formData: ''
  });

  const handelAddEditShiftModal = () => {
    if (type === 'ADD') {
      dispatch(
        addShiftMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getShiftMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          }
        })
      );
    } else {
      dispatch(
        addShiftMasterThunk({
          currentId: currentShiftData.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getShiftMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          }
        })
      );
    }
  };
  useEffect(() => {
    dispatch(getShiftMasterListThunk());
  }, []);

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === 'ADD' ? 'Add' : 'Edit'} Shift`}
        width="lg"
      >
        <Formik
          initialValues={initialValue}
          validationSchema={shiftMasterValidation}
          onSubmit={(values) => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {({ dirty }) => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="shift_name"
                    label="Shift Name"
                    id="shift_name"
                    placeholder="Enter Shift Name"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomDropdown}
                    name="shift_type"
                    label="Shift Type"
                    id="shift_type"
                    data={shiftOptions}
                    placeholder="Please Select Shift Type"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="grace_period_in_min"
                    label="Grace Period In Min"
                    id="grace_period_in_min"
                    placeholder="Enter Grace Period"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="late_mark_period_in_min_after_grace_period"
                    label="Late Mark Period In Min After Grace Period"
                    id="late_mark_period_in_min_after_grace_period"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="early_out_allowed_in_month"
                    label="Early Out Allowed In Month"
                    id="early_out_allowed_in_month"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="early_out_allowed_min"
                    label="Early Out Allowed In Min"
                    id="early_out_allowed_min"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="no_of_late_mark_for_half_day"
                    label="No. Of Late Mark For Half Day"
                    id="no_of_late_mark_for_half_day"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="min_to_consider_half_day"
                    label="Min To Consider In Half Day"
                    id="min_to_consider_half_day"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="min_to_consider_in_one_and_half_day"
                    label="Min To Consider In One And Half Day"
                    id="min_to_consider_in_one_and_half_day"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="min_to_consider_double_day"
                    label="Min To Consider Double Day"
                    id="min_to_consider_double_day"
                    placeholder=""
                    requiredField
                  />
                </Col>
                <RenderIf render={type === 'EDIT'}>
                  <Col sm={12}>
                    <Field
                      component={CustomInput}
                      name="remark"
                      id="remark"
                      label="Remark"
                      requiredField
                    />
                  </Col>
                </RenderIf>
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
                    id="shiftMaster_active"
                    label="Active"
                    value="1"
                    inputClassName="me-1"
                  />
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="is_active"
                    label="Deactive"
                    id="shiftMaster_deactive"
                    value="0"
                    inputClassName="me-1"
                  />
                </div>
              </RenderIf>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button
                  className="btn btn-primary px-4"
                  type="submit"
                  disabled={!dirty}
                >
                  {type === 'ADD' ? 'Submit' : 'Update'}
                </button>
                <button
                  onClick={close}
                  className="btn btn-danger px-3"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomAlertModal
        show={openConfirmModal.open}
        type="success"
        message={`Do you want to ${
          type === 'ADD' ? 'save' : 'update'
        } this record?`}
        onSuccess={handelAddEditShiftModal}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={isLoading?.addShiftMaster}
      />
    </>
  );
}

export default AddEditShiftModal;
