import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../components/custom/modal/CustomModal";
import {
  CustomDropdown,
  CustomInput,
  CustomTextArea,
} from "../../components/custom/inputs/CustomInputs";
import { editTestCaseValidation } from "./Validation/EditTestCase";
import { downloadFormatFile } from "./Validation/DownloadFormatFile";

function DownloadFormatFileModal({ show, close }) {
  // // initial state
  const dispatch = useDispatch();

  const downloadFormatInitialValue = {
    project_name: "",
    module_name: "",
    submodule_name: "",
  };

  const handleDownloadFormatFile = (formData) => {
    const candidatesData = new FormData();
  };
  return (
    <>
      <CustomModal show={show} title="Download Format File" width="lg">
        <Formik
          initialValues={downloadFormatInitialValue}
          validationSchema={downloadFormatFile}
          onSubmit={(values) => {
            console.log("val", values);
            handleDownloadFormatFile(values);
            // setOtpModal(true);
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
                    // placeholder={isDesignationMasterList === 'loading' ? 'Loading...' : 'Select'}
                    // disabled={type === "VIEW"}
                  />
                </Col>
                <Col md={4} lg={4}>
                  <Field
                    // data={experienceLevel}
                    component={CustomDropdown}
                    name="submodule_name"
                    label="SubModule Name"
                    placeholder="Select"
                    // disabled={type === "VIEW"}
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{ backgroundColor: " #198754", color: "white" }}
                >
                  Download CSV
                </button>
                <button
                  type="button"
                  className="btn btn shadow p-2"
                  style={{ backgroundColor: " white", color: "black" }}
                  onClick={() => close()}
                >
                  Cancel
                </button>
              </div>
              {/* </Stack> */}
            </Form>
          )}
        </Formik>
      </CustomModal>
      {/* <OtpVerificationModal
        show={otpModal}
        close={() => setOtpModal(false)}
        addCandidateClose={close}
      /> */}
    </>
  );
}

export default DownloadFormatFileModal;
