import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CustomModal from '../../../components/custom/modal/CustomModal';
import Select from 'react-select';
import { CustomValidation } from '../../../../src/components/custom/CustomValidation/CustomValidation';
const AddMenuForm = ({ onClose, show }) => {
  // const [menu, setMenu] = useState(false);
  const [icon, setIcon] = useState(false);

  const initialValues = {
    menu: '',
    remark: '',
    is_active: '1'
  };

  const handleSubmit = (values) => {
    console.log('Form Submitted with values:', values);
    onClose();
  };

  const fields = [
    {
      name: 'parent_menu',
      label: 'Parent Menu',
      max: 100,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'add_parent_menu',
      label: 'New Parent Menu',
      max: 100,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'child_menu',
      label: 'Child Menu',
      max: 1000,
      required: true,
      alphaNumeric: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 1000,
      required: false,
      alphaNumeric: true
    }
  ];
  const validationSchema = CustomValidation(fields);

  const handleIcon = () => {
    setIcon((prev) => !prev);
  };
  return (
    <CustomModal onClose={onClose} show={show} width="md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold text-primary">
                Add Menu
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row g-3 mt-1">
                {!icon && (
                  <>
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <label
                          htmlFor="parent_menu"
                          className="form-label font-weight-bold"
                        >
                          Parent Menu Name:{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <i
                          onClick={handleIcon}
                          title="Add Parent Menu"
                          className="icofont-plus text-primary fs-5"
                        ></i>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <Select
                        id="parent_menu"
                        name="parent_menu"
                        required={true}
                      />
                      <ErrorMessage
                        name="parent_menu"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label font-weight-bold">
                        Child Menu Name <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        name="child_menu"
                        id="child_menu"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="child_menu"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                  </>
                )}

                {icon && (
                  <div>
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <label
                          htmlFor="add_parent_menu"
                          className="form-label font-weight-bold"
                        >
                          Add Parent Menu Name:{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <i
                          onClick={handleIcon}
                          title="Add Parent Menu"
                          className="icofont-minus text-primary fs-5"
                        ></i>
                      </div>
                    </div>

                    <Field
                      type="text"
                      id="add_parent_menu"
                      name="add_parent_menu"
                      className="form-control"
                      required={true}
                    />
                    <ErrorMessage
                      name="add_parent_menu"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                )}

                {/* Remark */}
                <div className="col-md-12">
                  <label className="form-label font-weight-bold">Remark</label>
                  <Field
                    type="text"
                    name="remark"
                    id="remark"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="remark"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Status */}
                <div className="col-md-12">
                  <label className="form-label font-weight-bold">
                    Status: <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex align-items-center justify-content-start gap-3">
                    <label className="form-check-label ">
                      <Field
                        type="radio"
                        name="is_active"
                        id="is_active_1"
                        value="1"
                        className="form-check-input me-2"
                      />
                      Active
                    </label>
                    <label className="form-check-label">
                      <Field
                        type="radio"
                        name="is_active"
                        id="is_active_0"
                        value="0"
                        className="form-check-input me-2"
                      />
                      Deactive
                    </label>
                  </div>
                  <ErrorMessage
                    name="is_active"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="submit"
                className="btn btn-primary text-white px-4"
                disabled={isSubmitting}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger text-white px-4"
                onClick={onClose}
              >
                Cancel
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default AddMenuForm;
