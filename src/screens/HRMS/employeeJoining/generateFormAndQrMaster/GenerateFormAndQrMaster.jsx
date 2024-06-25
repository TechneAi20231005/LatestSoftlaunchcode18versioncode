import React, { useReducer, useRef, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { QRCode } from 'react-qrcode-logo';
import Select from 'react-select';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import {
  CustomInput,
  CustomRadioButton,
  CustomReactSelect
} from '../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../utils';
import { generateFormValidation } from './validation';
import './style.scss';

function GenerateFormAndQrMaster() {
  // // initial state
  const qrRef = useRef(null);
  const formInitialValue = {
    tenant_name: '',
    source_name: '',
    job_opening_id: [],
    branch_id: [],
    branding_type: 'logo',
    logo: '',
    company_name: '',
    theme_color: '',
    company_name_color: '',
    recruiter_email_id: '',
    recruiter_contact_no: ''
  };

  // // local state
  const [formData, setFormData] = useState({});
  const [qrStyleData, setQrStyleData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { qrColor: '#000', qrType: 'squares', logoPath: '' }
  );

  // // dropdown data
  const tenantData = [
    { label: 'Select', value: '', isDisabled: true },
    { label: 'tenant 1', value: 'tenant_1' },
    { label: 'tenant 2', value: 'tenant_2' },
    { label: 'tenant 3', value: 'tenant_3' },
    { label: 'tenant_3_tenant_1_tenant_2', value: 'tenant_4' }
  ];

  const sourceData = [
    { label: 'Select', value: '', isDisabled: true },
    { label: 'source 1', value: 'source_1' },
    { label: 'source 2', value: 'source_2' },
    { label: 'source 3', value: 'source_3' },
    { label: 'source_3_source_1_source_2', value: 'source_4' }
  ];

  const jobOpeningData = [
    { label: 'Select', value: '', isDisabled: true },
    { label: 'jobOpening 1', value: 'jobOpening_1' },
    { label: 'jobOpening 2', value: 'jobOpening_2' },
    { label: 'jobOpening 3', value: 'jobOpening_3' },
    { label: 'jobOpening_3_jobOpening_1_jobOpening_2', value: 'jobOpening_4' }
  ];

  const locationData = [
    { label: 'Select', value: '', isDisabled: true },
    { label: 'location 1', value: 'location_1' },
    { label: 'location 2', value: 'location_2' },
    { label: 'location 3', value: 'location_3' },
    { label: 'location_3_location_1_location_2', value: 'location_4' }
  ];

  const qrStyleOptions = [
    { label: 'Squares', value: 'squares' },
    { label: 'Dots', value: 'dots' },
    { label: 'Fluid', value: 'fluid' }
  ];

  // // all handler
  const downloadQrCode = () => {
    const canvas = qrRef.current?.canvasRef?.current;
    if (canvas) {
      const pngUrl = canvas
        ?.toDataURL('image/png')
        ?.replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${formData?.tenant_name} QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  // console.log(formData);
  // console.log(qrStyleData);

  return (
    <Container fluid>
      <PageHeader headerTitle="Generate QR Code" />
      <Row className="mt-2 row_gap_3 generate_from_qr_container">
        <Col xs={12} sm={6} md={7} xxl={8} className="pe-sm-0 form_container">
          <Card className="w-100">
            <CardBody>
              <Formik
                initialValues={formInitialValue}
                validationSchema={generateFormValidation}
                onSubmit={(values, errors) => {
                  // console.log(errors);
                }}
              >
                {({ dirty, values, errors, touched, setFieldValue }) => {
                  setFormData(values);
                  return (
                    <Form>
                      <Stack gap={3}>
                        <Field
                          options={tenantData}
                          component={CustomReactSelect}
                          name="tenant_name"
                          label="Tenant Name"
                          placeholder="Select"
                          requiredField
                        />
                        <Field
                          options={sourceData}
                          component={CustomReactSelect}
                          name="source_name"
                          label="Source"
                          placeholder="Select"
                          requiredField
                        />
                        <Field
                          options={jobOpeningData}
                          component={CustomReactSelect}
                          name="job_opening_id"
                          label="Job Opening For"
                          placeholder="Select"
                          requiredField
                          isMulti
                        />
                        <Field
                          options={locationData}
                          component={CustomReactSelect}
                          name="branch_id"
                          label="Job Location"
                          placeholder="Select"
                          requiredField
                          isMulti
                        />
                        <div>
                          <div className="branding_type_container">
                            <Field
                              component={CustomRadioButton}
                              type="radio"
                              name="branding_type"
                              label="Select Logo"
                              value="logo"
                              inputClassName="me-1"
                              className="ms-0"
                            />
                            <Field
                              component={CustomRadioButton}
                              type="radio"
                              name="branding_type"
                              label="Enter Company Name"
                              value="text"
                              inputClassName="me-1"
                            />
                          </div>
                          <RenderIf render={values.branding_type === 'logo'}>
                            {/* <Field
                              component={CustomInput}
                              type="file"
                              name="logo"
                              withOutLabel
                            /> */}
                            <input
                              type="file"
                              name="logo"
                              className={`form-control ${
                                errors.logo && touched.logo ? 'is-invalid' : ''
                              }`}
                              accept="image/*"
                              onChange={(event) => {
                                setFieldValue('logo', event.target.files[0]);
                                setQrStyleData({
                                  logoPath: URL.createObjectURL(
                                    event.target.files[0]
                                  )
                                });
                              }}
                            />
                            <RenderIf render={errors.logo && touched.logo}>
                              <div className="invalid-feedback">
                                {errors.logo}
                              </div>
                            </RenderIf>
                          </RenderIf>
                          <RenderIf render={values.branding_type === 'text'}>
                            <Field
                              component={CustomInput}
                              type="text"
                              name="company_name"
                              withOutLabel
                              placeholder="Enter Company Name"
                            />
                          </RenderIf>
                        </div>
                        <Row className="row_gap_3">
                          <Col sm={6}>
                            <Field
                              component={CustomInput}
                              type="color"
                              name="theme_color"
                              label="Theme Color"
                              placeholder="Enter Theme Color"
                              requiredField
                            />
                          </Col>
                          <Col sm={6}>
                            <RenderIf render={values.branding_type === 'text'}>
                              <Field
                                component={CustomInput}
                                type="color"
                                name="company_name_color"
                                label="Company Name Color"
                                placeholder="Enter Company Color"
                                requiredField
                              />
                            </RenderIf>
                          </Col>
                        </Row>
                        <Field
                          component={CustomInput}
                          type="email"
                          name="recruiter_email_id"
                          label="Recruiter Email ID"
                          placeholder="Enter Recruiter Email Id"
                        />
                        <Field
                          component={CustomInput}
                          type="number"
                          name="recruiter_contact_no"
                          label="Recruiter Contact Number"
                          placeholder="Enter Recruiter Contact Number"
                        />
                        <button
                          type="submit"
                          className="btn btn-dark ms-0"
                          disabled={!dirty}
                        >
                          Generate Application Form
                        </button>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={5} xxl={4} className="qr_container">
          <Card className="w-100">
            <CardBody className="w-100 d-flex flex-column gap-3 justify-content-center">
              <div className="d-flex align-items-center gap-3">
                <QRCode
                  ref={qrRef}
                  value="https://example.com"
                  // size={250}
                  logoImage={qrStyleData?.logoPath}
                  fgColor={qrStyleData?.qrColor}
                  qrStyle={qrStyleData?.qrType}
                  logoHeight={55}
                  logoWidth={55}
                  // logoOpacity={0.95}
                  eyeRadius={10}
                  logoPaddingStyle="circle"
                  removeQrCodeBehindLogo={true}
                />
                <Stack className="justify-content-between">
                  <i
                    className="icofont-qr-code fs-1 text-primary cp"
                    onClick={(e) => setQrStyleData({ qrColor: '#484c7f' })}
                  />
                  <i
                    className="icofont-qr-code fs-1 text-secondary cp"
                    onClick={(e) => setQrStyleData({ qrColor: '#f19828' })}
                  />
                  <i
                    className="icofont-qr-code fs-1 text-danger cp"
                    onClick={(e) => setQrStyleData({ qrColor: '#dc3545' })}
                  />
                  <i
                    className="icofont-qr-code fs-1 text-info cp"
                    onClick={(e) => setQrStyleData({ qrColor: '#0dcaf0' })}
                  />
                  <i
                    className="icofont-qr-code fs-1 cp"
                    onClick={(e) => setQrStyleData({ qrColor: '#000000' })}
                  />
                </Stack>
              </div>
              <div className="d-flex align-items-center btn_container">
                <button
                  type="button"
                  className="btn btn-dark ms-0 w-100"
                  disabled={!formData?.source_name || !formData?.tenant_name}
                  onClick={downloadQrCode}
                >
                  <i className="icofont-download me-2" />
                  Download
                </button>
                <Select
                  options={qrStyleOptions}
                  className="w-100"
                  onChange={(e) => setQrStyleData({ qrType: e.value })}
                  defaultValue={qrStyleOptions[0]}
                />
                <label>
                  <input
                    type="color"
                    onChange={(e) =>
                      setQrStyleData({ qrColor: e.target.value })
                    }
                  />
                  <i className="icofont-paint text-light rounded cp" />
                </label>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default GenerateFormAndQrMaster;
