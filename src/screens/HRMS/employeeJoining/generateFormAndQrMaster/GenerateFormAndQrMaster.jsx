import React, { useReducer, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { QRCode } from 'react-qrcode-logo';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import {
  CustomInput,
  CustomReactSelect
} from '../../../../components/custom/inputs/CustomInputs';
import './style.scss';
import Select from 'react-select';

function GenerateFormAndQrMaster() {
  // // initial state
  const formInitialValue = {
    tenant_name: '',
    source_name: '',
    job_opening_id: [],
    theme_color: '',
    company_name_color: '',
    requiter_email_id: '',
    requiter_contact_no: ''
  };

  // // local state
  const [formData, setFormData] = useState({});
  const [qrStyleData, setQrStyleData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { qrColor: '#000', qrType: 'squares' }
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
  const qrStyleOptions = [
    { label: 'Squares', value: 'squares' },
    { label: 'Dots', value: 'dots' },
    { label: 'Fluid', value: 'fluid' }
  ];

  return (
    <Container fluid>
      <PageHeader headerTitle="Generate QR Code" />
      <Row className="mt-2 row_gap_3 generate_from_qr_container">
        <Col xs={12} sm={6} md={7} xxl={8} className="pe-sm-0 form_container">
          <Card className="w-100">
            <CardBody>
              <Formik initialValues={formInitialValue}>
                {({ dirty, values }) => {
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
                            <Field
                              component={CustomInput}
                              type="color"
                              name="company_name_color"
                              label="Company Name Color"
                              placeholder="Enter Company Color"
                              requiredField
                            />
                          </Col>
                        </Row>
                        <Field
                          component={CustomInput}
                          type="email"
                          name="requiter_email_id"
                          label="Requiter Email ID"
                          placeholder="Enter Requiter Email Id"
                        />
                        <Field
                          component={CustomInput}
                          type="number"
                          name="requiter_contact_no"
                          label="Requiter Contact Number"
                          placeholder="Enter Requiter Contact Number"
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
                  value="https://example.com"
                  logoImage="https://example.com/logo.png"
                  fgColor={qrStyleData?.qrColor}
                  qrStyle={qrStyleData?.qrType}
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
