import React from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import CustomModal from "../../../components/custom/modal/CustomModal";
import {
  CustomInput,
  CustomRadioButton,
} from "../.././../components/custom/inputs/CustomInputs";
import { addTestingType } from "./Validation/AddTestingType";
import { RenderIf } from "../../../utils";

import {
  addTestingTypeMasterThunk,
  editTestingTypeMasterThunk,
  getTestingTypeMasterListThunk,
} from "../../../redux/services/testCases/testingTypeMaster";

function AddTestingTypeModal({ show, close, type, currentTestingTypeData }) {
  const dispatch = useDispatch();
  const addEditTestingTypeInitialValue = {
    type_name: type === "EDIT" ? currentTestingTypeData?.type_name : "",
    remark: type === "EDIT" ? currentTestingTypeData?.remark || "" : "",
    is_active:
      type === "EDIT" ? currentTestingTypeData?.is_active?.toString() : 1,
  };

  // // function

  const handleAddEditTestingType = ({ formData }) => {
    if (type === "ADD") {
      dispatch(
        addTestingTypeMasterThunk({
          formData: formData,
          onSuccessHandler: () => {
            close();
            dispatch(getTestingTypeMasterListThunk());
          },
          onErrorHandler: () => {},
        })
      );
    } else {
      dispatch(
        editTestingTypeMasterThunk({
          currentId: currentTestingTypeData?.id,
          formData: formData,
          onSuccessHandler: () => {
            close();
            dispatch(getTestingTypeMasterListThunk());
          },
          onErrorHandler: () => {},
        })
      );
    }
  };

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === "ADD" ? "Add" : "Edit"} Testing Type`}
        width="md"
      >
        <Formik
          initialValues={addEditTestingTypeInitialValue}
          validationSchema={addTestingType}
          onSubmit={(values) => {
            handleAddEditTestingType({ formData: values });
          }}
        >
          {({ dirty }) => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="type_name"
                    label="Testing Type Title"
                    placeholder="Enter Testing Type Title"
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

                <RenderIf render={type === "EDIT"}>
                  <div className="d-flex align-items-center mt-3">
                    <p className="mb-2 pe-2">
                      Status<span className="mendatory_sign">*</span> :
                    </p>
                    <Field
                      component={CustomRadioButton}
                      type="radio"
                      name="is_active"
                      label="Active"
                      value="1"
                      inputClassName="me-1"
                    />
                    <Field
                      component={CustomRadioButton}
                      type="radio"
                      name="is_active"
                      label="Deactive"
                      value="0"
                      inputClassName="me-1"
                    />
                  </div>
                </RenderIf>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-dark px-4"
                  type="submit"
                  disabled={!dirty}
                >
                  {type === "ADD" ? "Save" : "Update"}
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
