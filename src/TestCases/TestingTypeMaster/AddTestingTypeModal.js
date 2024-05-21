import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import CustomModal from "../../components/custom/modal/CustomModal";
import { CustomInput } from "../../components/custom/inputs/CustomInputs";
import { addTestingType } from "./Validation/AddTestingType";

function AddTestingTypeModal({ show, close }) {
  // // initial state
  const dispatch = useDispatch();

  const testingTypeInitialValues = {
    title: "",
    remark: "",
  };

  const handleTestingType = (formData) => {
    console.log("form", formData);
    const candidatesData = new FormData();
  };
  return (
    <>
      <CustomModal show={show} title="Add Testing Type" width="md">
        <Formik
          initialValues={testingTypeInitialValues}
          validationSchema={addTestingType}
          onSubmit={(values) => {
            console.log("val", values);
            handleTestingType(values);
            // setOtpModal(true);
          }}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="title"
                    label="Testing Type Title"
                    placeholder="Enter Reviewer Comment Title"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark"
                    label="Remark"
                    placeholder="Enter Remark"
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-dark px-4" type="submit">
                  Save
                </button>
                <button
                  onClick={() => close()}
                  className="btn btn-shadow-light px-3"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default AddTestingTypeModal;
