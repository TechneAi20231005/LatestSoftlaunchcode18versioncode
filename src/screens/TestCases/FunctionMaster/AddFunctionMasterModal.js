import React from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import {
  CustomInput,
  CustomRadioButton,
} from "../../../components/custom/inputs/CustomInputs";
import { RenderIf } from "../../../utils";

import {
  addFunctionMasterThunk,
  editFunctionMasterThunk,
  getFunctionMasterListThunk,
} from "../../../redux/services/testCases/functionMaster";
import { addFunctionMasterValidation } from "./Validation/AddFunctionMaster";
import CustomModal from "../../../components/custom/modal/CustomModal";

function AddFunctionMasterModal({ show, close, type, currentFunctionData }) {
  const dispatch = useDispatch();
  const addEditFunctionInitialValue = {
    function_name: type === "EDIT" ? currentFunctionData?.function_name : "",
    remark: type === "EDIT" ? currentFunctionData?.remark || "" : "",
    is_active: type === "EDIT" ? currentFunctionData?.is_active?.toString() : 1,
  };

  // // function

  const handleAddEditFunction = ({ formData }) => {
    if (type === "ADD") {
      dispatch(
        addFunctionMasterThunk({
          formData: formData,
          onSuccessHandler: () => {
            close();
            dispatch(getFunctionMasterListThunk());
          },
          onErrorHandler: () => {},
        })
      );
    } else {
      dispatch(
        editFunctionMasterThunk({
          currentId: currentFunctionData?.id,
          formData: formData,
          onSuccessHandler: () => {
            close();
            dispatch(getFunctionMasterListThunk());
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
        title={`${type === "ADD" ? "Add" : "Edit"} Function Master`}
        width="md"
      >
        <Formik
          initialValues={addEditFunctionInitialValue}
          validationSchema={addFunctionMasterValidation}
          onSubmit={(values) => {
            handleAddEditFunction({ formData: values });
          }}
        >
          {({ dirty }) => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="function_name"
                    label="Function Title"
                    placeholder="Enter Function Title"
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

export default AddFunctionMasterModal;
