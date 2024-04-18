import React, { useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
} from '../../../../../../../../../components/custom/inputs/CustomInputs';
import { NumbersOnly } from '../../../../../../../../../components/Utilities/Validation';
import { getBranchMasterListThunk } from '../../../../../../../../../redux/services/hrms/employeeJoining/branchMaster';
import { getDesignationData } from '../../../../../../../../Dashboard/DashboardAction';
import { jobOfferValidation } from './validation/jobOfferValidation';
import { RenderIf } from '../../../../../../../../../utils';
import { getRemarkMasterListThunk } from '../../../../../../../../../redux/services/hrms/employeeJoining/remarkMaster';
import { useJobOfferSalaryFiltered } from '../../../../../../../../../hooks/hrms/employeeJoining';
import { getSalaryMasterListThunk } from '../../../../../../../../../redux/services/hrms/employeeJoining/salaryMaster';
import { useState } from 'react';

function JobOffer() {
  // // initial state
  const dispatch = useDispatch();

  const jobOfferInitialValue = {
    designation_id: '',
    location_id: '',
    relevant_experience: '',
    experience_level: '',
    current_salary: '',
    max_salary: '',
    preferred_salary: '',
    negotiable_salary: '',
    remark_id: '',
    other_remark: '',
  };

  // // redux state
  const { getDesignationData: designationMasterList, status } = useSelector(
    DesignationSlice => DesignationSlice.designationMaster,
  );
  const { branchMasterList, isLoading } = useSelector(state => state?.branchMaster);
  const { remarkMasterList, isLoading: remarkMasterListLoading } = useSelector(
    state => state?.remarkMaster,
  );
  const { salaryMasterList } = useSelector(state => state?.salaryMaster);

  // // const local state
  const [formValue, setFormValue] = useState();

  // // dropdown data
  const preferredRole = designationMasterList?.map(item => ({
    label: item?.designation,
    value: item?.id,
  }));

  const location = branchMasterList?.map(item => ({
    label: item?.location_name,
    value: item?.id,
  }));

  const experienceLevel = [
    { label: 'Fresher', value: 'fresher' },
    { label: '0-1 years of experience', value: '0-1' },
    { label: '1-3 years of experience', value: '1-3' },
    { label: '3-5 years of experience', value: '3-5' },
    { label: '5+ years of experience', value: '5+' },
  ];

  const remarkType = [
    ...remarkMasterList?.map(item => ({ label: item?.remark, value: item?.id })),
    { label: 'Other', value: 0 },
  ];

  useEffect(() => {
    if (!designationMasterList?.length) {
      dispatch(getDesignationData());
    }
    if (!branchMasterList?.length) {
      dispatch(getBranchMasterListThunk());
    }
    if (!remarkMasterList?.length) {
      dispatch(getRemarkMasterListThunk());
    }
    if (!salaryMasterList?.length) {
      dispatch(getSalaryMasterListThunk());
    }
  }, []);
  const salaryFiltered = useJobOfferSalaryFiltered(
    salaryMasterList,
    formValue?.designation_id,
    formValue?.location_id,
    formValue?.experience_level,
  );

  return (
    <Formik
      initialValues={jobOfferInitialValue}
      enableReinitialize
      validationSchema={jobOfferValidation}
      onSubmit={values => {
        // setOpenConfirmModal({ open: true, formData: values });
      }}
    >
      {({ values, errors }) => {
        setFormValue(values);
        return (
          <Form>
            <h5 className="mb-0 text-primary">Salary Offer</h5>
            <hr className="primary_divider mt-1" />
            <Stack gap={3}>
              <Row className="row_gap_3 ">
                <Col sm={6} md={6} lg={4}>
                  <Field
                    data={preferredRole}
                    component={CustomDropdown}
                    name="designation_id"
                    label="Role"
                    placeholder={status === 'loading' ? 'Loading...' : 'Select'}
                    requiredField
                  />
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <Field
                    data={location}
                    component={CustomDropdown}
                    name="location_id"
                    label="Location"
                    placeholder={isLoading?.getBranchMasterList ? 'Loading...' : 'Select'}
                    requiredField
                    isMulti
                  />
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <Field
                    component={CustomInput}
                    name="relevant_experience"
                    label={
                      <>
                        Relevant Experience &nbsp;
                        <RenderIf render={!errors?.relevant_experience}>
                          <small className="opacity-50">
                            (Relevant experience should be 0.1 to 100)
                          </small>
                        </RenderIf>
                      </>
                    }
                    placeholder="Enter relevant experience"
                    requiredField
                    type="number"
                  />
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <Field
                    data={experienceLevel}
                    component={CustomDropdown}
                    name="experience_level"
                    label="Experience Level"
                    placeholder="Select"
                    requiredField
                  />
                </Col>
                <RenderIf render={values?.experience_level !== 'fresher'}>
                  <Col sm={6} md={6} lg={4}>
                    <Field
                      component={CustomCurrencyInput}
                      onKeyDown={NumbersOnly}
                      name="current_salary"
                      label="Current Salary"
                      placeholder="Enter current salary"
                      type="number"
                      requiredField
                    />
                  </Col>
                </RenderIf>
                <Col sm={6} md={6} lg={4}>
                  <Field
                    component={CustomCurrencyInput}
                    onKeyDown={NumbersOnly}
                    name="max_salary"
                    label="Max Salary(In Hand)"
                    placeholder="Enter max salary"
                    type="number"
                    requiredField
                    readOnly
                  />
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <Field
                    component={CustomCurrencyInput}
                    onKeyDown={NumbersOnly}
                    name="preferred_salary"
                    label="Preferred Salary"
                    placeholder="Enter preferred salary"
                    type="number"
                    requiredField
                  />
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <Field
                    component={CustomCurrencyInput}
                    onKeyDown={NumbersOnly}
                    name="negotiable_salary"
                    label="Negotiable Salary"
                    placeholder="Enter negotiable salary"
                    type="number"
                    requiredField
                  />
                </Col>
              </Row>
              <Row>
                <h5 className="mb-0 text-primary">Add Remark</h5>
                <hr className="primary_divider mt-1" />
                <Col sm={12}>
                  <Field
                    component={CustomDropdown}
                    data={remarkType}
                    name="remark_id"
                    label="Remark Title"
                    placeholder={
                      remarkMasterListLoading?.getRemarkMasterList ? 'Loading...' : 'Select'
                    }
                    requiredField
                  />
                </Col>
                <RenderIf render={parseInt(values?.remark_id) === 0}>
                  <Col sm={12}>
                    <Field
                      component={CustomInput}
                      name="other_remark"
                      label="Specify Other"
                      placeholder="Enter remark"
                      styleData="mt-3"
                      requiredField
                    />
                  </Col>
                </RenderIf>
              </Row>
            </Stack>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button className="btn btn-dark px-4" type="submit">
                Send Joining Form
              </button>
              <button className="btn btn-danger text-light px-3" type="submit">
                Reject
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default JobOffer;
