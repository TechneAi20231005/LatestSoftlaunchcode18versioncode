import React from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// // static import
import { CustomInput, CustomReactSelect } from '../../../components/custom/inputs/CustomInputs';
import { generatePoFilterValidation } from '../validation/generatePoFilter';
import './style.scss';

function GeneratePo() {
  // // initial state
  const navigate = useNavigate();

  //  demo data
  const venderData = [
    { label: 'Select', value: '' },
    { label: 'vender 1', value: 'vender_1' },
    { label: 'vender 2', value: 'vender_2' },
    { label: 'vender 3', value: 'vender_3' },
    { label: 'vender_3_vender_1_vender_2', value: 'vender_4' },
  ];

  return (
    <Container fluid className="generate_po_container">
      <h3 className="fw-bold text_primary "> Generate PO</h3>
      <Stack gap={3}>
        <a href="/path/to/bulk/upload/format/file" className="btn btn-dark w-100" download>
          <i className="icofont-download me-2 fs-6" />
          PO Bulk Upload File
        </a>
        <Formik
          initialValues={{ vender_name: '', delivery_date: '' }}
          enableReinitialize
          validationSchema={generatePoFilterValidation}
          onSubmit={values => {
            navigate(`${values?.vender_name}`, { state: { generatePoFilter: values } });
          }}
        >
          {({ resetForm }) => (
            <Form>
              <Row className="row_gap_3">
                <Col sm={6}>
                  <Field
                    component={CustomReactSelect}
                    options={venderData}
                    name="vender_name"
                    label="Vender Name :"
                    placeholder="Select"
                    requiredField
                    isSearchable
                  />
                </Col>
                <Col sm={6}>
                  <Field
                    component={CustomInput}
                    type="date"
                    name="delivery_date"
                    label="Delivery Date :"
                    requiredField
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Proceed
                </button>
                <button className="btn btn-info text-white px-4" type="button" onClick={resetForm}>
                  <i className="icofont-refresh text-white" /> Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Stack>
    </Container>
  );
}

export default GeneratePo;
