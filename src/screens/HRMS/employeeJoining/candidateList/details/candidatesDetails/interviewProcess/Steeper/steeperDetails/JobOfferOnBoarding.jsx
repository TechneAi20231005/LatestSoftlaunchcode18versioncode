import React, { memo, useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Stack, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
  CustomReactSelect
} from '../../../../../../../../../components/custom/inputs/CustomInputs';
import { jobOfferValidation } from './validation/jobOfferValidation';
import { RenderIf } from '../../../../../../../../../utils';
import {
  useCurrentInterviewStep,
  useJobOfferSalaryFiltered
} from '../../../../../../../../../hooks/hrms/employeeJoining';
import { getSalaryMasterListThunk } from '../../../../../../../../../redux/services/hrms/employeeJoining/salaryMaster';
import {
  createInterviewJobOfferProcessThunk,
  getInterviewProcessDataThunk,
  getSalaryNegotiatingActivityDataThunk,
  getSalaryOfferedByHrAndSrHr,
  manageOnBoardingProcessThunk
} from '../../../../../../../../../redux/services/hrms/employeeJoining/interviewProcess';
import SalaryNegotiationActivity from './SalaryNegotiationActivity';
import { experienceLevel } from '../../../../../../../../../settings/constants';
import useDropdownData from '../../../../../../../../../hooks/useDropdownData';

