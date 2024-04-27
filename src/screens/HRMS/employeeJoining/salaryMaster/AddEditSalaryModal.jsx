import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
  CustomRadioButton,
  CustomReactSelect,
} from '../../../../components/custom/inputs/CustomInputs';
import { addEditSalaryValidation } from './validation/addEditSalary';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { RenderIf } from '../../../../utils';
import { NumbersOnly } from '../../../../components/Utilities/Validation';
import {
  addSalaryMasterThunk,
  editSalaryMasterThunk,
  getSalaryMasterListThunk,
} from '../../../../redux/services/hrms/employeeJoining/salaryMaster';
import { departmentData } from '../../../Masters/DepartmentMaster/DepartmentMasterAction';
import { getDesignationData } from '../../../Dashboard/DashboardAction';
import { getBranchMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/branchMaster';
import { experienceLevel } from '../../../../settings/constants';

function AddEditSalaryModal({ show, close, type, currentSalaryData }) {
  // // initial state
  const dispatch = useDispatch();

  const addEditSalaryInitialValue = {
    department_id: type === 'EDIT' ? currentSalaryData?.department_id : '',
    designation_id: type === 'EDIT' ? currentSalaryData?.designation_id : '',
    location_id:
      type === 'EDIT' ? currentSalaryData?.locations?.map(location => location?.location_id) : '',
    // location_id: type === 'EDIT' ? [3] : '',
    experience_level: type === 'EDIT' ? currentSalaryData?.experience_level : '',
    max_salary: type === 'EDIT' ? currentSalaryData?.max_salary : '',
    remark: type === 'EDIT' ? currentSalaryData?.remark || '' : '',
    is_active: type === 'EDIT' ? currentSalaryData?.is_active?.toString() : 1,
  };

  // // redux state
  const { isLoading: salaryMasterLoading } = useSelector(state => state?.salaryMaster);
  const { departmentData: departmentDataList, status: isDepartmentDataListLoading } = useSelector(
    state => state?.department,
  );
  const { getDesignationData: designationMasterList, status: isDesignationMasterList } =
    useSelector(DesignationSlice => DesignationSlice.designationMaster);
  const { branchMasterList, isLoading } = useSelector(state => state?.branchMaster);

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });

  // // dropdown data
  const departmentType = departmentDataList?.map(item => ({
    label: item?.department,
    value: item?.id,
  }));

  const designationType = designationMasterList?.map(item => ({
    label: item?.designation,
    value: item?.id,
  }));

  const location = branchMasterList?.map(item => ({
    label: item?.location_name,
    value: item?.id,
  }));

  // // function
  const handelAddEditSalary = () => {
    if (type === 'ADD') {
      dispatch(
        addSalaryMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getSalaryMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    } else {
      dispatch(
        editSalaryMasterThunk({
          currentId: currentSalaryData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getSalaryMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    }
  };

  useEffect(() => {
    if (show) {
      if (!departmentDataList?.length) {
        dispatch(departmentData());
      }
      if (!designationMasterList?.length) {
        dispatch(getDesignationData());
      }
      if (!branchMasterList?.length) {
        dispatch(getBranchMasterListThunk());
      }
    }
  }, [show]);

  return (
    <>
      <CustomModal show={show} title={`${type === 'ADD' ? 'Add' : 'Edit'} Salary`} width="xl">
        <Formik
          initialValues={addEditSalaryInitialValue}
          enableReinitialize
          validationSchema={addEditSalaryValidation}
          onSubmit={values => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {() => (
            <Form>
              <Stack gap={3}>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      data={departmentType}
                      component={CustomDropdown}
                      name="department_id"
                      label="Department"
                      placeholder={
                        isDepartmentDataListLoading === 'loading' ? 'Loading...' : 'Select'
                      }
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      data={designationType}
                      component={CustomDropdown}
                      name="designation_id"
                      label="Designation"
                      placeholder={isDesignationMasterList === 'loading' ? 'Loading...' : 'Select'}
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      options={location}
                      component={CustomReactSelect}
                      name="location_id"
                      label="Location"
                      placeholder={isLoading?.getBranchMasterList ? 'Loading...' : 'Select'}
                      requiredField
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      data={experienceLevel}
                      component={CustomDropdown}
                      name="experience_level"
                      label="Experience Level"
                      placeholder="Select"
                      requiredField
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6} lg={3}>
                    <Field
                      component={CustomCurrencyInput}
                      onKeyDown={NumbersOnly}
                      name="max_salary"
                      label="Max salary(In Hand)"
                      placeholder="Enter max salary"
                      type="number"
                      requiredField
                    />
                  </Col>
                  <Col>
                    <Field
                      component={CustomInput}
                      name="remark"
                      label="Remark"
                      placeholder="Enter Remark"
                    />
                  </Col>
                </Row>
              </Stack>
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

      {/* Add edit salary master confirmation modal */}
      <CustomAlertModal
        show={openConfirmModal.open}
        type="success"
        message={`Do you want to ${type === 'ADD' ? 'save' : 'update'} this record?`}
        onSuccess={handelAddEditSalary}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={salaryMasterLoading?.addSalaryMaster || salaryMasterLoading?.editSalaryMaster}
      />
    </>
  );
}

export default AddEditSalaryModal;
