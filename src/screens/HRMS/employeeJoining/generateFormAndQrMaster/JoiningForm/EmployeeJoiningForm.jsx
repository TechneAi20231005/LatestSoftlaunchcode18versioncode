import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Container, Col, Row, Stack, Spinner } from 'react-bootstrap';
import {
  CustomCurrencyInput,
  CustomDropdown,
  CustomInput,
  CustomReactSelect
} from '../../../../../components/custom/inputs/CustomInputs';
import RenderIf from '../../../../../utils/RenderIf';
import { employeeJoiningValidation } from './validation';
import Header from '../../../../../components/Common/EmployeeFormHeader/Header';
import './style.scss';

function EmployeeJoiningForm({ data }) {
  // // initial state
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
    resume_path: null
  };

  // dropdown data
  const preferredRole = [];

  const preferredLocation = [];

  const sourceType = data?.source?.map((item) => {
    return {
      label: item?.source_name,
      value: item?.id
    }
  });


  const experienceLevel = [
    { label: 'Fresher', value: 'fresher' },
    { label: '0-1 years of experience', value: '0-1' },
    { label: '1-3 years of experience', value: '1-3' },
    { label: '3-5 years of experience', value: '3-5' },
    { label: '5+ years of experience', value: '5+' }
  ];


  return (
    <>
      <Header
        mobileNo={data?.contact_no || ''}
        emailId={data?.email_id || ''}
        themeColor={data?.theme_color || ''}
        logo={data?.logo_image || ''}
        companyName={data?.company_name}
      />
      <Container fluid className="form_containers py-3 sm-py-4">
        <h1
          style={{ borderBottom: `3px solid ${data?.theme_color}` }}
          className="heading"
        >
          Online Application Form
        </h1>
        <Formik
          initialValues={candidatesInitialValue}
          onSubmit={(values, { resetForm }) => {
          }}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <Stack gap={4}>
                <Row className="row_gap_3">
                  <Col sm={6} md={6}>
                    <Field
                      data={sourceType}
                      component={CustomDropdown}
                      name="source_id"
                      label="Source"
                      // placeholder={QrFormLoading ? "Loading..." : "Select"}
                      requiredField
                      value={data?.source_id}
                      disabled
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
                      name="expected_ctc"
                      label="Expected Monthly Salary (Net)"
                      placeholder="Enter expected monthly salary"
                      type="number"
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Field
                      component={CustomCurrencyInput}
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
                        errors.resume_path && touched.resume_path
                          ? 'is-invalid'
                          : ''
                      }`}
                      onChange={(event) => {
                        setFieldValue(
                          'resume_path',
                          event.currentTarget.files[0]
                        );
                      }}
                      accept=".jpg, .jpeg, .png, .pdf, .docx,"
                    />
                    <RenderIf
                      render={errors.resume_path && touched.resume_path}
                    >
                      <div className="invalid-feedback">
                        {errors.resume_path}
                      </div>
                    </RenderIf>
                  </Col>
                </Row>

                <button
                  style={{ backgroundColor: data?.theme_color }}
                  className="btn px-4"
                  type="submit"
                  disabled
                >
                  Apply Now
                </button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
}

export default EmployeeJoiningForm;
