import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Stack, Spinner } from 'react-bootstrap';
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
import {
  addCandidatesMasterThunk,
  getCandidatesMasterListThunk,
} from '../../../../redux/services/hrms/employeeJoining/candidatesListMaster';
import { experienceLevel } from '../../../../settings/constants';

function AddCandidatesModal({ show, close }) {
  // // initial state
  const dispatch = useDispatch();

  const candidatesInitialValue = {
    source_id: '',
    referred_by_name: '',
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
  const { isLoading } = useSelector(state => state?.candidatesMaster);

  const { branchMasterList, isLoading: branchMasterLoading } = useSelector(
    state => state?.branchMaster,
  );
  const { getRoleData: roleMasterList, status } = useSelector(
    RoleMasterSlice => RoleMasterSlice?.rolemaster,
  );
  const { sourceMasterList, isLoading: sourceMasterLoading } = useSelector(
    state => state?.sourceMaster,
  );

  // // dropdown data
  const preferredRole = roleMasterList
    ?.filter(item => item?.is_active === 1)
    .map(item => ({
      label: item?.role,
      value: item?.id,
    }));

  const preferredLocation = branchMasterList
    ?.filter(item => item?.is_active === 1)
    .map(item => ({
      label: item?.location_name,
      value: item?.id,
    }));

  const sourceType = sourceMasterList
    ?.filter(item => item?.is_active === 1)
    ?.map(item => ({
      label: item?.source_name,
      value: item?.id,
    }));

  // // local state
  const [otpModal, setOtpModal] = useState(false);

  // // handel add candidates
  const handelAddCandidates = formData => {
    const candidatesData = new FormData();
    candidatesData.append('source_id', formData.source_id);
    candidatesData.append('full_name', formData.full_name);
    candidatesData.append('dob', formData.dob);
    formData.designation_id.forEach(id => {
      candidatesData.append('designation_id[]', id);
    });
    formData.location_id.forEach(id => {
      candidatesData.append('location_id[]', id);
    });

    candidatesData.append('mobile_no', formData.mobile_no);
    candidatesData.append('email', formData.email);
    candidatesData.append('relevant_experience', formData.relevant_experience);
    candidatesData.append('expected_ctc', formData.expected_ctc);
    candidatesData.append('current_ctc', formData.current_ctc);
    candidatesData.append('notice_period', formData.notice_period || 0);
    candidatesData.append('resume_path[]', formData.resume_path);

    dispatch(
      addCandidatesMasterThunk({
        formData: candidatesData,
        onSuccessHandler: () => {
          close();
          dispatch(getCandidatesMasterListThunk());
        },
      }),
    );
  };

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
          onSubmit={values => {
            handelAddCandidates(values);
            // setOtpModal(true);
          }}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <Stack gap={3}>
                <Row className="row_gap_3">
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
                  <RenderIf render={Number(values?.source_id) === 1}>
                    <Col sm={6} md={6}>
                      <Field
                        component={CustomInput}
                        name="referred_by_name"
                        label="Referred By"
                        placeholder="Enter referred by name"
                        requiredField
                      />
                    </Col>
                  </RenderIf>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="full_name"
                      label="Full Name"
                      placeholder="Enter full name"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="dob"
                      type="date"
                      label="Date Of Birth"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredRole}
                      component={CustomReactSelect}
                      name="designation_id"
                      label="Preferred Role"
                      placeholder={status === 'loading' ? 'Loading...' : 'Select'}
                      requiredField
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      options={preferredLocation}
                      component={CustomReactSelect}
                      name="location_id"
                      label="Preferred Location"
                      placeholder={
                        branchMasterLoading?.getBranchMasterList ? 'Loading...' : 'Select'
                      }
                      requiredField
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="mobile_no"
                      label="Phone Number"
                      placeholder="Enter contact number"
                      requiredField
                      type="number"
                    />
                  </Col>
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
                      label="Current Years Of Work Experience"
                      placeholder="Select"
                      requiredField
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      // onKeyDown={NumbersOnly}
                      name="expected_ctc"
                      label="Expected Monthly Salary (Net)"
                      placeholder="Enter expected monthly salary"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
                      // onKeyDown={NumbersOnly}
                      name="current_ctc"
                      label="Current Monthly Salary"
                      placeholder="Enter current monthly salary"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomInput}
                      name="notice_period"
                      label="Notice Period (In days)"
                      placeholder="Enter notice period in days"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <label>
                      Upload Resume <span className="mendatory_sign">*</span>
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
                      accept=".jpg, .jpeg, .png, .pdf, .docx,"
                    />
                    <RenderIf render={errors.resume_path && touched.resume_path}>
                      <div className="invalid-feedback">{errors.resume_path}</div>
                    </RenderIf>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-dark px-4"
                    type="submit"
                    disabled={isLoading?.addCandidatesMaster}
                  >
                    {isLoading?.addCandidatesMaster ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Add'
                    )}
                  </button>
                  <button onClick={close} className="btn btn-shadow-light px-3" type="button">
                    Close
                  </button>
                </div>
              </Stack>
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
