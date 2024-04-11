import React, { useState, useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import { Stack, Col, Row, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
  CustomReactSelect,
} from '../../../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../../../utils';
import CandidateEditHistory from './CandidateEditHistory';
import { editCandidatesValidation } from './validation/editCandidatesDetails';
import CustomAlertModal from '../../../../../../components/custom/modal/CustomAlertModal';
import { NumbersOnly } from '../../../../../../components/Utilities/Validation';
import {
  editCandidatesMasterThunk,
  getCandidatesDetailsThunk,
} from '../../../../../../redux/services/hrms/employeeJoining/candidatesListMaster';
import { getRoleData } from '../../../../../Masters/RoleMaster/RoleMasterAction';
import { getBranchMasterListThunk } from '../../../../../../redux/services/hrms/employeeJoining/branchMaster';
import { getSourceMasterListThunk } from '../../../../../../redux/services/hrms/employeeJoining/sourceMaster';
import { REACT_APP_3_SOFT_LUNCH_API_URL } from '../../../../../../config/envConfig';

function CandidatesDetails() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;

  // getCandidatesDetailsData
  // // redux state
  const { candidateDetailsData, isLoading } = useSelector(state => state?.candidatesMaster);
  const { details } = candidateDetailsData;

  const { branchMasterList, isLoading: branchMasterLoading } = useSelector(
    state => state?.branchMaster,
  );
  const { getRoleData: roleMasterList, status } = useSelector(
    RoleMasterSlice => RoleMasterSlice?.rolemaster,
  );
  const { sourceMasterList, isLoading: sourceMasterLoading } = useSelector(
    state => state?.sourceMaster,
  );

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({ open: false, formData: '' });
  const [currentMode, setCurrentMode] = useState('VIEW');

  // form initial data
  const editCandidateInitialValue = {
    source_id: details?.source_id,
    full_name: details?.full_name,
    dob: details?.dob,
    designation_id: details?.designation_id,
    location_id: details?.location_id?.map(id => +id),
    mobile_no: details?.mobile_no,
    email: details?.email,
    relevant_experience: details?.relevant_experience,
    expected_ctc: details?.expected_monthly_salary,
    current_ctc: details?.current_monthly_salary,
    notice_period: details?.notice_period,
    resume_path: `${REACT_APP_3_SOFT_LUNCH_API_URL}${details?.resume}`,
  };

  // // dropdown data
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

  // // handel add candidates
  const handelEditCandidates = () => {
    const candidatesData = new FormData();
    candidatesData.append('relevant_experience', openConfirmModal?.formData?.relevant_experience);
    candidatesData.append('expected_ctc', openConfirmModal?.formData?.expected_ctc);
    candidatesData.append('current_ctc', openConfirmModal?.formData?.current_ctc);
    candidatesData.append('notice_period', openConfirmModal?.formData?.notice_period);
    candidatesData.append('resume_path', openConfirmModal?.formData?.resume_path);

    dispatch(
      editCandidatesMasterThunk({
        formData: candidatesData,
        currentId: currentCandidateId,
        onSuccessHandler: () => {
          setOpenConfirmModal({ open: false });
          dispatch(getCandidatesDetailsThunk());
        },
        onErrorHandler: () => {
          setOpenConfirmModal({ open: false });
        },
      }),
    );
  };

  // // life cycle
  useEffect(() => {
    dispatch(getCandidatesDetailsThunk({ currentId: currentCandidateId }));
    if (!branchMasterList?.length) {
      dispatch(getRoleData());
    }
    if (!branchMasterList?.length) {
      dispatch(getBranchMasterListThunk());
    }
    if (!sourceMasterList?.length) {
      dispatch(getSourceMasterListThunk());
    }
  }, [currentCandidateId]);

  return (
    <Container className="employee_joining_details_container">
      <div className="d-flex justify-content-between align-items-center text-primary">
        <h5 className="mb-0">Candidates Details</h5>
        <i className="icofont-edit me-1 cp" onClick={() => setCurrentMode('EDIT')} />
      </div>
      <hr className="primary_divider mt-1" />
      <Formik
        initialValues={editCandidateInitialValue}
        enableReinitialize
        validationSchema={editCandidatesValidation}
        onSubmit={values => {
          setOpenConfirmModal({ open: true, formData: values });
        }}
      >
        {({ touched, errors, setFieldValue, resetForm }) => (
          <Form>
            <Stack gap={3}>
              <Row className="gap-3 gap-sm-0">
                <Col sm={6} md={6}>
                  <Field
                    data={sourceType}
                    component={CustomDropdown}
                    name="source_id"
                    label="Source"
                    placeholder={sourceMasterLoading?.getSourceMasterList ? 'Loading...' : 'Select'}
                    disabled
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Field
                    component={CustomInput}
                    name="full_name"
                    label="Full name"
                    placeholder="Enter full name"
                    disabled
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
                    disabled
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Field
                    options={preferredRole}
                    component={CustomReactSelect}
                    name="designation_id"
                    label="Preferred role"
                    placeholder={status === 'loading' ? 'Loading...' : 'Select'}
                    disabled
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
                    placeholder={branchMasterLoading?.getBranchMasterList ? 'Loading...' : 'Select'}
                    isMulti
                    disabled
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Field
                    component={CustomInput}
                    name="mobile_no"
                    label="Phone number"
                    placeholder="Enter contact number"
                    type="number"
                    disabled
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
                    disabled
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
                    disabled={currentMode === 'VIEW'}
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
                    disabled={currentMode === 'VIEW'}
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
                    disabled={currentMode === 'VIEW'}
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
                    disabled={currentMode === 'VIEW'}
                  />
                </Col>
                <Col sm={6} md={6}>
                  <label>
                    Resume <span className="mendatory_sign">*</span>
                  </label>
                  {currentMode === 'VIEW' ? (
                    <div>
                      <a
                        href={`${REACT_APP_3_SOFT_LUNCH_API_URL}${details?.resume}`}
                        target="_blank"
                      >
                        Resume.file
                      </a>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        name="resume_path"
                        className={`form-control ${
                          errors.resume_path && touched.resume_path ? 'is-invalid' : ''
                        }`}
                        onChange={event => {
                          setFieldValue('resume_path', event.currentTarget.files[0]);
                        }}
                        accept=".jpeg, .jpg, .png, .pdf, .docx"
                      />
                      <RenderIf render={errors.resume_path && touched.resume_path}>
                        <div className="invalid-feedback">{errors.resume_path}</div>
                      </RenderIf>
                    </>
                  )}
                </Col>
              </Row>
            </Stack>
            <RenderIf render={currentMode === 'EDIT'}>
              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Update
                </button>
                <button
                  className="btn btn-shadow-light px-3"
                  type="button"
                  onClick={() => {
                    setCurrentMode('VIEW');
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </RenderIf>
          </Form>
        )}
      </Formik>

      {/* Add edit branch master confirmation modal */}
      <CustomAlertModal
        show={openConfirmModal.open}
        type="success"
        message={`Do you want to edit candidates details?`}
        onSuccess={handelEditCandidates}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={isLoading?.editCandidatesMaster}
      />

      {/* candidates edit history */}
      <CandidateEditHistory />
    </Container>
  );
}

export default CandidatesDetails;
