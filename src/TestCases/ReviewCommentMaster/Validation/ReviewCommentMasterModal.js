import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addReviewCommentValidation } from "./AddReviewComment";
import CustomModal from "../../../components/custom/modal/CustomModal";
import {
  CustomInput,
  CustomRadioButton,
} from "../../../components/custom/inputs/CustomInputs";
import CustomAlertModal from "../../../components/custom/modal/CustomAlertModal";
import {
  addReviewCommentMasterThunk,
  editReviewCommentMasterThunk,
  getReviewCommentMasterListThunk,
} from "../../../redux/services/testCases/reviewCommentMaster";
import { RenderIf } from "../../../utils";

function ReviewCommentMasterModal({
  show,
  close,
  type,
  currentReviewCommentData,
}) {
  const dispatch = useDispatch();
  const addEditReviewCommentInitialValue = {
    reviewer_comment:
      type === "EDIT" ? currentReviewCommentData?.reviewer_comment : "",
    remark: type === "EDIT" ? currentReviewCommentData?.remark || "" : "",
    is_active:
      type === "EDIT" ? currentReviewCommentData?.is_active?.toString() : 1,
  };

  // // redux state
  const { isLoading } = useSelector((state) => state?.reviewCommentMaster);

  // // local state
  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    formData: "",
  });
  // // function

  const handelAddEditReviewComment = () => {
    if (type === "ADD") {
      dispatch(
        addReviewCommentMasterThunk({
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getReviewCommentMasterListThunk());
          },
          onErrorHandler: () => {
            setOpenConfirmModal({ open: false });
          },
        })
      );
    } else {
      dispatch(
        editReviewCommentMasterThunk({
          currentId: currentReviewCommentData?.id,
          formData: openConfirmModal?.formData,
          onSuccessHandler: () => {
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getReviewCommentMasterListThunk());
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
        title={`${type === "ADD" ? "Add" : "Edit"} Reviewer Comment`}
        width="md"
      >
        <Formik
          initialValues={addEditReviewCommentInitialValue}
          validationSchema={addReviewCommentValidation}
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
                    name="reviewer_comment"
                    label="Reviewer Comment Title"
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
        onSuccess={handelAddEditReviewComment}
        onClose={() => setOpenConfirmModal({ open: false })}
        isLoading={
          isLoading?.addReviewCommentMaster ||
          isLoading?.editReviewCommentMaster
        }
      />
    </>
  );
}

export default ReviewCommentMasterModal;
