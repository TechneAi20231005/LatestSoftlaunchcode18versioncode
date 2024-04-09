import React, { memo, useEffect, useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import {
  CustomDropdown,
  CustomInput,
  CustomRadioButton,
} from '../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../utils';
import addEditInterviewMaster from './validation/addEditInterviewMaster';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';
import { departmentData } from '../../../Masters/DepartmentMaster/DepartmentMasterAction';
import { getDesignationData, getEmployeeData } from '../../../Dashboard/DashboardAction';
import {
  addInterviewMasterThunk,
  editInterviewMasterThunk,
  getInterviewMasterListThunk,
} from '../../../../redux/services/hrms/employeeJoining/interviewListMaster';

function AddEditInterviewMasterModal({ show, close, type, currentInterviewData }) {
  // // initial state
  const dispatch = useDispatch();
  const addInterviewInitialValue = {
    department_id: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.department_id : '',
    designation_id: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.designation_id : '',
    experience_level:
      type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.experience_level : '',
    step_details:
      type === 'EDIT' || type === 'VIEW'
        ? currentInterviewData?.details?.map(detail => ({
            step_title: detail.step_title || '',
            designation_id: detail.designation_id || '',
            employee_id: detail.employee_id || '',
            employee_email: detail.employee_email || '',
          }))
        : [
            {
              step_title: '',
              designation_id: '',
              employee_id: '',
              employee_email: '',
            },
          ],
    remark: type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.remark || '' : '',
    is_active:
      type === 'EDIT' || type === 'VIEW' ? currentInterviewData?.is_active?.toString() : '1',
  };

  // // redux state
  const { departmentData: departmentDataList, status: isDepartmentDataListLoading } = useSelector(
    state => state?.department,
  );
  const { getDesignationData: designationMasterList, status: isDesignationMasterList } =
    useSelector(DesignationSlice => DesignationSlice.designationMaster);
  const { employeeData, status: isEmployeeMasterList } = useSelector(
    dashboardSlice => dashboardSlice.dashboard,
  );
  const { isLoading } = useSelector(state => state?.interviewMaster);

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

  const employeeName = employeeData?.map(item => ({
    label: `${item?.first_name} ${item?.middle_name} ${item?.last_name}`,
    value: item?.id,
  }));

  const experienceLevel = [
    { label: 'Fresher', value: 'fresher' },
    { label: '0-1 years of experience', value: '0-1' },
    { label: '1-3 years of experience', value: '1-3' },
    { label: '3-5 years of experience', value: '3-5' },
    { label: '5+ years of experience', value: '5+' },
  ];

  // // function
  const handelAddEditInterview = () => {
    if (type === 'ADD') {
      dispatch(
        addInterviewMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getInterviewMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        }),
      );
    } else if (type === 'EDIT') {
      dispatch(
        editInterviewMasterThunk({
          currentId: currentInterviewData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getInterviewMasterListThunk());
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
      if (!designationMasterList?.length) {
        dispatch(getEmployeeData());
      }
    }
  }, [show]);

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === 'ADD' ? 'Add' : type === 'VIEW' ? 'View' : 'Edit'} Interview Steps`}
        width="xl"
      >
        <h6 className="text_primary fs-6 mb-0">Opening Details:</h6>
        <hr className="primary_divider" />
        <Formik
          initialValues={addInterviewInitialValue}
          enableReinitialize
          validationSchema={addEditInterviewMaster}
          onSubmit={(values, errors) => {
            setOpenConfirmModal({
              open: true,
              formData: { ...values, steps_count: values?.step_details?.length },
            });
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Row className="">
                <Col md={4} lg={4}>
                  <Field
                    data={departmentType}
                    component={CustomDropdown}
                    name="department_id"
                    label="Department"
                    placeholder={
                      isDepartmentDataListLoading === 'loading' ? 'Loading...' : 'Select'
                    }
                    requiredField
                    disabled={type === 'VIEW'}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={designationType}
                    component={CustomDropdown}
                    name="designation_id"
                    label="Designation"
                    placeholder={isDesignationMasterList === 'loading' ? 'Loading...' : 'Select'}
                    requiredField
                    disabled={type === 'VIEW'}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    data={experienceLevel}
                    component={CustomDropdown}
                    name="experience_level"
                    label="Experience Level"
                    placeholder="Select"
                    requiredField
                    disabled={type === 'VIEW'}
                  />
                </Col>
              </Row>
              <h6 className="text_primary fs-6 mb-0 mt-2">Step Details:</h6>
              <hr className="dark_divider" />
              <FieldArray name="step_details">
                {({ push, remove }) =>
                  values?.step_details?.map((interviewer, index) => (
                    <>
                      <Row key={index}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <p className="text_primary mb-0">Step {index + 1}. Interviewer Details</p>
                          <RenderIf render={type !== 'VIEW'}>
                            <RenderIf render={values.step_details.length === 1 && index === 0}>
                              <div className="d-flex justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-dark"
                                  onClick={() =>
                                    push({
                                      step_title: '',
                                      designation_id: '',
                                      employee_id: '',
                                      employee_email: '',
                                    })
                                  }
                                >
                                  <i class="icofont-plus" />
                                </button>
                              </div>
                            </RenderIf>
                            <RenderIf render={values.step_details.length > 1}>
                              <div className="d-flex justify-content-between">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger text-white"
                                  onClick={() => remove(index)}
                                >
                                  <i class="icofont-ui-remove" />
                                </button>
                                <RenderIf render={index === values.step_details.length - 1}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-dark"
                                    disabled={values.step_details.length === 7}
                                    onClick={() =>
                                      push({
                                        step_title: '',
                                        designation_id: '',
                                        designation_id: '',
                                        employee_email: '',
                                      })
                                    }
                                  >
                                    <i class="icofont-plus" />
                                  </button>
                                </RenderIf>
                              </div>
                            </RenderIf>
                          </RenderIf>
                        </div>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            component={CustomInput}
                            name={`step_details[${index}].step_title`}
                            label="Enter Step Title"
                            placeholder="Step Title"
                            requiredField
                            disabled={type === 'VIEW'}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            data={designationType}
                            component={CustomDropdown}
                            name={`step_details[${index}].designation_id`}
                            label="Designation"
                            placeholder={
                              isDesignationMasterList === 'loading' ? 'Loading...' : 'Select'
                            }
                            requiredField
                            disabled={type === 'VIEW'}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            data={employeeName}
                            component={CustomDropdown}
                            name={`step_details[${index}].employee_id`}
                            label="Name"
                            placeholder={
                              isEmployeeMasterList === 'loading' ? 'Loading...' : 'Select'
                            }
                            requiredField
                            disabled={type === 'VIEW'}
                            handleChange={selectedOption => {
                              const selectedEmployee = employeeData.find(
                                employee =>
                                  Number(employee.id) === Number(selectedOption?.target?.value),
                              );
                              const emailFieldName = `step_details[${index}].employee_email`;
                              setFieldValue(
                                emailFieldName,
                                selectedEmployee ? selectedEmployee.email_id : '',
                              );
                            }}
                          />
                        </Col>
                        <Col sm={6} md={6} lg={3}>
                          <Field
                            component={CustomInput}
                            type="email"
                            name={`step_details[${index}].employee_email`}
                            label="Email"
                            placeholder="Enter Email Address"
                            requiredField
                            disabled
                          />
                        </Col>
                      </Row>
                      <hr />
                    </>
                  ))
                }
              </FieldArray>
              <Col sm={12}>
                <Field
                  component={CustomInput}
                  name="remark"
                  label="Remark"
                  placeholder="Enter Remark"
                  disabled={type === 'VIEW'}
                />
              </Col>
              <RenderIf render={type !== 'ADD'}>
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
                    disabled={type === 'VIEW'}
                  />
                  <Field
                    component={CustomRadioButton}
                    type="radio"
                    name="is_active"
                    label="Deactive"
                    value="0"
                    inputClassName="me-1"
                    disabled={type === 'VIEW'}
                  />
                </div>
              </RenderIf>
              <div className="d-flex justify-content-end mt-3 gap-2">
                {type === 'VIEW' ? (
                  <button onClick={close} className="btn btn-dark px-4" type="button">
                    Ok
                  </button>
                ) : (
                  <>
                    <button className="btn btn-dark px-4" type="submit">
                      {type === 'ADD' ? 'Save' : 'Update'}
                    </button>
                    <button onClick={close} className="btn btn-shadow-light px-3" type="button">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomAlertModal
        show={openConfirmModal.open}
        message={`Do you want to ${
          type === 'ADD' ? 'Add' : 'update'
        } Assignment for It department to software Developer?`}
        type="success"
        onSuccess={handelAddEditInterview}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={isLoading?.addInterviewMaster || isLoading?.editInterviewMaster}
      />
    </>
  );
}

export default memo(AddEditInterviewMasterModal);
