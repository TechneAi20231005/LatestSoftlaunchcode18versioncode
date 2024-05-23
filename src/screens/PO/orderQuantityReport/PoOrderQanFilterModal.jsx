import React from 'react';
import { Field, Formik } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';

// // static import
import {
  CustomReactDatePicker,
  CustomReactSelect,
} from '../../../components/custom/inputs/CustomInputs';
import CustomModal from '../../../components/custom/modal/CustomModal';

function PoOrderQanFilterModal({ open, onClose }) {
  //  dropdown data
  const venderData = [
    { label: 'Select', value: '' },
    { label: 'vender 1', value: 'vender_1' },
    { label: 'vender 2', value: 'vender_2' },
    { label: 'vender 3', value: 'vender_3' },
    { label: 'vender_3_vender_1_vender_2', value: 'vender_4' },
  ];
  const categoryData = [
    { label: 'Select', value: '' },
    { label: 'category 1', value: 'category_1' },
    { label: 'category 2', value: 'category_2' },
    { label: 'category 3', value: 'category_3' },
    { label: 'category_3_category_1_category_2', value: 'category_4' },
  ];
  return (
    <>
      <CustomModal show={open} title="All Basket" width="sm" onClose={onClose}>
        <Formik
          initialValues={{ delivery_date: [], category: [], vender_name: [] }}
          enableReinitialize
          onSubmit={values => {
            console.log(values);
          }}
        >
          {({ resetForm, dirty }) => (
            <Form>
              <Row className="row_gap_3">
                <Col sm={12}>
                  <Field
                    component={CustomReactDatePicker}
                    type="date"
                    name="delivery_date"
                    label="Delivery Date :"
                    placeholderText="mm/dd/yyyy"
                    range
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomReactSelect}
                    options={categoryData}
                    name="vender_name"
                    label="Vender Name :"
                    placeholder="Select"
                    isSearchable
                    isMulti
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomReactSelect}
                    options={venderData}
                    name="vender_name"
                    label="Vender Name :"
                    placeholder="Select"
                    isSearchable
                    isMulti
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3 gap-2">
                <button
                  className="btn btn-info text-white"
                  type="reset"
                  disabled={!dirty}
                  onClick={resetForm}
                >
                  <i className="icofont-refresh text-white" /> Reset
                </button>
                <button className="btn btn-warning text-white" type="submit" disabled={!dirty}>
                  <i className="icofont-search-1 " /> Search
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default PoOrderQanFilterModal;
