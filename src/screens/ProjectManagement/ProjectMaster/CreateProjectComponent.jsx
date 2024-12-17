import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';
import CustomerService from '../../../services/MastersService/CustomerService';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Select from 'react-select';

import { useRef } from 'react';
import UserService from '../../../services/MastersService/UserService';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { Formik, Form, Field, ErrorMessage, isObject } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';

export default function CreateProjectComponent({ match }) {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [notify, setNotify] = useState(null);
  const [customer, setCustomer] = useState(null);

  const customerRef = useRef('');
  const fileInputRef = useRef(null);

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 20)
  );
  const handleForm = async (values) => {

    console.log(values,"values")
    const formData = new FormData();
    formData.append('customer_id', values.customer_id);
    formData.append('project_name', values.project_name);
    values?.project_owner.forEach((item) => {
      formData?.append('project_owner[]', item?.value);
    });
    formData.append('logo', values.logo);
    values?.project_reviewer.forEach((item) => {
      formData?.append('project_reviewer[]', item?.value);
    });
    formData.append('description', values.description);
    formData.append('git_url', values.git_url);
    formData.append('api_document_link', values.api_document_link);
    formData.append('remark', values.remark);
    // e.preventDefault();
    // const formData = new FormData(e.target);
    // setNotify(null);
    // var flag = 1;

    // var selectCustomer = formData.getAll('customer_id');
    // var selectOwner = formData.getAll('project_owner[]');
    // if (selectCustomer === '') {
    //   flag = 0;

    //   alert('Please Select Customer');
    //   e.preventDefault();
    // }
    // if (selectOwner === '') {
    //   flag = 0;
    //   alert('Please Select Owner');
    // }

    // e.preventDefault();
    // const image = e.target.logo.value;
    // if (!image) {
    //   setError('image is required');
    //   // return false;
    // } else {
    //   // setError(null)
    // }
    // if (!image.match(/\.(jpg|jpeg|png|gif)$/)) {
    //   setError('select valid image format.');
    //   // return false;
    // } else {
    //   // setError(true)
    //   setError('');
    //   // return true
    // }

    // if (flag === 1) {
      await new ProjectService()
        .postProject(formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              history(
                {
                  pathname: `/${_base}/Project`
                },
                {
                  state: {
                    alert: { type: 'success', message: res.data.message }
                  }
                }
              );
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          } else {
            setNotify({ type: 'danger', message: res.message });
            new ErrorLogService().sendErrorLog(
              'Module',
              'Create_Module',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          if (error.response) {
            const { response } = error;
            const { request, ...errorObject } = response || {};
            setNotify({ type: 'danger', message: errorObject.data.message });
            new ErrorLogService().sendErrorLog(
              'Module',
              'Create_Module',
              'INSERT',
              errorObject.data.message
            );
          } else {
            console.error(
              "Error object does not contain expected 'response' property:",
              error
            );
          }
        });
    // }
  };

  const [ba, setBa] = useState(null);

  const [users, setUsers] = useState(null);

  const loadData = useCallback(async () => {
    await new CustomerService().getCustomer().then((res) => {
      if (res.status === 200) {
        console.log(res?.data?.data);
        if (res.data.status === 1) {
          setCustomer(
            res.data.data?.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.name }))
          );
        }
      }
    });

    dispatch(getRoles());

    await new UserService().getUser().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const user = res.data.data.filter((d) => d.is_active === 1);
          setBa(
            res.data.data
              .filter((d) => d.is_active === 1 && d.account_for === 'SELF')
              .map((d) => ({
                value: d.id,
                label: d.first_name + ' ' + d.last_name
              }))
          );
          user.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });
          setUsers(
            res.data.data
              .filter((d) => d.is_active === 1 && d.account_for === 'SELF')
              .map((d) => ({
                value: d.id,
                label: d.first_name + ' ' + d.last_name
              }))
          );
        }
      }
    });
  }, [dispatch]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file?.size > 2 * 1024 * 1024) {
      // File size exceeds 2MB, notify the user and clear the input field
      alert('File size must be less than 2MB.');
      event.target.value = null; // Clear the input field
    }
  }

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  const [error, setError] = useState(false);

  const initialValues = {
    customer_id: '',
    project_name: '',
    project_owner: [],
    logo: null,
    project_reviewer: [],
    description: '',
    git_url: '',
    api_document_link: '',
    remark: ''
  };
  const fields = [
    { name: 'customer_id', label: 'Customer Name', required: true },
    { name: 'project_name', label: 'Project Name', required: true, alphaNumeric: true, max: 100  },
    { name: 'project_owner', label: 'Project owner', isObject: true },
    { name: 'description', label: 'Description', required: true, alphaNumeric: true, max: 1000 },
    { name: 'git_url', label: 'git_url', required: false, alphaNumeric: true, max: 500 },
    { name: 'api_document_link', label: 'api_document_link', required: false, alphaNumeric: true, max: 500 },
    { name: 'remark', label: 'remark', required: false, alphaNumeric: true, max: 1000 },
    // { name: 'logo', label: 'logo', required: false }
  ];
  const validationSchema = CustomValidation(fields);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Create Project" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleForm(values)
            }}
          >
            {({ setFieldValue, values }) => (
              <Form>
                {/* <form onSubmit={handleForm}> */}
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Customer : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Select
                          options={customer}
                          // required
                          id="customer_id"
                          name="customer_id"
                          onChange={(option) =>
                            setFieldValue('customer_id', option?.value)
                          }
                          // ref={customerRef}
                          // onBlur={handleFocus}
                        />
                        <ErrorMessage
                          name="customer_id"
                          component="small"
                          className="text-danger"
                        />
                      </div>

                      <label
                        className="col-sm-2 col-form-label"
                        style={{ textAlign: 'right' }}
                      >
                        <b>
                          Project Name : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="project_name"
                          name="project_name"
                          // required={true}
                          // onKeyPress={(e) => {
                          //   Validation.addressFieldOnly(e);
                          // }}
                        />
                        <ErrorMessage
                          name="project_name"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Owner : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-4">
                        {users && (
                          <Field
                          component={Select}
                            options={users}
                            id="project_owner"
                            name="project_owner"

                            onChange={(options) => {
                              console.log(options, 'options');
                              setFieldValue('project_owner', options);
                            }}
                            // condition="CUSTOMER"
                            // required={true}
                            isMulti
                          />
                        )}
                        <ErrorMessage
                          name="project_owner"
                          component="small"
                          className="text-danger"
                        />
                      </div>

                      <label
                        className="col-sm-2 col-form-label"
                        style={{ textAlign: 'right' }}
                      >
                        <b>Project Logo : </b>
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          id="logo"
                          name="logo"
                          accept=".png, .jpeg, .jpg" // Accept only specific image file formats
                          //  accept="image/*"
                          ref={fileInputRef}
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file?.size > 2 * 1024 * 1024) {
                              // File size exceeds 2MB, notify the user and clear the input field
                              alert('File size must be less than 2MB.');
                              event.target.value = null; // Clear the input field

                            }
                            setFieldValue('logo', event?.target?.files[0])
                          }}
                          // onChange={handleFileChange}
                        />
                        <small style={{ color: '#2167d2' }}>
                          Please upload only .png/.jpeg/.jpg image format
                        </small>
                        {/* {error && error ? (
                          <p style={{ color: 'red' }} className="text-error">
                            {error}
                          </p>
                        ) : (
                          ''
                        )} */}
                      </div>
                    </div>

                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>Reviewer : </b>
                      </label>
                      {ba && (
                        <div className="col-sm-4">
                          <Field
                          component={Select}
                            id="project_reviewer"
                            name="project_reviewer"
                            options={ba}
                            onChange={(options) => {
                              console.log(options, 'options');
                              setFieldValue('project_reviewer', options);
                            }}
                            isMulti
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group row mt-2">
                      <label htmlFor="" className="col-sm-2 col-form-label">
                        <b>
                          Description : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-10">
                        <Field
                         as="textarea"
                          className="form-control form-control-sm"
                          id="description"
                          name="description"
                          rows="6"
                          // required={true}
                          // onKeyPress={(e) => {
                          //   Validation.addressFieldOnly(e);
                          // }}
                        />
                           <ErrorMessage
                          name="description"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>GIT Project URL : </b>
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="git_url"
                          name="git_url"
                        />
                          <ErrorMessage
                          name="git_url"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>API Document Link : </b>
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="api_document_link"
                          name="api_document_link"
                        />
                          <ErrorMessage
                          name="api_document_link"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Remark: </b>
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="remark"
                          name="remark"
                        />
                           <ErrorMessage
                          name="remark"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>{' '}
                  {/* CARD BODY */}
                </div>
                {/* CARD */}

                <div className="mt-3" style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-sm btn-primary">
                    Submit
                  </button>
                  <Link
                    to={`/${_base}/Project`}
                    className="btn btn-sm btn-danger text-white"
                  >
                    Cancel
                  </Link>
                </div>
                {/* </form> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
