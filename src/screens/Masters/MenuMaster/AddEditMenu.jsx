import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CustomModal from '../../../components/custom/modal/CustomModal';
import Select from 'react-select';
import { CustomValidation } from '../../../../src/components/custom/CustomValidation/CustomValidation';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMenuMasterList,
  editMenuMasterList,
  getMenuMasterListById
} from '../../../redux/services/menuMaster';
import { getMenuMasterList } from '../../../redux/services/menuMaster';
const AddMenuForm = ({ onClose, show, data, optionData }) => {
  const [icon, setIcon] = useState(false);
  const dispatch = useDispatch();
  let obj = {
    label: data?.value?.parent_name,
    value: data?.value?.id || 0

  };

  const initialValues = {
    parent_id: data?.case === 'Edit' ? obj?.value : '',
    add_parent_menu: '',
    name:  data?.case === 'Edit' ? data?.value?.name :   '',
    remark: data?.value?.remark || '',
    is_active:
    data?.value?.is_active !== undefined
        ? String(data?.value?.is_active)
        : '1'
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('parent_id', values?.parent_id);
    // formData.append('add_parent_menu', values?.add_parent_menu);
    formData.append('name', values?.name);
    formData.append('remark', values?.remark);
    formData.append('is_active', values?.is_active);
    formData.append('iconClass', 'icofont-dotted-right text-white');

    let icondata = null;
    if (icon) {
      icondata = new FormData();
      icondata.append('parent_id', values?.parent_id);
      icondata.append('name', values?.add_parent_menu);
      icondata.append('remark', values?.remark);
      icondata.append('is_active', values?.is_active);
      icondata.append('iconClass', 'icofont-dotted-right text-white');
    }

    // const icondata = new FormData();
    // formData.append('parent_id', values?.parent_id);
    // formData.append('name', values?.add_parent_menu);
    // formData.append('remark', values?.remark);
    // formData.append('is_active', values?.is_active);
    // formData.append('iconClass', 'icofont-dotted-right text-white');

    if (data?.case === 'Add') {
      dispatch(
        addMenuMasterList({
          formData: icon ? icondata : formData,
          onSuccessHandler: () => {
            dispatch(getMenuMasterList());
            // setIcon(false);
            onClose();
          },
          onErrorHandler: () => {}
        })
      );
    } else {
      dispatch(
        editMenuMasterList({
          currentId: data?.value?.id,
          formData: formData,
          onSuccessHandler: () => {
            dispatch(getMenuMasterList());
            // setIcon(false);
            onClose();
          },
          onErrorHandler: () => {}
        })
      );
    }
    console.log('Form Submitted with values:', values);
  };

  const fields = [
    {
      name: 'parent_id',
      label: 'Parent Menu',
      required: !icon
    },
    {
      name: 'add_parent_menu',
      label: 'New Parent Menu',
      max: 100,
      required: icon,
      alphaNumeric: icon
    },
    {
      name: 'name',
      label: 'Child Menu',
      max: 1000,
      required: !icon,
      alphaNumeric: !icon
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

  const handleIcon = (resetForm) => {
    resetForm();
    setIcon((prev) => !prev);
  };

  useEffect(() => {
    setIcon(false);
  }, [onClose]);
  return (
    <CustomModal onClose={onClose} show={show} width="md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, resetForm }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold text-primary">
                {data?.case} Menu
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
                          onClick={() => handleIcon(resetForm)}
                          title="Add Parent Menu"
                          className="icofont-plus text-primary fs-5"
                        ></i>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <Field
                        component={Select}
                        id="parent_id"
                        name="parent_id"
                        options={optionData}
                        onChange={(options) =>
                          setFieldValue('parent_id', options?.value)
                        }
                        defaultValue={data?.case === 'Edit' ? obj : ''}

                        // required={true}
                      />
                      <ErrorMessage
                        name="parent_id"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label font-weight-bold">
                        Child Menu Name <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="name"
                        component="small"
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
                          onClick={() => handleIcon(resetForm)}
                          title="Add Child Menu"
                          className="icofont-minus text-primary fs-5"
                        ></i>
                      </div>
                    </div>

                    <Field
                      type="text"
                      id="add_parent_menu"
                      name="add_parent_menu"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="add_parent_menu"
                      component="small"
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
                    component="small"
                    className="text-danger small"
                  />
                </div>

                {/* Status */}
                {data?.case === 'Edit' && (
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
                      component="small"
                      className="text-danger small"
                    />
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button type="submit" className="btn btn-primary text-white px-4">
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
