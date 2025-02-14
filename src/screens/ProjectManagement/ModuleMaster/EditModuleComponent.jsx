import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import ErrorLogService from '../../../services/ErrorLogService';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';
import { ProjectDropdown } from '../ProjectMaster/ProjectComponent';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import { _base } from '../../../settings/constants';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { moduleMasterValidation } from './validation/ModuleMaster';

export default function EditModuleComponent({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const moduleId = id;

  const [data, setData] = useState(null);
  const initialValue = {
    project_id: data?.project_id ? data?.project_id : '',
    module_name: data?.module_name ? data?.module_name : '',
    description: data?.description ? data?.description : '',
    remark: data?.remark ? data?.remark : '',
    is_active: data?.is_active !== undefined ? String(data?.is_active) : '1'
  };

  const roleId = localStorage.getItem('role_id');
  const [checkRole, setCheckRole] = useState(null);

  const loadData = useCallback(async () => {
    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const getRoleId = sessionStorage.getItem('role_id');
          setCheckRole(res.data.data.filter((d) => d.menu_id === 21));
        }
      }
    });
    await new ModuleService()
      .getModuleById(moduleId)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.data;
          if (data) {
            setData(null);
            setData(data);
          }
        } else {
          new ErrorLogService().sendErrorLog(
            'Module',
            'Get_Module',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Module',
          'Get_Module',
          'INSERT',
          errorObject.data.message
        );
      });
  }, [moduleId, roleId]);

  const handleForm = async (values) => {
    console.log(values, 'formData');
    const formData = new FormData();
    formData.append('project_id', values.project_id);
    formData.append('module_name', values.module_name);
    formData.append('description', values.description);
    formData.append('remark', values.remark);
    formData.append('is_active', values.is_active);
    // return false
    // e.preventDefault();
    // const formData = new FormData(e.target);
    setNotify(null);

    await new ModuleService()
      .updateModule(moduleId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
                setTimeout(() => {
                          history({pathname:`/${_base}/Module`})
                        }, 500);
                        setNotify({ type: 'success', message: res.data.message });
            // history(
            //   {
            //     pathname: `/${_base}/Module`
            //   },
            //   {
            //     state: { alert: { type: 'success', message: res.data.message } }
            //   }
            // );
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.message });
          new ErrorLogService().sendErrorLog(
            'Module',
            'Edit_Module',
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
          'Module',
          'Edit_Module',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Module" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <Formik
              initialValues={initialValue}
              validationSchema={moduleMasterValidation}
              onSubmit={(values) => {
                handleForm(values);
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="card mt-2">
                    <div className="card-body">
                      {/* Project Dropdown */}
                      <div className="form-group row mt-2">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Select Project : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field name="project_id">
                            {({ field, form }) => (
                              <ProjectDropdown
                                field={field}
                                form={form}
                                id="project_id"
                                defaultValue={data?.project_id}
                              />
                            )}
                          </Field>
                        </div>
                      </div>

                      {/* Module Name */}
                      <div className="form-group row mt-2">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Module Name : <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          <Field
                            type="text"
                            className="form-control form-control-sm"
                            name="module_name"
                            onKeyPress={(e) => {
                              Validation.addressFieldOnly(e);
                            }}
                          />
                          <ErrorMessage
                            name="module_name"
                            component="small"
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
                          />
                          <ErrorMessage
                            name="description"
                            component="small"
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
                          />
                          <ErrorMessage
                            name="remark"
                            component="small"
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
    </div>
  );
}
