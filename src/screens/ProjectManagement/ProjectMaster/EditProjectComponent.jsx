import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';
import CustomerService from '../../../services/MastersService/CustomerService';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Select from 'react-select';

import UserService from '../../../services/MastersService/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { Formik, Form, Field, ErrorMessage, isObject } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import Spinner from 'react-bootstrap/Spinner';

export default function EditProjectComponent({ match }) {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const projectId = id;

  const [data, setData] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [ba, setBa] = useState(null);

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 20)
  );

  const [users, setUsers] = useState(null);
  // const [projectOwners, setProjectOwners] = useState(null);

  const loadData = useCallback(async () => {
    await new CustomerService().getCustomer().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setCustomer(
            res.data.data?.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.name }))
          );
        }
      }
    });

    await new UserService().getUser().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const user = res.data.data.filter((d) => d.is_active === 1);
          const reviewers = res.data.data.filter(
            (d) => d.is_active === 1 && d.account_for === 'SELF'
          );

          user.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });
          setUsers(
            user.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + '(' + d.id + ')'
            }))
          );
          setBa(
            reviewers.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + '(' + d.id + ')'
            }))
          );
        }
      }
    });
    await new ProjectService()
      .getProjectById(projectId)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.data;

          if (data) {
            if (data) {
              setData(null);
              setData(data);
            }
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          const { response } = error;
          const { request, ...errorObject } = response;

          // Continue handling the error as needed
          setNotify({ type: 'danger', message: errorObject.data.message });
          new ErrorLogService().sendErrorLog(
            'Project',
            'Edit_Project',
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

    dispatch(getRoles());
  }, [dispatch, projectId]);

  const handleForm = async (values) => {
    const formData = new FormData();
    formData.append('customer_id', values.customer_id);
    formData.append('project_name', values.project_name);
    values?.project_owner.forEach((item) => {
      formData?.append('project_owner[]', item?.value);
    });
    formData.append('logo', values.logo);
    if (values?.project_reviewer?.length > 0) {
      values.project_reviewer.forEach((item) => {
        formData.append('project_reviewer[]', item?.value);
      });
    } else {
      // Explicitly append an empty array for project_reviewer
      formData.append('project_reviewer[]', "");
    }
    // values?.project_reviewer.forEach((item) => {
    //   formData?.append('project_reviewer[]', item?.value);
    // });
    formData.append('description', values.description);
    formData.append('git_url', values.git_url);
    formData.append('api_document_link', values.api_document_link);
    formData.append('remark', values.remark);
    // e.preventDefault();
    // const formData = new FormData(e.target);

    await new ProjectService()
      .updateProject(projectId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/Project`
              },
              {
                state: { alert: { type: 'success', message: res.data.message } }
              }
            );
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.message });
          new ErrorLogService().sendErrorLog(
            'Project',
            'Edit_Project',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: 'danger', message: errorObject.data.message });
        new ErrorLogService().sendErrorLog(
          'Project',
          'Edit_Project',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  const handleShowLogo = (e) => {
    var URL =
      'http://3.108.206.34/TSNewBackend/storage/app/Attachment/project/' +
      data.logo;
    window.open(URL, '_blank');
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  let customerId = data
    ? customer.find((d) => d.value === data.customer_id)
    : '';
    let projectReviewer =  data?.reviewers.map((d) => ({
      value: d.user_id,
      label: d.first_name + ' ' + d.last_name
    }))

  const initialValues = {
    customer_id: customerId?.value || '',
    project_name: data?.project_name || '',
    project_owner: [],
    logo: null,
    project_reviewer: projectReviewer || [],
    description: data?.description || '',
    git_url: data?.git_url || '',
    api_document_link: data?.api_document_link || '',
    remark: data?.remark || '',
    is_active:
    data?.is_active !== undefined
      ? String(data?.is_active)
      : '1'
  };
  const fields = [
    { name: 'customer_id', label: 'Customer Name', required: true },
    { name: 'project_name', label: 'Project Name', required: true, alphaNumeric: true, max: 100  },
    { name: 'project_owner', label: 'Project owner', isObject: true },
    {
      name: 'description',
      label: 'Description',
      required: true,
      alphaNumeric: true,
      max: 1000
    },
    { name: 'git_url', label: 'git_url', required: false, alphaNumeric: true, max: 500 },
    { name: 'api_document_link', label: 'api_document_link', required: false, alphaNumeric: true, max: 500 },
    { name: 'remark', label: 'remark', required: false, alphaNumeric: true, max: 1000 },
    // { name: 'logo', label: 'logo', required: false }
  ];
  const validationSchema = CustomValidation(fields);
  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Project" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data ? (
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
                            Select Customer :{' '}
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Select
                            id="customer_id"
                            name="customer_id"
                            required={true}
                            options={customer}
                            defaultValue={
                              data
                                ? customer.filter(
                                    (d) => d.value === data.customer_id
                                  )
                                : ''
                            }
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
                            defaultValue={data ? data.project_name : null}
                            required={true}
                            onKeyPress={(e) => {
                              Validation.addressFieldOnly(e);
                            }}
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
                            <Select
                              options={users}
                              id="project_owner"
                              name="project_owner"
                              isMulti={true}
                              onChange={(options) => {
                                setFieldValue('project_owner', options);
                              }}
                              // required={true}
                              // defaultValue={data.projectOwners.map((d) => ({
                              //   value: d.user_id,
                              //   label: d.employee_name
                              // }))}
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
                            accept="image/*"
                            onChange={(event) => setFieldValue('logo', event?.target?.files[0])}
                          />
                          <p>{data.logo}</p>
                          {data && data.logo !=="null" && (
                            <i
                            title='Click to view logo'
                              onClick={handleShowLogo}
                              className="icofont-eye-alt"
                              style={{
                                position: 'absolute',
                                right: '2rem',
                                top: '4.8rem',
                                fontSize: '20px',
                                cursor: 'pointer'
                              }}
                            >
                              {/* <span
                                style={{ fontStyle: 'italic', color: 'blue' }}
                              >
                                Click to view logo
                              </span> */}
                            </i>
                          )}
                        </div>
                      </div>
                      <div className="form-group row mt-2">
                        <label className="col-sm-2 col-form-label">
                          <b>Reviewer: </b>
                        </label>
                        {ba && (
                          <div className="col-sm-4">
                            <Select
                              id="project_reviewer"
                              name="project_reviewer"
                              options={ba}
                              isMulti={true}
                              // value={values.project_reviewer}
                              onChange={(options) => {
                                setFieldValue('project_reviewer', options);
                              }}
                              defaultValue={data?.reviewers.map((d) => ({
                                value: d.user_id,
                                label: d.first_name + ' ' + d.last_name
                              }))}
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
                          <textarea
                            className="form-control form-control-sm"
                            id="description"
                            name="description"
                            rows="6"
                            defaultValue={data ? data.description : null}
                            required={true}
                            onKeyPress={(e) => {
                              Validation.addressFieldOnly(e);
                            }}
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
                            // defaultValue={data ? data.git_url : null}
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
                            // defaultValue={data ? data.api_document_link : null}
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
                            // defaultValue={data ? data.remark : null}
                          />
                            <ErrorMessage
                            name="remark"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Status : </b>
                        </label>
                        <div className="col-sm-10">
                          <div className="row">
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_1"
                                  value="1"
                                  // defaultChecked={
                                  //   data && data.is_active === 1 ? true : false
                                  // }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="is_active_1"
                                >
                                  Active
                                </label>
                              </div>
                            </div>
                            <div className="col-md-1">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_0"
                                  value="0"
                                  // defaultChecked={
                                  //   data && data.is_active === 0 ? true : false
                                  // }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="is_active_0"
                                >
                                  Deactive
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{' '}
                  </div>

                  <div className="mt-3" style={{ textAlign: 'right' }}>
                    {checkRole && checkRole[0]?.can_update === 1 ? (
                      <button type="submit" className="btn btn-sm btn-primary">
                        Update
                      </button>
                    ) : (
                      ''
                    )}
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
          ) :    <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional overlay
          }}
        >
          <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="info" />
        </div>}
        </div>
      </div>
    </div>
  );
}
