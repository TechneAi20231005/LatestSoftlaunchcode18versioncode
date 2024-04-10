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
  CustomReactSelect,
} from '../../../../components/custom/inputs/CustomInputs';
import { addCandidatesValidation } from './validation/addCandidates';
import OtpVerificationModal from './OtpVerificationModal';
import { RenderIf } from '../../../../utils';
import { getBranchMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/branchMaster';
import { getSourceMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/sourceMaster';
import { getRoleData } from '../../../Masters/RoleMaster/RoleMasterAction';
import { NumbersOnly } from '../../../../components/Utilities/Validation';

function AddCandidatesModal({ show, close }) {
  // // initial state
  const dispatch = useDispatch();

  const candidatesInitialValue = {
    source_id: '',
    full_name: '',
    dob: '',
    designation_id: '',
    location_id: '',
    mobile_no: '',
    email: '',
    relevant_experience: '',
    expected_ctc: '',
    current_ctc: '',
    notice_period: '',
    resume_path: null,
  };

  // // redux state
  const { branchMasterList, isLoading } = useSelector(state => state?.branchMaster);
  const { getRoleData: roleMasterList, status } = useSelector(
    RoleMasterSlice => RoleMasterSlice?.rolemaster,
  );
  const { sourceMasterList, isLoading: sourceMasterLoading } = useSelector(
    state => state?.sourceMaster,
  );

  // // static data

  const preferredRole = roleMasterList?.map(item => ({
    label: item?.role,
    value: item?.id,
  }));

  const preferredLocation = branchMasterList?.map(item => ({
    label: item?.location_name,
    value: item?.id,
  }));

  const sourceType = sourceMasterList?.map(item => ({
    label: item?.source_name,
    value: item?.id,
  }));

  const experienceLevel = [
    { label: 'Fresher', value: 'fresher' },
    { label: '0-1 years of experience', value: '0-1' },
    { label: '1-3 years of experience', value: '1-3' },
    { label: '3-5 years of experience', value: '3-5' },
    { label: '5+ years of experience', value: '5+' },
  ];

  // // local state
  const [otpModal, setOtpModal] = useState(false);

  useEffect(() => {
    if (show) {
      if (!branchMasterList?.length) {
        dispatch(getRoleData());
      }
      if (!branchMasterList?.length) {
        dispatch(getBranchMasterListThunk());
      }
      if (!sourceMasterList?.length) {
        dispatch(getSourceMasterListThunk());
      }
    }
  }, [show]);
  return (
    <>
      <CustomModal show={show} title="Add Data" width="lg">
        <Formik
          initialValues={candidatesInitialValue}
          validationSchema={addCandidatesValidation}
          onSubmit={(values, errors) => {
            console.log(values, errors);
            setOtpModal(true);
          }}
        >
          {({ touched, errors, setFieldValue }) => (
            <Form>
              <Stack gap={3}>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      data={sourceType}
                      component={CustomDropdown}
                      name="source_id"
                      label="Source"
                      placeholder={
                        sourceMasterLoading?.getSourceMasterList ? 'Loading...' : 'Select'
                      }
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="full_name"
                      label="Full name"
                      placeholder="Enter full name"
                      requiredField
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="dob"
                      type="date"
                      label="Date of birth"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredRole}
                      component={CustomReactSelect}
                      name="designation_id"
                      label="Preferred role"
                      placeholder={status === 'loading' ? 'Loading...' : 'Select'}
                      requiredField
                      isMulti
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredLocation}
                      component={CustomReactSelect}
                      name="location_id"
                      label="Preferred location"
                      placeholder={isLoading?.getBranchMasterList ? 'Loading...' : 'Select'}
                      requiredField
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="mobile_no"
                      label="Phone number"
                      placeholder="Enter contact number"
                      requiredField
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="email"
                      label="Email"
                      placeholder="Enter email address"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      data={experienceLevel}
                      component={CustomDropdown}
                      name="relevant_experience"
                      label="Current years of work experience"
                      placeholder="Select"
                      requiredField
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      onKeyDown={NumbersOnly}
                      name="expected_ctc"
                      label="Expected monthly salary (Net)"
                      placeholder="Enter expected monthly salary"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      onKeyDown={NumbersOnly}
                      name="current_ctc"
                      label="Current monthly salary"
                      placeholder="Enter current monthly salary"
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="notice_period"
                      label="Notice period (In days)"
                      placeholder="Enter notice period in days"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <label>
                      Upload resume <span className="mendatory_sign">*</span>
                    </label>
                    <input
                      type="file"
                      name="resume_path"
                      className={`form-control ${
                        errors.resume_path && touched.resume_path ? 'is-invalid' : ''
                      }`}
                      onChange={event => {
                        setFieldValue('resume_path', event.currentTarget.files[0]);
                      }}
                    />
                    <RenderIf render={errors.resume_path && touched.resume_path}>
                      <div className="invalid-feedback">{errors.resume_path}</div>
                    </RenderIf>
                  </Col>
                </Row>
              </Stack>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Add
                </button>
                <button onClick={close} className="btn btn-shadow-light px-3">
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
      <OtpVerificationModal
        show={otpModal}
        close={() => setOtpModal(false)}
        addCandidateClose={close}
      />
    </>
  );
}

export default AddCandidatesModal;
