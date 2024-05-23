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
import { FormSkeleton } from '../../../../../../components/custom/loader';
import {
  editCandidatesMasterThunk,
  getCandidatesDetailsThunk,
} from '../../../../../../redux/services/hrms/employeeJoining/candidatesListMaster';
import { getDesignationData } from '../../../../../Dashboard/DashboardAction';
import { getBranchMasterListThunk } from '../../../../../../redux/services/hrms/employeeJoining/branchMaster';
import { getSourceMasterListThunk } from '../../../../../../redux/services/hrms/employeeJoining/sourceMaster';
import { REACT_APP_ATTACHMENT_URL } from '../../../../../../config/envConfig';
import { experienceLevel } from '../../../../../../settings/constants';

function CandidatesDetails() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  // const { currentCandidateId } = location.state;

  // getCandidatesDetailsData
  // // redux state
  const {
    candidateDetailsData: { details },
    isLoading,
  } = useSelector(state => state?.candidatesMaster);

  const { branchMasterList, isLoading: branchMasterLoading } = useSelector(
    state => state?.branchMaster,
  );
  const { getDesignationData: designationMasterList, status } = useSelector(
    DesignationSlice => DesignationSlice.designationMaster,
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
    expected_ctc: details?.expected_monthly_salary || '',
    current_ctc: details?.current_monthly_salary || '',
    notice_period: details?.notice_period || '',
    resume_path: `${REACT_APP_ATTACHMENT_URL}${details?.resume}`,
  };

  // // dropdown data
  const preferredRole = designationMasterList
    ?.filter(item => item?.is_active === 1)
    ?.map(item => ({
      label: item?.designation,
      value: item?.id,
    }));

  const preferredLocation = branchMasterList
    ?.filter(item => item?.is_active === 1)
    ?.map(item => ({
      label: item?.location_name,
      value: item?.id,
    }));

  const sourceType = sourceMasterList
    ?.filter(item => item?.is_active === 1)
    ?.map(item => ({
      label: item?.source_name,
      value: item?.id,
    }));

  // // handel add candidates
  const handelEditCandidates = () => {
    const candidatesData = new FormData();
    candidatesData.append('source_id', openConfirmModal?.formData?.source_id);
    candidatesData.append('full_name', openConfirmModal?.formData?.full_name);
    candidatesData.append('dob', openConfirmModal?.formData?.dob);
    candidatesData.append('designation_id', openConfirmModal?.formData?.designation_id);
    candidatesData.append('location_id', openConfirmModal?.formData?.location_id);
    candidatesData.append('mobile_no', openConfirmModal?.formData?.mobile_no);
    candidatesData.append('email', openConfirmModal?.formData?.email);
    candidatesData.append('relevant_experience', openConfirmModal?.formData?.relevant_experience);
    candidatesData.append('expected_ctc', openConfirmModal?.formData?.expected_ctc);
    candidatesData.append('current_ctc', openConfirmModal?.formData?.current_ctc);
    candidatesData.append('notice_period', openConfirmModal?.formData?.notice_period);
    // candidatesData.append('resume_path[]', openConfirmModal?.formData?.resume_path);
    // openConfirmModal?.formData.forEach(file => {
    //   candidatesData.append('resume_path[]', file);
    // });

    dispatch(
      editCandidatesMasterThunk({
        formData: candidatesData,
        currentId: location?.state?.currentCandidateId,
        onSuccessHandler: () => {
          setCurrentMode('VIEW');
          setOpenConfirmModal({ open: false });
          dispatch(getCandidatesDetailsThunk({ currentId: location?.state?.currentCandidateId }));
        },
        onErrorHandler: () => {
          setOpenConfirmModal({ open: false });
        },
      }),
    );
  };

  // // life cycle
  useEffect(() => {
    dispatch(getCandidatesDetailsThunk({ currentId: location?.state?.currentCandidateId }));
    if (!designationMasterList?.length) {
      dispatch(getDesignationData());
    }
    if (!branchMasterList?.length) {
      dispatch(getBranchMasterListThunk());
    }
    if (!sourceMasterList?.length) {
      dispatch(getSourceMasterListThunk());
    }
  }, [location?.state?.currentCandidateId]);

  return (
    <Container fluid className="employee_joining_details_container">
      <div className="d-flex justify-content-between align-items-center text-primary">
        <h5 className="mb-0">
          Candidates Details{' '}
          <span className="fs-6 text-black opacity-50 ml-1">&nbsp; #{details?.id}</span>
        </h5>

        <i className="icofont-edit me-1 cp" onClick={() => setCurrentMode('EDIT')} />
      </div>
      <hr className="primary_divider mt-1" />
      {isLoading?.getCandidatesDetailsData ? (
        <FormSkeleton columnLength={2} />
      ) : (
        <Formik
          initialValues={editCandidateInitialValue}
          enableReinitialize
          validationSchema={editCandidatesValidation}
          onSubmit={values => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {({ touched, errors, setFieldValue, resetForm, dirty }) => (
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
                      disabled
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="full_name"
                      label="Full Name"
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
                      label="Date Of Birth"
                      disabled
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredRole}
                      component={CustomReactSelect}
                      name="designation_id"
                      label="Preferred Designation"
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
                      label="Preferred Location"
                      placeholder={
                        branchMasterLoading?.getBranchMasterList ? 'Loading...' : 'Select'
                      }
                      isMulti
                      disabled
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="mobile_no"
                      label="Phone Number"
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
                      label="Current Years Of Work Experience"
                      placeholder="Select"
                      requiredField
                      disabled={currentMode === 'VIEW' || details?.application_status_id !== 1}
                    />
                  </Col>
                </Row>
                <Row className="gap-3 gap-sm-0">
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      name="expected_ctc"
                      label="Expected Monthly Salary (Net)"
                      placeholder="Enter expected monthly salary"
                      type="number"
                      disabled={currentMode === 'VIEW'}
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      name="current_ctc"
                      label="Current Monthly Salary"
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
                      label="Notice Period (In days)"
                      placeholder="Enter notice period in days"
                      type="number"
                      disabled={currentMode === 'VIEW'}
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <label>
                      Resume
                      {/* <span className="mendatory_sign">*</span> */}
                    </label>
                    {currentMode === 'VIEW' ? (
                      <div>
                        {details?.attachments.length ? (
                          details?.attachments?.map((fileData, index) => (
                            <a
                              href={`${REACT_APP_ATTACHMENT_URL}${fileData}`}
                              target="_blank"
                              key={index}
                            >
                              File-{index + 1}, &nbsp;
                            </a>
                          ))
                        ) : (
                          <small className="opacity-75">N/A</small>
                        )}
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          name="resume_path"
                          disabled
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
                <div className="d-flex justify-content-sm-end gap-2 mt-3 btn_container">
                  <button className="btn btn-dark px-4" type="submit" disabled={!dirty}>
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
      )}

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
