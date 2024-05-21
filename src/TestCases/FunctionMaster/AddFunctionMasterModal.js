import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import CustomModal from "../../components/custom/modal/CustomModal";
import { CustomInput } from "../../components/custom/inputs/CustomInputs";
import { addFunctionMasterValidation } from "./Validation/AddFunctionMaster";

function AddFunctionMasterModal({ show, close }) {
  // // initial state
  const dispatch = useDispatch();

  const functionMasterInitialValues = {
    title: "",
    remark: "",
  };

  const handleFunctionMaster = (formData) => {
    console.log("form", formData);
    const candidatesData = new FormData();
  };
  return (
    <>
      <CustomModal show={show} title="Add Testing Type" width="md">
        <Formik
          initialValues={functionMasterInitialValues}
          validationSchema={addFunctionMasterValidation}
          onSubmit={(values) => {
            console.log("val", values);
            handleFunctionMaster(values);
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
                    label="Testing Group Title"
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

export default AddFunctionMasterModal;