function JobOfferOnBoarding() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;
  const isSeniorHr = localStorage.getItem('role_name') === 'Senior HR';
  const currentInterviewStep = useCurrentInterviewStep();

  // // redux state
  const { salaryMasterList } = useSelector((state) => state?.salaryMaster);
  const { isLoading, salaryOfferedByHrAndSrHrData, interviewProcessData } =
    useSelector((state) => state?.interViewProcess);

  // //  local state
  const [formValue, setFormValue] = useState('');
  const [clickFor, setClickFor] = useState('');

  const offerData = salaryOfferedByHrAndSrHrData?.[0];
  const isApplicationAccepted =
    currentInterviewStep?.application_status_id === 3;
  const jobOfferInitialValue = {
    designation_id: offerData?.designation_id || '',
    location_id: offerData?.location_id || '',
    relevant_experience: offerData?.relevant_experience ?? '',
    experience_level: offerData?.experience_level || '',
    current_salary: offerData?.current_salary ?? '',
    max_salary: offerData?.max_salary ?? '',
    preferred_salary: offerData?.preferred_salary ?? '',
    hr_negotiable_salary:
      !isSeniorHr &&
      offerData?.sr_hr_negotiable_salary &&
      Number(offerData.preferred_salary) >
        Number(offerData.sr_hr_negotiable_salary) &&
      isApplicationAccepted
        ? ''
        : offerData?.hr_negotiable_salary ?? '',
    sr_hr_negotiable_salary: offerData?.sr_hr_negotiable_salary ?? '',
    remark_id: '',
    other_remark: ''
  };

  // // dropdown data
  const {
    preferredDesignationDropdown,
    preferredDesignationDropdownLoading,
    preferredLocationDropdown,
    preferredLocationDropdownLoading,
    remarkDropdown,
    remarkDropdownLoading
  } = useDropdownData({ render: true });

  // // filed disable cases
  const fieldDisableCase_1 =
    currentInterviewStep?.application_status_id === 4 ||
    (isSeniorHr && salaryOfferedByHrAndSrHrData?.[0]?.offer_status === 1);

  // // custom hooks call
  const salaryFiltered = useJobOfferSalaryFiltered(
    salaryMasterList,
    formValue?.designation_id,
    formValue?.location_id,
    formValue?.experience_level
  );

  // // // function
  const handelSetMaxSalaryValue = (setterFunction) => {
    const maxSalary = salaryFiltered?.max_salary || '';
    setterFunction('max_salary', maxSalary);

    const hrNegotiableSalary =
      salaryOfferedByHrAndSrHrData?.[0]?.hr_negotiable_salary;
    if (!hrNegotiableSalary) {
      setterFunction('hr_negotiable_salary', maxSalary);
    }
  };

  const handleJobOfferAndOnBoardingProcess = ({ formData, resetFunc }) => {
    const apiData = {
      ...formData,
      interview_id: currentCandidateId,
      offer_status:
        clickFor === 'submitForApproval'
          ? 0
          : clickFor === 'submittedBySrHr'
          ? 1
          : clickFor === 'sendJoiningForm'
          ? 2
          : clickFor === 'reject'
          ? 3
          : ''
    };
    if (clickFor === 'onBoardingReviseOffer') {
      dispatch(
        manageOnBoardingProcessThunk({
          formData: {
            interview_id: currentCandidateId,
            remark_id: formData?.remark_id,
            other_remark: formData?.other_remark || ''
          },
          currentId: currentCandidateId,
          reviseAndBackQuery: 'REVISED',
          onSuccessHandler: () => {
            dispatch(
              getInterviewProcessDataThunk({ currentId: currentCandidateId })
            );
            dispatch(
              getSalaryOfferedByHrAndSrHr({ currentId: currentCandidateId })
            );
            dispatch(
              getSalaryNegotiatingActivityDataThunk({
                currentId: currentCandidateId
              })
            );
            resetFunc();
          }
        })
      );
    } else if (clickFor === 'completeOnboarding') {
      dispatch(
        manageOnBoardingProcessThunk({
          formData: {
            interview_id: currentCandidateId,
            remark_id: formData?.remark_id,
            other_remark: formData?.other_remark || '',
            is_reject: 'N'
          },
          currentId: currentCandidateId,
          onSuccessHandler: () => {
            dispatch(
              getInterviewProcessDataThunk({ currentId: currentCandidateId })
            );
            dispatch(
              getSalaryOfferedByHrAndSrHr({ currentId: currentCandidateId })
            );
            resetFunc();
          }
        })
      );
    } else if (clickFor === 'rejectForOnBoarding') {
      dispatch(
        manageOnBoardingProcessThunk({
          formData: {
            interview_id: currentCandidateId,
            remark_id: formData?.remark_id,
            other_remark: formData?.other_remark || '',
            is_reject: 'Y'
          },
          currentId: currentCandidateId,
          onSuccessHandler: () => {
            dispatch(
              getInterviewProcessDataThunk({ currentId: currentCandidateId })
            );
            dispatch(
              getSalaryOfferedByHrAndSrHr({ currentId: currentCandidateId })
            );
            resetFunc();
          }
        })
      );
    } else {
      dispatch(
        createInterviewJobOfferProcessThunk({
          formData: apiData,
          currentId: currentCandidateId,
          onSuccessHandler: () => {
            dispatch(
              getInterviewProcessDataThunk({ currentId: currentCandidateId })
            );
            dispatch(
              getSalaryOfferedByHrAndSrHr({ currentId: currentCandidateId })
            );
            dispatch(
              getSalaryNegotiatingActivityDataThunk({
                currentId: currentCandidateId
              })
            );
            resetFunc();
          }
        })
      );
    }
  };

  // // // back btn and function will be removed on feature
  // const handelBackJobOfferOnboarding = () => {
  //   dispatch(
  //     manageOnBoardingProcessThunk({
  //       formData: {
  //         interview_id: currentCandidateId,
  //       },
  //       currentId: currentCandidateId,
  //       reviseAndBackQuery: 'BACK',
  //       onSuccessHandler: () => {
  //         dispatch(getInterviewProcessDataThunk({ currentId: currentCandidateId }));
  //         dispatch(getSalaryOfferedByHrAndSrHr({ currentId: currentCandidateId }));
  //       },
  //     }),
  //   );
  // };

  useEffect(() => {
    if (!salaryMasterList?.length) {
      dispatch(getSalaryMasterListThunk());
    }
    dispatch(getSalaryOfferedByHrAndSrHr({ currentId: currentCandidateId }));
  }, []);

  return (
    <>
      <RenderIf
        render={
          currentInterviewStep?.application_status_id === 4 ||
          (currentInterviewStep?.application_status_id === 3 &&
            currentInterviewStep?.status !== 2)
        }
      >
        <Formik
          initialValues={jobOfferInitialValue}
          enableReinitialize
          validationSchema={jobOfferValidation({
            isSeniorHr: isSeniorHr,
            isOnlyReject: clickFor === 'reject'
          })}
          onSubmit={(values, { resetForm }) => {
            handleJobOfferAndOnBoardingProcess({
              formData: values,
              resetFunc: resetForm
            });
          }}
        >
          {({ values, errors, setFieldValue }) => {
            setFormValue(values);
            return (
              <Form>
                <h5 className="mb-0 text-primary">Salary Offer</h5>
                <hr className="primary_divider mt-1" />
                <Stack gap={3}>
                  <Row className="row_gap_3 ">
                    <Col sm={6} md={6} lg={4}>
                      <Field
                        options={preferredDesignationDropdown}
                        component={CustomReactSelect}
                        name="designation_id"
                        label="Designation"
                        placeholder={
                          preferredDesignationDropdownLoading
                            ? 'Loading...'
                            : 'Select'
                        }
                        requiredField
                        onBlur={() => handelSetMaxSalaryValue(setFieldValue)}
                        disabled={fieldDisableCase_1}
                      />
                    </Col>

                    <Col sm={6} md={6} lg={4}>
                      <Field
                        options={preferredLocationDropdown}
                        component={CustomReactSelect}
                        name="location_id"
                        label="Location"
                        placeholder={
                          preferredLocationDropdownLoading
                            ? 'Loading...'
                            : 'Select'
                        }
                        requiredField
                        onBlur={() => handelSetMaxSalaryValue(setFieldValue)}
                        disabled={fieldDisableCase_1}
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
                                (Relevant experience should be 0 to 100)
                              </small>
                            </RenderIf>
                          </>
                        }
                        placeholder="Enter relevant experience"
                        requiredField
                        type="number"
                        disabled={fieldDisableCase_1}
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
                        onBlur={() => handelSetMaxSalaryValue(setFieldValue)}
                        disabled={fieldDisableCase_1}
                      />
                    </Col>
                    <RenderIf render={values?.experience_level !== 'fresher'}>
                      <Col sm={6} md={6} lg={4}>
                        <Field
                          component={CustomCurrencyInput}
                          name="current_salary"
                          label="Current Salary"
                          placeholder="Enter current salary"
                          type="number"
                          requiredField
                          disabled={fieldDisableCase_1}
                        />
                      </Col>
                    </RenderIf>
                    <Col sm={6} md={6} lg={4}>
                      <Field
                        component={CustomCurrencyInput}
                        name="max_salary"
                        label="Max Salary(In Hand)"
                        value={salaryFiltered?.max_salary || ''}
                        placeholder="Enter max salary"
                        type="number"
                        requiredField
                        disabled
                      />
                    </Col>
                    <Col sm={6} md={6} lg={4}>
                      <Field
                        component={CustomCurrencyInput}
                        name="preferred_salary"
                        label="Preferred Salary"
                        placeholder="Enter preferred salary"
                        type="number"
                        requiredField
                        disabled={fieldDisableCase_1}
                      />
                    </Col>
                    <Col sm={6} md={6} lg={4}>
                      <Field
                        component={CustomCurrencyInput}
                        name="hr_negotiable_salary"
                        label={
                          isSeniorHr ? 'Negotiated Salary' : 'Negotiable Salary'
                        }
                        placeholder="Enter negotiable salary"
                        type="number"
                        requiredField
                        disabled={fieldDisableCase_1}
                      />
                    </Col>
                    <RenderIf
                      render={
                        isSeniorHr ||
                        salaryOfferedByHrAndSrHrData?.[0]
                          ?.sr_hr_negotiable_salary ||
                        currentInterviewStep?.application_status_id === 4
                      }
                    >
                      <Col sm={6} md={6} lg={4}>
                        <Field
                          component={CustomCurrencyInput}
                          name="sr_hr_negotiable_salary"
                          label={
                            !isSeniorHr &&
                            (salaryOfferedByHrAndSrHrData?.[0]
                              ?.sr_hr_negotiable_salary ||
                              currentInterviewStep?.application_status_id === 4)
                              ? 'Negotiated Salary From Super Admin'
                              : 'Negotiable Salary From Super Admin'
                          }
                          placeholder="Enter negotiable salary"
                          type="number"
                          requiredField
                          disabled={!isSeniorHr || fieldDisableCase_1}
                        />
                      </Col>
                    </RenderIf>
                  </Row>
                  <div>
                    <h5 className="mb-0 text-primary">Add Remark</h5>
                    <hr className="primary_divider mt-1" />
                    <Row>
                      <Col sm={12}>
                        <Field
                          component={CustomReactSelect}
                          options={remarkDropdown}
                          name="remark_id"
                          label="Remark Title"
                          placeholder={
                            remarkDropdownLoading ? 'Loading...' : 'Select'
                          }
                          requiredField
                          disabled={
                            (currentInterviewStep?.application_status_id ===
                              4 &&
                              currentInterviewStep?.status === 1) ||
                            (currentInterviewStep?.application_status_id ===
                              4 &&
                              currentInterviewStep?.status === 2)
                          }
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
                  </div>
                  <RenderIf render={currentInterviewStep?.status === 0}>
                    <div className="d-flex justify-content-end gap-2">
                      {/* <RenderIf render={Number(interviewProcessData?.is_onboarding_revised) === 1}>
                      <button
                        className="btn btn-shadow-light px-4"
                        type="button"
                        onClick={handelBackJobOfferOnboarding}
                      >
                        Back
                      </button>
                    </RenderIf> */}
                      {currentInterviewStep?.application_status_id === 4 ? (
                        <button
                          className="btn btn-dark px-4"
                          type="submit"
                          onClick={() => setClickFor('onBoardingReviseOffer')}
                          disabled={
                            isLoading?.onBoardingProcess &&
                            clickFor === 'onBoardingReviseOffer'
                          }
                        >
                          {isLoading?.onBoardingProcess &&
                          clickFor === 'onBoardingReviseOffer' ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Revise Offer'
                          )}
                        </button>
                      ) : (
                        <RenderIf
                          render={
                            !isSeniorHr &&
                            values?.hr_negotiable_salary <
                              values?.preferred_salary
                          }
                        >
                          <button
                            className="btn btn-dark px-4"
                            type="submit"
                            onClick={() => setClickFor('submitForApproval')}
                            disabled={
                              (Number(
                                interviewProcessData?.is_onboarding_revised
                              ) !== 1 &&
                                salaryOfferedByHrAndSrHrData?.[0]
                                  ?.offer_status === 0) ||
                              (isLoading?.jobOfferProcess &&
                                clickFor === 'submitForApproval')
                            }
                          >
                            {isLoading?.jobOfferProcess &&
                            clickFor === 'submitForApproval' ? (
                              <Spinner animation="border" size="sm" />
                            ) : salaryOfferedByHrAndSrHrData?.length ? (
                              'Revise Offer'
                            ) : (
                              'Submit For Approval'
                            )}
                          </button>
                        </RenderIf>
                      )}
                      <RenderIf
                        render={
                          isSeniorHr &&
                          salaryOfferedByHrAndSrHrData?.length &&
                          salaryOfferedByHrAndSrHrData?.[0]?.offer_status === 0
                        }
                      >
                        <button
                          className="btn btn-dark px-4"
                          type="submit"
                          onClick={() => setClickFor('submittedBySrHr')}
                          disabled={
                            isLoading?.jobOfferProcess &&
                            clickFor === 'submittedBySrHr'
                          }
                        >
                          {isLoading?.jobOfferProcess &&
                          clickFor === 'submittedBySrHr' ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </RenderIf>
                      {currentInterviewStep?.application_status_id === 4 ? (
                        <button
                          className="btn btn-dark px-4"
                          type="submit"
                          onClick={() => setClickFor('completeOnboarding')}
                          disabled={
                            isLoading?.onBoardingProcess &&
                            clickFor === 'completeOnboarding'
                          }
                        >
                          {isLoading?.onBoardingProcess &&
                          clickFor === 'completeOnboarding' ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Complete Onboarding'
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-dark px-4"
                          type="submit"
                          onClick={() => setClickFor('sendJoiningForm')}
                          disabled={
                            isLoading?.jobOfferProcess &&
                            clickFor === 'sendJoiningForm'
                          }
                        >
                          {isLoading?.jobOfferProcess &&
                          clickFor === 'sendJoiningForm' ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Send Joining Form'
                          )}
                        </button>
                      )}

                      <button
                        className="btn btn-danger text-light px-3"
                        type="submit"
                        onClick={() =>
                          setClickFor(
                            currentInterviewStep?.application_status_id === 4
                              ? 'rejectForOnBoarding'
                              : 'reject'
                          )
                        }
                        disabled={
                          (isLoading?.jobOfferProcess &&
                            clickFor === 'reject') ||
                          (isLoading?.onBoardingProcess &&
                            clickFor === 'rejectForOnBoarding')
                        }
                      >
                        {(isLoading?.jobOfferProcess &&
                          clickFor === 'reject') ||
                        (isLoading?.onBoardingProcess &&
                          clickFor === 'rejectForOnBoarding') ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  </RenderIf>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </RenderIf>
      <div className="mt-3">
        <SalaryNegotiationActivity />
      </div>
    </>
  );
}

export default memo(JobOfferOnBoarding);
