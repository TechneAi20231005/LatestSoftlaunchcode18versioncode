import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import CustomModal from "../../../components/custom/modal/CustomModal";
import {
  CustomInput,
  CustomRadioButton,
} from "../../../components/custom/inputs/CustomInputs";
import CustomAlertModal from "../../../components/custom/modal/CustomAlertModal";
import { RenderIf } from "../../../utils";
import {
  addTestingGroupMasterThunk,
  editTestingGroupMasterThunk,
  getTestingGroupMasterListThunk,
} from "../../../redux/services/testCases/testingGroupMaster";
import { addTestingGroupValidation } from "./Validation/AddTestingGroup";

function AddTestingGroupModal({ show, close, type, currentTestingGroupData }) {
  const dispatch = useDispatch();
  const addEditTestingGroupInitialValue = {
    group_name: type === "EDIT" ? currentTestingGroupData?.group_name : "",
    remark: type === "EDIT" ? currentTestingGroupData?.remark || "" : "",
    is_active:
      type === "EDIT" ? currentTestingGroupData?.is_active?.toString() : 1,
  };

  // // redux state
  const { isLoading } = useSelector((state) => state?.testingGroupMaster);

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    formData: "",
  });
  // // function

  const handleAddEditTestingGroup = () => {
    if (type === "ADD") {
      dispatch(
        addTestingGroupMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getTestingGroupMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        })
      );
    } else {
      dispatch(
        editTestingGroupMasterThunk({
          currentId: currentTestingGroupData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getTestingGroupMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        })
      );
    }
  };

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === "ADD" ? "Add" : "Edit"} Testing Group`}
        width="md"
      >
        <Formik
          initialValues={addEditTestingGroupInitialValue}
          validationSchema={addTestingGroupValidation}
          onSubmit={(values) => {
            setOpenConfirmModal({ open: true, formData: values });
          }}
        >
          {({ dirty }) => (
            <Form>
              <Row className="gap-3">
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="group_name"
                    label="Testing Group Title"
                    placeholder="Enter Testing Group Title"
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

      <CustomAlertModal
        show={openConfirmModal?.open}
        type="success"
        message={`Do you want to ${
          type === "ADD" ? "save" : "update"
        } this record?`}
        onSuccess={handleAddEditTestingGroup}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={
          isLoading?.addTestingGroupMaster || isLoading?.editTestingGroupMaster
        }
      />
    </>
  );
}

export default AddTestingGroupModal;
