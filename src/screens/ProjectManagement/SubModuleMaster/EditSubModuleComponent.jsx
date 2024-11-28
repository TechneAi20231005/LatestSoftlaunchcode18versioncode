import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SubModuleService from '../../../services/ProjectManagementService/SubModuleService';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';

import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Select from 'react-select';
import { getRoles } from '../../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SubModuleMasterValidation } from './Validation/SubModuleMasterValidation';

export default function EditModuleComponent({ match }) {
  const history = useNavigate();

  const dispatch = useDispatch();

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 22)
  );
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const subModuleId = id;

  const [data, setData] = useState(null);

  const [Projectdropdown, setProjectdropdown] = useState(null);

  const [modules, setModules] = useState(null);
  const [modulesDropdown, setModulesDropdown] = useState(null);

  const handleChangevalue = (e) => {
    setModulesDropdown(
      modules &&
        modules
          .filter((d) => d.project_id === e.value)
          .map((d) => ({ value: d.id, label: d.module_name }))
    );
  };
  const initialValue = {
    project_id: data?.project_id ? data?.project_id : '',
    module_id: data?.module_id ? data?.module_id : '',
    sub_module_name: data?.sub_module_name ? data?.sub_module_name : '',
    description: data?.description ? data?.description : '',
    remark: data?.remark ? data?.remark : '',
    is_active: data?.is_active !== undefined ? String(data?.is_active) : '1'
  };
  const loadData = async () => {
    await new SubModuleService()
      .getSubModuleById(subModuleId)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.data;
          if (data) {
            setData(null);
            setData(data);
          }
        } else {
          new ErrorLogService().sendErrorLog(
            'SubModule',
            'Get_SubModule',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'SubModule',
          'Get_SubModule',
          'INSERT',
          errorObject.data.message
        );
      });

    await new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setProjectdropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.project_name }))
          );
        }
      }
    });

    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setModules(res.data.data.filter((d) => d.is_active === 1));
          setModulesDropdown(
            res.data.data &&
              res.data.data
                .filter((d) => d.is_active === 1)
                .map((d) => ({ value: d.id, label: d.module_name }))
          );
        }
      }
    });
    dispatch(getRoles());
  };

  const handleForm = async (values) => {
    const formData = new FormData();
    formData?.append('project_id', values?.project_id);
    formData?.append('module_id', values?.module_id);
    formData?.append('sub_module_name', values?.sub_module_name);

    formData?.append('description', values?.description);
    formData?.append('remark', values?.remark);
    formData?.append('is_active', values?.is_active);
    setNotify(null);

    await new SubModuleService()
      .updateSubModule(subModuleId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/SubModule`
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
            'SubModule',
            'Create_SubModule',
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
          'SubModule',
          'Create_SubModule',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  useState(() => {
    loadData();

    return () => {};
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Sub-Module" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <Formik
              initialValues={initialValue}
              validationSchema={SubModuleMasterValidation}
              onSubmit={(values) => {
                handleForm(values);
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="card mt-2">
                    <div className="card-body">
                      {/* Project Dropdown */}
                      <div className="form-group row mt-2">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Select Project :{' '}
                            <span style={{ color: 'red' }}>*</span>
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            as="select"
                            className="form-control form-control-sm"
                            id="project_id"
                            name="project_id"
                            onChange={(e) => {
                              setFieldValue('project_id', e?.target?.value);
                              setModulesDropdown(
                                modules &&
                                  modules
                                    .filter(
                                      (d) =>
                                        d.project_id ===
                                        parseInt(e.target.value)
                                    )
                                    .map((d) => ({
                                      value: d.id,
                                      label: d.module_name
                                    }))
                              );
                            }} // Call handleChange on selection
                            defaultValue={
                              data &&
                              Projectdropdown?.filter(
                                (d) => d.value === data.project_id
                              )
                            }
                          >
                            <option value="" label="Select a project" />
                            {Projectdropdown?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="project_id"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      {/* Module Name */}
                      <div className="form-group row mt-2">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Select Module :{' '}
                            <span style={{ color: 'red' }}>*</span>
                          </b>
                        </label>

                        <div className="col-sm-4">
                          <Field
                            as="select"
                            className="form-control form-control-sm"
                            id="module_id"
                            name="module_id"
                            defaultValue={
                              data &&
                              modulesDropdown &&
                              modulesDropdown?.filter(
                                (d) => d.value === data.module_id
                              )
                            }
                          >
                            <option value="" label="Select a module" />
                            {modulesDropdown?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="module_id"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="form-group row mt-2">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Sub Module Name :{' '}
                            <span style={{ color: 'red' }}>*</span>
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            id="sub_module_name"
                            name="sub_module_name"
                            onKeyPress={(e) => {
                              Validation.addressFieldOnly(e);
                            }}
                            defaultValue={data.sub_module_name}
                          />
                          <ErrorMessage
                            name="sub_module_name"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      {/* Description */}
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
                            name="description"
                            rows="6"
                            onKeyPress={(e) => {
                              Validation.addressFieldOnly(e);
                            }}
                            defaultValue={data.description}
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      {/* Remark */}
                      <div className="form-group row mt-2">
                        <label htmlFor="" className="col-sm-2 col-form-label">
                          <b>Remark : </b>
                        </label>
                        <div className="col-sm-10">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            name="remark"
                            defaultValue={data.remark}
                          />
                          <ErrorMessage
                            name="remark"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      {/* Status */}
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Status : </b>
                        </label>
                        <div className="col-sm-10">
                          <div className="row">
                            <div className="col-md-2">
                              <label className="form-check-label">
                                <Field
                                  type="radio"
                                  className="form-check-input"
                                  name="is_active"
                                  value="1"
                                />
                                Active
                              </label>
                            </div>
                            <div className="col-md-2">
                              <label className="form-check-label">
                                <Field
                                  type="radio"
                                  className="form-check-input"
                                  name="is_active"
                                  value="0"
                                />
                                Deactive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-3" style={{ textAlign: 'right' }}>
                    {checkRole && checkRole[0].can_update === 1 ? (
                      <button type="submit" className="btn btn-sm btn-primary">
                        Update
                      </button>
                    ) : (
                      ''
                    )}
                    <Link
                      to={`/${_base}/Module`}
                      className="btn btn-sm btn-danger text-white"
                    >
                      Cancel
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>

      {/* <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <form onSubmit={handleForm}>
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Project : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {Projectdropdown && Projectdropdown && (
                        <Select
                          options={Projectdropdown}
                          id="project_id"
                          name="project_id"
                          onChange={handleChangevalue}
                          defaultValue={
                            data &&
                            Projectdropdown.filter(
                              (d) => d.value === data.project_id
                            )
                          }
                          required
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Module : <Astrick color="red" size="13px" />
                      </b>
                    </label>

                    <div className="col-sm-4">
                      {modulesDropdown && (
                        <Select
                          options={modulesDropdown}
                          id="module_id"
                          name="module_id"
                          required
                          defaultValue={
                            data &&
                            modulesDropdown &&
                            modulesDropdown.filter(
                              (d) => d.value === data.module_id
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Sub Module Name : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="sub_module_name"
                        name="sub_module_name"
                        required={true}
                        defaultValue={data.sub_module_name}
                        onKeyPress={(e) => {
                          Validation.CharactersOnly(e);
                        }}
                      />
                    </div>
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
                        required={true}
                        defaultValue={data.description}
                        onKeyPress={(e) => {
                          Validation.CharactersOnly(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>Remark: </b>
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="remark"
                        name="remark"
                        defaultValue={data ? data.remark : null}
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
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              value="1"
                              defaultChecked={
                                data && data.is_active === 1 ? true : false
                              }
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
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_0"
                              value="0"
                              defaultChecked={
                                data && data.is_active === 0 ? true : false
                              }
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
                  to={`/${_base}/SubModule`}
                  className="btn btn-sm btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div> */}
    </div>
  );
}
