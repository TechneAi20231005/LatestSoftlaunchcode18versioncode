import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addReviewCommentValidation } from './AddReviewComment';
import CustomModal from '../../../../components/custom/modal/CustomModal';
import {
  CustomInput,
  CustomRadioButton
} from '../../../../components/custom/inputs/CustomInputs';
import {
  addReviewCommentMasterThunk,
  editReviewCommentMasterThunk,
  getReviewCommentMasterListThunk
} from '../../../../redux/services/testCases/reviewCommentMaster';
import { RenderIf } from '../../../../utils';
import { CustomValidation } from '../../../../components/custom/CustomValidation/CustomValidation';

function AddEditReviewCommentMaster({
  show,
  close,
  type,
  currentReviewCommentData
}) {
  const dispatch = useDispatch();
  const addEditReviewCommentInitialValue = {
    reviewer_comment:
      type === 'EDIT' ? currentReviewCommentData?.reviewer_comment : '',
    remark: type === 'EDIT' ? currentReviewCommentData?.remark || '' : '',
    is_active:
      type === 'EDIT' ? currentReviewCommentData?.is_active?.toString() : 1
  };

  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    formData: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handelAddEditReviewComment = ({ formData }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (type === 'ADD') {
      dispatch(
        addReviewCommentMasterThunk({
          formData: formData,
          onSuccessHandler: () => {
            setIsSubmitting(false);
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getReviewCommentMasterListThunk());
          },
          onErrorHandler: () => {
            setIsSubmitting(false);
            setOpenConfirmModal({ open: false });
          }
        })
      );
    } else {
      dispatch(
        editReviewCommentMasterThunk({
          currentId: currentReviewCommentData?.id,
          formData: formData,
          onSuccessHandler: () => {
            setIsSubmitting(false);
            setOpenConfirmModal({ open: false });
            close();
            dispatch(getReviewCommentMasterListThunk());
          },
          onErrorHandler: () => {
            setIsSubmitting(false);
            setOpenConfirmModal({ open: false });
          }
        })
      );
    }
  };
  const fields = [
    {
      name: 'reviewer_comment',
      label: 'Reviewer Comment Title',
      min: 3,
      max: 100,
      required: true,
      alphaBet: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 255
    }
  ];

  const validationSchema = CustomValidation(fields);

  return (
    <>
      <CustomModal
        show={show}
        title={`${type === 'ADD' ? 'Add' : 'Edit'} Reviewer Comment`}
        width="md"
      >
        <Formik
          initialValues={addEditReviewCommentInitialValue}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handelAddEditReviewComment({ formData: values });
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
                    id="reviewcommentmaster_reviewercommenttitle"
                    placeholder="Enter Reviewer Comment Title"
                    requiredField
                  />
                </Col>
                <Col sm={12}>
                  <Field
                    component={CustomInput}
                    name="remark"
                    label="Remark"
                    id="reviewcommentmaster_remark"
                    placeholder="Enter Remark"
                  />
                </Col>

                <RenderIf render={type === 'EDIT'}>
                  <div className="d-flex align-items-center mt-3">
                    <p className="mb-2 pe-2">
                      Status<span className="mendatory_sign">*</span> :
                    </p>
                    <Field
                      component={CustomRadioButton}
                      type="radio"
                      name="is_active"
                      label="Active"
                      id="reviewcommentmaster_active"
                      value="1"
                      inputClassName="me-1"
                    />
                    <Field
                      component={CustomRadioButton}
                      type="radio"
                      name="is_active"
                      label="Deactive"
                      id="reviewcommentmaster_deactive"
                      value="0"
                      inputClassName="me-1"
                    />
                  </div>
                </RenderIf>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-primary px-4"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {type === 'ADD' ? 'Submit' : 'Update'}
                </button>
                <button
                  onClick={() => close()}
                  className="btn btn-danger px-3"
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

export default AddEditReviewCommentMaster;
