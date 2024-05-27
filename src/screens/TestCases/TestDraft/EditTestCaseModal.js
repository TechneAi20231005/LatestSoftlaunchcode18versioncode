import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../../components/custom/modal/CustomModal";
import {
  CustomDropdown,
  CustomInput,
  CustomTextArea,
} from "../../../components/custom/inputs/CustomInputs";
import { editTestCaseValidation } from "./Validation/EditTestCase";

function EditTestCaseModal({ show, close }) {
  // // initial state
  const dispatch = useDispatch();

  const testCaseInitialValue = {
    project_name: "",
    module_name: "",
    submodule_name: "",
    function: "",
    field: "",
    testing_type: "",
    testing_group: "",
    test_id: "",
    severity: "",
    steps: "",
    test_description: "",
    expected_result: "",
  };

  const handelAddCandidates = (formData) => {
    const candidatesData = new FormData();
  };
  return (
    <>
      <CustomModal show={show} title="Edit Test Case" width="lg">
        <Formik
          initialValues={testCaseInitialValue}
          validationSchema={editTestCaseValidation}
          onSubmit={(values) => {
            handelAddCandidates(values);
          }}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <Form>
              {/* <Stack gap={3}> */}
              <Row className="row_gap_3">
                <Col md={4} lg={4}>
                  <Field
                    // data={departmentType}
                    component={CustomDropdown}
                    name="project_name"
                    label="Project Name"
                    // placeholder={
                    //   isDepartmentDataListLoading === 'loading' ? 'Loading...' : 'Select'
                    // }
                    // disabled={type === "VIEW"}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    // data={designationType}
                    component={CustomDropdown}
                    name="module_name"
                    label="Module Name"
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    // data={experienceLevel}
                    component={CustomDropdown}
                    name="submodule_name"
                    label="SubModule Name"
                    placeholder="Select"
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="function"
                    label="Function"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>

                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="field"
                    label="Field"
                    placeholder="Enter referred by name"
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="testing_type"
                    label="Testing Type"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="testing_group"
                    label="Testing Group"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="test_id"
                    label="Test Id"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    component={CustomInput}
                    name="severity"
                    label="Severity"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="steps"
                    label="Steps"
                    placeholder="Enter referred by name"
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="test_description"
                    label="Test Description"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>

                <Col md={6} lg={6}>
                  <Field
                    component={CustomTextArea}
                    name="expected_result"
                    label="Expected Result"
                    placeholder="Enter referred by name"
                    requiredField
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-dark px-4" type="submit">
                  Update
                </button>
                <button
                  onClick={close}
                  className="btn btn-shadow-light px-3"
                  type="button"
                >
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default EditTestCaseModal;
